import { getWassenderApiKey, setWassenderApiKey, removeWassenderApiKey } from '../api/configApi';

export const CONFIG = {
  WASSENDER_API_BASE: 'https://wasenderapi.com/api',
  STORAGE_KEYS: {
    API_KEY: 'WASSENDER_API_KEY',
    ADMIN_AUTH: 'ADMIN_AUTHENTICATED',
  },
} as const;

// Legacy localStorage functions for backward compatibility
export function getApiKey(): string | null {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);
}

export function setApiKey(apiKey: string): void {
  localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, apiKey);
}

export function removeApiKey(): void {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.API_KEY);
}

// New Supabase-based functions
export async function getApiKeyFromSupabase(): Promise<string | null> {
  try {
    const result = await getWassenderApiKey();
    if (result.success && result.value) {
      return result.value;
    }
    return null;
  } catch (error) {
    console.error('Error getting API key from Supabase:', error);
    // Fallback to localStorage
    return getApiKey();
  }
}

export async function setApiKeyToSupabase(apiKey: string): Promise<boolean> {
  try {
    const result = await setWassenderApiKey(apiKey);
    if (result.success) {
      // Also update localStorage for backward compatibility
      setApiKey(apiKey);
      return true;
    }
    console.error('Failed to save API key to Supabase:', result.error);
    return false;
  } catch (error) {
    console.error('Error saving API key to Supabase:', error);
    // Fallback to localStorage
    setApiKey(apiKey);
    return false;
  }
}

export async function removeApiKeyFromSupabase(): Promise<boolean> {
  try {
    const result = await removeWassenderApiKey();
    if (result.success) {
      // Also remove from localStorage for backward compatibility
      removeApiKey();
      return true;
    }
    console.error('Failed to remove API key from Supabase:', result.error);
    return false;
  } catch (error) {
    console.error('Error removing API key from Supabase:', error);
    // Fallback to localStorage
    removeApiKey();
    return false;
  }
} 