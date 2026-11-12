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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_user_connections: {
        Row: {
          connection_key_ciphertext: string
          connector_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_key_ciphertext: string
          connector_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_key_ciphertext?: string
          connector_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      github_webhook_deliveries: {
        Row: {
          delivery_id: string
          error_message: string | null
          event_name: string
          id: string
          received_at: string
          status: string
        }
        Insert: {
          delivery_id: string
          error_message?: string | null
          event_name: string
          id?: string
          received_at?: string
          status?: string
        }
        Update: {
          delivery_id?: string
          error_message?: string | null
          event_name?: string
          id?: string
          received_at?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pull_requests: {
        Row: {
          additions: number | null
          ai_review_comments: Json
          ai_risk_integration: number | null
          ai_risk_logic: number | null
          ai_risk_regression: number | null
          ai_summary: string | null
          ai_verdict: string | null
          ai_verdict_message: string | null
          analysis_error: string | null
          analysis_status: string
          author: string | null
          base_branch: string | null
          branch: string | null
          changed_files: Json
          created_at: string
          deletions: number | null
          files_changed: number | null
          github_html_url: string | null
          github_pr_number: number | null
          github_state: string
          head_sha: string | null
          id: string
          last_analyzed_at: string | null
          repo_id: string
          risk_score: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          additions?: number | null
          ai_review_comments?: Json
          ai_risk_integration?: number | null
          ai_risk_logic?: number | null
          ai_risk_regression?: number | null
          ai_summary?: string | null
          ai_verdict?: string | null
          ai_verdict_message?: string | null
          analysis_error?: string | null
          analysis_status?: string
          author?: string | null
          base_branch?: string | null
          branch?: string | null
          changed_files?: Json
          created_at?: string
          deletions?: number | null
          files_changed?: number | null
          github_html_url?: string | null
          github_pr_number?: number | null
          github_state?: string
          head_sha?: string | null
          id?: string
          last_analyzed_at?: string | null
          repo_id: string
          risk_score?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          additions?: number | null
          ai_review_comments?: Json
          ai_risk_integration?: number | null
          ai_risk_logic?: number | null
          ai_risk_regression?: number | null
          ai_summary?: string | null
          ai_verdict?: string | null
          ai_verdict_message?: string | null
          analysis_error?: string | null
          analysis_status?: string
          author?: string | null
          base_branch?: string | null
          branch?: string | null
          changed_files?: Json
          created_at?: string
          deletions?: number | null
          files_changed?: number | null
          github_html_url?: string | null
          github_pr_number?: number | null
          github_state?: string
          head_sha?: string | null
          id?: string
          last_analyzed_at?: string | null
          repo_id?: string
          risk_score?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pull_requests_repo_id_fkey"
            columns: ["repo_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      repositories: {
        Row: {
          created_at: string
          default_branch: string
          description: string | null
          github_owner: string | null
          github_repo: string | null
          github_repo_id: number | null
          github_url: string
          id: string
          is_private: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_branch?: string
          description?: string | null
          github_owner?: string | null
          github_repo?: string | null
          github_repo_id?: number | null
          github_url: string
          id?: string
          is_private?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_branch?: string
          description?: string | null
          github_owner?: string | null
          github_repo?: string | null
          github_repo_id?: number | null
          github_url?: string
          id?: string
          is_private?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_suggestions: {
        Row: {
          completed: boolean
          created_at: string
          description: string
          id: string
          pr_id: string
          priority: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description: string
          id?: string
          pr_id: string
          priority?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string
          id?: string
          pr_id?: string
          priority?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_suggestions_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "pull_requests"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
