
import { supabase } from "@/integrations/supabase/client";
import { logIntegrationAction } from "@/services/integrationLogs";
import { createCustomerInteraction } from "@/services/opportunities";

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
  token?: string;
}

export class CRMSyncService {
  /**
   * Sincroniza dados das integrações com o CRM
   */
  async syncIntegrationsWithCRM(integrations: IntegrationData[]) {
    try {
      console.log("Iniciando sincronização com CRM", integrations);
      
      await logIntegrationAction('crm', 'sync_start', 'pending', { integrations: integrations.length });
      
      // Atualizar tabela de tokens de anúncios
      for (const integration of integrations) {
        if (integration.status === 'connected') {
          await this.updateAdTokensTable(integration);
          await this.syncCampaignData(integration);
          await this.updateCustomerData(integration);
          await this.createInteractionLogs(integration);
        }
      }
      
      await logIntegrationAction('crm', 'sync_complete', 'success', { integrations_synced: integrations.length });
      console.log("Sincronização concluída com sucesso");
      return { success: true };
    } catch (error) {
      console.error("Erro na sincronização:", error);
      await logIntegrationAction('crm', 'sync_error', 'error', null, String(error));
      throw error;
    }
  }

  /**
   * Atualiza a tabela ad_tokens com informações da integração
   */
  private async updateAdTokensTable(integration: IntegrationData) {
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
      await logIntegrationAction(integration.platform, 'update_tokens', 'error', null, error.message);
    } else {
      await logIntegrationAction(integration.platform, 'update_tokens', 'success');
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
      budget: 0,
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
      await logIntegrationAction(integration.platform, 'sync_campaigns', 'error', campaignData, error.message);
    } else {
      await logIntegrationAction(integration.platform, 'sync_campaigns', 'success', campaignData);
    }
  }

  /**
   * Atualiza dados de clientes com informações das integrações
   */
  private async updateCustomerData(integration: IntegrationData) {
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

      // Atualizar dados do cliente
      await supabase
        .from('customers')
        .update({
          custom_data: updatedCustomData,
          source_details: {
            platform: integration.platform,
            sync_date: new Date().toISOString(),
            metrics: integration.metrics
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);

      // Atualizar lead score baseado na atividade
      const leadScore = this.calculateLeadScore(integration.metrics);
      if (leadScore > 0) {
        await supabase
          .from('customers')
          .update({ lead_score: leadScore })
          .eq('id', customer.id);
      }
    }
  }

  /**
   * Cria logs de interação baseados nas integrações
   */
  private async createInteractionLogs(integration: IntegrationData) {
    const { data: customers } = await supabase
      .from('customers')
      .select('id, name')
      .eq('lead_source', integration.platform)
      .limit(10);

    for (const customer of customers || []) {
      await createCustomerInteraction({
        customer_id: customer.id,
        interaction_type: 'integration_sync',
        subject: `Sincronização ${integration.platform}`,
        description: `Dados sincronizados automaticamente da plataforma ${integration.platform}`,
        date: new Date().toISOString(),
        created_by: 'Sistema de Integração'
      });
    }
  }

  /**
   * Calcula score do lead baseado nas métricas
   */
  private calculateLeadScore(metrics?: IntegrationData['metrics']): number {
    if (!metrics) return 0;

    let score = 0;
    
    // Pontuação baseada em impressões
    if (metrics.impressions) {
      score += Math.min(metrics.impressions / 1000, 20);
    }
    
    // Pontuação baseada em cliques
    if (metrics.clicks) {
      score += Math.min(metrics.clicks / 10, 30);
    }
    
    // Pontuação baseada em conversões
    if (metrics.conversions) {
      score += Math.min(metrics.conversions * 50, 50);
    }
    
    return Math.round(score);
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
      await logIntegrationAction('crm', 'get_stats', 'error', null, error.message);
      return [];
    }

    await logIntegrationAction('crm', 'get_stats', 'success', { tokens_found: tokens?.length || 0 });
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
      await logIntegrationAction('crm', 'validate', 'error', null, error.message);
      return { valid: false, issues: ["Erro ao acessar dados"] };
    }

    const activePlatforms = new Set(campaigns?.map(c => c.platform) || []);
    const expectedPlatforms = ['google', 'facebook', 'linkedin'];
    const missingPlatforms = expectedPlatforms.filter(p => !activePlatforms.has(p));

    const result = {
      valid: missingPlatforms.length === 0,
      activePlatforms: Array.from(activePlatforms),
      missingPlatforms,
      lastUpdate: campaigns?.[0]?.updated_at
    };

    await logIntegrationAction('crm', 'validate', 'success', result);
    return result;
  }

  /**
   * Sincroniza oportunidades com deals existentes
   */
  async syncOpportunitiesWithDeals() {
    try {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .is('deal_id', null);

      const { data: deals } = await supabase
        .from('deals')
        .select('*')
        .is('opportunity_id', null);

      // Relacionar oportunidades com deals baseado no cliente e valor
      for (const opportunity of opportunities || []) {
        const matchingDeal = deals?.find(deal => 
          deal.customer_id === opportunity.customer_id &&
          Math.abs((deal.estimated_value || 0) - (opportunity.value || 0)) < 100
        );

        if (matchingDeal) {
          // Atualizar deal com referência da oportunidade
          await supabase
            .from('deals')
            .update({ opportunity_id: opportunity.id })
            .eq('id', matchingDeal.id);

          // Atualizar oportunidade com estágio do deal
          await supabase
            .from('opportunities')
            .update({ 
              stage: matchingDeal.status || 'prospecto',
              probability: this.stageToProbalitity(matchingDeal.status)
            })
            .eq('id', opportunity.id);
        }
      }

      await logIntegrationAction('crm', 'sync_opportunities_deals', 'success');
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar oportunidades com deals:", error);
      await logIntegrationAction('crm', 'sync_opportunities_deals', 'error', null, String(error));
      return false;
    }
  }

  private stageToProbalitity(stage?: string): number {
    const stageMap: Record<string, number> = {
      'prospecto': 20,
      'qualificacao': 40,
      'proposta': 60,
      'negociacao': 80,
      'fechamento': 95,
      'lead': 10
    };
    return stageMap[stage || 'lead'] || 20;
  }
}

export const crmSyncService = new CRMSyncService();
