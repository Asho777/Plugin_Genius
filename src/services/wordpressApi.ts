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

// Interface for paginated results
export interface PaginatedPluginResponse {
  plugins: Plugin[]
  currentPage: number
  totalPages: number
  totalResults: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Function to decode HTML entities in a string
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Function to fetch WordPress plugins from the official API with pagination
export const fetchWordPressPlugins = async (
  searchTerm: string = '', 
  page: number = 1
): Promise<PaginatedPluginResponse> => {
  try {
    console.log(`Fetching plugins from WordPress API with search term: "${searchTerm}", page: ${page}`)
    
    // Create request parameters - the key fix is ensuring page is properly set
    const requestObj: any = {
      per_page: 24, // WordPress API standard per page
      page: page, // This is crucial - must be set correctly
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
    
    // Handle search vs browse differently
    if (searchTerm.trim()) {
      // For search queries, use the search parameter
      requestObj.search = searchTerm.trim()
      console.log(`Making search request for "${searchTerm.trim()}" on page ${page}`)
    } else {
      // If no search term, show popular plugins
      requestObj.browse = 'popular'
      console.log(`Making browse request for popular plugins on page ${page}`)
    }
    
    // Create the request string - this is the critical part
    const requestString = JSON.stringify(requestObj)
    console.log(`Request object: ${requestString}`)
    
    const params = new URLSearchParams({
      action: 'query_plugins',
      request: requestString
    })

    const apiUrl = `${WP_API_URL}?${params.toString()}`
    console.log(`Full API URL: ${apiUrl}`)
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`WordPress API error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`)
    }

    const data: WordPressApiResponse = await response.json()
    
    console.log(`API Response Info:`, data.info)
    console.log(`Page ${page} returned ${data.plugins.length} plugins`)
    console.log(`Total pages available: ${data.info.pages}`)
    console.log(`Total results: ${data.info.results}`)
    console.log(`Current page from API: ${data.info.page}`)
    
    // Verify we got the correct page
    if (data.info.page !== page) {
      console.warn(`Requested page ${page} but API returned page ${data.info.page}`)
    }
    
    // Log first few plugin names to verify different content per page
    console.log(`First 3 plugins on page ${page}:`, 
      data.plugins.slice(0, 3).map(p => p.name)
    )
    
    // Transform the WordPress API response to our Plugin interface
    const transformedPlugins = data.plugins.map(plugin => {
      // Get the icon URL (prefer 2x if available, fallback to 1x, then default)
      const iconUrl = plugin.icons['2x'] || plugin.icons['1x'] || plugin.icons.default
      
      // Extract tags as an array
      const tags = Object.keys(plugin.tags || {})
      
      return {
        id: `${plugin.slug}-page${page}`, // Make ID unique per page to avoid React key conflicts
        name: decodeHtmlEntities(plugin.name),
        description: decodeHtmlEntities(plugin.short_description),
        author: decodeHtmlEntities(plugin.author.replace(/<(?:.|\n)*?>/gm, '')),
        rating: plugin.rating / 20, // Convert rating from 0-100 to 0-5
        downloads: plugin.downloaded,
        lastUpdated: plugin.last_updated,
        tags: tags,
        imageUrl: iconUrl,
        detailUrl: `https://wordpress.org/plugins/${plugin.slug}/`
      }
    })

    console.log(`Transformed ${transformedPlugins.length} plugins for page ${page}`)

    // Return paginated response
    const paginatedResponse = {
      plugins: transformedPlugins,
      currentPage: data.info.page,
      totalPages: data.info.pages,
      totalResults: data.info.results,
      hasNextPage: data.info.page < data.info.pages,
      hasPrevPage: data.info.page > 1
    }
    
    console.log(`Returning paginated response:`, {
      pluginCount: paginatedResponse.plugins.length,
      currentPage: paginatedResponse.currentPage,
      totalPages: paginatedResponse.totalPages,
      totalResults: paginatedResponse.totalResults,
      hasNextPage: paginatedResponse.hasNextPage,
      hasPrevPage: paginatedResponse.hasPrevPage
    })
    
    return paginatedResponse
  } catch (error) {
    console.error('Error fetching WordPress plugins:', error)
    throw error
  }
}