import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiStar, FiDownload, FiExternalLink, FiFilter, FiGrid, FiList, FiLoader } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { fetchWordPressPlugins } from '../services/wordpressApi'
import '../styles/templates.css'
import { useScrollReset } from '../hooks/useScrollReset'

// Force scroll to top immediately before component even renders
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

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
  // Use the scroll reset hook
  useScrollReset();
  
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Categories for filtering
  const categories = [
    'all',
    'ecommerce',
    'seo',
    'security',
    'performance',
    'social',
    'forms',
    'gallery',
    'backup',
    'analytics'
  ]

  // Load initial plugins on component mount
  useEffect(() => {
    loadPlugins()
  }, [])

  // Filter and sort plugins when dependencies change
  useEffect(() => {
    filterAndSortPlugins()
  }, [plugins, searchTerm, selectedCategory, sortBy])

  const loadPlugins = async (searchQuery = '') => {
    setIsLoading(true)
    setError(null)
    
    try {
      const fetchedPlugins = await fetchWordPressPlugins(searchQuery)
      setPlugins(fetchedPlugins)
      setHasSearched(!!searchQuery)
    } catch (err) {
      console.error('Error loading plugins:', err)
      setError('Failed to load WordPress plugins. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadPlugins(searchTerm)
  }

  const filterAndSortPlugins = () => {
    let filtered = [...plugins]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plugin => {
        const pluginTags = Array.isArray(plugin.tags) ? plugin.tags : []
        return pluginTags.some(tag => 
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      })
    }

    // Sort plugins
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'popularity':
        default:
          return b.downloads - a.downloads
      }
    })

    setFilteredPlugins(filtered)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Unknown'
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} className="star filled" />)
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="star half" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="star" />)
    }

    return stars
  }

  return (
    <div className="templates-page">
      <Navbar />
      
      {/* Loading Popup */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="loading-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="loading-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="loading-popup-content">
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "linear" 
                  }}
                >
                  <FiLoader />
                </motion.div>
                <h3 className="loading-popup-title">Searching for your Plugins</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="templates-content">
        <header className="templates-header">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="page-title">Browse WordPress Plugins</h1>
            <p className="page-subtitle">Discover and explore thousands of professional WordPress plugins from the official repository</p>
          </motion.div>
        </header>

        <section className="search-section">
          <div className="container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-container">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search WordPress plugins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button" disabled={isLoading}>
                  {isLoading ? <FiLoader className="icon-spin" /> : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="filters-section">
          <div className="container">
            <div className="filters-container">
              <div className="filter-group">
                <label className="filter-label">
                  <FiFilter />
                  Category:
                </label>
                <select
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort by:</label>
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="downloads">Downloads</option>
                  <option value="updated">Last Updated</option>
                </select>
              </div>

              <div className="view-controls">
                <button
                  className={`view-control ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button
                  className={`view-control ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="plugins-section">
          <div className="container">
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => loadPlugins(searchTerm)} className="retry-button">
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && filteredPlugins.length === 0 && hasSearched && (
              <div className="no-results">
                <h3>No plugins found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
            )}

            {!isLoading && !error && filteredPlugins.length > 0 && (
              <div className="plugins-results">
                <div className="results-header">
                  <p className="results-count">
                    {filteredPlugins.length} plugin{filteredPlugins.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className={`plugins-grid ${viewMode}`}>
                  {filteredPlugins.map((plugin, index) => {
                    const pluginTags = Array.isArray(plugin.tags) ? plugin.tags : []
                    
                    return (
                      <motion.div
                        key={plugin.id}
                        className="plugin-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="plugin-image">
                          <img
                            src={plugin.imageUrl}
                            alt={plugin.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://s.w.org/plugins/geopattern-icon/default.svg';
                            }}
                          />
                        </div>
                        
                        <div className="plugin-content">
                          <h3 className="plugin-title">{plugin.name}</h3>
                          <p className="plugin-author">by {plugin.author}</p>
                          <p className="plugin-description">{plugin.description}</p>
                          
                          <div className="plugin-meta">
                            <div className="plugin-rating">
                              <div className="stars">
                                {renderStars(plugin.rating)}
                              </div>
                              <span className="rating-text">({plugin.rating.toFixed(1)})</span>
                            </div>
                            
                            <div className="plugin-stats">
                              <span className="stat">
                                <FiDownload />
                                {formatNumber(plugin.downloads)}
                              </span>
                              <span className="stat">
                                Updated: {formatDate(plugin.lastUpdated)}
                              </span>
                            </div>
                          </div>

                          <div className="plugin-tags">
                            {pluginTags.slice(0, 3).map(tag => (
                              <span key={tag} className="plugin-tag">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div className="plugin-actions">
                          <a
                            href={plugin.detailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="plugin-action primary"
                          >
                            <FiExternalLink />
                            View Details
                          </a>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default TemplatesPage
