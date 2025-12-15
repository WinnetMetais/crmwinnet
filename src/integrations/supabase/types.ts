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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_data: {
        Row: {
          additional_data: Json | null
          category: string
          created_at: string
          id: string
          metric_date: string
          metric_name: string
          metric_value: number | null
          subcategory: string | null
        }
        Insert: {
          additional_data?: Json | null
          category: string
          created_at?: string
          id?: string
          metric_date: string
          metric_name: string
          metric_value?: number | null
          subcategory?: string | null
        }
        Update: {
          additional_data?: Json | null
          category?: string
          created_at?: string
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number | null
          subcategory?: string | null
        }
        Relationships: []
      }
      analytics_reports: {
        Row: {
          created_at: string | null
          data: Json | null
          generated_at: string | null
          generated_by: string | null
          id: string
          period_end: string | null
          period_start: string | null
          report_name: string
          report_type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          report_name: string
          report_type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
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
      campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          platform: string
          results: Json | null
          start_date: string | null
          status: string | null
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          platform: string
          results?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          platform?: string
          results?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      commission_rules: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          max_value: number | null
          min_value: number | null
          name: string
          percentage: number
          product_category: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          name: string
          percentage: number
          product_category?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          name?: string
          percentage?: number
          product_category?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          deal_id: string
          id: string
          paid_at: string | null
          percentage: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          deal_id: string
          id?: string
          paid_at?: string | null
          percentage?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          deal_id?: string
          id?: string
          paid_at?: string | null
          percentage?: number | null
          status?: string | null
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
        ]
      }
      custom_fields: {
        Row: {
          created_at: string | null
          field_label: string | null
          field_name: string
          field_order: number | null
          field_type: string
          id: string
          module: string
          options: Json | null
          required: boolean | null
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          field_label?: string | null
          field_name: string
          field_order?: number | null
          field_type: string
          id?: string
          module: string
          options?: Json | null
          required?: boolean | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          field_label?: string | null
          field_name?: string
          field_order?: number | null
          field_type?: string
          id?: string
          module?: string
          options?: Json | null
          required?: boolean | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: []
      }
      customer_interactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          date: string | null
          duration_minutes: number | null
          id: string
          interaction_date: string | null
          interaction_type: string
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          outcome: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          date?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_date?: string | null
          interaction_type: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          date?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          outcome?: string | null
          subject?: string | null
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
          criteria: Json | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
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
          contact_role: string | null
          created_at: string | null
          created_by: string | null
          customer_type_id: string | null
          data_completeness_percentage: number | null
          data_quality_score: number | null
          email: string | null
          id: string
          last_contact_date: string | null
          last_validated_at: string | null
          lead_source: string | null
          lifecycle_stage: string | null
          name: string
          notes: string | null
          owner_id: string | null
          phone: string | null
          priority: string | null
          segment_id: string | null
          social_reason: string | null
          state: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          validation_errors: string[] | null
          website: string | null
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company?: string | null
          contact_person?: string | null
          contact_role?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_type_id?: string | null
          data_completeness_percentage?: number | null
          data_quality_score?: number | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_source?: string | null
          lifecycle_stage?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          priority?: string | null
          segment_id?: string | null
          social_reason?: string | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          validation_errors?: string[] | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          company?: string | null
          contact_person?: string | null
          contact_role?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_type_id?: string | null
          data_completeness_percentage?: number | null
          data_quality_score?: number | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_source?: string | null
          lifecycle_stage?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          priority?: string | null
          segment_id?: string | null
          social_reason?: string | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          validation_errors?: string[] | null
          website?: string | null
          whatsapp?: string | null
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
          record_id: string
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
          record_id: string
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
          record_id?: string
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
          actual_revenue: number | null
          actual_value: number | null
          assigned_to: string | null
          close_date: string | null
          closed_at: string | null
          created_at: string | null
          customer_id: string
          description: string | null
          estimated_value: number | null
          expected_revenue: number | null
          follow_up_date: string | null
          id: string
          last_contact_date: string | null
          observations: string | null
          opportunity_id: string | null
          owner_id: string | null
          pipeline_stage_id: string | null
          presentation_sent_date: string | null
          priority_id: string | null
          proposal_sent_date: string | null
          proposal_value: number | null
          qualification_status_id: string | null
          stage: string | null
          status: string | null
          title: string
          updated_at: string | null
          value: number
        }
        Insert: {
          active_follow_up?: boolean | null
          actual_revenue?: number | null
          actual_value?: number | null
          assigned_to?: string | null
          close_date?: string | null
          closed_at?: string | null
          created_at?: string | null
          customer_id: string
          description?: string | null
          estimated_value?: number | null
          expected_revenue?: number | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          observations?: string | null
          opportunity_id?: string | null
          owner_id?: string | null
          pipeline_stage_id?: string | null
          presentation_sent_date?: string | null
          priority_id?: string | null
          proposal_sent_date?: string | null
          proposal_value?: number | null
          qualification_status_id?: string | null
          stage?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          value: number
        }
        Update: {
          active_follow_up?: boolean | null
          actual_revenue?: number | null
          actual_value?: number | null
          assigned_to?: string | null
          close_date?: string | null
          closed_at?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string | null
          estimated_value?: number | null
          expected_revenue?: number | null
          follow_up_date?: string | null
          id?: string
          last_contact_date?: string | null
          observations?: string | null
          opportunity_id?: string | null
          owner_id?: string | null
          pipeline_stage_id?: string | null
          presentation_sent_date?: string | null
          priority_id?: string | null
          proposal_sent_date?: string | null
          proposal_value?: number | null
          qualification_status_id?: string | null
          stage?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          value?: number
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
        ]
      }
      departments: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_permissions: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          module: string
          permission_type: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          module: string
          permission_type: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          module?: string
          permission_type?: string
          user_id?: string
        }
        Relationships: []
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
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          closed_at: string | null
          created_at: string | null
          customer_id: string
          description: string | null
          expected_close_date: string | null
          id: string
          lead_source: string | null
          lost_reason: string | null
          owner_id: string | null
          probability: number | null
          stage: string | null
          status: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          customer_id: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_source?: string | null
          lost_reason?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_source?: string | null
          lost_reason?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
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
        ]
      }
      opportunity_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          opportunity_id: string | null
          product_id: string | null
          quantity: number
          total: number
          unit: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          opportunity_id?: string | null
          product_id?: string | null
          quantity?: number
          total?: number
          unit?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          opportunity_id?: string | null
          product_id?: string | null
          quantity?: number
          total?: number
          unit?: string | null
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
          description: string | null
          id: string
          order_id: string
          product_id: string | null
          quantity: number | null
          subtotal: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          quantity?: number | null
          subtotal?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number | null
          subtotal?: number | null
          unit_price?: number | null
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
          customer_id: string
          delivery_address: string | null
          gross_total: number | null
          id: string
          issue_date: string | null
          net_total: number | null
          notes: string | null
          order_number: string
          owner_id: string | null
          payment_method: string | null
          quote_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          delivery_address?: string | null
          gross_total?: number | null
          id?: string
          issue_date?: string | null
          net_total?: number | null
          notes?: string | null
          order_number: string
          owner_id?: string | null
          payment_method?: string | null
          quote_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          delivery_address?: string | null
          gross_total?: number | null
          id?: string
          issue_date?: string | null
          net_total?: number | null
          notes?: string | null
          order_number?: string
          owner_id?: string | null
          payment_method?: string | null
          quote_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
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
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_activities: {
        Row: {
          activity_type: string | null
          completed_date: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          deal_id: string
          description: string
          id: string
          new_stage: string | null
          opportunity_id: string | null
          previous_stage: string | null
          scheduled_date: string | null
          status: string | null
          title: string | null
          type: string
        }
        Insert: {
          activity_type?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_id: string
          description: string
          id?: string
          new_stage?: string | null
          opportunity_id?: string | null
          previous_stage?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string | null
          type: string
        }
        Update: {
          activity_type?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_id?: string
          description?: string
          id?: string
          new_stage?: string | null
          opportunity_id?: string | null
          previous_stage?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string | null
          type?: string
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
          {
            foreignKeyName: "pipeline_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          deal_id: string | null
          from_stage_id: string | null
          id: string
          reason: string | null
          to_stage_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          deal_id?: string | null
          from_stage_id?: string | null
          id?: string
          reason?: string | null
          to_stage_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          deal_id?: string | null
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
          name: string
          order_position: number
          pipeline_type: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_position: number
          pipeline_type?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_position?: number
          pipeline_type?: string | null
        }
        Relationships: []
      }
      priorities: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          id: string
          level: number
          name: string
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          id?: string
          level?: number
          name: string
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          category: string | null
          cost_price: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          inventory_count: number | null
          min_stock: number | null
          name: string
          sale_price: number | null
          sku: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          cost_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          inventory_count?: number | null
          min_stock?: number | null
          name: string
          sale_price?: number | null
          sku?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          cost_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          inventory_count?: number | null
          min_stock?: number | null
          name?: string
          sale_price?: number | null
          sku?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department_id: string | null
          email: string | null
          full_name: string | null
          id: string
          permissions: Json | null
          role: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
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
          created_at: string | null
          description: string
          id: string
          product_code: string | null
          quantity: number
          quote_id: string
          total: number
          unit: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          product_code?: string | null
          quantity: number
          quote_id: string
          total: number
          unit?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          product_code?: string | null
          quantity?: number
          quote_id?: string
          total?: number
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
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
          customer_address: string | null
          customer_cnpj: string | null
          customer_email: string | null
          customer_id: string
          customer_name: string | null
          customer_phone: string | null
          delivery_time: string | null
          description: string | null
          discount: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          payment_terms: string | null
          quote_number: string
          sent_at: string | null
          status: string | null
          subtotal: number | null
          title: string
          total: number | null
          updated_at: string | null
          valid_until: string | null
          warranty: string | null
        }
        Insert: {
          approved_at?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_cnpj?: string | null
          customer_email?: string | null
          customer_id: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_time?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          payment_terms?: string | null
          quote_number: string
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          title: string
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
          warranty?: string | null
        }
        Update: {
          approved_at?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_cnpj?: string | null
          customer_email?: string | null
          customer_id?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_time?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          payment_terms?: string | null
          quote_number?: string
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          title?: string
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
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
          period_type: string | null
          salesperson: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          goal_amount: number
          id?: string
          period_end: string
          period_start: string
          period_type?: string | null
          salesperson: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          goal_amount?: number
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string | null
          salesperson?: string
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
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          opportunity_id: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          opportunity_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          opportunity_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
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
            foreignKeyName: "tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
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
          created_by: string | null
          date: string
          deal_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          payment_method: string | null
          quote_id: string | null
          recurring: boolean | null
          recurring_period: string | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          payment_method?: string | null
          quote_id?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          payment_method?: string | null
          quote_id?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
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
            foreignKeyName: "transactions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          contact_name: string | null
          created_at: string | null
          customer_id: string | null
          direction: string
          id: string
          is_read: boolean | null
          message: string
          phone_number: string
          received_at: string | null
          status: string | null
          whatsapp_message_id: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string | null
          customer_id?: string | null
          direction?: string
          id?: string
          is_read?: boolean | null
          message: string
          phone_number: string
          received_at?: string | null
          status?: string | null
          whatsapp_message_id?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string | null
          customer_id?: string | null
          direction?: string
          id?: string
          is_read?: boolean | null
          message?: string
          phone_number?: string
          received_at?: string | null
          status?: string | null
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
          created_by: string | null
          date: string | null
          deal_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          id: string | null
          invoice_number: string | null
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
        }
        Insert: {
          amount?: number | null
          category?: string | null
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
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
        }
        Update: {
          amount?: number | null
          category?: string | null
          channel?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          deal_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
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
            foreignKeyName: "transactions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_customer_data_quality: {
        Args: { customer_id: string }
        Returns: number
      }
      has_financial_permission: {
        Args: { _module?: string; _permission_type: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_transaction_data: {
        Args: { transaction_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "sales" | "user"
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
      app_role: ["admin", "manager", "sales", "user"],
    },
  },
} as const
