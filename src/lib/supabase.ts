import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface PPFLead {
  id: string
  whatsapp_number: string
  created_at: string
  updated_at: string
}

export interface PPFMessageTemplate {
  id: string
  content: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface PPFApiConfig {
  id: string
  config_key: string
  config_value: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      ppf_leads: {
        Row: PPFLead
        Insert: Omit<PPFLead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PPFLead, 'id' | 'created_at'>>
      }
      ppf_message_templates: {
        Row: PPFMessageTemplate
        Insert: Omit<PPFMessageTemplate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PPFMessageTemplate, 'id' | 'created_at'>>
      }
      ppf_api_config: {
        Row: PPFApiConfig
        Insert: Omit<PPFApiConfig, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PPFApiConfig, 'id' | 'created_at'>>
      }
    }
    Views: {
      ppf_lead_stats: {
        Row: {
          total_leads: number
          leads_24h: number
          leads_7d: number
          leads_30d: number
        }
      }
    }
    Functions: {
      get_ppf_leads_with_filters: {
        Args: {
          search_term?: string
          date_from?: string
          date_to?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: Array<{
          id: string
          whatsapp_number: string
          created_at: string
          total_count: number
        }>
      }
    }
  }
} 