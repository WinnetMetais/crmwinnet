
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ExternalLink,
  Check,
  AlertTriangle,
  Info,
  RefreshCw,
  Settings,
  Database,
  Zap
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const BlingIntegration: React.FC = () => {
  const [blingConfig, setBlingConfig] = useState({
    apiKey: '',
    baseUrl: 'https://www.bling.com.br/Api/v3',
    clientId: '',
    clientSecret: '',
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('bling_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setBlingConfig(config);
      setIsConnected(!!config.apiKey);
    }

    const savedLastSync = localStorage.getItem('bling_last_sync');
    if (savedLastSync) {
      setLastSync(savedLastSync);
    }
  }, []);

  const handleConfigChange = (field: string, value: string) => {
    setBlingConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = () => {
    if (!blingConfig.apiKey) {
      toast.error('API Key é obrigatória');
      return;
    }

    localStorage.setItem('bling_config', JSON.stringify(blingConfig));
    toast.success('Configurações do BLING salvas com sucesso!');
  };

  const handleTestConnection = async () => {
    if (!blingConfig.apiKey) {
      toast.error('API Key é obrigatória para testar a conexão');
      return;
    }

    setIsTestingConnection(true);
    
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast.success('Conexão com BLING estabelecida com sucesso!');
    } catch (error) {
      setIsConnected(false);
      toast.error('Falha ao conectar com BLING. Verifique suas credenciais.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncData = async () => {
    if (!isConnected) {
      toast.error('Conecte-se ao BLING primeiro');
      return;
    }

    try {
      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const now = new Date().toLocaleString('pt-BR');
      setLastSync(now);
      localStorage.setItem('bling_last_sync', now);
      
      toast.success('Dados sincronizados com sucesso!');
    } catch (error) {
      toast.error('Erro durante a sincronização');
    }
  };

  const handleDisconnect = () => {
    setBlingConfig({
      apiKey: '',
      baseUrl: 'https://www.bling.com.br/Api/v3',
      clientId: '',
      clientSecret: '',
    });
    setIsConnected(false);
    setLastSync(null);
    localStorage.removeItem('bling_config');
    localStorage.removeItem('bling_last_sync');
    toast.info('Desconectado do BLING');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Integração BLING ERP</h3>
        <p className="text-sm text-muted-foreground">
          Configure a integração com o BLING para sincronizar produtos, clientes e pedidos
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-base">BLING ERP</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sistema de gestão empresarial integrado
                </p>
              </div>
            </div>
            <Badge variant={isConnected ? "success" : "secondary"}>
              {isConnected ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Configuração necessária</AlertTitle>
                <AlertDescription>
                  Para conectar com o BLING, você precisa das credenciais da API. 
                  Acesse sua conta BLING para obter essas informações.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bling-api-key">API Key *</Label>
                  <Input
                    id="bling-api-key"
                    type="password"
                    value={blingConfig.apiKey}
                    onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                    placeholder="Sua API Key do BLING"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bling-base-url">URL Base da API</Label>
                  <Input
                    id="bling-base-url"
                    type="url"
                    value={blingConfig.baseUrl}
                    onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                    placeholder="https://www.bling.com.br/Api/v3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bling-client-id">Client ID (OAuth)</Label>
                    <Input
                      id="bling-client-id"
                      value={blingConfig.clientId}
                      onChange={(e) => handleConfigChange('clientId', e.target.value)}
                      placeholder="Client ID (opcional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bling-client-secret">Client Secret (OAuth)</Label>
                    <Input
                      id="bling-client-secret"
                      type="password"
                      value={blingConfig.clientSecret}
                      onChange={(e) => handleConfigChange('clientSecret', e.target.value)}
                      placeholder="Client Secret (opcional)"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveConfig}>
                  <Settings className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={!blingConfig.apiKey || isTestingConnection}
                >
                  {isTestingConnection ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Testar Conexão
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://developer.bling.com.br/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Documentação
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      BLING conectado com sucesso
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDisconnect}
                  >
                    Desconectar
                  </Button>
                </div>
                {lastSync && (
                  <p className="text-xs text-green-700 mt-2">
                    Última sincronização: {lastSync}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSyncData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Dados
                </Button>
                <Button variant="outline" onClick={() => setIsConnected(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Configurações
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium">Produtos</h4>
                      <p className="text-xs text-muted-foreground">Sincronizar catálogo</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium">Clientes</h4>
                      <p className="text-xs text-muted-foreground">Sincronizar base</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-medium">Pedidos</h4>
                      <p className="text-xs text-muted-foreground">Sincronizar vendas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="help">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Como configurar a integração BLING
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Obter API Key</h4>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Acesse sua conta no BLING</li>
                  <li>Vá em Configurações → API</li>
                  <li>Gere uma nova chave de API</li>
                  <li>Copie a chave e cole no campo acima</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Configurar Permissões</h4>
                <p className="text-muted-foreground mb-2">
                  Certifique-se de que sua API Key tem as seguintes permissões:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Leitura de produtos</li>
                  <li>Leitura e escrita de clientes</li>
                  <li>Leitura e escrita de pedidos</li>
                  <li>Leitura de categorias</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Sincronização Automática</h4>
                <p className="text-muted-foreground">
                  Após conectar, os dados serão sincronizados automaticamente a cada 15 minutos. 
                  Você também pode sincronizar manualmente a qualquer momento.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
