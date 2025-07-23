
import { aiService } from '../ai';
import type { Customer } from '../customers';
import type { Product } from '../products';

export interface LeadScore {
  score: number;
  factors: string[];
  recommendation: string;
  probability: number;
}

export interface SalesInsight {
  type: 'opportunity' | 'risk' | 'recommendation';
  message: string;
  confidence: number;
  actionItems: string[];
}

export class SalesAI {
  async scoreLeadIntelligence(customer: Customer, context?: any): Promise<LeadScore> {
    const prompt = `
      Analise este lead e forneça uma pontuação inteligente (0-100):
      
      Cliente: ${customer.name}
      Empresa: ${customer.company || 'N/A'}
      Email: ${customer.email || 'N/A'}
      Telefone: ${customer.phone || 'N/A'}
      Origem: ${customer.lead_source || 'N/A'}
      Status: ${customer.status}
      Cidade: ${customer.city || 'N/A'}
      Notas: ${customer.notes || 'N/A'}
      
      ${context ? `Contexto adicional: ${JSON.stringify(context)}` : ''}
      
      Forneça a resposta em JSON com:
      - score (0-100)
      - factors (array de fatores que influenciam a pontuação)
      - recommendation (recomendação de ação)
      - probability (probabilidade de conversão 0-1)
      
      Considere: qualidade dos dados, potencial da empresa, origem do lead, engajamento.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 500,
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Lead scoring failed:', error);
      return {
        score: 50,
        factors: ['Dados insuficientes para análise completa'],
        recommendation: 'Coletar mais informações sobre o cliente',
        probability: 0.5
      };
    }
  }

  async generateProposal(customer: Customer, products: Product[], requirements: string): Promise<string> {
    const prompt = `
      Gere uma proposta comercial personalizada para:
      
      Cliente: ${customer.name}
      Empresa: ${customer.company || 'Pessoa Física'}
      
      Produtos solicitados:
      ${products.map(p => `- ${p.name}: R$ ${p.price} (${p.description})`).join('\n')}
      
      Requisitos específicos: ${requirements}
      
      Crie uma proposta profissional incluindo:
      1. Saudação personalizada
      2. Resumo dos produtos/serviços
      3. Benefícios específicos para o cliente
      4. Condições comerciais
      5. Próximos passos
      
      Tom: Profissional, persuasivo e focado em valor.
      Empresa: Winnet Metais (especializada em metais e ligas metálicas)
    `;

    const response = await aiService.makeRequest({
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      prompt,
      maxTokens: 1000,
      temperature: 0.7
    });

    return response.content;
  }

  async predictDealClosure(dealData: any): Promise<{ probability: number; insights: SalesInsight[] }> {
    const prompt = `
      Analise esta oportunidade de venda e preveja a probabilidade de fechamento:
      
      ${JSON.stringify(dealData, null, 2)}
      
      Forneça análise em JSON com:
      - probability (0-1)
      - insights (array de objetos com type, message, confidence, actionItems)
      
      Considere: valor do negócio, estágio atual, tempo no pipeline, interações do cliente.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 600,
        temperature: 0.4
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Deal prediction failed:', error);
      return {
        probability: 0.5,
        insights: [{
          type: 'recommendation',
          message: 'Análise automática não disponível',
          confidence: 0.5,
          actionItems: ['Revisar dados do negócio']
        }]
      };
    }
  }

  async generateFollowUpSuggestions(customer: Customer, lastInteraction: string): Promise<string[]> {
    const prompt = `
      Baseado no histórico do cliente, sugira 3-5 ações de follow-up:
      
      Cliente: ${customer.name}
      Última interação: ${lastInteraction}
      Status: ${customer.status}
      
      Gere sugestões específicas e acionáveis para manter o engajamento.
      Formate como array JSON de strings.
    `;

    try {
      const response = await aiService.makeRequest({
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        prompt,
        maxTokens: 300,
        temperature: 0.6
      });

      return JSON.parse(response.content);
    } catch (error) {
      return [
        'Agendar ligação de follow-up',
        'Enviar material complementar',
        'Agendar reunião presencial'
      ];
    }
  }
}

export const salesAI = new SalesAI();
