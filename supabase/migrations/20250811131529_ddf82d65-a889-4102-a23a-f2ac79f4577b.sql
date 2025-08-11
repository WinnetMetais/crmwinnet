-- Fix RLS policies: split ALL policies into INSERT/UPDATE/DELETE using expressions from pg_policies.qual/with_check
DO $$
DECLARE
  rec RECORD;
  v_qual text;
  v_check text;
  v_ins_pol text;
  v_upd_pol text;
  v_del_pol text;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      ('atividades','write_atividades'),
      ('canais_venda','write_canais'),
      ('categorias','write_categorias'),
      ('centros_custo','write_centros'),
      ('clientes','write_clientes'),
      ('contas','write_contas'),
      ('contas_financeiras','write_contas_fin'),
      ('contas_pagar','write_cp'),
      ('contas_receber','write_cr'),
      ('contatos','write_contatos'),
      ('customer_types','customer_types_manage'),
      ('lancamentos','write_lanc'),
      ('leads','write_leads'),
      ('oportunidades','write_oportunidades'),
      ('pedidos','write_pedidos'),
      ('pedido_itens','write_pedido_itens'),
      ('metas_vendas','write_metas')
    ) AS t(tablename, write_policy)
  LOOP
    -- Read existing ALL policy expressions, if present
    SELECT pol.qual, pol.with_check
    INTO v_qual, v_check
    FROM pg_policies pol
    WHERE pol.schemaname = 'public'
      AND pol.tablename = rec.tablename
      AND pol.policyname = rec.write_policy
    LIMIT 1;

    IF FOUND THEN
      -- Drop the permissive ALL policy
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', rec.write_policy, rec.tablename);

      -- Prepare standardized policy names
      v_ins_pol := rec.tablename || '_insert';
      v_upd_pol := rec.tablename || '_update';
      v_del_pol := rec.tablename || '_delete';

      -- Drop possibly existing standardized policies to avoid duplicates
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_ins_pol, rec.tablename);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_upd_pol, rec.tablename);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_del_pol, rec.tablename);

      -- INSERT: only WITH CHECK matters
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (%s)',
        v_ins_pol, rec.tablename, COALESCE(v_check, v_qual, 'true')
      );

      -- UPDATE: need both USING and WITH CHECK
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR UPDATE USING (%s) WITH CHECK (%s)',
        v_upd_pol, rec.tablename,
        COALESCE(v_qual, 'true'),
        COALESCE(v_check, v_qual, 'true')
      );

      -- DELETE: only USING matters
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR DELETE USING (%s)',
        v_del_pol, rec.tablename, COALESCE(v_qual, v_check, 'true')
      );
    END IF;
  END LOOP;
END $$;