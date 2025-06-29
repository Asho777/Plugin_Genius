import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiStar, FiDownload, FiInfo, FiX, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
  const [currentPage, setCurrentPage] = useState(1)
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
  const searchPlugins = async (term: string, page: number = 1, applyFilters = false) => {
    try {
      setLoading(true)
      setError(null)
      setCurrentSearchTerm(term) // Store the current search term
      setUseFilters(applyFilters) // Store whether to use filters
      setCurrentPage(page)
      
      // Clear existing plugins first
      setPaginatedData(null)
      
      // Fetch plugins from WordPress API
      const results = await fetchWordPressPlugins(term, page)
      
      // Check if results are relevant to the search term
      if (term && results.plugins.length === 0) {
        setError(`No plugins found for "${term}" on page ${page}. Try a different search term or go back to page 1.`)
      } else {
        setPaginatedData(results)
      }
    } catch (err) {
      setError('Failed to load plugins. Please try again later.')
      console.error('Error loading plugins:', err)
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
    searchPlugins(searchTerm, 1, showFilters) // Reset to page 1 for new search
  }
  
  // Handle quick search (without filters)
  const handleQuickSearch = () => {
    searchPlugins(searchTerm, 1, false) // Reset to page 1 and don't apply filters
  }
  
  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && paginatedData && newPage <= paginatedData.totalPages) {
      searchPlugins(currentSearchTerm, newPage, useFilters)
    }
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
                      searchPlugins('', 1)
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
                <button className="retry-button" onClick={() => searchPlugins(currentSearchTerm, currentPage, useFilters)}>
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
                    Showing <span>{filteredPlugins.length}</span> plugins on page <span>{currentPage}</span>
                    {currentSearchTerm && <span className="search-term"> for "{currentSearchTerm}"</span>}
                    {!currentSearchTerm && <span className="search-term"> (popular plugins)</span>}
                    {useFilters && <span className="filter-indicator"> with filters applied</span>}
                    {paginatedData && (
                      <span className="total-results"> (Total: {paginatedData.totalResults} results)</span>
                    )}
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
                
                {/* Pagination Controls */}
                {paginatedData && paginatedData.totalPages > 1 && (
                  <div className="pagination-container">
                    <div className="pagination-info">
                      <span>Page {currentPage} of {paginatedData.totalPages}</span>
                      <span className="pagination-total">({paginatedData.totalResults} total results)</span>
                    </div>
                    
                    <div className="pagination-controls">
                      <button 
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!paginatedData.hasPrevPage}
                      >
                        <FiChevronLeft />
                        <span>Previous</span>
                      </button>
                      
                      <div className="pagination-pages">
                        {/* Show page numbers */}
                        {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                          let pageNum;
                          if (paginatedData.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= paginatedData.totalPages - 2) {
                            pageNum = paginatedData.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button 
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!paginatedData.hasNextPage}
                      >
                        <span>Next</span>
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                )}
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