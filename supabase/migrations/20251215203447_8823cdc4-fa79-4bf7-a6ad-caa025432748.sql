-- Criar índices de performance nas colunas mais utilizadas em filtros e joins

-- Índices para customers
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at);

-- Índices para deals
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at);

-- Índices para opportunities
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON public.opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at);

-- Índices para quotes
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON public.quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at);

-- Índices para transactions
CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON public.transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

-- Índices para tasks
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);

-- Índices para commissions
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);

-- Índices para pipeline_activities
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_deal_id ON public.pipeline_activities(deal_id);

-- Índices para sales_goals
CREATE INDEX IF NOT EXISTS idx_sales_goals_salesperson ON public.sales_goals(salesperson);

-- Índices para customer_interactions
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer_id ON public.customer_interactions(customer_id);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Índices para whatsapp_messages
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_customer_id ON public.whatsapp_messages(customer_id);

-- Índices para opportunity_items
CREATE INDEX IF NOT EXISTS idx_opportunity_items_opportunity_id ON public.opportunity_items(opportunity_id);

-- Índices para user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Índices para financial_permissions
CREATE INDEX IF NOT EXISTS idx_financial_permissions_user_id ON public.financial_permissions(user_id);

-- Índices para campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- Índices para analytics_data
CREATE INDEX IF NOT EXISTS idx_analytics_data_category ON public.analytics_data(category);

-- Índices para customers_quotes
CREATE INDEX IF NOT EXISTS idx_customers_quotes_created_by ON public.customers_quotes(created_by);