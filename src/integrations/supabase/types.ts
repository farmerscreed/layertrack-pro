export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      batch_performance: {
        Row: {
          average_weight: number | null
          batch_id: string
          benchmark_batch_id: string | null
          created_at: string
          feed_conversion_ratio: number | null
          id: string
          industry_standard_fcr: number | null
          industry_standard_mortality: number | null
          industry_standard_production: number | null
          industry_standard_weight: number | null
          mortality_rate: number | null
          production_rate: number | null
          week_number: number
        }
        Insert: {
          average_weight?: number | null
          batch_id: string
          benchmark_batch_id?: string | null
          created_at?: string
          feed_conversion_ratio?: number | null
          id?: string
          industry_standard_fcr?: number | null
          industry_standard_mortality?: number | null
          industry_standard_production?: number | null
          industry_standard_weight?: number | null
          mortality_rate?: number | null
          production_rate?: number | null
          week_number: number
        }
        Update: {
          average_weight?: number | null
          batch_id?: string
          benchmark_batch_id?: string | null
          created_at?: string
          feed_conversion_ratio?: number | null
          id?: string
          industry_standard_fcr?: number | null
          industry_standard_mortality?: number | null
          industry_standard_production?: number | null
          industry_standard_weight?: number | null
          mortality_rate?: number | null
          production_rate?: number | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "batch_performance_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_performance_benchmark_batch_id_fkey"
            columns: ["benchmark_batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          age_at_purchase: number | null
          arrival_date: string
          breed: string | null
          cost_per_bird: number | null
          created_at: string
          id: string
          name: string
          notes: string | null
          quantity: number
          status: string | null
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_at_purchase?: number | null
          arrival_date: string
          breed?: string | null
          cost_per_bird?: number | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          quantity: number
          status?: string | null
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_at_purchase?: number | null
          arrival_date?: string
          breed?: string | null
          cost_per_bird?: number | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          quantity?: number
          status?: string | null
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      egg_production: {
        Row: {
          batch_id: string
          collection_date: string
          created_at: string
          damaged: number | null
          id: string
          notes: string | null
          quantity: number
        }
        Insert: {
          batch_id: string
          collection_date: string
          created_at?: string
          damaged?: number | null
          id?: string
          notes?: string | null
          quantity: number
        }
        Update: {
          batch_id?: string
          collection_date?: string
          created_at?: string
          damaged?: number | null
          id?: string
          notes?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "egg_production_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_schedules: {
        Row: {
          created_at: string
          description: string | null
          employee_id: string
          id: string
          status: string | null
          task_date: string
          task_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_id: string
          id?: string
          status?: string | null
          task_date: string
          task_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_id?: string
          id?: string
          status?: string | null
          task_date?: string
          task_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_settings: {
        Row: {
          address: string | null
          created_at: string
          farm_name: string
          id: string
          registration_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          farm_name: string
          id?: string
          registration_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          farm_name?: string
          id?: string
          registration_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_inventory: {
        Row: {
          cost_per_kg: number | null
          created_at: string
          feed_type: string
          id: string
          notes: string | null
          purchase_date: string
          quantity_kg: number
          supplier: string | null
          user_id: string
        }
        Insert: {
          cost_per_kg?: number | null
          created_at?: string
          feed_type: string
          id?: string
          notes?: string | null
          purchase_date: string
          quantity_kg: number
          supplier?: string | null
          user_id: string
        }
        Update: {
          cost_per_kg?: number | null
          created_at?: string
          feed_type?: string
          id?: string
          notes?: string | null
          purchase_date?: string
          quantity_kg?: number
          supplier?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          batch_id: string
          cost: number | null
          created_at: string
          description: string
          id: string
          notes: string | null
          record_date: string
          record_type: string
        }
        Insert: {
          batch_id: string
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          record_date: string
          record_type: string
        }
        Update: {
          batch_id?: string
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          record_date?: string
          record_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_alerts: {
        Row: {
          created_at: string
          current_quantity: number
          id: string
          item_type: string
          status: string | null
          threshold_quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_quantity: number
          id?: string
          item_type: string
          status?: string | null
          threshold_quantity: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_quantity?: number
          id?: string
          item_type?: string
          status?: string | null
          threshold_quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          currency_preference: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          mobile_alerts: boolean | null
          push_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          currency_preference?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          mobile_alerts?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          currency_preference?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          mobile_alerts?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          feed_inventory_id: string | null
          id: string
          payment_method: string | null
          quantity: number | null
          type: string
          unit_cost: number | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          feed_inventory_id?: string | null
          id?: string
          payment_method?: string | null
          quantity?: number | null
          type: string
          unit_cost?: number | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          feed_inventory_id?: string | null
          id?: string
          payment_method?: string | null
          quantity?: number | null
          type?: string
          unit_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_feed_inventory_id_fkey"
            columns: ["feed_inventory_id"]
            isOneToOne: false
            referencedRelation: "feed_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccination_schedules: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          notes: string | null
          scheduled_date: string
          status: string | null
          vaccine_name: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date: string
          status?: string | null
          vaccine_name: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string
          status?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_schedules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
