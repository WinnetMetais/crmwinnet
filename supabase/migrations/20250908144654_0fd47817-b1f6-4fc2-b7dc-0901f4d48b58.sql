-- ETAPA 1: CORREÇÃO IMEDIATA - AUTONOMIA FINANCEIRA
-- Limpar políticas RLS conflitantes na tabela transactions

-- Remove políticas conflitantes
DROP POLICY IF EXISTS "Users can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete transactions" ON public.transactions;
DROP POLICY IF EXISTS "p_transactions_select" ON public.transactions;
DROP POLICY IF EXISTS "p_transactions_update" ON public.transactions;
DROP POLICY IF EXISTS "p_transactions_delete" ON public.transactions;
DROP POLICY IF EXISTS "authenticated can insert their own transactions" ON public.transactions;

-- Adicionar campos para soft delete e auditoria na tabela transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS last_modified_by UUID REFERENCES auth.users(id);

-- Criar tabela de permissões financeiras
CREATE TABLE IF NOT EXISTS public.financial_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_type TEXT NOT NULL CHECK (permission_type IN ('admin', 'finance', 'read_only', 'sales')),
    module TEXT NOT NULL CHECK (module IN ('transactions', 'reports', 'config', 'all')),
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, permission_type, module)
);

-- Ativar RLS na tabela de permissões
ALTER TABLE public.financial_permissions ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar permissões financeiras
CREATE OR REPLACE FUNCTION public.has_financial_permission(
    _permission_type TEXT,
    _module TEXT DEFAULT 'all'
) RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.financial_permissions
        WHERE user_id = auth.uid()
        AND permission_type = _permission_type
        AND (module = _module OR module = 'all')
        AND active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    ) OR EXISTS (
        SELECT 1 FROM public.financial_permissions
        WHERE user_id = auth.uid()
        AND permission_type = 'admin'
        AND active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    );
$$;

-- Políticas RLS limpas e organizadas para transactions
CREATE POLICY "financial_select_policy" ON public.transactions
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.has_financial_permission('admin') OR 
        public.has_financial_permission('finance') OR
        public.has_financial_permission('read_only')
    );

CREATE POLICY "financial_insert_policy" ON public.transactions
    FOR INSERT TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND (
            public.has_financial_permission('admin') OR 
            public.has_financial_permission('finance')
        )
    );

CREATE POLICY "financial_update_policy" ON public.transactions
    FOR UPDATE TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.has_financial_permission('admin') OR 
        public.has_financial_permission('finance')
    )
    WITH CHECK (
        user_id = auth.uid() OR 
        public.has_financial_permission('admin') OR 
        public.has_financial_permission('finance')
    );

CREATE POLICY "financial_delete_policy" ON public.transactions
    FOR DELETE TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.has_financial_permission('admin') OR 
        public.has_financial_permission('finance')
    );

-- Políticas RLS para permissões financeiras
CREATE POLICY "financial_permissions_select" ON public.financial_permissions
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR 
        public.has_financial_permission('admin')
    );

CREATE POLICY "financial_permissions_manage" ON public.financial_permissions
    FOR ALL TO authenticated
    USING (public.has_financial_permission('admin'))
    WITH CHECK (public.has_financial_permission('admin'));

-- Trigger para soft delete automático (marca como deletado em vez de excluir)
CREATE OR REPLACE FUNCTION public.soft_delete_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Em vez de deletar, marca como deletado
    UPDATE public.transactions 
    SET 
        deleted_at = NOW(),
        deleted_by = auth.uid(),
        last_modified_by = auth.uid()
    WHERE id = OLD.id;
    
    RETURN NULL; -- Impede a exclusão física
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger de soft delete
DROP TRIGGER IF EXISTS soft_delete_transaction_trigger ON public.transactions;
CREATE TRIGGER soft_delete_transaction_trigger
    BEFORE DELETE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.soft_delete_transaction();

-- Trigger para auditoria de modificações
CREATE OR REPLACE FUNCTION public.audit_transaction_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        NEW.last_modified_by = auth.uid();
        NEW.updated_at = NOW();
    END IF;
    
    -- Log da auditoria
    INSERT INTO public.audit_logs (
        user_id, table_name, record_id, action, 
        old_data, new_data, ip_address
    ) VALUES (
        auth.uid(), 
        'transactions', 
        COALESCE(NEW.id, OLD.id), 
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        inet_client_addr()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger de auditoria
DROP TRIGGER IF EXISTS audit_transaction_changes_trigger ON public.transactions;
CREATE TRIGGER audit_transaction_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_transaction_changes();

-- Conceder permissão de admin financeiro ao usuário atual (bootstrap)
INSERT INTO public.financial_permissions (user_id, permission_type, module, granted_by)
VALUES (auth.uid(), 'admin', 'all', auth.uid())
ON CONFLICT (user_id, permission_type, module) DO UPDATE SET
    active = TRUE,
    granted_at = NOW();

-- View para transações ativas (não deletadas)
CREATE OR REPLACE VIEW public.active_transactions AS
SELECT * FROM public.transactions 
WHERE deleted_at IS NULL;

-- Função para restaurar transação deletada
CREATE OR REPLACE FUNCTION public.restore_transaction(transaction_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verifica permissão
    IF NOT public.has_financial_permission('admin') THEN
        RAISE EXCEPTION 'Acesso negado: permissão admin necessária';
    END IF;
    
    UPDATE public.transactions 
    SET 
        deleted_at = NULL,
        deleted_by = NULL,
        last_modified_by = auth.uid(),
        updated_at = NOW()
    WHERE id = transaction_id;
    
    RETURN FOUND;
END;
$$;

-- Função para exclusão definitiva (apenas admins)
CREATE OR REPLACE FUNCTION public.hard_delete_transaction(transaction_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verifica permissão
    IF NOT public.has_financial_permission('admin') THEN
        RAISE EXCEPTION 'Acesso negado: permissão admin necessária';
    END IF;
    
    -- Remove trigger temporariamente para permitir exclusão física
    DELETE FROM public.transactions WHERE id = transaction_id;
    
    RETURN FOUND;
END;
$$;