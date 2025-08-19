-- Fix all remaining functions with search path issues

-- Fix get_advanced_statistics
CREATE OR REPLACE FUNCTION public.get_advanced_statistics(start_date date DEFAULT (CURRENT_DATE - '30 days'::interval), end_date date DEFAULT CURRENT_DATE)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'customers', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM customers),
      'new_this_period', (SELECT COUNT(*) FROM customers WHERE created_at::date BETWEEN start_date AND end_date),
      'by_status', (SELECT jsonb_object_agg(status, count) FROM (
        SELECT status, COUNT(*) as count FROM customers GROUP BY status
      ) t)
    ),
    'deals', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM deals),
      'total_value', (SELECT COALESCE(SUM(value), 0) FROM deals),
      'won_this_period', (SELECT COUNT(*) FROM deals WHERE status = 'won' AND close_date BETWEEN start_date AND end_date),
      'by_stage', (SELECT jsonb_object_agg(s.name, COALESCE(d.count, 0)) FROM 
        pipeline_stages s LEFT JOIN (
          SELECT pipeline_stage_id, COUNT(*) as count FROM deals GROUP BY pipeline_stage_id
        ) d ON s.id = d.pipeline_stage_id)
    )
  ) INTO result;
  
  RETURN result;
END;
$function$;

-- Fix log_unused_index_report
CREATE OR REPLACE FUNCTION public.log_unused_index_report(min_days integer DEFAULT 30)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'generated_at', now(),
    'min_days', min_days,
    'candidates', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'schema', schemaname,
        'table', tablename,
        'index', indexname,
        'scan_delta', scan_delta,
        'size_mb', size_mb,
        'first_seen', first_seen,
        'last_seen', last_seen
      )), '[]'::jsonb)
      from public.get_unused_index_candidates(min_days)
    )
  );

  insert into public.integration_logs (integration_type, action, status, data)
  values ('db_maintenance', 'unused_index_report', 'ok', payload);
end;
$function$;

-- Fix snapshot_index_usage  
CREATE OR REPLACE FUNCTION public.snapshot_index_usage()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
begin
  insert into public.index_usage_snapshots (
    captured_at, schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch, index_size_bytes
  )
  select now(), s.schemaname, s.relname, s.indexrelname, s.idx_scan, s.idx_tup_read, s.idx_tup_fetch,
         pg_relation_size(s.indexrelid)
  from pg_stat_user_indexes s
  where s.schemaname = 'public';
end;
$function$;