
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
  customers?: CRMCustomer;
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
      
      return data as CRMDeal[];
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
    mutationFn: async (customerData: Partial<CRMCustomer>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<CRMCustomer> }) => {
      const { data: result, error } = await supabase
        .from('customers')
        .update(data)
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
    mutationFn: async (dealData: Partial<CRMDeal>) => {
      const { data, error } = await supabase
        .from('deals')
        .insert(dealData)
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<CRMDeal> }) => {
      const { data: result, error } = await supabase
        .from('deals')
        .update(data)
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
    mutationFn: async (taskData: Partial<CRMTask>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<CRMTask> }) => {
      const { data: result, error } = await supabase
        .from('tasks')
        .update(data)
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
