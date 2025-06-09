import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import Logo from '../components/common/Logo'
import '../styles/auth.css'

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  // Function to handle successful registration
  const handleRegistrationSuccess = () => {
    setActiveTab('login')
  }

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      
      <header className="auth-header">
        <div className="auth-logo">
          <Logo />
          <div className="auth-logo-text">Plugin <span>Genius</span></div>
        </div>
      </header>
      
      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          
          <div className="auth-form-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'login' ? (
                  <LoginForm />
                ) : (
                  <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthPage
