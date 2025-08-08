-- Create Winnet CRM + Finance tables (no conflicts with existing profiles/is_admin)

-- =============== BASE / STUBS ===============
create table if not exists public.canais_venda (
  id uuid primary key default gen_random_uuid(),
  nome text unique not null,
  tipo text check (tipo in ('COMERCIAL','DIGITAL','MARKETPLACE','WHATSAPP','SITE')) default 'COMERCIAL',
  ativo boolean default true,
  created_at timestamptz default now()
);

-- =============== CRM CORE ===============
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  razao_social text,
  nome_fantasia text,
  cnpj_cpf text,
  email text,
  telefone text,
  whatsapp text,
  endereco jsonb,
  origem text,
  criado_por uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete cascade,
  nome text not null,
  cargo text,
  email text,
  telefone text,
  whatsapp text,
  criado_por uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text,
  empresa text,
  email text,
  telefone text,
  whatsapp text,
  origem text,
  etapa text check (etapa in ('NOVO','QUALIFICANDO','PROPOSTA','FOLLOWUP','GANHO','PERDIDO')) default 'NOVO',
  owner_id uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  etapas text[] not null default array['NOVO','QUALIFICANDO','PROPOSTA','FOLLOWUP','GANHO','PERDIDO']::text[],
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.oportunidades (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null,
  titulo text not null,
  valor_previsto numeric(14,2) default 0,
  probabilidade int default 50,
  etapa text,
  pipeline_id uuid references public.pipelines(id),
  fechamento_previsto date,
  ganho boolean,
  lost_reason text,
  owner_id uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.atividades (
  id uuid primary key default gen_random_uuid(),
  ref_type text check (ref_type in ('LEAD','CLIENTE','OPORTUNIDADE')) not null,
  ref_id uuid not null,
  tipo text check (tipo in ('LIGACAO','EMAIL','WHATSAPP','REUNIAO','TAREFA')) not null,
  assunto text,
  descricao text,
  quando timestamptz default now(),
  feito boolean default false,
  feito_em timestamptz,
  owner_id uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  nome text not null,
  descricao text,
  preco numeric(14,2) default 0,
  ativo boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero text,
  cliente_id uuid references public.clientes(id) on delete set null,
  oportunidade_id uuid references public.oportunidades(id) on delete set null,
  canal_id uuid references public.canais_venda(id),
  emissao date,
  total_bruto numeric(14,2) default 0,
  desconto numeric(14,2) default 0,
  frete numeric(14,2) default 0,
  total_liquido numeric(14,2) default 0,
  status text check (status in ('ABERTO','FATURADO','CANCELADO')) default 'ABERTO',
  created_at timestamptz default now()
);

create table if not exists public.pedido_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references public.pedidos(id) on delete cascade,
  produto_id uuid references public.produtos(id),
  qtde numeric(14,3) default 1,
  preco_unit numeric(14,2) default 0,
  total_item numeric(14,2) generated always as (qtde * preco_unit) stored
);

-- =============== FINANCEIRO ===============
create table if not exists public.centros_custo (
  id uuid primary key default gen_random_uuid(),
  nome text unique not null,
  ativo boolean default true,
  created_by uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text check (tipo in ('RECEITA','DESPESA')) not null,
  parent_id uuid references public.categorias(id),
  created_by uuid default auth.uid(),
  created_at timestamptz default now(),
  unique (nome, tipo)
);

create table if not exists public.contas_financeiras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  moeda text default 'BRL',
  saldo_inicial numeric(14,2) default 0,
  created_by uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.lancamentos (
  id uuid primary key default gen_random_uuid(),
  data_lanc date not null,
  descricao text,
  entrada numeric(14,2) default 0,
  saida numeric(14,2) default 0,
  valor numeric(14,2) generated always as (entrada - saida) stored,
  forma_pagamento text,
  status text,
  conta_fin_id uuid references public.contas_financeiras(id),
  categoria_id uuid references public.categorias(id),
  centro_custo_id uuid references public.centros_custo(id),
  origem text,
  referencia_id uuid,
  created_by uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.saldos_mensais (
  id uuid primary key default gen_random_uuid(),
  conta_fin_id uuid references public.contas_financeiras(id) not null,
  mes date not null,
  saldo_inicio numeric(14,2) default 0,
  entradas numeric(14,2) default 0,
  saidas numeric(14,2) default 0,
  saldo_final numeric(14,2) default 0,
  created_by uuid default auth.uid(),
  created_at timestamptz default now(),
  unique (conta_fin_id, mes)
);

create table if not exists public.contas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz default now()
);

create table if not exists public.contas_receber (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid references public.contas(id),
  canal text,
  pedido text,
  emissao date,
  vencimento date,
  valor numeric(14,2) not null,
  recebido_em date,
  valor_recebido numeric(14,2),
  meio_pagamento text,
  status text check (status in ('ABERTA','PAGA','ATRASADA','CANCELADA')) default 'ABERTA',
  created_by uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.contas_pagar (
  id uuid primary key default gen_random_uuid(),
  fornecedor text not null,
  fatura_ref text,
  emissao date,
  vencimento date not null,
  valor numeric(14,2) not null,
  pago_em date,
  valor_pago numeric(14,2),
  meio_pagamento text,
  categoria_id uuid references public.categorias(id),
  centro_custo_id uuid references public.centros_custo(id),
  status text check (status in ('ABERTA','PAGA','ATRASADA','CANCELADA')) default 'ABERTA',
  created_by uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.metas_vendas (
  id uuid primary key default gen_random_uuid(),
  canal text not null,
  mes date not null,
  meta_minima numeric(14,2),
  meta numeric(14,2),
  faturado numeric(14,2),
  vendas int,
  ticket_medio numeric(14,2),
  investido numeric(14,2),
  diferenca numeric(14,2),
  created_by uuid default auth.uid(),
  created_at timestamptz default now(),
  unique (canal, mes)
);

-- =============== ÍNDICES ===============
create index if not exists idx_leads_owner on public.leads (owner_id);
create index if not exists idx_oport_pipeline on public.oportunidades (pipeline_id, etapa);
create index if not exists idx_atividades_ref on public.atividades (ref_type, ref_id);
create index if not exists idx_pedidos_status on public.pedidos (status, emissao);

create index if not exists idx_lanc_data on public.lancamentos (data_lanc);
create index if not exists idx_lanc_origem on public.lancamentos (origem);
create index if not exists idx_lanc_categoria on public.lancamentos (categoria_id);
create index if not exists idx_cr_vencimento on public.contas_receber (vencimento, status);
create index if not exists idx_cp_vencimento on public.contas_pagar (vencimento, status);
create index if not exists idx_saldos_mes on public.saldos_mensais (mes);

-- =============== RLS & POLICIES ===============
-- Enable RLS and create read policies
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'canais_venda','clientes','contatos','leads','pipelines','oportunidades','atividades','produtos','pedidos','pedido_itens',
    'centros_custo','categorias','contas_financeiras','lancamentos','saldos_mensais','contas','contas_receber','contas_pagar','metas_vendas'
  ]
  LOOP
    EXECUTE format('alter table public.%I enable row level security;', t);
    EXECUTE format('drop policy if exists %I on public.%I;', 'read_all_'||t, t);
    EXECUTE format('create policy %I on public.%I for select using ((select auth.uid()) is not null);', 'read_all_'||t, t);
  END LOOP;
END$$;

-- Write policies
DROP POLICY IF EXISTS write_canais ON public.canais_venda;
CREATE POLICY write_canais ON public.canais_venda FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS write_pipelines ON public.pipelines;
CREATE POLICY write_pipelines ON public.pipelines FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS write_produtos ON public.produtos;
CREATE POLICY write_produtos ON public.produtos FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS write_clientes ON public.clientes;
CREATE POLICY write_clientes ON public.clientes FOR ALL USING ((criado_por = (select auth.uid())) or public.is_admin()) WITH CHECK ((criado_por = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_contatos ON public.contatos;
CREATE POLICY write_contatos ON public.contatos FOR ALL USING ((criado_por = (select auth.uid())) or public.is_admin()) WITH CHECK ((criado_por = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_leads ON public.leads;
CREATE POLICY write_leads ON public.leads FOR ALL USING ((owner_id = (select auth.uid())) or public.is_admin()) WITH CHECK ((owner_id = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_oportunidades ON public.oportunidades;
CREATE POLICY write_oportunidades ON public.oportunidades FOR ALL USING ((owner_id = (select auth.uid())) or public.is_admin()) WITH CHECK ((owner_id = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_atividades ON public.atividades;
CREATE POLICY write_atividades ON public.atividades FOR ALL USING ((owner_id = (select auth.uid())) or public.is_admin()) WITH CHECK ((owner_id = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_pedidos ON public.pedidos;
CREATE POLICY write_pedidos ON public.pedidos FOR ALL USING ((select auth.uid()) is not null or public.is_admin()) WITH CHECK ((select auth.uid()) is not null or public.is_admin());

DROP POLICY IF EXISTS write_pedido_itens ON public.pedido_itens;
CREATE POLICY write_pedido_itens ON public.pedido_itens FOR ALL USING ((select auth.uid()) is not null or public.is_admin()) WITH CHECK ((select auth.uid()) is not null or public.is_admin());

DROP POLICY IF EXISTS write_centros ON public.centros_custo;
CREATE POLICY write_centros ON public.centros_custo FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_categorias ON public.categorias;
CREATE POLICY write_categorias ON public.categorias FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_contas_fin ON public.contas_financeiras;
CREATE POLICY write_contas_fin ON public.contas_financeiras FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_lanc ON public.lancamentos;
CREATE POLICY write_lanc ON public.lancamentos FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_saldos ON public.saldos_mensais;
CREATE POLICY write_saldos ON public.saldos_mensais FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_contas ON public.contas;
CREATE POLICY write_contas ON public.contas FOR ALL USING ((select auth.uid()) is not null or public.is_admin()) WITH CHECK ((select auth.uid()) is not null or public.is_admin());

DROP POLICY IF EXISTS write_cr ON public.contas_receber;
CREATE POLICY write_cr ON public.contas_receber FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_cp ON public.contas_pagar;
CREATE POLICY write_cp ON public.contas_pagar FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());

DROP POLICY IF EXISTS write_metas ON public.metas_vendas;
CREATE POLICY write_metas ON public.metas_vendas FOR ALL USING ((created_by = (select auth.uid())) or public.is_admin()) WITH CHECK ((created_by = (select auth.uid())) or public.is_admin());