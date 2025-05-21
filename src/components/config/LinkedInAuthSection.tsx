
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Linkedin, Check, Loader, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LinkedInAuthSectionProps {
  linkedinAdsToken: string;
  setLinkedinAdsToken: (token: string) => void;
  connectionStatus: { linkedin?: "success" | "error" | "pending" | null };
  isLoading: boolean;
}

export const LinkedInAuthSection: React.FC<LinkedInAuthSectionProps> = ({
  linkedinAdsToken,
  setLinkedinAdsToken,
  connectionStatus,
  isLoading
}) => {
  const initiateLinkedInAuth = () => {
    // Placeholder for future implementation
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A autenticação automática do LinkedIn Ads será implementada em breve."
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
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <Button 
          variant="outline"
          onClick={initiateLinkedInAuth}
          className="flex items-center justify-center"
          disabled={isLoading}
        >
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          Conectar com LinkedIn Ads
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            if (linkedinAdsToken) {
              navigator.clipboard.writeText(linkedinAdsToken);
              toast.success("Token copiado para a área de transferência");
            }
          }}
          disabled={!linkedinAdsToken}
          className="flex-shrink-0"
        >
          Copiar Token
        </Button>
      </div>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="linkedinHelp">
          <AccordionTrigger>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              Como obter um token do LinkedIn Ads
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-slate-700 pl-4 border-l-2 border-slate-200">
              <p className="font-medium">Para obter um token de acesso do LinkedIn Ads:</p>
              
              <ol className="list-decimal space-y-2 pl-4">
                <li>
                  Acesse o <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn Developers</a>
                </li>
                <li>
                  Crie um aplicativo ou selecione um existente
                </li>
                <li>
                  Configure as permissões e produtos necessários (Marketing Developer Platform)
                </li>
                <li>
                  Vá para "Auth" e gere um token OAuth 2.0 com os escopos:
                  <ul className="list-disc pl-6 mt-1">
                    <li>r_liteprofile</li>
                    <li>r_emailaddress</li>
                    <li>r_ads</li>
                    <li>r_ads_reporting</li>
                    <li>w_member_social</li>
                  </ul>
                </li>
                <li>
                  Copie o token gerado e cole-o no campo acima
                </li>
              </ol>
              
              <div className="mt-4">
                <p className="font-medium">Observações importantes:</p>
                <ul className="list-disc pl-4">
                  <li>Tokens do LinkedIn geralmente expiram após 60 dias</li>
                  <li>Para acesso contínuo, configure um fluxo de renovação de token</li>
                  <li>Você pode precisar solicitar acesso ao LinkedIn Marketing Developer Platform</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
