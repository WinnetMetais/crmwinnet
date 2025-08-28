-- Fix remaining RLS policy performance issues

-- Fix auth function calls for pedido_itens
DROP POLICY IF EXISTS "write_pedido_itens" ON public.pedido_itens;
CREATE POLICY "write_pedido_itens" ON public.pedido_itens
FOR ALL USING (((SELECT auth.role()) = 'authenticated'::text) OR is_admin())
WITH CHECK (((SELECT auth.role()) = 'authenticated'::text) OR is_admin());

-- Fix duplicate policies for lancamentos
DROP POLICY IF EXISTS "lancamentos_delete" ON public.lancamentos;
DROP POLICY IF EXISTS "lancamentos_insert" ON public.lancamentos; 
DROP POLICY IF EXISTS "lancamentos_update" ON public.lancamentos;
DROP POLICY IF EXISTS "read_all_lancamentos" ON public.lancamentos;
-- Keep only the consolidated write_lancamentos policy and create optimized read policy
CREATE POLICY "read_all_lancamentos" ON public.lancamentos
FOR SELECT USING ((SELECT auth.role()) = 'authenticated'::text);