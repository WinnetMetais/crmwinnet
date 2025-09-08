import { supabase } from "@/integrations/supabase/client";

export interface ConversionMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  opportunities: number;
  closedDeals: number;
  leadToQualified: number;
  qualifiedToOpportunity: number;
  opportunityToClose: number;
  overallConversion: number;
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  value: number;
  conversionRate: number;
}

export interface ConversionTrend {
  period: string;
  leads: number;
  opportunities: number;
  deals: number;
  conversionRate: number;
}

class ConversionAnalyticsService {
  async getConversionMetrics(): Promise<ConversionMetrics> {
    // Get total leads
    const { data: leadsData, error: leadsError } = await supabase
      .from('customers')
      .select('id, status, created_at')
      .in('status', ['prospect', 'qualified', 'customer']);

    if (leadsError) throw leadsError;

    // Get opportunities
    const { data: opportunitiesData, error: oppsError } = await supabase
      .from('opportunities')
      .select('id, stage, value, customer_id');

    if (oppsError) throw oppsError;

    // Get closed deals
    const { data: dealsData, error: dealsError } = await supabase
      .from('deals')
      .select('id, status, value, customer_id')
      .eq('status', 'won');

    if (dealsError) throw dealsError;

    const totalLeads = leadsData?.length || 0;
    const qualifiedLeads = leadsData?.filter(l => l.status === 'qualified').length || 0;
    const opportunities = opportunitiesData?.length || 0;
    const closedDeals = dealsData?.length || 0;

    const leadToQualified = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    const qualifiedToOpportunity = qualifiedLeads > 0 ? (opportunities / qualifiedLeads) * 100 : 0;
    const opportunityToClose = opportunities > 0 ? (closedDeals / opportunities) * 100 : 0;
    const overallConversion = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0;

    return {
      totalLeads,
      qualifiedLeads,
      opportunities,
      closedDeals,
      leadToQualified,
      qualifiedToOpportunity,
      opportunityToClose,
      overallConversion
    };
  }

  async getConversionFunnel(): Promise<ConversionFunnelData[]> {
    const metrics = await this.getConversionMetrics();

    return [
      {
        stage: 'Leads',
        count: metrics.totalLeads,
        value: 0,
        conversionRate: 100
      },
      {
        stage: 'Qualificados',
        count: metrics.qualifiedLeads,
        value: 0,
        conversionRate: metrics.leadToQualified
      },
      {
        stage: 'Oportunidades',
        count: metrics.opportunities,
        value: 0,
        conversionRate: metrics.qualifiedToOpportunity
      },
      {
        stage: 'Fechados',
        count: metrics.closedDeals,
        value: 0,
        conversionRate: metrics.opportunityToClose
      }
    ];
  }

  async getConversionTrends(months: number = 6): Promise<ConversionTrend[]> {
    const trends: ConversionTrend[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);

      // Get leads for this period
      const { data: leadsData } = await supabase
        .from('customers')
        .select('id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Get opportunities for this period
      const { data: oppsData } = await supabase
        .from('opportunities')
        .select('id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Get deals for this period
      const { data: dealsData } = await supabase
        .from('deals')
        .select('id')
        .eq('status', 'won')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const leads = leadsData?.length || 0;
      const opportunities = oppsData?.length || 0;
      const deals = dealsData?.length || 0;
      const conversionRate = leads > 0 ? (deals / leads) * 100 : 0;

      trends.push({
        period: startDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        leads,
        opportunities,
        deals,
        conversionRate
      });
    }

    return trends;
  }

  async getSourceAnalysis() {
    const { data: customersData, error } = await supabase
      .from('customers')
      .select(`
        id, lead_source, status,
        opportunities(count),
        deals(count)
      `);

    if (error) throw error;

    const sourceAnalysis = customersData?.reduce((acc, customer) => {
      const source = customer.lead_source || 'Não informado';
      
      if (!acc[source]) {
        acc[source] = {
          source,
          leads: 0,
          opportunities: 0,
          deals: 0,
          conversionRate: 0
        };
      }

      acc[source].leads += 1;
      acc[source].opportunities += customer.opportunities?.[0]?.count || 0;
      acc[source].deals += customer.deals?.[0]?.count || 0;

      return acc;
    }, {} as any);

    return Object.values(sourceAnalysis || {}).map((source: any) => ({
      ...source,
      conversionRate: source.leads > 0 ? (source.deals / source.leads) * 100 : 0
    }));
  }

  async getStageAnalysis() {
    const { data: opportunitiesData, error } = await supabase
      .from('opportunities')
      .select('stage, value, expected_close_date, actual_close_date');

    if (error) throw error;

    const stageAnalysis = opportunitiesData?.reduce((acc, opp) => {
      const stage = opp.stage || 'Não definido';
      
      if (!acc[stage]) {
        acc[stage] = {
          stage,
          count: 0,
          totalValue: 0,
          averageValue: 0,
          averageDaysInStage: 0
        };
      }

      acc[stage].count += 1;
      acc[stage].totalValue += opp.value || 0;

      return acc;
    }, {} as any);

    return Object.values(stageAnalysis || {}).map((stage: any) => ({
      ...stage,
      averageValue: stage.count > 0 ? stage.totalValue / stage.count : 0
    }));
  }
}

export const conversionAnalyticsService = new ConversionAnalyticsService();