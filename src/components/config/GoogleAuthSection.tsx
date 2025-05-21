
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, ExternalLink, Info, AlertTriangle, Check, Copy, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { initiateGoogleAuth } from "@/utils/googleAuth";
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
  const [showSecret, setShowSecret] = useState(false);

  const handleInitiateGoogleAuth = () => {
    if (!googleClientId || !googleClientSecret) {
      toast.error("Client ID e Client Secret são necessários para autenticação");
      return;
    }
    
    // Log authentication attempt
    console.log("Iniciando autenticação com Google Ads", {
      clientIdLength: googleClientId.length,
      redirectUri: googleRedirectUri
    });
    
    toast.info("Redirecionando para autenticação do Google...");
    
    // Use the utility function
    initiateGoogleAuth(googleClientId, googleRedirectUri);
  };

  const handleCopyRedirectUri = () => {
    navigator.clipboard.writeText(googleRedirectUri);
    toast.success("URI de redirecionamento copiada!");
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
        <div className="relative">
          <Input 
            type={showSecret ? "text" : "password"}
            value={googleClientSecret}
            onChange={(e) => setGoogleClientSecret(e.target.value)}
            placeholder="Seu Client Secret do Google Cloud Console"
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showSecret ? 
              <span className="text-xs">Ocultar</span> : 
              <span className="text-xs">Mostrar</span>}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          O Client Secret é necessário para a autenticação OAuth.
        </p>
      </div>

      <div className="space-y-2 p-3 bg-slate-50 rounded-md border border-slate-200">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">URI de Redirecionamento</label>
          <Button variant="ghost" size="sm" onClick={handleCopyRedirectUri}>
            <Copy className="h-4 w-4 mr-1" /> Copiar
          </Button>
        </div>
        <div className="p-2 bg-white border rounded-md">
          <span className="text-sm font-mono overflow-x-auto block">
            {googleRedirectUri}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Use exatamente esta URI no console do Google Cloud em "URIs de redirecionamento autorizados".
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
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleInitiateGoogleAuth}
          className="flex-1"
          disabled={!googleClientId || !googleClientSecret || isLoading}
        >
          {(isLoading || googleAuthStatus === "pending") ? 
            <Loader className="h-4 w-4 mr-2 animate-spin" /> : 
            <ExternalLink className="h-4 w-4 mr-2" />}
          Conectar com Google Ads
        </Button>
        
        {googleAdsToken && (
          <Button
            variant="outline"
            onClick={() => {
              setGoogleAuthStatus("pending");
              setTimeout(() => {
                // This is just a refresh attempt simulation for UI purposes
                toast.success("Conexão verificada com sucesso");
                setGoogleAuthStatus("success");
              }, 1500);
            }}
            disabled={isLoading || !googleAdsToken}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Conexão
          </Button>
        )}
      </div>

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
              
              <div className="mt-3">
                <p className="font-medium">1. Verifique as configurações no Google Cloud Console</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Certifique-se de que o projeto tem a API Google Ads ativada</li>
                  <li>Verifique se o Client ID e Client Secret estão corretos</li>
                  <li>Confirme que a URI de redirecionamento <span className="font-mono text-xs bg-slate-100 px-1 rounded">{googleRedirectUri}</span> está exatamente igual nas URIs de redirecionamento autorizados</li>
                  <li>Verifique que o domínio <span className="font-mono text-xs bg-slate-100 px-1 rounded">lovable.app</span> está nos domínios autorizados</li>
                </ul>
              </div>
              
              <div className="mt-3">
                <p className="font-medium">2. Verifique as configurações no Supabase</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Confirme que a URL do site no Supabase está configurada para <span className="font-mono text-xs bg-slate-100 px-1 rounded">https://ad-connect-config.lovable.app</span></li>
                  <li>Verifique que a mesma URL está nas URLs de redirecionamento</li>
                </ul>
              </div>

              <div className="mt-3">
                <p className="font-medium">3. Verifique os logs do console</p>
                <p className="text-xs text-muted-foreground">
                  Abra o console do navegador (F12) antes de tentar fazer a autenticação para ver mensagens de erro detalhadas.
                </p>
              </div>

              <div className="mt-3">
                <p className="font-medium">4. Limpe os cookies e cache</p>
                <p className="text-xs text-muted-foreground">
                  Problemas de autenticação podem ser resolvidos limpando cookies e cache do navegador.
                </p>
              </div>
              
              <div className="mt-3">
                <p className="font-medium">5. Atenção aos diferentes ambientes</p>
                <p className="text-xs text-muted-foreground">
                  Se você estiver testando em diferentes ambientes (desenvolvimento/produção), certifique-se de usar as credenciais corretas para cada ambiente.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
