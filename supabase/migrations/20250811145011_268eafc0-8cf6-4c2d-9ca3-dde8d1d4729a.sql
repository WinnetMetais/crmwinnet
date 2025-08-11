-- Enable cron extension (idempotent)
create extension if not exists pg_cron with schema extensions;

-- Store index usage snapshots
create table if not exists public.index_usage_snapshots (
  id uuid primary key default gen_random_uuid(),
  captured_at timestamptz not null default now(),
  schemaname text not null,
  tablename text not null,
  indexname text not null,
  idx_scan bigint not null,
  idx_tup_read bigint not null,
  idx_tup_fetch bigint not null,
  index_size_bytes bigint not null
);

-- View to classify indexes (PK/UNIQUE and potential FK coverage)
create or replace view public.vw_index_roles as
select
  n.nspname as schemaname,
  c.relname as tablename,
  ic.relname as indexname,
  i.indexrelid,
  i.indisprimary,
  i.indisunique,
  exists (
    select 1
    from pg_constraint f
    where f.contype = 'f'
      and f.conrelid = c.oid
      and (i.indkey::int2[] @> f.conkey)
  ) as covers_fk
from pg_index i
join pg_class c on c.oid = i.indrelid
join pg_class ic on ic.oid = i.indexrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public';

-- Function to snapshot current index usage
create or replace function public.snapshot_index_usage()
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.index_usage_snapshots (
    captured_at, schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch, index_size_bytes
  )
  select now(), s.schemaname, s.relname, s.indexrelname, s.idx_scan, s.idx_tup_read, s.idx_tup_fetch,
         pg_relation_size(s.indexrelid)
  from pg_stat_user_indexes s
  where s.schemaname = 'public';
end;
$$;

-- View with 30-day candidates (excludes PK/UNIQUE/FK-covering indexes)
create or replace view public.vw_unused_index_candidates_30d as
with scan as (
  select schemaname, tablename, indexname,
         min(idx_scan) as min_scan,
         max(idx_scan) as max_scan,
         max(index_size_bytes) as max_index_size_bytes,
         min(captured_at) as first_seen,
         max(captured_at) as last_seen
  from public.index_usage_snapshots
  where captured_at >= now() - interval '30 days'
  group by 1,2,3
)
select s.schemaname, s.tablename, s.indexname,
       s.min_scan, s.max_scan,
       (s.max_scan - s.min_scan) as scan_delta,
       round(s.max_index_size_bytes/1024.0/1024.0, 2) as size_mb,
       s.first_seen, s.last_seen
from scan s
left join public.vw_index_roles r
  on r.schemaname = s.schemaname and r.tablename = s.tablename and r.indexname = s.indexname
where coalesce(r.indisprimary,false) = false
  and coalesce(r.indisunique,false) = false
  and coalesce(r.covers_fk,false) = false
  and (s.max_scan - s.min_scan) = 0
  and now() - s.first_seen >= interval '30 days'
order by s.max_index_size_bytes desc nulls last;

-- Function to get dynamic candidates by days
create or replace function public.get_unused_index_candidates(min_days integer default 30)
returns table(
  schemaname text,
  tablename text,
  indexname text,
  scan_delta bigint,
  size_mb numeric,
  first_seen timestamptz,
  last_seen timestamptz
)
language sql
security definer
set search_path to 'public'
as $$
with scan as (
  select schemaname, tablename, indexname,
         min(idx_scan) as min_scan,
         max(idx_scan) as max_scan,
         max(index_size_bytes) as max_index_size_bytes,
         min(captured_at) as first_seen,
         max(captured_at) as last_seen
  from public.index_usage_snapshots
  where captured_at >= now() - (min_days || ' days')::interval
  group by 1,2,3
)
select s.schemaname, s.tablename, s.indexname,
       (s.max_scan - s.min_scan) as scan_delta,
       round(s.max_index_size_bytes/1024.0/1024.0, 2) as size_mb,
       s.first_seen, s.last_seen
from scan s
left join public.vw_index_roles r
  on r.schemaname = s.schemaname and r.tablename = s.tablename and r.indexname = s.indexname
where coalesce(r.indisprimary,false) = false
  and coalesce(r.indisunique,false) = false
  and coalesce(r.covers_fk,false) = false
  and (s.max_scan - s.min_scan) = 0
  and now() - s.first_seen >= (min_days || ' days')::interval
order by s.max_index_size_bytes desc nulls last;
$$;

-- Function to log a weekly report into integration_logs
create or replace function public.log_unused_index_report(min_days integer default 30)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
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
$$;

-- Ensure idempotent scheduling: unschedule if already exists, then schedule
DO $$ 
DECLARE j bigint; BEGIN
  SELECT jobid INTO j FROM cron.job WHERE jobname = 'daily-index-usage-snapshot';
  IF j IS NOT NULL THEN PERFORM cron.unschedule(j); END IF;
  PERFORM cron.schedule('daily-index-usage-snapshot', '30 2 * * *', 'select public.snapshot_index_usage();');
END $$;

DO $$ 
DECLARE j bigint; BEGIN
  SELECT jobid INTO j FROM cron.job WHERE jobname = 'weekly-unused-index-report';
  IF j IS NOT NULL THEN PERFORM cron.unschedule(j); END IF;
  PERFORM cron.schedule('weekly-unused-index-report', '0 3 * * 1', 'select public.log_unused_index_report(30);');
END $$;

-- Take an initial snapshot now to start the baseline
select public.snapshot_index_usage();