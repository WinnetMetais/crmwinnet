import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  display_name?: string;
  department_id?: string;
  department?: { id: string; name: string };
  role: string;
  status: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  permissions?: string[];
}

export interface NewUserData {
  email: string;
  password: string;
  full_name: string;
  display_name: string;
  department_id?: string;
  role: string;
  status: string;
  phone?: string;
  permissions: string[];
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar perfis com departamentos
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          departments (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar permissões separadamente para cada usuário
      const profilesWithPermissions = [];
      
      if (profilesData) {
        for (const profile of profilesData) {
          const { data: permissionsData } = await supabase
            .from('financial_permissions')
            .select('permission_type')
            .eq('user_id', profile.user_id)
            .eq('active', true);

          profilesWithPermissions.push({
            ...profile,
            permissions: permissionsData?.map((p: any) => p.permission_type) || []
          });
        }
      }

      setProfiles(profilesWithPermissions);
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar usuários',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: NewUserData) => {
    try {
      setLoading(true);

      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.full_name,
            display_name: userData.display_name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Criar ou atualizar perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            full_name: userData.full_name,
            display_name: userData.display_name,
            role: userData.role,
            status: userData.status,
            department_id: userData.department_id,
            phone: userData.phone,
          });

        if (profileError) throw profileError;

        // 3. Adicionar permissões
        if (userData.permissions.length > 0) {
          const permissionsData = userData.permissions.map(permission => ({
            user_id: authData.user!.id,
            permission_type: permission,
            module: 'all',
            active: true
          }));

          const { error: permissionsError } = await supabase
            .from('financial_permissions')
            .insert(permissionsData);

          if (permissionsError) throw permissionsError;
        }

        toast({
          title: 'Usuário criado com sucesso',
          description: `${userData.full_name} foi adicionado ao sistema.`,
        });

        // Recarregar lista de usuários
        await fetchProfiles();
        return true;
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast({
        title: 'Erro ao criar usuário',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
    try {
      // Filter only the fields that exist in the database table
      const { department, permissions, ...dbUpdates } = updates;
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: 'Perfil atualizado',
        description: 'As informações do usuário foram atualizadas.',
      });

      await fetchProfiles();
      return true;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Erro ao atualizar perfil',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    try {
      // Remover permissões existentes
      const { error: deleteError } = await supabase
        .from('financial_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Adicionar novas permissões
      if (permissions.length > 0) {
        const permissionsData = permissions.map(permission => ({
          user_id: userId,
          permission_type: permission,
          module: 'all',
          active: true
        }));

        const { error: insertError } = await supabase
          .from('financial_permissions')
          .insert(permissionsData);

        if (insertError) throw insertError;
      }

      toast({
        title: 'Permissões atualizadas',
        description: 'As permissões do usuário foram atualizadas.',
      });

      await fetchProfiles();
      return true;
    } catch (err: any) {
      console.error('Error updating permissions:', err);
      toast({
        title: 'Erro ao atualizar permissões',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleUserStatus = async (profileId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return await updateProfile(profileId, { status: newStatus });
  };

  // Fetch profiles on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    createUser,
    updateProfile,
    updateUserPermissions,
    toggleUserStatus,
  };
}