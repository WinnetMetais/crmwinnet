-- Consolidar políticas RLS duplicadas e ajustes de índices

-- 1) payment_methods: manter apenas uma SELECT
DROP POLICY IF EXISTS "Users can view payment methods" ON public.payment_methods;
-- (Mantemos "Anyone can view payment_methods")

-- 2) pipelines: evitar duplicidade de SELECT
DROP POLICY IF EXISTS read_all_pipelines ON public.pipelines;
-- (Mantemos write_pipelines que já cobre SELECT)

-- 3) product_categories: manter apenas a política de gerenciamento (provê ALL)
DROP POLICY IF EXISTS product_categories_delete ON public.product_categories;
DROP POLICY IF EXISTS product_categories_insert ON public.product_categories;
DROP POLICY IF EXISTS product_categories_select ON public.product_categories;
DROP POLICY IF EXISTS product_categories_update ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can view product categories" ON public.product_categories;
-- (Mantemos product_categories_manage)

-- 4) produtos: evitar duplicidade
DROP POLICY IF EXISTS read_all_produtos ON public.produtos;
-- (Mantemos write_produtos)

-- 5) profiles: evitar duplicidade
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
-- (Mantemos "Users can view all profiles")

-- 6) quote_items: evitar duplicidade de SELECT
DROP POLICY IF EXISTS "Users can view quote_items" ON public.quote_items;
-- (Mantemos "Users can view quote items")

-- 7) saldos_mensais: evitar duplicidade de SELECT
DROP POLICY IF EXISTS read_all_saldos_mensais ON public.saldos_mensais;
-- (Mantemos write_saldos)

-- 8) suppliers: evitar duplicidade de SELECT
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;
-- (Mantemos suppliers_select)

-- 9) transactions: evitar duplicidade de SELECT
DROP POLICY IF EXISTS "Users can view transactions" ON public.transactions;
-- (Mantemos transactions_select)

-- 10) units: evitar duplicidade (manter manage/ALL)
DROP POLICY IF EXISTS units_select ON public.units;
-- (Mantemos units_manage)

-- 11) Índice duplicado em notifications: manter apenas um
DROP INDEX IF EXISTS public.idx_notifications_user_id_fk;
-- (Mantemos public.idx_notifications_user_id)

-- 12) FK sem índice: audit_logs.user_id
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_fk ON public.audit_logs(user_id);
