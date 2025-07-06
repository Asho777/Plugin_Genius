import { supabase } from '../lib/supabase';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIModelConfig {
  id: string;
  name: string;
  apiEndpoint: string;
  apiKey: string;
  model: string;
  headers?: Record<string, string>;
  systemPrompt: string;
}

// Professional WordPress Plugin Development System Prompt (Cursor AI-style)
const CURSOR_STYLE_SYSTEM_PROMPT = `You are an expert WordPress plugin developer with 15+ years of experience, specializing in creating professional, production-ready WordPress plugins. You follow WordPress coding standards, security best practices, and modern PHP development patterns.

CORE PRINCIPLES:
- Write clean, maintainable, and well-documented code
- Follow WordPress Coding Standards (WPCS) strictly
- Implement proper security measures (nonces, sanitization, validation)
- Use object-oriented programming with proper namespacing
- Create modular, extensible plugin architecture
- Include comprehensive error handling and logging
- Write code that passes WordPress Plugin Review guidelines

PLUGIN ARCHITECTURE STANDARDS:
- Use proper plugin header with all required fields
- Implement singleton pattern for main plugin class
- Create separate classes for different functionality
- Use WordPress hooks and filters appropriately
- Include proper activation/deactivation hooks
- Implement database schema with proper prefixes
- Create admin interfaces using WordPress standards

SECURITY REQUIREMENTS:
- Always sanitize input data
- Validate and escape output
- Use WordPress nonces for form submissions
- Implement proper capability checks
- Prevent direct file access
- Use prepared statements for database queries
- Follow principle of least privilege

CODE QUALITY STANDARDS:
- Use meaningful variable and function names
- Add comprehensive PHPDoc comments
- Implement proper error handling
- Include debugging and logging capabilities
- Write testable code with proper separation of concerns
- Use WordPress coding conventions for indentation and formatting

PROFESSIONAL FEATURES TO INCLUDE:
- Settings API integration
- Custom post types and meta boxes when relevant
- REST API endpoints when needed
- Shortcode support with proper attributes
- Widget classes following WordPress standards
- Customizer integration when applicable
- Multisite compatibility considerations
- Internationalization (i18n) support

When generating code:
1. Always start with a complete plugin header
2. Create a main plugin class with proper structure
3. Include activation/deactivation methods
4. Add settings and admin interfaces
5. Implement the core functionality with proper hooks
6. Include security measures throughout
7. Add comprehensive comments and documentation
8. Ensure code follows WordPress Plugin Directory guidelines

Generate production-ready code that could be submitted to the WordPress Plugin Directory without modifications.`;

// Default AI model configuration with correct OpenAI model name
export const DEFAULT_AI_MODEL: Omit<AIModelConfig, 'apiKey'> = {
  id: 'cursor-ai-style',
  name: 'Professional WordPress AI',
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4', // Fixed: Use proper OpenAI model name
  headers: {
    'Content-Type': 'application/json'
  },
  systemPrompt: CURSOR_STYLE_SYSTEM_PROMPT
};

// Get AI model configuration from user profile
export const getAIModelConfig = async (): Promise<AIModelConfig | null> => {
  try {
    console.log('Getting AI model configuration...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }
    
    console.log('User found:', user.id);
    
    const { data, error } = await supabase
      .from('user_ai_config')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.log('Error or no AI config found, using default:', error);
      // Return default config with Cursor AI-style prompt
      return {
        ...DEFAULT_AI_MODEL,
        apiKey: '' // Will need to be configured by user
      };
    }
    
    if (!data) {
      console.log('No AI configuration data found, using default');
      return {
        ...DEFAULT_AI_MODEL,
        apiKey: ''
      };
    }
    
    console.log('AI configuration retrieved:', data);
    
    return {
      id: data.id,
      name: data.name,
      apiEndpoint: data.api_endpoint,
      apiKey: data.api_key,
      model: data.model,
      headers: data.headers ? JSON.parse(data.headers) : DEFAULT_AI_MODEL.headers,
      systemPrompt: data.system_prompt || CURSOR_STYLE_SYSTEM_PROMPT // Fallback to Cursor-style prompt
    };
  } catch (error) {
    console.error('Exception in getAIModelConfig:', error);
    return {
      ...DEFAULT_AI_MODEL,
      apiKey: ''
    };
  }
};

// Save AI model configuration to user profile
export const saveAIModelConfig = async (config: AIModelConfig): Promise<boolean> => {
  try {
    console.log('Saving AI model configuration...', config);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user for save:', userError);
      return false;
    }
    
    if (!user) {
      console.error('No authenticated user found for save');
      return false;
    }
    
    console.log('User found for save:', user.id);
    
    // Check if config already exists
    console.log('Checking for existing AI config...');
    const { data: existingConfig, error: selectError } = await supabase
      .from('user_ai_config')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing config:', selectError);
      return false;
    }
    
    console.log('Existing config check result:', existingConfig);
    
    const configData = {
      user_id: user.id,
      name: config.name,
      api_endpoint: config.apiEndpoint,
      api_key: config.apiKey,
      model: config.model,
      headers: config.headers ? JSON.stringify(config.headers) : null,
      system_prompt: config.systemPrompt,
      updated_at: new Date().toISOString()
    };
    
    console.log('Config data to save:', { ...configData, api_key: '[REDACTED]' });
    
    if (existingConfig) {
      console.log('Updating existing config with ID:', existingConfig.id);
      
      // Update existing config
      const { data: updateData, error: updateError } = await supabase
        .from('user_ai_config')
        .update(configData)
        .eq('id', existingConfig.id)
        .select();
      
      if (updateError) {
        console.error('Error updating AI config:', updateError);
        return false;
      }
      
      console.log('AI config updated successfully:', updateData);
      return true;
    } else {
      console.log('Inserting new AI config...');
      
      // Insert new config
      const { data: insertData, error: insertError } = await supabase
        .from('user_ai_config')
        .insert({
          ...configData,
          created_at: new Date().toISOString()
        })
        .select();
      
      if (insertError) {
        console.error('Error inserting AI config:', insertError);
        return false;
      }
      
      console.log('AI config inserted successfully:', insertData);
      return true;
    }
  } catch (error) {
    console.error('Exception in saveAIModelConfig:', error);
    return false;
  }
};

// Enhanced message processing for WordPress plugin development
const enhanceMessagesForWordPress = (messages: Message[], pluginContext?: string): Message[] => {
  const contextualMessages = [...messages];
  
  // Add WordPress development context if not already present
  const hasWordPressContext = messages.some(m => 
    m.content.toLowerCase().includes('wordpress') || 
    m.content.toLowerCase().includes('plugin')
  );
  
  if (!hasWordPressContext && pluginContext) {
    // Insert context message before the last user message
    const lastUserMessageIndex = contextualMessages.map(m => m.role).lastIndexOf('user');
    if (lastUserMessageIndex > -1) {
      contextualMessages.splice(lastUserMessageIndex, 0, {
        role: 'user',
        content: `Context: I'm developing a WordPress plugin called "${pluginContext}". Please ensure all code follows WordPress standards and best practices.`
      });
    }
  }
  
  return contextualMessages;
};

// Send message to configured AI model with WordPress context
const sendToAI = async (messages: Message[], config: AIModelConfig, pluginContext?: string): Promise<string> => {
  try {
    console.log(`Sending request to ${config.name} at ${config.apiEndpoint}`);
    console.log(`Using model: ${config.model}`);
    
    // Enhance messages with WordPress context
    const enhancedMessages = enhanceMessagesForWordPress(messages, pluginContext);
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    
    // Add authorization header based on endpoint
    if (config.apiEndpoint.includes('openai.com')) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    } else if (config.apiEndpoint.includes('anthropic.com')) {
      headers['x-api-key'] = config.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else if (config.apiEndpoint.includes('generativelanguage.googleapis.com')) {
      // For Google AI, API key is in URL parameter
    } else {
      // Default to Bearer token
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
    
    let requestBody: any;
    let url = config.apiEndpoint;
    
    // Handle different API formats
    if (config.apiEndpoint.includes('anthropic.com')) {
      // Anthropic format
      const systemPrompt = enhancedMessages.find(m => m.role === 'system')?.content || config.systemPrompt;
      const userMessages = enhancedMessages.filter(m => m.role !== 'system');
      
      requestBody = {
        model: config.model,
        system: systemPrompt,
        messages: userMessages.map(m => ({
          role: m.role,
          content: m.content
        })),
        max_tokens: 4000 // Increased for longer plugin code
      };
    } else if (config.apiEndpoint.includes('generativelanguage.googleapis.com')) {
      // Google AI format
      url = `${config.apiEndpoint}?key=${config.apiKey}`;
      const systemPrompt = enhancedMessages.find(m => m.role === 'system')?.content || config.systemPrompt;
      const userMessages = enhancedMessages.filter(m => m.role !== 'system');
      
      const geminiMessages = userMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      // Add system prompt as prefix to first user message
      if (systemPrompt && geminiMessages.length > 0 && geminiMessages[0].role === 'user') {
        geminiMessages[0].parts[0].text = `${systemPrompt}\n\n${geminiMessages[0].parts[0].text}`;
      }
      
      requestBody = {
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent code
          maxOutputTokens: 4000
        }
      };
    } else {
      // OpenAI/compatible format (default)
      requestBody = {
        model: config.model, // This will now be 'gpt-4' instead of 'openai'
        messages: enhancedMessages,
        temperature: 0.3, // Lower temperature for more consistent code generation
        max_tokens: 4000 // Increased for longer plugin code
      };
    }
    
    console.log('Request body model:', requestBody.model);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI API error response:', errorData);
      throw new Error(errorData.error?.message || `Error communicating with AI: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (config.apiEndpoint.includes('anthropic.com')) {
      return data.content[0].text;
    } else if (config.apiEndpoint.includes('generativelanguage.googleapis.com')) {
      return data.candidates[0].content.parts[0].text;
    } else {
      // OpenAI/compatible format
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error('AI API error:', error);
    throw error;
  }
};

// Send message to AI model with WordPress plugin context
export const sendMessage = async (messages: Message[], pluginName?: string): Promise<string> => {
  const config = await getAIModelConfig();
  
  if (!config || !config.apiKey) {
    throw new Error('AI model not configured. Please configure your AI model in settings.');
  }
  
  console.log(`Sending message to configured AI model: ${config.name}`);
  
  return sendToAI(messages, config, pluginName);
};

// Legacy functions for backward compatibility
export const AI_MODELS = [DEFAULT_AI_MODEL];
export const getApiKey = async (modelId: string): Promise<string | null> => {
  const config = await getAIModelConfig();
  return config?.apiKey || null;
};
export const saveApiKey = async (modelId: string, apiKey: string): Promise<boolean> => {
  const config = await getAIModelConfig();
  if (config) {
    config.apiKey = apiKey;
    return saveAIModelConfig(config);
  }
  return false;
};
