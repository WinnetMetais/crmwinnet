
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  TrendingUp,
  Loader,
  Send
} from "lucide-react";
import { salesAI } from "@/services/ai/salesAI";
import { marketingAI } from "@/services/ai/marketingAI";
import { financialAI } from "@/services/ai/financialAI";
import { crmAI } from "@/services/ai/crmAI";
import { toast } from "@/hooks/use-toast";

interface AIAssistantProps {
  module: 'sales' | 'marketing' | 'financial' | 'crm';
  context?: any;
  className?: string;
}

export const AIAssistant = ({ module, context, className }: AIAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [userInput, setUserInput] = useState('');

  const getModuleInfo = () => {
    switch (module) {
      case 'sales':
        return {
          title: 'Assistente de Vendas IA',
          icon: TrendingUp,
          color: 'text-green-600',
          suggestions: [
            'Analisar lead',
            'Gerar proposta',
            'Prever fechamento',
            'Sugerir follow-up'
          ]
        };
      case 'marketing':
        return {
          title: 'Assistente de Marketing IA',
          icon: Sparkles,
          color: 'text-purple-600',
          suggestions: [
            'Gerar conteúdo',
            'Criar post',
            'Otimizar campanha',
            'Analisar performance'
          ]
        };
      case 'financial':
        return {
          title: 'Assistente Financeiro IA',
          icon: TrendingUp,
          color: 'text-blue-600',
          suggestions: [
            'Prever fluxo',
            'Detectar anomalias',
            'Otimizar preços',
            'Analisar custos'
          ]
        };
      case 'crm':
        return {
          title: 'Assistente de CRM IA',
          icon: Brain,
          color: 'text-orange-600',
          suggestions: [
            'Segmentar clientes',
            'Prever churn',
            'Recomendar produtos',
            'Analisar sentimento'
          ]
        };
      default:
        return {
          title: 'Assistente IA',
          icon: Brain,
          color: 'text-gray-600',
          suggestions: []
        };
    }
  };

  const moduleInfo = getModuleInfo();

  const handleSuggestion = async (type: string) => {
    setIsLoading(true);
    try {
      let result = '';
      
      switch (module) {
        case 'sales':
          if (type === 'Analisar lead' && context) {
            const analysis = await salesAI.scoreLeadIntelligence(context);
            result = `Pontuação: ${analysis.score}/100\nFatores: ${analysis.factors.join(', ')}\nRecomendação: ${analysis.recommendation}`;
          } else if (type === 'Gerar proposta' && context) {
            result = await salesAI.generateProposal(context.customer, context.products || [], context.requirements || '');
          }
          break;
          
        case 'marketing':
          if (type === 'Gerar conteúdo') {
            const content = await marketingAI.generateContent('post', userInput || 'produtos metálicos', 'LinkedIn');
            result = `Título: ${content.title}\n\n${content.content}\n\nHashtags: ${content.hashtags.join(' ')}`;
          }
          break;
          
        case 'financial':
          if (type === 'Prever fluxo' && context) {
            const prediction = await financialAI.predictCashFlow(context.historicalData || []);
            result = `Próximo mês: R$ ${prediction.nextMonth.toLocaleString()}\nConfiança: ${(prediction.confidence * 100).toFixed(1)}%\nFatores: ${prediction.factors.join(', ')}`;
          }
          break;
          
        case 'crm':
          if (type === 'Segmentar clientes' && context) {
            const segments = await crmAI.segmentCustomers(context.customers || []);
            result = segments.map(s => `${s.name}: ${s.description}`).join('\n\n');
          }
          break;
      }
      
      setSuggestion(result || 'Análise realizada com sucesso!');
    } catch (error) {
      toast({
        title: "Erro na IA",
        description: "Não foi possível processar a solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomRequest = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica para processar solicitações customizadas
      setSuggestion(`Processando: "${userInput}"\n\nEsta funcionalidade está em desenvolvimento.`);
    } catch (error) {
      toast({
        title: "Erro na IA",
        description: "Não foi possível processar a solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <moduleInfo.icon className={`h-5 w-5 mr-2 ${moduleInfo.color}`} />
          {moduleInfo.title}
          <Badge variant="outline" className="ml-2">IA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sugestões Rápidas */}
        <div>
          <h4 className="text-sm font-medium mb-2">Ações Rápidas:</h4>
          <div className="grid grid-cols-2 gap-2">
            {moduleInfo.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestion(suggestion)}
                disabled={isLoading}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Personalizado */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Pergunta Personalizada:</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Digite sua solicitação..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              size="sm"
              onClick={handleCustomRequest}
              disabled={isLoading || !userInput.trim()}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Resultado */}
        {suggestion && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Resposta da IA:
            </h4>
            <Textarea
              value={suggestion}
              readOnly
              className="text-sm h-32 resize-none"
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Processando com IA...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
