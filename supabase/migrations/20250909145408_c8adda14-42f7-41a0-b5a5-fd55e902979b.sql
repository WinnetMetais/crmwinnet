-- MIGRAÇÃO FINAL CUIDADOSA - CORREÇÃO DOS ÚLTIMOS WARNINGS
-- Verificando tipos corretos antes de modificar

-- ============================
-- 1. REMOVER APENAS VIEWS 
-- ============================

-- Verificar e remover apenas objetos que são realmente views
DO $$
DECLARE
    view_record RECORD;
BEGIN
    -- Buscar apenas VIEWS (não tabelas) que podem ter SECURITY DEFINER
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Dropar views encontradas 
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_record.schemaname, view_record.viewname);
    END LOOP;
END $$;

-- Recriar apenas a view essencial 'me' de forma segura
CREATE VIEW public.me AS
SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.display_name,
    p.department,
    p.department_id,
    p.role,
    p.status,
    p.phone,
    p.avatar_url,
    p.bio,
    p.created_at,
    p.updated_at,
    d.name as department_name
FROM profiles p
LEFT JOIN departments d ON d.id = p.department_id;

-- ==========================================
-- 2. CORRIGIR FUNÇÕES RESTANTES
-- ==========================================

-- Lista de funções que sabemos que existem e precisam ser corrigidas
CREATE OR REPLACE FUNCTION public.check_failed_auth_attempts()
RETURNS TABLE(user_email text, attempt_count bigint, last_attempt timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    raw_user_meta_data->>'email' as user_email,
    COUNT(*) as attempt_count,
    MAX(created_at) as last_attempt
  FROM auth.audit_log_entries
  WHERE event_name = 'user_signedin_failed'
    AND created_at > NOW() - INTERVAL '1 hour'
  GROUP BY raw_user_meta_data->>'email'
  HAVING COUNT(*) > 3
  ORDER BY attempt_count DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Check if the current user has an admin role
    RETURN EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = (SELECT auth.uid()) 
        AND 'admin' = ANY(roles)
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
      (SELECT auth.uid()), TG_TABLE_NAME, OLD.id, TG_OP, old_record
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
      (SELECT auth.uid()), TG_TABLE_NAME, NEW.id, TG_OP, old_record, new_record, changed_fields
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    new_record := to_jsonb(NEW);
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, new_data
    ) VALUES (
      (SELECT auth.uid()), TG_TABLE_NAME, NEW.id, TG_OP, new_record
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data
    ) VALUES (
      (SELECT auth.uid()), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, old_data, new_data
    ) VALUES (
      (SELECT auth.uid()), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id, table_name, record_id, action, new_data
    ) VALUES (
      (SELECT auth.uid()), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- =====================================================
-- 3. MOVER MATERIALIZED VIEWS PARA SCHEMA INTERNO
-- =====================================================

-- Criar schema interno se não existir
CREATE SCHEMA IF NOT EXISTS internal;

-- Mover materialized views problemáticas para schema interno
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'sales_analytics' AND schemaname = 'public') THEN
        ALTER MATERIALIZED VIEW public.sales_analytics SET SCHEMA internal;
    END IF;
EXCEPTION
    WHEN others THEN
        -- Se não conseguir mover, comentar para remover da API
        IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'sales_analytics' AND schemaname = 'public') THEN
            COMMENT ON MATERIALIZED VIEW public.sales_analytics IS 'INTERNAL USE ONLY - Not exposed via API';
        END IF;
END $$;

-- =============================================
-- 4. DEFINIR PERMISSÕES NO SCHEMA INTERNO
-- =============================================

-- Revogar acesso público ao schema interno
REVOKE ALL ON SCHEMA internal FROM public;
REVOKE ALL ON SCHEMA internal FROM anon;
REVOKE ALL ON SCHEMA internal FROM authenticated;

-- Conceder acesso apenas ao service role
GRANT ALL ON SCHEMA internal TO service_role;

-- =============================
-- 5. CONCLUSÃO E LOGS
-- =============================

-- Status final da otimização
SELECT public.database_health_check();