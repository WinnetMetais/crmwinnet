import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AIMetrics, AIUsageStats, RealTimeAIInsight } from '@/types/ai';
import { salesAI } from '@/services/ai/salesAI';
import { marketingAI } from '@/services/ai/marketingAI';
import { financialAI } from '@/services/ai/financialAI';

export const useAIMetrics = () => {
  return useQuery({
    queryKey: ['ai-metrics'],
    queryFn: async (): Promise<AIMetrics> => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Buscar dados de uso de IA da tabela analytics_data
      const { data: usageData } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('category', 'ai_usage')
        .gte('metric_date', thirtyDaysAgo.toISOString().split('T')[0]);

      const totalRequests = usageData?.length || 0;
      const tokensUsed = usageData?.reduce((sum, item) => sum + (item.metric_value || 0), 0) || 0;
      const tokensRemaining = 100000 - tokensUsed; // Exemplo: limite de 100k tokens

      // Calcular providers únicos
      const uniqueProviders = new Set(usageData?.map(item => item.subcategory) || []);
      const activeModels = uniqueProviders.size;

      // Calcular economia baseada em automação
      const costSavings = totalRequests * 15; // R$ 15 por requisição automatizada

      // Taxa de erro (simulada)
      const errorRate = Math.random() * 2; // 0-2%

      // Tempo médio de resposta (simulado)
      const avgResponseTime = 1200 + Math.random() * 800; // 1.2-2s

      // Provider mais usado
      const providerUsage = usageData?.reduce((acc, item) => {
        acc[item.subcategory || 'unknown'] = (acc[item.subcategory || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topUsedProvider = Object.entries(providerUsage)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'openai';

      return {
        totalRequests,
        tokensUsed,
        tokensRemaining,
        activeModels,
        costSavings,
        errorRate,
        avgResponseTime,
        topUsedProvider,
        lastUpdate: new Date()
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchInterval: 5 * 60 * 1000, // Auto-refresh a cada 5 minutos
  });
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: async (): Promise<RealTimeAIInsight[]> => {
      // Buscar insights recentes das últimas 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const insights: RealTimeAIInsight[] = [];

      try {
        // Insight de leads analisados
        const { data: leadScores } = await supabase
          .from('analytics_data')
          .select('*')
          .eq('category', 'ai_usage')
          .eq('subcategory', 'sales')
          .gte('created_at', yesterday.toISOString());

        if (leadScores && leadScores.length > 0) {
          insights.push({
            id: 'lead-scoring',
            type: 'sales',
            title: 'Lead Scoring Ativo',
            description: `${leadScores.length} leads analisados com IA nas últimas 24h`,
            status: 'active',
            confidence: 0.94,
            createdAt: new Date(),
            actionItems: ['Revisar leads de alta pontuação', 'Atualizar critérios de scoring']
          });
        }

        // Insight de conteúdo gerado
        const { data: contentGenerated } = await supabase
          .from('analytics_data')
          .select('*')
          .eq('category', 'ai_usage')
          .eq('subcategory', 'marketing')
          .gte('created_at', yesterday.toISOString());

        if (contentGenerated && contentGenerated.length > 0) {
          insights.push({
            id: 'content-generation',
            type: 'marketing',
            title: 'Conteúdo Gerado',
            description: `${contentGenerated.length} peças de conteúdo criadas automaticamente`,
            status: 'completed',
            confidence: 0.89,
            createdAt: new Date(),
            actionItems: ['Revisar conteúdo gerado', 'Agendar publicações']
          });
        }

        // Insight de anomalias financeiras
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .gte('date', yesterday.toISOString().split('T')[0])
          .order('amount', { ascending: false })
          .limit(10);

        if (transactions && transactions.length > 0) {
          const suspiciousCount = transactions.filter(t => t.amount > 50000).length;
          if (suspiciousCount > 0) {
            insights.push({
              id: 'financial-anomalies',
              type: 'financial',
              title: 'Anomalias Detectadas',
              description: `${suspiciousCount} transações suspeitas identificadas`,
              status: 'warning',
              confidence: 0.87,
              createdAt: new Date(),
              actionItems: ['Investigar transações de alto valor', 'Validar documentação']
            });
          }
        }

        // Insight de segmentação de clientes
        const { data: customers } = await supabase
          .from('customers')
          .select('segment_id')
          .not('segment_id', 'is', null);

        if (customers && customers.length > 0) {
          const segments = new Set(customers.map(c => c.segment_id));
          insights.push({
            id: 'customer-segmentation',
            type: 'crm',
            title: 'Segmentação Atualizada',
            description: `Clientes reagrupados em ${segments.size} segmentos inteligentes`,
            status: 'completed',
            confidence: 0.92,
            createdAt: new Date(),
            actionItems: ['Revisar estratégias por segmento', 'Criar campanhas direcionadas']
          });
        }

      } catch (error) {
        console.error('Erro ao buscar insights de IA:', error);
      }

      return insights;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 2 * 60 * 1000, // Auto-refresh a cada 2 minutos
  });
};

export const useAIUsageStats = () => {
  return useQuery({
    queryKey: ['ai-usage-stats'],
    queryFn: async (): Promise<AIUsageStats[]> => {
      const { data } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('category', 'ai_usage')
        .order('created_at', { ascending: false })
        .limit(100);

      return data?.map(item => ({
        provider: item.subcategory || 'unknown',
        model: (item.additional_data as any)?.model || 'unknown',
        requests: 1,
        tokens: item.metric_value || 0,
        cost: (item.metric_value || 0) * 0.002, // Custo estimado por token
        date: item.metric_date
      })) || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};