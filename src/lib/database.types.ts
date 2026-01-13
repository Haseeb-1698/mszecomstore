// Database types generated from Supabase schema
// This file contains TypeScript types that match your database tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type PlanType = 'shared' | 'dedicated'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed'

// Database Tables
export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          icon_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          icon_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          icon_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          service_id: string
          name: string
          type: PlanType
          duration_months: number
          price: number
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          name: string
          type: PlanType
          duration_months: number
          price: number
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          name?: string
          type?: PlanType
          duration_months?: number
          price?: number
          is_available?: boolean
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          credentials: Json | null
          status: SubscriptionStatus
          started_at: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          credentials?: Json | null
          status?: SubscriptionStatus
          started_at?: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          credentials?: Json | null
          status?: SubscriptionStatus
          started_at?: string
          expires_at?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          amount: number
          payment_status: PaymentStatus
          payment_reference: string | null
          payment_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          amount: number
          payment_status?: PaymentStatus
          payment_reference?: string | null
          payment_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          amount?: number
          payment_status?: PaymentStatus
          payment_reference?: string | null
          payment_data?: Json | null
          created_at?: string
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

// Type helpers for easier access
export type DbService = Database['public']['Tables']['services']['Row']
export type DbServiceInsert = Database['public']['Tables']['services']['Insert']
export type DbServiceUpdate = Database['public']['Tables']['services']['Update']

export type DbPlan = Database['public']['Tables']['plans']['Row']
export type DbPlanInsert = Database['public']['Tables']['plans']['Insert']
export type DbPlanUpdate = Database['public']['Tables']['plans']['Update']

export type DbSubscription = Database['public']['Tables']['subscriptions']['Row']
export type DbSubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type DbSubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export type DbOrder = Database['public']['Tables']['orders']['Row']
export type DbOrderInsert = Database['public']['Tables']['orders']['Insert']
export type DbOrderUpdate = Database['public']['Tables']['orders']['Update']
