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
      feedback: {
        Row: {
          created_at: string
          date: string
          email: string | null
          id: string
          is_spam: boolean
          phone: string | null
          rating: number
          sentiment: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          email?: string | null
          id?: string
          is_spam?: boolean
          phone?: string | null
          rating: number
          sentiment: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          email?: string | null
          id?: string
          is_spam?: boolean
          phone?: string | null
          rating?: number
          sentiment?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_fields: {
        Row: {
          created_at: string | null
          field_type: string
          form_id: string
          id: string
          is_required: boolean | null
          label: string
          options: Json | null
          order_index: number
          placeholder: string | null
        }
        Insert: {
          created_at?: string | null
          field_type: string
          form_id: string
          id?: string
          is_required?: boolean | null
          label: string
          options?: Json | null
          order_index?: number
          placeholder?: string | null
        }
        Update: {
          created_at?: string | null
          field_type?: string
          form_id?: string
          id?: string
          is_required?: boolean | null
          label?: string
          options?: Json | null
          order_index?: number
          placeholder?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          form_id: string
          id: string
          ip_address: unknown | null
          is_spam: boolean | null
          sentiment: string | null
          submission_data: Json
          submitted_at: string | null
          user_agent: string | null
        }
        Insert: {
          form_id: string
          id?: string
          ip_address?: unknown | null
          is_spam?: boolean | null
          sentiment?: string | null
          submission_data: Json
          submitted_at?: string | null
          user_agent?: string | null
        }
        Update: {
          form_id?: string
          id?: string
          ip_address?: unknown | null
          is_spam?: boolean | null
          sentiment?: string | null
          submission_data?: Json
          submitted_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          slug: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
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
          bio: string | null
          created_at: string | null
          education: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          work_experience: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          education?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          work_experience?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          education?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          work_experience?: string | null
        }
        Relationships: []
      }
      project_applications: {
        Row: {
          applicant_id: string
          applied_at: string
          id: string
          message: string | null
          project_id: string
          status: string
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          id?: string
          message?: string | null
          project_id: string
          status?: string
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          id?: string
          message?: string | null
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          owner_id: string
          required_skills: string[]
          status: string
          team_size: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          id?: string
          owner_id: string
          required_skills?: string[]
          status?: string
          team_size: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          owner_id?: string
          required_skills?: string[]
          status?: string
          team_size?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_form_slug: {
        Args: Record<PropertyKey, never>
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
