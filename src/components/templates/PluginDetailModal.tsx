import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar, FiDownload, FiCalendar, FiExternalLink, FiBookmark, FiCheck } from 'react-icons/fi'
import { Plugin } from '../../pages/TemplatesPage'
import { savePlugin, getSavedPlugins } from '../../services/pluginService'
import { useNavigate } from 'react-router-dom'

interface PluginDetailModalProps {
  plugin: Plugin
  onClose: () => void
}

const PluginDetailModal: React.FC<PluginDetailModalProps> = ({ plugin, onClose }) => {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  
  // Check if plugin is saved on component mount
  useEffect(() => {
    const savedPlugins = getSavedPlugins()
    const pluginIsSaved = savedPlugins.some(p => p.id === plugin.id)
    setIsSaved(pluginIsSaved)
  }, [plugin.id])
  
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
  
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  
  const handleViewOnWordPress = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(plugin.detailUrl, '_blank')
  }
  
  const handleAddToMyPlugins = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isSaved) {
      savePlugin(plugin)
      setIsSaved(true)
    }
    
    // Navigate to the correct route
    navigate('/my-plugins')
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
          onClick={handleModalClick}
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
              
              {/* Separate action buttons from rating */}
              <div className="plugin-detail-actions" style={{ marginTop: '20px' }}>
                <button 
                  className="action-button secondary"
                  onClick={handleViewOnWordPress}
                  type="button"
                >
                  <FiExternalLink />
                  <span>View on WordPress.org</span>
                </button>
                
                <button 
                  className="action-button secondary"
                  onClick={handleAddToMyPlugins}
                  type="button"
                >
                  {isSaved ? (
                    <>
                      <FiCheck />
                      <span>Added to My Plugins</span>
                    </>
                  ) : (
                    <>
                      <FiBookmark />
                      <span>Add to My Plugins</span>
                    </>
                  )}
                </button>
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
