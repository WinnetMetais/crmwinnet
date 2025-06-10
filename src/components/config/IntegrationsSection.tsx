
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdPlatformTabs } from './AdPlatformTabs';
import { SocialMediaIntegration } from './SocialMediaIntegration';
import { BlingIntegration } from './BlingIntegration';
import { loadAdPlatformTokens, saveAdPlatformTokens } from "@/utils/googleAuth";

export const IntegrationsSection: React.FC = () => {
  const [googleAdsToken, setGoogleAdsToken] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleAuthStatus, setGoogleAuthStatus] = useState<"success" | "error" | "pending" | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [facebookAdsToken, setFacebookAdsToken] = useState('');
  const [linkedinAdsToken, setLinkedinAdsToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const connectionStatus = {
    google: googleAuthStatus,
    facebook: facebookAdsToken ? "success" as const : null,
    linkedin: linkedinAdsToken ? "success" as const : null,
  };

  const googleRedirectUri = `${window.location.origin}/config?provider=google`;

  useEffect(() => {
    const savedTokens = loadAdPlatformTokens();
    if (savedTokens.googleAdsToken) setGoogleAdsToken(savedTokens.googleAdsToken);
    if (savedTokens.facebookAdsToken) setFacebookAdsToken(savedTokens.facebookAdsToken);
    if (savedTokens.linkedinAdsToken) setLinkedinAdsToken(savedTokens.linkedinAdsToken);

    const savedGoogleClientId = localStorage.getItem('googleClientId');
    const savedGoogleClientSecret = localStorage.getItem('googleClientSecret');
    if (savedGoogleClientId) setGoogleClientId(savedGoogleClientId);
    if (savedGoogleClientSecret) setGoogleClientSecret(savedGoogleClientSecret);
  }, []);

  useEffect(() => {
    saveAdPlatformTokens({
      googleAdsToken,
      facebookAdsToken,
      linkedinAdsToken,
    });
  }, [googleAdsToken, facebookAdsToken, linkedinAdsToken]);

  useEffect(() => {
    if (googleClientId) localStorage.setItem('googleClientId', googleClientId);
  }, [googleClientId]);

  useEffect(() => {
    if (googleClientSecret) localStorage.setItem('googleClientSecret', googleClientSecret);
  }, [googleClientSecret]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações Externas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ads" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ads">Plataformas de Anúncios</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="bling">BLING ERP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ads" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="social" className="mt-6">
            <SocialMediaIntegration />
          </TabsContent>
          
          <TabsContent value="bling" className="mt-6">
            <BlingIntegration />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
