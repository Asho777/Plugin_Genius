import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiUser, FiMail, FiLock, FiUserPlus, FiCheckCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'

interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface RegisterFormProps {
  onRegistrationSuccess: () => void;
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
})

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistrationSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true)
    setRegistrationError(null)
    
    try {
      // Attempt to register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name
          }
        }
      })
      
      if (error) {
        console.error('Registration error:', error)
        setRegistrationError(error.message || 'An error occurred during registration')
        return
      }
      
      console.log('Registration successful:', data)
      
      // Insert user data into plugin_genius table
      if (data.user) {
        const { error: insertError } = await supabase
          .from('plugin_genius')
          .insert([
            { 
              user_id: data.user.id,
              name: values.name,
              email: values.email,
              agree_to_terms: values.agreeToTerms
            }
          ])
        
        if (insertError) {
          console.error('Error inserting user data:', insertError)
          // We don't want to show this error to the user as the auth part succeeded
          // Just log it for debugging purposes
        } else {
          console.log('User data inserted successfully into plugin_genius table')
        }
      }
      
      // Show success message briefly before redirecting
      setRegistrationSuccess(true)
      
      // Wait 1.5 seconds before redirecting to login
      setTimeout(() => {
        onRegistrationSuccess()
      }, 1500)
      
    } catch (err) {
      console.error('Unexpected error during registration:', err)
      setRegistrationError('An unexpected error occurred. Please try again.')
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
          {/* Registration Error Alert */}
          <AnimatePresence>
            {registrationError && (
              <motion.div 
                className="auth-error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FiUser />
                <span>{registrationError}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Registration Success Message */}
          <AnimatePresence>
            {registrationSuccess && (
              <motion.div 
                className="auth-success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FiCheckCircle />
                <span>Account created successfully! Redirecting to login...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="form-input-wrapper">
              <Field
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                placeholder="John Doe"
              />
              <ErrorMessage name="name" component="div" className="form-error" />
            </div>
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="form-input-wrapper">
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <ErrorMessage name="confirmPassword" component="div" className="form-error" />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-container">
              <Field type="checkbox" name="agreeToTerms" className="checkbox-input" />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">
                I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
              </span>
            </label>
            <ErrorMessage name="agreeToTerms" component="div" className="form-error" />
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || registrationSuccess}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Creating account...' : (
              <>
                Create Account <FiUserPlus />
              </>
            )}
          </motion.button>

          <div className="auth-footer">
            Already have an account? <a href="#" onClick={(e) => {
              e.preventDefault();
              onRegistrationSuccess();
            }}>Sign in</a>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
