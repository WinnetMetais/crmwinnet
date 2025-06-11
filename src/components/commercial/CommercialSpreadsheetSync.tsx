
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
import * as XLSX from 'xlsx';

interface CommercialSpreadsheetRow {
  cliente: string;
  contato: string;
  email: string;
  telefone: string;
  empresa: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  fonte: string;
  status: string;
  estagio: string;
  valor_estimado: number;
  probabilidade: number;
  data_contato: string;
  proximo_contato: string;
  observacoes: string;
}

export const CommercialSpreadsheetSync = () => {
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
      const fileExtension = selectedFile.name.toLowerCase();
      if (fileExtension.endsWith('.csv') || fileExtension.endsWith('.xlsx') || fileExtension.endsWith('.xls')) {
        setFile(selectedFile);
        setSyncResults(null);
        console.log('Arquivo comercial selecionado:', selectedFile.name, 'Tipo:', selectedFile.type);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo CSV ou Excel (.xlsx/.xls).",
          variant: "destructive",
        });
      }
    }
  };

  const parseCSV = (csv: string): CommercialSpreadsheetRow[] => {
    try {
      const lines = csv.split('\n').filter(line => line.trim());
      if (lines.length === 0) return [];

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      console.log('Cabeçalhos CSV comercial detectados:', headers);
      
      const validRows: CommercialSpreadsheetRow[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          const row = parseRowData(headers, values, i);
          
          if (row && isValidRow(row)) {
            validRows.push(row);
          }
        } catch (error) {
          console.error(`Erro ao processar linha CSV comercial ${i + 1}:`, error);
        }
      }
      
      return validRows;
    } catch (error) {
      console.error('Erro ao processar CSV comercial:', error);
      throw new Error('Erro ao processar arquivo CSV comercial');
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

  const parseExcel = (file: File): Promise<CommercialSpreadsheetRow[]> => {
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
          console.log('Cabeçalhos Excel comercial detectados:', headers);
          
          const validRows: CommercialSpreadsheetRow[] = [];
          
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
              console.error(`Erro ao processar linha Excel comercial ${i + 1}:`, error);
            }
          }

          resolve(validRows);
        } catch (error) {
          console.error('Erro ao processar arquivo Excel comercial:', error);
          reject(new Error('Erro ao processar arquivo Excel comercial'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseRowData = (headers: string[], values: string[], index: number): CommercialSpreadsheetRow | null => {
    try {
      const row: any = {};
      
      headers.forEach((header, colIndex) => {
        const value = values[colIndex] || '';
        
        if (header.includes('cliente') || header.includes('nome')) {
          row.cliente = value;
        } else if (header.includes('contato') || header.includes('contact')) {
          row.contato = value;
        } else if (header.includes('email') || header.includes('e-mail')) {
          row.email = value;
        } else if (header.includes('telefone') || header.includes('phone')) {
          row.telefone = value;
        } else if (header.includes('empresa') || header.includes('company')) {
          row.empresa = value;
        } else if (header.includes('cnpj')) {
          row.cnpj = value;
        } else if (header.includes('endereço') || header.includes('endereco') || header.includes('address')) {
          row.endereco = value;
        } else if (header.includes('cidade') || header.includes('city')) {
          row.cidade = value;
        } else if (header.includes('estado') || header.includes('state')) {
          row.estado = value;
        } else if (header.includes('cep') || header.includes('zip')) {
          row.cep = value;
        } else if (header.includes('fonte') || header.includes('source')) {
          row.fonte = value;
        } else if (header.includes('status')) {
          row.status = value;
        } else if (header.includes('estágio') || header.includes('estagio') || header.includes('stage')) {
          row.estagio = value;
        } else if (header.includes('valor') || header.includes('value') || header.includes('estimado')) {
          const cleanValue = value.replace(/[^\d.,-]/g, '').replace(',', '.');
          row.valor_estimado = parseFloat(cleanValue) || 0;
        } else if (header.includes('probabilidade') || header.includes('probability')) {
          const cleanValue = value.replace(/[^\d.,-]/g, '').replace(',', '.');
          row.probabilidade = parseFloat(cleanValue) || 0;
        } else if (header.includes('data') && header.includes('contato')) {
          row.data_contato = value;
        } else if (header.includes('proximo') || header.includes('next')) {
          row.proximo_contato = value;
        } else if (header.includes('observações') || header.includes('observacoes') || header.includes('notes')) {
          row.observacoes = value;
        }
      });
      
      return row;
    } catch (error) {
      console.error(`Erro ao parsear linha comercial ${index}:`, error);
      return null;
    }
  };

  const isValidRow = (row: any): boolean => {
    if (!row.cliente || row.cliente.trim().length < 2) {
      return false;
    }
    
    if (!row.empresa && !row.contato) {
      return false;
    }
    
    if (!row.fonte) {
      row.fonte = 'Planilha Importada';
    }
    
    if (!row.status) {
      row.status = 'ativo';
    }
    
    if (!row.estagio) {
      row.estagio = 'lead';
    }
    
    return true;
  };

  const checkDuplicate = async (customerData: any): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('name', customerData.name)
        .eq('email', customerData.email)
        .limit(1);

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar duplicata comercial:', error);
      return false;
    }
  };

  const syncToDatabase = async (data: CommercialSpreadsheetRow[]) => {
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    const total = data.length;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    console.log(`Iniciando sincronização comercial de ${total} registros`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        const customerData = {
          name: row.cliente,
          contact_person: row.contato || '',
          email: row.email || '',
          phone: row.telefone || '',
          company: row.empresa || row.cliente,
          cnpj: row.cnpj || '',
          address: row.endereco || '',
          city: row.cidade || '',
          state: row.estado || '',
          zip_code: row.cep || '',
          lead_source: row.fonte || 'Planilha Importada',
          status: row.status || 'ativo',
          lifecycle_stage: row.estagio || 'lead',
          notes: row.observacoes || 'Cliente importado da planilha comercial',
          created_by: 'Sistema de Importação'
        };

        const isDuplicate = await checkDuplicate(customerData);
        
        if (isDuplicate) {
          duplicateCount++;
          console.log(`Cliente duplicado ignorado: ${row.cliente}`);
        } else {
          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .insert(customerData)
            .select()
            .single();

          if (customerError) throw customerError;

          // Se há valor estimado, criar oportunidade
          if (row.valor_estimado > 0 && customer) {
            const opportunityData = {
              customer_id: customer.id,
              title: `Oportunidade - ${row.cliente}`,
              value: row.valor_estimado,
              probability: row.probabilidade || 50,
              stage: row.estagio || 'prospecto',
              description: `Importado da planilha comercial: ${row.observacoes || ''}`,
              expected_close_date: row.proximo_contato ? parseDate(row.proximo_contato) : null,
              created_by: 'Sistema de Importação'
            };

            await supabase
              .from('opportunities')
              .insert(opportunityData);
          }

          successCount++;
          console.log(`Cliente criado: ${row.cliente}`);
        }
      } catch (error) {
        console.error('Erro ao sincronizar linha comercial:', error);
        errorCount++;
      }
    }

    setProgress(100);
    console.log(`Sincronização comercial concluída: ${successCount} sucessos, ${errorCount} erros, ${duplicateCount} duplicatas`);
    return { success: successCount, errors: errorCount, total, duplicates: duplicateCount };
  };

  const parseDate = (dateStr: string): string | null => {
    if (!dateStr) return null;
    
    try {
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      } else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) {
          return dateStr;
        } else if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }
      
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Erro ao parsear data comercial:', dateStr, error);
    }
    
    return null;
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
      let data: CommercialSpreadsheetRow[];
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        console.log('Processando arquivo CSV comercial, tamanho:', text.length);
        data = parseCSV(text);
      } else {
        console.log('Processando arquivo Excel comercial:', file.name);
        data = await parseExcel(file);
      }
      
      if (data.length === 0) {
        toast({
          title: "Nenhum dado válido encontrado",
          description: "Verifique se o arquivo contém dados válidos com as colunas necessárias (cliente, empresa, etc.).",
          variant: "destructive",
        });
        return;
      }

      console.log(`Iniciando sincronização comercial de ${data.length} registros válidos`);
      const results = await syncToDatabase(data);
      setSyncResults(results);

      toast({
        title: "Sincronização comercial concluída",
        description: `${results.success} clientes importados, ${results.errors} erros, ${results.duplicates} duplicatas ignoradas.`,
      });
    } catch (error) {
      console.error('Erro na sincronização comercial:', error);
      toast({
        title: "Erro na sincronização comercial",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar o arquivo comercial. Verifique o formato e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      "cliente,contato,email,telefone,empresa,cnpj,endereco,cidade,estado,cep,fonte,status,estagio,valor_estimado,probabilidade,data_contato,proximo_contato,observacoes",
      "Cliente ABC,João Silva,joao@clienteabc.com,11999999999,Cliente ABC Ltda,12.345.678/0001-90,Rua das Flores 123,São Paulo,SP,01234-567,Site,ativo,qualificacao,15000.00,70,01/01/2024,15/01/2024,Cliente interessado em produtos de aço",
      "Empresa XYZ,Maria Santos,maria@empresaxyz.com,11888888888,Empresa XYZ S.A.,98.765.432/0001-10,Av. Principal 456,Rio de Janeiro,RJ,20000-000,Indicação,ativo,proposta,25000.00,80,05/01/2024,20/01/2024,Proposta enviada aguardando retorno"
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_comercial_winnet.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Modelo comercial baixado",
      description: "Arquivo modelo CSV comercial foi baixado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Sincronização de Planilha Comercial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Importe dados da sua planilha comercial para sincronizar clientes e oportunidades com o CRM. 
              Aceita arquivos CSV e Excel (.xlsx/.xls). Detecta automaticamente colunas como: cliente, empresa, contato, valor estimado, estágio, etc.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-input-commercial">Selecionar Arquivo Comercial (CSV ou Excel)</Label>
                <Input
                  id="file-input-commercial"
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
                  {isUploading ? 'Sincronizando...' : 'Sincronizar Dados Comerciais'}
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
                <Label>Modelo de Planilha Comercial</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Baixe um modelo para organizar seus dados comerciais no formato correto.
                </p>
                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Modelo CSV Comercial
                </Button>
              </div>

              {syncResults && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Resultado da Sincronização Comercial</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total de registros:</span>
                      <span className="font-medium">{syncResults.total}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Clientes importados:</span>
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
