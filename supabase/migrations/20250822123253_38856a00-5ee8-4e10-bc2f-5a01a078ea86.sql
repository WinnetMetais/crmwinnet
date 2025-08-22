-- Check which function still needs search_path fix
SELECT 
    routine_name,
    routine_type,
    external_language,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_type = 'FUNCTION'
    AND routine_name NOT IN (
        'add_user_role', 
        'remove_user_role', 
        'send_notification',
        'calculate_product_margins',
        'is_admin',
        'get_advanced_statistics',
        'log_unused_index_report',
        'snapshot_index_usage',
        'get_unused_index_candidates',
        'update_modified_column',
        'calculate_customer_data_quality',
        'update_customer_quality_score',
        'update_updated_at_column',
        'validate_transaction_data',
        'validate_deal_data',
        'sync_quote_to_finance',
        'handle_new_user',
        'audit_trigger',
        'log_sensitive_operation',
        'check_failed_auth_attempts',
        'sync_pedido_to_finance',
        'validate_opportunity_data',
        'validate_pipeline_stage'
    )
ORDER BY routine_name;