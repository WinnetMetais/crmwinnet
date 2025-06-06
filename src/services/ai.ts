
import { supabase } from '@/integrations/supabase/client';

export interface AIProvider {
  name: string;
  apiKey?: string;
  endpoint: string;
  models: string[];
  freeTokens: number;
  usedTokens: number;
}

export interface AIRequest {
  provider: string;
  model: string;
  prompt: string;
  context?: any;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  tokens: number;
  provider: string;
  model: string;
  timestamp: Date;
}

class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    this.providers.set('openai', {
      name: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4o-mini', 'gpt-4o'],
      freeTokens: 100000,
      usedTokens: 0
    });

    this.providers.set('anthropic', {
      name: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1/messages',
      models: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229'],
      freeTokens: 50000,
      usedTokens: 0
    });

    this.providers.set('huggingface', {
      name: 'Hugging Face',
      endpoint: 'https://api-inference.huggingface.co/models',
      models: ['microsoft/DialoGPT-medium', 'facebook/blenderbot-400M-distill'],
      freeTokens: 1000000,
      usedTokens: 0
    });
  }

  async makeRequest(request: AIRequest): Promise<AIResponse> {
    const provider = this.providers.get(request.provider);
    if (!provider) {
      throw new Error(`Provider ${request.provider} not found`);
    }

    try {
      let response;
      
      if (request.provider === 'openai') {
        response = await this.callOpenAI(request, provider);
      } else if (request.provider === 'anthropic') {
        response = await this.callAnthropic(request, provider);
      } else if (request.provider === 'huggingface') {
        response = await this.callHuggingFace(request, provider);
      } else {
        throw new Error(`Unsupported provider: ${request.provider}`);
      }

      // Log usage - usando tabela existente analytics_data
      await this.logUsage(request, response);
      
      return response;
    } catch (error) {
      console.error('AI Request failed:', error);
      throw error;
    }
  }

  private async callOpenAI(request: AIRequest, provider: AIProvider): Promise<AIResponse> {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
      }),
    });

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      tokens: data.usage.total_tokens,
      provider: request.provider,
      model: request.model,
      timestamp: new Date()
    };
  }

  private async callAnthropic(request: AIRequest, provider: AIProvider): Promise<AIResponse> {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': provider.apiKey || '',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens || 1000,
        messages: [
          { role: 'user', content: request.prompt }
        ]
      }),
    });

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      tokens: data.usage.input_tokens + data.usage.output_tokens,
      provider: request.provider,
      model: request.model,
      timestamp: new Date()
    };
  }

  private async callHuggingFace(request: AIRequest, provider: AIProvider): Promise<AIResponse> {
    const response = await fetch(`${provider.endpoint}/${request.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.prompt,
        parameters: {
          max_new_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
        }
      }),
    });

    const data = await response.json();
    
    return {
      content: data[0]?.generated_text || data.generated_text || 'No response',
      tokens: request.prompt.length + (data[0]?.generated_text?.length || 0),
      provider: request.provider,
      model: request.model,
      timestamp: new Date()
    };
  }

  private async logUsage(request: AIRequest, response: AIResponse) {
    try {
      // Usando a tabela analytics_data existente para armazenar logs de IA
      await supabase.from('analytics_data').insert({
        category: 'ai_usage',
        subcategory: request.provider,
        metric_name: `${request.provider}_${request.model}`,
        metric_value: response.tokens,
        metric_date: new Date().toISOString().split('T')[0],
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        additional_data: {
          prompt_length: request.prompt.length,
          response_length: response.content.length,
          model: request.model,
          provider: request.provider
        }
      });
    } catch (error) {
      console.error('Failed to log AI usage:', error);
    }
  }

  getProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  updateProviderKey(provider: string, apiKey: string) {
    const providerConfig = this.providers.get(provider);
    if (providerConfig) {
      providerConfig.apiKey = apiKey;
    }
  }
}

export const aiService = new AIService();
