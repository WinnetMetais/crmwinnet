import { supabase } from "@/integrations/supabase/client";

/**
 * Service to create test data for validating the sales flow
 */
export const testDataService = {
  /**
   * Create a complete test customer with opportunity, quote, and deal
   */
  async createCompleteTestData() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // 1. Get first pipeline stage
    const { data: stages } = await supabase
      .from('pipeline_stages')
      .select('id')
      .order('order_position')
      .limit(1);
    
    const firstStageId = stages?.[0]?.id;

    // 2. Get first priority
    const { data: priorities } = await supabase
      .from('priorities')
      .select('id')
      .order('level')
      .limit(1);
    
    const priorityId = priorities?.[0]?.id;

    // 3. Create test customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: 'Construtora ABC Ltda',
        email: 'contato@construtoraabc.com.br',
        phone: '(11) 99999-8888',
        company: 'Construtora ABC',
        cnpj: '12.345.678/0001-99',
        address: 'Rua das Indústrias, 500',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-000',
        status: 'qualified',
        lead_source: 'Indicação',
        contact_person: 'João da Silva',
        contact_role: 'Gerente de Compras',
        lifecycle_stage: 'qualified',
        whatsapp: '(11) 99999-8888',
        priority: 'alta',
        created_by: userId
      })
      .select()
      .single();

    if (customerError) {
      console.error('Error creating customer:', customerError);
      throw customerError;
    }

    // 4. Create test product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: 'Lixeira Coleta Seletiva L4090',
        sku: 'WM-L4090-CS',
        description: 'Lixeira para coleta seletiva em aço inox 304',
        sale_price: 1250.00,
        cost_price: 750.00,
        category: 'Lixeiras',
        unit: 'un',
        active: true,
        inventory_count: 50,
        min_stock: 10,
        created_by: userId
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      throw productError;
    }

    // 5. Create opportunity
    const { data: opportunity, error: opportunityError } = await supabase
      .from('opportunities')
      .insert({
        customer_id: customer.id,
        title: 'Fornecimento de Lixeiras - Construtora ABC',
        description: 'Fornecimento de 20 unidades de lixeiras para coleta seletiva',
        value: 25000.00,
        stage: 'qualificacao',
        probability: 60,
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lead_source: 'Indicação',
        status: 'aberta',
        owner_id: userId
      })
      .select()
      .single();

    if (opportunityError) {
      console.error('Error creating opportunity:', opportunityError);
      throw opportunityError;
    }

    // 6. Create opportunity items
    await supabase
      .from('opportunity_items')
      .insert({
        opportunity_id: opportunity.id,
        product_id: product.id,
        description: 'Lixeira Coleta Seletiva L4090',
        quantity: 20,
        unit: 'un',
        unit_price: 1250.00,
        total: 25000.00
      });

    // 7. Create quote
    const quoteNumber = `WM${String(Date.now()).slice(-6)}`;
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        customer_id: customer.id,
        quote_number: quoteNumber,
        title: 'Orçamento - Lixeiras Coleta Seletiva',
        description: 'Orçamento para fornecimento de lixeiras',
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: `${customer.address}, ${customer.city} - ${customer.state}`,
        customer_cnpj: customer.cnpj,
        contact_person: customer.contact_person,
        status: 'enviado',
        subtotal: 25000.00,
        discount: 0,
        total: 25000.00,
        valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        payment_terms: '30/60/90 dias',
        delivery_time: '15 dias úteis',
        warranty: '12 meses',
        created_by: userId
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      throw quoteError;
    }

    // 8. Create quote items
    await supabase
      .from('quote_items')
      .insert({
        quote_id: quote.id,
        description: 'Lixeira Coleta Seletiva L4090 - Aço Inox 304',
        product_code: 'WM-L4090-CS',
        quantity: 20,
        unit: 'un',
        unit_price: 1250.00,
        total: 25000.00
      });

    // 9. Create deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        customer_id: customer.id,
        opportunity_id: opportunity.id,
        title: 'Negociação - Construtora ABC',
        description: 'Negociação em andamento para fornecimento de lixeiras',
        value: 25000.00,
        estimated_value: 25000.00,
        status: 'em_andamento',
        stage: 'negociacao',
        pipeline_stage_id: firstStageId,
        priority_id: priorityId,
        close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active_follow_up: true,
        assigned_to: 'ketellyn-lira',
        observations: 'Cliente interessado em parceria de longo prazo',
        owner_id: userId
      })
      .select()
      .single();

    if (dealError) {
      console.error('Error creating deal:', dealError);
      throw dealError;
    }

    // 10. Create customer interaction
    await supabase
      .from('customer_interactions')
      .insert({
        customer_id: customer.id,
        interaction_type: 'call',
        subject: 'Primeiro contato comercial',
        date: new Date().toISOString(),
        duration_minutes: 30,
        outcome: 'Cliente interessado em orçamento',
        next_action: 'Enviar orçamento detalhado',
        next_action_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Cliente demonstrou interesse em parceria para múltiplos projetos',
        created_by: userId
      });

    // 11. Create pipeline activity
    await supabase
      .from('pipeline_activities')
      .insert({
        deal_id: deal.id,
        type: 'stage_change',
        description: 'Negociação iniciada com sucesso',
        activity_type: 'note',
        title: 'Início da negociação',
        status: 'concluido',
        customer_id: customer.id,
        created_by: userId
      });

    return {
      customer,
      product,
      opportunity,
      quote,
      deal,
      message: 'Dados de teste criados com sucesso!'
    };
  },

  /**
   * Delete all test data (be careful!)
   */
  async deleteTestData() {
    // This should be used with caution
    console.warn('Esta função apaga dados de teste. Use com cuidado.');
  }
};
