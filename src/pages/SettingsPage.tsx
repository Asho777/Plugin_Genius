import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiKey, FiShield, FiUser, FiMail, FiGlobe, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { AI_MODELS, getApiKey, saveApiKey, validateApiKey } from '../services/aiService'
import { 
  getUserProfile, updateUserProfile, 
  getUserSecurity, updateUserSecurity, updateUserPassword, 
  getUserNotifications, updateUserNotifications,
  getUserPreferences, updateUserPreferences,
  UserProfile, UserNotifications, UserPreferences, UserSecurity
} from '../services/settingsService'
import { timezones, getUserTimezone } from '../utils/timezones'
import '../styles/settings.css'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    'gpt-4': '',
    'claude': '',
    'gemini': '',
    'llama': ''
  })
  const [apiKeyErrors, setApiKeyErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  
  // User settings state
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    company: ''
  })
  
  const [security, setSecurity] = useState<UserSecurity>({
    two_factor_enabled: false
  })
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  
  const [notifications, setNotifications] = useState<UserNotifications>({
    email_notifications: true,
    update_notifications: true,
    marketing_notifications: false
  })
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    timezone: getUserTimezone(),
    dark_mode: true
  })
  
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
  
  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setLoading(true);
        
        // Load profile
        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile(userProfile);
        }
        
        // Load security settings
        const userSecurity = await getUserSecurity();
        if (userSecurity) {
          setSecurity(userSecurity);
        }
        
        // Load notifications
        const userNotifications = await getUserNotifications();
        if (userNotifications) {
          setNotifications(userNotifications);
        }
        
        // Load preferences
        const userPreferences = await getUserPreferences();
        if (userPreferences) {
          setPreferences(userPreferences);
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserSettings();
  }, []);
  
  // Validate API key on input change
  const handleApiKeyChange = (modelId: string, value: string) => {
    setApiKeys({...apiKeys, [modelId]: value});
    
    // Clear previous error
    if (apiKeyErrors[modelId]) {
      setApiKeyErrors({...apiKeyErrors, [modelId]: ''});
    }
    
    // Validate if key is not empty
    if (value.trim()) {
      const validation = validateApiKey(modelId, value);
      if (!validation.isValid) {
        setApiKeyErrors({...apiKeyErrors, [modelId]: validation.error || 'Invalid API key format'});
      }
    }
  };
  
  // Handle save API keys
  const handleSaveApiKeys = async () => {
    setLoading(true);
    setSaveError('');
    
    try {
      const errors: Record<string, string> = {};
      let hasErrors = false;
      
      for (const model of AI_MODELS) {
        if (apiKeys[model.id]) {
          const result = await saveApiKey(model.id, apiKeys[model.id]);
          if (!result.success) {
            errors[model.id] = result.error || 'Failed to save API key';
            hasErrors = true;
          }
        }
      }
      
      setApiKeyErrors(errors);
      
      if (hasErrors) {
        setSaveError('Some API keys could not be saved. Please check the errors above.');
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveError('Error saving API keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save profile
  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      const updatedProfile = await updateUserProfile(profile);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Error saving profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save security settings
  const handleSaveSecurity = async () => {
    setLoading(true);
    
    try {
      const updatedSecurity = await updateUserSecurity(security);
      if (updatedSecurity) {
        setSecurity(updatedSecurity);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Error saving security settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      alert('Error saving security settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save password
  const handleSavePassword = async () => {
    setLoading(true);
    
    try {
      if (passwords.new !== passwords.confirm) {
        alert('New passwords do not match.');
        setLoading(false);
        return;
      }
      
      const success = await updateUserPassword(passwords.current, passwords.new);
      
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        alert('Failed to update password. Please check your current password and try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save notifications
  const handleSaveNotifications = async () => {
    setLoading(true);
    
    try {
      const updatedNotifications = await updateUserNotifications(notifications);
      if (updatedNotifications) {
        setNotifications(updatedNotifications);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Error saving notification preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('Error saving notification preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save preferences
  const handleSavePreferences = async () => {
    setLoading(true);
    
    try {
      const updatedPreferences = await updateUserPreferences(preferences);
      if (updatedPreferences) {
        setPreferences(updatedPreferences);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Error saving preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply dark background to select dropdowns
  useEffect(() => {
    // Add a class to the document to help with styling select dropdowns
    document.documentElement.classList.add('dark-dropdowns');
    
    return () => {
      document.documentElement.classList.remove('dark-dropdowns');
    };
  }, []);
  
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
                  
                  {saveError && (
                    <div className="error-message">
                      <FiAlertCircle />
                      <span>{saveError}</span>
                    </div>
                  )}
                  
                  <div className="api-keys-form">
                    {AI_MODELS.map(model => (
                      <div key={model.id} className="api-key-input-group">
                        <label htmlFor={`api-key-${model.id}`}>{model.name} API Key</label>
                        <div className="api-key-input-wrapper">
                          <input
                            id={`api-key-${model.id}`}
                            type="password"
                            placeholder={model.keyExample || `Enter your ${model.name} API key`}
                            value={apiKeys[model.id]}
                            onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                            className={apiKeyErrors[model.id] ? 'error' : ''}
                          />
                          {apiKeys[model.id] && !apiKeyErrors[model.id] && (
                            <FiCheckCircle className="validation-icon success" />
                          )}
                          {apiKeyErrors[model.id] && (
                            <FiAlertCircle className="validation-icon error" />
                          )}
                        </div>
                        {apiKeyErrors[model.id] && (
                          <div className="api-key-error">
                            <FiAlertCircle />
                            <span>{apiKeyErrors[model.id]}</span>
                          </div>
                        )}
                        <div className="api-key-help">
                          <p>
                            {model.id === 'gpt-4' && 'Get your OpenAI API key from platform.openai.com. Keys start with "sk-".'}
                            {model.id === 'gpt-4o' && 'Get your OpenAI API key from platform.openai.com. Keys start with "sk-".'}
                            {model.id === 'gpt-4-1' && 'Get your GitHub Personal Access Token from github.com/settings/tokens. Keys start with "ghp_".'}
                            {model.id === 'claude' && 'Get your Anthropic API key from console.anthropic.com. Keys start with "sk-ant-".'}
                            {model.id === 'gemini' && 'Get your Google AI API key from aistudio.google.com. Keys start with "AIza".'}
                            {model.id === 'llama' && 'Get your Together AI API key from api.together.xyz/settings/api-keys.'}
                            {model.id === 'xbesh' && 'Get your xBesh AI API key from the xBesh AI platform.'}
                          </p>
                          {model.keyExample && (
                            <p className="key-format">Format: {model.keyExample}</p>
                          )}
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