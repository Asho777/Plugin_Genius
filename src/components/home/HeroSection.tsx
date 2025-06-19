import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span>Create Powerful WordPress Plugins Without Coding</span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Plugin Genius helps you build, customize, and deploy WordPress plugins in minutes, not months.
        </motion.p>
        
        <motion.div 
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/plugins/create" className="hero-button primary">
            <span>Create Your Plugin</span>
            <FiArrowRight />
          </Link>
          <Link to="/templates" className="hero-button primary">
            <span>Wordpress Plugins</span>
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
      
      <motion.div 
        className="hero-image"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="hero-image-container">
          <img 
            src="https://hv85.com/ga/images/Plugin-Genius-Hero-Page-Image.png" 
            alt="Plugin Genius Dashboard" 
            className="hero-img"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
