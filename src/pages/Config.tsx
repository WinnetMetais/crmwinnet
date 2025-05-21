import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { exchangeGoogleAuthCode } from "@/utils/googleAuth";
import { AdPlatformTabs } from "@/components/config/AdPlatformTabs";
import { TeamSection } from "@/components/config/TeamSection";
import PreferencesSection from "@/components/config/PreferencesSection";

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
    // Use the fixed APP_URL instead of window.location.origin
    setGoogleRedirectUri(`${APP_URL}/config?provider=google`);
    
    // Check for authentication response in the URL
    const url = new URL(window.location.href);
    const provider = url.searchParams.get('provider');
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
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
      
      // Exchange the code for tokens using a extracted utility function
      const token = await exchangeGoogleAuthCode(
        code, 
        googleRedirectUri, 
        googleClientId, 
        googleClientSecret
      );
      
      // Save the token
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
    </div>
  );
};

export default Config;
