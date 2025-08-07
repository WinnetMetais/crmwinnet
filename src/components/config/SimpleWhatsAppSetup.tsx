import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, QrCode, Smartphone, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const SimpleWhatsAppSetup = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generateQRCode = async () => {
    setConnectionStatus('connecting');
    
    // Simular geração de QR Code
    setTimeout(() => {
      const fakeQRCode = `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="20" height="20" fill="black"/>
          <rect x="60" y="20" width="20" height="20" fill="black"/>
          <rect x="100" y="20" width="20" height="20" fill="black"/>
          <rect x="140" y="20" width="20" height="20" fill="black"/>
          <text x="100" y="110" text-anchor="middle" fill="black" font-size="12">QR Code para</text>
          <text x="100" y="130" text-anchor="middle" fill="black" font-size="12">WhatsApp Web</text>
        </svg>
      `)}`;
      setQrCode(fakeQRCode);
      
      // Simular conexão após 10 segundos
      setTimeout(() => {
        setConnectionStatus('connected');
        toast({
          title: "WhatsApp Conectado!",
          description: "Seu WhatsApp foi conectado com sucesso ao CRM.",
        });
      }, 10000);
    }, 2000);
  };

  const disconnect = () => {
    setConnectionStatus('disconnected');
    setQrCode(null);
    toast({
      title: "WhatsApp Desconectado",
      description: "A conexão com o WhatsApp foi removida.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conexão Simples com WhatsApp
          </CardTitle>
          <CardDescription>
            Conecte seu WhatsApp pessoal ou comercial de forma rápida e fácil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qr-code" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="qr-code" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Integrações
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                App Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr-code" className="space-y-4">
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  <strong>Método mais simples:</strong> Conecte escaneando um QR Code com seu celular, igual ao WhatsApp Web.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg">
                {connectionStatus === 'disconnected' && (
                  <>
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Pronto para conectar</h3>
                      <p className="text-sm text-muted-foreground">
                        Clique no botão abaixo para gerar o QR Code
                      </p>
                    </div>
                    <Button onClick={generateQRCode} className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Gerar QR Code
                    </Button>
                  </>
                )}

                {connectionStatus === 'connecting' && qrCode && (
                  <>
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Escaneie o QR Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Abra o WhatsApp no seu celular e escaneie o código
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-primary/20 p-4 rounded-lg">
                      <img src={qrCode} alt="QR Code para WhatsApp" className="w-48 h-48" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Aguardando conexão...
                    </div>
                  </>
                )}

                {connectionStatus === 'connected' && (
                  <>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-semibold">Conectado com sucesso!</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      WhatsApp Ativo
                    </Badge>
                    <Button variant="outline" onClick={disconnect}>
                      Desconectar
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Como funciona:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Clique em "Gerar QR Code"</li>
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Toque nos três pontos → "Aparelhos conectados"</li>
                  <li>Toque em "Conectar um aparelho"</li>
                  <li>Escaneie o QR Code que aparece aqui</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ferramentas prontas:</strong> Use plataformas que já fazem a integração para você.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Zapier + WhatsApp</CardTitle>
                    <CardDescription>Conecte automaticamente mensagens do WhatsApp ao CRM</CardDescription>
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
                    <CardTitle className="text-lg">Make (Integromat)</CardTitle>
                    <CardDescription>Automação visual entre WhatsApp e seu CRM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-blue-600">Gratuito até 1.000 operações</p>
                        <p className="text-sm text-muted-foreground">Interface visual intuitiva</p>
                      </div>
                      <Button asChild>
                        <a href="https://www.make.com/en/integrations/whatsapp" target="_blank" rel="noopener">
                          Conectar <ArrowRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">ChatWoot</CardTitle>
                    <CardDescription>Plataforma de atendimento com WhatsApp integrado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-purple-600">Open Source</p>
                        <p className="text-sm text-muted-foreground">Solução completa de atendimento</p>
                      </div>
                      <Button asChild>
                        <a href="https://www.chatwoot.com/" target="_blank" rel="noopener">
                          Conhecer <ArrowRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-4">
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  <strong>Em desenvolvimento:</strong> App mobile para sincronizar mensagens automaticamente.
                </AlertDescription>
              </Alert>

              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">App Mobile em Breve</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estamos desenvolvendo um app que sincroniza automaticamente suas mensagens do WhatsApp com o CRM.
                  </p>
                </div>
                <Badge variant="outline">Em desenvolvimento</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};