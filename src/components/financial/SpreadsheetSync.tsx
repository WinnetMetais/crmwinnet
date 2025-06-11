
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, RefreshCw, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { transactionService } from "@/services/transactions";
import { supabase } from "@/integrations/supabase/client";

interface SpreadsheetRow {
  data: string;
  descricao: string;
  categoria: string;
  tipo: string;
  valor: number;
  status: string;
  metodo: string;
}

export const SpreadsheetSync = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncResults, setSyncResults] = useState<{
    success: number;
    errors: number;
    total: number;
  } | null>(null);

  const createTransaction = useCreateTransaction();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setSyncResults(null);
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
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        
        // Mapear colunas da planilha para campos do sistema
        switch (header) {
          case 'data':
          case 'date':
            row.data = value;
            break;
          case 'descrição':
          case 'descricao':
          case 'description':
            row.descricao = value;
            break;
          case 'categoria':
          case 'category':
            row.categoria = value;
            break;
          case 'tipo':
          case 'type':
            row.tipo = value.toLowerCase();
            break;
          case 'valor':
          case 'value':
          case 'amount':
            row.valor = parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
            break;
          case 'status':
            row.status = value.toLowerCase();
            break;
          case 'método':
          case 'metodo':
          case 'method':
            row.metodo = value;
            break;
        }
      });
      
      return row;
    }).filter(row => row.descricao && row.valor); // Filtrar linhas válidas
  };

  const syncToDatabase = async (data: SpreadsheetRow[]) => {
    let successCount = 0;
    let errorCount = 0;
    const total = data.length;

    // Obter o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress((i / total) * 100);

      try {
        // Converter data para formato ISO
        let dateISO = new Date().toISOString().split('T')[0];
        if (row.data) {
          const dateParts = row.data.split('/');
          if (dateParts.length === 3) {
            dateISO = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
          }
        }

        // Mapear tipo de transação
        let transactionType: 'receita' | 'despesa' = 'receita';
        if (row.tipo.includes('saida') || row.tipo.includes('despesa') || row.valor < 0) {
          transactionType = 'despesa';
        }

        // Mapear status
        let status: 'pendente' | 'pago' | 'vencido' = 'pendente';
        if (row.status.includes('pago') || row.status.includes('recebido')) {
          status = 'pago';
        } else if (row.status.includes('vencido') || row.status.includes('atrasado')) {
          status = 'vencido';
        }

        const transactionData = {
          type: transactionType,
          title: row.descricao,
          amount: Math.abs(row.valor),
          category: row.categoria || 'Outros',
          date: dateISO,
          status: status,
          payment_method: row.metodo || '',
          description: `Importado da planilha - ${row.descricao}`,
          user_id: user.id
        };

        await transactionService.createTransaction(transactionData);
        successCount++;
      } catch (error) {
        console.error('Erro ao sincronizar linha:', error);
        errorCount++;
      }
    }

    setProgress(100);
    return { success: successCount, errors: errorCount, total };
  };

  const handleSync = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        toast({
          title: "Arquivo vazio",
          description: "Nenhum dado válido encontrado no arquivo.",
          variant: "destructive",
        });
        return;
      }

      const results = await syncToDatabase(data);
      setSyncResults(results);

      toast({
        title: "Sincronização concluída",
        description: `${results.success} registros importados com sucesso, ${results.errors} erros.`,
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
    const csvContent = "data,descricao,categoria,tipo,valor,status,metodo\n" +
                      "02/01/2024,Venda Produto,Receita,ENTRADA,1500.00,Recebido,PIX\n" +
                      "05/01/2024,Fornecedor XYZ,Despesa Fixa,SAIDA,500.00,Pago,Boleto\n" +
                      "10/01/2024,Comissão Vendas,Receita,ENTRADA,300.00,Pendente,Transferência";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_financeiro_winnet.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
              O arquivo deve estar no formato CSV com as colunas: data, descrição, categoria, tipo, valor, status, método.
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
