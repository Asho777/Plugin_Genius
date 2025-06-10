import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import Logo from '../common/Logo'
import { supabase } from '../../lib/supabase'
import { getUserProfile } from '../../services/settingsService'
import '../../styles/navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getUserProfile()
      if (profile && profile.avatar_url) {
        setAvatarUrl(profile.avatar_url)
      }
    }
    
    fetchUserProfile()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isUserMenuOpen) setIsUserMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
    } else {
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home" className="logo-link">
            <Logo size="small" />
            <div className="logo-text">Plugin <span>Genius</span></div>
          </Link>
        </div>

        <div className="navbar-links-desktop">
          <Link to="/home" className="navbar-link">Home</Link>
          <Link to="/plugins" className="navbar-link">My Plugins</Link>
          <Link to="/docs" className="navbar-link">Documentation</Link>
        </div>

        <div className="navbar-actions">
          <motion.button 
            className="user-menu-button"
            onClick={toggleUserMenu}
            whileTap={{ scale: 0.95 }}
          >
            <div className="user-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User avatar" className="avatar-image" />
              ) : (
                <FiUser />
              )}
            </div>
          </motion.button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div 
                className="user-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/profile" className="dropdown-item">
                  <FiUser />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <FiSettings />
                  <span>Settings</span>
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <FiLogOut />
                  <span>Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/home" className="mobile-link" onClick={toggleMenu}>Home</Link>
            <Link to="/plugins" className="mobile-link" onClick={toggleMenu}>My Plugins</Link>
            <Link to="/docs" className="mobile-link" onClick={toggleMenu}>Documentation</Link>
            <button onClick={handleLogout} className="mobile-link logout">
              <FiLogOut />
              <span>Log Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
