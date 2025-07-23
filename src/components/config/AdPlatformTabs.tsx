
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, ExternalLink, Zap, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { GoogleAuthSection } from "./GoogleAuthSection";
import { FacebookAuthSection } from "./FacebookAuthSection";
import { LinkedInAuthSection } from "./LinkedInAuthSection";
import { syncGoogleAdsData } from "@/services/googleAds";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { loadAdPlatformTokens, saveAdPlatformTokens, isTokenValid } from "@/utils/googleAuth";

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
        <FacebookAuthSection 
          facebookAdsToken={facebookAdsToken}
          setFacebookAdsToken={setFacebookAdsToken}
          connectionStatus={connectionStatus}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="linkedin">
        <LinkedInAuthSection 
          linkedinAdsToken={linkedinAdsToken}
          setLinkedinAdsToken={setLinkedinAdsToken}
          connectionStatus={connectionStatus}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
