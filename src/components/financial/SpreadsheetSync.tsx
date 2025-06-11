
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, RefreshCw, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { transactionService } from "@/services/transactions";
import * as XLSX from 'xlsx';

interface SpreadsheetRow {
  data: string;
  descricao: string;
  categoria: string;
  tipo: string;
  valor: number;
  status: string;
  metodo: string;
  canal?: string;
  cliente?: string;
}

export const SpreadsheetSync = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncResults, setSyncResults] = useState<{
    success: number;
    errors: number;
    total: number;
    duplicates: number;
    validationErrors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.toLowerCase();
      if (fileExtension.endsWith('.csv') || fileExtension.endsWith('.xlsx') || fileExtension.endsWith('.xls')) {
        setFile(selectedFile);
        setSyncResults(null);
        console.log('Arquivo selecionado:', selectedFile.name, 'Tipo:', selectedFile.type);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo CSV ou Excel (.xlsx/.xls).",
          variant: "destructive",
        });
      }
    }
  };

  const parseCSV = (csv: string): SpreadsheetRow[] => {
    try {
      const lines = csv.split('\n').filter(line => line.trim());
      if (lines.length === 0) return [];

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      console.log('Cabeçalhos CSV detectados:', headers);
      
      const validRows: SpreadsheetRow[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          const row = parseRowData(headers, values, i);
          
          if (row && isValidRow(row)) {
            validRows.push(row);
          }
        } catch (error) {
          console.error(`Erro ao processar linha CSV ${i + 1}:`, error);
        }
      }
      
      return validRows;
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      throw new Error('Erro ao processar arquivo CSV');
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const parseExcel = (file: File): Promise<SpreadsheetRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            resolve([]);
            return;
          }

          const headers = (jsonData[0] as any[]).map(h => 
            h?.toString().toLowerCase().trim().replace(/['"]/g, '') || ''
          );
          console.log('Cabeçalhos Excel detectados:', headers);
          
          const validRows: SpreadsheetRow[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            try {
              const row = jsonData[i] as any[];
              const values = headers.map((_, colIndex) => 
                row[colIndex]?.toString().trim() || ''
              );
              const parsedRow = parseRowData(headers, values, i);
              
              if (parsedRow && isValidRow(parsedRow)) {
                validRows.push(parsedRow);
              }
            } catch (error) {
              console.error(`Erro ao processar linha Excel ${i + 1}:`, error);
            }
          }

          resolve(validRows);
        } catch (error) {
          console.error('Erro ao processar arquivo Excel:', error);
          reject(new Error('Erro ao processar arquivo Excel'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseRowData = (headers: string[], values: string[], index: number): SpreadsheetRow | null => {
    try {
      const row: any = {};
      
      headers.forEach((header, colIndex) => {
        const value = values[colIndex] || '';
        
        // Mapeamento melhorado e mais flexível de colunas
        if (header.includes('data') || header.includes('date') || header.includes('vencimento')) {
          row.data = value;
        } else if (header.includes('descrição') || header.includes('descricao') || 
                   header.includes('description') || header.includes('nome') ||
                   header.includes('titulo') || header.includes('title')) {
          row.descricao = value;
        } else if (header.includes('categoria') || header.includes('category')) {
          row.categoria = value;
        } else if (header.includes('tipo') || header.includes('type')) {
          row.tipo = value.toLowerCase();
        } else if (header.includes('valor') || header.includes('value') || 
                   header.includes('amount') || header.includes('entrada') || 
                   header.includes('saida') || header.includes('preco') ||
                   header.includes('price')) {
          // Para colunas de entrada/saída, determinar o tipo
          if (header.includes('entrada')) {
            row.tipo = 'receita';
          } else if (header.includes('saida')) {
            row.tipo = 'despesa';
          }
          const cleanValue = value.replace(/[^\d.,-]/g, '').replace(',', '.');
          const numValue = parseFloat(cleanValue) || 0;
          if (numValue > 0) {
            row.valor = numValue;
          }
        } else if (header.includes('status')) {
          row.status = value.toLowerCase();
        } else if (header.includes('método') || header.includes('metodo') || 
                   header.includes('method') || header.includes('pagamento')) {
          row.metodo = value;
        } else if (header.includes('canal') || header.includes('channel')) {
          row.canal = value;
        } else if (header.includes('cliente') || header.includes('client')) {
          row.cliente = value;
        }
      });
      
      return row;
    } catch (error) {
      console.error(`Erro ao parsear linha ${index}:`, error);
      return null;
    }
  };

  const isValidRow = (row: any): boolean => {
    // Validações mais rigorosas
    if (!row.descricao || row.descricao.trim().length < 2) {
      return false;
    }
    
    if (!row.valor || isNaN(row.valor) || row.valor <= 0) {
      return false;
    }
    
    // Validar se a data é válida antes de aceitar a linha
    if (row.data && !isValidDate(row.data)) {
      console.warn(`Data inválida encontrada: ${row.data}`);
      return false;
    }
    
    // Se não tiver tipo definido, tentar inferir
    if (!row.tipo) {
      row.tipo = 'receita'; // Default
    }
    
    // Se não tiver categoria, usar default
    if (!row.categoria) {
      row.categoria = 'Importado';
    }
    
    // Se não tiver status, usar default
    if (!row.status) {
      row.status = 'pendente';
    }
    
    return true;
  };

  const isValidDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    
    try {
      const parsedDate = parseDate(dateStr);
      const date = new Date(parsedDate);
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return false;
      }
      
      // Verificar se a data está em um range razoável (1900-2100)
      const year = date.getFullYear();
      if (year < 1900 || year > 2100) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkDuplicate = async (transactionData: any): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('id')
        .eq('title', transactionData.title)
        .eq('amount', transactionData.amount)
        .eq('date', transactionData.date)
        .limit(1);

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar duplicata:', error);
      return false;
    }
  };

  const syncToDatabase = async (data: SpreadsheetRow[]) => {
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    const total = data.length;
    const validationErrors: string[] = [];

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    console.log(`Iniciando sincronização de ${total} registros válidos`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        // Converter data para formato ISO com validação rigorosa
        let dateISO = new Date().toISOString().split('T')[0];
        if (row.data) {
          try {
            dateISO = parseDate(row.data);
            // Validar novamente se a data está no formato correto
            if (!isValidDate(row.data)) {
              validationErrors.push(`Linha ${i + 1}: Data inválida "${row.data}"`);
              errorCount++;
              continue;
            }
          } catch (error) {
            validationErrors.push(`Linha ${i + 1}: Erro ao processar data "${row.data}"`);
            errorCount++;
            continue;
          }
        }

        // Mapear tipo de transação com validação
        let transactionType: 'receita' | 'despesa' = 'receita';
        if (row.tipo.includes('saida') || row.tipo.includes('despesa') || 
            row.tipo.includes('expense') || row.valor < 0) {
          transactionType = 'despesa';
        }

        // Mapear status com validação
        let status: 'pendente' | 'pago' | 'vencido' = 'pendente';
        if (row.status.includes('pago') || row.status.includes('recebido') || 
            row.status.includes('paid') || row.status.includes('received')) {
          status = 'pago';
        } else if (row.status.includes('vencido') || row.status.includes('atrasado') || 
                   row.status.includes('overdue')) {
          status = 'vencido';
        }

        // Validar valor
        const amount = Math.abs(row.valor);
        if (amount <= 0 || isNaN(amount)) {
          validationErrors.push(`Linha ${i + 1}: Valor inválido "${row.valor}"`);
          errorCount++;
          continue;
        }

        const transactionData = {
          type: transactionType,
          title: row.descricao,
          amount: amount,
          category: row.categoria || 'Importado',
          date: dateISO,
          status: status,
          payment_method: row.metodo || '',
          description: `Importado da planilha - ${row.descricao}`,
          channel: row.canal || '',
          client_name: row.cliente || '',
          user_id: user.id
        };

        // Verificar duplicata
        const isDuplicate = await checkDuplicate(transactionData);
        
        if (isDuplicate) {
          duplicateCount++;
          console.log(`Duplicata ignorada: ${row.descricao}`);
        } else {
          await transactionService.createTransaction(transactionData);
          successCount++;
          console.log(`Transação criada: ${row.descricao} - R$ ${row.valor}`);
        }
      } catch (error) {
        console.error('Erro ao sincronizar linha:', error);
        validationErrors.push(`Linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        errorCount++;
      }
    }

    setProgress(100);
    console.log(`Sincronização concluída: ${successCount} sucessos, ${errorCount} erros, ${duplicateCount} duplicatas`);
    return { success: successCount, errors: errorCount, total, duplicates: duplicateCount, validationErrors };
  };

  const parseDate = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === '') return new Date().toISOString().split('T')[0];
    
    try {
      // Remover caracteres especiais e espaços
      const cleanDateStr = dateStr.trim().replace(/[^\d\/\-]/g, '');
      
      // Formatos aceitos: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy
      if (cleanDateStr.includes('/')) {
        const parts = cleanDateStr.split('/');
        if (parts.length === 3) {
          let day, month, year;
          
          // Determinar se é dd/mm/yyyy ou mm/dd/yyyy
          if (parts[2].length === 4) {
            // dd/mm/yyyy ou mm/dd/yyyy
            day = parts[0].padStart(2, '0');
            month = parts[1].padStart(2, '0');
            year = parts[2];
          } else if (parts[0].length === 4) {
            // yyyy/mm/dd
            year = parts[0];
            month = parts[1].padStart(2, '0');
            day = parts[2].padStart(2, '0');
          } else {
            throw new Error('Formato de data não reconhecido');
          }
          
          // Validar ano
          const yearNum = parseInt(year);
          if (yearNum < 1900 || yearNum > 2100) {
            throw new Error('Ano fora do range válido (1900-2100)');
          }
          
          return `${year}-${month}-${day}`;
        }
      } else if (cleanDateStr.includes('-')) {
        const parts = cleanDateStr.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // yyyy-mm-dd (formato ISO)
            const year = parseInt(parts[0]);
            if (year < 1900 || year > 2100) {
              throw new Error('Ano fora do range válido (1900-2100)');
            }
            return cleanDateStr;
          } else {
            // dd-mm-yyyy
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            const yearNum = parseInt(year);
            if (yearNum < 1900 || yearNum > 2100) {
              throw new Error('Ano fora do range válido (1900-2100)');
            }
            return `${year}-${month}-${day}`;
          }
        }
      }
      
      // Tentar parseamento direto como último recurso
      const date = new Date(cleanDateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        if (year >= 1900 && year <= 2100) {
          return date.toISOString().split('T')[0];
        }
      }
      
      throw new Error('Formato de data não reconhecido');
    } catch (error) {
      console.error('Erro ao parsear data:', dateStr, error);
      throw new Error(`Data inválida: ${dateStr}`);
    }
  };

  const handleSync = async () => {
    if (!file) {
      toast({
        title: "Arquivo necessário",
        description: "Por favor, selecione um arquivo CSV ou Excel primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      let data: SpreadsheetRow[];
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        console.log('Processando arquivo CSV, tamanho:', text.length);
        data = parseCSV(text);
      } else {
        console.log('Processando arquivo Excel:', file.name);
        data = await parseExcel(file);
      }
      
      if (data.length === 0) {
        toast({
          title: "Nenhum dado válido encontrado",
          description: "Verifique se o arquivo contém dados válidos com as colunas necessárias (descrição, valor, data válida, etc.).",
          variant: "destructive",
        });
        return;
      }

      console.log(`Iniciando sincronização de ${data.length} registros válidos`);
      const results = await syncToDatabase(data);
      setSyncResults(results);

      if (results.validationErrors.length > 0) {
        console.log('Erros de validação encontrados:', results.validationErrors);
      }

      toast({
        title: "Sincronização concluída",
        description: `${results.success} registros importados, ${results.errors} erros, ${results.duplicates} duplicatas ignoradas.`,
      });
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar o arquivo. Verifique o formato e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      "data,descricao,categoria,tipo,valor,status,metodo,canal,cliente",
      "02/01/2024,Venda Produto,Receita,receita,1500.00,pago,PIX,site,Cliente ABC",
      "05/01/2024,Fornecedor XYZ,Despesa Operacional,despesa,500.00,pago,Boleto,comercial,Fornecedor XYZ",
      "10/01/2024,Comissão Vendas,Receita,receita,300.00,pendente,Transferência,mercadoLivre,",
      "15/01/2024,Energia Elétrica,Despesa Fixa,despesa,450.00,pago,Débito Automático,comercial,"
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_financeiro_winnet.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Modelo baixado",
      description: "Arquivo modelo CSV foi baixado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Sincronização de Planilha Financeira
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Importe dados da sua planilha financeira para sincronizar com o CRM. 
              Aceita arquivos CSV e Excel (.xlsx/.xls). Detecta automaticamente colunas como: data, descrição, valor, entrada/saída, categoria, status, método de pagamento.
              <strong> Datas devem estar entre 1900-2100 no formato DD/MM/AAAA ou AAAA-MM-DD.</strong>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-input">Selecionar Arquivo (CSV ou Excel)</Label>
                <Input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: .csv, .xlsx, .xls
                </p>
              </div>

              {file && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Arquivo selecionado:</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">{file.name}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Tamanho: {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleSync} 
                  disabled={!file || isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? 'Sincronizando...' : 'Sincronizar Dados'}
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da sincronização</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Modelo de Planilha</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Baixe um modelo para organizar seus dados no formato correto.
                </p>
                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Modelo CSV
                </Button>
              </div>

              {syncResults && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Resultado da Sincronização</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total de registros:</span>
                      <span className="font-medium">{syncResults.total}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Importados com sucesso:</span>
                      <span className="font-medium">{syncResults.success}</span>
                    </div>
                    <div className="flex justify-between text-yellow-700">
                      <span>Duplicatas ignoradas:</span>
                      <span className="font-medium">{syncResults.duplicates}</span>
                    </div>
                    <div className="flex justify-between text-red-700">
                      <span>Erros:</span>
                      <span className="font-medium">{syncResults.errors}</span>
                    </div>
                  </div>
                  
                  {syncResults.validationErrors.length > 0 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                      <h5 className="font-medium text-red-800 mb-1">Erros de Validação:</h5>
                      <div className="max-h-32 overflow-y-auto">
                        {syncResults.validationErrors.slice(0, 10).map((error, index) => (
                          <p key={index} className="text-xs text-red-700">{error}</p>
                        ))}
                        {syncResults.validationErrors.length > 10 && (
                          <p className="text-xs text-red-600 font-medium">
                            ... e mais {syncResults.validationErrors.length - 10} erros
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
