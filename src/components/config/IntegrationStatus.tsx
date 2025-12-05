
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Zap,
  ExternalLink,
  Database,
  BarChart3
} from "lucide-react";

interface IntegrationStatusProps {
  connectionStatus: {
    google?: "success" | "error" | "pending" | null;
    facebook?: "success" | "error" | "pending" | null;
    linkedin?: "success" | "error" | "pending" | null;
  };
  integrationsSynced: boolean;
  onSync: () => void;
  isLoading: boolean;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  connectionStatus,
  integrationsSynced,
  onSync,
  isLoading
}) => {
  const connectedPlatforms = Object.values(connectionStatus).filter(status => status === 'success').length;
  const totalPlatforms = 3; // Google, Facebook, LinkedIn
  const connectionProgress = (connectedPlatforms / totalPlatforms) * 100;

  const getStatusIcon = (status: string | null | undefined) => {
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === 'error') return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (status === 'pending') return <RefreshCw className="h-4 w-4 text-warning animate-spin" />;
    return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (status === 'success') return <Badge variant="success">Conectado</Badge>;
    if (status === 'error') return <Badge variant="destructive">Erro</Badge>;
    if (status === 'pending') return <Badge variant="warning">Conectando</Badge>;
    return <Badge variant="outline">Desconectado</Badge>;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Status das Integrações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Plataformas conectadas</span>
              <span>{connectedPlatforms}/{totalPlatforms}</span>
            </div>
            <Progress value={connectionProgress} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionStatus.google)}
                <span className="text-sm">Google Ads</span>
              </div>
              {getStatusBadge(connectionStatus.google)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionStatus.facebook)}
                <span className="text-sm">Facebook/Instagram</span>
              </div>
              {getStatusBadge(connectionStatus.facebook)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionStatus.linkedin)}
                <span className="text-sm">LinkedIn</span>
              </div>
              {getStatusBadge(connectionStatus.linkedin)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sincronização CRM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Status da sincronização</span>
            {integrationsSynced ? (
              <Badge variant="success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Sincronizado
              </Badge>
            ) : (
              <Badge variant="outline">
                <AlertCircle className="h-3 w-3 mr-1" />
                Pendente
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {integrationsSynced 
              ? "Todas as integrações estão sincronizadas com o CRM"
              : "Configure as integrações e sincronize com o CRM"
            }
          </div>
          
          <Button 
            onClick={onSync} 
            disabled={isLoading || connectedPlatforms === 0}
            className="w-full"
            size="sm"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Sincronizar com CRM
          </Button>
          
          {connectedPlatforms === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Configure pelo menos uma integração para sincronizar
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
