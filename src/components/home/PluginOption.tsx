import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

interface PluginOptionProps {
  title: string
  description: string
  icon: React.ReactNode
  to: string
  delay?: number
}

const PluginOption: React.FC<PluginOptionProps> = ({ 
  title, 
  description, 
  icon, 
  to,
  delay = 0 
}) => {
  return (
    <motion.div 
      className="plugin-option"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="plugin-option-icon">
        {icon}
      </div>
      <h3 className="plugin-option-title">{title}</h3>
      <p className="plugin-option-description">{description}</p>
      <Link to={to} className="plugin-option-link">
        <span>Get Started</span>
        <FiArrowRight />
      </Link>
    </motion.div>
  )
}

export default PluginOption
