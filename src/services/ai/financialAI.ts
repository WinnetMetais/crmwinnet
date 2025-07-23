
import { aiService } from '../ai';

export interface CashFlowPrediction {
  nextMonth: number;
  nextQuarter: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface FinancialAnomaly {
  type: 'unusual_expense' | 'revenue_drop' | 'irregular_pattern';
  description: string;
  severity: 'low' | 'medium' | 'high';
  amount: number;
  date: string;
  suggestions: string[];
}

export class FinancialAI {
  async predictCashFlow(historicalData: any[]): Promise<CashFlowPrediction> {
    const prompt = `
      Analise estes dados financeiros históricos e preveja o fluxo de caixa:
      
      ${JSON.stringify(historicalData.slice(-12), null, 2)}
      
      Forneça previsão em JSON:
      - nextMonth (valor previsto próximo mês)
      - nextQuarter (valor previsto próximo trimestre)
      - confidence (0-1, confiança na previsão)
      - factors (fatores que influenciam a previsão)
      - recommendations (recomendações estratégicas)
      
      Considere sazonalidade, tendências e padrões recorrentes.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 600,
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Cash flow prediction failed:', error);
      return {
        nextMonth: 0,
        nextQuarter: 0,
        confidence: 0.5,
        factors: ['Dados insuficientes para análise'],
        recommendations: ['Coletar mais dados históricos']
      };
    }
  }

  async detectAnomalies(transactions: any[]): Promise<FinancialAnomaly[]> {
    const prompt = `
      Analise estas transações e identifique anomalias financeiras:
      
      ${JSON.stringify(transactions.slice(-50), null, 2)}
      
      Identifique padrões incomuns, gastos suspeitos, variações significativas.
      
      Retorne array JSON de anomalias com:
      - type (tipo da anomalia)
      - description (descrição)
      - severity (gravidade)
      - amount (valor envolvido)
      - date (data da anomalia)
      - suggestions (sugestões de ação)
      
      Foque em proteção financeira e otimização de gastos.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 800,
        temperature: 0.4
      });

      return JSON.parse(response.content);
    } catch (error) {
      return [];
    }
  }

  async generateFinancialReport(data: any): Promise<string> {
    const prompt = `
      Gere um relatório financeiro inteligente baseado nestes dados:
      
      ${JSON.stringify(data, null, 2)}
      
      O relatório deve incluir:
      1. Resumo executivo
      2. Análise de receitas e despesas
      3. Indicadores de performance
      4. Tendências identificadas
      5. Recomendações estratégicas
      
      Use linguagem profissional e insights acionáveis.
      Máximo 800 palavras.
    `;

    const response = await aiService.makeRequest({
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      prompt,
      maxTokens: 1000,
      temperature: 0.5
    });

    return response.content;
  }

  async optimizePricing(productData: any, marketData?: any): Promise<any> {
    const prompt = `
      Analise estes dados de produtos e sugira otimização de preços:
      
      Produtos: ${JSON.stringify(productData, null, 2)}
      ${marketData ? `Dados de mercado: ${JSON.stringify(marketData, null, 2)}` : ''}
      
      Forneça em JSON:
      - optimizedPrices (preços otimizados por produto)
      - reasoning (justificativa para cada ajuste)
      - expectedImpact (impacto esperado na receita)
      - riskFactors (fatores de risco)
      
      Considere: margem, competitividade, demanda, custos.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 800,
        temperature: 0.4
      });

      return JSON.parse(response.content);
    } catch (error) {
      return {
        optimizedPrices: {},
        reasoning: 'Análise não disponível',
        expectedImpact: 'Indefinido',
        riskFactors: ['Dados insuficientes']
      };
    }
  }

  async budgetRecommendations(historicalData: any[], goals: any): Promise<string[]> {
    const prompt = `
      Baseado no histórico financeiro e metas, sugira otimizações de orçamento:
      
      Histórico: ${JSON.stringify(historicalData.slice(-6), null, 2)}
      Metas: ${JSON.stringify(goals, null, 2)}
      
      Forneça 5-7 recomendações específicas para otimizar o orçamento.
      Retorne como array JSON de strings.
      
      Foque em eficiência, crescimento sustentável e redução de custos.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 500,
        temperature: 0.5
      });

      return JSON.parse(response.content);
    } catch (error) {
      return [
        'Revisar custos fixos mensalmente',
        'Implementar controle de gastos por categoria',
        'Negociar prazos com fornecedores'
      ];
    }
  }
}

export const financialAI = new FinancialAI();
