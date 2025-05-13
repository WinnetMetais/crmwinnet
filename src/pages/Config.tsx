
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Loader, AlertTriangle } from "lucide-react";

const Config = () => {
  const [googleAdsToken, setGoogleAdsToken] = useState('');
  const [facebookAdsToken, setFacebookAdsToken] = useState('');
  const [linkedinAdsToken, setLinkedinAdsToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [connectionStatus, setConnectionStatus] = useState<{
    google?: "success" | "error" | "pending" | null,
    facebook?: "success" | "error" | "pending" | null,
    linkedin?: "success" | "error" | "pending" | null,
  }>({});

  const handleSaveConfig = () => {
    setIsLoading(true);
    
    // Simulation for frontend only demonstration
    setTimeout(() => {
      // Save to localStorage for demonstration purposes
      localStorage.setItem('adTokens', JSON.stringify({
        googleAdsToken,
        facebookAdsToken,
        linkedinAdsToken,
      }));
      
      toast.success("Configurações salvas com sucesso!");
      setIsLoading(false);
    }, 1500);
    
    // In a real implementation with backend:
    // fetch('/api/save-config', { ... }).then(...).catch(...)
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus({
      google: "pending",
      facebook: "pending", 
      linkedin: "pending"
    });
    
    // Simulation for frontend only demonstration
    setTimeout(() => {
      // Simulate random success/failure for demonstration
      setConnectionStatus({
        google: Math.random() > 0.3 ? "success" : "error",
        facebook: Math.random() > 0.3 ? "success" : "error",
        linkedin: Math.random() > 0.3 ? "success" : "error",
      });
      setIsLoading(false);
    }, 2000);
    
    // In a real implementation with backend:
    // const response = await fetch('/api/test-connection', { ... })
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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Configurações de Integração</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tokens de API</CardTitle>
          <CardDescription>
            Configure seus tokens de acesso para integração com plataformas de anúncios
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="facebook">Facebook/Instagram</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  Google Ads Access Token {renderStatusBadge(connectionStatus.google)}
                </label>
                <Input 
                  type="text"
                  value={googleAdsToken}
                  onChange={(e) => setGoogleAdsToken(e.target.value)}
                  placeholder="Insira seu token de acesso do Google Ads"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  O token pode ser obtido no console do Google Ads API.
                </p>
              </div>
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
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
            Testar Conexões
          </Button>
          <Button 
            onClick={handleSaveConfig}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : null}
            Salvar Configuração
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Config;
