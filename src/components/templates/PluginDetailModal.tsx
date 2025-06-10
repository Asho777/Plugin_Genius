import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar, FiDownload, FiCalendar, FiExternalLink, FiBookmark, FiCheck } from 'react-icons/fi'
import { Plugin } from '../../pages/TemplatesPage'
import { savePlugin, getSavedPlugins } from '../../services/pluginService'

interface PluginDetailModalProps {
  plugin: Plugin
  onClose: () => void
}

const PluginDetailModal: React.FC<PluginDetailModalProps> = ({ plugin, onClose }) => {
  const savedPlugins = getSavedPlugins()
  const isAlreadySaved = savedPlugins.some(p => p.id === plugin.id)
  
  const handleSavePlugin = () => {
    savePlugin(plugin)
    // Force re-render to update the button state
    window.location.reload()
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)} million`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }
  
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="star filled" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="star half" />)
      } else {
        stars.push(<FiStar key={i} className="star" />)
      }
    }
    
    return stars
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="plugin-detail-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={e => e.stopPropagation()}
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
                <span className="rating-value">{plugin.rating.toFixed(1)} out of 5</span>
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
                <a 
                  href={plugin.detailUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button secondary"
                >
                  <FiExternalLink />
                  <span>View on WordPress.org</span>
                </a>
                
                {isAlreadySaved ? (
                  <button className="action-button primary" disabled>
                    <FiCheck />
                    <span>Added to My Plugins</span>
                  </button>
                ) : (
                  <button className="action-button primary" onClick={handleSavePlugin}>
                    <FiBookmark />
                    <span>Add to My Plugins</span>
                  </button>
                )}
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
      </motion.div>
    </AnimatePresence>
  )
}

export default PluginDetailModal
