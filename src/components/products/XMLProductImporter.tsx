import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Upload, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ImportResult {
  total: number;
  success: number;
  errors: number;
  warnings: number;
  details: Array<{
    product: any;
    status: 'created' | 'updated' | 'error' | 'preview';
    validations?: {
      errors: string[];
      warnings: string[];
    };
    error?: string;
  }>;
  summary: {
    byCategory: Record<string, number>;
    totalValue: number;
    averagePrice: number;
  };
}

interface FieldMapping {
  [xmlTag: string]: string;
}

const defaultFieldMapping: FieldMapping = {
  'g:title': 'name',
  'g:description': 'description',
  'g:product_type': 'category',
  'g:brand': 'supplier',
  'g:sale_price': 'price',
  'g:shipping_weight': 'weight',
  'g:product_length': 'length',
  'g:product_width': 'width',
  'g:product_height': 'height',
  'g:image_link': 'imageUrl',
  'g:availability': 'availability',
  'g:id': 'sku'
};

export const XMLProductImporter: React.FC = () => {
  const [xmlUrl, setXmlUrl] = useState('https://www.winnetmetais.com.br/index.php?route=extension/feed/me_pin_events/feed&feed=pinterest.xml');
  const [customMapping, setCustomMapping] = useState<FieldMapping>(defaultFieldMapping);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [activeTab, setActiveTab] = useState('import');
  const { toast } = useToast();

  const handleImport = async (dryRun = false) => {
    if (!xmlUrl.trim()) {
      toast({
        title: 'Erro',
        description: 'Informe a URL do feed XML',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('xml-product-importer', {
        body: {
          xmlUrl: xmlUrl.trim(),
          customMapping,
          dryRun
        }
      });

      if (error) throw error;

      setImportResults(data);
      setActiveTab('results');

      toast({
        title: dryRun ? 'Preview Concluído' : 'Importação Concluída',
        description: dryRun 
          ? `${data.total} produtos analisados`
          : `${data.success} produtos importados com sucesso`,
      });

    } catch (error: any) {
      console.error('Erro na importação:', error);
      toast({
        title: 'Erro na Importação',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const updateFieldMapping = (xmlTag: string, crmField: string) => {
    setCustomMapping(prev => ({
      ...prev,
      [xmlTag]: crmField
    }));
  };

  const addCustomMapping = () => {
    const xmlTag = prompt('Digite a tag XML (ex: g:custom_field):');
    const crmField = prompt('Digite o campo do CRM correspondente:');
    
    if (xmlTag && crmField) {
      updateFieldMapping(xmlTag, crmField);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Tag XML,Campo CRM,Descrição\n' +
      Object.entries(defaultFieldMapping).map(([xmlTag, crmField]) => 
        `${xmlTag},${crmField},"Mapeamento automático"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapeamento-campos-xml.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
      case 'updated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'preview':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'preview':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importação de Produtos via Feed XML
          </CardTitle>
          <CardDescription>
            Importe produtos automaticamente a partir de feeds XML com mapeamento personalizado de campos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="import">Importação</TabsTrigger>
              <TabsTrigger value="mapping">Mapeamento</TabsTrigger>
              <TabsTrigger value="results" disabled={!importResults}>
                Resultados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  A importação XML automatiza o processo de cadastro de produtos. 
                  Recomendamos fazer um preview antes da importação final.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="xmlUrl">URL do Feed XML</Label>
                  <Input
                    id="xmlUrl"
                    type="url"
                    value={xmlUrl}
                    onChange={(e) => setXmlUrl(e.target.value)}
                    placeholder="https://exemplo.com/feed.xml"
                    className="mt-1"
                  />
                </div>

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Processando XML...
                      </span>
                    </div>
                    <Progress value={undefined} className="w-full" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleImport(true)}
                    disabled={isImporting}
                    variant="outline"
                  >
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleImport(false)}
                    disabled={isImporting}
                  >
                    {isImporting ? 'Importando...' : 'Importar Produtos'}
                  </Button>
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Template
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mapping" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Mapeamento de Campos</h3>
                <Button onClick={addCustomMapping} variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Adicionar Campo
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag XML</TableHead>
                      <TableHead>Campo do CRM</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(customMapping).map(([xmlTag, crmField]) => (
                      <TableRow key={xmlTag}>
                        <TableCell className="font-mono text-sm">{xmlTag}</TableCell>
                        <TableCell>
                          <Input
                            value={crmField}
                            onChange={(e) => updateFieldMapping(xmlTag, e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getFieldDescription(crmField)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {importResults && (
                <>
                  {/* Resumo da Importação */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">{importResults.total}</div>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                        <p className="text-sm text-muted-foreground">Sucesso</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                        <p className="text-sm text-muted-foreground">Erros</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{importResults.warnings}</div>
                        <p className="text-sm text-muted-foreground">Avisos</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resumo por Categoria */}
                  {Object.keys(importResults.summary.byCategory).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumo por Categoria</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {Object.entries(importResults.summary.byCategory).map(([category, count]) => (
                            <Badge key={category} variant="outline" className="justify-between">
                              {category} <span className="ml-2">{count}</span>
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Detalhes dos Produtos */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes da Importação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border max-h-96 overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Status</TableHead>
                              <TableHead>Produto</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Preço</TableHead>
                              <TableHead>Observações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importResults.details.map((detail, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(detail.status)}
                                    <Badge 
                                      variant="secondary" 
                                      className={getStatusColor(detail.status)}
                                    >
                                      {detail.status}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {detail.product.name}
                                </TableCell>
                                <TableCell>{detail.product.category || '-'}</TableCell>
                                <TableCell>
                                  {detail.product.price ? `R$ ${detail.product.price.toFixed(2)}` : '-'}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {detail.validations?.errors.map((error, i) => (
                                      <div key={i} className="text-xs text-red-600">{error}</div>
                                    ))}
                                    {detail.validations?.warnings.map((warning, i) => (
                                      <div key={i} className="text-xs text-yellow-600">{warning}</div>
                                    ))}
                                    {detail.error && (
                                      <div className="text-xs text-red-600">{detail.error}</div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

function getFieldDescription(field: string): string {
  const descriptions: Record<string, string> = {
    name: 'Nome do produto',
    description: 'Descrição detalhada',
    category: 'Categoria do produto',
    supplier: 'Fornecedor/Marca',
    price: 'Preço de venda',
    weight: 'Peso do produto',
    sku: 'Código do produto',
    imageUrl: 'URL da imagem',
    availability: 'Disponibilidade'
  };
  
  return descriptions[field] || 'Campo personalizado';
}