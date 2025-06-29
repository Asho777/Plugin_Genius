import { supabase } from '../lib/supabase';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIModel {
  id: string;
  name: string;
  apiEndpoint: string;
  requiresApiKey: boolean;
  systemPrompt: string;
  keyFormat?: string;
  keyExample?: string;
}

// Only use xBesh AI as the single model
export const AI_MODELS: AIModel[] = [
  {
    id: 'xbesh',
    name: 'xBesh AI',
    apiEndpoint: 'https://api.xbesh.ai/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'xbesh-',
    keyExample: 'xbesh-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
];

// Validate API key format
export const validateApiKey = (modelId: string, apiKey: string): { isValid: boolean; error?: string } => {
  if (!apiKey || !apiKey.trim()) {
    return { isValid: false, error: 'API key is required' };
  }

  const model = AI_MODELS.find(m => m.id === modelId);
  if (!model) {
    return { isValid: false, error: 'Unknown AI model' };
  }

  const trimmedKey = apiKey.trim();

  // Check key format for xBesh AI
  if (modelId === 'xbesh') {
    if (trimmedKey.length < 20) {
      return { 
        isValid: false, 
        error: 'xBesh AI API key appears to be too short. Please check your key.' 
      };
    }
  }

  return { isValid: true };
};

// Get API key from user profile
export const getApiKey = async (modelId: string): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('api_key')
    .eq('user_id', user.id)
    .eq('model_id', modelId);
  
  if (error || !data || data.length === 0) return null;
  
  return data[0].api_key;
};

// Save API key to user profile
export const saveApiKey = async (modelId: string, apiKey: string): Promise<{ success: boolean; error?: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: 'User not authenticated' };

  // Validate API key format
  const validation = validateApiKey(modelId, apiKey);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const trimmedKey = apiKey.trim();
  
  // Check if key already exists
  const { data: existingKey } = await supabase
    .from('user_api_keys')
    .select('id')
    .eq('user_id', user.id)
    .eq('model_id', modelId)
    .single();
  
  if (existingKey) {
    // Update existing key
    const { error } = await supabase
      .from('user_api_keys')
      .update({ api_key: trimmedKey })
      .eq('id', existingKey.id);
    
    return { success: !error, error: error?.message };
  } else {
    // Insert new key
    const { error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        model_id: modelId,
        api_key: trimmedKey
      });
    
    return { success: !error, error: error?.message };
  }
};

// Send message to xBesh AI
const sendToXBesh = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    console.log('Sending request to xBesh AI');
    
    const response = await fetch('https://api.xbesh.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'xbesh-1',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('xBesh AI API error response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid xBesh AI API key. Please check your API key in Settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for xBesh AI. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('xBesh AI service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorData.error?.message || `xBesh AI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('xBesh AI API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to xBesh AI. Please check your internet connection.');
    }
    throw error;
  }
};

// Send message to AI model (only xBesh AI now)
export const sendMessage = async (modelId: string, messages: Message[]): Promise<string> => {
  const apiKey = await getApiKey(modelId);
  
  if (!apiKey) {
    const modelName = AI_MODELS.find(m => m.id === modelId)?.name || modelId;
    throw new Error(`${modelName} API key not found. Please add your API key in Settings.`);
  }
  
  // Validate API key format
  const validation = validateApiKey(modelId, apiKey);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  console.log(`Sending message to model: ${modelId}`);
  
  if (modelId === 'xbesh') {
    return sendToXBesh(messages, apiKey);
  } else {
    throw new Error('Unsupported AI model');
  }
};