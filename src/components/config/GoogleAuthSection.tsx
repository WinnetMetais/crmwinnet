
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, ExternalLink, Info, AlertTriangle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GoogleAuthSectionProps {
  googleAdsToken: string;
  setGoogleAdsToken: (token: string) => void;
  googleClientId: string;
  setGoogleClientId: (id: string) => void;
  googleClientSecret: string;
  setGoogleClientSecret: (secret: string) => void;
  googleAuthStatus: "success" | "error" | "pending" | null;
  setGoogleAuthStatus: (status: "success" | "error" | "pending" | null) => void;
  googleAuthError: string | null;
  setGoogleAuthError: (error: string | null) => void;
  connectionStatus: { google?: "success" | "error" | "pending" | null };
  isLoading: boolean;
  googleRedirectUri: string;
}

export const GoogleAuthSection: React.FC<GoogleAuthSectionProps> = ({
  googleAdsToken,
  setGoogleAdsToken,
  googleClientId,
  setGoogleClientId,
  googleClientSecret,
  setGoogleClientSecret,
  googleAuthStatus,
  setGoogleAuthStatus,
  googleAuthError,
  setGoogleAuthError,
  connectionStatus,
  isLoading,
  googleRedirectUri,
}) => {
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

  return (
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
                  Acesse os logs da função "exchange-google-auth-code" no console do Supabase para ver mensagens de erro desenvolvidas.
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
                  Certifique-se de que o Client ID e Client Secret que você está inserindo no formulário específico exatamente aos valores do Google Cloud Console.
                </p>
              </div>

              <div>
                <p className="font-medium">4. Verifique as APIs ativadas</p>
                <p className="text-xs text-muted-foreground">
                  No Google Cloud Console, vá para a seção "APIs e Serviços" {'>'} "APIs Ativadas" e confirme que as APIs do Google Ads estão ativadas.
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
  );
};
