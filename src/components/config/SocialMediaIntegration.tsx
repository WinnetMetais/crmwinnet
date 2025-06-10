
import React, { useState, useEffect } from 'react';
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
  Info,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuickSetupGuide } from './QuickSetupGuide';

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

  const [showTokens, setShowTokens] = useState({
    instagram: false,
    facebook: false,
    twitter: false,
    linkedin: false,
    youtube: false,
  });

  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  useEffect(() => {
    // Carregar tokens salvos
    Object.keys(tokens).forEach(platform => {
      const savedToken = localStorage.getItem(`${platform}_token`);
      if (savedToken) {
        setTokens(prev => ({ ...prev, [platform]: savedToken }));
        setConnected(prev => ({ ...prev, [platform]: true }));
      }
    });
  }, []);

  const handleTokenChange = (platform: string, value: string) => {
    setTokens(prev => ({ ...prev, [platform]: value }));
  };

  const toggleTokenVisibility = (platform: string) => {
    setShowTokens(prev => ({ ...prev, [platform]: !prev[platform as keyof typeof prev] }));
  };

  const copyToken = (platform: string) => {
    const token = tokens[platform as keyof typeof tokens];
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success(`Token do ${platform} copiado!`);
    }
  };

  const handleConnect = async (platform: string) => {
    const token = tokens[platform as keyof typeof tokens];
    if (!token) {
      toast.error(`Token do ${platform} é obrigatório`);
      return;
    }

    setIsConnecting(platform);
    
    try {
      // Simular validação do token
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validação básica do formato do token
      if (token.length < 20) {
        throw new Error("Token parece ser muito curto");
      }
      
      setConnected(prev => ({ ...prev, [platform]: true }));
      localStorage.setItem(`${platform}_token`, token);
      
      toast.success(`${platform} conectado com sucesso!`, {
        description: "A integração está ativa e pronta para uso"
      });
    } catch (error: any) {
      toast.error(`Erro ao conectar ${platform}`, {
        description: error.message || "Verifique se o token está correto"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (platform: string) => {
    setConnected(prev => ({ ...prev, [platform]: false }));
    setTokens(prev => ({ ...prev, [platform]: '' }));
    localStorage.removeItem(`${platform}_token`);
    toast.info(`${platform} desconectado`);
  };

  const handleQuickSetup = (platform: string) => {
    // Scroll para a seção específica da plataforma
    const element = document.getElementById(`platform-${platform}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const platformConfigs = [
    {
      name: 'Instagram',
      key: 'instagram',
      icon: Instagram,
      color: 'text-pink-600',
      description: 'Conecte sua conta Instagram Business para publicação automática',
      helpUrl: 'https://developers.facebook.com/docs/instagram-api/',
      tokenFormat: 'Token de acesso de longa duração do Instagram Business'
    },
    {
      name: 'Facebook',
      key: 'facebook',
      icon: Facebook,
      color: 'text-blue-600',
      description: 'Conecte suas páginas do Facebook para gerenciar posts',
      helpUrl: 'https://developers.facebook.com/docs/pages-api/',
      tokenFormat: 'Token de página do Facebook'
    },
    {
      name: 'Twitter/X',
      key: 'twitter',
      icon: Twitter,
      color: 'text-black',
      description: 'Conecte sua conta do Twitter/X para publicações',
      helpUrl: 'https://developer.twitter.com/en/docs/twitter-api',
      tokenFormat: 'Bearer Token ou OAuth 2.0 Token'
    },
    {
      name: 'LinkedIn',
      key: 'linkedin',
      icon: Linkedin,
      color: 'text-blue-700',
      description: 'Conecte seu perfil ou página LinkedIn para conteúdo profissional',
      helpUrl: 'https://developer.linkedin.com/docs/',
      tokenFormat: 'OAuth 2.0 Access Token com escopos apropriados'
    },
    {
      name: 'YouTube',
      key: 'youtube',
      icon: Youtube,
      color: 'text-red-600',
      description: 'Conecte seu canal YouTube para upload de vídeos',
      helpUrl: 'https://developers.google.com/youtube/v3',
      tokenFormat: 'OAuth 2.0 Token com permissão de upload'
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

      <QuickSetupGuide onStartSetup={handleQuickSetup} />

      <div className="grid gap-6">
        {platformConfigs.map((platform) => {
          const isConnected = connected[platform.key as keyof typeof connected];
          const token = tokens[platform.key as keyof typeof tokens];
          const showToken = showTokens[platform.key as keyof typeof showTokens];
          const isConnectingThis = isConnecting === platform.key;
          const Icon = platform.icon;
          
          return (
            <Card key={platform.key} id={`platform-${platform.key}`}>
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
                      <Label htmlFor={`${platform.key}-token`}>
                        Access Token
                        <span className="text-xs text-muted-foreground ml-2">
                          ({platform.tokenFormat})
                        </span>
                      </Label>
                      <div className="relative">
                        <Input
                          id={`${platform.key}-token`}
                          type={showToken ? "text" : "password"}
                          value={token}
                          onChange={(e) => handleTokenChange(platform.key, e.target.value)}
                          placeholder={`Cole aqui seu token do ${platform.name}`}
                          className="pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTokenVisibility(platform.key)}
                            className="h-6 w-6 p-0"
                          >
                            {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          {token && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToken(platform.key)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleConnect(platform.key)}
                        disabled={!token || isConnectingThis}
                        className="flex-1"
                      >
                        {isConnectingThis ? (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2 animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Conectar {platform.name}
                          </>
                        )}
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
                      <div>
                        <span className="text-sm font-medium text-green-800">
                          {platform.name} conectado com sucesso
                        </span>
                        <p className="text-xs text-green-700">
                          Token: {token.substring(0, 10)}...{token.substring(token.length - 4)}
                        </p>
                      </div>
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
