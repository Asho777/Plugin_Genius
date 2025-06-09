import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiKey, FiShield, FiUser, FiMail, FiGlobe } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { AI_MODELS, getApiKey, saveApiKey } from '../services/aiService'
import '../styles/settings.css'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    'gpt-4': '',
    'claude': '',
    'gemini': '',
    'llama': ''
  })
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Load API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      const keys: Record<string, string> = {};
      
      for (const model of AI_MODELS) {
        const key = await getApiKey(model.id);
        keys[model.id] = key || '';
      }
      
      setApiKeys(keys);
    };
    
    loadApiKeys();
  }, []);
  
  // Handle save API keys
  const handleSaveApiKeys = async () => {
    setLoading(true);
    
    try {
      for (const model of AI_MODELS) {
        if (apiKeys[model.id]) {
          await saveApiKey(model.id, apiKeys[model.id]);
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      alert('Error saving API keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="settings-page">
      <Navbar />
      
      <main className="settings-content">
        <header className="settings-header">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Configure your Plugin Genius experience</p>
          </motion.div>
        </header>
        
        <section className="settings-section">
          <div className="settings-container">
            <div className="settings-sidebar">
              <button 
                className={`settings-tab ${activeTab === 'api-keys' ? 'active' : ''}`}
                onClick={() => setActiveTab('api-keys')}
              >
                <FiKey />
                <span>API Keys</span>
              </button>
              <button 
                className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <FiUser />
                <span>Account</span>
              </button>
              <button 
                className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FiShield />
                <span>Security</span>
              </button>
              <button 
                className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FiMail />
                <span>Notifications</span>
              </button>
              <button 
                className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <FiGlobe />
                <span>Preferences</span>
              </button>
            </div>
            
            <div className="settings-content-panel">
              {activeTab === 'api-keys' && (
                <div className="api-keys-panel">
                  <h2 className="panel-title">API Keys</h2>
                  <p className="panel-description">
                    Add your API keys to use different AI models for plugin creation.
                    Your keys are securely stored and never shared with third parties.
                  </p>
                  
                  <div className="api-keys-form">
                    {AI_MODELS.map(model => (
                      <div key={model.id} className="api-key-input-group">
                        <label htmlFor={`api-key-${model.id}`}>{model.name} API Key</label>
                        <input
                          id={`api-key-${model.id}`}
                          type="password"
                          placeholder={`Enter your ${model.name} API key`}
                          value={apiKeys[model.id]}
                          onChange={(e) => setApiKeys({...apiKeys, [model.id]: e.target.value})}
                        />
                        <div className="api-key-help">
                          <p>
                            {model.id === 'gpt-4' && 'Get your OpenAI API key from the OpenAI dashboard.'}
                            {model.id === 'claude' && 'Get your Anthropic API key from the Anthropic console.'}
                            {model.id === 'gemini' && 'Get your Google AI API key from the Google AI Studio.'}
                            {model.id === 'llama' && 'Get your Together AI API key from the Together AI platform.'}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="api-keys-actions">
                      <button 
                        className={`save-button ${saveSuccess ? 'success' : ''}`}
                        onClick={handleSaveApiKeys}
                        disabled={loading}
                      >
                        <FiSave />
                        <span>{loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save API Keys'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'account' && (
                <div className="account-panel">
                  <h2 className="panel-title">Account Settings</h2>
                  <p className="panel-description">
                    Manage your account details and subscription.
                  </p>
                  
                  <div className="account-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="company">Company (Optional)</label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Enter your company name"
                      />
                    </div>
                    
                    <div className="account-actions">
                      <button className="save-button">
                        <FiSave />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="security-panel">
                  <h2 className="panel-title">Security Settings</h2>
                  <p className="panel-description">
                    Manage your password and security preferences.
                  </p>
                  
                  <div className="security-form">
                    <div className="form-group">
                      <label htmlFor="current-password">Current Password</label>
                      <input
                        id="current-password"
                        type="password"
                        placeholder="Enter your current password"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <input
                        id="new-password"
                        type="password"
                        placeholder="Enter your new password"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirm-password">Confirm New Password</label>
                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                      />
                    </div>
                    
                    <div className="security-actions">
                      <button className="save-button">
                        <FiSave />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="notifications-panel">
                  <h2 className="panel-title">Notification Settings</h2>
                  <p className="panel-description">
                    Manage your notification preferences.
                  </p>
                  
                  <div className="notifications-form">
                    <div className="form-group checkbox">
                      <input id="email-notifications" type="checkbox" />
                      <label htmlFor="email-notifications">Email Notifications</label>
                      <p className="help-text">Receive email notifications about your plugins and account.</p>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input id="update-notifications" type="checkbox" />
                      <label htmlFor="update-notifications">Product Updates</label>
                      <p className="help-text">Receive notifications about new features and updates.</p>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input id="marketing-notifications" type="checkbox" />
                      <label htmlFor="marketing-notifications">Marketing Communications</label>
                      <p className="help-text">Receive marketing communications and special offers.</p>
                    </div>
                    
                    <div className="notifications-actions">
                      <button className="save-button">
                        <FiSave />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'preferences' && (
                <div className="preferences-panel">
                  <h2 className="panel-title">Preferences</h2>
                  <p className="panel-description">
                    Customize your Plugin Genius experience.
                  </p>
                  
                  <div className="preferences-form">
                    <div className="form-group">
                      <label htmlFor="language">Language</label>
                      <select id="language">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="timezone">Timezone</label>
                      <select id="timezone">
                        <option value="utc">UTC</option>
                        <option value="est">Eastern Time (EST)</option>
                        <option value="cst">Central Time (CST)</option>
                        <option value="pst">Pacific Time (PST)</option>
                      </select>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input id="dark-mode" type="checkbox" checked />
                      <label htmlFor="dark-mode">Dark Mode</label>
                      <p className="help-text">Use dark mode for the Plugin Genius interface.</p>
                    </div>
                    
                    <div className="preferences-actions">
                      <button className="save-button">
                        <FiSave />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default SettingsPage
