// AI Service for Plugin Genius
// Handles AI model configuration and communication

export interface AIModelConfig {
  id: string
  name: string
  apiEndpoint: string
  apiKey: string
  model: string
  headers: Record<string, string>
  systemPrompt: string
  provider?: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Default AI Model Configuration for Claude 3.5 Sonnet (latest)
export const DEFAULT_AI_MODEL: AIModelConfig = {
  id: 'claude-3-5-sonnet-20241022',
  name: 'Claude 3.5 Sonnet',
  apiEndpoint: 'https://api.anthropic.com/v1/messages',
  apiKey: '',
  model: 'claude-3-5-sonnet-20241022',
  provider: 'anthropic',
  headers: {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  },
  systemPrompt: 'You are an expert WordPress plugin developer with 15+ years of experience. Create professional, secure, and standards-compliant WordPress plugins following all WordPress coding standards and best practices.'
}

// Multi-provider AI configuration
export interface MultiProviderConfig {
  provider: string
  model: string
  apiKey: string
  endpoint: string
  providerName: string
  headers?: Record<string, string>
  systemPrompt?: string
}

// SECURITY FIX: Get AI model configuration from localStorage only
export const getAIModelConfig = async (): Promise<AIModelConfig | null> => {
  try {
    // Check for multi-provider configuration first
    const multiProviderConfig = localStorage.getItem('multi-provider-ai-config')
    if (multiProviderConfig) {
      const config: MultiProviderConfig = JSON.parse(multiProviderConfig)
      
      // Convert multi-provider config to AIModelConfig format
      return {
        id: `${config.provider}-${config.model}`,
        name: config.providerName,
        apiEndpoint: config.endpoint,
        apiKey: config.apiKey,
        model: config.model,
        provider: config.provider,
        headers: config.headers || DEFAULT_AI_MODEL.headers,
        systemPrompt: config.systemPrompt || DEFAULT_AI_MODEL.systemPrompt
      }
    }
    
    // Check for legacy single-provider configuration
    const stored = localStorage.getItem('ai-model-config')
    if (stored) {
      const config = JSON.parse(stored)
      return {
        ...DEFAULT_AI_MODEL,
        ...config
      }
    }
    
    return null
  } catch (error) {
    console.error('Error loading AI model configuration:', error)
    return null
  }
}

// SECURITY FIX: Save AI model configuration to localStorage only
export const saveAIModelConfig = async (config: Partial<AIModelConfig>): Promise<boolean> => {
  try {
    // Create the final config with fixed values for Claude 3.5 Sonnet
    const finalConfig: AIModelConfig = {
      ...DEFAULT_AI_MODEL,
      ...config,
      id: config.id || DEFAULT_AI_MODEL.id,
      apiEndpoint: config.apiEndpoint || DEFAULT_AI_MODEL.apiEndpoint,
      model: config.model || DEFAULT_AI_MODEL.model,
      headers: config.headers || DEFAULT_AI_MODEL.headers
    }
    
    // Save to localStorage only
    localStorage.setItem('ai-model-config', JSON.stringify(finalConfig))
    console.log('AI model configuration saved successfully to localStorage')
    return true
  } catch (error) {
    console.error('Error saving AI model configuration:', error)
    return false
  }
}

// SECURITY FIX: Save multi-provider AI configuration to localStorage only
export const saveMultiProviderConfig = async (config: MultiProviderConfig): Promise<boolean> => {
  try {
    // Save to localStorage only
    localStorage.setItem('multi-provider-ai-config', JSON.stringify(config))
    console.log('Multi-provider AI configuration saved successfully to localStorage')
    return true
  } catch (error) {
    console.error('Error saving multi-provider AI configuration:', error)
    return false
  }
}

// SECURITY FIX: Get API key for a specific service from localStorage only
export const getApiKey = async (service: string): Promise<string | null> => {
  try {
    // For Claude models, get from the AI model config
    if (service === 'cursor-ai-style' || service.includes('claude')) {
      const config = await getAIModelConfig()
      return config?.apiKey || null
    }
    
    // Legacy support for other services
    const stored = localStorage.getItem(`api-key-${service}`)
    return stored
  } catch (error) {
    console.error('Error getting API key:', error)
    return null
  }
}

// Send message to AI model with multi-provider support
export const sendMessage = async (messages: Message[], context?: string): Promise<string> => {
  console.log('🚀 Starting sendMessage function with multi-provider support...')
  
  const config = await getAIModelConfig()
  console.log('📋 AI Config loaded:', { 
    hasConfig: !!config, 
    hasApiKey: !!config?.apiKey,
    provider: config?.provider,
    model: config?.model,
    endpoint: config?.apiEndpoint
  })
  
  if (!config || !config.apiKey) {
    const error = 'AI model not configured. Please configure your AI provider in settings.'
    console.error('❌', error)
    throw new Error(error)
  }

  try {
    // Handle different providers
    if (config.provider === 'anthropic' || !config.provider) {
      return await sendAnthropicMessage(config, messages, context)
    } else if (config.provider === 'openai') {
      return await sendOpenAIMessage(config, messages, context)
    } else {
      // Generic provider handling
      return await sendGenericMessage(config, messages, context)
    }
  } catch (error) {
    console.error('❌ Error in sendMessage:', error)
    throw error
  }
}

// Anthropic-specific message sending
const sendAnthropicMessage = async (config: AIModelConfig, messages: Message[], context?: string): Promise<string> => {
  const requestBody = {
    model: config.model,
    max_tokens: 4000,
    messages: messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role,
      content: m.content
    })),
    system: config.systemPrompt + (context ? `\n\nContext: Working on WordPress plugin "${context}"` : '')
  }

  const headers = {
    ...config.headers,
    'x-api-key': config.apiKey
  }

  console.log('🌐 Making request to Anthropic API:', config.apiEndpoint)
  console.log('📝 Request model:', config.model)

  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('❌ Anthropic API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      model: config.model,
      errorData
    })
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`)
  }

  const data = await response.json()
  
  if (data.content && data.content[0] && data.content[0].text) {
    return data.content[0].text
  } else {
    throw new Error('Invalid response format from Anthropic API')
  }
}

// OpenAI-specific message sending
const sendOpenAIMessage = async (config: AIModelConfig, messages: Message[], context?: string): Promise<string> => {
  const requestBody = {
    model: config.model,
    messages: [
      {
        role: 'system',
        content: config.systemPrompt + (context ? `\n\nContext: Working on WordPress plugin "${context}"` : '')
      },
      ...messages.filter(m => m.role !== 'system')
    ],
    max_tokens: 4000
  }

  const headers = {
    ...config.headers,
    'Authorization': `Bearer ${config.apiKey}`
  }

  console.log('🌐 Making request to OpenAI API:', config.apiEndpoint)

  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`)
  }

  const data = await response.json()
  
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content
  } else {
    throw new Error('Invalid response format from OpenAI API')
  }
}

// Generic message sending for custom providers
const sendGenericMessage = async (config: AIModelConfig, messages: Message[], context?: string): Promise<string> => {
  // This is a basic implementation - may need customization based on provider
  const requestBody = {
    model: config.model,
    messages: messages,
    max_tokens: 4000,
    system: config.systemPrompt + (context ? `\n\nContext: Working on WordPress plugin "${context}"` : '')
  }

  const headers = {
    ...config.headers,
    'Authorization': `Bearer ${config.apiKey}`
  }

  console.log('🌐 Making request to custom provider:', config.apiEndpoint)

  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`API error: ${response.status} ${response.statusText}. ${errorData.error?.message || errorData.message || ''}`)
  }

  const data = await response.json()
  
  // Try to extract response from common response formats
  if (data.content && data.content[0] && data.content[0].text) {
    return data.content[0].text
  } else if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content
  } else if (data.response) {
    return data.response
  } else if (data.text) {
    return data.text
  } else {
    throw new Error('Unable to parse response from custom provider')
  }
}

// Test AI model connection with multi-provider support
export const testAIConnection = async (testConfig?: MultiProviderConfig): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🧪 Testing AI connection...')
    
    let config: AIModelConfig | null = null
    
    if (testConfig) {
      // Convert test config to AIModelConfig format
      config = {
        id: `${testConfig.provider}-${testConfig.model}`,
        name: testConfig.providerName,
        apiEndpoint: testConfig.endpoint,
        apiKey: testConfig.apiKey,
        model: testConfig.model,
        provider: testConfig.provider,
        headers: testConfig.headers || DEFAULT_AI_MODEL.headers,
        systemPrompt: testConfig.systemPrompt || DEFAULT_AI_MODEL.systemPrompt
      }
    } else {
      config = await getAIModelConfig()
    }
    
    if (!config || !config.apiKey) {
      return {
        success: false,
        message: 'AI model not configured'
      }
    }

    // Send a simple test message
    const testMessages: Message[] = [
      {
        role: 'user',
        content: 'Hello, please respond with "Connection successful" to confirm the API is working.'
      }
    ]

    const response = await sendMessage(testMessages)
    
    if (response.toLowerCase().includes('connection successful')) {
      return {
        success: true,
        message: `${config.name} connection successful`
      }
    } else {
      return {
        success: true,
        message: `${config.name} is responding correctly`
      }
    }
  } catch (error) {
    console.error('🧪 Connection test failed:', error)
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
