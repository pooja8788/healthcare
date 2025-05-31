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
      activity_logs: {
        Row: {
          action: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          timestamp: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          timestamp?: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          timestamp?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      bins: {
        Row: {
          capacity: number
          created_at: string
          current_level: number
          id: string
          last_updated: string
          location: string
          status: string
          threshold: number
          waste_type: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          current_level?: number
          id?: string
          last_updated?: string
          location: string
          status?: string
          threshold?: number
          waste_type: string
        }
        Update: {
          capacity?: number
          created_at?: string
          current_level?: number
          id?: string
          last_updated?: string
          location?: string
          status?: string
          threshold?: number
          waste_type?: string
        }
        Relationships: []
      }
      daily_reports: {
        Row: {
          completed_pickups: number
          compliance_score: number
          date: string
          generated_at: string
          id: string
          pending_pickups: number
          total_waste: number
          waste_by_type: Json
        }
        Insert: {
          completed_pickups?: number
          compliance_score?: number
          date: string
          generated_at?: string
          id?: string
          pending_pickups?: number
          total_waste?: number
          waste_by_type?: Json
        }
        Update: {
          completed_pickups?: number
          compliance_score?: number
          date?: string
          generated_at?: string
          id?: string
          pending_pickups?: number
          total_waste?: number
          waste_by_type?: Json
        }
        Relationships: []
      }
      pickup_requests: {
        Row: {
          bin_id: string
          completed_at: string | null
          disposal_photos: string[] | null
          handler_id: string | null
          handler_name: string | null
          id: string
          location: string
          notes: string | null
          requested_at: string
          status: string
          waste_type: string
        }
        Insert: {
          bin_id: string
          completed_at?: string | null
          disposal_photos?: string[] | null
          handler_id?: string | null
          handler_name?: string | null
          id?: string
          location: string
          notes?: string | null
          requested_at?: string
          status?: string
          waste_type: string
        }
        Update: {
          bin_id?: string
          completed_at?: string | null
          disposal_photos?: string[] | null
          handler_id?: string | null
          handler_name?: string | null
          id?: string
          location?: string
          notes?: string | null
          requested_at?: string
          status?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "bins"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          facility: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          facility?: string
          id: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          facility?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          answers: number[] | null
          completed_at: string
          id: string
          score: number
          staff_id: string
          total_questions: number
        }
        Insert: {
          answers?: number[] | null
          completed_at?: string
          id?: string
          score: number
          staff_id: string
          total_questions: number
        }
        Update: {
          answers?: number[] | null
          completed_at?: string
          id?: string
          score?: number
          staff_id?: string
          total_questions?: number
        }
        Relationships: []
      }
      waste_entries: {
        Row: {
          bin_id: string
          description: string | null
          id: string
          location: string
          quantity: number
          staff_id: string
          staff_name: string
          timestamp: string
          unit: string
          waste_type: string
        }
        Insert: {
          bin_id: string
          description?: string | null
          id?: string
          location: string
          quantity: number
          staff_id: string
          staff_name: string
          timestamp?: string
          unit: string
          waste_type: string
        }
        Update: {
          bin_id?: string
          description?: string | null
          id?: string
          location?: string
          quantity?: number
          staff_id?: string
          staff_name?: string
          timestamp?: string
          unit?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "waste_entries_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "bins"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_activity: {
        Args: {
          p_user_id?: string
          p_user_name?: string
          p_action?: string
          p_entity_type?: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
