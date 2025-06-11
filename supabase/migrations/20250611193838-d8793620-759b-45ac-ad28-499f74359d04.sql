
-- Habilitar Row Level Security na tabela data_validation_logs
ALTER TABLE public.data_validation_logs ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários vejam todos os logs de validação
-- (considerando que são logs do sistema que todos podem visualizar)
CREATE POLICY "Users can view all validation logs" 
  ON public.data_validation_logs 
  FOR SELECT 
  USING (true);

-- Criar política para permitir que apenas o sistema crie logs
-- (apenas usuários autenticados podem inserir logs)
CREATE POLICY "Authenticated users can create validation logs" 
  ON public.data_validation_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Política para atualizar logs (caso necessário)
CREATE POLICY "Authenticated users can update validation logs" 
  ON public.data_validation_logs 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Política para deletar logs (caso necessário)
CREATE POLICY "Authenticated users can delete validation logs" 
  ON public.data_validation_logs 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
