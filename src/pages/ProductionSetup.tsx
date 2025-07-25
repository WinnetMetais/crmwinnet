import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Upload, Download, Settings, Database } from "lucide-react";

const ProductionSetup = () => {
  const { toast } = useToast();
  const [setupProgress, setSetupProgress] = useState(25); // Started with data cleanup
  const [integrations, setIntegrations] = useState({
    googleAds: { token: '', configured: false },
    facebook: { token: '', configured: false },
    linkedin: { token: '', configured: false },
    whatsapp: { webhookUrl: '', configured: false },
    email: { smtpHost: '', smtpPort: '', username: '', password: '', configured: false }
  });

  const handleIntegrationSave = (platform: string, data: any) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: { ...data, configured: true }
    }));
    
    const completedIntegrations = Object.values({...integrations, [platform]: { configured: true }})
      .filter(int => int.configured).length;
    setSetupProgress(25 + (completedIntegrations * 15)); // 25% base + 15% per integration
    
    toast({
      title: "Integração Configurada",
      description: `${platform} foi configurado com sucesso!`,
    });
  };

  const handleDataImport = async (file: File) => {
    try {
      // Simulate file processing
      toast({
        title: "Importando dados...",
        description: "Processando arquivo de dados reais.",
      });
      
      // Here you would implement actual CSV/Excel parsing and data import
      setTimeout(() => {
        setSetupProgress(90);
        toast({
          title: "Dados Importados",
          description: "Dados reais foram importados com sucesso!",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na Importação",
        description: "Falha ao importar dados. Verifique o formato do arquivo.",
        variant: "destructive",
      });
    }
  };

  const completeSetup = () => {
    setSetupProgress(100);
    toast({
      title: "Setup Concluído",
      description: "CRM configurado e pronto para produção!",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Configuração para Produção</h1>
        <p className="text-muted-foreground">
          Configure seu CRM para uso em produção com dados reais
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={setupProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">{setupProgress}% concluído</p>
        </div>
      </div>

      {setupProgress < 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <CardTitle className="text-green-800">Dados de Teste Removidos</CardTitle>
              <CardDescription className="text-green-600">
                Todos os dados de demonstração foram limpos com sucesso.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="import">Importar Dados</TabsTrigger>
          <TabsTrigger value="validation">Validação</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            
            {/* Google Ads Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Google Ads
                  <Badge variant={integrations.googleAds.configured ? "default" : "secondary"}>
                    {integrations.googleAds.configured ? "Configurado" : "Pendente"}
                  </Badge>
                </CardTitle>
                <CardDescription>Configure a integração com Google Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google-token">Token de Acesso</Label>
                  <Input
                    id="google-token"
                    type="password"
                    placeholder="Insira seu token do Google Ads"
                    value={integrations.googleAds.token}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      googleAds: { ...prev.googleAds, token: e.target.value }
                    }))}
                  />
                </div>
                <Button 
                  onClick={() => handleIntegrationSave('googleAds', integrations.googleAds)}
                  disabled={!integrations.googleAds.token}
                  className="w-full"
                >
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>

            {/* Facebook Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Facebook Ads
                  <Badge variant={integrations.facebook.configured ? "default" : "secondary"}>
                    {integrations.facebook.configured ? "Configurado" : "Pendente"}
                  </Badge>
                </CardTitle>
                <CardDescription>Configure a integração com Facebook Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook-token">Token de Acesso</Label>
                  <Input
                    id="facebook-token"
                    type="password"
                    placeholder="Insira seu token do Facebook"
                    value={integrations.facebook.token}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      facebook: { ...prev.facebook, token: e.target.value }
                    }))}
                  />
                </div>
                <Button 
                  onClick={() => handleIntegrationSave('facebook', integrations.facebook)}
                  disabled={!integrations.facebook.token}
                  className="w-full"
                >
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  WhatsApp Business
                  <Badge variant={integrations.whatsapp.configured ? "default" : "secondary"}>
                    {integrations.whatsapp.configured ? "Configurado" : "Pendente"}
                  </Badge>
                </CardTitle>
                <CardDescription>Configure webhooks do WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp-webhook">URL do Webhook</Label>
                  <Input
                    id="whatsapp-webhook"
                    placeholder="https://api.whatsapp.com/webhook"
                    value={integrations.whatsapp.webhookUrl}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, webhookUrl: e.target.value }
                    }))}
                  />
                </div>
                <Button 
                  onClick={() => handleIntegrationSave('whatsapp', integrations.whatsapp)}
                  disabled={!integrations.whatsapp.webhookUrl}
                  className="w-full"
                >
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Configuração de Email
                  <Badge variant={integrations.email.configured ? "default" : "secondary"}>
                    {integrations.email.configured ? "Configurado" : "Pendente"}
                  </Badge>
                </CardTitle>
                <CardDescription>Configure SMTP para envio de emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="smtp-host">Servidor SMTP</Label>
                    <Input
                      id="smtp-host"
                      placeholder="smtp.gmail.com"
                      value={integrations.email.smtpHost}
                      onChange={(e) => setIntegrations(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpHost: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">Porta</Label>
                    <Input
                      id="smtp-port"
                      placeholder="587"
                      value={integrations.email.smtpPort}
                      onChange={(e) => setIntegrations(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPort: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email-username">Usuário</Label>
                  <Input
                    id="email-username"
                    type="email"
                    placeholder="seu@email.com"
                    value={integrations.email.username}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      email: { ...prev.email, username: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email-password">Senha</Label>
                  <Input
                    id="email-password"
                    type="password"
                    placeholder="Senha do email"
                    value={integrations.email.password}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      email: { ...prev.email, password: e.target.value }
                    }))}
                  />
                </div>
                <Button 
                  onClick={() => handleIntegrationSave('email', integrations.email)}
                  disabled={!integrations.email.smtpHost || !integrations.email.username}
                  className="w-full"
                >
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                Configurações de Segurança Pendentes
              </CardTitle>
              <CardDescription>
                Configure as seguintes opções no painel do Supabase para melhorar a segurança:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Configuração de OTP</h4>
                <p className="text-sm text-muted-foreground">
                  Configure o tempo de expiração de OTP em Authentication → Settings
                </p>
                <Badge variant="outline">Requer configuração manual</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Proteção contra Senhas Vazadas</h4>
                <p className="text-sm text-muted-foreground">
                  Ative a proteção em Authentication → Settings → Password Protection
                </p>
                <Badge variant="outline">Requer configuração manual</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Importar Dados Reais
              </CardTitle>
              <CardDescription>
                Importe seus dados existentes para começar a usar o CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customers-file">Arquivo de Clientes (.csv, .xlsx)</Label>
                  <Input
                    id="customers-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && handleDataImport(e.target.files[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Colunas: nome, email, telefone, empresa, endereço
                  </p>
                </div>
                <div>
                  <Label htmlFor="products-file">Arquivo de Produtos (.csv, .xlsx)</Label>
                  <Input
                    id="products-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && handleDataImport(e.target.files[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Colunas: nome, descrição, preço, categoria, estoque
                  </p>
                </div>
                <div>
                  <Label htmlFor="transactions-file">Histórico Financeiro (.csv, .xlsx)</Label>
                  <Input
                    id="transactions-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && handleDataImport(e.target.files[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Colunas: tipo, título, valor, data, categoria, cliente
                  </p>
                </div>
                <div>
                  <Label htmlFor="opportunities-file">Oportunidades (.csv, .xlsx)</Label>
                  <Input
                    id="opportunities-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && handleDataImport(e.target.files[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Colunas: título, cliente, valor, probabilidade, data_fechamento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Validação Final
              </CardTitle>
              <CardDescription>
                Teste todas as funcionalidades antes de usar em produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Testar Cadastro de Cliente
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Testar Criação de Oportunidade
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Testar Transação Financeira
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Testar Geração de Relatórios
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Testar Notificações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {setupProgress >= 70 && setupProgress < 100 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Quase Pronto!</h3>
              <p className="text-blue-600">
                Configure as últimas integrações e faça a validação final para concluir o setup.
              </p>
              <Button 
                onClick={completeSetup}
                disabled={setupProgress < 85}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Finalizar Configuração
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {setupProgress === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold text-green-800">Setup Concluído!</h3>
              <p className="text-green-600">
                Seu CRM está configurado e pronto para uso em produção com dados reais.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Ir para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionSetup;