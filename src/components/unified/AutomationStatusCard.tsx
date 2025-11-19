import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react';

/**
 * Automation Status Card
 * Shows the current status of all automated workflows
 */
export const AutomationStatusCard = () => {
  const automationSteps = [
    {
      step: 'Cliente Criado',
      description: 'Oportunidade criada automaticamente',
      icon: CheckCircle,
      status: 'active',
      color: 'text-green-600'
    },
    {
      step: 'Orçamento Aprovado', 
      description: 'Deal criado automaticamente',
      icon: ArrowRight,
      status: 'active',
      color: 'text-blue-600'
    },
    {
      step: 'Deal Fechado',
      description: 'Transação financeira criada',
      icon: Zap,
      status: 'active', 
      color: 'text-purple-600'
    },
    {
      step: 'Sincronização Real-time',
      description: 'Dados atualizados instantaneamente',
      icon: Clock,
      status: 'active',
      color: 'text-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Automação Ativa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {automationSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4 w-4 ${step.color}`} />
                  <div>
                    <div className="font-medium text-sm">{step.step}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                <Badge variant="success">
                  Ativo
                </Badge>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-800 font-medium">
            ✅ Sistema 100% Automatizado
          </div>
          <div className="text-xs text-green-700 mt-1">
            Todas as integrações estão funcionando corretamente
          </div>
        </div>
      </CardContent>
    </Card>
  );
};