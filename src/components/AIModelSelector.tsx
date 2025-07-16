import React, { useState, useEffect } from 'react'
import { FiChevronDown, FiSettings, FiKey, FiGlobe, FiCheck, FiAlertCircle } from 'react-icons/fi'

export interface AIProvider {
  id: string
  name: string
  endpoint: string
  models: AIModel[]
  requiresSpecialHeaders?: boolean
  headers?: Record<string, string>
}

export interface AIModel {
  id: string
  name: string
  description: string
}

export interface AIConfiguration {
  provider: string
  model: string
  apiKey: string
  endpoint: string
  providerName: string
  headers?: Record<string, string>
}

interface AIModelSelectorProps {
  onConfigurationChange: (config: AIConfiguration) => void
  currentConfig?: AIConfiguration
  onTest?: (config: AIConfiguration) => Promise<{ success: boolean; message: string }>
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({ 
  onConfigurationChange, 
  currentConfig,
  onTest 
}) => {
  const [selectedProvider, setSelectedProvider] = useState(currentConfig?.provider || '')
  const [selectedModel, setSelectedModel] = useState(currentConfig?.model || '')
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '')
  const [customEndpoint, setCustomEndpoint] = useState(currentConfig?.endpoint || '')
  const [isCustomProvider, setIsCustomProvider] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const providers: Record<string, AIProvider> = {
    anthropic: {
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      endpoint: 'https://api.anthropic.com/v1/messages',
      requiresSpecialHeaders: true,
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      models: [
        { 
          id: 'claude-3-5-sonnet-20241022', 
          name: 'Claude 3.5 Sonnet (Latest)', 
          description: 'Most capable model for WordPress development (Recommended)' 
        },
        { 
          id: 'claude-3-5-sonnet-20240620', 
          name: 'Claude 3.5 Sonnet (June)', 
          description: 'Previous version of Claude 3.5 Sonnet' 
        },
        { 
          id: 'claude-3-sonnet-20240229', 
          name: 'Claude 3 Sonnet', 
          description: 'Balanced performance and speed' 
        },
        { 
          id: 'claude-3-haiku-20240307', 
          name: 'Claude 3 Haiku', 
          description: 'Fast and efficient for simple tasks' 
        },
        { 
          id: 'claude-3-opus-20240229', 
          name: 'Claude 3 Opus', 
          description: 'Most powerful Claude 3 model' 
        }
      ]
    },
    openai: {
      id: 'openai',
      name: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json'
      },
      models: [
        { id: 'gpt-4', name: 'GPT-4', description: 'Most capable GPT model' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster GPT-4 with larger context' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' }
      ]
    },
    google: {
      id: 'google',
      name: 'Google AI',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      headers: {
        'Content-Type': 'application/json'
      },
      models: [
        { id: 'gemini-pro', name: 'Gemini Pro', description: 'Advanced reasoning and code generation' },
        { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Multimodal capabilities' }
      ]
    },
    cohere: {
      id: 'cohere',
      name: 'Cohere',
      endpoint: 'https://api.cohere.ai/v1/generate',
      headers: {
        'Content-Type': 'application/json'
      },
      models: [
        { id: 'command-r-plus', name: 'Command R+', description: 'Advanced reasoning model' },
        { id: 'command-r', name: 'Command R', description: 'Balanced performance model' }
      ]
    },
    mistral: {
      id: 'mistral',
      name: 'Mistral AI',
      endpoint: 'https://api.mistral.ai/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json'
      },
      models: [
        { id: 'mistral-large-latest', name: 'Mistral Large', description: 'Most capable Mistral model' },
        { id: 'mistral-medium-latest', name: 'Mistral Medium', description: 'Balanced performance' }
      ]
    }
  }

  // Initialize with current config
  useEffect(() => {
    if (currentConfig) {
      if (currentConfig.provider === 'custom') {
        setIsCustomProvider(true)
        setSelectedProvider('')
      } else {
        setIsCustomProvider(false)
        setSelectedProvider(currentConfig.provider)
      }
      setSelectedModel(currentConfig.model)
      setApiKey(currentConfig.apiKey)
      setCustomEndpoint(currentConfig.endpoint)
    }
  }, [currentConfig])

  const handleProviderChange = (provider: string) => {
    if (provider === 'custom') {
      setIsCustomProvider(true)
      setSelectedProvider('')
      setSelectedModel('')
      setCustomEndpoint('')
    } else {
      setIsCustomProvider(false)
      setSelectedProvider(provider)
      setSelectedModel('')
      setCustomEndpoint(providers[provider]?.endpoint || '')
    }
    setTestResult(null)
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setTestResult(null)
  }

  const handleApiKeyChange = (key: string) => {
    setApiKey(key)
    setTestResult(null)
  }

  const handleEndpointChange = (endpoint: string) => {
    setCustomEndpoint(endpoint)
    setTestResult(null)
  }

  const isConfigComplete = () => {
    if (isCustomProvider) {
      return apiKey && selectedModel && customEndpoint
    }
    return selectedProvider && selectedModel && apiKey
  }

  const getCurrentConfiguration = (): AIConfiguration => {
    const provider = isCustomProvider ? 'custom' : selectedProvider
    const providerData = providers[selectedProvider]
    
    return {
      provider,
      model: selectedModel,
      apiKey,
      endpoint: customEndpoint,
      providerName: isCustomProvider ? 'Custom Provider' : (providerData?.name || ''),
      headers: providerData?.headers || {}
    }
  }

  const handleConnect = () => {
    if (isConfigComplete()) {
      const config = getCurrentConfiguration()
      onConfigurationChange(config)
    }
  }

  const handleTest = async () => {
    if (!isConfigComplete() || !onTest) return
    
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const config = getCurrentConfiguration()
      const result = await onTest(config)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      })
    } finally {
      setIsTesting(false)
    }
  }

  const getAvailableModels = () => {
    if (isCustomProvider) {
      return []
    }
    return selectedProvider ? providers[selectedProvider]?.models || [] : []
  }

  return (
    <div className="ai-model-selector">
      <div className="selector-header">
        <FiSettings size={20} />
        <h3>AI Model Configuration</h3>
      </div>

      {/* Provider Selection */}
      <div className="form-group">
        <label htmlFor="provider-select">Select AI Provider</label>
        <div className="select-wrapper">
          <select
            id="provider-select"
            value={isCustomProvider ? 'custom' : selectedProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="provider-select"
          >
            <option value="">Choose a provider...</option>
            {Object.entries(providers).map(([key, provider]) => (
              <option key={key} value={key}>{provider.name}</option>
            ))}
            <option value="custom">🔧 Custom Provider</option>
          </select>
          <FiChevronDown className="select-icon" />
        </div>
      </div>

      {/* Model Selection */}
      {(selectedProvider && !isCustomProvider) && (
        <div className="form-group">
          <label>Select Model</label>
          <div className="model-selection">
            {getAvailableModels().map((model) => (
              <label key={model.id} className="model-option">
                <div className="model-info">
                  <span className="model-name">{model.name}</span>
                  <span className="model-description">{model.description}</span>
                </div>
                <input
                  type="radio"
                  name="model"
                  value={model.id}
                  checked={selectedModel === model.id}
                  onChange={(e) => handleModelChange(e.target.value)}
                  style={{ display: 'none' }}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Custom Provider Fields */}
      {isCustomProvider && (
        <div className="custom-provider-section">
          <div className="custom-provider-header">
            <FiGlobe size={18} />
            <h4>Custom Provider Configuration</h4>
          </div>
          
          <div className="custom-provider-fields">
            <div className="form-group">
              <label htmlFor="custom-endpoint">API Endpoint URL</label>
              <input
                id="custom-endpoint"
                type="url"
                value={customEndpoint}
                onChange={(e) => handleEndpointChange(e.target.value)}
                placeholder="https://api.example.com"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="custom-model">Model Name/ID</label>
              <input
                id="custom-model"
                type="text"
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                placeholder="model-name-v1"
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* API Key */}
      <div className="form-group">
        <label htmlFor="api-key" className="api-key-label">
          <FiKey size={16} />
          API Key
        </label>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          placeholder="Enter your API key..."
          className="form-input"
        />
        <p className="help-text">
          Your API key is stored securely and never shared
        </p>
      </div>

      {/* Endpoint Display */}
      {(selectedProvider || isCustomProvider) && (
        <div className="form-group">
          <label>API Endpoint</label>
          <div className="endpoint-display">
            <code>
              {customEndpoint || (selectedProvider ? providers[selectedProvider].endpoint : 'Select a provider')}
            </code>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          onClick={handleConnect}
          disabled={!isConfigComplete()}
          className={`connect-button ${isConfigComplete() ? 'enabled' : 'disabled'}`}
        >
          {isConfigComplete() ? 'Save Configuration' : 'Complete Configuration'}
        </button>
        
        {onTest && isConfigComplete() && (
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="test-button"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        )}
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          {testResult.success ? (
            <FiCheck className="result-icon" />
          ) : (
            <FiAlertCircle className="result-icon" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Configuration Summary */}
      {isConfigComplete() && (
        <div className="config-summary">
          <h4>Configuration Summary</h4>
          <div className="summary-details">
            <div><strong>Provider:</strong> {isCustomProvider ? 'Custom Provider' : providers[selectedProvider]?.name}</div>
            <div><strong>Model:</strong> {selectedModel}</div>
            <div><strong>Endpoint:</strong> {customEndpoint}</div>
            <div><strong>API Key:</strong> {'*'.repeat(Math.min(apiKey.length, 20))}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIModelSelector
