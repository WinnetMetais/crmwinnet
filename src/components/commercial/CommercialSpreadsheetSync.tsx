import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Upload, RotateCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface SyncData {
  id: string;
  type: 'quote' | 'deal' | 'customer';
  name: string;
  status: 'success' | 'error' | 'pending';
  lastSync: string;
  errors?: string[];
}

export const CommercialSpreadsheetSync = () => {
  const [syncType, setSyncType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncData[]>([
    {
      id: '1',
      type: 'quote',
      name: 'Orçamentos_Janeiro_2024.xlsx',
      status: 'success',
      lastSync: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'deal',
      name: 'Deals_Q1_2024.xlsx',
      status: 'error',
      lastSync: '2024-01-14T15:45:00Z',
      errors: ['Coluna "valor" não encontrada', 'Data inválida na linha 15'],
    },
  ]);
  
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          selectedFile.type !== 'application/vnd.ms-excel') {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione um arquivo Excel (.xlsx ou .xls)',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const processSpreadsheet = async () => {
    if (!file || !syncType) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo e tipo de sincronização',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Dados do Excel:', jsonData);

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newSync: SyncData = {
        id: Date.now().toString(),
        type: syncType as 'quote' | 'deal' | 'customer',
        name: file.name,
        status: 'success',
        lastSync: new Date().toISOString(),
      };

      setSyncHistory(prev => [newSync, ...prev]);

      toast({
        title: 'Sucesso',
        description: `${jsonData.length} registros sincronizados com sucesso!`,
      });

      setFile(null);
      setSyncType('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Erro ao processar planilha:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao processar a planilha',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = (type: string) => {
    let templateData: any[] = [];
    let filename = '';

    switch (type) {
      case 'quote':
        templateData = [
          {
            'Número do Orçamento': 'WM000001',
            'Nome do Cliente': 'Cliente Exemplo',
            'Email': 'cliente@exemplo.com',
            'Data': '2024-01-15',
            'Validade': '2024-02-15',
            'Total': 1500.00,
            'Status': 'rascunho',
          }
        ];
        filename = 'template_orcamentos.xlsx';
        break;
      case 'deal':
        templateData = [
          {
            'Título': 'Deal Exemplo',
            'Cliente': 'Cliente Exemplo',
            'Valor': 5000.00,
            'Status': 'lead',
            'Data de Fechamento': '2024-02-01',
            'Responsável': 'Vendedor',
          }
        ];
        filename = 'template_deals.xlsx';
        break;
      case 'customer':
        templateData = [
          {
            'Nome': 'Cliente Exemplo',
            'Email': 'cliente@exemplo.com',
            'Telefone': '(11) 99999-9999',
            'Empresa': 'Empresa Ltda',
            'Status': 'ativo',
            'Fonte': 'website',
          }
        ];
        filename = 'template_clientes.xlsx';
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    XLSX.writeFile(workbook, filename);

    toast({
      title: 'Sucesso',
      description: 'Template baixado com sucesso!',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <RotateCw className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/15 text-success';
      case 'error': return 'bg-destructive/15 text-destructive';
      default: return 'bg-warning/15 text-warning';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Sincronização com Planilhas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => downloadTemplate('quote')}
              className="flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Template Orçamentos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => downloadTemplate('deal')}
              className="flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Template Deals
            </Button>
            <Button 
              variant="outline" 
              onClick={() => downloadTemplate('customer')}
              className="flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Template Clientes
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sync-type">Tipo de Sincronização</Label>
                <Select value={syncType} onValueChange={setSyncType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">Orçamentos</SelectItem>
                    <SelectItem value="deal">Deals</SelectItem>
                    <SelectItem value="customer">Clientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Arquivo Excel</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={processSpreadsheet}
                disabled={!file || !syncType || isLoading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? 'Processando...' : 'Sincronizar Dados'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Sincronizações</CardTitle>
        </CardHeader>
        <CardContent>
          {syncHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileSpreadsheet className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nenhuma sincronização realizada ainda</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Sincronização</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncHistory.map((sync) => (
                  <TableRow key={sync.id}>
                    <TableCell className="font-medium">{sync.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sync.type === 'quote' ? 'Orçamentos' : 
                         sync.type === 'deal' ? 'Deals' : 'Clientes'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(sync.status)}
                        <Badge className={`ml-2 ${getStatusColor(sync.status)}`}>
                          {sync.status === 'success' ? 'Sucesso' : 
                           sync.status === 'error' ? 'Erro' : 'Pendente'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(sync.lastSync).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {sync.errors && sync.errors.length > 0 && (
                        <div className="text-sm text-red-600">
                          {sync.errors.join(', ')}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};