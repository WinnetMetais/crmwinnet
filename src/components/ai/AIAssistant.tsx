
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  TrendingUp,
  Loader,
  Send,
  AlertTriangle
} from "lucide-react";
import { salesAI } from "@/services/ai/salesAI";
import { marketingAI } from "@/services/ai/marketingAI";
import { financialAI } from "@/services/ai/financialAI";
import { crmAI } from "@/services/ai/crmAI";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  module: 'sales' | 'marketing' | 'financial' | 'crm';
  context?: any;
  className?: string;
}

export const AIAssistant = ({ module, context, className }: AIAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<Set<string>>(new Set());
  const [suggestion, setSuggestion] = useState('');
  const [userInput, setUserInput] = useState('');
  const [contextError, setContextError] = useState('');
  const { toast } = useToast();

  // Context validation
  const contextRequiredActions = useMemo(() => [
    'Analisar lead',
    'Gerar proposta', 
    'Prever fluxo',
    'Segmentar clientes',
    'Prever fechamento',
    'Detectar anomalias',
    'Prever churn'
  ], []);

  // Validate context for specific actions
  const validateContext = useCallback((actionType: string): boolean => {
    if (contextRequiredActions.includes(actionType) && !context) {
      setContextError(`Esta ação requer contexto específico. Por favor, selecione um ${module === 'sales' ? 'lead ou cliente' : module === 'financial' ? 'período de dados' : 'conjunto de dados'} primeiro.`);
      return false;
    }
    setContextError('');
    return true;
  }, [contextRequiredActions, context, module]);

  const getModuleInfo = useMemo(() => {
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
  }, [module]);

  const handleSuggestion = useCallback(async (type: string) => {
    // Validate context first
    if (!validateContext(type)) {
      toast({
        title: "Contexto Necessário",
        description: contextError,
        variant: "destructive",
      });
      return;
    }

    // Set loading state for specific button
    setLoadingSuggestions(prev => new Set(prev).add(type));
    
    try {
      let result = '';
      
      switch (module) {
        case 'sales':
          if (type === 'Analisar lead' && context) {
            const analysis = await salesAI.scoreLeadIntelligence(context);
            result = `Pontuação: ${analysis.score}/100\nFatores: ${analysis.factors.join(', ')}\nRecomendação: ${analysis.recommendation}`;
          } else if (type === 'Gerar proposta' && context) {
            result = await salesAI.generateProposal(context.customer, context.products || [], context.requirements || '');
          } else if (type === 'Prever fechamento' && context) {
            const prediction = await salesAI.predictDealClosure(context);
            result = `Probabilidade: ${(prediction.probability * 100).toFixed(1)}%\nInsights: ${prediction.insights.map(i => i.message).join('\n')}`;
          } else if (type === 'Sugerir follow-up' && context) {
            const suggestions = await salesAI.generateFollowUpSuggestions(context.customer, context.lastInteraction || '');
            result = `Sugestões de Follow-up:\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
          }
          break;
          
        case 'marketing':
          if (type === 'Gerar conteúdo') {
            const content = await marketingAI.generateContent('post', userInput || 'produtos metálicos', 'LinkedIn');
            result = `Título: ${content.title}\n\n${content.content}\n\nHashtags: ${content.hashtags.join(' ')}`;
          } else if (type === 'Criar post') {
            const content = await marketingAI.generateContent('post', userInput || 'inovação em metais', 'LinkedIn', 'professional');
            result = `${content.content}\n\n${content.hashtags.join(' ')}`;
          } else if (type === 'Otimizar campanha' && context) {
            const optimization = await marketingAI.optimizeCampaign(context);
            result = `Sugestões: ${optimization.suggestions.join('\n')}\nAudiência: ${optimization.targetAudience}\nOrçamento: ${optimization.budget}`;
          } else if (type === 'Analisar performance' && context) {
            const analysis = await marketingAI.analyzeContentPerformance(context);
            result = `Análise de Performance:\n${analysis.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
          }
          break;
          
        case 'financial':
          if (type === 'Prever fluxo' && context) {
            const prediction = await financialAI.predictCashFlow(context.historicalData || []);
            result = `Próximo mês: R$ ${prediction.nextMonth.toLocaleString()}\nPróximo trimestre: R$ ${prediction.nextQuarter.toLocaleString()}\nConfiança: ${(prediction.confidence * 100).toFixed(1)}%\nFatores: ${prediction.factors.join(', ')}`;
          } else if (type === 'Detectar anomalias' && context) {
            const anomalies = await financialAI.detectAnomalies(context.transactions || []);
            result = anomalies.length > 0 
              ? `Anomalias Detectadas:\n${anomalies.map(a => `${a.type}: ${a.description} - R$ ${a.amount.toLocaleString()}`).join('\n')}`
              : 'Nenhuma anomalia detectada nos dados analisados.';
          } else if (type === 'Otimizar preços' && context) {
            const optimization = await financialAI.optimizePricing(context.products || []);
            result = `Otimização de Preços:\n${optimization.reasoning}\nImpacto Esperado: ${optimization.expectedImpact}`;
          } else if (type === 'Analisar custos' && context) {
            const recommendations = await financialAI.budgetRecommendations(context.historicalData || [], context.goals || {});
            result = `Recomendações de Orçamento:\n${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
          }
          break;
          
        case 'crm':
          if (type === 'Segmentar clientes' && context) {
            const segments = await crmAI.segmentCustomers(context.customers || []);
            result = segments.map(s => `${s.name}: ${s.description}`).join('\n\n');
          } else if (type === 'Prever churn' && context) {
            const predictions = await crmAI.predictChurn(context.customers || []);
            if (predictions.length > 0) {
              const highRiskCount = predictions.filter(p => p.churnProbability > 0.7).length;
              const topFactors = [...new Set(predictions.flatMap(p => p.riskFactors))].slice(0, 3);
              result = `Análise de Churn:\nClientes em alto risco: ${highRiskCount}\nPrincipais fatores: ${topFactors.join(', ')}\n\nAções recomendadas:\n${predictions.slice(0, 3).map(p => `- ${p.preventionActions[0] || 'Revisar conta'}`).join('\n')}`;
            } else {
              result = 'Análise de Churn: Nenhum cliente em risco identificado no momento.';
            }
          } else if (type === 'Recomendar produtos' && context) {
            const recommendations = await crmAI.recommendProducts(context.customer || {}, context.products || []);
            result = recommendations.length > 0 
              ? `Produtos Recomendados:\n${recommendations.slice(0, 5).map((r, i) => `${i + 1}. ${r.name} - ${r.reasoning || 'Produto relevante'}`).join('\n')}`
              : 'Nenhuma recomendação disponível para este cliente.';
          } else if (type === 'Analisar sentimento' && context) {
            const text = context.text || context.message || 'Texto para análise';
            const sentiment = await crmAI.analyzeSentiment(text);
            result = `Análise de Sentimento:\nSentimento: ${sentiment.sentiment}\nConfiança: ${Math.round(sentiment.confidence * 100)}%\nEmoções: ${sentiment.emotions.join(', ')}\nResumo: ${sentiment.summary}`;
          }
          break;
      }
      
      setSuggestion(result || 'Análise realizada com sucesso!');
      if (result) {
        setUserInput(''); // Clear input after successful suggestion
      }
      
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      toast({
        title: "Erro na IA",
        description: error.message || `Falha ao executar "${type}". Verifique os dados e tente novamente.`,
        variant: "destructive",
      });
    } finally {
      // Remove loading state for this specific button
      setLoadingSuggestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
    }
  }, [module, context, validateContext, contextError, userInput, toast]);

  const handleCustomRequest = useCallback(async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      // Process custom request based on module and user input
      let result = '';
      
      switch (module) {
        case 'marketing':
          if (userInput.toLowerCase().includes('conteúdo') || userInput.toLowerCase().includes('post')) {
            const content = await marketingAI.generateContent('post', userInput, 'LinkedIn');
            result = `${content.content}\n\n${content.hashtags.join(' ')}`;
          } else if (userInput.toLowerCase().includes('chatbot') || userInput.toLowerCase().includes('resposta')) {
            result = await marketingAI.createChatbotResponse(userInput);
          } else {
            result = `Processando solicitação personalizada: "${userInput}"\n\nPara melhores resultados, seja mais específico sobre o tipo de conteúdo desejado.`;
          }
          break;
        default:
          result = `Solicitação recebida: "${userInput}"\n\nEsta funcionalidade está sendo aprimorada. Use as ações rápidas para melhores resultados.`;
      }
      
      setSuggestion(result);
      setUserInput(''); // Clear input after processing
      
    } catch (error: any) {
      console.error('Custom Request Error:', error);
      toast({
        title: "Erro na IA",
        description: error.message || "Não foi possível processar a solicitação personalizada.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userInput, module, toast]);

  const IconComponent = getModuleInfo.icon;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <IconComponent className={`h-5 w-5 mr-2 ${getModuleInfo.color}`} />
          {getModuleInfo.title}
          <Badge variant="outline" className="ml-2">IA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Context Error Alert */}
        {contextError && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {contextError}
            </AlertDescription>
          </Alert>
        )}

        {/* Sugestões Rápidas */}
        <div>
          <h4 className="text-sm font-medium mb-2">Ações Rápidas:</h4>
          <div className="grid grid-cols-2 gap-2">
            {getModuleInfo.suggestions.map((suggestionItem, index) => {
              const isLoadingThis = loadingSuggestions.has(suggestionItem);
              const isContextRequired = contextRequiredActions.includes(suggestionItem);
              const hasContext = Boolean(context);
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(suggestionItem)}
                  disabled={isLoading || isLoadingThis || (isContextRequired && !hasContext)}
                  className="text-xs"
                  title={isContextRequired && !hasContext ? 'Requer contexto específico' : ''}
                >
                  {isLoadingThis && <Loader className="h-3 w-3 animate-spin mr-1" />}
                  {suggestionItem}
                </Button>
              );
            })}
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
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && userInput.trim() && handleCustomRequest()}
            />
            <Button
              size="sm"
              onClick={handleCustomRequest}
              disabled={isLoading || !userInput.trim()}
              aria-label="Enviar solicitação personalizada"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Dica: Seja específico sobre o que você precisa para melhores resultados.
          </p>
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
              aria-label="Resposta da IA"
            />
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSuggestion('')}
                className="text-xs"
              >
                Limpar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(suggestion)}
                className="text-xs"
              >
                Copiar
              </Button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {(isLoading || loadingSuggestions.size > 0) && (
          <div className="flex items-center justify-center py-4">
            <Loader className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">
              {isLoading ? 'Processando solicitação...' : `Executando ${Array.from(loadingSuggestions)[0]}...`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
