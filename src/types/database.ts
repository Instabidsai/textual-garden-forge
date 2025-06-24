export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          slack_user_id: string | null
          display_name: string | null
          real_name: string | null
          email: string | null
          avatar_url: string | null
          slack_team_id: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          slack_user_id?: string | null
          display_name?: string | null
          real_name?: string | null
          email?: string | null
          avatar_url?: string | null
          slack_team_id?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slack_user_id?: string | null
          display_name?: string | null
          real_name?: string | null
          email?: string | null
          avatar_url?: string | null
          slack_team_id?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          title: string
          content: Json | null
          parent_id: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: Json | null
          parent_id?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: Json | null
          parent_id?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      whitelist: {
        Row: {
          id: string
          email: string
          allowed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          allowed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          allowed?: boolean
          created_at?: string
          updated_at?: string
        }
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
  }
}