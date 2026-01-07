import { supabase } from '@/integrations/supabase/client';

export interface SystemStatus {
  hasProfile: boolean;
  hasDepartments: boolean;
  hasSegments: boolean;
  hasProducts: boolean;
  hasCustomers: boolean;
  hasPipelineStages: boolean;
  isReady: boolean;
}

export async function checkSystemStatus(): Promise<SystemStatus> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const [profileRes, deptRes, segRes, prodRes, custRes, stagesRes] = await Promise.all([
    user ? supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from('departments').select('id').limit(1),
    supabase.from('customer_segments').select('id').limit(1),
    supabase.from('products').select('id').limit(1),
    supabase.from('customers').select('id').limit(1),
    supabase.from('pipeline_stages').select('id').limit(1),
  ]);

  const status: SystemStatus = {
    hasProfile: !!profileRes.data,
    hasDepartments: (deptRes.data?.length || 0) > 0,
    hasSegments: (segRes.data?.length || 0) > 0,
    hasProducts: (prodRes.data?.length || 0) > 0,
    hasCustomers: (custRes.data?.length || 0) > 0,
    hasPipelineStages: (stagesRes.data?.length || 0) > 0,
    isReady: false,
  };

  status.isReady = status.hasProfile && status.hasDepartments && status.hasPipelineStages;
  
  return status;
}

export async function syncCurrentUserProfile(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProfile) {
      return { success: true };
    }

    // Get first department as default
    const { data: dept } = await supabase
      .from('departments')
      .select('id')
      .eq('name', 'Comercial')
      .maybeSingle();

    // Create profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
        role: 'admin',
        status: 'active',
        department_id: dept?.id || null,
      });

    if (error) throw error;

    // Also add admin role
    await supabase.from('user_roles').upsert({
      user_id: user.id,
      role: 'admin',
    }, { onConflict: 'user_id,role' });

    return { success: true };
  } catch (err: any) {
    console.error('Error syncing profile:', err);
    return { success: false, error: err.message };
  }
}

export async function initializeSystem(): Promise<{ success: boolean; steps: string[]; errors: string[] }> {
  const steps: string[] = [];
  const errors: string[] = [];

  try {
    // Step 1: Sync user profile
    const profileResult = await syncCurrentUserProfile();
    if (profileResult.success) {
      steps.push('✓ Perfil do usuário sincronizado');
    } else {
      errors.push(`✗ Erro ao sincronizar perfil: ${profileResult.error}`);
    }

    // Step 2: Check departments
    const { data: depts } = await supabase.from('departments').select('id').limit(1);
    if ((depts?.length || 0) > 0) {
      steps.push('✓ Departamentos configurados');
    } else {
      errors.push('✗ Departamentos não encontrados');
    }

    // Step 3: Check segments
    const { data: segs } = await supabase.from('customer_segments').select('id').limit(1);
    if ((segs?.length || 0) > 0) {
      steps.push('✓ Segmentos de clientes configurados');
    } else {
      errors.push('✗ Segmentos não encontrados');
    }

    // Step 4: Check pipeline stages
    const { data: stages } = await supabase.from('pipeline_stages').select('id').limit(1);
    if ((stages?.length || 0) > 0) {
      steps.push('✓ Estágios do pipeline configurados');
    } else {
      errors.push('✗ Estágios do pipeline não encontrados');
    }

    // Step 5: Check lead sources
    const { data: sources } = await supabase.from('lead_sources').select('id').limit(1);
    if ((sources?.length || 0) > 0) {
      steps.push('✓ Fontes de leads configuradas');
    } else {
      errors.push('✗ Fontes de leads não encontradas');
    }

    return {
      success: errors.length === 0,
      steps,
      errors,
    };
  } catch (err: any) {
    errors.push(`Erro geral: ${err.message}`);
    return { success: false, steps, errors };
  }
}
