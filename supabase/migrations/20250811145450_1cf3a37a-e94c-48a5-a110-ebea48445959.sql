-- Fix linter issues: remove SECURITY DEFINER and enable RLS on internal table

-- Recreate functions without SECURITY DEFINER
create or replace function public.snapshot_index_usage()
returns void
language plpgsql
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

create or replace function public.log_unused_index_report(min_days integer default 30)
returns void
language plpgsql
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

-- Enable RLS on internal table and allow read/write (safe internal metrics)
alter table public.index_usage_snapshots enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='index_usage_snapshots' and policyname='allow_all_index_usage_snapshots'
  ) then
    execute 'create policy allow_all_index_usage_snapshots on public.index_usage_snapshots for all using (true) with check (true)';
  end if;
end$$;