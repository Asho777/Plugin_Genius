import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

const LoginForm = () => {
  const navigate = useNavigate()
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })
        
        if (error) {
          throw error
        }
        
        navigate('/home')
      } catch (error: any) {
        setStatus(error.message || 'An error occurred during sign in')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div>
      <h1 className="auth-title">Sign In</h1>
      <p className="auth-subtitle">Welcome back! Sign in to your account</p>
      
      {formik.status && (
        <div className="auth-error">
          <FiAlertCircle />
          <span>{formik.status}</span>
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
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
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
