import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

interface PluginOptionProps {
  title: string
  description: string
  icon: React.ReactNode
  to: string
  delay?: number
}

const PluginOption: React.FC<PluginOptionProps> = ({ title, description, icon, to, delay = 0 }) => {
  return (
    <motion.div 
      className="plugin-option"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="plugin-option-icon">
        {icon}
      </div>
      <h3 className="plugin-option-title">{title}</h3>
      <p className="plugin-option-description">{description}</p>
      <Link to={to} className="plugin-option-link">
        Learn More <FiArrowRight />
      </Link>
    </motion.div>
  )
}

export default PluginOption
