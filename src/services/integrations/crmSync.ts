
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

  /**
   * Converte estágio para probabilidade
   */
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

  /**
   * Sincroniza dados de planilha com o CRM
   */
  async syncSpreadsheetData(csvContent: string) {
    try {
      console.log("Iniciando sincronização de planilha com CRM");
      
      await logIntegrationAction('spreadsheet', 'sync_start', 'pending');
      
      // Processar dados da planilha
      const rows = this.parseSpreadsheetData(csvContent);
      
      // Sincronizar transações
      const transactionResults = await this.syncFinancialTransactions(rows);
      
      // Atualizar métricas do CRM
      await this.updateCRMMetrics(transactionResults);
      
      await logIntegrationAction('spreadsheet', 'sync_complete', 'success', {
        transactions_synced: transactionResults.success,
        total_processed: transactionResults.total
      });
      
      console.log("Sincronização de planilha concluída com sucesso");
      return transactionResults;
    } catch (error) {
      console.error("Erro na sincronização de planilha:", error);
      await logIntegrationAction('spreadsheet', 'sync_error', 'error', null, String(error));
      throw error;
    }
  }

  /**
   * Processa dados da planilha
   */
  private parseSpreadsheetData(csvContent: string) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        
        switch (header) {
          case 'data':
          case 'date':
            row.date = this.parseDate(value);
            break;
          case 'descrição':
          case 'descricao':
          case 'description':
            row.description = value;
            break;
          case 'categoria':
          case 'category':
            row.category = value;
            break;
          case 'tipo':
          case 'type':
            row.type = value.toLowerCase().includes('entrada') ? 'receita' : 'despesa';
            break;
          case 'valor':
          case 'value':
          case 'amount':
            row.amount = this.parseAmount(value);
            break;
          case 'status':
            row.status = this.parseStatus(value);
            break;
          case 'método':
          case 'metodo':
          case 'method':
            row.method = value;
            break;
          case 'cliente':
          case 'client':
            row.client = value;
            break;
        }
      });
      
      return row;
    }).filter(row => row.description && row.amount);
  }

  /**
   * Sincroniza transações financeiras
   */
  private async syncFinancialTransactions(rows: any[]) {
    let successCount = 0;
    let errorCount = 0;
    const total = rows.length;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    for (const row of rows) {
      try {
        // Verificar se cliente existe e criar se necessário
        let customerId = null;
        if (row.client) {
          customerId = await this.findOrCreateCustomer(row.client);
        }

        const transactionData = {
          type: row.type,
          title: row.description,
          amount: Math.abs(row.amount),
          category: row.category || 'Importado da Planilha',
          date: row.date,
          status: row.status,
          payment_method: row.method || '',
          description: `Importado da planilha Winnet: ${row.description}`,
          client_name: row.client || '',
          user_id: user.id
        };

        // Verificar duplicatas
        const isDuplicate = await this.checkTransactionDuplicate(transactionData);
        
        if (!isDuplicate) {
          const { error } = await supabase
            .from('transactions')
            .insert(transactionData);

          if (error) throw error;

          // Se for uma receita e tiver cliente, criar interação
          if (row.type === 'receita' && customerId) {
            await this.createCustomerInteraction(customerId, row);
          }

          successCount++;
        }
      } catch (error) {
        console.error('Erro ao sincronizar transação:', error);
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount, total };
  }

  /**
   * Encontra ou cria cliente
   */
  private async findOrCreateCustomer(clientName: string) {
    try {
      // Buscar cliente existente
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .ilike('name', clientName)
        .limit(1)
        .single();

      if (existingCustomer) {
        return existingCustomer.id;
      }

      // Criar novo cliente
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          name: clientName,
          lead_source: 'planilha_financeira',
          status: 'ativo',
          notes: 'Cliente importado automaticamente da planilha financeira'
        })
        .select('id')
        .single();

      if (error) throw error;
      return newCustomer.id;
    } catch (error) {
      console.error('Erro ao encontrar/criar cliente:', error);
      return null;
    }
  }

  /**
   * Verifica se transação já existe
   */
  private async checkTransactionDuplicate(transactionData: any): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('id')
        .eq('title', transactionData.title)
        .eq('amount', transactionData.amount)
        .eq('date', transactionData.date)
        .limit(1);

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar duplicata:', error);
      return false;
    }
  }

  /**
   * Cria interação com cliente
   */
  private async createCustomerInteraction(customerId: string, row: any) {
    try {
      await supabase
        .from('customer_interactions')
        .insert({
          customer_id: customerId,
          interaction_type: 'financial_transaction',
          subject: `Transação: ${row.description}`,
          description: `Valor: R$ ${row.amount.toFixed(2)} - Importado da planilha`,
          date: row.date,
          created_by: 'Sistema de Sincronização'
        });
    } catch (error) {
      console.error('Erro ao criar interação:', error);
    }
  }

  /**
   * Atualiza métricas do CRM
   */
  private async updateCRMMetrics(results: any) {
    try {
      const metricsData = {
        last_sync: new Date().toISOString(),
        transactions_imported: results.success,
        sync_errors: results.errors,
        total_processed: results.total
      };

      await supabase
        .from('integration_logs')
        .insert({
          integration_type: 'spreadsheet_metrics',
          action: 'update_metrics',
          status: 'success',
          data: metricsData
        });
    } catch (error) {
      console.error('Erro ao atualizar métricas:', error);
    }
  }

  /**
   * Utilitários de parsing
   */
  private parseDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr || new Date().toISOString().split('T')[0];
  }

  private parseAmount(amountStr: string): number {
    const cleaned = amountStr.replace(/[^\d.,-]/g, '');
    const normalized = cleaned.replace(',', '.');
    return parseFloat(normalized) || 0;
  }

  private parseStatus(statusStr: string): 'pendente' | 'pago' | 'vencido' {
    const status = statusStr.toLowerCase();
    if (status.includes('pago') || status.includes('recebido')) {
      return 'pago';
    } else if (status.includes('vencido') || status.includes('atrasado')) {
      return 'vencido';
    }
    return 'pendente';
  }
}

export const crmSyncService = new CRMSyncService();
