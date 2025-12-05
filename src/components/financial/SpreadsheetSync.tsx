
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
    processedRows: Array<Record<string, any>>;
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
      if (lines.length === 0) {
        console.log('CSV vazio');
        return [];
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      console.log('Cabeçalhos CSV detectados:', headers);
      console.log('Total de linhas no CSV:', lines.length - 1);
      
      const validRows: SpreadsheetRow[] = [];
      const invalidRows: Array<Record<string, any>> = [];
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          console.log(`Processando linha ${i}:`, values);
          
          const row = parseRowData(headers, values, i);
          
          if (row && isValidRow(row)) {
            validRows.push(row);
            console.log(`Linha ${i} válida:`, row);
          } else {
            invalidRows.push({ line: i, values, reason: 'Validação falhou' });
            console.log(`Linha ${i} inválida:`, row);
          }
        } catch (error) {
          console.error(`Erro ao processar linha CSV ${i + 1}:`, error);
          invalidRows.push({ line: i, error: error.message });
        }
      }
      
      console.log(`CSV processado: ${validRows.length} válidas, ${invalidRows.length} inválidas`);
      if (invalidRows.length > 0) {
        console.log('Linhas inválidas:', invalidRows);
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
        result.push(current.trim().replace(/^"(.*)"$/, '$1'));
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim().replace(/^"(.*)"$/, '$1'));
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
          console.log('Dados Excel brutos:', jsonData);
          
          if (jsonData.length === 0) {
            console.log('Excel vazio');
            resolve([]);
            return;
          }

          const headers = (jsonData[0] as any[]).map(h => 
            h?.toString().toLowerCase().trim().replace(/['"]/g, '') || ''
          );
          console.log('Cabeçalhos Excel detectados:', headers);
          console.log('Total de linhas no Excel:', jsonData.length - 1);
          
          const validRows: SpreadsheetRow[] = [];
          const invalidRows: Array<Record<string, any>> = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            try {
              const row = jsonData[i] as any[];
              const values = headers.map((_, colIndex) => 
                row[colIndex]?.toString().trim() || ''
              );
              console.log(`Processando linha Excel ${i}:`, values);
              
              const parsedRow = parseRowData(headers, values, i);
              
              if (parsedRow && isValidRow(parsedRow)) {
                validRows.push(parsedRow);
                console.log(`Linha Excel ${i} válida:`, parsedRow);
              } else {
                invalidRows.push({ line: i, values, reason: 'Validação falhou', parsedRow });
                console.log(`Linha Excel ${i} inválida:`, parsedRow);
              }
            } catch (error) {
              console.error(`Erro ao processar linha Excel ${i + 1}:`, error);
              invalidRows.push({ line: i, error: error.message });
            }
          }

          console.log(`Excel processado: ${validRows.length} válidas, ${invalidRows.length} inválidas`);
          if (invalidRows.length > 0) {
            console.log('Linhas inválidas:', invalidRows);
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
        
        // Mapeamento mais amplo e flexível de colunas
        if (header.includes('data') || header.includes('date') || header.includes('vencimento')) {
          row.data = value;
        } else if (header.includes('descrição') || header.includes('descricao') || 
                   header.includes('description') || header.includes('nome') ||
                   header.includes('titulo') || header.includes('title') ||
                   header.includes('historico') || header.includes('lancamento')) {
          row.descricao = value;
        } else if (header.includes('categoria') || header.includes('category') ||
                   header.includes('classificacao') || header.includes('class')) {
          row.categoria = value;
        } else if (header.includes('tipo') || header.includes('type') ||
                   header.includes('natureza') || header.includes('operacao')) {
          row.tipo = value.toLowerCase();
        } else if (header.includes('valor') || header.includes('value') || 
                   header.includes('amount') || header.includes('entrada') || 
                   header.includes('saida') || header.includes('preco') ||
                   header.includes('price') || header.includes('credito') ||
                   header.includes('debito') || header.includes('total')) {
          
          // Para colunas de entrada/saída, determinar o tipo
          if (header.includes('entrada') || header.includes('credito')) {
            row.tipo = 'receita';
          } else if (header.includes('saida') || header.includes('debito')) {
            row.tipo = 'despesa';
          }
          
          // Processar valor monetário
          const cleanValue = value.replace(/[^\d.,-]/g, '').replace(',', '.');
          const numValue = parseFloat(cleanValue) || 0;
          if (numValue > 0) {
            row.valor = numValue;
          }
        } else if (header.includes('status') || header.includes('situacao')) {
          row.status = value.toLowerCase();
        } else if (header.includes('método') || header.includes('metodo') || 
                   header.includes('method') || header.includes('pagamento') ||
                   header.includes('forma') || header.includes('meio')) {
          row.metodo = value;
        } else if (header.includes('canal') || header.includes('channel') ||
                   header.includes('origem') || header.includes('source')) {
          row.canal = value;
        } else if (header.includes('cliente') || header.includes('client') ||
                   header.includes('fornecedor') || header.includes('supplier')) {
          row.cliente = value;
        }
      });
      
      // Log detalhado do que foi parseado
      console.log(`Linha ${index} parseada:`, {
        original: values,
        parsed: row,
        headers
      });
      
      return row;
    } catch (error) {
      console.error(`Erro ao parsear linha ${index}:`, error);
      return null;
    }
  };

  const isValidRow = (row: any): boolean => {
    // Validações mais flexíveis
    console.log('Validando linha:', row);
    
    // Deve ter descrição (mínimo 1 caractere)
    if (!row.descricao || row.descricao.trim().length < 1) {
      console.log('Linha rejeitada: sem descrição');
      return false;
    }
    
    // Deve ter valor positivo
    if (!row.valor || isNaN(row.valor) || row.valor <= 0) {
      console.log('Linha rejeitada: valor inválido', row.valor);
      return false;
    }
    
    // Se tiver data, deve ser válida (mas data não é obrigatória)
    if (row.data && !isValidDate(row.data)) {
      console.log(`Linha rejeitada: data inválida "${row.data}"`);
      return false;
    }
    
    // Aplicar defaults para campos opcionais
    if (!row.tipo) {
      row.tipo = 'receita'; // Default
    }
    
    if (!row.categoria) {
      row.categoria = 'Importado';
    }
    
    if (!row.status) {
      row.status = 'pendente';
    }
    
    if (!row.metodo) {
      row.metodo = '';
    }
    
    console.log('Linha válida:', row);
    return true;
  };

  const isValidDate = (dateStr: string): boolean => {
    if (!dateStr || dateStr.trim() === '') return true; // Data vazia é permitida
    
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
    const processedRows: Array<Record<string, any>> = [];

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    console.log(`Iniciando sincronização de ${total} registros válidos`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        // Converter data para formato ISO
        let dateISO = new Date().toISOString().split('T')[0];
        if (row.data) {
          try {
            dateISO = parseDate(row.data);
          } catch (error) {
            console.warn(`Erro ao processar data "${row.data}", usando data atual`);
          }
        }

        // Mapear tipo de transação
        let transactionType: 'receita' | 'despesa' = 'receita';
        if (row.tipo.includes('saida') || row.tipo.includes('despesa') || 
            row.tipo.includes('expense') || row.tipo.includes('debito') ||
            row.valor < 0) {
          transactionType = 'despesa';
        }

        // Mapear status
        let status: 'pendente' | 'pago' | 'vencido' = 'pendente';
        if (row.status.includes('pago') || row.status.includes('recebido') || 
            row.status.includes('paid') || row.status.includes('received') ||
            row.status.includes('quitado') || row.status.includes('liquidado')) {
          status = 'pago';
        } else if (row.status.includes('vencido') || row.status.includes('atrasado') || 
                   row.status.includes('overdue') || row.status.includes('inadimplente')) {
          status = 'vencido';
        }

        const amount = Math.abs(row.valor);

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

        console.log(`Preparando transação ${i + 1}:`, transactionData);

        // Verificar duplicata
        const isDuplicate = await checkDuplicate(transactionData);
        
        if (isDuplicate) {
          duplicateCount++;
          console.log(`Duplicata ignorada: ${row.descricao}`);
          processedRows.push({ ...transactionData, status: 'duplicate' });
        } else {
          await transactionService.createTransaction(transactionData);
          successCount++;
          console.log(`Transação criada: ${row.descricao} - R$ ${row.valor}`);
          processedRows.push({ ...transactionData, status: 'created' });
        }
      } catch (error) {
        console.error(`Erro ao sincronizar linha ${i + 1}:`, error);
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        validationErrors.push(`Linha ${i + 1}: ${errorMsg}`);
        errorCount++;
        processedRows.push({ row, error: errorMsg, status: 'error' });
      }
    }

    setProgress(100);
    console.log(`Sincronização concluída: ${successCount} sucessos, ${errorCount} erros, ${duplicateCount} duplicatas`);
    return { 
      success: successCount, 
      errors: errorCount, 
      total, 
      duplicates: duplicateCount, 
      validationErrors,
      processedRows
    };
  };

  const parseDate = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === '') {
      return new Date().toISOString().split('T')[0];
    }
    
    try {
      // Remover caracteres especiais e espaços
      const cleanDateStr = dateStr.trim().replace(/[^\d\/\-\.]/g, '');
      
      // Formatos aceitos: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy, dd.mm.yyyy
      if (cleanDateStr.includes('/')) {
        const parts = cleanDateStr.split('/');
        if (parts.length === 3) {
          let day, month, year;
          
          if (parts[2].length === 4) {
            // dd/mm/yyyy
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
      } else if (cleanDateStr.includes('.')) {
        const parts = cleanDateStr.split('.');
        if (parts.length === 3) {
          // dd.mm.yyyy
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
      
      // Se chegou até aqui, tentar interpretar como timestamp
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      throw new Error('Formato de data não reconhecido');
    } catch (error) {
      console.error('Erro ao parsear data:', dateStr, error);
      return new Date().toISOString().split('T')[0];
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      console.log('Iniciando upload do arquivo:', file.name);
      let data: SpreadsheetRow[] = [];

      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        console.log('Arquivo CSV lido, tamanho:', text.length);
        data = parseCSV(text);
      } else {
        console.log('Processando arquivo Excel');
        data = await parseExcel(file);
      }

      console.log(`Dados processados: ${data.length} linhas válidas`);

      if (data.length === 0) {
        toast({
          title: "Nenhum dado válido",
          description: "Não foram encontrados dados válidos no arquivo. Verifique o formato e conteúdo.",
          variant: "destructive",
        });
        return;
      }

      const results = await syncToDatabase(data);
      setSyncResults(results);

      toast({
        title: "Sincronização concluída",
        description: `${results.success} transações importadas com sucesso.`,
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
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
      "02/01/2024,Venda de Produtos,Receita,receita,1500.00,pago,PIX,site,Cliente A",
      "05/01/2024,Compra de Material,Despesa Operacional,despesa,800.00,pago,Boleto,comercial,Fornecedor B",
      "10/01/2024,Comissão de Vendas,Receita,receita,300.00,pendente,Transferência,mercadoLivre,",
      "15/01/2024,Energia Elétrica,Despesa Fixa,despesa,450.00,pago,Débito Automático,comercial,Companhia Elétrica"
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_planilha_financeira.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Sincronização com Planilha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Importe transações financeiras de arquivos CSV ou Excel. O sistema processará
              automaticamente os dados e criará as transações no sistema financeiro.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Selecionar Arquivo (CSV ou Excel)</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sincronizando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Importar Planilha
                  </div>
                )}
              </Button>

              <Button onClick={downloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar Modelo
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processando transações...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {syncResults && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Resultado da Sincronização
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total de registros processados:</span>
                    <span className="font-medium">{syncResults.total}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Importados com sucesso:</span>
                    <span className="font-medium">{syncResults.success}</span>
                  </div>
                  <div className="flex justify-between text-warning">
                    <span>Duplicatas ignoradas:</span>
                    <span className="font-medium">{syncResults.duplicates}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Erros:</span>
                    <span className="font-medium">{syncResults.errors}</span>
                  </div>
                </div>
              </div>

              {syncResults.validationErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Erros de Validação</h4>
                  <div className="space-y-1 text-sm text-red-700 max-h-40 overflow-y-auto">
                    {syncResults.validationErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              )}

              <details className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <summary className="font-medium cursor-pointer">Ver detalhes dos registros processados</summary>
                <div className="mt-2 text-sm max-h-60 overflow-y-auto">
                  <pre>{JSON.stringify(syncResults.processedRows, null, 2)}</pre>
                </div>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
