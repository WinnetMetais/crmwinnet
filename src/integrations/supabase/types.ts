export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
      commission_rules: {
        Row: {
          active: boolean
          created_at: string
          id: string
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
          name: string
          template_content: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          id?: string
          name: string
          template_content: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          template_content?: string
          user_id?: string
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
          last_contact_date: string | null
          last_validated_at: string | null
          lead_score: number | null
          lead_source: string | null
          lead_source_id: string | null
          lifecycle_stage: string | null
          name: string
          notes: string | null
          owner: string | null
          phone: string | null
          priority_id: string | null
          qualification_status_id: string | null
          segment_id: string | null
          social_reason: string | null
          source_details: Json | null
          state: string | null
          status: string | null
          tags: string[] | null
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
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_source_id?: string | null
          lifecycle_stage?: string | null
          name: string
          notes?: string | null
          owner?: string | null
          phone?: string | null
          priority_id?: string | null
          qualification_status_id?: string | null
          segment_id?: string | null
          social_reason?: string | null
          source_details?: Json | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
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
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_source_id?: string | null
          lifecycle_stage?: string | null
          name?: string
          notes?: string | null
          owner?: string | null
          phone?: string | null
          priority_id?: string | null
          qualification_status_id?: string | null
          segment_id?: string | null
          social_reason?: string | null
          source_details?: Json | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
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
        ]
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
          pipeline_stage_id: string | null
          presentation_sent_date: string | null
          priority_id: string | null
          proposal_sent_date: string | null
          proposal_value: number | null
          qualification_status_id: string | null
          status: string | null
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
          pipeline_stage_id?: string | null
          presentation_sent_date?: string | null
          priority_id?: string | null
          proposal_sent_date?: string | null
          proposal_value?: number | null
          qualification_status_id?: string | null
          status?: string | null
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
          pipeline_stage_id?: string | null
          presentation_sent_date?: string | null
          priority_id?: string | null
          proposal_sent_date?: string | null
          proposal_value?: number | null
          qualification_status_id?: string | null
          status?: string | null
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
        ]
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
          probability: number | null
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
          probability?: number | null
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
          probability?: number | null
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
          name: string
          order_position: number
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_position: number
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_position?: number
        }
        Relationships: []
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
          sku: string | null
          supplier: string | null
          unit: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
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
          sku?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
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
          sku?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
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
          total: number
          unit: string
          unit_price: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description: string
          id?: string
          product_id?: string | null
          quantity: number
          quote_id: string
          total: number
          unit: string
          unit_price: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string
          id?: string
          product_id?: string | null
          quantity?: number
          quote_id?: string
          total?: number
          unit?: string
          unit_price?: number
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
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          last_validated_at: string | null
          payment_method: string | null
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
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          last_validated_at?: string | null
          payment_method?: string | null
          recurring?: boolean | null
          recurring_period?: string | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          title: string
          type: string
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
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          last_validated_at?: string | null
          payment_method?: string | null
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
          id: string
          message: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          customer_id?: string | null
          id?: string
          message: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          message?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_customer_data_quality: {
        Args: { customer_id: string }
        Returns: number
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
