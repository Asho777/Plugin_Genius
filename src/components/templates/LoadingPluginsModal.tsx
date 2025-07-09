import React from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'

interface LoadingPluginsModalProps {
  isVisible: boolean
}

const LoadingPluginsModal: React.FC<LoadingPluginsModalProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="loading-plugins-overlay">
      <motion.div 
        className="loading-plugins-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="loading-plugins-content">
          <div className="loading-plugins-icon">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "linear" 
              }}
            >
              <FiSearch size={40} />
            </motion.div>
          </div>
          
          <h3 className="loading-plugins-title">Searching For Your Plugins</h3>
          
          <div className="loading-plugins-spinner">
            <motion.div 
              className="spinner-ring"
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" 
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingPluginsModal
