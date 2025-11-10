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
          data_completeness_percentage: number | null
          data_quality_score: number | null
          email: string | null
          id: string
          last_contact_date: string | null
          last_validated_at: string | null
          lead_source: string | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          segment_id: string | null
          state: string | null
          status: string | null
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
          data_completeness_percentage?: number | null
          data_quality_score?: number | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_source?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          segment_id?: string | null
          state?: string | null
          status?: string | null
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
          data_completeness_percentage?: number | null
          data_quality_score?: number | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          last_validated_at?: string | null
          lead_source?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          segment_id?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          validation_errors?: string[] | null
          website?: string | null
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          actual_revenue: number | null
          assigned_to: string | null
          closed_at: string | null
          created_at: string | null
          customer_id: string
          description: string | null
          expected_revenue: number | null
          id: string
          opportunity_id: string | null
          owner_id: string | null
          stage: string | null
          status: string | null
          title: string
          updated_at: string | null
          value: number
        }
        Insert: {
          actual_revenue?: number | null
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          customer_id: string
          description?: string | null
          expected_revenue?: number | null
          id?: string
          opportunity_id?: string | null
          owner_id?: string | null
          stage?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          value: number
        }
        Update: {
          actual_revenue?: number | null
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string | null
          expected_revenue?: number | null
          id?: string
          opportunity_id?: string | null
          owner_id?: string | null
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
        ]
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
          closed_at: string | null
          created_at: string | null
          customer_id: string
          description: string | null
          expected_close_date: string | null
          id: string
          lost_reason: string | null
          owner_id: string | null
          probability: number | null
          stage: string | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          customer_id: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
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
      pipeline_activities: {
        Row: {
          created_at: string | null
          created_by: string | null
          deal_id: string
          description: string
          id: string
          new_stage: string | null
          opportunity_id: string | null
          previous_stage: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deal_id: string
          description: string
          id?: string
          new_stage?: string | null
          opportunity_id?: string | null
          previous_stage?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deal_id?: string
          description?: string
          id?: string
          new_stage?: string | null
          opportunity_id?: string | null
          previous_stage?: string | null
          type?: string
        }
        Relationships: [
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
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
