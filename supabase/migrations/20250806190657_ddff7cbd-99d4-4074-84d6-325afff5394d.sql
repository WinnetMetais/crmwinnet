-- Melhorar tabela whatsapp_messages para integração com CRM
ALTER TABLE public.whatsapp_messages 
ADD COLUMN IF NOT EXISTS whatsapp_message_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'received' CHECK (direction IN ('sent', 'received')),
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Renomear coluna type para message_type para evitar conflito
ALTER TABLE public.whatsapp_messages 
RENAME COLUMN type TO message_type;

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone ON public.whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_customer ON public.whatsapp_messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_received_at ON public.whatsapp_messages(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_whatsapp_id ON public.whatsapp_messages(whatsapp_message_id);

-- Atualizar RLS policies para incluir novos campos
DROP POLICY IF EXISTS "Users can manage whatsapp messages" ON public.whatsapp_messages;

CREATE POLICY "Authenticated users can view whatsapp messages" ON public.whatsapp_messages
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert whatsapp messages" ON public.whatsapp_messages
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their whatsapp messages" ON public.whatsapp_messages
FOR UPDATE USING (user_id = auth.uid() OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their whatsapp messages" ON public.whatsapp_messages
FOR DELETE USING (user_id = auth.uid());