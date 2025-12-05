import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, CheckCircle, AlertCircle, FileSpreadsheet, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { transactionService } from "@/services/transactions";
import * as XLSX from 'xlsx';

interface WinnetRow {
  origem: string;
  data: string;
  descricao: string;
  razaoSocial: string;
  pedido: string;
  valor: number;
  dataOriginal: string;
  pagamento: string;
  entrega: string;
  status: string;
}

export const WinnetSpreadsheetImporter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    total: number;
    duplicates: number;
    summary: {
      totalReceitas: number;
      totalDespesas: number;
      canais: Record<string, number>;
    };
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.toLowerCase();
      if (fileExtension.endsWith('.xlsx') || fileExtension.endsWith('.xls')) {
        setFile(selectedFile);
        setImportResults(null);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx/.xls).",
          variant: "destructive",
        });
      }
    }
  };

  const parseWinnetExcel = (file: File): Promise<WinnetRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log('Dados Excel da Winnet:', jsonData);
          
          if (jsonData.length === 0) {
            resolve([]);
            return;
          }

          // Encontrar linha de cabeçalho (geralmente a primeira linha com dados)
          let headerRowIndex = 0;
          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row.length > 5 && row.some(cell => 
              cell && typeof cell === 'string' && 
              (cell.toLowerCase().includes('origem') || 
               cell.toLowerCase().includes('data') || 
               cell.toLowerCase().includes('descrição') ||
               cell.toLowerCase().includes('valor'))
            )) {
              headerRowIndex = i;
              break;
            }
          }

          const headers = (jsonData[headerRowIndex] as any[]).map(h => 
            h?.toString().toLowerCase().trim() || ''
          );
          
          console.log('Cabeçalhos detectados na linha', headerRowIndex + 1, ':', headers);
          
          const validRows: WinnetRow[] = [];
          
          for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
            try {
              const row = jsonData[i] as any[];
              if (!row || row.length === 0) continue;
              
              const parsedRow = parseWinnetRowData(headers, row, i);
              
              if (parsedRow && isValidWinnetRow(parsedRow)) {
                validRows.push(parsedRow);
              }
            } catch (error) {
              console.error(`Erro ao processar linha ${i + 1}:`, error);
            }
          }

          console.log(`Planilha Winnet processada: ${validRows.length} transações válidas`);
          resolve(validRows);
        } catch (error) {
          console.error('Erro ao processar planilha Winnet:', error);
          reject(new Error('Erro ao processar arquivo Excel da Winnet'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseWinnetRowData = (headers: string[], values: any[], index: number): WinnetRow | null => {
    try {
      const row: any = {};
      
      headers.forEach((header, colIndex) => {
        const value = values[colIndex]?.toString().trim() || '';
        
        if (header.includes('origem')) {
          row.origem = value;
        } else if (header.includes('data') && !header.includes('pagamento')) {
          row.data = value;
        } else if (header.includes('descrição') || header.includes('descricao')) {
          row.descricao = value;
        } else if (header.includes('razão') || header.includes('social')) {
          row.razaoSocial = value;
        } else if (header.includes('pedido')) {
          row.pedido = value;
        } else if (header.includes('valor')) {
          // Processar valor monetário
          const cleanValue = value.toString().replace(/[^\d.,-]/g, '').replace(',', '.');
          const numValue = parseFloat(cleanValue) || 0;
          if (numValue !== 0) {
            row.valor = Math.abs(numValue);
          }
        } else if (header.includes('pagamento')) {
          row.pagamento = value;
        } else if (header.includes('entrega')) {
          row.entrega = value;
        } else if (header.includes('status')) {
          row.status = value;
        }
      });
      
      return row as WinnetRow;
    } catch (error) {
      console.error(`Erro ao parsear linha ${index}:`, error);
      return null;
    }
  };

  const isValidWinnetRow = (row: WinnetRow): boolean => {
    // Deve ter descrição e valor
    if (!row.descricao || row.descricao.trim().length < 2) {
      return false;
    }
    
    if (!row.valor || isNaN(row.valor) || row.valor <= 0) {
      return false;
    }
    
    return true;
  };

  const parseWinnetDate = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === '') {
      return new Date().toISOString().split('T')[0];
    }
    
    try {
      // Tentar diferentes formatos de data
      const cleanDateStr = dateStr.trim();
      
      // Se é um número serial do Excel, converter
      if (/^\d+$/.test(cleanDateStr)) {
        const excelDate = new Date((parseInt(cleanDateStr) - 25569) * 86400 * 1000);
        return excelDate.toISOString().split('T')[0];
      }
      
      // Formato dd/mm/yyyy
      if (cleanDateStr.includes('/')) {
        const parts = cleanDateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }
      
      // Formato dd-mm-yyyy
      if (cleanDateStr.includes('-')) {
        const parts = cleanDateStr.split('-');
        if (parts.length === 3 && parts[0].length <= 2) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }
      
      return new Date().toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  const determineTransactionType = (origem: string, valor: number): 'receita' | 'despesa' => {
    const origemLower = origem.toLowerCase();
    
    // Canais de vendas são receitas
    if (origemLower.includes('site') || 
        origemLower.includes('mercado') || 
        origemLower.includes('madeira') || 
        origemLower.includes('via') || 
        origemLower.includes('comercial') ||
        origemLower.includes('venda')) {
      return 'receita';
    }
    
    // Outras origens são despesas por padrão
    return 'despesa';
  };

  const getChannelFromOrigem = (origem: string): string => {
    const origemLower = origem.toLowerCase();
    
    if (origemLower.includes('site')) return 'Site';
    if (origemLower.includes('mercado')) return 'Mercado Livre';
    if (origemLower.includes('madeira')) return 'Madeira Madeira';
    if (origemLower.includes('via')) return 'Via';
    if (origemLower.includes('comercial')) return 'Comercial';
    
    return origem; // Retorna a origem original se não encontrar correspondência
  };

  const syncWinnetData = async (data: WinnetRow[]) => {
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    const total = data.length;
    const canais: Record<string, number> = {};
    let totalReceitas = 0;
    let totalDespesas = 0;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    console.log(`Iniciando sincronização de ${total} transações da Winnet`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        const dateISO = parseWinnetDate(row.data);
        const transactionType = determineTransactionType(row.origem, row.valor);
        const channel = getChannelFromOrigem(row.origem);
        
        // Contar por canal
        canais[channel] = (canais[channel] || 0) + 1;
        
        // Somar valores
        if (transactionType === 'receita') {
          totalReceitas += row.valor;
        } else {
          totalDespesas += row.valor;
        }

        const transactionData = {
          type: transactionType,
          title: row.descricao,
          amount: row.valor,
          category: row.origem,
          subcategory: row.razaoSocial || '',
          date: dateISO,
          status: row.status?.toLowerCase().includes('pago') || 
                  row.status?.toLowerCase().includes('finalizado') ? 'pago' : 'pendente',
          payment_method: row.pagamento || '',
          description: `${row.descricao} - Pedido: ${row.pedido}`,
          channel: channel,
          client_name: row.razaoSocial || '',
          invoice_number: row.pedido || '',
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
        console.error(`Erro ao sincronizar linha ${i + 1}:`, error);
        errorCount++;
      }
    }

    setProgress(100);
    console.log(`Sincronização Winnet concluída: ${successCount} sucessos, ${errorCount} erros, ${duplicateCount} duplicatas`);
    
    return { 
      success: successCount, 
      errors: errorCount, 
      total, 
      duplicates: duplicateCount,
      summary: {
        totalReceitas,
        totalDespesas,
        canais
      }
    };
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

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione uma planilha Excel da Winnet Metais.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setImportResults(null);

    try {
      const parsedData = await parseWinnetExcel(file);
      
      if (parsedData.length === 0) {
        toast({
          title: "Planilha vazia",
          description: "Nenhum dado válido foi encontrado na planilha.",
          variant: "destructive",
        });
        return;
      }

      const results = await syncWinnetData(parsedData);
      setImportResults(results);

      toast({
        title: "Importação concluída",
        description: `${results.success} transações importadas da planilha Winnet Metais.`,
      });
    } catch (error) {
      console.error('Erro durante upload:', error);
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro ao processar planilha",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['ORIGEM', 'DATA', 'DESCRIÇÃO', 'RAZÃO SOCIAL', 'PEDIDO', 'VALOR', 'PAGAMENTO', 'ENTREGA', 'STATUS'],
      ['COMERCIAL', '16/01/2025', 'Venda de produtos', 'Cliente Exemplo LTDA', '12345', '2500.00', 'PIX', '20/01/2025', 'FINALIZADO'],
      ['SITE', '17/01/2025', 'Venda online', 'João Silva', '12346', '1200.50', 'Cartão', '22/01/2025', 'PAGO'],
      ['MERCADO LIVRE', '18/01/2025', 'Venda marketplace', 'Maria Santos', '12347', '800.00', 'Boleto', '25/01/2025', 'PENDENTE']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Winnet');
    XLSX.writeFile(wb, 'template_winnet_financeiro.xlsx');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileSpreadsheet className="h-5 w-5" />
            Importador de Planilha Winnet Metais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este importador é específico para a estrutura de planilha financeira da Winnet Metais.
              Suporta dados de todos os canais: Site, Mercado Livre, Madeira Madeira, Via e Comercial.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="excel-file">Selecionar Planilha Excel da Winnet</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Importar Planilha Winnet
                  </div>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={downloadTemplate}
                disabled={isUploading}
              >
                <Download className="h-4 w-4 mr-2" />
                Template
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

          {importResults && (
            <div className="space-y-4 mt-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Resultado da Importação
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-700">{importResults.success}</div>
                    <div className="text-green-600">Importadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-destructive">{importResults.errors}</div>
                    <div className="text-destructive">Erros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning">{importResults.duplicates}</div>
                    <div className="text-warning">Duplicatas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-info">{importResults.total}</div>
                    <div className="text-info">Total</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Resumo Financeiro Importado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-800">Valores:</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Receitas:</span>
                        <span className="font-medium text-green-600">
                          R$ {importResults.summary.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Despesas:</span>
                        <span className="font-medium text-red-600">
                          R$ {importResults.summary.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-medium">Saldo:</span>
                        <span className={`font-medium ${
                          importResults.summary.totalReceitas - importResults.summary.totalDespesas >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          R$ {(importResults.summary.totalReceitas - importResults.summary.totalDespesas)
                            .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-800">Canais de Venda:</h5>
                    <div className="space-y-1 text-sm">
                      {Object.entries(importResults.summary.canais).map(([canal, count]) => (
                        <div key={canal} className="flex justify-between">
                          <span>{canal}:</span>
                          <span className="font-medium">{count} transações</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};