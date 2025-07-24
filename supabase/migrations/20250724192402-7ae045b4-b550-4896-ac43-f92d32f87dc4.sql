-- 1. Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  position TEXT,
  department TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS public.system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar tabela de jobs de backup
CREATE TABLE IF NOT EXISTS public.backup_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  schedule_cron TEXT,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'running', 'failed')),
  backup_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Criar tabela de permissões de usuário
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, permission_name, resource_type, resource_id)
);

-- 6. Habilitar RLS nas novas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS para profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Criar políticas RLS para audit_logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- 9. Criar políticas RLS para system_config
CREATE POLICY "Users can view public configs" ON public.system_config FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage all configs" ON public.system_config FOR ALL USING (true);

-- 10. Criar políticas RLS para backup_jobs
CREATE POLICY "Admins can manage backup jobs" ON public.backup_jobs FOR ALL USING (true);

-- 11. Criar políticas RLS para user_permissions
CREATE POLICY "Users can view their own permissions" ON public.user_permissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all permissions" ON public.user_permissions FOR ALL USING (true);

-- 12. Adicionar foreign keys que estavam faltando
ALTER TABLE public.customers ADD CONSTRAINT fk_customers_lead_source 
  FOREIGN KEY (lead_source_id) REFERENCES public.lead_sources(id);
  
ALTER TABLE public.customers ADD CONSTRAINT fk_customers_segment 
  FOREIGN KEY (segment_id) REFERENCES public.customer_segments(id);

ALTER TABLE public.deals ADD CONSTRAINT fk_deals_customer 
  FOREIGN KEY (customer_id) REFERENCES public.customers(id);
  
ALTER TABLE public.deals ADD CONSTRAINT fk_deals_pipeline_stage 
  FOREIGN KEY (pipeline_stage_id) REFERENCES public.pipeline_stages(id);

-- 13. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Função de auditoria genérica
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  old_record JSONB;
  new_record JSONB;
  changed_fields TEXT[] := '{}';
  field_name TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_record := to_jsonb(OLD);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, old_record
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    old_record := to_jsonb(OLD);
    new_record := to_jsonb(NEW);
    
    FOR field_name IN SELECT key FROM jsonb_each(new_record) LOOP
      IF old_record->>field_name IS DISTINCT FROM new_record->>field_name THEN
        changed_fields := array_append(changed_fields, field_name);
      END IF;
    END LOOP;
    
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data, new_data, changed_fields
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, old_record, new_record, changed_fields
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    new_record := to_jsonb(NEW);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, new_data
    ) VALUES (
      auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, new_record
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Aplicar triggers de auditoria nas tabelas principais
CREATE TRIGGER audit_customers AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
  
CREATE TRIGGER audit_deals AFTER INSERT OR UPDATE OR DELETE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
  
CREATE TRIGGER audit_opportunities AFTER INSERT OR UPDATE OR DELETE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
  
CREATE TRIGGER audit_quotes AFTER INSERT OR UPDATE OR DELETE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
  
CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- 17. Função para estatísticas avançadas
CREATE OR REPLACE FUNCTION public.get_advanced_statistics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'customers', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM customers),
      'new_this_period', (SELECT COUNT(*) FROM customers WHERE created_at::date BETWEEN start_date AND end_date),
      'by_status', (SELECT jsonb_object_agg(status, count) FROM (
        SELECT status, COUNT(*) as count FROM customers GROUP BY status
      ) t)
    ),
    'deals', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM deals),
      'total_value', (SELECT COALESCE(SUM(value), 0) FROM deals),
      'won_this_period', (SELECT COUNT(*) FROM deals WHERE status = 'won' AND close_date BETWEEN start_date AND end_date),
      'by_stage', (SELECT jsonb_object_agg(s.name, COALESCE(d.count, 0)) FROM 
        pipeline_stages s LEFT JOIN (
          SELECT pipeline_stage_id, COUNT(*) as count FROM deals GROUP BY pipeline_stage_id
        ) d ON s.id = d.pipeline_stage_id)
    ),
    'revenue', jsonb_build_object(
      'total_period', (SELECT COALESCE(SUM(amount), 0) FROM transactions 
        WHERE type = 'receita' AND date BETWEEN start_date AND end_date),
      'expenses_period', (SELECT COALESCE(SUM(amount), 0) FROM transactions 
        WHERE type = 'despesa' AND date BETWEEN start_date AND end_date),
      'by_category', (SELECT jsonb_object_agg(category, amount) FROM (
        SELECT category, SUM(amount) as amount FROM transactions 
        WHERE date BETWEEN start_date AND end_date GROUP BY category
      ) t)
    ),
    'opportunities', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM opportunities),
      'total_value', (SELECT COALESCE(SUM(value), 0) FROM opportunities WHERE status = 'active'),
      'conversion_rate', (SELECT ROUND(
        CASE WHEN COUNT(*) > 0 THEN 
          (COUNT(*) FILTER (WHERE status = 'won') * 100.0 / COUNT(*))
        ELSE 0 END, 2
      ) FROM opportunities WHERE created_at::date >= start_date - INTERVAL '90 days')
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Inserir configurações padrão do sistema
INSERT INTO public.system_config (config_key, config_value, description, is_public) VALUES
  ('company_name', '"CRM Winnet"', 'Nome da empresa', true),
  ('default_currency', '"BRL"', 'Moeda padrão', true),
  ('backup_retention_days', '30', 'Dias de retenção de backup', false),
  ('max_file_upload_size', '10485760', 'Tamanho máximo de upload (bytes)', false),
  ('email_notifications_enabled', 'true', 'Notificações por email habilitadas', false)
ON CONFLICT (config_key) DO NOTHING;

-- 19. Atualizar trigger existente para produtos
DROP TRIGGER IF EXISTS calculate_margins_trigger ON public.products;
CREATE TRIGGER calculate_margins_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_product_margins();

-- 20. Atualizar trigger existente para qualidade de dados de customers
DROP TRIGGER IF EXISTS update_customer_quality_trigger ON public.customers;
CREATE TRIGGER update_customer_quality_trigger
  BEFORE INSERT OR UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_quality_score();

-- 21. Trigger para atualizar updated_at nas novas tabelas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON public.system_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backup_jobs_updated_at
  BEFORE UPDATE ON public.backup_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();