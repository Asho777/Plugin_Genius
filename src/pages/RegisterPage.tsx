import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import Logo from '../components/common/Logo'
import '../styles/auth.css'

const RegisterPage = () => {
  const navigate = useNavigate()
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
            },
          },
        })
        
        if (error) {
          throw error
        }
        
        // Redirect to login page after successful registration
        navigate('/')
      } catch (error: any) {
        setStatus(error.message || 'An error occurred during registration')
      } finally {
        setSubmitting(false)
      }
    },
  })

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
          <motion.div 
            className="auth-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Plugin Genius to build your custom WordPress solution</p>
            
            {formik.status && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{formik.status}</span>
              </div>
            )}
            
            <form onSubmit={formik.handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className="error-message">{formik.errors.name}</div>
                ) : null}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-message">{formik.errors.email}</div>
                ) : null}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="error-message">{formik.errors.password}</div>
                ) : null}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="error-message">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/">Sign In</Link></p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage
