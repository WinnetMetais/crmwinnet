
import { supabase } from "@/integrations/supabase/client";

export interface IntegrationData {
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  accountInfo?: {
    id: string;
    name: string;
    email?: string;
  };
  metrics?: {
    campaigns?: number;
    impressions?: number;
    clicks?: number;
    conversions?: number;
  };
  token?: string; // Adicionando token opcional
}

export class CRMSyncService {
  /**
   * Sincroniza dados das integrações com o CRM
   */
  async syncIntegrationsWithCRM(integrations: IntegrationData[]) {
    try {
      console.log("Iniciando sincronização com CRM", integrations);
      
      // Atualizar tabela de tokens de anúncios
      for (const integration of integrations) {
        if (integration.status === 'connected') {
          await this.updateAdTokensTable(integration);
          await this.syncCampaignData(integration);
          await this.updateCustomerData(integration);
        }
      }
      
      console.log("Sincronização concluída com sucesso");
      return { success: true };
    } catch (error) {
      console.error("Erro na sincronização:", error);
      throw error;
    }
  }

  /**
   * Atualiza a tabela ad_tokens com informações da integração
   */
  private async updateAdTokensTable(integration: IntegrationData) {
    // Se não há token, não podemos atualizar a tabela ad_tokens
    if (!integration.token) {
      console.warn(`Token não disponível para ${integration.platform}, pulando atualização ad_tokens`);
      return;
    }

    const { error } = await supabase
      .from('ad_tokens')
      .upsert({
        platform: integration.platform,
        token: integration.token,
        active: integration.status === 'connected',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'platform'
      });

    if (error) {
      console.error(`Erro ao atualizar ad_tokens para ${integration.platform}:`, error);
    }
  }

  /**
   * Sincroniza dados de campanhas
   */
  private async syncCampaignData(integration: IntegrationData) {
    if (!integration.metrics) return;

    const campaignData = {
      platform: integration.platform,
      name: `Campanha ${integration.platform}`,
      status: 'active',
      budget: 0, // Será preenchido com dados reais da API
      results: {
        impressions: integration.metrics.impressions || 0,
        clicks: integration.metrics.clicks || 0,
        conversions: integration.metrics.conversions || 0
      },
      start_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('campaigns')
      .upsert(campaignData, {
        onConflict: 'platform,name'
      });

    if (error) {
      console.error(`Erro ao sincronizar campanhas para ${integration.platform}:`, error);
    }
  }

  /**
   * Atualiza dados de clientes com informações das integrações
   */
  private async updateCustomerData(integration: IntegrationData) {
    // Buscar clientes que podem ter interagido através desta plataforma
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('lead_source', integration.platform);

    if (error) {
      console.error(`Erro ao buscar clientes para ${integration.platform}:`, error);
      return;
    }

    // Atualizar informações dos clientes baseadas na integração
    for (const customer of customers || []) {
      // Garantir que custom_data seja um objeto válido - fix para TypeScript
      const existingCustomData = customer.custom_data && typeof customer.custom_data === 'object' 
        ? customer.custom_data as Record<string, any>
        : {};
      
      const updatedCustomData = {
        ...existingCustomData,
        [`${integration.platform}_integration`]: {
          connected: true,
          last_sync: new Date().toISOString(),
          account_info: integration.accountInfo
        }
      };

      await supabase
        .from('customers')
        .update({
          custom_data: updatedCustomData,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);
    }
  }

  /**
   * Obtém estatísticas das integrações
   */
  async getIntegrationStats() {
    const { data: tokens, error } = await supabase
      .from('ad_tokens')
      .select('*')
      .eq('active', true);

    if (error) {
      console.error("Erro ao obter estatísticas:", error);
      return [];
    }

    return tokens || [];
  }

  /**
   * Verifica se as integrações estão funcionando corretamente
   */
  async validateIntegrations() {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('platform, updated_at')
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error("Erro ao validar integrações:", error);
      return { valid: false, issues: ["Erro ao acessar dados"] };
    }

    const activePlatforms = new Set(campaigns?.map(c => c.platform) || []);
    const expectedPlatforms = ['google', 'facebook', 'linkedin'];
    const missingPlatforms = expectedPlatforms.filter(p => !activePlatforms.has(p));

    return {
      valid: missingPlatforms.length === 0,
      activePlatforms: Array.from(activePlatforms),
      missingPlatforms,
      lastUpdate: campaigns?.[0]?.updated_at
    };
  }
}

export const crmSyncService = new CRMSyncService();
