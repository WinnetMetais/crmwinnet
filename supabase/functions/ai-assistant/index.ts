import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt, context, module } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Customize system message based on module
    let systemMessage = 'Você é um assistente de IA especializado em negócios B2B da indústria metalúrgica.';
    
    switch (module) {
      case 'sales':
        systemMessage += ' Foque em análise de vendas, lead scoring, geração de propostas e previsões de fechamento.';
        break;
      case 'marketing':
        systemMessage += ' Especializado em criação de conteúdo, otimização de campanhas e análise de performance para o setor industrial.';
        break;
      case 'financial':
        systemMessage += ' Expert em análise financeira, previsões de fluxo de caixa, detecção de anomalias e otimização de preços.';
        break;
      case 'crm':
        systemMessage += ' Focado em segmentação de clientes, análise de comportamento, prevenção de churn e recomendações personalizadas.';
        break;
    }

    systemMessage += ' Sempre forneça respostas práticas, específicas e acionáveis em português brasileiro.';

    // Prepare the content for Gemini
    let fullPrompt = systemMessage + '\n\n' + prompt;
    
    // Add context if provided
    if (context) {
      fullPrompt += '\n\nContexto adicional: ' + JSON.stringify(context, null, 2);
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No response generated');
    }

    return new Response(JSON.stringify({ 
      generatedText,
      usage: data.usageMetadata || { totalTokenCount: 0 }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});