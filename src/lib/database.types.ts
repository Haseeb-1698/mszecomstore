// Database types generated from Supabase schema
// This file contains TypeScript types that match your database tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type PlanType = 'shared' | 'dedicated'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered'
export type ServiceCategory = 'streaming' | 'professional' | 'vpn' | 'gaming' | 'education' | 'music' | 'productivity' | 'other'
export type UserRole = 'customer' | 'admin'
export type ServiceBadge = 'popular' | 'best_value' | null

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          whatsapp: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          whatsapp?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          description: string | null
          long_description: string | null
          icon_url: string | null
          badge: ServiceBadge
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          category: string
          description?: string | null
          long_description?: string | null
          icon_url?: string | null
          badge?: ServiceBadge
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          description?: string | null
          long_description?: string | null
          icon_url?: string | null
          badge?: ServiceBadge
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
          original_price: number | null
          savings: number | null
          features: Json
          is_popular: boolean
          display_order: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_id: string
          name: string
          type: PlanType
          duration_months: number
          price: number
          original_price?: number | null
          savings?: number | null
          features?: Json
          is_popular?: boolean
          display_order?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          name?: string
          type?: PlanType
          duration_months?: number
          price?: number
          original_price?: number | null
          savings?: number | null
          features?: Json
          is_popular?: boolean
          display_order?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          amount: number
          status: OrderStatus
          customer_name: string | null
          customer_email: string | null
          customer_whatsapp: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
          delivered_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          amount: number
          status?: OrderStatus
          customer_name?: string | null
          customer_email?: string | null
          customer_whatsapp?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
          delivered_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          amount?: number
          status?: OrderStatus
          customer_name?: string | null
          customer_email?: string | null
          customer_whatsapp?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
          delivered_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          plan_id: string
          service_name: string
          plan_name: string
          duration_months: number
          price: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          plan_id: string
          service_name: string
          plan_name: string
          duration_months: number
          price: number
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          plan_id?: string
          service_name?: string
          plan_name?: string
          duration_months?: number
          price?: number
          quantity?: number
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          order_id: string | null
          credentials: Json | null
          status: SubscriptionStatus
          auto_renew: boolean
          notes: string | null
          started_at: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          order_id?: string | null
          credentials?: Json | null
          status?: SubscriptionStatus
          auto_renew?: boolean
          notes?: string | null
          started_at?: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          order_id?: string | null
          credentials?: Json | null
          status?: SubscriptionStatus
          auto_renew?: boolean
          notes?: string | null
          started_at?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      services_with_plans: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          description: string | null
          long_description: string | null
          icon_url: string | null
          badge: ServiceBadge
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          plans: Json
        }
      }
      order_details: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          amount: number
          status: OrderStatus
          customer_name: string | null
          customer_email: string | null
          customer_whatsapp: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
          delivered_at: string | null
          items: Json
          profile_name: string | null
          profile_whatsapp: string | null
        }
      }
    }
    Functions: {
      get_admin_dashboard_stats: {
        Args: Record<string, never>
        Returns: {
          total_revenue: number
          pending_orders: number
          active_customers: number
          delivered_today: number
        }[]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      order_status: OrderStatus
      service_category: ServiceCategory
    }
  }
}

// ============================================================================
// TYPE HELPERS FOR EASIER ACCESS
// ============================================================================

// User Profiles
export type DbUserProfile = Database['public']['Tables']['user_profiles']['Row']
export type DbUserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type DbUserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

// Services
export type DbService = Database['public']['Tables']['services']['Row']
export type DbServiceInsert = Database['public']['Tables']['services']['Insert']
export type DbServiceUpdate = Database['public']['Tables']['services']['Update']

// Plans
export type DbPlan = Database['public']['Tables']['plans']['Row']
export type DbPlanInsert = Database['public']['Tables']['plans']['Insert']
export type DbPlanUpdate = Database['public']['Tables']['plans']['Update']

// Orders
export type DbOrder = Database['public']['Tables']['orders']['Row']
export type DbOrderInsert = Database['public']['Tables']['orders']['Insert']
export type DbOrderUpdate = Database['public']['Tables']['orders']['Update']

// Order Items
export type DbOrderItem = Database['public']['Tables']['order_items']['Row']
export type DbOrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type DbOrderItemUpdate = Database['public']['Tables']['order_items']['Update']

// Subscriptions
export type DbSubscription = Database['public']['Tables']['subscriptions']['Row']
export type DbSubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type DbSubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

// Views
export type DbServiceWithPlans = Database['public']['Views']['services_with_plans']['Row']
export type DbOrderDetails = Database['public']['Views']['order_details']['Row']

// Dashboard Stats (from function)
export type DbAdminDashboardStats = Database['public']['Functions']['get_admin_dashboard_stats']['Returns'][0]

// ============================================================================
// EXTENDED TYPES WITH RELATIONS
// ============================================================================

export interface ServiceWithPlans extends DbService {
  plans: DbPlan[]
}

export interface OrderWithItems extends DbOrder {
  items: DbOrderItem[]
}

export interface PlanFeatures {
  features: string[]
}
