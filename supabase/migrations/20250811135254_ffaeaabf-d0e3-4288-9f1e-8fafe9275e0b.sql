-- Índices de cobertura para FKs reportados pelo linter
-- Usamos CREATE INDEX IF NOT EXISTS para evitar conflitos

-- categorias
CREATE INDEX IF NOT EXISTS idx_categorias_parent_id ON public.categorias(parent_id);

-- commissions
CREATE INDEX IF NOT EXISTS idx_commissions_deal_id ON public.commissions(deal_id);
CREATE INDEX IF NOT EXISTS idx_commissions_quote_id ON public.commissions(quote_id);

-- contas_pagar
CREATE INDEX IF NOT EXISTS idx_contas_pagar_categoria_id ON public.contas_pagar(categoria_id);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_centro_custo_id ON public.contas_pagar(centro_custo_id);

-- contas_receber
CREATE INDEX IF NOT EXISTS idx_contas_receber_conta_id ON public.contas_receber(conta_id);

-- contatos
CREATE INDEX IF NOT EXISTS idx_contatos_cliente_id ON public.contatos(cliente_id);

-- content_calendar
CREATE INDEX IF NOT EXISTS idx_content_calendar_campaign_id ON public.content_calendar(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON public.content_calendar(user_id);

-- content_templates
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON public.content_templates(user_id);

-- customers
CREATE INDEX IF NOT EXISTS idx_customers_customer_type_id ON public.customers(customer_type_id);
CREATE INDEX IF NOT EXISTS idx_customers_lead_source_id ON public.customers(lead_source_id);
CREATE INDEX IF NOT EXISTS idx_customers_priority_id ON public.customers(priority_id);
CREATE INDEX IF NOT EXISTS idx_customers_qualification_status_id ON public.customers(qualification_status_id);
CREATE INDEX IF NOT EXISTS idx_customers_segment_id ON public.customers(segment_id);

-- deals
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_opportunity_id ON public.deals(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage_id ON public.deals(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_priority_id ON public.deals(priority_id);
CREATE INDEX IF NOT EXISTS idx_deals_qualification_status_id ON public.deals(qualification_status_id);

-- invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_quote_id ON public.invoice_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON public.invoice_items(product_id);

-- lancamentos
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria_id ON public.lancamentos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_centro_custo_id ON public.lancamentos(centro_custo_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_conta_fin_id ON public.lancamentos(conta_fin_id);

-- negotiations
CREATE INDEX IF NOT EXISTS idx_negotiations_customer_id ON public.negotiations(customer_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_deal_id ON public.negotiations(deal_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_quote_id ON public.negotiations(quote_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_user_id ON public.negotiations(user_id);

-- oportunidades
CREATE INDEX IF NOT EXISTS idx_oportunidades_cliente_id ON public.oportunidades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_lead_id ON public.oportunidades(lead_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_pipeline_id ON public.oportunidades(pipeline_id);

-- opportunities
CREATE INDEX IF NOT EXISTS idx_opportunities_priority_id ON public.opportunities(priority_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_qualification_status_id ON public.opportunities(qualification_status_id);

-- pedido_itens
CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id ON public.pedido_itens(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_produto_id ON public.pedido_itens(produto_id);

-- pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON public.pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_oportunidade_id ON public.pedidos(oportunidade_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_canal_id ON public.pedidos(canal_id);

-- pipeline_activities
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_customer_id ON public.pipeline_activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_deal_id ON public.pipeline_activities(deal_id);

-- pipeline_history
CREATE INDEX IF NOT EXISTS idx_pipeline_history_deal_id ON public.pipeline_history(deal_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_from_stage_id ON public.pipeline_history(from_stage_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_to_stage_id ON public.pipeline_history(to_stage_id);

-- price_lists
CREATE INDEX IF NOT EXISTS idx_price_lists_product_id ON public.price_lists(product_id);

-- product_categories
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON public.product_categories(parent_id);

-- products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_unit_id ON public.products(unit_id);

-- quote_items
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_user_id ON public.quote_items(user_id);

-- quotes
CREATE INDEX IF NOT EXISTS idx_quotes_deal_id ON public.quotes(deal_id);
CREATE INDEX IF NOT EXISTS idx_quotes_opportunity_id ON public.quotes(opportunity_id);

-- tasks
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON public.tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_quote_id ON public.tasks(quote_id);

-- units
CREATE INDEX IF NOT EXISTS idx_units_base_id ON public.units(base_id);

-- user_permissions
CREATE INDEX IF NOT EXISTS idx_user_permissions_granted_by ON public.user_permissions(granted_by);

-- Nota: Mantemos idx_audit_logs_user_id_fk para cobrir o FK de audit_logs, apesar do alerta "unused" do linter.