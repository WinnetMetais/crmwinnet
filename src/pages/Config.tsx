import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Loader, AlertTriangle, Copy, ArrowRight, UserPlus, ExternalLink, Info } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Config = () => {
  const [googleAdsToken, setGoogleAdsToken] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleAuthStatus, setGoogleAuthStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [facebookAdsToken, setFacebookAdsToken] = useState('');
  const [linkedinAdsToken, setLinkedinAdsToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');
  const [googleRedirectUri, setGoogleRedirectUri] = useState('');
  
  const [connectionStatus, setConnectionStatus] = useState<{
    google?: "success" | "error" | "pending" | null,
    facebook?: "success" | "error" | "pending" | null,
    linkedin?: "success" | "error" | "pending" | null,
  }>({});

  useEffect(() => {
    // Set the redirect URI based on the current environment
    const host = window.location.origin;
    setGoogleRedirectUri(`${host}/config?provider=google`);
    
    // Check for authentication response in the URL
    const url = new URL(window.location.href);
    const provider = url.searchParams.get('provider');
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    if (provider === 'google' && code) {
      handleGoogleAuthCode(code);
    } else if (error) {
      setGoogleAuthStatus('error');
      setGoogleAuthError(error);
      toast.error("Falha na autenticação com Google", {
        description: error
      });
    }
    
    // Load stored tokens from localStorage
    const loadSavedTokens = () => {
      try {
        const savedTokens = localStorage.getItem('adTokens');
        if (savedTokens) {
          const tokens = JSON.parse(savedTokens);
          setGoogleAdsToken(tokens.googleAdsToken || '');
          setFacebookAdsToken(tokens.facebookAdsToken || '');
          setLinkedinAdsToken(tokens.linkedinAdsToken || '');
          
          // Check if Google is connected
          if (tokens.googleAdsToken) {
            setConnectionStatus(prev => ({...prev, google: "success"}));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar tokens salvos", error);
      }
    };
    
    loadSavedTokens();
  }, []);

  const handleGoogleAuthCode = async (code: string) => {
    setGoogleAuthStatus("pending");
    try {
      // Clear the URL to avoid re-authorization if page is refreshed
      window.history.replaceState({}, document.title, "/config");
      
      // Exchange the code for tokens using Supabase edge function
      const { data, error } = await supabase.functions.invoke('exchange-google-auth-code', {
        body: { 
          code,
          redirectUri: googleRedirectUri,
          clientId: googleClientId,
          clientSecret: googleClientSecret
        }
      });
      
      if (error) throw error;
      
      if (data && data.access_token) {
        // Save the token
        const newTokens = {
          googleAdsToken: data.access_token,
          facebookAdsToken,
          linkedinAdsToken
        };
        
        localStorage.setItem('adTokens', JSON.stringify(newTokens));
        setGoogleAdsToken(data.access_token);
        setConnectionStatus(prev => ({...prev, google: "success"}));
        setGoogleAuthStatus("success");
        
        toast.success("Conectado ao Google Ads com sucesso!");
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (error: any) {
      console.error("Erro na autenticação Google:", error);
      setConnectionStatus(prev => ({...prev, google: "error"}));
      setGoogleAuthStatus("error");
      setGoogleAuthError(error.message || "Erro desconhecido");
      toast.error("Falha na conexão com Google Ads", {
        description: error.message
      });
    }
  };

  const initiateGoogleAuth = () => {
    if (!googleClientId) {
      toast.error("O Client ID é necessário para autenticação");
      return;
    }

    // Google OAuth configuration
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', googleClientId);
    authUrl.searchParams.append('redirect_uri', googleRedirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    // Redirect to Google's auth page
    window.location.href = authUrl.toString();
  };

  const handleSaveConfig = () => {
    setIsLoading(true);
    
    // Simulation for frontend only demonstration
    setTimeout(() => {
      // Save to localStorage for demonstration purposes
      localStorage.setItem('adTokens', JSON.stringify({
        googleAdsToken,
        facebookAdsToken,
        linkedinAdsToken,
      }));
      
      toast.success("Configurações salvas com sucesso!");
      setIsLoading(false);
    }, 1500);
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus({
      google: "pending",
      facebook: "pending", 
      linkedin: "pending"
    });
    
    // Simulation for frontend only demonstration
    setTimeout(() => {
      // Simulate random success/failure for demonstration
      setConnectionStatus({
        google: Math.random() > 0.3 ? "success" : "error",
        facebook: Math.random() > 0.3 ? "success" : "error",
        linkedin: Math.random() > 0.3 ? "success" : "error",
      });
      setIsLoading(false);
    }, 2000);
  };

  const renderStatusBadge = (status: "success" | "error" | "pending" | null | undefined) => {
    if (status === "success") {
      return <Badge className="ml-2 bg-green-500"><Check className="h-3 w-3 mr-1" /> Conectado</Badge>;
    } else if (status === "error") {
      return <Badge className="ml-2 bg-red-500"><AlertTriangle className="h-3 w-3 mr-1" /> Erro</Badge>;
    } else if (status === "pending") {
      return <Badge className="ml-2 bg-yellow-500"><Loader className="h-3 w-3 mr-1 animate-spin" /> Testando</Badge>;
    }
    return null;
  };

  const teamForm = useForm({
    defaultValues: {
      role: "editor",
      notifications: true,
    }
  });

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText('https://winnet-metais-insight-hub.lovable.app/invite/abc123');
    toast.success("Link de convite copiado para a área de transferência!");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="tokens" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="tokens">Tokens de API</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab === 'tokens' && (
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Tokens de API</CardTitle>
            <CardDescription>
              Configure seus tokens de acesso para integração com plataformas de anúncios
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="google" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="google">Google Ads</TabsTrigger>
                <TabsTrigger value="facebook">Facebook/Instagram</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              </TabsList>
              
              <TabsContent value="google">
                <div className="space-y-6">
                  {googleAuthStatus === "error" && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Erro na autenticação</AlertTitle>
                      <AlertDescription>
                        {googleAuthError || "Ocorreu um erro durante a autenticação com Google Ads."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      Google Ads Client ID {renderStatusBadge(connectionStatus.google)}
                    </label>
                    <Input 
                      type="text"
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value)}
                      placeholder="Seu Client ID do Google Cloud Console"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      O Client ID pode ser obtido no console do Google Cloud.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      Google Ads Client Secret
                    </label>
                    <Input 
                      type="password"
                      value={googleClientSecret}
                      onChange={(e) => setGoogleClientSecret(e.target.value)}
                      placeholder="Seu Client Secret do Google Cloud Console"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      O Client Secret é necessário para a autenticação OAuth.
                    </p>
                  </div>

                  {googleAdsToken && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center">
                        Token de Acesso (Atual)
                      </label>
                      <div className="p-2 bg-slate-50 border rounded-md">
                        <span className="text-sm font-mono truncate block">
                          {googleAdsToken.substring(0, 15)}...{googleAdsToken.substring(googleAdsToken.length - 10)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={initiateGoogleAuth}
                    className="mt-4"
                    disabled={!googleClientId || !googleClientSecret || isLoading}
                  >
                    {(isLoading || googleAuthStatus === "pending") ? 
                      <Loader className="h-4 w-4 mr-2 animate-spin" /> : 
                      <ExternalLink className="h-4 w-4 mr-2" />}
                    Conectar com Google Ads
                  </Button>

                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="googleTroubleshooting">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2 text-blue-600" />
                          Solução de problemas
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm text-slate-700 pl-4 border-l-2 border-slate-200">
                          <p className="font-medium">Se estiver tendo problemas com a autenticação do Google:</p>
                          
                          <div>
                            <p className="font-medium">1. Verifique os logs da Edge Function</p>
                            <p className="text-xs text-muted-foreground">
                              Acesse os logs da função "exchange-google-auth-code" no console do Supabase para ver mensagens de erro do servidor.
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">2. Verifique os logs do navegador</p>
                            <p className="text-xs text-muted-foreground">
                              Abra o console do navegador (F12) enquanto tenta fazer a autenticação para ver mensagens de erro do lado do cliente.
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">3. Confirme as credenciais</p>
                            <p className="text-xs text-muted-foreground">
                              Certifique-se de que o Client ID e Client Secret que você está inserindo no formulário coincidem exatamente com os valores do Google Cloud Console.
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">4. Verifique as APIs ativadas</p>
                            <p className="text-xs text-muted-foreground">
                              No Google Cloud Console, vá para a seção "APIs e Serviços" > "APIs Ativadas" e confirme que as APIs do Google Ads estão ativadas.
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">5. Teste com a URL específica</p>
                            <p className="text-xs text-muted-foreground">
                              Use exatamente a mesma URL que está configurada nas URIs de redirecionamento autorizado ao tentar fazer a autenticação.
                            </p>
                            <p className="mt-1 text-xs font-mono">URI atual: {googleRedirectUri}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="facebook">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    Facebook/Instagram Ads Access Token {renderStatusBadge(connectionStatus.facebook)}
                  </label>
                  <Input 
                    type="text"
                    value={facebookAdsToken}
                    onChange={(e) => setFacebookAdsToken(e.target.value)}
                    placeholder="Insira seu token de acesso do Facebook Ads"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    O token pode ser obtido no Facebook Developers.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="linkedin">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    LinkedIn Ads Access Token {renderStatusBadge(connectionStatus.linkedin)}
                  </label>
                  <Input 
                    type="text"
                    value={linkedinAdsToken}
                    onChange={(e) => setLinkedinAdsToken(e.target.value)}
                    placeholder="Insira seu token de acesso do LinkedIn Ads"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    O token pode ser obtido no LinkedIn Marketing Developer Platform.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <Separator />
          
          <CardFooter className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
              Testar Conexões
            </Button>
            <Button 
              onClick={handleSaveConfig}
              disabled={isLoading}
            >
              {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
              Salvar Configuração
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {activeTab === 'team' && (
        <div className="space-y-6">
          <Card className="w-full mb-8">
            <CardHeader>
              <CardTitle>Gerenciar Equipe</CardTitle>
              <CardDescription>
                Adicione e gerencie membros da equipe que terão acesso ao dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">Convidar Membros</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Convide novos membros para acessar o dashboard
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyInviteLink}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                      </Button>
                      <Button size="sm">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                  
                  <Form {...teamForm}>
                    <form className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <h3 className="font-medium">Configurações de Convite</h3>
                        <p className="text-sm text-muted-foreground">
                          Ajuste as permissões para novos membros
                        </p>
                      </div>
                      <div className="space-y-4">
                        <FormField
                          control={teamForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Função padrão</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a função" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="viewer">Visualizador</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Define as permissões iniciais
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={teamForm.control}
                          name="notifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Notificações</FormLabel>
                                <FormDescription>
                                  Enviar notificações de convite
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </div>
                
                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="font-medium">Membros da Equipe</h3>
                  </div>
                  <div className="border-t">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">AM</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Ana Marques</p>
                          <p className="text-xs text-muted-foreground">ana@winnetmetais.com.br</p>
                        </div>
                      </div>
                      <Badge>Administrador</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">JC</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">João Costa</p>
                          <p className="text-xs text-muted-foreground">joao@agencia4k.com.br</p>
                        </div>
                      </div>
                      <Badge variant="outline">Editor</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <Card className="w-full mb-8">
            <CardHeader>
              <CardTitle>Preferências do Dashboard</CardTitle>
              <CardDescription>
                Personalize sua experiência no dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Configurações de Exibição</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Gráficos Interativos</p>
                        <p className="text-sm text-muted-foreground">Habilitar animações em gráficos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Modo Compacto</p>
                        <p className="text-sm text-muted-foreground">Reduzir espaçamento entre elementos</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Notificações</p>
                        <p className="text-sm text-muted-foreground">Receber alertas de desempenho</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Métricas em Tempo Real</p>
                        <p className="text-sm text-muted-foreground">Atualizar dados a cada 5 minutos</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Relatórios Automáticos</h3>
                  <div className="rounded-lg border p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Envio de Relatórios</p>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Frequência</label>
                          <Select defaultValue="weekly">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Formato</label>
                          <Select defaultValue="pdf">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-6">
              <Button>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Config;
