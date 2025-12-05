
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Database,
  Settings,
  Activity
} from "lucide-react";
import { useCRMIntegrity } from "@/hooks/useCRMIntegrity";

export const CRMSystemStatus = () => {
  const { checks, isChecking, overallStatus, runIntegrityCheck } = useCRMIntegrity();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok': return <Badge variant="success">OK</Badge>;
      case 'warning': return <Badge variant="warning">Atenção</Badge>;
      case 'error': return <Badge variant="destructive">Erro</Badge>;
      default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'ok': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status do Sistema CRM
          </CardTitle>
          <Button 
            onClick={runIntegrityCheck} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Verificar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Geral */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span className="font-medium">Status Geral do Sistema</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            <span className={`font-medium ${getOverallStatusColor()}`}>
              {overallStatus === 'ok' ? 'Sistema Operacional' : 
               overallStatus === 'warning' ? 'Atenção Necessária' : 'Erro Crítico'}
            </span>
          </div>
        </div>

        {/* Verificações dos Módulos */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Verificações por Módulo
          </h4>
          
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium">{check.module}</div>
                  <div className="text-sm text-muted-foreground">{check.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {check.count !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {check.count} registros
                  </span>
                )}
                {getStatusBadge(check.status)}
              </div>
            </div>
          ))}
          
          {checks.length === 0 && !isChecking && (
            <div className="text-center py-8 text-muted-foreground">
              Clique em "Verificar" para executar a verificação de integridade
            </div>
          )}

          {isChecking && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <div className="text-muted-foreground">Verificando integridade do sistema...</div>
            </div>
          )}
        </div>

        {/* Resumo de Recomendações */}
        {checks.some(check => check.status !== 'ok') && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <h5 className="font-medium text-orange-800 mb-2">Recomendações:</h5>
            <ul className="text-sm text-orange-700 space-y-1">
              {checks.filter(check => check.status === 'warning').map((check, index) => (
                <li key={index}>• {check.module}: {check.message}</li>
              ))}
              {checks.filter(check => check.status === 'error').map((check, index) => (
                <li key={index}>• {check.module}: {check.message}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
