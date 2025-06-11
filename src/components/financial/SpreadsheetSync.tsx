
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
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setSyncResults(null);
        console.log('Arquivo CSV selecionado:', selectedFile.name);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo CSV.",
          variant: "destructive",
        });
      }
    }
  };

  const parseCSV = (csv: string): SpreadsheetRow[] => {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    console.log('Cabeçalhos detectados:', headers);
    
    const rows = lines.slice(1).map((line, index) => {
      try {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        
        headers.forEach((header, colIndex) => {
          const value = values[colIndex] || '';
          
          // Mapear colunas da planilha para campos do sistema
          if (header.includes('data') || header.includes('date')) {
            row.data = value;
          } else if (header.includes('descrição') || header.includes('descricao') || header.includes('description')) {
            row.descricao = value;
          } else if (header.includes('categoria') || header.includes('category')) {
            row.categoria = value;
          } else if (header.includes('tipo') || header.includes('type')) {
            row.tipo = value.toLowerCase();
          } else if (header.includes('valor') || header.includes('value') || header.includes('amount')) {
            const cleanValue = value.replace(/[^\d.,-]/g, '').replace(',', '.');
            row.valor = parseFloat(cleanValue) || 0;
          } else if (header.includes('status')) {
            row.status = value.toLowerCase();
          } else if (header.includes('método') || header.includes('metodo') || header.includes('method')) {
            row.metodo = value;
          } else if (header.includes('canal') || header.includes('channel')) {
            row.canal = value;
          } else if (header.includes('cliente') || header.includes('client')) {
            row.cliente = value;
          }
        });
        
        return row;
      } catch (error) {
        console.error(`Erro ao processar linha ${index + 2}:`, error);
        return null;
      }
    }).filter((row): row is SpreadsheetRow => 
      row !== null && row.descricao && row.valor && row.valor > 0
    );

    console.log(`Processadas ${rows.length} linhas válidas de ${lines.length - 1} linhas totais`);
    return rows;
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

    // Obter o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    console.log(`Iniciando sincronização de ${total} registros`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress((i / total) * 100);

      try {
        // Converter data para formato ISO
        let dateISO = new Date().toISOString().split('T')[0];
        if (row.data) {
          if (row.data.includes('/')) {
            const dateParts = row.data.split('/');
            if (dateParts.length === 3) {
              const day = dateParts[0].padStart(2, '0');
              const month = dateParts[1].padStart(2, '0');
              const year = dateParts[2];
              dateISO = `${year}-${month}-${day}`;
            }
          } else if (row.data.includes('-')) {
            dateISO = row.data;
          }
        }

        // Mapear tipo de transação
        let transactionType: 'receita' | 'despesa' = 'receita';
        if (row.tipo.includes('saida') || row.tipo.includes('despesa') || 
            row.tipo.includes('expense') || row.valor < 0) {
          transactionType = 'despesa';
        }

        // Mapear status
        let status: 'pendente' | 'pago' | 'vencido' = 'pendente';
        if (row.status.includes('pago') || row.status.includes('recebido') || 
            row.status.includes('paid') || row.status.includes('received')) {
          status = 'pago';
        } else if (row.status.includes('vencido') || row.status.includes('atrasado') || 
                   row.status.includes('overdue')) {
          status = 'vencido';
        }

        const transactionData = {
          type: transactionType,
          title: row.descricao,
          amount: Math.abs(row.valor),
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
        errorCount++;
      }
    }

    setProgress(100);
    console.log(`Sincronização concluída: ${successCount} sucessos, ${errorCount} erros, ${duplicateCount} duplicatas`);
    return { success: successCount, errors: errorCount, total, duplicates: duplicateCount };
  };

  const handleSync = async () => {
    if (!file) {
      toast({
        title: "Arquivo necessário",
        description: "Por favor, selecione um arquivo CSV primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const text = await file.text();
      console.log('Conteúdo do arquivo carregado, tamanho:', text.length);
      
      const data = parseCSV(text);
      
      if (data.length === 0) {
        toast({
          title: "Arquivo vazio",
          description: "Nenhum dado válido encontrado no arquivo.",
          variant: "destructive",
        });
        return;
      }

      console.log(`Iniciando sincronização de ${data.length} registros válidos`);
      const results = await syncToDatabase(data);
      setSyncResults(results);

      toast({
        title: "Sincronização concluída",
        description: `${results.success} registros importados, ${results.errors} erros, ${results.duplicates} duplicatas ignoradas.`,
      });
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao processar o arquivo. Verifique o formato e tente novamente.",
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
              O arquivo deve estar no formato CSV com as colunas: data, descrição, categoria, tipo, valor, status, método, canal, cliente.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Selecionar Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
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
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
