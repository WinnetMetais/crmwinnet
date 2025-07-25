-- Clear test/demo data while preserving structural data
-- Phase 1: Clean test data for production use

-- Clear transactional data
DELETE FROM public.transactions WHERE user_id IS NOT NULL;
DELETE FROM public.deals WHERE id IS NOT NULL;
DELETE FROM public.opportunities WHERE id IS NOT NULL;
DELETE FROM public.quotes WHERE id IS NOT NULL;
DELETE FROM public.quote_items WHERE id IS NOT NULL;
DELETE FROM public.opportunity_items WHERE id IS NOT NULL;
DELETE FROM public.customer_interactions WHERE id IS NOT NULL;
DELETE FROM public.pipeline_activities WHERE id IS NOT NULL;
DELETE FROM public.tasks WHERE id IS NOT NULL;
DELETE FROM public.commissions WHERE id IS NOT NULL;
DELETE FROM public.whatsapp_messages WHERE id IS NOT NULL;
DELETE FROM public.content_calendar WHERE id IS NOT NULL;
DELETE FROM public.marketing_campaigns WHERE id IS NOT NULL;
DELETE FROM public.campaigns WHERE id IS NOT NULL;
DELETE FROM public.notifications WHERE id IS NOT NULL;

-- Clear demo customers and products
DELETE FROM public.customers WHERE id IS NOT NULL;
DELETE FROM public.products WHERE id IS NOT NULL;

-- Clear integration and validation logs (keep audit logs for traceability)
DELETE FROM public.integration_logs WHERE id IS NOT NULL;
DELETE FROM public.data_validation_logs WHERE id IS NOT NULL;

-- Reset sequences and auto-increment values if any
-- (PostgreSQL uses sequences, but our schema uses UUIDs so no need to reset)

-- Insert initial system configurations for production
INSERT INTO public.system_config (config_key, config_value, is_public, description) VALUES
('production_mode', 'true', false, 'System is in production mode'),
('data_cleanup_date', to_jsonb(now()), false, 'Date when test data was cleaned'),
('setup_required', 'true', true, 'Indicates if initial setup is required')
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  updated_at = now();

-- Update system settings for production
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('backup_enabled', 'true', 'Enable automatic backups'),
('notification_enabled', 'true', 'Enable system notifications'),
('data_validation_enabled', 'true', 'Enable automatic data validation')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();