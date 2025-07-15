import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiKey, FiShield, FiUser, FiMail, FiGlobe, FiSettings } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AIModelSelector from '../components/AIModelSelector'
import type { AIConfiguration } from '../components/AIModelSelector'
import { 
  getAIModelConfig, saveAIModelConfig, saveMultiProviderConfig, testAIConnection, DEFAULT_AI_MODEL, AIModelConfig
} from '../services/aiService'
import { 
  getUserProfile, updateUserProfile, 
  getUserSecurity, updateUserSecurity, updateUserPassword, 
  getUserNotifications, updateUserNotifications,
  getUserPreferences, updateUserPreferences,
  UserProfile, UserNotifications, UserPreferences, UserSecurity
} from '../services/settingsService'
import { timezones, getUserTimezone } from '../utils/timezones'
import '../styles/settings.css'
import '../styles/ai-model-selector.css'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('ai-config')
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  // AI Configuration state
  const [currentAIConfig, setCurrentAIConfig] = useState<AIConfiguration | undefined>()
  
  // User settings state
  const [profile, setProfile] = useState<UserProfile>({
    user_id: '',
    full_name: '',
    email: '',
    company: ''
  })
  
  const [security, setSecurity] = useState<UserSecurity>({
    user_id: '',
    two_factor_enabled: false
  })
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  
  const [notifications, setNotifications] = useState<UserNotifications>({
    user_id: '',
    email_notifications: true,
    update_notifications: true,
    marketing_notifications: false
  })
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    user_id: '',
    language: 'en',
    timezone: getUserTimezone(),
    dark_mode: true
  })
  
  // Load AI configuration
  useEffect(() => {
    const loadAIConfig = async () => {
      console.log('Loading AI configuration...')
      const config = await getAIModelConfig()
      if (config) {
        console.log('AI configuration loaded:', config)
        // Convert AIModelConfig to AIConfiguration format
        setCurrentAIConfig({
          provider: config.provider || 'anthropic',
          model: config.model,
          apiKey: config.apiKey,
          endpoint: config.apiEndpoint,
          providerName: config.name,
          headers: config.headers
        })
      } else {
        console.log('No AI configuration found, using defaults')
      }
    }
    
    loadAIConfig()
  }, [])
  
  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setLoading(true)
        
        // Load profile
        const userProfile = await getUserProfile()
        if (userProfile) {
          setProfile(userProfile)
        }
        
        // Load security settings
        const userSecurity = await getUserSecurity()
        if (userSecurity) {
          setSecurity(userSecurity)
        }
        
        // Load notifications
        const userNotifications = await getUserNotifications()
        if (userNotifications) {
          setNotifications(userNotifications)
        }
        
        // Load preferences
        const userPreferences = await getUserPreferences()
        if (userPreferences) {
          setPreferences(userPreferences)
        }
      } catch (error) {
        console.error('Error loading user settings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserSettings()
  }, [])
  
  // Handle AI configuration change
  const handleAIConfigurationChange = async (config: AIConfiguration) => {
    console.log('AI configuration changed:', config)
    setLoading(true)
    setSaveError(null)
    setSaveSuccess(false)
    
    try {
      // Save multi-provider configuration
      const success = await saveMultiProviderConfig({
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
        endpoint: config.endpoint,
        providerName: config.providerName,
        headers: config.headers,
        systemPrompt: DEFAULT_AI_MODEL.systemPrompt
      })
      
      if (success) {
        setCurrentAIConfig(config)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        console.log('AI configuration saved successfully')
      } else {
        setSaveError('Failed to save AI configuration. Please try again.')
      }
    } catch (error) {
      console.error('Error saving AI configuration:', error)
      setSaveError(`Error saving AI configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle AI connection test
  const handleTestAIConnection = async (config: AIConfiguration): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await testAIConnection({
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
        endpoint: config.endpoint,
        providerName: config.providerName,
        headers: config.headers
      })
      
      return result
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      }
    }
  }
  
  // Handle save profile
  const handleSaveProfile = async () => {
    setLoading(true)
    setSaveError(null)
    
    try {
      const updatedProfile = await updateUserProfile(profile)
      if (updatedProfile) {
        setProfile(updatedProfile)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError('Error saving profile. Please try again.')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveError('Error saving profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle save security settings
  const handleSaveSecurity = async () => {
    setLoading(true)
    setSaveError(null)
    
    try {
      const updatedSecurity = await updateUserSecurity(security)
      if (updatedSecurity) {
        setSecurity(updatedSecurity)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError('Error saving security settings. Please try again.')
      }
    } catch (error) {
      console.error('Error saving security settings:', error)
      setSaveError('Error saving security settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle save password
  const handleSavePassword = async () => {
    setLoading(true)
    setSaveError(null)
    
    try {
      if (passwords.new !== passwords.confirm) {
        setSaveError('New passwords do not match.')
        setLoading(false)
        return
      }
      
      const success = await updateUserPassword(passwords.current, passwords.new)
      
      if (success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        setPasswords({ current: '', new: '', confirm: '' })
      } else {
        setSaveError('Failed to update password. Please check your current password and try again.')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      setSaveError('Error updating password. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle save notifications
  const handleSaveNotifications = async () => {
    setLoading(true)
    setSaveError(null)
    
    try {
      const updatedNotifications = await updateUserNotifications(notifications)
      if (updatedNotifications) {
        setNotifications(updatedNotifications)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError('Error saving notification preferences. Please try again.')
      }
    } catch (error) {
      console.error('Error saving notifications:', error)
      setSaveError('Error saving notification preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle save preferences
  const handleSavePreferences = async () => {
    setLoading(true)
    setSaveError(null)
    
    try {
      const updatedPreferences = await updateUserPreferences(preferences)
      if (updatedPreferences) {
        setPreferences(updatedPreferences)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError('Error saving preferences. Please try again.')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      setSaveError('Error saving preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Apply dark background to select dropdowns
  useEffect(() => {
    // Add a class to the document to help with styling select dropdowns
    document.documentElement.classList.add('dark-dropdowns')
    
    return () => {
      document.documentElement.classList.remove('dark-dropdowns')
    }
  }, [])
  
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
                className={`settings-tab ${activeTab === 'ai-config' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai-config')}
              >
                <FiSettings />
                <span>AI Configuration</span>
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
              {/* Error Message Display */}
              {saveError && (
                <div className="error-message">
                  <p>{saveError}</p>
                  <button onClick={() => setSaveError(null)}>×</button>
                </div>
              )}
              
              {/* Success Message Display */}
              {saveSuccess && (
                <div className="success-message">
                  <p>Settings saved successfully!</p>
                </div>
              )}
              
              {activeTab === 'ai-config' && (
                <div className="ai-config-panel">
                  <h2 className="panel-title">AI Model Configuration</h2>
                  <p className="panel-description">
                    Configure your AI provider for WordPress plugin generation. Plugin Genius supports multiple AI providers 
                    including Anthropic Claude, OpenAI GPT, Google Gemini, and custom providers.
                  </p>
                  
                  <AIModelSelector
                    currentConfig={currentAIConfig}
                    onConfigurationChange={handleAIConfigurationChange}
                    onTest={handleTestAIConnection}
                  />
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
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="company">Company (Optional)</label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Enter your company name"
                        value={profile.company || ''}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                      />
                    </div>
                    
                    <div className="account-actions">
                      <button 
                        className={`save-button ${saveSuccess ? 'success' : ''}`}
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        <FiSave />
                        <span>{loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
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
                    <div className="form-group checkbox">
                      <input 
                        id="two-factor" 
                        type="checkbox" 
                        checked={security.two_factor_enabled}
                        onChange={(e) => setSecurity({...security, two_factor_enabled: e.target.checked})}
                      />
                      <label htmlFor="two-factor">Two-Factor Authentication</label>
                      <p className="help-text">Enable two-factor authentication for additional security.</p>
                    </div>
                    
                    <div className="security-actions">
                      <button 
                        className={`save-button ${saveSuccess ? 'success' : ''}`}
                        onClick={handleSaveSecurity}
                        disabled={loading}
                      >
                        <FiSave />
                        <span>{loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Security Settings'}</span>
                      </button>
                    </div>
                    
                    <h3 className="section-title">Change Password</h3>
                    
                    <div className="form-group">
                      <label htmlFor="current-password">Current Password</label>
                      <input
                        id="current-password"
                        type="password"
                        placeholder="Enter your current password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <input
                        id="new-password"
                        type="password"
                        placeholder="Enter your new password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirm-password">Confirm New Password</label>
                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      />
                    </div>
                    
                    <div className="security-actions">
                      <button 
                        className={`save-button ${saveSuccess ? 'success' : ''}`}
                        onClick={handleSavePassword}
                        disabled={loading}
                      >
                        <FiSave />
                        <span>{loading ? 'Updating...' : saveSuccess ? 'Updated!' : 'Update Password'}</span>
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
                      <input 
                        id="email-notifications" 
                        type="checkbox" 
                        checked={notifications.email_notifications}
                        onChange={(e) => setNotifications({...notifications, email_notifications: e.target.checked})}
                      />
                      <label htmlFor="email-notifications">Email Notifications</label>
                      <p className="help-text">Receive email notifications about your plugins and account.</p>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input 
                        id="update-notifications" 
                        type="checkbox"
                        checked={notifications.update_notifications}
                        onChange={(e) => setNotifications({...notifications, update_notifications: e.target.checked})}
                      />
                      <label htmlFor="update-notifications">Product Updates</label>
                      <p className="help-text">Receive notifications about new features and updates.</p>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input 
                        id="marketing-notifications" 
                        type="checkbox"
                        checked={notifications.marketing_notifications}
                        onChange={(e) => setNotifications({...notifications, marketing_notifications: e.target.checked})}
                      />
                      <label htmlFor="marketing-notifications">Marketing Communications</label>
                      <p className="help-text">Receive marketing communications and special offers.</p>
                    </div>
                    
                    <div className="notifications-actions">
                      <button 
                        className={`save-button ${saveSuccess ? 'success' : ''}`}
                        onClick={handleSaveNotifications}
                        disabled={loading}
                      >
                        <FiSave />
                        <span>{loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Preferences'}</span>
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
                      <select 
                        id="language"
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="timezone">Timezone</label>
                      <select 
                        id="timezone"
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                        className="timezone-select"
                      >
                        {timezones.map(tz => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="preferences-actions">
                      <button 
                        className={`save-button ${saveSuccess ? 'success' : ''}`}
                        onClick={handleSavePreferences}
                        disabled={loading}
                      >
                        <FiSave />
                        <span>{loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Preferences'}</span>
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
