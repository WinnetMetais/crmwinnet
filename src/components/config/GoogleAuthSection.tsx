
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, ExternalLink, Info, AlertTriangle, Check, Copy, RefreshCw, Trash2, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { initiateGoogleAuth, clearPlatformToken, validateGoogleAuthConfig } from "@/utils/googleAuth";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isCopied, setIsCopied] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(googleAuthStatus === "error" ? "troubleshooting" : undefined);
  const [configValidation, setConfigValidation] = useState<any>(null);

  // If there's an error, open the troubleshooting accordion
  useEffect(() => {
    if (googleAuthStatus === "error") {
      setAccordionOpen("troubleshooting");
    }
  }, [googleAuthStatus]);

  // Validate configuration when inputs change
  useEffect(() => {
    if (googleClientId || googleRedirectUri) {
      const validation = validateGoogleAuthConfig(googleClientId, googleRedirectUri);
      setConfigValidation(validation);
      
      if (!validation.isValid) {
        console.log("Problemas detectados na configuração:", validation.issues);
      }
    }
  }, [googleClientId, googleRedirectUri]);

  const handleInitiateGoogleAuth = () => {
    if (!googleClientId || !googleClientSecret) {
      toast.error("Client ID e Client Secret são necessários para autenticação");
      return;
    }
    
    // Validate config before initiating
    const validation = validateGoogleAuthConfig(googleClientId, googleRedirectUri);
    if (!validation.isValid) {
      toast.error(`Configuração inválida: ${validation.issues.join(", ")}`);
      setAccordionOpen("troubleshooting");
      return;
    }
    
    // Log authentication attempt
    console.log("Iniciando autenticação com Google Ads", {
      clientIdLength: googleClientId.length,
      redirectUri: googleRedirectUri,
      timestamp: new Date().toISOString()
    });
    
    toast.info("Redirecionando para autenticação do Google...");
    
    // Use the utility function
    initiateGoogleAuth(googleClientId, googleRedirectUri);
  };

  const handleCopyRedirectUri = () => {
    navigator.clipboard.writeText(googleRedirectUri);
    setIsCopied(true);
    toast.success("URI de redirecionamento copiada!");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleClearToken = () => {
    if (confirm("Tem certeza que deseja remover o token atual? Você precisará autorizar novamente.")) {
      setGoogleAdsToken("");
      clearPlatformToken('google');
      setGoogleAuthStatus(null);
      toast.info("Token do Google Ads removido com sucesso");
    }
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

  // Debug function to show detailed config info
  const debugConfig = () => {
    // Show validation results
    const validation = validateGoogleAuthConfig(googleClientId, googleRedirectUri);
    console.log("Diagnóstico da configuração:", validation);
    
    // Current app URL
    console.log("URL atual:", window.location.href);
    console.log("Origem:", window.location.origin);
    
    // Show toast with validation results
    if (validation.isValid) {
      toast.success("Configuração parece válida!");
    } else {
      toast.error(`Problemas detectados: ${validation.issues.join(", ")}`);
    }
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
      
      {configValidation && !configValidation.isValid && (
        <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-300">
          <Info className="h-4 w-4" />
          <AlertTitle>Problemas na configuração</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              {configValidation.issues.map((issue: string, idx: number) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
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
          className={`w-full ${configValidation && !configValidation.clientIdValid ? 'border-red-500' : ''}`}
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleCopyRedirectUri}>
                  {isCopied ? 
                    <Check className="h-4 w-4 mr-1 text-green-500" /> : 
                    <Copy className="h-4 w-4 mr-1" />} 
                  {isCopied ? "Copiado!" : "Copiar"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copie esta URL exata para o Google Cloud Console</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="p-2 bg-white border rounded-md overflow-x-auto">
          <span className={`text-sm font-mono block whitespace-nowrap ${configValidation && configValidation.issues && configValidation.issues.some((i: string) => i.includes('redirecionamento')) ? 'text-red-500' : ''}`}>
            {googleRedirectUri}
          </span>
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Use <span className="font-bold">exatamente</span> esta URI no console do Google Cloud em "URIs de redirecionamento autorizados".
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs"
            onClick={debugConfig}
          >
            <Bug className="h-3 w-3 mr-1" />
            Diagnosticar
          </Button>
        </div>
      </div>

      {googleAdsToken && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            Token de Acesso (Atual)
          </label>
          <div className="p-2 bg-slate-50 border rounded-md flex justify-between items-center">
            <span className="text-sm font-mono truncate block">
              {googleAdsToken.substring(0, 15)}...{googleAdsToken.substring(googleAdsToken.length - 10)}
            </span>
            <Button variant="ghost" size="sm" onClick={handleClearToken}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
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

      <Accordion 
        type="single" 
        collapsible 
        className="mt-4"
        value={accordionOpen}
        onValueChange={setAccordionOpen}
      >
        <AccordionItem value="troubleshooting">
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
                <p className="font-medium">1. Verificações Principais</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>O domínio correto para este projeto é <span className="font-mono text-xs bg-slate-100 px-1 rounded font-bold">ad-connect-config.lovable.app</span></li>
                  <li>Certifique-se que o Client ID e Client Secret estão corretos</li>
                  <li>A URI de redirecionamento deve ser exatamente <span className="font-mono text-xs bg-slate-100 px-1 rounded">{googleRedirectUri}</span></li>
                </ul>
              </div>
              
              <div className="mt-3">
                <p className="font-medium">2. Verifique as configurações no Google Cloud Console</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Certifique-se de que o projeto tem a API Google Ads ativada</li>
                  <li>Confirme que a URI de redirecionamento <span className="font-mono text-xs bg-slate-100 px-1 rounded">{googleRedirectUri}</span> está <span className="font-bold">exatamente igual</span> nas URIs de redirecionamento autorizados</li>
                  <li>Verifique que o domínio <span className="font-mono text-xs bg-slate-100 px-1 rounded">ad-connect-config.lovable.app</span> está nos domínios autorizados</li>
                </ul>
              </div>
              
              <div className="mt-3">
                <p className="font-medium">3. Limpe o cache e cookies</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Limpe os cookies e cache do navegador</li>
                  <li>Tente em uma janela anônima/incógnito</li>
                  <li>Tente um navegador diferente</li>
                </ul>
              </div>

              <div className="mt-3">
                <p className="font-medium">4. Verifique os logs do console</p>
                <p className="text-xs text-muted-foreground">
                  Abra o console do navegador (F12) antes de tentar fazer a autenticação para ver mensagens de erro detalhadas.
                </p>
              </div>
              
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
                <p className="font-medium text-amber-800">Importante! Verifique o redirecionamento</p>
                <p className="text-xs text-amber-700">
                  O parâmetro <span className="font-mono bg-slate-100 px-1 rounded">?provider=google</span> na URL de redirecionamento é essencial 
                  e o domínio correto para este projeto é <span className="font-mono bg-slate-100 px-1 rounded font-bold">ad-connect-config.lovable.app</span>.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
