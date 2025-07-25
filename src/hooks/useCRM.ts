
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CRMCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  status?: string;
  lead_source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMDeal {
  id: string;
  title: string;
  customer_id: string;
  estimated_value?: number;
  actual_value?: number;
  status?: string;
  assigned_to?: string;
  pipeline_stage_id?: string;
  created_at: string;
  updated_at: string;
  customers?: {
    id: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
  };
}

export interface CRMTask {
  id: string;
  title: string;
  description?: string;
  customer_id?: string;
  deal_id?: string;
  assigned_to?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Hook para clientes
export const useCustomers = () => {
  return useQuery({
    queryKey: ['crm-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Erro ao carregar clientes: ' + error.message);
        throw error;
      }
      
      return data as CRMCustomer[];
    }
  });
};

// Hook para negócios/deals
export const useDeals = () => {
  return useQuery({
    queryKey: ['crm-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          customers (
            id,
            name,
            company,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Erro ao carregar negócios: ' + error.message);
        throw error;
      }
      
      // Transform the data to match CRMDeal interface
      return (data || []).map(deal => ({
        ...deal,
        customers: deal.customers && !('error' in deal.customers) ? deal.customers : {
          id: deal.customer_id || '',
          name: 'Cliente não encontrado',
          company: '',
          email: '',
          phone: ''
        }
      })) as CRMDeal[];
    }
  });
};

// Hook para tarefas
export const useTasks = () => {
  return useQuery({
    queryKey: ['crm-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Erro ao carregar tarefas: ' + error.message);
        throw error;
      }
      
      return data as CRMTask[];
    }
  });
};

// Mutation para criar cliente
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customerData: Omit<CRMCustomer, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          company: customerData.company,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          status: customerData.status || 'active',
          lead_source: customerData.lead_source,
          notes: customerData.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
      toast.success('Cliente criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar cliente: ' + error.message);
    }
  });
};

// Mutation para atualizar cliente
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<CRMCustomer, 'id' | 'created_at' | 'updated_at'>> }) => {
      const updateData: any = {};
      
      if (data.name) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.company !== undefined) updateData.company = data.company;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.city !== undefined) updateData.city = data.city;
      if (data.state !== undefined) updateData.state = data.state;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.lead_source !== undefined) updateData.lead_source = data.lead_source;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const { data: result, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar cliente: ' + error.message);
    }
  });
};

// Mutation para criar negócio
export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dealData: Omit<CRMDeal, 'id' | 'created_at' | 'updated_at' | 'customers'>) => {
      const { data, error } = await supabase
        .from('deals')
        .insert({
          title: dealData.title,
          customer_id: dealData.customer_id,
          estimated_value: dealData.estimated_value,
          actual_value: dealData.actual_value,
          status: dealData.status || 'lead',
          assigned_to: dealData.assigned_to,
          pipeline_stage_id: dealData.pipeline_stage_id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      toast.success('Negócio criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar negócio: ' + error.message);
    }
  });
};

// Mutation para atualizar negócio
export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<CRMDeal, 'id' | 'created_at' | 'updated_at' | 'customers'>> }) => {
      const updateData: any = {};
      
      if (data.title) updateData.title = data.title;
      if (data.customer_id) updateData.customer_id = data.customer_id;
      if (data.estimated_value !== undefined) updateData.estimated_value = data.estimated_value;
      if (data.actual_value !== undefined) updateData.actual_value = data.actual_value;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.assigned_to !== undefined) updateData.assigned_to = data.assigned_to;
      if (data.pipeline_stage_id !== undefined) updateData.pipeline_stage_id = data.pipeline_stage_id;

      const { data: result, error } = await supabase
        .from('deals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      toast.success('Negócio atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar negócio: ' + error.message);
    }
  });
};

// Mutation para criar tarefa
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: Omit<CRMTask, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          customer_id: taskData.customer_id,
          deal_id: taskData.deal_id,
          assigned_to: taskData.assigned_to,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.due_date,
          user_id: taskData.user_id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar tarefa: ' + error.message);
    }
  });
};

// Mutation para atualizar tarefa
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<CRMTask, 'id' | 'created_at' | 'updated_at'>> }) => {
      const updateData: any = {};
      
      if (data.title) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.customer_id !== undefined) updateData.customer_id = data.customer_id;
      if (data.deal_id !== undefined) updateData.deal_id = data.deal_id;
      if (data.assigned_to !== undefined) updateData.assigned_to = data.assigned_to;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.due_date !== undefined) updateData.due_date = data.due_date;
      if (data.user_id) updateData.user_id = data.user_id;

      const { data: result, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar tarefa: ' + error.message);
    }
  });
};

// Hook para métricas do CRM
export const useCRMMetrics = () => {
  const { data: customers } = useCustomers();
  const { data: deals } = useDeals();
  const { data: tasks } = useTasks();

  return {
    totalCustomers: customers?.length || 0,
    totalDeals: deals?.length || 0,
    totalTasks: tasks?.length || 0,
    totalRevenue: deals?.reduce((sum, deal) => sum + (deal.estimated_value || 0), 0) || 0,
    pendingTasks: tasks?.filter(task => task.status === 'pending').length || 0,
    activeFunnelDeals: deals?.filter(deal => deal.status === 'lead' || deal.status === 'qualified').length || 0
  };
};
