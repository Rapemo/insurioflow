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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          role: 'client' | 'admin' | 'agent'
          company_id: string | null
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'client' | 'admin' | 'agent'
          company_id?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'client' | 'admin' | 'agent'
          company_id?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          amount: number
          claim_number: string
          claim_type: string
          created_at: string
          description: string
          employee_id: string
          id: string
          policy_id: string
          resolved_date: string | null
          status: string
          submitted_date: string
          updated_at: string
        }
        Insert: {
          amount?: number
          claim_number: string
          claim_type: string
          created_at?: string
          description: string
          employee_id: string
          id?: string
          policy_id: string
          resolved_date?: string | null
          status?: string
          submitted_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          claim_number?: string
          claim_type?: string
          created_at?: string
          description?: string
          employee_id?: string
          id?: string
          policy_id?: string
          resolved_date?: string | null
          status?: string
          submitted_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          broker_id: string | null
          created_at: string
          id: string
          pay_date: string | null
          percentage: number
          policy_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          broker_id?: string | null
          created_at?: string
          id?: string
          pay_date?: string | null
          percentage?: number
          policy_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          broker_id?: string | null
          created_at?: string
          id?: string
          pay_date?: string | null
          percentage?: number
          policy_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          country: string
          created_at: string
          employee_count: number
          hubspot_id: string | null
          id: string
          industry: string
          name: string
          status: string
          updated_at: string
          workpay_id: string | null
        }
        Insert: {
          country: string
          created_at?: string
          employee_count?: number
          hubspot_id?: string | null
          id?: string
          industry: string
          name: string
          status?: string
          updated_at?: string
          workpay_id?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          employee_count?: number
          hubspot_id?: string | null
          id?: string
          industry?: string
          name?: string
          status?: string
          updated_at?: string
          workpay_id?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          close_date: string | null
          company_id: string
          created_at: string
          hubspot_deal_id: string | null
          id: string
          name: string
          owner: string
          stage: string
          updated_at: string
          value: number
        }
        Insert: {
          close_date?: string | null
          company_id: string
          created_at?: string
          hubspot_deal_id?: string | null
          id?: string
          name: string
          owner: string
          stage?: string
          updated_at?: string
          value?: number
        }
        Update: {
          close_date?: string | null
          company_id?: string
          created_at?: string
          hubspot_deal_id?: string | null
          id?: string
          name?: string
          owner?: string
          stage?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string
          created_at: string
          date_of_birth: string
          department: string
          email: string
          employment_date: string
          first_name: string
          id: string
          last_name: string
          position: string
          salary: number
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          date_of_birth: string
          department: string
          email: string
          employment_date: string
          first_name: string
          id?: string
          last_name: string
          position: string
          salary?: number
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          date_of_birth?: string
          department?: string
          email?: string
          employment_date?: string
          first_name?: string
          id?: string
          last_name?: string
          position?: string
          salary?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          company_id: string
          covered_employees: number
          created_at: string
          end_date: string
          id: string
          policy_number: string
          premium: number
          product_type: string
          provider_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          covered_employees?: number
          created_at?: string
          end_date: string
          id?: string
          policy_number: string
          premium?: number
          product_type: string
          provider_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          covered_employees?: number
          created_at?: string
          end_date?: string
          id?: string
          policy_number?: string
          premium?: number
          product_type?: string
          provider_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          api_enabled: boolean | null
          contact_email: string | null
          country: string
          created_at: string
          id: string
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          api_enabled?: boolean | null
          contact_email?: string | null
          country: string
          created_at?: string
          id?: string
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          api_enabled?: boolean | null
          contact_email?: string | null
          country?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          company_id: string
          created_at: string
          employee_count: number
          id: string
          premium: number
          product_type: string
          provider_id: string | null
          quote_number: string
          status: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_count?: number
          id?: string
          premium?: number
          product_type: string
          provider_id?: string | null
          quote_number: string
          status?: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_count?: number
          id?: string
          premium?: number
          product_type?: string
          provider_id?: string | null
          quote_number?: string
          status?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      renewals: {
        Row: {
          created_at: string
          id: string
          new_premium: number | null
          notes: string | null
          policy_id: string
          renewal_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_premium?: number | null
          notes?: string | null
          policy_id: string
          renewal_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          new_premium?: number | null
          notes?: string | null
          policy_id?: string
          renewal_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewals_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
