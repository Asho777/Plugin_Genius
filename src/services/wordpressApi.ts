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

// Function to decode HTML entities in a string
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Function to fetch WordPress plugins from the official API
export const fetchWordPressPlugins = async (searchTerm: string = ''): Promise<Plugin[]> => {
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
    console.error('Error fetching WordPress plugins:', error)
    throw error
  }
}
