import { supabase, PPFLead } from '../lib/supabase';

export interface PPFLeadStats {
  total_leads: number;
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
}

export interface PPFLeadFilters {
  search_term?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

export class PPFLeadApiService {
  /**
   * Create a new PPF lead
   */
  static async createLead(whatsappNumber: string): Promise<ApiResponse<PPFLead>> {
    try {
      const { data, error } = await supabase
        .from('ppf_leads')
        .insert({
          whatsapp_number: whatsappNumber
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get PPF leads with optional filtering
   */
  static async getLeads(filters: PPFLeadFilters = {}): Promise<ApiResponse<PPFLead[]>> {
    try {
      let query = supabase
        .from('ppf_leads')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (filters.search_term) {
        query = query.ilike('whatsapp_number', `%${filters.search_term}%`);
      }

      // Apply date filters
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1);
      }

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get PPF lead statistics
   */
  static async getLeadStats(): Promise<ApiResponse<PPFLeadStats>> {
    try {
      const { data, error } = await supabase
        .from('ppf_lead_stats')
        .select('*')
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete a PPF lead
   */
  static async deleteLead(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('ppf_leads')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test database connection and policies
   */
  static async testPolicies(): Promise<ApiResponse<any>> {
    try {
      // Test insert
      const testLead = await this.createLead('+971501234567');
      
      if (!testLead.success) {
        return {
          success: false,
          error: `Insert test failed: ${testLead.error}`
        };
      }

      // Test select
      const leads = await this.getLeads({ limit: 1 });
      
      if (!leads.success) {
        return {
          success: false,
          error: `Select test failed: ${leads.error}`
        };
      }

      // Clean up test data
      if (testLead.data) {
        await this.deleteLead(testLead.data.id);
      }

      return {
        success: true,
        data: {
          message: 'All database policies working correctly',
          testLead: testLead.data,
          leadsCount: leads.data?.length || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 