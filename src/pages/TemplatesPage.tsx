import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiStar, FiDownload, FiInfo, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PluginCard from '../components/templates/PluginCard'
import PluginDetailModal from '../components/templates/PluginDetailModal'
import { fetchWordPressPlugins, PaginatedPluginResponse } from '../services/wordpressApi'
import '../styles/templates.css'

export interface Plugin {
  id: string
  name: string
  description: string
  author: string
  rating: number
  downloads: number
  lastUpdated: string
  tags: string[]
  imageUrl: string
  detailUrl: string
}

const TemplatesPage = () => {
  const [paginatedData, setPaginatedData] = useState<PaginatedPluginResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    minRating: 0,
    sortBy: 'popular'
  })
  const [useFilters, setUseFilters] = useState(false)
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'ecommerce', name: 'E-Commerce' },
    { id: 'seo', name: 'SEO' },
    { id: 'security', name: 'Security' },
    { id: 'social', name: 'Social Media' },
    { id: 'forms', name: 'Forms' },
    { id: 'gallery', name: 'Gallery' },
    { id: 'performance', name: 'Performance' }
  ]

  // Function to search for plugins
  const searchPlugins = async (term: string, applyFilters = false) => {
    try {
      setLoading(true)
      setError(null)
      setCurrentSearchTerm(term) // Store the current search term
      setUseFilters(applyFilters) // Store whether to use filters
      
      // Clear existing plugins first
      setPaginatedData(null)
      
      // Fetch plugins from WordPress API
      const results = await fetchWordPressPlugins(term)
      
      // Check if results are relevant to the search term
      if (term && results.plugins.length === 0) {
        setError(`No plugins found for "${term}". Try a different search term.`)
      } else {
        setPaginatedData(results)
        setIsUsingFallback(false)
      }
    } catch (err: any) {
      console.error('Error loading plugins:', err)
      
      // Use the specific error message from the service
      const errorMessage = err?.message || 'Failed to load plugins. Please try again later.'
      setError(errorMessage)
      
      // Check if this is a CORS/network error and we should show fallback data
      if (errorMessage.includes('network restrictions') || errorMessage.includes('Unable to connect')) {
        setIsUsingFallback(true)
        // You could optionally load mock data here as a fallback
        // For now, we'll just show the error message
      }
    } finally {
      setLoading(false)
    }
  }
  
  // Initial load - fetch popular plugins
  useEffect(() => {
    searchPlugins('')
  }, [])
  
  // Apply filters to the plugins (client-side filtering)
  const filteredPlugins = React.useMemo(() => {
    // If we're not using filters or don't have data, return all plugins
    if (!useFilters || !paginatedData) {
      return paginatedData?.plugins || []
    }
    
    let results = [...paginatedData.plugins]
    
    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(plugin => 
        plugin.tags.some(tag => tag.toLowerCase().includes(filters.category.toLowerCase()))
      )
    }
    
    // Apply rating filter
    if (filters.minRating > 0) {
      results = results.filter(plugin => plugin.rating >= filters.minRating)
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        results.sort((a, b) => b.downloads - a.downloads)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        results.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      default:
        break
    }
    
    return results
  }, [paginatedData, filters, useFilters])
  
  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchPlugins(searchTerm, showFilters)
  }
  
  // Handle quick search (without filters)
  const handleQuickSearch = () => {
    searchPlugins(searchTerm, false) // Don't apply filters
  }
  
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }
  
  const clearFilters = () => {
    setFilters({
      category: 'all',
      minRating: 0,
      sortBy: 'popular'
    })
  }
  
  const openPluginDetail = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
  }
  
  const closePluginDetail = () => {
    setSelectedPlugin(null)
  }

  return (
    <div className="templates-page">
      <Navbar />
      
      <main className="templates-content">
        <section className="templates-header">
          <div className="container">
            <motion.h1 
              className="page-title yellow-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ color: '#ffc107' }} // Inline style to force yellow color
            >
              Browse WordPress Plugins
            </motion.h1>
            
            <motion.p 
              className="page-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover and integrate popular WordPress plugins into your custom solution
            </motion.p>
            
            <motion.form 
              className="search-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearchSubmit}
            >
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search plugins..." 
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    className="search-clear" 
                    onClick={() => {
                      setSearchTerm('')
                      searchPlugins('')
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </div>
              
              <button 
                type="button"
                className={`filter-toggle ${showFilters ? 'active' : ''}`} 
                onClick={toggleFilters}
              >
                <FiFilter />
                <span>Filters</span>
                {showFilters ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              <button 
                type="button" 
                className="search-button quick-search" 
                onClick={handleQuickSearch}
              >
                Quick Search
              </button>
              
              <button type="submit" className="search-button">
                {showFilters ? "Search with Filters" : "Search"}
              </button>
            </motion.form>
            
            <motion.div 
              className="filters-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: showFilters ? 'auto' : 0,
                opacity: showFilters ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-content">
                <div className="filter-group">
                  <label className="filter-label">Category</label>
                  <select 
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Minimum Rating</label>
                  <select 
                    className="filter-select"
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Sort By</label>
                  <select 
                    className="filter-select"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Recently Updated</option>
                  </select>
                </div>
                
                <button className="filter-clear" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </motion.div>
            
            {/* Show notice if using fallback data */}
            {isUsingFallback && (
              <motion.div 
                className="fallback-notice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  margin: '16px 0',
                  color: '#856404'
                }}
              >
                <FiInfo style={{ display: 'inline', marginRight: '8px' }} />
                <strong>Demo Mode:</strong> Showing sample plugins due to API restrictions. In production, this would connect to the live WordPress.org API.
              </motion.div>
            )}
          </div>
        </section>
        
        <section className="templates-results">
          <div className="container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <motion.div 
                    className="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      ease: "linear" 
                    }}
                  />
                </div>
                <p>Loading plugins...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <FiInfo className="error-icon" />
                <p>{error}</p>
                <button className="retry-button" onClick={() => searchPlugins(currentSearchTerm, useFilters)}>
                  Try Again
                </button>
              </div>
            ) : filteredPlugins.length === 0 ? (
              <div className="no-results">
                <h3>No plugins found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button className="filter-clear" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <p className="results-count">
                    Showing <span>{filteredPlugins.length}</span> plugins
                    {currentSearchTerm && <span className="search-term"> for "{currentSearchTerm}"</span>}
                    {!currentSearchTerm && <span className="search-term"> (popular plugins)</span>}
                    {useFilters && <span className="filter-indicator"> with filters applied</span>}
                  </p>
                </div>
                
                <div className="plugins-grid">
                  {filteredPlugins.map((plugin, index) => (
                    <PluginCard 
                      key={plugin.id}
                      plugin={plugin}
                      onClick={() => openPluginDetail(plugin)}
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
      
      {selectedPlugin && (
        <PluginDetailModal 
          plugin={selectedPlugin}
          onClose={closePluginDetail}
        />
      )}
    </div>
  )
}

export default TemplatesPage