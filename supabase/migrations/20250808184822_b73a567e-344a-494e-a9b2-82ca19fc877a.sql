-- 1) Garantir tabela pipeline_stages com colunas necessárias
create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stage_key text,
  order_position integer not null default 0,
  probability numeric default 0,
  is_won boolean default false,
  is_lost boolean default false,
  color text,
  active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1.1) Adicionar colunas caso a tabela já existisse antes
alter table public.pipeline_stages add column if not exists stage_key text;
alter table public.pipeline_stages add column if not exists order_position integer default 0;
update public.pipeline_stages set order_position = 0 where order_position is null;
alter table public.pipeline_stages alter column order_position set not null;

alter table public.pipeline_stages add column if not exists probability numeric default 0;
alter table public.pipeline_stages add column if not exists is_won boolean default false;
alter table public.pipeline_stages add column if not exists is_lost boolean default false;
alter table public.pipeline_stages add column if not exists color text;
alter table public.pipeline_stages add column if not exists active boolean default true;
alter table public.pipeline_stages add column if not exists created_at timestamptz not null default now();
alter table public.pipeline_stages add column if not exists updated_at timestamptz not null default now();

-- 1.2) Índices/uniqueness
create unique index if not exists idx_pipeline_stages_stage_key on public.pipeline_stages(stage_key);
create index if not exists idx_pipeline_stages_order_position on public.pipeline_stages(order_position);
create index if not exists idx_pipeline_stages_active on public.pipeline_stages(active);

-- 2) Trigger de updated_at usando função já existente
-- Remover e recriar para garantir
drop trigger if exists update_pipeline_stages_updated_at on public.pipeline_stages;
create trigger update_pipeline_stages_updated_at
before update on public.pipeline_stages
for each row execute function public.update_updated_at_column();

-- 3) Função de validação para pipeline_stages
create or replace function public.validate_pipeline_stage()
returns trigger as $$
begin
  -- probability 0..100
  if new.probability is null or new.probability < 0 or new.probability > 100 then
    raise exception 'probability must be between 0 and 100';
  end if;

  -- is_won e is_lost não podem ser ambos verdadeiros
  if coalesce(new.is_won, false) and coalesce(new.is_lost, false) then
    raise exception 'is_won and is_lost cannot both be true';
  end if;

  -- se is_won, probability = 100; se is_lost, probability = 0
  if coalesce(new.is_won, false) then
    new.probability := 100;
  elsif coalesce(new.is_lost, false) then
    new.probability := 0;
  end if;

  -- stage_key normalizado em minúsculas/slug simplificado
  if new.stage_key is not null then
    new.stage_key := lower(regexp_replace(new.stage_key, '[^a-z0-9_]+', '_', 'g'));
  end if;

  return new;
end;
$$ language plpgsql;

-- 3.1) Trigger da validação
drop trigger if exists trg_validate_pipeline_stage on public.pipeline_stages;
create trigger trg_validate_pipeline_stage
before insert or update on public.pipeline_stages
for each row execute function public.validate_pipeline_stage();

-- 4) Seed/Upsert dos estágios padrão
insert into public.pipeline_stages (name, stage_key, order_position, probability, is_won, is_lost, color, active)
values
  ('Novo',         'new',          10,  5,  false, false, '#8E9AAF', true),
  ('Qualificação', 'qualifying',   20, 20,  false, false, '#CBC0D3', true),
  ('Proposta',     'proposal',     30, 40,  false, false, '#EFD3D7', true),
  ('Negociação',   'negotiation',  40, 60,  false, false, '#FEEAFA', true),
  ('Ganhou',       'won',          90, 100, true,  false, '#CDEAC0', true),
  ('Perdido',      'lost',         100, 0,  false, true,  '#FFD6BA', true)
on conflict (stage_key) do update set
  name = excluded.name,
  order_position = excluded.order_position,
  probability = excluded.probability,
  is_won = excluded.is_won,
  is_lost = excluded.is_lost,
  color = excluded.color,
  active = excluded.active;

-- 5) Relacionar deals.pipeline_stage_id à pipeline_stages
-- Índice em deals
create index if not exists idx_deals_pipeline_stage_id on public.deals(pipeline_stage_id);

-- Constraint FK (só cria se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'deals' AND constraint_name = 'deals_pipeline_stage_id_fkey'
  ) THEN
    ALTER TABLE public.deals
    ADD CONSTRAINT deals_pipeline_stage_id_fkey
    FOREIGN KEY (pipeline_stage_id)
    REFERENCES public.pipeline_stages(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;
  END IF;
END$$;

-- 6) Tentar mapear deals.status para pipeline_stages.pipeline_stage_id quando nulo
with stage_map as (
  select stage_key, id from public.pipeline_stages
), updated as (
  update public.deals d
  set pipeline_stage_id = sm.id
  from stage_map sm
  where d.pipeline_stage_id is null
    and (
      case lower(coalesce(d.status,''))
        when 'lead' then 'new'
        when 'novo' then 'new'
        when 'qualifying' then 'qualifying'
        when 'qualificacao' then 'qualifying'
        when 'proposal' then 'proposal'
        when 'proposta' then 'proposal'
        when 'negotiation' then 'negotiation'
        when 'negociacao' then 'negotiation'
        when 'won' then 'won'
        when 'ganhou' then 'won'
        when 'lost' then 'lost'
        when 'perdido' then 'lost'
        else null
      end
    ) = sm.stage_key
  returning 1
)
select count(*) from updated;

-- 7) Normalizar opportunities.stage para chaves canônicas, se tabela existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='opportunities'
  ) THEN
    -- índice útil
    CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);

    -- normalização básica
    UPDATE public.opportunities o
    SET stage = CASE lower(coalesce(o.stage,''))
      WHEN 'lead' THEN 'new'
      WHEN 'novo' THEN 'new'
      WHEN 'qualifying' THEN 'qualifying'
      WHEN 'qualificacao' THEN 'qualifying'
      WHEN 'proposal' THEN 'proposal'
      WHEN 'proposta' THEN 'proposal'
      WHEN 'negotiation' THEN 'negotiation'
      WHEN 'negociacao' THEN 'negotiation'
      WHEN 'won' THEN 'won'
      WHEN 'ganhou' THEN 'won'
      WHEN 'lost' THEN 'lost'
      WHEN 'perdido' THEN 'lost'
      ELSE o.stage
    END
    WHERE o.stage IS NOT NULL;
  END IF;
END $$;

-- 8) Realtime: REPLICA IDENTITY FULL e publicação
ALTER TABLE public.pipeline_stages REPLICA IDENTITY FULL;
ALTER TABLE public.deals REPLICA IDENTITY FULL;
DO $$
BEGIN
  -- Adicionar pipeline_stages à publicação realtime se ainda não estiver
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'pipeline_stages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pipeline_stages;
  END IF;

  -- Adicionar deals à publicação realtime se ainda não estiver
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'deals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;
  END IF;

  -- Se existir opportunities, adicionar também
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='opportunities'
  ) THEN
    ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'opportunities'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities;
    END IF;
  END IF;
END $$;