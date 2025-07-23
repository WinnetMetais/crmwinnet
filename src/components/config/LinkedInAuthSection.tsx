import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  isLoading,
}) => {
  const handleConnect = () => {
    // Implementar autenticação do LinkedIn Ads
    console.log("Conectar com LinkedIn Ads");
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          A integração com LinkedIn Ads será implementada em breve.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <label className="text-sm font-medium">Token de Acesso do LinkedIn</label>
        <Input 
          type="password"
          value={linkedinAdsToken}
          onChange={(e) => setLinkedinAdsToken(e.target.value)}
          placeholder="Seu token de acesso do LinkedIn Ads"
          disabled
        />
      </div>

      <Button 
        onClick={handleConnect}
        className="w-full"
        disabled={isLoading || true}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Conectar com LinkedIn Ads (Em breve)
      </Button>

      <Badge variant="outline">Em desenvolvimento</Badge>
    </div>
  );
};