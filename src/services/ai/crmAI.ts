
import { aiService } from '../ai';
import type { Customer } from '../customers';

export interface CustomerSegment {
  name: string;
  description: string;
  customers: string[];
  characteristics: string[];
  recommendations: string[];
}

export interface ChurnPrediction {
  customerId: string;
  churnProbability: number;
  riskFactors: string[];
  preventionActions: string[];
  timeframe: string;
}

export interface CustomerInsight {
  type: 'behavior' | 'preference' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
}

export class CRMAI {
  async segmentCustomers(customers: Customer[]): Promise<CustomerSegment[]> {
    const prompt = `
      Analise estes clientes e crie segmentações inteligentes:
      
      ${JSON.stringify(customers.map(c => ({
        id: c.id,
        name: c.name,
        company: c.company,
        status: c.status,
        city: c.city,
        lead_source: c.lead_source,
        notes: c.notes?.substring(0, 100)
      })), null, 2)}
      
      Crie 3-5 segmentos baseados em:
      - Comportamento de compra
      - Perfil da empresa
      - Localização
      - Potencial de negócio
      
      Forneça em JSON array com:
      - name (nome do segmento)
      - description (descrição)
      - customers (array de IDs)
      - characteristics (características do segmento)
      - recommendations (estratégias específicas)
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 1000,
        temperature: 0.4
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Customer segmentation failed:', error);
      return [];
    }
  }

  async predictChurn(customers: Customer[], interactionData?: any[]): Promise<ChurnPrediction[]> {
    const prompt = `
      Analise estes clientes e preveja risco de churn:
      
      Clientes: ${JSON.stringify(customers.slice(0, 20), null, 2)}
      ${interactionData ? `Interações: ${JSON.stringify(interactionData.slice(-50), null, 2)}` : ''}
      
      Para cada cliente de alto risco, forneça:
      - customerId
      - churnProbability (0-1)
      - riskFactors (fatores de risco)
      - preventionActions (ações preventivas)
      - timeframe (prazo estimado)
      
      Considere: última interação, frequência de compras, mudanças no comportamento.
      Retorne array JSON.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 800,
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      return [];
    }
  }

  async generateCustomerInsights(customer: Customer, history?: any[]): Promise<CustomerInsight[]> {
    const prompt = `
      Analise este cliente e gere insights acionáveis:
      
      Cliente: ${JSON.stringify(customer, null, 2)}
      ${history ? `Histórico: ${JSON.stringify(history, null, 2)}` : ''}
      
      Gere 3-5 insights com:
      - type (tipo do insight)
      - title (título)
      - description (descrição detalhada)
      - confidence (0-1)
      - actionItems (ações recomendadas)
      
      Foque em oportunidades de upsell, riscos e melhorias no relacionamento.
      Retorne array JSON.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 600,
        temperature: 0.5
      });

      return JSON.parse(response.content);
    } catch (error) {
      return [];
    }
  }

  async recommendProducts(customer: Customer, products: any[]): Promise<any[]> {
    const prompt = `
      Baseado no perfil do cliente, recomende produtos relevantes:
      
      Cliente: ${JSON.stringify(customer, null, 2)}
      Produtos disponíveis: ${JSON.stringify(products.slice(0, 50), null, 2)}
      
      Selecione 5-10 produtos mais relevantes considerando:
      - Perfil da empresa
      - Setor de atuação
      - Histórico de compras
      - Necessidades inferidas
      
      Retorne array JSON com produtos ordenados por relevância.
      Para cada produto inclua: id, name, relevanceScore (0-1), reasoning
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 700,
        temperature: 0.4
      });

      return JSON.parse(response.content);
    } catch (error) {
      return [];
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
    summary: string;
  }> {
    const prompt = `
      Analise o sentimento desta mensagem/texto:
      
      "${text}"
      
      Forneça análise em JSON:
      - sentiment (positive/negative/neutral)
      - confidence (0-1)
      - emotions (emoções identificadas)
      - summary (resumo da análise)
      
      Seja preciso na análise emocional.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 300,
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: [],
        summary: 'Análise não disponível'
      };
    }
  }

  async generatePersonalizedMessage(customer: Customer, purpose: string): Promise<string> {
    const prompt = `
      Gere uma mensagem personalizada para este cliente:
      
      Cliente: ${JSON.stringify(customer, null, 2)}
      Propósito: ${purpose}
      
      A mensagem deve ser:
      - Personalizada com nome e empresa
      - Profissional mas cordial
      - Específica para o setor metalúrgico
      - Máximo 200 palavras
      
      Empresa remetente: Winnet Metais
    `;

    const response = await aiService.makeRequest({
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      prompt,
      maxTokens: 300,
      temperature: 0.7
    });

    return response.content;
  }
}

export const crmAI = new CRMAI();
