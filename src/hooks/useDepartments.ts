import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

export interface Department {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;

      setDepartments(data || []);
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar departamentos',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (department: Omit<Department, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([department])
        .select()
        .single();

      if (error) throw error;

      await fetchDepartments();
      return data;
    } catch (err: any) {
      console.error('Error creating department:', err);
      throw err;
    }
  };

  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    try {
      const { error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchDepartments();
    } catch (err: any) {
      console.error('Error updating department:', err);
      throw err;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchDepartments();
    } catch (err: any) {
      console.error('Error deleting department:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}