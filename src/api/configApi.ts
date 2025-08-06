import { supabase } from '../lib/supabase';

const CONFIG_KEYS = {
  WASSENDER_API_KEY: 'wassender_api_key',
} as const;

export interface ApiConfigResult {
  success: boolean;
  value?: string;
  error?: string;
}

/**
 * Get API configuration value from Supabase
 */
export async function getApiConfig(key: string): Promise<ApiConfigResult> {
  try {
    const { data, error } = await supabase
      .from('ppf_api_config')
      .select('config_value')
      .eq('config_key', key)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      value: data?.config_value || ''
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Set API configuration value in Supabase
 */
export async function setApiConfig(key: string, value: string): Promise<ApiConfigResult> {
  try {
    // First try to update existing record
    const { data: updateData, error: updateError } = await supabase
      .from('ppf_api_config')
      .update({ config_value: value })
      .eq('config_key', key)
      .select()
      .single();

    if (updateError && updateError.code === 'PGRST116') {
      // Record doesn't exist, insert new one
      const { data: insertData, error: insertError } = await supabase
        .from('ppf_api_config')
        .insert({
          config_key: key,
          config_value: value
        })
        .select()
        .single();

      if (insertError) {
        return {
          success: false,
          error: insertError.message
        };
      }

      return {
        success: true,
        value: insertData.config_value
      };
    }

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    return {
      success: true,
      value: updateData.config_value
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get Wassender API key from Supabase
 */
export async function getWassenderApiKey(): Promise<ApiConfigResult> {
  return getApiConfig(CONFIG_KEYS.WASSENDER_API_KEY);
}

/**
 * Set Wassender API key in Supabase
 */
export async function setWassenderApiKey(apiKey: string): Promise<ApiConfigResult> {
  return setApiConfig(CONFIG_KEYS.WASSENDER_API_KEY, apiKey);
}

/**
 * Remove Wassender API key from Supabase
 */
export async function removeWassenderApiKey(): Promise<ApiConfigResult> {
  try {
    const { error } = await supabase
      .from('ppf_api_config')
      .delete()
      .eq('config_key', CONFIG_KEYS.WASSENDER_API_KEY);

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