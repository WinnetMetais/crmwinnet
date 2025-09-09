export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_tokens: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_data: {
        Row: {
          additional_data: Json | null
          category: string
          created_at: string | null
          id: string
          metric_date: string
          metric_name: string
          metric_value: number
          subcategory: string | null
          user_id: string
        }
        Insert: {
          additional_data?: Json | null
          category: string
          created_at?: string | null
          id?: string
          metric_date: string
          metric_name: string
          metric_value: number
          subcategory?: string | null
          user_id: string
        }
        Update: {
          additional_data?: Json | null
          category?: string
          created_at?: string | null
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
          subcategory?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_reports: {
        Row: {
          data: Json
          generated_at: string | null
          generated_by: string | null
          id: string
          period_end: string | null
          period_start: string | null
          report_name: string
          report_type: string
        }
        Insert: {
          data: Json
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_name: string
          report_type: string
        }
        Update: {
          data?: Json
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_name?: string
          report_type?: string
        }
        Relationships: []
      }
      approval_hierarchy: {
        Row: {
          active: boolean | null
          amount_limit: number | null
          approver_id: string
          created_at: string | null
          id: string
          module: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          amount_limit?: number | null
          approver_id: string
          created_at?: string | null
          id?: string
          module: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          amount_limit?: number | null
          approver_id?: string
          created_at?: string | null
          id?: string
          module?: string
          user_id?: string
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          amount: number | null
          approved_at: string | null
          approver_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          notes: string | null
          reason: string | null
          request_data: Json
          request_type: string
          requester_id: string
          status: string
        }
        Insert: {
          amount?: number | null
          approved_at?: string | null
          approver_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          request_data: Json
          request_type: string
          requester_id: string
          status?: string
        }
        Update: {
          amount?: number | null
          approved_at?: string | null
          approver_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          request_data?: Json
          request_type?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      atividades: {
        Row: {
          assunto: string | null
          created_at: string | null
          descricao: string | null
          feito: boolean | null
          feito_em: string | null
          id: string
          owner_id: string | null
          quando: string | null
          ref_id: string
          ref_type: string
          tipo: string
        }
        Insert: {
          assunto?: string | null
          created_at?: string | null
          descricao?: string | null
          feito?: boolean | null
          feito_em?: string | null
          id?: string
          owner_id?: string | null
          quando?: string | null
          ref_id: string
          ref_type: string
          tipo: string
        }
        Update: {
          assunto?: string | null
          created_at?: string | null
          descricao?: string | null
          feito?: boolean | null
          feito_em?: string | null
          id?: string
          owner_id?: string | null
          quando?: string | null
          ref_id?: string
          ref_type?: string
          tipo?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          is_admin: boolean | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_admin?: boolean | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_admin?: boolean | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          error_message: string | null
          executed_at: string | null
          execution_data: Json | null
          execution_status: string
          execution_time_ms: number | null
          id: string
          records_created: number | null
          records_processed: number | null
          records_updated: number | null
          rule_id: string | null
        }
        Insert: {
          error_message?: string | null
          executed_at?: string | null
          execution_data?: Json | null
          execution_status: string
          execution_time_ms?: number | null
          id?: string
          records_created?: number | null
          records_processed?: number | null
          records_updated?: number | null
          rule_id?: string | null
        }
        Update: {
          error_message?: string | null
          executed_at?: string | null
          execution_data?: Json | null
          execution_status?: string
          execution_time_ms?: number | null
          id?: string
          records_created?: number | null
          records_processed?: number | null
          records_updated?: number | null
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json
          active: boolean | null
          conditions: Json
          created_at: string | null
          created_by: string | null
          execution_count: number | null
          id: string
          last_executed: string | null
          rule_name: string
          rule_type: string
        }
        Insert: {
          actions?: Json
          active?: boolean | null
          conditions?: Json
          created_at?: string | null
          created_by?: string | null
          execution_count?: number | null
          id?: string
          last_executed?: string | null
          rule_name: string
          rule_type: string
        }
        Update: {
          actions?: Json
          active?: boolean | null
          conditions?: Json
          created_at?: string | null
          created_by?: string | null
          execution_count?: number | null
          id?: string
          last_executed?: string | null
          rule_name?: string
          rule_type?: string
        }
        Relationships: []
      }
      backup_jobs: {
        Row: {
          backup_config: Json | null
          created_at: string | null
          id: string
          job_name: string
          last_run: string | null
          next_run: string | null
          schedule_cron: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          backup_config?: Json | null
          created_at?: string | null
          id?: string
          job_name: string
          last_run?: string | null
          next_run?: string | null
          schedule_cron?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          backup_config?: Json | null
          created_at?: string | null
          id?: string
          job_name?: string
          last_run?: string | null
          next_run?: string | null
          schedule_cron?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          id: string
          owner_id: string
          sale_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          id?: string
          owner_id?: string
          sale_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          id?: string
          owner_id?: string
          sale_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_customer_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_sale_fk"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          platform: string
          results: Json | null
          start_date: string | null
          status: string | null
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          platform: string
          results?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          platform?: string
          results?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      canais_venda: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nome: string
          tipo: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome: string
          tipo?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome?: string
          tipo?: string | null
        }
        Relationships: []
      }
      carriers: {
        Row: {
          active: boolean | null
          cnpj: string | null
          contact_person: string | null
          coverage_areas: string[] | null
          created_at: string | null
          delivery_time_days: number | null
          email: string | null
          id: string
          max_weight: number | null
          min_weight: number | null
          name: string
          phone: string | null
          price_per_kg: number | null
        }
        Insert: {
          active?: boolean | null
          cnpj?: string | null
          contact_person?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          delivery_time_days?: number | null
          email?: string | null
          id?: string
          max_weight?: number | null
          min_weight?: number | null
          name: string
          phone?: string | null
          price_per_kg?: number | null
        }
        Update: {
          active?: boolean | null
          cnpj?: string | null
          contact_person?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          delivery_time_days?: number | null
          email?: string | null
          id?: string
          max_weight?: number | null
          min_weight?: number | null
          name?: string
          phone?: string | null
          price_per_kg?: number | null
        }
        Relationships: []
      }
      cash_flow_projections: {
        Row: {
          accumulated_flow: number | null
          confidence_level: number | null
          confirmed_expenses: number | null
          confirmed_income: number | null
          created_at: string | null
          id: string
          net_flow: number | null
          projected_expenses: number | null
          projected_income: number | null
          projection_date: string
          updated_at: string | null
        }
        Insert: {
          accumulated_flow?: number | null
          confidence_level?: number | null
          confirmed_expenses?: number | null
          confirmed_income?: number | null
          created_at?: string | null
          id?: string
          net_flow?: number | null
          projected_expenses?: number | null
          projected_income?: number | null
          projection_date: string
          updated_at?: string | null
        }
        Update: {
          accumulated_flow?: number | null
          confidence_level?: number | null
          confirmed_expenses?: number | null
          confirmed_income?: number | null
          created_at?: string | null
          id?: string
          net_flow?: number | null
          projected_expenses?: number | null
          projected_income?: number | null
          projection_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          nome: string
          parent_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          nome: string
          parent_id?: string | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          nome?: string
          parent_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      centros_custo: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cnpj_cpf: string | null
          created_at: string | null
          criado_por: string | null
          email: string | null
          endereco: Json | null
          id: string
          nome_fantasia: string | null
          origem: string | null
          razao_social: string | null
          telefone: string | null
          whatsapp: string | null
        }
        Insert: {
          cnpj_cpf?: string | null
          created_at?: string | null
          criado_por?: string | null
          email?: string | null
          endereco?: Json | null
          id?: string
          nome_fantasia?: string | null
          origem?: string | null
          razao_social?: string | null
          telefone?: string | null
          whatsapp?: string | null
        }
        Update: {
          cnpj_cpf?: string | null
          created_at?: string | null
          criado_por?: string | null
          email?: string | null
          endereco?: Json | null
          id?: string
          nome_fantasia?: string | null
          origem?: string | null
          razao_social?: string | null
          telefone?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      commission_rules: {
        Row: {
          active: boolean
          created_at: string
          id: string
          is_admin: boolean
          max_sales: number
          min_sales: number
          name: string
          rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          is_admin?: boolean
          max_sales: number
          min_sales: number
          name: string
          rate: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          is_admin?: boolean
          max_sales?: number
          min_sales?: number
          name?: string
          rate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          base_amount: number
          commission_amount: number
          commission_rate: number
          created_at: string | null
          deal_id: string | null
          id: string
          paid_at: string | null
          quote_id: string | null
          salesperson: string
          status: string
          user_id: string
        }
        Insert: {
          base_amount: number
          commission_amount: number
          commission_rate: number
          created_at?: string | null
          deal_id?: string | null
          id?: string
          paid_at?: string | null
          quote_id?: string | null
          salesperson: string
          status?: string
          user_id: string
        }
        Update: {
          base_amount?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          deal_id?: string | null
          id?: string
          paid_at?: string | null
          quote_id?: string | null
          salesperson?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      contas: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      contas_financeiras: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          moeda: string | null
          nome: string
          saldo_inicial: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          moeda?: string | null
          nome: string
          saldo_inicial?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          moeda?: string | null
          nome?: string
          saldo_inicial?: number | null
        }
        Relationships: []
      }
      contas_pagar: {
        Row: {
          categoria_id: string | null
          centro_custo_id: string | null
          created_at: string | null
          created_by: string | null
          emissao: string | null
          fatura_ref: string | null
          fornecedor: string
          id: string
          meio_pagamento: string | null
          pago_em: string | null
          status: string | null
          valor: number
          valor_pago: number | null
          vencimento: string
        }
        Insert: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          created_at?: string | null
          created_by?: string | null
          emissao?: string | null
          fatura_ref?: string | null
          fornecedor: string
          id?: string
          meio_pagamento?: string | null
          pago_em?: string | null
          status?: string | null
          valor: number
          valor_pago?: number | null
          vencimento: string
        }
        Update: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          created_at?: string | null
          created_by?: string | null
          emissao?: string | null
          fatura_ref?: string | null
          fornecedor?: string
          id?: string
          meio_pagamento?: string | null
          pago_em?: string | null
          status?: string | null
          valor?: number
          valor_pago?: number | null
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_pagar_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_receber: {
        Row: {
          canal: string | null
          conta_id: string | null
          created_at: string | null
          created_by: string | null
          emissao: string | null
          id: string
          meio_pagamento: string | null
          pedido: string | null
          recebido_em: string | null
          status: string | null
          valor: number
          valor_recebido: number | null
          vencimento: string | null
        }
        Insert: {
          canal?: string | null
          conta_id?: string | null
          created_at?: string | null
          created_by?: string | null
          emissao?: string | null
          id?: string
          meio_pagamento?: string | null
          pedido?: string | null
          recebido_em?: string | null
          status?: string | null
          valor: number
          valor_recebido?: number | null
          vencimento?: string | null
        }
        Update: {
          canal?: string | null
          conta_id?: string | null
          created_at?: string | null
          created_by?: string | null
          emissao?: string | null
          id?: string
          meio_pagamento?: string | null
          pedido?: string | null
          recebido_em?: string | null
          status?: string | null
          valor?: number
          valor_recebido?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos: {
        Row: {
          cargo: string | null
          cliente_id: string | null
          created_at: string | null
          criado_por: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
          whatsapp: string | null
        }
        Insert: {
          cargo?: string | null
          cliente_id?: string | null
          created_at?: string | null
          criado_por?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
          whatsapp?: string | null
        }
        Update: {
          cargo?: string | null
          cliente_id?: string | null
          created_at?: string | null
          criado_por?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contatos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_calendar: {
        Row: {
          campaign_id: string | null
          content_text: string | null
          content_type: string
          created_at: string | null
          id: string
          image_url: string | null
          platform: string
          scheduled_date: string
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          content_text?: string | null
          content_type: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          platform: string
          scheduled_date: string
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          content_text?: string | null
          content_type?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          platform?: string
          scheduled_date?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          id: string
          is_system_template: boolean | null
          name: string
          template_content: string
          user_id: string | null
          variables: Json | null
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          id?: string
          is_system_template?: boolean | null
          name: string
          template_content: string
          user_id?: string | null
          variables?: Json | null
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          id?: string
          is_system_template?: boolean | null
          name?: string
          template_content?: string
          user_id?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      custom_fields: {
        Row: {
          created_at: string | null
          field_label: string
          field_name: string
          field_order: number | null
          field_type: string
          id: string
          module: string
          options: Json | null
          required: boolean | null
          updated_at: string | null
          user_id: string
          validation_rules: Json | null
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          field_label: string
          field_name: string
          field_order?: number | null
          field_type: string
          id?: string
          module: string
          options?: Json | null
          required?: boolean | null
          updated_at?: string | null
          user_id: string
          validation_rules?: Json | null
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          field_label?: string
          field_name?: string
          field_order?: number | null
          field_type?: string
          id?: string
          module?: string
          options?: Json | null
          required?: boolean | null
          updated_at?: string | null
          user_id?: string
          validation_rules?: Json | null
          visible?: boolean | null
        }
        Relationships: []
      }
      custom_reports: {
        Row: {
          columns: Json | null
          created_at: string | null
          description: string | null
          filters: Json | null
          id: string
          name: string
          report_type: string
          schedule_config: Json | null
          scheduled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          columns?: Json | null
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          name: string
          report_type: string
          schedule_config?: Json | null
          scheduled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          columns?: Json | null
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          name?: string
          report_type?: string
          schedule_config?: Json | null
          scheduled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customer_interactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string
          date: string
          description: string | null
          duration_minutes: number | null
          id: string
          interaction_type: string
          next_action: string | null
          next_action_date: string | null
          outcome: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          date?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_type: string
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          date?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_type?: string
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      customer_types: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          company: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          custom_data: Json | null
          customer_type_id: string | null
          data_completeness_percentage: number | null
          data_quality_score: number | null
          email: string | null
          id: string
          is_active: boolean
          last_contact_date: string | null
          last_validated_at: string | null
          lead_score: number | null
          lead_source: string | null
          lead_source_id: string | null
          lifecycle_stage: string | null
          name: string
          notes: string | null
          owner: string | null
          owner_id: string | null
          phone: string | null
          priority_id: string | null
          qualification_status_id: string | null
          segment_id: string | null
          social_reason: string | null
          source_details: Json | null
          state: string | null
          status: string | null
          tags: string[] | null
          team: string | null
          updated_at: string
          validation_errors: Json | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          custom_data?: Json | null
          customer_type_id?: string | null
          data_completeness_percentage?: number | null
          data_quality_score?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_source_id?: string | null
          lifecycle_stage?: string | null
          name: string
          notes?: string | null
          owner?: string | null
          owner_id?: string | null
          phone?: string | null
          priority_id?: string | null
          qualification_status_id?: string | null
          segment_id?: string | null
          social_reason?: string | null
          source_details?: Json | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          team?: string | null
          updated_at?: string
          validation_errors?: Json | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          custom_data?: Json | null
          customer_type_id?: string | null
          data_completeness_percentage?: number | null
          data_quality_score?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_source_id?: string | null
          lifecycle_stage?: string | null
          name?: string
          notes?: string | null
          owner?: string | null
          owner_id?: string | null
          phone?: string | null
          priority_id?: string | null
          qualification_status_id?: string | null
          segment_id?: string | null
          social_reason?: string | null
          source_details?: Json | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          team?: string | null
          updated_at?: string
          validation_errors?: Json | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_customer_type_id_fkey"
            columns: ["customer_type_id"]
            isOneToOne: false
            referencedRelation: "customer_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "priorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_qualification_status_id_fkey"
            columns: ["qualification_status_id"]
            isOneToOne: false
            referencedRelation: "qualification_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customers_lead_source"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customers_segment"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      customers_quotes: {
        Row: {
          address: string | null
          city: string | null
          cnpj_cpf: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj_cpf?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj_cpf?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      data_validation_logs: {
        Row: {
          created_at: string | null
          errors: Json | null
          id: string
          module_name: string
          record_id: string | null
          suggestions: Json | null
          table_name: string
          validated_at: string | null
          validated_by: string | null
          validation_status: string
          validation_type: string
        }
        Insert: {
          created_at?: string | null
          errors?: Json | null
          id?: string
          module_name: string
          record_id?: string | null
          suggestions?: Json | null
          table_name: string
          validated_at?: string | null
          validated_by?: string | null
          validation_status: string
          validation_type: string
        }
        Update: {
          created_at?: string | null
          errors?: Json | null
          id?: string
          module_name?: string
          record_id?: string | null
          suggestions?: Json | null
          table_name?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_status?: string
          validation_type?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          active_follow_up: boolean | null
          actual_value: number | null
          assigned_to: string | null
          close_date: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          data_quality_score: number | null
          description: string | null
          estimated_value: number | null
          follow_up_date: string | null
          id: string
          last_contact_date: string | null
          last_validated_at: string | null
          observations: string | null
          opportunity_id: string | null
          owner_id: string | null
          pipeline_stage_id: string | null
          presentation_sent_date: string | null
          priority_id: string | null
          proposal_sent_date: string | null
          proposal_value: number | null
          qualification_status_id: string | null
          quote_id: string | null
          status: string | null
          team: string | null
          title: string
          updated_at: string
          validation_errors: Json | null
          value: number | null
        }
        Insert: {
          active_follow_up?: boolean | null
          actual_value?: number | null
          assigned_to?: string | null
          close_date?: string | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          data_quality_score?: number | null
          description?: string | null
          estimated_value?: number | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          last_validated_at?: string | null
          observations?: string | null
          opportunity_id?: string | null
          owner_id?: string | null
          pipeline_stage_id?: string | null
          presentation_sent_date?: string | null
          priority_id?: string | null
          proposal_sent_date?: string | null
          proposal_value?: number | null
          qualification_status_id?: string | null
          quote_id?: string | null
          status?: string | null
          team?: string | null
          title: string
          updated_at?: string
          validation_errors?: Json | null
          value?: number | null
        }
        Update: {
          active_follow_up?: boolean | null
          actual_value?: number | null
          assigned_to?: string | null
          close_date?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          data_quality_score?: number | null
          description?: string | null
          estimated_value?: number | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          last_validated_at?: string | null
          observations?: string | null
          opportunity_id?: string | null
          owner_id?: string | null
          pipeline_stage_id?: string | null
          presentation_sent_date?: string | null
          priority_id?: string | null
          proposal_sent_date?: string | null
          proposal_value?: number | null
          qualification_status_id?: string | null
          quote_id?: string | null
          status?: string | null
          team?: string | null
          title?: string
          updated_at?: string
          validation_errors?: Json | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_pipeline_stage_id_fkey"
            columns: ["pipeline_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "priorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_qualification_status_id_fkey"
            columns: ["qualification_status_id"]
            isOneToOne: false
            referencedRelation: "qualification_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_deals_pipeline_stage"
            columns: ["pipeline_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_log: {
        Row: {
          actor: string | null
          entity: string
          entity_id: string | null
          event: string
          id: string
          meta: Json | null
          ts: string
        }
        Insert: {
          actor?: string | null
          entity: string
          entity_id?: string | null
          event: string
          id?: string
          meta?: Json | null
          ts?: string
        }
        Update: {
          actor?: string | null
          entity?: string
          entity_id?: string | null
          event?: string
          id?: string
          meta?: Json | null
          ts?: string
        }
        Relationships: []
      }
      financial_permissions: {
        Row: {
          active: boolean | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          module: string
          permission_type: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          module: string
          permission_type: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          module?: string
          permission_type?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          cash_flow: number | null
          created_at: string | null
          generated_by: string | null
          id: string
          net_profit: number | null
          period_end: string
          period_start: string
          report_data: Json | null
          report_type: string
          total_expenses: number | null
          total_revenue: number | null
        }
        Insert: {
          cash_flow?: number | null
          created_at?: string | null
          generated_by?: string | null
          id?: string
          net_profit?: number | null
          period_end: string
          period_start: string
          report_data?: Json | null
          report_type: string
          total_expenses?: number | null
          total_revenue?: number | null
        }
        Update: {
          cash_flow?: number | null
          created_at?: string | null
          generated_by?: string | null
          id?: string
          net_profit?: number | null
          period_end?: string
          period_start?: string
          report_data?: Json | null
          report_type?: string
          total_expenses?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      index_usage_snapshots: {
        Row: {
          captured_at: string
          id: string
          idx_scan: number
          idx_tup_fetch: number
          idx_tup_read: number
          index_size_bytes: number
          indexname: string
          schemaname: string
          tablename: string
        }
        Insert: {
          captured_at?: string
          id?: string
          idx_scan: number
          idx_tup_fetch: number
          idx_tup_read: number
          index_size_bytes: number
          indexname: string
          schemaname: string
          tablename: string
        }
        Update: {
          captured_at?: string
          id?: string
          idx_scan?: number
          idx_tup_fetch?: number
          idx_tup_read?: number
          index_size_bytes?: number
          indexname?: string
          schemaname?: string
          tablename?: string
        }
        Relationships: []
      }
      integration_logs: {
        Row: {
          action: string
          created_at: string | null
          data: Json | null
          error_message: string | null
          id: string
          integration_type: string
          status: string
        }
        Insert: {
          action: string
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          id?: string
          integration_type: string
          status: string
        }
        Update: {
          action?: string
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          id?: string
          integration_type?: string
          status?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          location: string | null
          owner_id: string
          product_id: string
          qty_available: number | null
          qty_on_order: number | null
          qty_reserved: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          location?: string | null
          owner_id?: string
          product_id: string
          qty_available?: number | null
          qty_on_order?: number | null
          qty_reserved?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          location?: string | null
          owner_id?: string
          product_id?: string
          qty_available?: number | null
          qty_on_order?: number | null
          qty_reserved?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          discount: number | null
          id: string
          product_id: string | null
          quantity: number
          quote_id: string | null
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity: number
          quote_id?: string | null
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          discount?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          quote_id?: string | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoice_items_quote"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          discount: number | null
          due_date: string | null
          freight: number | null
          id: string
          issue_date: string
          number: string | null
          order_id: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discount?: number | null
          due_date?: string | null
          freight?: number | null
          id?: string
          issue_date?: string
          number?: string | null
          order_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          discount?: number | null
          due_date?: string | null
          freight?: number | null
          id?: string
          issue_date?: string
          number?: string | null
          order_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          centro_custo_id: string | null
          conta_fin_id: string | null
          created_at: string | null
          created_by: string | null
          data_lanc: string
          descricao: string | null
          entrada: number | null
          forma_pagamento: string | null
          id: string
          origem: string | null
          referencia_id: string | null
          saida: number | null
          status: string | null
          valor: number | null
        }
        Insert: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          conta_fin_id?: string | null
          created_at?: string | null
          created_by?: string | null
          data_lanc: string
          descricao?: string | null
          entrada?: number | null
          forma_pagamento?: string | null
          id?: string
          origem?: string | null
          referencia_id?: string | null
          saida?: number | null
          status?: string | null
          valor?: number | null
        }
        Update: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          conta_fin_id?: string | null
          created_at?: string | null
          created_by?: string | null
          data_lanc?: string
          descricao?: string | null
          entrada?: number | null
          forma_pagamento?: string | null
          id?: string
          origem?: string | null
          referencia_id?: string | null
          saida?: number | null
          status?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_conta_fin_id_fkey"
            columns: ["conta_fin_id"]
            isOneToOne: false
            referencedRelation: "contas_financeiras"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          metrics: Json | null
          name: string
          platform: string
          start_date: string | null
          status: string
          target_audience: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name: string
          platform: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          platform?: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      metas_vendas: {
        Row: {
          canal: string
          created_at: string | null
          created_by: string | null
          diferenca: number | null
          faturado: number | null
          id: string
          investido: number | null
          mes: string
          meta: number | null
          meta_minima: number | null
          ticket_medio: number | null
          vendas: number | null
        }
        Insert: {
          canal: string
          created_at?: string | null
          created_by?: string | null
          diferenca?: number | null
          faturado?: number | null
          id?: string
          investido?: number | null
          mes: string
          meta?: number | null
          meta_minima?: number | null
          ticket_medio?: number | null
          vendas?: number | null
        }
        Update: {
          canal?: string
          created_at?: string | null
          created_by?: string | null
          diferenca?: number | null
          faturado?: number | null
          id?: string
          investido?: number | null
          mes?: string
          meta?: number | null
          meta_minima?: number | null
          ticket_medio?: number | null
          vendas?: number | null
        }
        Relationships: []
      }
      negotiations: {
        Row: {
          created_at: string | null
          customer_id: string | null
          deal_id: string | null
          description: string
          id: string
          interaction_type: string
          next_action: string | null
          next_action_date: string | null
          quote_id: string | null
          responsible: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          deal_id?: string | null
          description: string
          id?: string
          interaction_type: string
          next_action?: string | null
          next_action_date?: string | null
          quote_id?: string | null
          responsible?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          deal_id?: string | null
          description?: string
          id?: string
          interaction_type?: string
          next_action?: string | null
          next_action_date?: string | null
          quote_id?: string | null
          responsible?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiations_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          data_quality_score: number | null
          description: string | null
          expected_close_date: string | null
          id: string
          last_validated_at: string | null
          lead_source: string | null
          owner_id: string
          priority_id: string | null
          probability: number | null
          qualification_status_id: string | null
          stage: string
          status: string | null
          title: string
          updated_at: string | null
          validation_errors: Json | null
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          data_quality_score?: number | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          last_validated_at?: string | null
          lead_source?: string | null
          owner_id?: string
          priority_id?: string | null
          probability?: number | null
          qualification_status_id?: string | null
          stage?: string
          status?: string | null
          title: string
          updated_at?: string | null
          validation_errors?: Json | null
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          data_quality_score?: number | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          last_validated_at?: string | null
          lead_source?: string | null
          owner_id?: string
          priority_id?: string | null
          probability?: number | null
          qualification_status_id?: string | null
          stage?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          validation_errors?: Json | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "priorities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_qualification_status_id_fkey"
            columns: ["qualification_status_id"]
            isOneToOne: false
            referencedRelation: "qualification_status"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          opportunity_id: string
          product_id: string | null
          quantity: number
          total: number
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          opportunity_id: string
          product_id?: string | null
          quantity?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          opportunity_id?: string
          product_id?: string | null
          quantity?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_items_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          line_total: number | null
          order_id: string | null
          product_id: string | null
          quantity: number | null
          unit_price: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          line_total?: number | null
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          line_total?: number | null
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          discount: number | null
          freight: number | null
          gross_total: number | null
          id: string
          issue_date: string | null
          net_total: number | null
          opportunity_id: string | null
          order_number: string | null
          owner_id: string | null
          sales_channel_id: string | null
          status: string | null
          team: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          discount?: number | null
          freight?: number | null
          gross_total?: number | null
          id?: string
          issue_date?: string | null
          net_total?: number | null
          opportunity_id?: string | null
          order_number?: string | null
          owner_id?: string | null
          sales_channel_id?: string | null
          status?: string | null
          team?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          discount?: number | null
          freight?: number | null
          gross_total?: number | null
          id?: string
          issue_date?: string | null
          net_total?: number | null
          opportunity_id?: string | null
          order_number?: string | null
          owner_id?: string | null
          sales_channel_id?: string | null
          status?: string | null
          team?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_sales_channel_id_fkey"
            columns: ["sales_channel_id"]
            isOneToOne: false
            referencedRelation: "canais_venda"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      payment_terms: {
        Row: {
          active: boolean | null
          created_at: string | null
          days: number
          discount_percentage: number | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          days?: number
          discount_percentage?: number | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          days?: number
          discount_percentage?: number | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string
          method: string | null
          paid_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id: string
          method?: string | null
          paid_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string
          method?: string | null
          paid_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_invoice"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_itens: {
        Row: {
          id: string
          pedido_id: string | null
          preco_unit: number | null
          produto_id: string | null
          qtde: number | null
          total_item: number | null
        }
        Insert: {
          id?: string
          pedido_id?: string | null
          preco_unit?: number | null
          produto_id?: string | null
          qtde?: number | null
          total_item?: number | null
        }
        Update: {
          id?: string
          pedido_id?: string | null
          preco_unit?: number | null
          produto_id?: string | null
          qtde?: number | null
          total_item?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_itens_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          canal_id: string | null
          cliente_id: string | null
          created_at: string | null
          desconto: number | null
          emissao: string | null
          frete: number | null
          id: string
          numero: string | null
          oportunidade_id: string | null
          status: string | null
          total_bruto: number | null
          total_liquido: number | null
        }
        Insert: {
          canal_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          desconto?: number | null
          emissao?: string | null
          frete?: number | null
          id?: string
          numero?: string | null
          oportunidade_id?: string | null
          status?: string | null
          total_bruto?: number | null
          total_liquido?: number | null
        }
        Update: {
          canal_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          desconto?: number | null
          emissao?: string | null
          frete?: number | null
          id?: string
          numero?: string | null
          oportunidade_id?: string | null
          status?: string | null
          total_bruto?: number | null
          total_liquido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedidos_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais_venda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_activities: {
        Row: {
          activity_type: string
          completed_date: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          deal_id: string
          description: string | null
          id: string
          scheduled_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_id: string
          description?: string | null
          id?: string
          scheduled_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_id?: string
          description?: string | null
          id?: string
          scheduled_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_activities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          deal_id: string
          from_stage_id: string | null
          id: string
          reason: string | null
          to_stage_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          deal_id: string
          from_stage_id?: string | null
          id?: string
          reason?: string | null
          to_stage_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          deal_id?: string
          from_stage_id?: string | null
          id?: string
          reason?: string | null
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_history_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_history_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_lost: boolean | null
          is_won: boolean | null
          name: string
          order_position: number
          probability: number | null
          stage_key: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_lost?: boolean | null
          is_won?: boolean | null
          name: string
          order_position: number
          probability?: number | null
          stage_key?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_lost?: boolean | null
          is_won?: boolean | null
          name?: string
          order_position?: number
          probability?: number | null
          stage_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pipelines: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          etapas: string[]
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          etapas?: string[]
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          etapas?: string[]
          id?: string
          nome?: string
        }
        Relationships: []
      }
      price_lists: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          max_quantity: number | null
          min_quantity: number | null
          name: string
          price: number
          product_id: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          max_quantity?: number | null
          min_quantity?: number | null
          name: string
          price: number
          product_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          max_quantity?: number | null
          min_quantity?: number | null
          name?: string
          price?: number
          product_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_lists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      priorities: {
        Row: {
          active: boolean | null
          color: string
          created_at: string | null
          id: string
          level: number
          name: string
        }
        Insert: {
          active?: boolean | null
          color: string
          created_at?: string | null
          id?: string
          level: number
          name: string
        }
        Update: {
          active?: boolean | null
          color?: string
          created_at?: string | null
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_categories_parent"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_configurations: {
        Row: {
          active: boolean | null
          configuration_data: Json
          configuration_type: string
          created_at: string | null
          id: string
          product_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          configuration_data: Json
          configuration_type: string
          created_at?: string | null
          id?: string
          product_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          configuration_data?: Json
          configuration_type?: string
          created_at?: string | null
          id?: string
          product_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_configurations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category: string | null
          category_id: string | null
          code: string | null
          cost_price: number | null
          created_at: string
          custom_data: Json | null
          description: string | null
          dimensions: string | null
          id: string
          image_url: string | null
          inventory_count: number | null
          margin_50: number | null
          margin_55: number | null
          margin_60: number | null
          margin_65: number | null
          margin_70: number | null
          margin_75: number | null
          min_stock: number | null
          name: string
          price: number | null
          sale_price: number | null
          sku: string | null
          specifications: Json | null
          stock_current: number | null
          stock_max: number | null
          stock_min: number | null
          supplier: string | null
          supplier_id: string | null
          unit: string | null
          unit_id: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          category_id?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          margin_50?: number | null
          margin_55?: number | null
          margin_60?: number | null
          margin_65?: number | null
          margin_70?: number | null
          margin_75?: number | null
          min_stock?: number | null
          name: string
          price?: number | null
          sale_price?: number | null
          sku?: string | null
          specifications?: Json | null
          stock_current?: number | null
          stock_max?: number | null
          stock_min?: number | null
          supplier?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_id?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          category_id?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          margin_50?: number | null
          margin_55?: number | null
          margin_60?: number | null
          margin_65?: number | null
          margin_70?: number | null
          margin_75?: number | null
          min_stock?: number | null
          name?: string
          price?: number | null
          sale_price?: number | null
          sku?: string | null
          specifications?: Json | null
          stock_current?: number | null
          stock_max?: number | null
          stock_min?: number | null
          supplier?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_id?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_products_supplier"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_products_unit"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          owner_id: string
          preco: number | null
          sku: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          owner_id?: string
          preco?: number | null
          sku?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          owner_id?: string
          preco?: number | null
          sku?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          department_id: string | null
          display_name: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          preferences: Json | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      qualification_status: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          code: string
          created_at: string | null
          description: string
          id: string
          product_id: string | null
          quantity: number
          quote_id: string
          total: number | null
          unit: string
          unit_price: number
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description: string
          id?: string
          product_id?: string | null
          quantity: number
          quote_id: string
          total?: number | null
          unit: string
          unit_price: number
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string
          id?: string
          product_id?: string | null
          quantity?: number
          quote_id?: string
          total?: number | null
          unit?: string
          unit_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          approved_at: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          custom_data: Json | null
          customer_address: string | null
          customer_cnpj: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          data_quality_score: number | null
          date: string
          deal_id: string | null
          delivery_terms: string | null
          discount: number | null
          id: string
          internal_notes: string | null
          last_validated_at: string | null
          notes: string | null
          opportunity_id: string | null
          owner_id: string | null
          payment_terms: string | null
          quote_number: string
          requested_by: string | null
          sent_at: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string
          valid_until: string
          validation_errors: Json | null
          warranty: string | null
        }
        Insert: {
          approved_at?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_data?: Json | null
          customer_address?: string | null
          customer_cnpj?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          data_quality_score?: number | null
          date: string
          deal_id?: string | null
          delivery_terms?: string | null
          discount?: number | null
          id?: string
          internal_notes?: string | null
          last_validated_at?: string | null
          notes?: string | null
          opportunity_id?: string | null
          owner_id?: string | null
          payment_terms?: string | null
          quote_number: string
          requested_by?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id: string
          valid_until: string
          validation_errors?: Json | null
          warranty?: string | null
        }
        Update: {
          approved_at?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_data?: Json | null
          customer_address?: string | null
          customer_cnpj?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          data_quality_score?: number | null
          date?: string
          deal_id?: string | null
          delivery_terms?: string | null
          discount?: number | null
          id?: string
          internal_notes?: string | null
          last_validated_at?: string | null
          notes?: string | null
          opportunity_id?: string | null
          owner_id?: string | null
          payment_terms?: string | null
          quote_number?: string
          requested_by?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string
          valid_until?: string
          validation_errors?: Json | null
          warranty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      saldos_mensais: {
        Row: {
          conta_fin_id: string
          created_at: string | null
          created_by: string | null
          entradas: number | null
          id: string
          mes: string
          saidas: number | null
          saldo_final: number | null
          saldo_inicio: number | null
        }
        Insert: {
          conta_fin_id: string
          created_at?: string | null
          created_by?: string | null
          entradas?: number | null
          id?: string
          mes: string
          saidas?: number | null
          saldo_final?: number | null
          saldo_inicio?: number | null
        }
        Update: {
          conta_fin_id?: string
          created_at?: string | null
          created_by?: string | null
          entradas?: number | null
          id?: string
          mes?: string
          saidas?: number | null
          saldo_final?: number | null
          saldo_inicio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "saldos_mensais_conta_fin_id_fkey"
            columns: ["conta_fin_id"]
            isOneToOne: false
            referencedRelation: "contas_financeiras"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          opportunity_id: string | null
          owner_id: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          owner_id?: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          owner_id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_client_fk"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_opportunity_fk"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          goal_amount: number
          id: string
          period_end: string
          period_start: string
          period_type: string
          salesperson: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          goal_amount: number
          id?: string
          period_end: string
          period_start: string
          period_type: string
          salesperson: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          goal_amount?: number
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          salesperson?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_performance: {
        Row: {
          average_deal_size: number | null
          commission_earned: number | null
          conversion_rate: number | null
          created_at: string | null
          deals_lost: number | null
          deals_won: number | null
          id: string
          period_end: string
          period_start: string
          salesperson: string
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          average_deal_size?: number | null
          commission_earned?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          deals_lost?: number | null
          deals_won?: number | null
          id?: string
          period_end: string
          period_start: string
          salesperson: string
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          average_deal_size?: number | null
          commission_earned?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          deals_lost?: number | null
          deals_won?: number | null
          id?: string
          period_end?: string
          period_start?: string
          salesperson?: string
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_quotes: {
        Row: {
          carrier: string
          created_at: string | null
          estimated_days: number | null
          id: string
          payload: Json | null
          price: number
          quote_id: string | null
          service_code: string | null
          user_id: string
        }
        Insert: {
          carrier: string
          created_at?: string | null
          estimated_days?: number | null
          id?: string
          payload?: Json | null
          price: number
          quote_id?: string | null
          service_code?: string | null
          user_id: string
        }
        Update: {
          carrier?: string
          created_at?: string | null
          estimated_days?: number | null
          id?: string
          payload?: Json | null
          price?: number
          quote_id?: string | null
          service_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          cnpj: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          credit_limit: number | null
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          rating: number | null
          state: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      system_users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          last_login: string | null
          phone: string | null
          role: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email: string
          full_name: string
          id?: string
          last_login?: string | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          quote_id: string | null
          status: string
          team: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          quote_id?: string | null
          status?: string
          team?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          quote_id?: string | null
          status?: string
          team?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          channel: string | null
          client_name: string | null
          created_at: string | null
          data_quality_score: number | null
          date: string
          deal_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          last_modified_by: string | null
          last_validated_at: string | null
          opportunity_id: string | null
          payment_method: string | null
          quote_id: string | null
          recurring: boolean | null
          recurring_period: string | null
          status: string
          subcategory: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
          validation_errors: Json | null
        }
        Insert: {
          amount: number
          category: string
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          date: string
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          last_modified_by?: string | null
          last_validated_at?: string | null
          opportunity_id?: string | null
          payment_method?: string | null
          quote_id?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
          validation_errors?: Json | null
        }
        Update: {
          amount?: number
          category?: string
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          date?: string
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          last_modified_by?: string | null
          last_validated_at?: string | null
          opportunity_id?: string | null
          payment_method?: string | null
          quote_id?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          abbreviation: string
          active: boolean | null
          base_unit_id: string | null
          conversion_factor: number | null
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          abbreviation: string
          active?: boolean | null
          base_unit_id?: string | null
          conversion_factor?: number | null
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          abbreviation?: string
          active?: boolean | null
          base_unit_id?: string | null
          conversion_factor?: number | null
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_units_base"
            columns: ["base_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_name: string
          resource_id: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_name: string
          resource_id?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_name?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_permissions_new: {
        Row: {
          created_at: string | null
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          roles: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          roles?: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          roles?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          notification_preferences: Json | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          contact_name: string
          created_at: string
          customer_id: string | null
          direction: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string
          phone_number: string | null
          received_at: string | null
          status: string
          updated_at: string
          user_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          contact_name: string
          created_at?: string
          customer_id?: string | null
          direction?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type: string
          phone_number?: string | null
          received_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          contact_name?: string
          created_at?: string
          customer_id?: string | null
          direction?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string
          phone_number?: string | null
          received_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_transactions: {
        Row: {
          amount: number | null
          category: string | null
          channel: string | null
          client_name: string | null
          created_at: string | null
          data_quality_score: number | null
          date: string | null
          deal_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          id: string | null
          invoice_number: string | null
          last_modified_by: string | null
          last_validated_at: string | null
          opportunity_id: string | null
          payment_method: string | null
          quote_id: string | null
          recurring: boolean | null
          recurring_period: string | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          title: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          validation_errors: Json | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          date?: string | null
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
          last_modified_by?: string | null
          last_validated_at?: string | null
          opportunity_id?: string | null
          payment_method?: string | null
          quote_id?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          validation_errors?: Json | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          date?: string | null
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
          last_modified_by?: string | null
          last_validated_at?: string | null
          opportunity_id?: string | null
          payment_method?: string | null
          quote_id?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          validation_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      me: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          department_id: string | null
          department_name: string | null
          display_name: string | null
          full_name: string | null
          id: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_analytics: {
        Row: {
          expenses: number | null
          month: string | null
          revenue: number | null
          total_deals: number | null
          total_opportunities: number | null
          total_quotes: number | null
          won_deals: number | null
          won_value: number | null
        }
        Relationships: []
      }
      vw_index_roles: {
        Row: {
          covers_fk: boolean | null
          indexname: unknown | null
          indexrelid: unknown | null
          indisprimary: boolean | null
          indisunique: boolean | null
          schemaname: unknown | null
          tablename: unknown | null
        }
        Relationships: []
      }
      vw_unused_index_candidates_30d: {
        Row: {
          first_seen: string | null
          indexname: string | null
          last_seen: string | null
          max_scan: number | null
          min_scan: number | null
          scan_delta: number | null
          schemaname: string | null
          size_mb: number | null
          tablename: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: undefined
      }
      auto_approve_if_allowed: {
        Args: { _amount?: number; _request_type: string; _user_id: string }
        Returns: boolean
      }
      calculate_cash_flow_projections: {
        Args: { _end_date?: string; _start_date?: string }
        Returns: undefined
      }
      calculate_customer_data_quality: {
        Args: { customer_id: string }
        Returns: number
      }
      can_approve_request: {
        Args: {
          _amount?: number
          _approver_id: string
          _module?: string
          _requester_id: string
        }
        Returns: boolean
      }
      check_failed_auth_attempts: {
        Args: Record<PropertyKey, never>
        Returns: {
          attempt_count: number
          last_attempt: string
          user_email: string
        }[]
      }
      check_overdue_alerts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_advanced_statistics: {
        Args: { end_date?: string; start_date?: string }
        Returns: Json
      }
      get_unused_index_candidates: {
        Args: { min_days?: number }
        Returns: {
          first_seen: string
          indexname: string
          last_seen: string
          scan_delta: number
          schemaname: string
          size_mb: number
          tablename: string
        }[]
      }
      has_financial_permission: {
        Args: { _module?: string; _permission_type: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_unused_index_report: {
        Args: { min_days?: number }
        Returns: undefined
      }
      remove_user_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: undefined
      }
      send_notification: {
        Args: {
          p_action_url?: string
          p_message: string
          p_metadata?: Json
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      snapshot_index_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_deal_data: {
        Args: { deal_id: string }
        Returns: Json
      }
      validate_opportunity_data: {
        Args: { opportunity_id: string }
        Returns: Json
      }
      validate_transaction_data: {
        Args: { transaction_id: string }
        Returns: Json
      }
    }
    Enums: {
      permission_type:
        | "vendas"
        | "clientes"
        | "relatórios"
        | "estoque"
        | "financeiro"
        | "configurações"
        | "marketing"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      permission_type: [
        "vendas",
        "clientes",
        "relatórios",
        "estoque",
        "financeiro",
        "configurações",
        "marketing",
        "admin",
      ],
    },
  },
} as const
