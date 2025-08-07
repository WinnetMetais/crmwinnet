import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, QrCode, Smartphone, Zap, CheckCircle, ArrowRight, Webhook, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SimpleWhatsAppSetup = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');

  // Gerar QR Code usando uma biblioteca online
  const generateQRCode = async () => {
    setConnectionStatus('connecting');
    setQrCode(null);
    
    console.log('Gerando QR Code...');
    
    try {
      // Usar QR Server API para gerar um QR Code real
      const qrText = `https://wa.me/qr/DEMO${Date.now()}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
      
      setQrCode(qrCodeUrl);
      
      toast({
        title: "QR Code Gerado",
        description: "QR Code criado! Este é apenas um exemplo - para uso real, configure a API do WhatsApp.",
      });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar o QR Code. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const simulateConnection = () => {
    setConnectionStatus('connected');
    toast({
      title: "WhatsApp Conectado!",
      description: "Simulação de conexão bem-sucedida. Para uso real, configure a API oficial.",
    });
  };

  const disconnect = () => {
    setConnectionStatus('disconnected');
    setQrCode(null);
    toast({
      title: "WhatsApp Desconectado",
      description: "A conexão foi removida.",
    });
  };

  const copyWebhookUrl = () => {
    const url = 'https://fgabadpelymhgvbtemwa.functions.supabase.co/functions/v1/whatsapp-webhook';
    navigator.clipboard.writeText(url);
    setWebhookUrl(url);
    toast({
      title: "URL Copiada",
      description: "URL do webhook copiada para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Integração WhatsApp Simplificada
          </CardTitle>
          <CardDescription>
            Conecte seu WhatsApp de forma fácil e rápida ao seu CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qr-code" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="qr-code" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code Demo
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                Webhook
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Integrações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr-code" className="space-y-4">
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demonstração:</strong> Este é um exemplo de como funcionaria o QR Code. Para uso real, você precisa configurar a API oficial do WhatsApp Business.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg">
                {connectionStatus === 'disconnected' && (
                  <>
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Pronto para conectar</h3>
                      <p className="text-sm text-muted-foreground">
                        Clique no botão abaixo para gerar um QR Code de demonstração
                      </p>
                    </div>
                    <Button onClick={generateQRCode} className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Gerar QR Code Demo
                    </Button>
                  </>
                )}

                {connectionStatus === 'connecting' && qrCode && (
                  <>
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">QR Code de Demonstração</h3>
                      <p className="text-sm text-muted-foreground">
                        Este é um exemplo de como apareceria o QR Code real
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-primary/20 p-4 rounded-lg">
                      <img 
                        src={qrCode} 
                        alt="QR Code Demo para WhatsApp" 
                        className="w-48 h-48"
                        onError={(e) => {
                          console.error('Erro ao carregar QR Code');
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDg5IiBmb250LXNpemU9IjE0cHgiPkVycm8gYW8gY2FycmVnYXI8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Aguardando conexão...
                    </div>
                    <Button onClick={simulateConnection} variant="outline" size="sm">
                      Simular Conexão (Demo)
                    </Button>
                  </>
                )}

                {connectionStatus === 'connected' && (
                  <>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-semibold">Conexão Simulada!</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Demo Ativo
                    </Badge>
                    <Button variant="outline" onClick={disconnect}>
                      Desconectar
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Para usar de verdade:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Configure uma conta no WhatsApp Business API</li>
                  <li>Obtenha as credenciais necessárias</li>
                  <li>Configure o webhook (veja aba "Webhook")</li>
                  <li>Use a aba "Configuração Avançada" para inserir suas credenciais</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="webhook" className="space-y-4">
              <Alert>
                <Webhook className="h-4 w-4" />
                <AlertDescription>
                  <strong>Webhook URL:</strong> Use esta URL para configurar o webhook no Facebook Developers Console.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">URL do Webhook (Pronta para usar)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="webhook-url"
                      value="https://fgabadpelymhgvbtemwa.functions.supabase.co/functions/v1/whatsapp-webhook"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyWebhookUrl}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Como configurar:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Acesse <a href="https://developers.facebook.com/apps" target="_blank" className="text-primary hover:underline">Facebook Developers</a></li>
                    <li>Vá para seu app → WhatsApp → Configuration</li>
                    <li>Cole a URL do webhook acima</li>
                    <li>Defina um Verify Token (anote-o para usar na configuração avançada)</li>
                    <li>Clique em "Verify and Save"</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Alternativas mais simples:</strong> Use ferramentas prontas que fazem a integração para você.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Zapier + WhatsApp</CardTitle>
                    <CardDescription>A forma mais fácil de conectar WhatsApp ao seu CRM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-green-600">Gratuito até 100 ações/mês</p>
                        <p className="text-sm text-muted-foreground">Configuração em 5 minutos</p>
                      </div>
                      <Button asChild>
                        <a href="https://zapier.com/apps/whatsapp/integrations" target="_blank" rel="noopener">
                          Conectar <ArrowRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Typebot + WhatsApp</CardTitle>
                    <CardDescription>Chatbots para WhatsApp com integração ao CRM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-blue-600">Plano gratuito disponível</p>
                        <p className="text-sm text-muted-foreground">Interface visual para criar bots</p>
                      </div>
                      <Button asChild>
                        <a href="https://typebot.io" target="_blank" rel="noopener">
                          Conhecer <ArrowRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};