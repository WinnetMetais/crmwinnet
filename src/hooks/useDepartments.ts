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
        .eq('active', true)
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

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
  };
}