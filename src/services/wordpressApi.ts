import { Plugin } from '../pages/TemplatesPage'

// Interface for paginated plugin response
export interface PaginatedPluginResponse {
  plugins: Plugin[]
  currentPage: number
  totalPages: number
  totalResults: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// WordPress.org REST API endpoint for plugins - direct API call
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
export const fetchWordPressPlugins = async (
  searchTerm: string = '', 
  page: number = 1
): Promise<PaginatedPluginResponse> => {
  try {
    // Create request parameters
    const requestObj: any = {
      per_page: 24, // Request 24 plugins per page
      page: page,
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

    // Make the API request with CORS mode
    const response = await fetch(`${WP_API_URL}?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`Unable to connect to WordPress API (Status: ${response.status}). This may be due to network restrictions or CORS policies.`)
    }

    // Check if the response is actually JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('WordPress API returned non-JSON response. This may be due to network restrictions or server configuration.')
    }

    const data: WordPressApiResponse = await response.json()
    
    // Transform the WordPress API response to our Plugin interface
    const plugins = data.plugins.map(plugin => {
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

    // Return paginated response
    return {
      plugins,
      currentPage: data.info.page,
      totalPages: data.info.pages,
      totalResults: data.info.results,
      hasNextPage: data.info.page < data.info.pages,
      hasPrevPage: data.info.page > 1
    }
  } catch (error: any) {
    console.error('Error fetching WordPress plugins:', error)
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to WordPress API. This may be due to network restrictions or CORS policies.')
    } else if (error.message.includes('Unexpected token')) {
      throw new Error('WordPress API returned invalid data. This may be due to network restrictions or server configuration.')
    } else {
      throw error
    }
  }
}