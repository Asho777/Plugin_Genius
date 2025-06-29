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

export const AI_MODELS: AIModel[] = [
  {
    id: 'xbesh',
    name: 'xBesh AI',
    apiEndpoint: 'https://api.xbesh.ai/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'xbesh-',
    keyExample: 'xbesh-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'sk-',
    keyExample: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'sk-',
    keyExample: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'gpt-4-1',
    name: 'GPT-4.1',
    apiEndpoint: 'https://models.github.ai/inference',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'ghp_',
    keyExample: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'claude',
    name: 'Claude',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'sk-ant-',
    keyExample: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'AIza',
    keyExample: 'AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  {
    id: 'llama',
    name: 'Llama 3',
    apiEndpoint: 'https://api.together.xyz/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.',
    keyFormat: 'together-',
    keyExample: 'together-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
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

  // Check key format based on model
  switch (modelId) {
    case 'gpt-4':
    case 'gpt-4o':
      if (!trimmedKey.startsWith('sk-')) {
        return { 
          isValid: false, 
          error: 'OpenAI API keys must start with "sk-". Make sure you\'re using an OpenAI API key, not a GitHub token.' 
        };
      }
      if (trimmedKey.length < 40) {
        return { 
          isValid: false, 
          error: 'OpenAI API key appears to be too short. Please check your key.' 
        };
      }
      break;
    
    case 'gpt-4-1':
      if (!trimmedKey.startsWith('ghp_')) {
        return { 
          isValid: false, 
          error: 'GitHub AI API keys must start with "ghp_".' 
        };
      }
      break;
    
    case 'claude':
      if (!trimmedKey.startsWith('sk-ant-')) {
        return { 
          isValid: false, 
          error: 'Anthropic API keys must start with "sk-ant-".' 
        };
      }
      break;
    
    case 'gemini':
      if (!trimmedKey.startsWith('AIza')) {
        return { 
          isValid: false, 
          error: 'Google AI API keys must start with "AIza".' 
        };
      }
      break;
    
    case 'llama':
      if (trimmedKey.length < 20) {
        return { 
          isValid: false, 
          error: 'Together AI API key appears to be too short. Please check your key.' 
        };
      }
      break;
    
    case 'xbesh':
      if (trimmedKey.length < 20) {
        return { 
          isValid: false, 
          error: 'xBesh AI API key appears to be too short. Please check your key.' 
        };
      }
      break;
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

// Send message to OpenAI (GPT-4/GPT-4o)
const sendToOpenAI = async (messages: Message[], apiKey: string, modelName: string = 'gpt-4'): Promise<string> => {
  try {
    console.log(`Sending request to OpenAI with model: ${modelName}`);
    
    // Validate API key format before making request
    if (!apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format. OpenAI keys must start with "sk-". Please check your API key in Settings.');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key in Settings and ensure it starts with "sk-".');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for OpenAI. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenAI. Please check your internet connection.');
    }
    throw error;
  }
};

// Send message to GitHub AI (GPT-4.1)
const sendToGitHubAI = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    console.log('Sending request to GitHub AI with model: gpt-4.1');
    
    // Validate API key format before making request
    if (!apiKey.startsWith('ghp_')) {
      throw new Error('Invalid GitHub AI API key format. GitHub tokens must start with "ghp_". Please check your API key in Settings.');
    }
    
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub AI API error response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid GitHub AI API key. Please check your GitHub Personal Access Token in Settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for GitHub AI. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('GitHub AI service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorData.error?.message || `GitHub AI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('GitHub AI API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to GitHub AI. Please check your internet connection.');
    }
    throw error;
  }
};

// Send message to Anthropic (Claude)
const sendToAnthropic = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    // Validate API key format before making request
    if (!apiKey.startsWith('sk-ant-')) {
      throw new Error('Invalid Anthropic API key format. Anthropic keys must start with "sk-ant-". Please check your API key in Settings.');
    }
    
    // Convert messages to Anthropic format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const anthropicMessages = userMessages.map(m => ({
      role: m.role,
      content: m.content
    }));
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        system: systemPrompt,
        messages: anthropicMessages,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API error response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid Anthropic API key. Please check your API key in Settings and ensure it starts with "sk-ant-".');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for Anthropic. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Anthropic service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorData.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Anthropic. Please check your internet connection.');
    }
    throw error;
  }
};

// Send message to Google (Gemini)
const sendToGemini = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    // Validate API key format before making request
    if (!apiKey.startsWith('AIza')) {
      throw new Error('Invalid Google AI API key format. Google AI keys must start with "AIza". Please check your API key in Settings.');
    }
    
    // Convert messages to Gemini format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const geminiMessages = userMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    // Add system prompt as a prefix to the first user message if it exists
    if (systemPrompt && geminiMessages.length > 0 && geminiMessages[0].role === 'user') {
      geminiMessages[0].parts[0].text = `${systemPrompt}\n\n${geminiMessages[0].parts[0].text}`;
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error response:', errorData);
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid Google AI API key. Please check your API key in Settings and ensure it starts with "AIza".');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for Google AI. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Google AI service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorData.error?.message || `Google AI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Google AI. Please check your internet connection.');
    }
    throw error;
  }
};

// Send message to Together AI (Llama 3)
const sendToLlama = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    console.log('Sending request to Together AI with model: Llama 3');
    
    // Convert messages to the format expected by Together AI
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Use the chat completions endpoint for Llama 3
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Together AI API error response:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid Together AI API key. Please check your API key in Settings. You can find your key at https://api.together.xyz/settings/api-keys.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded for Together AI. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Together AI service is temporarily unavailable. Please try again later.');
      }
      
      throw new Error(errorData.error?.message || `Together AI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Together AI response:', data);
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Together AI API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Together AI. Please check your internet connection.');
    }
    throw error;
  }
};

// Send message to AI model
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
  
  switch (modelId) {
    case 'xbesh':
      return sendToXBesh(messages, apiKey);
    case 'gpt-4':
      return sendToOpenAI(messages, apiKey, 'gpt-4');
    case 'gpt-4o':
      return sendToOpenAI(messages, apiKey, 'gpt-4o');
    case 'gpt-4-1':
      return sendToGitHubAI(messages, apiKey);
    case 'claude':
      return sendToAnthropic(messages, apiKey);
    case 'gemini':
      return sendToGemini(messages, apiKey);
    case 'llama':
      return sendToLlama(messages, apiKey);
    default:
      throw new Error('Unsupported AI model');
  }
};