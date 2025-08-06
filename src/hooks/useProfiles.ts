import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  display_name?: string;
  department?: string;
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
  department: string;
  role: string;
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

      // Buscar perfis
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar permissões separadamente para cada usuário
      const profilesWithPermissions = [];
      
      if (profilesData) {
        for (const profile of profilesData) {
          const { data: permissionsData } = await supabase
            .from('user_permissions_new')
            .select('permission')
            .eq('user_id', profile.user_id);

          profilesWithPermissions.push({
            ...profile,
            permissions: permissionsData?.map((p: any) => p.permission) || []
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
            display_name: userData.full_name.split(' ')[0],
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Atualizar perfil com dados adicionais
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name,
            department: userData.department,
            role: userData.role,
            phone: userData.phone,
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;

        // 3. Adicionar permissões
        if (userData.permissions.length > 0) {
          const permissionsData = userData.permissions.map(permission => ({
            user_id: authData.user!.id,
            permission: permission as any
          }));

          const { error: permissionsError } = await supabase
            .from('user_permissions_new')
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
      const { error } = await supabase
        .from('profiles')
        .update(updates)
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
        .from('user_permissions_new')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Adicionar novas permissões
      if (permissions.length > 0) {
        const permissionsData = permissions.map(permission => ({
          user_id: userId,
          permission: permission as any
        }));

        const { error: insertError } = await supabase
          .from('user_permissions_new')
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