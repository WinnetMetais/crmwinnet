import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Webhook, Key, CheckCircle, AlertCircle, Copy, Eye, EyeOff, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SimpleWhatsAppSetup } from "./SimpleWhatsAppSetup";

export const WhatsAppConfiguration = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="simple" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Conexão Simples
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Configuração Avançada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <SimpleWhatsAppSetup />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedWhatsAppSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AdvancedWhatsAppSetup = () => {
  const [config, setConfig] = useState({
    webhookUrl: '',
    verifyToken: '',
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: '',
    enabled: false
  });
  const [showTokens, setShowTokens] = useState({
    verifyToken: false,
    accessToken: false
  });
  const [isValidating, setIsValidating] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'success' | 'error' | 'pending' | null>(null);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('whatsapp-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    
    // Definir webhook URL automaticamente
    const baseUrl = window.location.origin;
    const projectId = 'fgabadpelymhgvbtemwa'; // ID do projeto Supabase
    const webhookUrl = `https://${projectId}.functions.supabase.co/functions/v1/whatsapp-webhook`;
    
    setConfig(prev => ({ ...prev, webhookUrl }));
  }, []);

  const saveConfiguration = () => {
    localStorage.setItem('whatsapp-config', JSON.stringify(config));
    toast({
      title: "Configuração salva",
      description: "As configurações do WhatsApp foram salvas com sucesso.",
    });
  };

  const validateWebhook = async () => {
    setIsValidating(true);
    setWebhookStatus('pending');
    
    try {
      // Testar o webhook
      const testUrl = `${config.webhookUrl}?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=${config.verifyToken}`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const text = await response.text();
        if (text === 'test123') {
          setWebhookStatus('success');
          toast({
            title: "Webhook validado",
            description: "O webhook está funcionando corretamente.",
          });
        } else {
          setWebhookStatus('error');
          toast({
            title: "Erro na validação",
            description: "O webhook não retornou o challenge esperado.",
            variant: "destructive"
          });
        }
      } else {
        setWebhookStatus('error');
        toast({
          title: "Erro na validação",
          description: "Não foi possível conectar ao webhook.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setWebhookStatus('error');
      toast({
        title: "Erro na validação",
        description: "Erro ao testar o webhook.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const toggleTokenVisibility = (tokenType: 'verifyToken' | 'accessToken') => {
    setShowTokens(prev => ({
      ...prev,
      [tokenType]: !prev[tokenType]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuração Avançada - WhatsApp Business API
          </CardTitle>
          <CardDescription>
            Configure a integração oficial com a API do WhatsApp Business (requer aprovação do Facebook)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Configuração */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <p className="font-medium">Status da Integração</p>
                <p className="text-sm text-muted-foreground">
                  {config.enabled ? 'Ativa e funcionando' : 'Inativa'}
                </p>
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
            />
          </div>

          <Separator />

          {/* Configuração do Webhook */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Configuração do Webhook</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(config.webhookUrl, 'URL do Webhook')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use esta URL na configuração do webhook no Facebook Developers
                </p>
              </div>

              <div>
                <Label htmlFor="verifyToken">Verify Token</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="verifyToken"
                    type={showTokens.verifyToken ? 'text' : 'password'}
                    value={config.verifyToken}
                    onChange={(e) => setConfig(prev => ({ ...prev, verifyToken: e.target.value }))}
                    placeholder="Digite o verify token"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTokenVisibility('verifyToken')}
                  >
                    {showTokens.verifyToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Token usado para verificar a autenticidade do webhook
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={validateWebhook}
                  disabled={isValidating || !config.verifyToken}
                  className="flex items-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Validar Webhook
                    </>
                  )}
                </Button>
                
                {webhookStatus && (
                  <Badge variant={webhookStatus === 'success' ? 'default' : 'destructive'}>
                    {webhookStatus === 'success' ? 'Válido' : 'Erro'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuração da API */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Credenciais da API</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="accessToken"
                    type={showTokens.accessToken ? 'text' : 'password'}
                    value={config.accessToken}
                    onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                    placeholder="Digite o access token do WhatsApp"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTokenVisibility('accessToken')}
                  >
                    {showTokens.accessToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={config.phoneNumberId}
                  onChange={(e) => setConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                  placeholder="ID do número de telefone"
                />
              </div>

              <div>
                <Label htmlFor="businessAccountId">Business Account ID</Label>
                <Input
                  id="businessAccountId"
                  value={config.businessAccountId}
                  onChange={(e) => setConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
                  placeholder="ID da conta comercial"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Instruções */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Como configurar:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>Acesse o <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener" className="text-primary hover:underline">Facebook Developers</a></li>
                <li>Configure o webhook com a URL fornecida acima</li>
                <li>Defina um verify token e use o mesmo aqui</li>
                <li>Obtenha o access token e Phone Number ID</li>
                <li>Teste a configuração usando o botão "Validar Webhook"</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Button onClick={saveConfiguration} className="w-full">
            Salvar Configuração
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};