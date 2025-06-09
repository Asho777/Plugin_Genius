import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCode } from 'react-icons/fi'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import '../styles/auth.css'

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  const switchToRegister = () => {
    setActiveTab('register')
  }

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      
      <header className="auth-header">
        <div className="auth-logo">
          <FiCode size={24} color="#ffd700" />
          <h1 className="auth-logo-text">Plugin <span>Genius</span></h1>
        </div>
      </header>
      
      <div className="auth-container">
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
              Create Account
            </button>
          </div>
          
          <div className="auth-form-container">
            {activeTab === 'login' ? (
              <>
                <LoginForm />
                <div className="auth-footer">
                  Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchToRegister(); }}>Create one now</a>
                </div>
              </>
            ) : (
              <>
                <RegisterForm onRegistrationSuccess={() => setActiveTab('login')} />
                <div className="auth-footer">
                  Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Sign in</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
