import React from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'
import '../../styles/loading.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <motion.div 
        className="loading-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="large" />
        <div className="loading-text">Plugin <span>Genius</span></div>
        <div className="loading-spinner">
          <motion.div 
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
