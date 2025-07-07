import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { supabase, handleLogout } from '../../lib/supabase'
import Logo from '../common/Logo'
import AvatarImage from '../common/AvatarImage'
import '../../styles/navbar.css'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log('Fetching profile for user:', user.id)
        
        // Get user profile from user_profiles table
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, avatar_url, email, company')
          .eq('user_id', user.id)
          .single()
        
        if (data && !error) {
          console.log('Successfully fetched user profile:', data)
          setUserName(data.full_name || user.email?.split('@')[0])
          setUserAvatar(data.avatar_url)
        } else {
          console.error('Error fetching profile from user_profiles:', error)
          // Fallback to user email
          setUserName(user.email?.split('@')[0] || 'User')
          setUserAvatar(null)
        }
      } else {
        console.log('No authenticated user found')
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  // Initial fetch on component mount
  useEffect(() => {
    console.log('Navbar mounted, fetching profile')
    fetchUserProfile()
  }, [])

  // Re-fetch profile when location changes (e.g., after visiting profile page)
  useEffect(() => {
    console.log('Location changed, fetching profile')
    fetchUserProfile()
  }, [location.pathname])

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    // Handle clicks outside profile menu
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Listen for custom event to detect profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('Profile update detected, fetching profile')
      fetchUserProfile()
    }

    // Listen for both storage events and custom events
    window.addEventListener('storage', (event) => {
      if (event.key === 'profileUpdated') {
        handleProfileUpdate()
      }
    })
    
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('storage', handleProfileUpdate)
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">
            <Logo />
            <span className="logo-text">Plugin <span>Genius</span></span>
          </Link>
        </div>
        
        <div className="navbar-links-desktop">
          <Link to="/home" className={`navbar-link ${isActive('/home') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/templates" className={`navbar-link ${isActive('/templates') ? 'active' : ''}`}>
            Wordpress Plugins
          </Link>
          <Link to="/plugins" className={`navbar-link ${isActive('/plugins') ? 'active' : ''}`}>
            My Plugins
          </Link>
          <Link to="/docs" className={`navbar-link ${isActive('/docs') ? 'active' : ''}`}>
            Documentation
          </Link>
        </div>
        
        <div className="navbar-actions">
          <div className="profile-menu-container" ref={profileMenuRef}>
            <button className="profile-button" onClick={toggleProfileMenu}>
              <div className="avatar">
                <AvatarImage
                  src={userAvatar}
                  alt="User avatar"
                  fallbackText={userName?.charAt(0) || 'U'}
                  className="navbar-avatar"
                />
              </div>
              <span className="username">{userName}</span>
              <FiChevronDown className={`dropdown-icon ${profileMenuOpen ? 'open' : ''}`} />
            </button>
            
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div 
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/profile" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                    <FiUser />
                    <span>Profile</span>
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                    <FiSettings />
                    <span>Settings</span>
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/home" className={`mobile-link ${isActive('/home') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/templates" className={`mobile-link ${isActive('/templates') ? 'active' : ''}`}>
              Wordpress Plugins
            </Link>
            <Link to="/plugins" className={`mobile-link ${isActive('/plugins') ? 'active' : ''}`}>
              My Plugins
            </Link>
            <Link to="/docs" className={`mobile-link ${isActive('/docs') ? 'active' : ''}`}>
              Documentation
            </Link>
            <Link to="/profile" className="mobile-link">
              Profile
            </Link>
            <Link to="/settings" className="mobile-link">
              Settings
            </Link>
            <button className="mobile-link logout" onClick={handleLogout}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
