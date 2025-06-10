
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  ExternalLink,
  Check,
  AlertTriangle,
  Info
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const SocialMediaIntegration: React.FC = () => {
  const [tokens, setTokens] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  });

  const [connected, setConnected] = useState({
    instagram: false,
    facebook: false,
    twitter: false,
    linkedin: false,
    youtube: false,
  });

  const handleTokenChange = (platform: string, value: string) => {
    setTokens(prev => ({ ...prev, [platform]: value }));
  };

  const handleConnect = async (platform: string) => {
    if (!tokens[platform as keyof typeof tokens]) {
      toast.error(`Token do ${platform} é obrigatório`);
      return;
    }

    // Simular conexão
    setConnected(prev => ({ ...prev, [platform]: true }));
    toast.success(`${platform} conectado com sucesso!`);
    
    // Salvar no localStorage
    localStorage.setItem(`${platform}_token`, tokens[platform as keyof typeof tokens]);
  };

  const handleDisconnect = (platform: string) => {
    setConnected(prev => ({ ...prev, [platform]: false }));
    setTokens(prev => ({ ...prev, [platform]: '' }));
    localStorage.removeItem(`${platform}_token`);
    toast.info(`${platform} desconectado`);
  };

  const platformConfigs = [
    {
      name: 'Instagram',
      key: 'instagram',
      icon: Instagram,
      color: 'text-pink-600',
      description: 'Conecte sua conta Instagram Business para publicação automática',
      helpUrl: 'https://developers.facebook.com/docs/instagram-api/'
    },
    {
      name: 'Facebook',
      key: 'facebook',
      icon: Facebook,
      color: 'text-blue-600',
      description: 'Conecte suas páginas do Facebook para gerenciar posts',
      helpUrl: 'https://developers.facebook.com/docs/pages-api/'
    },
    {
      name: 'Twitter/X',
      key: 'twitter',
      icon: Twitter,
      color: 'text-black',
      description: 'Conecte sua conta do Twitter/X para publicações',
      helpUrl: 'https://developer.twitter.com/en/docs/twitter-api'
    },
    {
      name: 'LinkedIn',
      key: 'linkedin',
      icon: Linkedin,
      color: 'text-blue-700',
      description: 'Conecte seu perfil ou página LinkedIn para conteúdo profissional',
      helpUrl: 'https://developer.linkedin.com/docs/'
    },
    {
      name: 'YouTube',
      key: 'youtube',
      icon: Youtube,
      color: 'text-red-600',
      description: 'Conecte seu canal YouTube para upload de vídeos',
      helpUrl: 'https://developers.google.com/youtube/v3'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Redes Sociais</h3>
        <p className="text-sm text-muted-foreground">
          Configure as integrações com suas redes sociais para publicação automática de conteúdo
        </p>
      </div>

      <div className="grid gap-6">
        {platformConfigs.map((platform) => {
          const isConnected = connected[platform.key as keyof typeof connected];
          const Icon = platform.icon;
          
          return (
            <Card key={platform.key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${platform.color}`} />
                    <div>
                      <CardTitle className="text-base">{platform.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-100 text-green-800" : ""}>
                    {isConnected ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Conectado
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Desconectado
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor={`${platform.key}-token`}>Access Token</Label>
                      <Input
                        id={`${platform.key}-token`}
                        type="password"
                        value={tokens[platform.key as keyof typeof tokens]}
                        onChange={(e) => handleTokenChange(platform.key, e.target.value)}
                        placeholder={`Cole aqui seu token do ${platform.name}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleConnect(platform.key)}>
                        Conectar {platform.name}
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={platform.helpUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Documentação
                        </a>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {platform.name} conectado com sucesso
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(platform.key)}
                    >
                      Desconectar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="help">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Como obter tokens de acesso das redes sociais
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Instagram Business</h4>
                <p className="text-muted-foreground mb-2">
                  Você precisa de uma conta Instagram Business conectada a uma página do Facebook.
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Acesse o Facebook Developers</li>
                  <li>Crie um aplicativo e configure Instagram Basic Display API</li>
                  <li>Obtenha o token de acesso de longa duração</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Facebook Pages</h4>
                <p className="text-muted-foreground mb-2">
                  Use a Graph API para obter tokens de página.
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Acesse o Facebook Developers</li>
                  <li>Use o Graph API Explorer</li>
                  <li>Gere um token de página com as permissões necessárias</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Twitter/X API</h4>
                <p className="text-muted-foreground mb-2">
                  Você precisará de acesso à Twitter API v2.
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Candidate-se ao acesso da API do Twitter</li>
                  <li>Crie um aplicativo no portal de desenvolvedores</li>
                  <li>Gere Bearer Token ou OAuth tokens</li>
                </ol>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
