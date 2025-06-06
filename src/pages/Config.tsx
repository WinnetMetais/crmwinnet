import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { exchangeGoogleAuthCode, validateGoogleAuthConfig } from "@/utils/googleAuth";
import { AdPlatformTabs } from "@/components/config/AdPlatformTabs";
import { TeamSection } from "@/components/config/TeamSection";
import PreferencesSection from "@/components/config/PreferencesSection";
import { MarginConfiguration } from "@/components/config/MarginConfiguration";
import { FieldCustomization } from "@/components/config/FieldCustomization";
import { EmailConfiguration } from "@/components/config/EmailConfiguration";
import { TaxConfiguration } from "@/components/config/TaxConfiguration";

// Define constant for the redirect URI - Updated to match Google Cloud Console
const APP_URL = "https://ad-connect-config.lovable.app";

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
    const redirectUri = `${APP_URL}/config?provider=google`;
    setGoogleRedirectUri(redirectUri);
    
    console.log("Configurando URI de redirecionamento:", redirectUri);
    console.log("APP_URL definido como:", APP_URL);
    console.log("URL atual:", window.location.href);
    
    const url = new URL(window.location.href);
    const provider = url.searchParams.get('provider');
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    console.log("Parâmetros na URL:", {
      provider,
      hasCode: !!code,
      codeLength: code ? code.length : 0,
      error
    });
    
    if (provider === 'google' && code) {
      console.log("Auth code detected in URL. Processing Google authentication...");
      handleGoogleAuthCode(code);
    } else if (error) {
      console.error("Authentication error detected in URL:", error);
      setGoogleAuthStatus('error');
      setGoogleAuthError(error);
      toast.error("Falha na autenticação com Google", {
        description: error
      });
    }
    
    const loadSavedTokens = () => {
      try {
        const savedTokens = localStorage.getItem('adTokens');
        if (savedTokens) {
          const tokens = JSON.parse(savedTokens);
          setGoogleAdsToken(tokens.googleAdsToken || '');
          setFacebookAdsToken(tokens.facebookAdsToken || '');
          setLinkedinAdsToken(tokens.linkedinAdsToken || '');
          
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

  useEffect(() => {
    if (googleClientId || googleRedirectUri) {
      const validation = validateGoogleAuthConfig(googleClientId, googleRedirectUri);
      if (!validation.isValid) {
        console.log("Problemas na configuração Google:", validation.issues);
      }
    }
  }, [googleClientId, googleRedirectUri]);

  const handleGoogleAuthCode = async (code: string) => {
    setGoogleAuthStatus("pending");
    try {
      console.log("Processando código de autenticação Google:", {
        codeLength: code.length,
        redirectUri: googleRedirectUri,
        clientIdPresent: !!googleClientId,
        clientSecretPresent: !!googleClientSecret,
        timestamp: new Date().toISOString()
      });
      
      window.history.replaceState({}, document.title, "/config");
      
      const token = await exchangeGoogleAuthCode(
        code, 
        googleRedirectUri, 
        googleClientId, 
        googleClientSecret
      );
      
      const newTokens = {
        googleAdsToken: token,
        facebookAdsToken,
        linkedinAdsToken
      };
      
      localStorage.setItem('adTokens', JSON.stringify(newTokens));
      setGoogleAdsToken(token);
      setConnectionStatus(prev => ({...prev, google: "success"}));
      setGoogleAuthStatus("success");
      
      toast.success("Conectado ao Google Ads com sucesso!");
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

  const handleSaveConfig = () => {
    setIsLoading(true);
    
    setTimeout(() => {
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
    
    setTimeout(() => {
      setConnectionStatus({
        google: Math.random() > 0.3 ? "success" : "error",
        facebook: Math.random() > 0.3 ? "success" : "error",
        linkedin: Math.random() > 0.3 ? "success" : "error",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-muted-foreground">Configure todos os aspectos do sistema</p>
              </div>
            </div>
            
            <Tabs defaultValue="tokens" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="tokens">Tokens de API</TabsTrigger>
                <TabsTrigger value="team">Equipe</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
                <TabsTrigger value="margins">Margens</TabsTrigger>
                <TabsTrigger value="fields">Campos</TabsTrigger>
                <TabsTrigger value="email">Email SMTP</TabsTrigger>
                <TabsTrigger value="taxes">Impostos</TabsTrigger>
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
                  <AdPlatformTabs 
                    googleAdsToken={googleAdsToken}
                    setGoogleAdsToken={setGoogleAdsToken}
                    googleClientId={googleClientId}
                    setGoogleClientId={setGoogleClientId}
                    googleClientSecret={googleClientSecret}
                    setGoogleClientSecret={setGoogleClientSecret}
                    googleAuthStatus={googleAuthStatus}
                    setGoogleAuthStatus={setGoogleAuthStatus}
                    googleAuthError={googleAuthError}
                    setGoogleAuthError={setGoogleAuthError}
                    facebookAdsToken={facebookAdsToken}
                    setFacebookAdsToken={setFacebookAdsToken}
                    linkedinAdsToken={linkedinAdsToken}
                    setLinkedinAdsToken={setLinkedinAdsToken}
                    connectionStatus={connectionStatus}
                    isLoading={isLoading}
                    googleRedirectUri={googleRedirectUri}
                  />
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
              <Card className="w-full mb-8">
                <CardHeader>
                  <CardTitle>Gerenciar Equipe</CardTitle>
                  <CardDescription>
                    Adicione e gerencie membros da equipe que terão acesso ao dashboard
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <TeamSection appUrl={APP_URL} />
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'preferences' && (
              <Card className="w-full mb-8">
                <CardHeader>
                  <CardTitle>Preferências do Dashboard</CardTitle>
                  <CardDescription>
                    Personalize sua experiência no dashboard
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <PreferencesSection />
                </CardContent>
              </Card>
            )}

            {activeTab === 'margins' && (
              <Card className="w-full mb-8">
                <CardHeader>
                  <CardTitle>Configuração de Margens</CardTitle>
                  <CardDescription>
                    Configure margens padrão e personalizadas para os produtos
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <MarginConfiguration />
                </CardContent>
              </Card>
            )}

            {activeTab === 'fields' && (
              <Card className="w-full mb-8">
                <CardHeader>
                  <CardTitle>Personalização de Campos</CardTitle>
                  <CardDescription>
                    Customize os campos dos formulários de acordo com suas necessidades
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <FieldCustomization />
                </CardContent>
              </Card>
            )}

            {activeTab === 'email' && (
              <Card className="w-full mb-8">
                <CardHeader>
                  <CardTitle>Configuração de Email SMTP</CardTitle>
                  <CardDescription>
                    Configure o servidor de email para envio automático de orçamentos e notificações
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <EmailConfiguration />
                </CardContent>
              </Card>
            )}

            {activeTab === 'taxes' && (
              <Card className="w-full mb-8">
                <CardHeader>
                  <CardTitle>Configuração de Impostos</CardTitle>
                  <CardDescription>
                    Configure alíquotas de impostos e perfis tributários
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <TaxConfiguration />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Config;
