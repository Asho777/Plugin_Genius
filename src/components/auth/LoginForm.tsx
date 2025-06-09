import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'

interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
})

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    setAuthError(null) // Clear any previous errors
    
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      
      if (error) {
        // Handle authentication error
        console.error('Login error:', error)
        
        // Set appropriate error message based on error type
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('These login details are not recognized. Please check your email and password.')
        } else {
          setAuthError(error.message || 'An error occurred during sign in')
        }
        return
      }
      
      // If login is successful, store remember me preference if needed
      if (values.rememberMe && data.user) {
        // Store user preference in plugin_genius table
        const { error: profileError } = await supabase
          .from('plugin_genius')
          .upsert({
            user_id: data.user.id,
            email: data.user.email,
            remember_me: values.rememberMe
          }, { onConflict: 'user_id' })
        
        if (profileError) {
          console.error('Error saving preferences:', profileError)
        }
      }
      
      // Redirect or update UI state on successful login
      console.log('Login successful:', data)
      // Redirect would happen here in a real app
      
    } catch (err) {
      console.error('Unexpected error during login:', err)
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="auth-form">
          {/* Authentication Error Alert */}
          <AnimatePresence>
            {authError && (
              <motion.div 
                className="auth-error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FiAlertCircle />
                <span>{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="form-input-wrapper">
              <Field
                id="email"
                name="email"
                type="email"
                className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                placeholder="your@email.com"
              />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="form-input-wrapper">
              <Field
                id="password"
                name="password"
                type="password"
                className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>
          </div>

          <div className="form-footer">
            <label className="checkbox-container">
              <Field type="checkbox" name="rememberMe" className="checkbox-input" />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Signing in...' : (
              <>
                Sign In <FiLogIn />
              </>
            )}
          </motion.button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
