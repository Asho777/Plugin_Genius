import { Plugin } from '../pages/TemplatesPage'

// WordPress.org REST API endpoint for plugins
const WP_API_URL = 'https://api.wordpress.org/plugins/info/1.2/'

// Interface for WordPress API response
interface WordPressApiResponse {
  info: {
    page: number
    pages: number
    results: number
  }
  plugins: Array<{
    name: string
    slug: string
    version: string
    author: string
    author_profile: string
    requires: string
    tested: string
    requires_php: string
    rating: number
    ratings: Record<string, number>
    num_ratings: number
    support_threads: number
    support_threads_resolved: number
    active_installs: number
    downloaded: number
    last_updated: string
    added: string
    homepage: string
    short_description: string
    description: string
    download_link: string
    tags: Record<string, string>
    donate_link: string
    icons: {
      '1x'?: string
      '2x'?: string
      default: string
    }
  }>
}

// Enhanced WordPress Plugin Scraper Class
class WordPressPluginScraper {
  private baseUrl: string
  private searchUrl: string

  constructor() {
    this.baseUrl = 'https://api.wordpress.org/plugins/info/1.2/'
    this.searchUrl = 'https://api.wordpress.org/plugins/info/1.2/?action=query_plugins'
  }

  // Search for plugins by term with enhanced filtering
  async searchPlugins(searchTerm: string, limit = 50): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        'request[search]': searchTerm,
        'request[per_page]': limit.toString(),
        'request[page]': '1',
        'request[fields][short_description]': 'true',
        'request[fields][rating]': 'true',
        'request[fields][ratings]': 'true',
        'request[fields][downloaded]': 'true',
        'request[fields][last_updated]': 'true',
        'request[fields][active_installs]': 'true',
        'request[fields][tags]': 'true',
        'request[fields][icons]': 'true'
      })

      const response = await fetch(`${this.searchUrl}&${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return this.processPluginData(data.plugins || [], searchTerm)
    } catch (error) {
      console.error('Error searching plugins:', error)
      throw error
    }
  }

  // Process and filter plugin data to ensure search term matching
  private processPluginData(plugins: any[], searchTerm: string): any[] {
    const lowerSearchTerm = searchTerm.toLowerCase()
    
    // Filter plugins that match the search term in name, description, or tags
    const filteredPlugins = plugins.filter(plugin => {
      const name = plugin.name?.toLowerCase() || ''
      const description = plugin.short_description?.toLowerCase() || ''
      const tags = Object.keys(plugin.tags || {}).join(' ').toLowerCase()
      
      return name.includes(lowerSearchTerm) || 
             description.includes(lowerSearchTerm) || 
             tags.includes(lowerSearchTerm)
    })

    return filteredPlugins.map(plugin => ({
      name: plugin.name,
      slug: plugin.slug,
      version: plugin.version,
      author: plugin.author,
      author_profile: plugin.author_profile,
      requires: plugin.requires,
      tested: plugin.tested,
      requires_php: plugin.requires_php,
      rating: plugin.rating,
      num_ratings: plugin.num_ratings,
      active_installs: plugin.active_installs,
      downloaded: plugin.downloaded,
      last_updated: plugin.last_updated,
      short_description: plugin.short_description,
      download_link: plugin.download_link,
      homepage: plugin.homepage,
      tags: Object.keys(plugin.tags || {}),
      icons: plugin.icons,
      plugin_url: `https://wordpress.org/plugins/${plugin.slug}/`
    }))
  }

  // Search with multiple pages to get more results
  async searchPluginsMultiPage(searchTerm: string, totalLimit = 50): Promise<any[]> {
    const perPage = 24 // WordPress API default
    const pages = Math.ceil(totalLimit / perPage)
    let allPlugins: any[] = []

    for (let page = 1; page <= pages; page++) {
      try {
        const params = new URLSearchParams({
          'request[search]': searchTerm,
          'request[per_page]': perPage.toString(),
          'request[page]': page.toString(),
          'request[fields][short_description]': 'true',
          'request[fields][rating]': 'true',
          'request[fields][ratings]': 'true',
          'request[fields][downloaded]': 'true',
          'request[fields][last_updated]': 'true',
          'request[fields][active_installs]': 'true',
          'request[fields][tags]': 'true',
          'request[fields][icons]': 'true'
        })

        const response = await fetch(`${this.searchUrl}&${params}`)
        
        if (!response.ok) {
          console.warn(`Page ${page} failed with status: ${response.status}`)
          continue
        }

        const data = await response.json()
        const plugins = data.plugins || []
        
        if (plugins.length === 0) {
          break // No more results
        }

        allPlugins = allPlugins.concat(plugins)
        
        // Add delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error)
        continue
      }
    }

    return this.processPluginData(allPlugins.slice(0, totalLimit), searchTerm)
  }

  // Get popular plugins (for when no search term is provided)
  async getPopularPlugins(limit = 48): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        'request[browse]': 'popular',
        'request[per_page]': limit.toString(),
        'request[page]': '1',
        'request[fields][short_description]': 'true',
        'request[fields][rating]': 'true',
        'request[fields][ratings]': 'true',
        'request[fields][downloaded]': 'true',
        'request[fields][last_updated]': 'true',
        'request[fields][active_installs]': 'true',
        'request[fields][tags]': 'true',
        'request[fields][icons]': 'true'
      })

      const response = await fetch(`${this.searchUrl}&${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.plugins || []
    } catch (error) {
      console.error('Error fetching popular plugins:', error)
      throw error
    }
  }
}

// Create a singleton instance
const pluginScraper = new WordPressPluginScraper()

// Function to decode HTML entities in a string
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Enhanced function to fetch WordPress plugins with better search capabilities
export const fetchWordPressPlugins = async (searchTerm: string = ''): Promise<Plugin[]> => {
  try {
    let rawPlugins: any[] = []
    
    if (searchTerm.trim()) {
      // Use enhanced multi-page search for better results
      rawPlugins = await pluginScraper.searchPluginsMultiPage(searchTerm.trim(), 48)
    } else {
      // Get popular plugins when no search term
      rawPlugins = await pluginScraper.getPopularPlugins(48)
    }
    
    // Transform the WordPress API response to our Plugin interface
    return rawPlugins.map(plugin => {
      // Get the icon URL (prefer 2x if available, fallback to 1x, then default)
      const iconUrl = plugin.icons?.['2x'] || plugin.icons?.['1x'] || plugin.icons?.default || 'https://s.w.org/plugins/geopattern-icon/default.svg'
      
      // Extract tags as an array
      const tags = plugin.tags || []
      
      return {
        id: plugin.slug,
        name: decodeHtmlEntities(plugin.name || ''), // Decode HTML entities in the name
        description: decodeHtmlEntities(plugin.short_description || ''), // Also decode description
        author: decodeHtmlEntities((plugin.author || '').replace(/<(?:.|\n)*?>/gm, '')), // Remove HTML tags and decode entities
        rating: (plugin.rating || 0) / 20, // Convert rating from 0-100 to 0-5
        downloads: plugin.downloaded || 0,
        lastUpdated: plugin.last_updated || '',
        tags: tags,
        imageUrl: iconUrl,
        detailUrl: plugin.plugin_url || `https://wordpress.org/plugins/${plugin.slug}/`
      }
    })
  } catch (error) {
    console.error('Error fetching WordPress plugins:', error)
    throw error
  }
}

// Legacy function for backward compatibility (fallback to original API)
export const fetchWordPressPluginsLegacy = async (searchTerm: string = ''): Promise<Plugin[]> => {
  try {
    // Create request parameters
    const requestObj: any = {
      per_page: 48, // Request 48 plugins as specified
      fields: {
        description: true,
        sections: false,
        tested: true,
        requires: true,
        rating: true,
        ratings: true,
        downloaded: true,
        download_link: true,
        last_updated: true,
        homepage: true,
        tags: true,
        icons: true,
      }
    }
    
    // Handle search differently based on whether a search term is provided
    if (searchTerm.trim()) {
      // For search queries, use the direct search parameter
      requestObj.search = searchTerm.trim()
    } else {
      // If no search term, show popular plugins
      requestObj.browse = 'popular'
    }
    
    const params = new URLSearchParams({
      action: 'query_plugins',
      request: JSON.stringify(requestObj)
    })

    // Make the API request
    const response = await fetch(`${WP_API_URL}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const data: WordPressApiResponse = await response.json()
    
    // Transform the WordPress API response to our Plugin interface
    return data.plugins.map(plugin => {
      // Get the icon URL (prefer 2x if available, fallback to 1x, then default)
      const iconUrl = plugin.icons['2x'] || plugin.icons['1x'] || plugin.icons.default
      
      // Extract tags as an array
      const tags = Object.keys(plugin.tags || {})
      
      return {
        id: plugin.slug,
        name: decodeHtmlEntities(plugin.name), // Decode HTML entities in the name
        description: decodeHtmlEntities(plugin.short_description), // Also decode description
        author: decodeHtmlEntities(plugin.author.replace(/<(?:.|\n)*?>/gm, '')), // Remove HTML tags and decode entities
        rating: plugin.rating / 20, // Convert rating from 0-100 to 0-5
        downloads: plugin.downloaded,
        lastUpdated: plugin.last_updated,
        tags: tags,
        imageUrl: iconUrl,
        detailUrl: `https://wordpress.org/plugins/${plugin.slug}/`
      }
    })
  } catch (error) {
    console.error('Error fetching WordPress plugins (legacy):', error)
    throw error
  }
}
