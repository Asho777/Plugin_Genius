import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar, FiDownload, FiCalendar, FiExternalLink, FiPlus } from 'react-icons/fi'
import { Plugin } from '../../pages/TemplatesPage'
import { savePlugin } from '../../services/pluginService'
import { useNavigate } from 'react-router-dom'

interface PluginDetailModalProps {
  plugin: Plugin
  onClose: () => void
}

const PluginDetailModal: React.FC<PluginDetailModalProps> = ({ plugin, onClose }) => {
  const navigate = useNavigate()

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden'
    
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])
  
  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)} million`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="star filled" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="star half" />)
      } else {
        stars.push(<FiStar key={i} className="star empty" />)
      }
    }
    
    return stars
  }

  const handleAddToProject = () => {
    // Save plugin to local storage
    savePlugin(plugin)
    
    // Close the modal
    onClose()
    
    // Navigate to My Plugins page
    navigate('/plugins')
  }
  
  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="plugin-detail-modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-button" onClick={onClose}>
            <FiX />
          </button>
          
          <div className="plugin-detail-header">
            <div className="plugin-detail-image">
              <img src={plugin.imageUrl} alt={plugin.name} />
            </div>
            
            <div className="plugin-detail-info">
              <h2 className="plugin-detail-title">{plugin.name}</h2>
              <p className="plugin-detail-author">by {plugin.author}</p>
              
              <div className="plugin-detail-rating">
                <div className="stars-container">
                  {renderStars(plugin.rating)}
                </div>
                <span className="rating-value">{plugin.rating.toFixed(1)}/5</span>
              </div>
              
              <div className="plugin-detail-meta">
                <div className="meta-item">
                  <FiDownload className="meta-icon" />
                  <span>{formatDownloads(plugin.downloads)} downloads</span>
                </div>
                
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>Updated {formatDate(plugin.lastUpdated)}</span>
                </div>
              </div>
              
              <div className="plugin-detail-actions">
                <button 
                  className="action-button primary"
                  onClick={handleAddToProject}
                >
                  <FiPlus />
                  <span>Add to My Project</span>
                </button>
                
                <a 
                  href={plugin.detailUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button secondary"
                >
                  <FiExternalLink />
                  <span>View on WordPress.org</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="plugin-detail-content">
            <div className="plugin-detail-description">
              <h3>Description</h3>
              <p>{plugin.description}</p>
            </div>
            
            <div className="plugin-detail-tags">
              <h3>Tags</h3>
              <div className="tags-container">
                {plugin.tags.map((tag, index) => (
                  <span key={index} className="plugin-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PluginDetailModal
