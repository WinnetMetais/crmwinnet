
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Facebook, Check, Loader, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FacebookAuthSectionProps {
  facebookAdsToken: string;
  setFacebookAdsToken: (token: string) => void;
  connectionStatus: { facebook?: "success" | "error" | "pending" | null };
  isLoading: boolean;
}

export const FacebookAuthSection: React.FC<FacebookAuthSectionProps> = ({
  facebookAdsToken,
  setFacebookAdsToken,
  connectionStatus,
  isLoading
}) => {
  const initiateFacebookAuth = () => {
    // Placeholder for future implementation
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A autenticação automática do Facebook Ads será implementada em breve."
    });
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
          O token pode ser obtido no Facebook Business Manager, em Configurações &gt; Contas de Anúncios &gt; API.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <Button 
          variant="outline"
          onClick={initiateFacebookAuth}
          className="flex items-center justify-center"
          disabled={isLoading}
        >
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Conectar com Facebook Business
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            if (facebookAdsToken) {
              navigator.clipboard.writeText(facebookAdsToken);
              toast.success("Token copiado para a área de transferência");
            }
          }}
          disabled={!facebookAdsToken}
          className="flex-shrink-0"
        >
          Copiar Token
        </Button>
      </div>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="facebookHelp">
          <AccordionTrigger>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              Como obter um token do Facebook Ads
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-slate-700 pl-4 border-l-2 border-slate-200">
              <p className="font-medium">Para obter um token de acesso do Facebook Ads:</p>
              
              <ol className="list-decimal space-y-2 pl-4">
                <li>
                  Acesse o <a href="https://business.facebook.com/settings/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Facebook Business Manager</a>
                </li>
                <li>
                  Vá para Configurações &gt; Contas de Anúncios
                </li>
                <li>
                  Selecione sua conta de anúncios e clique em "Gerar token de acesso"
                </li>
                <li>
                  Copie o token gerado e cole-o no campo acima
                </li>
                <li>
                  Para tokens de longa duração, você precisará criar um aplicativo no Facebook Developers e configurar permissões adicionais
                </li>
              </ol>
              
              <div className="mt-4">
                <p className="font-medium">Permissões necessárias:</p>
                <ul className="list-disc pl-4">
                  <li>ads_management</li>
                  <li>ads_read</li>
                  <li>business_management</li>
                  <li>pages_read_engagement</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
