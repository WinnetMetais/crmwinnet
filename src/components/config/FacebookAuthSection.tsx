import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  isLoading,
}) => {
  const handleConnect = () => {
    // Implementar autenticação do Facebook Ads
    console.log("Conectar com Facebook Ads");
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          A integração com Facebook Ads será implementada em breve.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <label className="text-sm font-medium">Token de Acesso do Facebook</label>
        <Input 
          type="password"
          value={facebookAdsToken}
          onChange={(e) => setFacebookAdsToken(e.target.value)}
          placeholder="Seu token de acesso do Facebook Ads"
          disabled
        />
      </div>

      <Button 
        onClick={handleConnect}
        className="w-full"
        disabled={isLoading || true}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Conectar com Facebook Ads (Em breve)
      </Button>

      <Badge variant="outline">Em desenvolvimento</Badge>
    </div>
  );
};