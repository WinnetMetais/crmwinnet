-- Remover e recriar a view sem SECURITY DEFINER
DROP VIEW IF EXISTS public.active_transactions;

-- Recriar como view normal (SECURITY INVOKER é o padrão)
CREATE VIEW public.active_transactions 
WITH (security_invoker = true)
AS
SELECT * FROM public.transactions
WHERE deleted_at IS NULL;