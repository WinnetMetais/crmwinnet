-- FASE 1: Criar tabela completa de Orders/Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  
  -- Datas
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  estimated_delivery DATE,
  
  -- Status do pedido
  status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (status IN ('PENDING','CONFIRMED','PRODUCTION','SHIPPED','DELIVERED','CANCELLED')),
  
  -- Valores
  subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount NUMERIC(15,2) DEFAULT 0,
  tax NUMERIC(15,2) DEFAULT 0,
  shipping_cost NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) NOT NULL DEFAULT 0,
  
  -- Informações de entrega
  shipping_address JSONB,
  shipping_method TEXT,
  tracking_number TEXT,
  
  -- Observações
  notes TEXT,
  internal_notes TEXT,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL DEFAULT auth.uid()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_quote_id ON public.orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON public.orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_owner_id ON public.orders(owner_id);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  
  -- Detalhes do item
  description TEXT NOT NULL,
  quantity NUMERIC(10,3) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'UN',
  unit_price NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) NOT NULL DEFAULT 0,
  
  -- Especificações técnicas
  specifications JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies para Orders
CREATE POLICY "Users can view their orders" ON public.orders
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create their orders" ON public.orders
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their orders" ON public.orders
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their orders" ON public.orders
  FOR DELETE USING (owner_id = auth.uid());

-- RLS Policies para Order Items
CREATE POLICY "Users can view order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage order items" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.owner_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar número sequencial de pedidos
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  order_number TEXT;
BEGIN
  -- Buscar o próximo número disponível
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '[0-9]+') AS INTEGER)), 0) + 1
  INTO next_number
  FROM orders 
  WHERE order_number ~ '^WM[0-9]+$';
  
  -- Gerar número do pedido
  order_number := 'WM' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN order_number;
END;
$$;

-- Trigger automático para criar pedido quando orçamento é aprovado (atualizado)
CREATE OR REPLACE FUNCTION public.auto_create_order_from_quote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
BEGIN
  -- Só executa se o status mudou para aprovado/aceito
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status IN ('aprovado', 'aceito', 'approved') THEN
      
      -- Verificar se já existe pedido para este orçamento
      IF NOT EXISTS (SELECT 1 FROM public.orders WHERE quote_id = NEW.id) THEN
        
        -- Gerar número do pedido
        v_order_number := public.generate_order_number();
        
        -- Criar pedido
        INSERT INTO public.orders (
          order_number, customer_id, quote_id,
          order_date, subtotal, total, status,
          notes, owner_id, created_by
        ) VALUES (
          v_order_number,
          NEW.customer_id,
          NEW.id,
          CURRENT_DATE,
          NEW.subtotal,
          NEW.total,
          'CONFIRMED',
          'Pedido gerado automaticamente do orçamento ' || NEW.quote_number,
          COALESCE(NEW.owner_id, auth.uid()),
          auth.uid()
        ) RETURNING id INTO v_order_id;
        
        -- Copiar itens do orçamento para o pedido
        INSERT INTO public.order_items (order_id, product_id, description, quantity, unit, unit_price, total)
        SELECT 
          v_order_id,
          qi.product_id,
          qi.description,
          qi.quantity,
          qi.unit,
          qi.unit_price,
          qi.total
        FROM public.quote_items qi
        WHERE qi.quote_id = NEW.id;
        
        -- Notificação
        INSERT INTO public.notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          auth.uid(),
          'Pedido Criado Automaticamente',
          'Orçamento ' || COALESCE(NEW.quote_number, NEW.id::TEXT) || ' → Pedido ' || v_order_number,
          'success',
          '/orders',
          jsonb_build_object('order_id', v_order_id, 'quote_id', NEW.id, 'auto_generated', true)
        );
        
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger no quotes
DROP TRIGGER IF EXISTS auto_create_order_from_quote_trigger ON public.quotes;
CREATE TRIGGER auto_create_order_from_quote_trigger
  AFTER UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_order_from_quote();

-- Função para automatizar Order → Invoice
CREATE OR REPLACE FUNCTION public.auto_create_invoice_from_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_id UUID;
BEGIN
  -- Criar fatura quando pedido é DELIVERED
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NEW.status = 'DELIVERED' THEN
      
      -- Verificar se já existe fatura para este pedido
      IF NOT EXISTS (SELECT 1 FROM public.invoices WHERE order_id = NEW.id) THEN
        
        -- Criar fatura
        INSERT INTO public.invoices (
          order_id, issue_date, due_date,
          subtotal, discount, tax, total,
          status, user_id
        ) VALUES (
          NEW.id,
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '30 days',
          NEW.subtotal,
          NEW.discount,
          NEW.tax,
          NEW.total,
          'pending',
          auth.uid()
        ) RETURNING id INTO v_invoice_id;
        
        -- Copiar itens do pedido para a fatura
        INSERT INTO public.invoice_items (quote_id, product_id, description, quantity, unit_price, total)
        SELECT 
          v_invoice_id,
          oi.product_id,
          oi.description,
          oi.quantity,
          oi.unit_price,
          oi.total
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id;
        
        -- Notificação
        INSERT INTO public.notifications (
          user_id, title, message, type, action_url, metadata
        ) VALUES (
          auth.uid(),
          'Fatura Criada Automaticamente',
          'Pedido ' || NEW.order_number || ' entregue → Fatura gerada',
          'success',
          '/financial',
          jsonb_build_object('invoice_id', v_invoice_id, 'order_id', NEW.id)
        );
        
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger no orders
CREATE TRIGGER auto_create_invoice_from_order_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_invoice_from_order();