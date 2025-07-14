// AI Service for Plugin Genius
// Handles AI model configuration and communication

import { saveUserApiKey, getUserApiKey } from './settingsService'

export interface AIModelConfig {
  id: string
  name: string
  apiEndpoint: string
  apiKey: string
  model: string
  headers: Record<string, string>
  systemPrompt: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Default AI Model Configuration for Claude Sonnet 4
export const DEFAULT_AI_MODEL: AIModelConfig = {
  id: 'claude-sonnet-4',
  name: 'Claude Sonnet 4',
  apiEndpoint: 'https://api.anthropic.com/v1/messages',
  apiKey: '',
  model: 'claude-3-5-sonnet-20241022',
  headers: {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01'
  },
  systemPrompt: 'You are an expert WordPress plugin developer with 15+ years of experience. Create professional, secure, and standards-compliant WordPress plugins following all WordPress coding standards and best practices.'
}

// Get AI model configuration from Supabase and localStorage
export const getAIModelConfig = async (): Promise<AIModelConfig | null> => {
  try {
    // First try to get API key from Supabase
    let apiKey = await getUserApiKey()
    
    // If not in Supabase, check localStorage for backward compatibility
    if (!apiKey) {
      const stored = localStorage.getItem('ai-model-config')
      if (stored) {
        const config = JSON.parse(stored)
        apiKey = config.apiKey
      }
    }
    
    if (apiKey) {
      return {
        ...DEFAULT_AI_MODEL,
        apiKey: apiKey
      }
    }
    
    return null
  } catch (error) {
    console.error('Error loading AI model configuration:', error)
    return null
  }
}

// Save AI model configuration to both Supabase and localStorage
export const saveAIModelConfig = async (config: Partial<AIModelConfig>): Promise<boolean> => {
  try {
    // Create the final config with fixed values for Claude Sonnet 4
    const finalConfig: AIModelConfig = {
      ...DEFAULT_AI_MODEL,
      ...config,
      id: DEFAULT_AI_MODEL.id, // Always Claude Sonnet 4
      apiEndpoint: DEFAULT_AI_MODEL.apiEndpoint, // Fixed API endpoint
      model: DEFAULT_AI_MODEL.model, // Fixed model
      headers: DEFAULT_AI_MODEL.headers // Fixed headers
    }
    
    // Save API key to Supabase user profile
    if (finalConfig.apiKey) {
      const supabaseSuccess = await saveUserApiKey(finalConfig.apiKey)
      if (!supabaseSuccess) {
        console.warn('Failed to save API key to Supabase, falling back to localStorage only')
      }
    }
    
    // Also save to localStorage for backward compatibility
    localStorage.setItem('ai-model-config', JSON.stringify(finalConfig))
    console.log('AI model configuration saved successfully')
    return true
  } catch (error) {
    console.error('Error saving AI model configuration:', error)
    return false
  }
}

// Get API key for a specific service (legacy support)
export const getApiKey = async (service: string): Promise<string | null> => {
  try {
    // For Claude Sonnet 4, get from the AI model config
    if (service === 'cursor-ai-style' || service === 'claude-sonnet-4') {
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

// Send message to AI model using CORS proxy to reach Claude Sonnet 4 API
export const sendMessage = async (messages: Message[], context?: string): Promise<string> => {
  console.log('🚀 Starting sendMessage function...')
  
  const config = await getAIModelConfig()
  console.log('📋 AI Config loaded:', { 
    hasConfig: !!config, 
    hasApiKey: !!config?.apiKey,
    apiKeyPrefix: config?.apiKey?.substring(0, 10) + '...',
    endpoint: config?.apiEndpoint,
    model: config?.model
  })
  
  if (!config || !config.apiKey) {
    const error = 'AI model not configured. Please configure Claude Sonnet 4 in settings.'
    console.error('❌', error)
    throw new Error(error)
  }

  try {
    // Prepare the request for Claude Sonnet 4 API
    const requestBody = {
      model: config.model,
      max_tokens: 4000,
      messages: messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content
      })),
      system: config.systemPrompt + (context ? `\n\nContext: Working on WordPress plugin "${context}"` : '')
    }

    console.log('📤 Request body prepared:', {
      model: requestBody.model,
      max_tokens: requestBody.max_tokens,
      messageCount: requestBody.messages.length,
      systemPromptLength: requestBody.system.length,
      context: context || 'none',
      hasApiKey: !!config.apiKey
    })

    // Use CORS proxy to bypass browser CORS restrictions
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const targetUrl = config.apiEndpoint
    const proxyUrl = corsProxyUrl + targetUrl

    const headers = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': config.apiKey,
      'X-Requested-With': 'XMLHttpRequest'
    }

    console.log('📋 Request headers prepared:', { ...headers, 'x-api-key': '[REDACTED]' })
    console.log('🌐 Making fetch request via CORS proxy to:', proxyUrl)

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    })

    console.log('📥 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
        console.error('❌ API Error Response:', errorData)
      } catch (parseError) {
        console.error('❌ Failed to parse error response:', parseError)
        const responseText = await response.text().catch(() => 'Unable to read response')
        console.error('❌ Raw error response:', responseText)
      }
      
      // Handle CORS proxy specific errors
      if (response.status === 403 && errorData.message?.includes('cors-anywhere')) {
        throw new Error('CORS proxy access denied. Please visit https://cors-anywhere.herokuapp.com/corsdemo and request temporary access, then try again.')
      }
      
      const errorMessage = `API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || errorData.message || 'Unknown error'}`
      console.error('❌ Final error message:', errorMessage)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('✅ Response data received:', {
      hasContent: !!data.content,
      contentLength: data.content?.length || 0,
      firstContentType: data.content?.[0]?.type,
      hasText: !!data.content?.[0]?.text
    })
    
    if (data.content && data.content[0] && data.content[0].text) {
      console.log('✅ Successfully extracted text response')
      return data.content[0].text
    } else {
      const error = 'Invalid response format from Claude Sonnet 4 API'
      console.error('❌', error, 'Full response:', data)
      throw new Error(error)
    }
  } catch (error) {
    console.error('❌ Error in sendMessage:', error)
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to Claude Sonnet 4 API. This might be a CORS issue. Please visit https://cors-anywhere.herokuapp.com/corsdemo to request temporary access.')
    } else if (error instanceof Error && error.message.includes('cors-anywhere')) {
      throw new Error(error.message)
    } else if (error instanceof Error && error.message.includes('401')) {
      throw new Error('Authentication failed: Invalid Claude Sonnet 4 API key. Please check your API key in settings.')
    } else if (error instanceof Error && error.message.includes('429')) {
      throw new Error('Rate limit exceeded: Too many requests to Claude Sonnet 4 API. Please wait a moment and try again.')
    } else if (error instanceof Error && error.message.includes('403')) {
      throw new Error('Access forbidden: Your Claude Sonnet 4 API key may not have the required permissions.')
    }
    
    throw error
  }
}

// Test AI model connection
export const testAIConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🧪 Testing AI connection...')
    
    const config = await getAIModelConfig()
    
    if (!config || !config.apiKey) {
      return {
        success: false,
        message: 'Claude Sonnet 4 API key not configured'
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
        message: 'Claude Sonnet 4 connection successful'
      }
    } else {
      return {
        success: true,
        message: 'Claude Sonnet 4 is responding (connection working)'
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
