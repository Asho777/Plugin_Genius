import React from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiDownload, FiTrash2, FiExternalLink } from 'react-icons/fi'
import { Plugin } from '../../pages/TemplatesPage'

interface MyPluginCardProps {
  plugin: Plugin
  onRemove: (pluginId: string) => void
  delay?: number
}

const MyPluginCard: React.FC<MyPluginCardProps> = ({ plugin, onRemove, delay = 0 }) => {
  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M+`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K+`
    }
    return count.toString()
  }
  
  return (
    <motion.div 
      className="plugin-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="plugin-card-image">
        <img src={plugin.imageUrl} alt={plugin.name} />
      </div>
      
      <div className="plugin-card-content">
        <h3 className="plugin-card-title">{plugin.name}</h3>
        
        <p className="plugin-card-author">by {plugin.author}</p>
        
        <p className="plugin-card-description">
          {plugin.description.length > 100 
            ? `${plugin.description.substring(0, 100)}...` 
            : plugin.description}
        </p>
        
        <div className="plugin-card-meta">
          <div className="plugin-card-rating">
            <FiStar className="rating-icon" />
            <span>{plugin.rating ? plugin.rating.toFixed(1) : 'N/A'}</span>
          </div>
          
          <div className="plugin-card-downloads">
            <FiDownload className="downloads-icon" />
            <span>{plugin.downloads ? formatDownloads(plugin.downloads) : '0'}</span>
          </div>
        </div>
        
        <div className="plugin-card-tags">
          {plugin.tags && plugin.tags.length > 0 ? (
            <>
              {plugin.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="plugin-tag">{tag}</span>
              ))}
              {plugin.tags.length > 3 && (
                <span className="plugin-tag-more">+{plugin.tags.length - 3}</span>
              )}
            </>
          ) : (
            <span className="plugin-tag">No tags</span>
          )}
        </div>
      </div>
      
      <div className="plugin-card-footer">
        <div className="plugin-card-actions">
          <a 
            href={plugin.detailUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="plugin-action-button view"
          >
            <FiExternalLink />
            <span>View Details</span>
          </a>
          
          <button 
            className="plugin-action-button remove"
            onClick={() => onRemove(plugin.id)}
          >
            <FiTrash2 />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MyPluginCard
