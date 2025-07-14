import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiEdit, FiUser, FiMail, FiBriefcase, FiCalendar, FiGlobe, FiBell, FiMoon, FiSun, FiUpload, FiCheck, FiAlertCircle, FiShield } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AvatarImage from '../components/common/AvatarImage'
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
import { supabase } from '../lib/supabase'
import '../styles/profile.css'

interface UserRole {
  id: string
  name: string
  level: number
  description: string
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [security, setSecurity] = useState<UserSecurity | null>(null)
  const [notifications, setNotifications] = useState<UserNotifications | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('No authenticated user found')
        return
      }

      console.log('Fetching role for user:', user.id)

      // Query by user_id, not id
      const { data: profileCheck, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)  // Changed from 'id' to 'user_id'
        .maybeSingle()

      console.log('Profile check result:', { profileCheck, profileError })

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return
      }

      if (!profileCheck) {
        console.log('No user profile found, creating one...')
        // If user profile doesn't exist, let's create one with default role
        const { data: defaultRole } = await supabase
          .from('user_roles')
          .select('*')
          .eq('name', 'User')
          .single()

        if (defaultRole) {
          console.log('Creating user profile with default role:', defaultRole)
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,  // Use user_id, not id
              email: user.email,
              role_id: defaultRole.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            return
          }

          if (newProfile) {
            setUserRole(defaultRole)
            console.log('User profile created with role:', defaultRole)
          }
        }
        return
      }

      // Now fetch the role information
      if (profileCheck?.role_id) {
        console.log('Fetching role for role_id:', profileCheck.role_id)
        
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('id', profileCheck.role_id)
          .single()

        console.log('Role fetch result:', { roleData, roleError })

        if (roleError) {
          console.error('Error fetching role:', roleError)
          return
        }

        if (roleData) {
          console.log('Setting user role:', roleData)
          setUserRole(roleData as UserRole)
        }
      } else {
        console.log('No role_id found in profile, assigning default role')
        // Assign default role if none exists
        const { data: defaultRole } = await supabase
          .from('user_roles')
          .select('*')
          .eq('name', 'User')
          .single()

        if (defaultRole) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ role_id: defaultRole.id })
            .eq('user_id', user.id)  // Changed from 'id' to 'user_id'

          if (!updateError) {
            setUserRole(defaultRole)
            console.log('Default role assigned:', defaultRole)
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error)
    }
  }

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
        
        // Fetch user role
        await fetchUserRole()
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
    
    // Reset states
    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)
    
    try {
      console.log('Starting avatar upload for file:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      const avatarUrl = await uploadAvatar(file)
      console.log('Upload completed, received URL:', avatarUrl)
      
      if (avatarUrl && profile) {
        // Refresh the profile data to get the updated avatar_url
        const updatedProfile = await getUserProfile()
        
        if (updatedProfile) {
          console.log('Profile refreshed with new avatar:', updatedProfile.avatar_url)
          setProfile(updatedProfile)
          setUploadSuccess(true)
          setTimeout(() => setUploadSuccess(false), 3000)
          
          // Notify other components about the profile update
          localStorage.setItem('profileUpdated', new Date().toISOString())
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'profileUpdated',
            newValue: new Date().toISOString()
          }))
          window.dispatchEvent(new Event('profileUpdated'))
        } else {
          console.warn('Could not refresh profile after upload')
          // Still update the local state with the returned URL
          setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null)
          setUploadSuccess(true)
          setTimeout(() => setUploadSuccess(false), 3000)
        }
      } else {
        throw new Error('Upload failed - no URL returned')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      setTimeout(() => setUploadError(null), 5000)
    } finally {
      setUploading(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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
            <div className="profile-sidebar">
              <div className="profile-avatar-section">
                <div className="avatar-container">
                  <div className="avatar-wrapper" onClick={handleAvatarClick}>
                    <AvatarImage 
                      src={profile?.avatar_url} 
                      alt="Profile Avatar"
                      fallbackText={profile?.full_name?.charAt(0) || 'U'}
                      size="lg"
                    />
                    <div className="avatar-overlay">
                      <FiUpload />
                      <span>Change Photo</span>
                    </div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  
                  {uploading && (
                    <div className="upload-status uploading">
                      <div className="upload-spinner"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                  
                  {uploadSuccess && (
                    <div className="upload-status success">
                      <FiCheck />
                      <span>Photo updated!</span>
                    </div>
                  )}
                  
                  {uploadError && (
                    <div className="upload-status error">
                      <FiAlertCircle />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
                
                <div className="profile-info">
                  <h2>{profile?.full_name || 'User'}</h2>
                  <p>{profile?.email}</p>
                  {profile?.company && <p className="company">{profile.company}</p>}
                  
                  {userRole && (
                    <div className="user-role-info">
                      <div className="role-level">
                        <FiShield />
                        <span className="role-name">{userRole.name}</span>
                        <span className="role-level-number">Level {userRole.level}</span>
                      </div>
                      <p className="role-message">This is Your Current Access Level</p>
                    </div>
                  )}
                </div>
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
