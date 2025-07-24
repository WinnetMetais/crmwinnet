-- Create whatsapp_messages table
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_name TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sent', 'received')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('delivered', 'read', 'pending')),
  customer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own whatsapp messages" 
ON public.whatsapp_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own whatsapp messages" 
ON public.whatsapp_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own whatsapp messages" 
ON public.whatsapp_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own whatsapp messages" 
ON public.whatsapp_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_whatsapp_messages_updated_at
BEFORE UPDATE ON public.whatsapp_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();