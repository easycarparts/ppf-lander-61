import axios, { AxiosError } from 'axios';
import { CONFIG, getApiKeyFromSupabase } from '../lib/config';

// Message Types
export interface TextMessage {
  to: string;
  text: string;
}

export interface ImageMessage {
  to: string;
  image: {
    url: string;
    caption?: string;
  };
}

export interface MessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount?: number;
}

// Enhanced message sending with retry logic
export async function sendMessageWithRetry(
  payload: TextMessage | ImageMessage,
  retryAttempts: number = 3
): Promise<MessageResult> {
  const apiKey = await getApiKeyFromSupabase();
  
  if (!apiKey) {
    return {
      success: false,
      error: 'API key not found. Please set your Wassender API key.'
    };
  }

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      const response = await axios.post(`${CONFIG.WASSENDER_API_BASE}/send-message`, payload, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });
      
      return {
        success: true,
        messageId: response.data?.id || `msg_${Date.now()}`,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Don't retry on certain errors
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your Wassender API credentials.',
          retryCount: attempt
        };
      }
      
      if (axiosError.response?.status === 429) {
        // Rate limit hit - wait longer before retry
        const waitTime = Math.min(attempt * 30, 300); // Max 5 minutes
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        continue;
      }
      
      if (attempt === retryAttempts) {
        return {
          success: false,
          error: axiosError.response?.data?.message || axiosError.message || 'Unknown error',
          retryCount: attempt
        };
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return {
    success: false,
    error: 'Max retry attempts reached',
    retryCount: retryAttempts
  };
}

// Single message sending (for form submissions)
export async function sendSingleMessage(
  phoneNumber: string,
  messageContent: string
): Promise<MessageResult> {
  const payload = createTextMessage(phoneNumber, messageContent);
  return await sendMessageWithRetry(payload);
}

// Helper functions
export function createTextMessage(to: string, text: string): TextMessage {
  return { to, text };
}

export function createImageMessage(to: string, imageUrl: string, caption?: string): ImageMessage {
  return {
    to,
    image: { url: imageUrl, caption },
  };
}

export async function checkApiStatus(): Promise<any> {
  const apiKey = await getApiKeyFromSupabase();
  if (!apiKey) {
    throw new Error('API key not found. Please set your Wassender API key.');
  }
  
  try {
    const response = await axios.get(`${CONFIG.WASSENDER_API_BASE}/status`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking API status:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function sendMessage(payload: TextMessage | ImageMessage): Promise<any> {
  const result = await sendMessageWithRetry(payload);
  if (!result.success) {
    throw new Error(result.error);
  }
  return { id: result.messageId };
} 