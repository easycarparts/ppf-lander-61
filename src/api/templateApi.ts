import { supabase, PPFMessageTemplate } from '../lib/supabase';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class TemplateApiService {
  /**
   * Get the active message template
   */
  static async getActiveTemplate(): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase
        .from('ppf_message_templates')
        .select('content')
        .eq('is_active', true)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data?.content || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Save a new message template
   */
  static async saveTemplate(templateContent: string): Promise<ApiResponse<PPFMessageTemplate>> {
    try {
      // First, deactivate all existing templates
      const { error: deactivateError } = await supabase
        .from('ppf_message_templates')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) {
        return {
          success: false,
          error: deactivateError.message
        };
      }

      // Then, create the new active template
      const { data, error } = await supabase
        .from('ppf_message_templates')
        .insert({
          content: templateContent,
          is_active: true
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
   * Initialize default template if none exists
   */
  static async initializeDefaultTemplate(): Promise<ApiResponse<PPFMessageTemplate>> {
    try {
      // Check if any active template exists
      const { data: existingTemplate, error: checkError } = await supabase
        .from('ppf_message_templates')
        .select('id')
        .eq('is_active', true)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        return {
          success: false,
          error: checkError.message
        };
      }

      // If no active template exists, create default
      if (!existingTemplate) {
        const defaultTemplate = `🚗 *Paint Protection Film Quote Request*

Thank you for your interest in our premium PPF services!

Your phone number: {whatsapp_number}

Our team of certified PPF specialists will contact you within 5 minutes with:
• Professional vehicle assessment
• Custom PPF package options
• Competitive pricing
• Flexible scheduling

We look forward to protecting your vehicle! 🛡️

---
*EasyAuto Dubai - PPF Specialists*`;

        return await this.saveTemplate(defaultTemplate);
      }

      return {
        success: true,
        data: existingTemplate as any
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get all templates (for admin view)
   */
  static async getAllTemplates(): Promise<ApiResponse<PPFMessageTemplate[]>> {
    try {
      const { data, error } = await supabase
        .from('ppf_message_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete a template
   */
  static async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('ppf_message_templates')
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
} 