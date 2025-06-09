import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiInfo, FiX } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MyPluginCard from '../components/plugins/MyPluginCard'
import { getSavedPlugins, removePlugin } from '../services/pluginService'
import { Plugin } from './TemplatesPage'
import { Link } from 'react-router-dom'
import '../styles/my-plugins.css'

const MyPluginsPage = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    // Load saved plugins from local storage
    const savedPlugins = getSavedPlugins()
    setPlugins(savedPlugins)
    setFilteredPlugins(savedPlugins)
  }, [])
  
  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const filtered = plugins.filter(plugin => 
        plugin.name.toLowerCase().includes(term) || 
        plugin.description.toLowerCase().includes(term) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(term))
      )
      setFilteredPlugins(filtered)
    } else {
      setFilteredPlugins(plugins)
    }
  }, [plugins, searchTerm])
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  const handleRemovePlugin = (pluginId: string) => {
    // Remove plugin from local storage
    removePlugin(pluginId)
    
    // Update state
    const updatedPlugins = plugins.filter(plugin => plugin.id !== pluginId)
    setPlugins(updatedPlugins)
  }

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
            {plugins.length === 0 ? (
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
            ) : filteredPlugins.length === 0 ? (
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
                    Showing <span>{filteredPlugins.length}</span> of <span>{plugins.length}</span> plugins
                  </p>
                </div>
                
                <div className="my-plugins-grid">
                  {filteredPlugins.map((plugin, index) => (
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
