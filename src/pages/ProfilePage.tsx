import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiEdit, FiUser, FiMail, FiBriefcase, FiCalendar, FiGlobe, FiBell, FiMoon, FiSun, FiUpload, FiCheck } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { 
  getUserProfile, 
  getUserSecurity, 
  getUserNotifications, 
  getUserPreferences,
  uploadAvatar,
  updateUserProfile,
  UserProfile,
  UserSecurity,
  UserNotifications,
  UserPreferences
} from '../services/settingsService'
import '../styles/profile.css'

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [security, setSecurity] = useState<UserSecurity | null>(null)
  const [notifications, setNotifications] = useState<UserNotifications | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      
      try {
        const [profileData, securityData, notificationsData, preferencesData] = await Promise.all([
          getUserProfile(),
          getUserSecurity(),
          getUserNotifications(),
          getUserPreferences()
        ])
        
        setProfile(profileData)
        setSecurity(securityData)
        setNotifications(notificationsData)
        setPreferences(preferencesData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [])

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    const file = e.target.files[0]
    setUploading(true)
    
    try {
      const avatarUrl = await uploadAvatar(file)
      
      if (avatarUrl && profile) {
        const updatedProfile = await updateUserProfile({
          ...profile,
          avatar_url: avatarUrl
        })
        
        if (updatedProfile) {
          setProfile(updatedProfile)
          setUploadSuccess(true)
          setTimeout(() => setUploadSuccess(false), 3000)
          
          // Refresh the page to update the avatar in the navbar
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German'
    }
    
    return languages[code] || code
  }

  const getTimezoneName = (code: string) => {
    const timezones: Record<string, string> = {
      utc: 'UTC (Coordinated Universal Time)',
      est: 'Eastern Standard Time (EST)',
      cst: 'Central Standard Time (CST)',
      pst: 'Pacific Standard Time (PST)'
    }
    
    return timezones[code] || code
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-content">
          <div className="container">
            <div className="loading-spinner">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-content">
        <header className="profile-header">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">View and manage your profile information</p>
          </motion.div>
        </header>
        
        <section className="profile-section">
          <div className="profile-container">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div 
                  className={`avatar-wrapper ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
                  onClick={handleAvatarClick}
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile avatar" className="profile-avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <FiUser />
                    </div>
                  )}
                  
                  <div className="avatar-overlay">
                    {uploading ? (
                      <div className="uploading-indicator">Uploading...</div>
                    ) : uploadSuccess ? (
                      <FiCheck className="success-icon" />
                    ) : (
                      <FiUpload />
                    )}
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <p className="avatar-help">Click to upload a profile picture</p>
              </div>
              
              <div className="profile-name">
                <h2>{profile?.full_name || 'User'}</h2>
                <p>{profile?.email || 'No email provided'}</p>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="profile-card">
                <div className="card-header">
                  <h3>Account Information</h3>
                  <Link to="/settings" className="edit-link">
                    <FiEdit />
                    <span>Edit</span>
                  </Link>
                </div>
                
                <div className="card-content">
                  <div className="info-item">
                    <div className="info-label">
                      <FiUser />
                      <span>Full Name</span>
                    </div>
                    <div className="info-value">{profile?.full_name || 'Not provided'}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <FiMail />
                      <span>Email</span>
                    </div>
                    <div className="info-value">{profile?.email || 'Not provided'}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <FiBriefcase />
                      <span>Company</span>
                    </div>
                    <div className="info-value">{profile?.company || 'Not provided'}</div>
                  </div>
                </div>
              </div>
              
              <div className="profile-card">
                <div className="card-header">
                  <h3>Security</h3>
                  <Link to="/settings" className="edit-link">
                    <FiEdit />
                    <span>Edit</span>
                  </Link>
                </div>
                
                <div className="card-content">
                  <div className="info-item">
                    <div className="info-label">
                      <FiCalendar />
                      <span>Password Last Changed</span>
                    </div>
                    <div className="info-value">{formatDate(security?.password_last_changed)}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <FiUser />
                      <span>Two-Factor Authentication</span>
                    </div>
                    <div className="info-value">
                      {security?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-card">
                <div className="card-header">
                  <h3>Notifications</h3>
                  <Link to="/settings" className="edit-link">
                    <FiEdit />
                    <span>Edit</span>
                  </Link>
                </div>
                
                <div className="card-content">
                  <div className="info-item">
                    <div className="info-label">
                      <FiBell />
                      <span>Email Notifications</span>
                    </div>
                    <div className="info-value">
                      {notifications?.email_notifications ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <FiBell />
                      <span>Product Updates</span>
                    </div>
                    <div className="info-value">
                      {notifications?.update_notifications ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <FiBell />
                      <span>Marketing Communications</span>
                    </div>
                    <div className="info-value">
                      {notifications?.marketing_notifications ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-card">
                <div className="card-header">
                  <h3>Preferences</h3>
                  <Link to="/settings" className="edit-link">
                    <FiEdit />
                    <span>Edit</span>
                  </Link>
                </div>
                
                <div className="card-content">
                  <div className="info-item">
                    <div className="info-label">
                      <FiGlobe />
                      <span>Language</span>
                    </div>
                    <div className="info-value">
                      {preferences?.language ? getLanguageName(preferences.language) : 'English (Default)'}
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      <FiGlobe />
                      <span>Timezone</span>
                    </div>
                    <div className="info-value">
                      {preferences?.timezone ? getTimezoneName(preferences.timezone) : 'UTC (Default)'}
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">
                      {preferences?.dark_mode ? <FiMoon /> : <FiSun />}
                      <span>Theme</span>
                    </div>
                    <div className="info-value">
                      {preferences?.dark_mode ? 'Dark Mode' : 'Light Mode'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  )
}

export default ProfilePage
