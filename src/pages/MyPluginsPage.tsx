import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiInfo, FiX, FiLoader } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MyPluginCard from '../components/plugins/MyPluginCard'
import { getSavedPlugins, removeSavedPlugin } from '../services/pluginService'
import { Plugin } from './TemplatesPage'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/my-plugins.css'

const MyPluginsPage = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Load saved plugins from Supabase
  const loadPlugins = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Please log in to view your saved plugins')
        setPlugins([])
        setFilteredPlugins([])
        return
      }

      const savedPlugins = await getSavedPlugins()
      // Ensure we always have an array
      const pluginsArray = Array.isArray(savedPlugins) ? savedPlugins : []
      setPlugins(pluginsArray)
      setFilteredPlugins(pluginsArray)
    } catch (err) {
      console.error('Error loading plugins:', err)
      setError('Failed to load your saved plugins')
      setPlugins([])
      setFilteredPlugins([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPlugins()
  }, [])
  
  useEffect(() => {
    // Ensure plugins is always an array before filtering
    if (!Array.isArray(plugins)) {
      setFilteredPlugins([])
      return
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const filtered = plugins.filter(plugin => 
        plugin.name.toLowerCase().includes(term) || 
        plugin.description.toLowerCase().includes(term) ||
        (plugin.tags && Array.isArray(plugin.tags) && plugin.tags.some(tag => tag.toLowerCase().includes(term)))
      )
      setFilteredPlugins(filtered)
    } else {
      setFilteredPlugins(plugins)
    }
  }, [plugins, searchTerm])
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  const handleRemovePlugin = async (pluginId: string) => {
    try {
      // Remove plugin from Supabase
      await removeSavedPlugin(pluginId)
      
      // Update local state - ensure we're working with arrays
      const updatedPlugins = Array.isArray(plugins) ? plugins.filter(plugin => plugin.id !== pluginId) : []
      setPlugins(updatedPlugins)
    } catch (err) {
      console.error('Error removing plugin:', err)
      alert('Failed to remove plugin. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="my-plugins-page">
        <Navbar />
        <main className="my-plugins-content">
          <div className="loading-container">
            <FiLoader className="loading-spinner" />
            <p>Loading your saved plugins...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-plugins-page">
        <Navbar />
        <main className="my-plugins-content">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={loadPlugins} className="retry-button">
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Ensure filteredPlugins is always an array before rendering
  const safeFilteredPlugins = Array.isArray(filteredPlugins) ? filteredPlugins : []
  const safePlugins = Array.isArray(plugins) ? plugins : []

  return (
    <div className="my-plugins-page">
      <Navbar />
      
      <main className="my-plugins-content">
        <section className="my-plugins-header">
          <div className="container">
            <motion.h1 
              className="page-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Plugins
            </motion.h1>
            
            <motion.p 
              className="page-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Manage your selected WordPress plugins for your custom solution
            </motion.p>
            
            <motion.div 
              className="search-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search your plugins..." 
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button className="search-clear" onClick={() => setSearchTerm('')}>
                    <FiX />
                  </button>
                )}
              </div>
              
              <Link to="/templates" className="add-plugin-button">
                <FiPlus />
                <span>Add More Plugins</span>
              </Link>
            </motion.div>
          </div>
        </section>
        
        <section className="my-plugins-list">
          <div className="container">
            {safePlugins.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="empty-state-icon">
                  <FiInfo />
                </div>
                <h2>No plugins added yet</h2>
                <p>Browse our template library to add WordPress plugins to your project.</p>
                <Link to="/templates" className="empty-state-button">
                  <FiPlus />
                  <span>Browse Plugins</span>
                </Link>
              </motion.div>
            ) : safeFilteredPlugins.length === 0 ? (
              <div className="no-results">
                <h3>No plugins found</h3>
                <p>Try adjusting your search to find what you're looking for.</p>
                <button className="filter-clear" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <p className="results-count">
                    Showing <span>{safeFilteredPlugins.length}</span> of <span>{safePlugins.length}</span> plugins
                  </p>
                </div>
                
                <div className="plugins-grid">
                  {safeFilteredPlugins.map((plugin, index) => (
                    <MyPluginCard 
                      key={plugin.id}
                      plugin={plugin}
                      onRemove={handleRemovePlugin}
                      delay={0.1 + (index % 12) * 0.05}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default MyPluginsPage
