import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GoogleAdsCustomer {
  id: string;
  name: string;
  currency_code: string;
  time_zone: string;
  status: string;
}

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: string;
  serving_status: string;
  start_date: string;
  end_date?: string;
  advertising_channel_type: string;
  budget_amount?: number;
}

export interface GoogleAdsMetrics {
  impressions: number;
  clicks: number;
  cost_micros: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  average_cpc: number;
  average_cpm: number;
}

/**
 * Busca lista de contas de clientes do Google Ads
 */
export const fetchGoogleAdsCustomers = async (userId: string): Promise<GoogleAdsCustomer[]> => {
  try {
    // Busca o token do usuário
    const { data: tokenData, error: tokenError } = await supabase
      .from('ad_tokens')
      .select('token')
      .eq('platform', 'google')
      .eq('active', true)
      .single();

    if (tokenError || !tokenData) {
      throw new Error('Token do Google Ads não encontrado');
    }

    const response = await fetch('https://googleads.googleapis.com/v16/customers:listAccessibleCustomers', {
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,
        'developer-token': 'YOUR_DEVELOPER_TOKEN', // Você precisa configurar isso
        'login-customer-id': 'YOUR_LOGIN_CUSTOMER_ID'
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Google Ads: ${response.status}`);
    }

    const data = await response.json();
    
    // Log da integração
    await supabase.from('integration_logs').insert({
      integration_type: 'google_ads',
      action: 'fetch_customers',
      status: 'success',
      data: { customer_count: data.resourceNames?.length || 0 }
    });

    return data.resourceNames || [];
  } catch (error: any) {
    // Log do erro
    await supabase.from('integration_logs').insert({
      integration_type: 'google_ads',
      action: 'fetch_customers',
      status: 'error',
      error_message: error.message
    });

    toast.error(`Erro ao buscar contas do Google Ads: ${error.message}`);
    throw error;
  }
};

/**
 * Busca campanhas de uma conta específica
 */
export const fetchGoogleAdsCampaigns = async (customerId: string, userId: string): Promise<GoogleAdsCampaign[]> => {
  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from('ad_tokens')
      .select('token')
      .eq('platform', 'google')
      .eq('active', true)
      .single();

    if (tokenError || !tokenData) {
      throw new Error('Token do Google Ads não encontrado');
    }

    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.serving_status,
        campaign.start_date,
        campaign.end_date,
        campaign.advertising_channel_type
      FROM campaign 
      WHERE campaign.status != 'REMOVED'
    `;

    const response = await fetch(`https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,
        'developer-token': 'YOUR_DEVELOPER_TOKEN',
        'login-customer-id': customerId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Google Ads: ${response.status}`);
    }

    const data = await response.json();
    const campaigns = data.results?.map((result: any) => result.campaign) || [];

    // Salva dados no analytics_reports
    await supabase.from('analytics_reports').insert({
      report_name: 'Google Ads Campaigns',
      report_type: 'campaigns',
      data: { campaigns, customer_id: customerId },
      generated_by: userId,
      period_start: new Date().toISOString().split('T')[0],
      period_end: new Date().toISOString().split('T')[0]
    });

    // Log da integração
    await supabase.from('integration_logs').insert({
      integration_type: 'google_ads',
      action: 'fetch_campaigns',
      status: 'success',
      data: { campaign_count: campaigns.length, customer_id: customerId }
    });

    return campaigns;
  } catch (error: any) {
    await supabase.from('integration_logs').insert({
      integration_type: 'google_ads',
      action: 'fetch_campaigns',
      status: 'error',
      error_message: error.message,
      data: { customer_id: customerId }
    });

    toast.error(`Erro ao buscar campanhas: ${error.message}`);
    throw error;
  }
};

/**
 * Busca métricas de performance das campanhas
 */
export const fetchGoogleAdsMetrics = async (
  customerId: string, 
  campaignIds: string[], 
  startDate: string, 
  endDate: string,
  userId: string
): Promise<{ [campaignId: string]: GoogleAdsMetrics }> => {
  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from('ad_tokens')
      .select('token')
      .eq('platform', 'google')
      .eq('active', true)
      .single();

    if (tokenError || !tokenData) {
      throw new Error('Token do Google Ads não encontrado');
    }

    const campaignFilter = campaignIds.length > 0 
      ? `AND campaign.id IN (${campaignIds.join(',')})`
      : '';

    const query = `
      SELECT 
        campaign.id,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm
      FROM campaign 
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      ${campaignFilter}
    `;

    const response = await fetch(`https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,
        'developer-token': 'YOUR_DEVELOPER_TOKEN',
        'login-customer-id': customerId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Google Ads: ${response.status}`);
    }

    const data = await response.json();
    const metrics: { [campaignId: string]: GoogleAdsMetrics } = {};

    data.results?.forEach((result: any) => {
      const campaignId = result.campaign.id;
      metrics[campaignId] = {
        impressions: parseInt(result.metrics.impressions || '0'),
        clicks: parseInt(result.metrics.clicks || '0'),
        cost_micros: parseInt(result.metrics.cost_micros || '0'),
        conversions: parseFloat(result.metrics.conversions || '0'),
        conversion_value: parseFloat(result.metrics.conversions_value || '0'),
        ctr: parseFloat(result.metrics.ctr || '0'),
        average_cpc: parseInt(result.metrics.average_cpc || '0'),
        average_cpm: parseInt(result.metrics.average_cpm || '0')
      };
    });

    // Salva métricas no analytics_reports
    await supabase.from('analytics_reports').insert({
      report_name: 'Google Ads Metrics',
      report_type: 'metrics',
      data: { metrics, customer_id: customerId, date_range: { start: startDate, end: endDate } },
      generated_by: userId,
      period_start: startDate,
      period_end: endDate
    });

    // Log da integração
    await supabase.from('integration_logs').insert({
      integration_type: 'google_ads',
      action: 'fetch_metrics',
      status: 'success',
      data: { 
        customer_id: customerId, 
        campaign_count: campaignIds.length,
        date_range: { start: startDate, end: endDate }
      }
    });

    return metrics;
  } catch (error: any) {
    await supabase.from('integration_logs').insert({
      integration_type: 'google_ads',
      action: 'fetch_metrics',
      status: 'error',
      error_message: error.message,
      data: { customer_id: customerId }
    });

    toast.error(`Erro ao buscar métricas: ${error.message}`);
    throw error;
  }
};

/**
 * Sincroniza todos os dados do Google Ads
 */
export const syncGoogleAdsData = async (userId: string, customerId?: string) => {
  const toastId = toast.loading("Sincronizando dados do Google Ads...");
  
  try {
    // 1. Buscar contas disponíveis
    const customers = customerId ? [{ id: customerId }] : await fetchGoogleAdsCustomers(userId);
    
    for (const customer of customers) {
      // 2. Buscar campanhas
      const campaigns = await fetchGoogleAdsCampaigns(customer.id, userId);
      
      // 3. Buscar métricas dos últimos 30 dias
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const campaignIds = campaigns.map(c => c.id);
      if (campaignIds.length > 0) {
        await fetchGoogleAdsMetrics(customer.id, campaignIds, startDate, endDate, userId);
      }
    }

    toast.success("Dados do Google Ads sincronizados com sucesso!", { id: toastId });
  } catch (error: any) {
    toast.error(`Erro na sincronização: ${error.message}`, { id: toastId });
    throw error;
  }
};