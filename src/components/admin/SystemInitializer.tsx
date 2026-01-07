import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, RefreshCw, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { checkSystemStatus, initializeSystem, SystemStatus } from '@/services/systemInit';

export function SystemInitializer() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const result = await checkSystemStatus();
      setStatus(result);
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      const result = await initializeSystem();
      
      if (result.success) {
        toast({
          title: 'Sistema Inicializado',
          description: 'Todas as configurações foram aplicadas com sucesso!',
        });
      } else {
        toast({
          title: 'Inicialização Parcial',
          description: `${result.steps.length} etapas concluídas, ${result.errors.length} erros`,
          variant: 'destructive',
        });
      }
      
      await loadStatus();
    } catch (error: any) {
      toast({
        title: 'Erro na Inicialização',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setInitializing(false);
    }
  };

  const statusItems = status ? [
    { label: 'Perfil do Usuário', value: status.hasProfile },
    { label: 'Departamentos', value: status.hasDepartments },
    { label: 'Segmentos de Clientes', value: status.hasSegments },
    { label: 'Estágios do Pipeline', value: status.hasPipelineStages },
    { label: 'Produtos', value: status.hasProducts },
    { label: 'Clientes', value: status.hasCustomers },
  ] : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Inicialização do Sistema
            </CardTitle>
            <CardDescription>
              Verifique e configure os componentes essenciais do CRM
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-card"
                >
                  {item.value ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {status?.isReady ? (
                  <Badge variant="default" className="bg-green-500">
                    Sistema Pronto
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Configuração Necessária
                  </Badge>
                )}
              </div>
              <Button onClick={handleInitialize} disabled={initializing}>
                {initializing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Inicializar Sistema
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
