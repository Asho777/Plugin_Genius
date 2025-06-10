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
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.'
  },
  {
    id: 'gpt-4-1',
    name: 'GPT-4.1',
    apiEndpoint: 'https://models.github.ai/inference',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.'
  },
  {
    id: 'claude',
    name: 'Claude',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.'
  },
  {
    id: 'llama',
    name: 'Llama 3',
    apiEndpoint: 'https://api.together.xyz/v1/completions',
    requiresApiKey: true,
    systemPrompt: 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins. Provide code examples, best practices, and explain WordPress-specific concepts when needed.'
  }
];

// Get API key from user profile
export const getApiKey = async (modelId: string): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('api_key')
    .eq('user_id', user.id)
    .eq('model_id', modelId)
    .single();
  
  if (error || !data) return null;
  
  return data.api_key;
};

// Save API key to user profile
export const saveApiKey = async (modelId: string, apiKey: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
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
      .update({ api_key: apiKey })
      .eq('id', existingKey.id);
    
    return !error;
  } else {
    // Insert new key
    const { error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        model_id: modelId,
        api_key: apiKey
      });
    
    return !error;
  }
};

// Send message to OpenAI (GPT-4/GPT-4o)
const sendToOpenAI = async (messages: Message[], apiKey: string, modelName: string = 'gpt-4'): Promise<string> => {
  try {
    console.log(`Sending request to OpenAI with model: ${modelName}`);
    
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
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(errorData.error?.message || `Error communicating with OpenAI: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

// Send message to GitHub AI (GPT-4.1)
const sendToGitHubAI = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    console.log('Sending request to GitHub AI with model: gpt-4.1');
    
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
      const errorData = await response.json();
      console.error('GitHub AI API error response:', errorData);
      throw new Error(errorData.error?.message || `Error communicating with GitHub AI: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('GitHub AI API error:', error);
    throw error;
  }
};

// Send message to Anthropic (Claude)
const sendToAnthropic = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
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
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error communicating with Anthropic');
    }
    
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
};

// Send message to Google (Gemini)
const sendToGemini = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
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
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error communicating with Gemini');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

// Send message to Together AI (Llama 3)
const sendToLlama = async (messages: Message[], apiKey: string): Promise<string> => {
  try {
    // Convert messages to Llama format
    let prompt = '';
    
    // Add system prompt
    const systemPrompt = messages.find(m => m.role === 'system')?.content;
    if (systemPrompt) {
      prompt += `<|system|>\n${systemPrompt}\n`;
    }
    
    // Add conversation
    for (const message of messages.filter(m => m.role !== 'system')) {
      const role = message.role === 'assistant' ? 'assistant' : 'user';
      prompt += `<|${role}|>\n${message.content}\n`;
    }
    
    // Add final assistant prompt
    prompt += '<|assistant|>\n';
    
    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-chat-hf',
        prompt,
        max_tokens: 2000,
        temperature: 0.7,
        stop: ['<|user|>', '<|system|>']
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error communicating with Together AI');
    }
    
    return data.choices[0].text;
  } catch (error) {
    console.error('Together AI API error:', error);
    throw error;
  }
};

// Send message to AI model
export const sendMessage = async (modelId: string, messages: Message[]): Promise<string> => {
  const apiKey = await getApiKey(modelId);
  
  if (!apiKey) {
    throw new Error('API key not found. Please add your API key in settings.');
  }
  
  console.log(`Sending message to model: ${modelId}`);
  
  switch (modelId) {
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
