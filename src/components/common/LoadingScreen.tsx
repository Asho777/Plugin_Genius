import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'
import '../../styles/loading.css'

const LoadingScreen = () => {
  // Force scroll to top when loading screen appears
  useEffect(() => {
    // Force scroll to top with multiple approaches
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    };
    
    // Reset scroll immediately
    resetScroll();
    
    // Also try with a slight delay
    const timer = setTimeout(resetScroll, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
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
