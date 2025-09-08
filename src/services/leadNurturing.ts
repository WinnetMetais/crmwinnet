import { supabase } from "@/integrations/supabase/client";

export interface LeadNurturingTask {
  id: string;
  customer_id: string;
  task_type: 'follow_up' | 'cold_reactivation' | 'proposal_follow' | 'demo_schedule';
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta';
  due_date: string;
  status: 'pendente' | 'concluida' | 'cancelada';
  automated: boolean;
  created_at: string;
  created_by?: string;
}

export interface ColdLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  last_contact_date?: string;
  days_since_contact: number;
  status: string;
  lead_score: number;
  opportunities_count: number;
  last_activity: string;
}

class LeadNurturingService {
  async getColdLeads(daysSinceContact: number = 30): Promise<ColdLead[]> {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id, name, email, phone, last_contact_date, status, lead_score,
        opportunities(count)
      `)
      .or(`last_contact_date.is.null,last_contact_date.lt.${new Date(Date.now() - daysSinceContact * 24 * 60 * 60 * 1000).toISOString()}`)
      .eq('status', 'prospect');

    if (error) throw error;

    return data?.map(customer => ({
      ...customer,
      days_since_contact: customer.last_contact_date 
        ? Math.floor((Date.now() - new Date(customer.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
        : 999,
      opportunities_count: customer.opportunities?.[0]?.count || 0,
      last_activity: customer.last_contact_date || 'Nunca contatado'
    })) || [];
  }

  async createNurturingTask(taskData: Partial<LeadNurturingTask>): Promise<any> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'media',
        due_date: taskData.due_date,
        status: taskData.status || 'pendente',
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        customer_id: taskData.customer_id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async generateAutomatedTasks(): Promise<LeadNurturingTask[]> {
    const coldLeads = await this.getColdLeads(15); // 15 days
    const tasks: LeadNurturingTask[] = [];

    for (const lead of coldLeads) {
      if (lead.days_since_contact > 30) {
        // Cold reactivation task for very cold leads
        const task = await this.createNurturingTask({
          customer_id: lead.id,
          task_type: 'cold_reactivation',
          title: `Reativar lead frio: ${lead.name}`,
          description: `Lead sem contato há ${lead.days_since_contact} dias. Realizar campanha de reativação.`,
          priority: lead.lead_score > 50 ? 'alta' : 'media',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          status: 'pendente',
          automated: true
        });
        tasks.push(task);
      } else if (lead.days_since_contact > 15 && lead.opportunities_count > 0) {
        // Follow up task for warm leads with opportunities
        const task = await this.createNurturingTask({
          customer_id: lead.id,
          task_type: 'follow_up',
          title: `Follow-up: ${lead.name}`,
          description: `Cliente com oportunidades pendentes. Realizar follow-up comercial.`,
          priority: 'alta',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          status: 'pendente',
          automated: true
        });
        tasks.push(task);
      }
    }

    return tasks;
  }

  async getNurturingTasks(): Promise<any[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        customers(name, email, phone)
      `)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateTaskStatus(taskId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) throw error;
  }

  async getLeadMetrics() {
    const { data: totalLeads, error: leadsError } = await supabase
      .from('customers')
      .select('id', { count: 'exact' })
      .eq('status', 'prospect');

    const coldLeads = await this.getColdLeads(30);
    
    const { data: activeTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' })
      .eq('status', 'pendente');

    if (leadsError || tasksError) {
      throw leadsError || tasksError;
    }

    return {
      totalLeads: totalLeads?.length || 0,
      coldLeads: coldLeads.length,
      activeTasks: activeTasks?.length || 0,
      conversionOpportunity: coldLeads.filter(lead => lead.lead_score > 60).length
    };
  }
}

export const leadNurturingService = new LeadNurturingService();