
-- Adicionar coluna metadata à tabela notifications
ALTER TABLE public.notifications 
ADD COLUMN metadata JSONB;

-- Criar índice para melhor performance nas consultas de metadata
CREATE INDEX IF NOT EXISTS notifications_metadata_idx ON public.notifications USING GIN (metadata);
