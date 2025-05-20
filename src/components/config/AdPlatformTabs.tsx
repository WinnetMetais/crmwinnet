
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader, AlertTriangle, Check } from "lucide-react";
import { GoogleAuthSection } from './GoogleAuthSection';

interface AdPlatformTabsProps {
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
  facebookAdsToken: string;
  setFacebookAdsToken: (token: string) => void;
  linkedinAdsToken: string;
  setLinkedinAdsToken: (token: string) => void;
  connectionStatus: {
    google?: "success" | "error" | "pending" | null;
    facebook?: "success" | "error" | "pending" | null;
    linkedin?: "success" | "error" | "pending" | null;
  };
  isLoading: boolean;
  googleRedirectUri: string;
}

export const AdPlatformTabs: React.FC<AdPlatformTabsProps> = ({
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
  facebookAdsToken,
  setFacebookAdsToken,
  linkedinAdsToken,
  setLinkedinAdsToken,
  connectionStatus,
  isLoading,
  googleRedirectUri,
}) => {

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
    <Tabs defaultValue="google" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="google">Google Ads</TabsTrigger>
        <TabsTrigger value="facebook">Facebook/Instagram</TabsTrigger>
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
      </TabsList>
      
      <TabsContent value="google">
        <GoogleAuthSection 
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
          connectionStatus={connectionStatus}
          isLoading={isLoading}
          googleRedirectUri={googleRedirectUri}
        />
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
  );
};
