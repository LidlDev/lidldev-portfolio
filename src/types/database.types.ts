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
      detected_bills: {
        Row: {
          id: string
          created_at: string
          title: string
          amount: number
          due_date: string
          category: string
          confidence: number
          source: string
          approved: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          amount: number
          due_date: string
          category: string
          confidence: number
          source: string
          approved?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          amount?: number
          due_date?: string
          category?: string
          confidence?: number
          source?: string
          approved?: boolean
          user_id?: string
        }
      }
      email_auth: {
        Row: {
          id: string
          created_at: string
          user_id: string
          provider: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          provider: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          provider?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          completed: boolean
          due_date: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          completed?: boolean
          due_date?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          completed?: boolean
          due_date?: string | null
          user_id?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          created_at: string
          title: string
          target: number
          current: number
          target_date: string | null
          color: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          target: number
          current: number
          target_date?: string | null
          color?: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          target?: number
          current?: number
          target_date?: string | null
          color?: string
          user_id?: string
        }
      }
      expenses: {
        Row: {
          id: string
          created_at: string
          category: string
          amount: number
          date: string
          user_id: string
          payment_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          category: string
          amount: number
          date: string
          user_id: string
          payment_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          category?: string
          amount?: number
          date?: string
          user_id?: string
          payment_id?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          title: string
          amount: number
          due_date: string
          recurring: boolean
          category: string
          paid: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          amount: number
          due_date: string
          recurring?: boolean
          category: string
          paid?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          amount?: number
          due_date?: string
          recurring?: boolean
          category?: string
          paid?: boolean
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          display_name: string | null
          avatar_url: string | null
          email_scan_permission: boolean
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          email_scan_permission?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          email_scan_permission?: boolean
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
