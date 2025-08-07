-- Criar políticas RLS para permitir operações na tabela transactions

-- Política para INSERT - usuários podem criar suas próprias transações
CREATE POLICY "Users can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Política para UPDATE - usuários podem atualizar suas próprias transações
CREATE POLICY "Users can update transactions" 
ON public.transactions 
FOR UPDATE 
USING (user_id = auth.uid());

-- Política para DELETE - usuários podem deletar suas próprias transações
CREATE POLICY "Users can delete transactions" 
ON public.transactions 
FOR DELETE 
USING (user_id = auth.uid());