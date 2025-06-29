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
    console.log(`🔍 Fetching WordPress plugins - Search: "${searchTerm}", Page: ${page}`)
    
    // Create request parameters with proper structure for WordPress API
    const requestObj: any = {
      per_page: 24,
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
    
    // Handle search vs browse
    if (searchTerm.trim()) {
      requestObj.search = searchTerm.trim()
      console.log(`📝 Search mode: "${searchTerm.trim()}" on page ${page}`)
    } else {
      requestObj.browse = 'popular'
      console.log(`🔥 Browse mode: popular plugins on page ${page}`)
    }
    
    // Create the request - this is the critical fix
    const requestString = JSON.stringify(requestObj)
    console.log(`📦 Request payload:`, requestString)
    
    // Use POST method instead of GET for better parameter handling
    const response = await fetch(WP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        action: 'query_plugins',
        request: requestString
      }).toString()
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ WordPress API error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`)
    }

    const data: WordPressApiResponse = await response.json()
    
    console.log(`📊 API Response Summary:`)
    console.log(`   - Requested page: ${page}`)
    console.log(`   - Returned page: ${data.info.page}`)
    console.log(`   - Plugins returned: ${data.plugins.length}`)
    console.log(`   - Total pages: ${data.info.pages}`)
    console.log(`   - Total results: ${data.info.results}`)
    
    // Verify pagination is working
    if (data.info.page !== page) {
      console.warn(`⚠️ Page mismatch! Requested ${page}, got ${data.info.page}`)
    }
    
    // Log plugin names to verify different content per page
    const pluginNames = data.plugins.slice(0, 5).map(p => p.name)
    console.log(`🔍 First 5 plugins on page ${page}:`, pluginNames)
    
    // Check if we're getting the same plugins (this would indicate pagination isn't working)
    if (page > 1) {
      console.log(`🔄 Page ${page} verification - checking for unique content...`)
    }
    
    // Transform the WordPress API response to our Plugin interface
    const transformedPlugins = data.plugins.map((plugin, index) => {
      // Get the icon URL (prefer 2x if available, fallback to 1x, then default)
      const iconUrl = plugin.icons['2x'] || plugin.icons['1x'] || plugin.icons.default
      
      // Extract tags as an array
      const tags = Object.keys(plugin.tags || {})
      
      // Create unique ID that includes page and position to ensure uniqueness
      const uniqueId = `${plugin.slug}-p${page}-i${index}`
      
      return {
        id: uniqueId,
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

    console.log(`✅ Successfully transformed ${transformedPlugins.length} plugins for page ${page}`)

    // Create paginated response
    const paginatedResponse: PaginatedPluginResponse = {
      plugins: transformedPlugins,
      currentPage: data.info.page,
      totalPages: data.info.pages,
      totalResults: data.info.results,
      hasNextPage: data.info.page < data.info.pages,
      hasPrevPage: data.info.page > 1
    }
    
    console.log(`📋 Final response:`, {
      pluginCount: paginatedResponse.plugins.length,
      currentPage: paginatedResponse.currentPage,
      totalPages: paginatedResponse.totalPages,
      totalResults: paginatedResponse.totalResults,
      hasNext: paginatedResponse.hasNextPage,
      hasPrev: paginatedResponse.hasPrevPage
    })
    
    return paginatedResponse
  } catch (error) {
    console.error('💥 Error fetching WordPress plugins:', error)
    throw error
  }
}