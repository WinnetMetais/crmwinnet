-- 1) Views como security_invoker (corrige linter security_definer_view)
ALTER VIEW public.vw_index_roles SET (security_invoker = true);
ALTER VIEW public.vw_unused_index_candidates_30d SET (security_invoker = true);

-- 2) Consolidar policies de units para evitar múltiplas permissivas em SELECT
DO $$
DECLARE
  has_sel boolean;
  has_manage boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='units' AND policyname='Authenticated users can view units'
  ) INTO has_sel;

  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='units' AND policyname='units_manage'
  ) INTO has_manage;

  IF has_manage THEN
    -- Remover policy ampla e recriar apenas para escrita, evitando SELECT duplicado
    EXECUTE 'DROP POLICY IF EXISTS "units_manage" ON public.units';

    -- Criar policies explícitas para escrita (mantém comportamento permissivo existente)
    EXECUTE 'CREATE POLICY "units_manage_insert" ON public.units FOR INSERT TO authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "units_manage_update" ON public.units FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "units_manage_delete" ON public.units FOR DELETE TO authenticated USING (true)';
  END IF;

  IF NOT has_sel THEN
    -- Garantir uma única policy de SELECT
    EXECUTE 'CREATE POLICY "Authenticated users can view units" ON public.units FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;