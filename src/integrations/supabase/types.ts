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
      batches: {
        Row: {
          arrival_date: string
          breed: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          quantity: number
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arrival_date: string
          breed?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          quantity: number
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          arrival_date?: string
          breed?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          quantity?: number
          status?: string | null
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
