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
    console.log(`Fetching plugins from WordPress API with search term: "${searchTerm}"`)
    
    // Function to make a single API request with proper search handling
    const makeRequest = async (page: number = 1) => {
      // Create request parameters based on search term
      const requestObj: any = {
        per_page: 24, // WordPress API limit is 24 per request
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
      
      const params = new URLSearchParams({
        action: 'query_plugins',
        request: JSON.stringify(requestObj)
      })

      console.log(`API URL: ${WP_API_URL}?${params.toString()}`)
      
      const response = await fetch(`${WP_API_URL}?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as WordPressApiResponse
      console.log(`Page ${page} returned ${data.plugins.length} plugins, total pages available: ${data.info.pages}, total results: ${data.info.results}`)
      
      return data
    }

    // Start with an empty array and track unique plugins
    let allPlugins: any[] = []
    const uniqueSlugs = new Set<string>()
    let currentPage = 1
    const maxPages = 3 // Limit to 3 pages to get around 72 plugins max
    
    // Keep fetching pages until we have enough plugins or run out of pages
    while (allPlugins.length < 48 && currentPage <= maxPages) {
      try {
        console.log(`Fetching page ${currentPage}...`)
        const pageData = await makeRequest(currentPage)
        
        // If no plugins returned, we've reached the end
        if (pageData.plugins.length === 0) {
          console.log(`No plugins returned on page ${currentPage}, stopping`)
          break
        }
        
        // Add unique plugins from this page
        const uniquePluginsFromPage = pageData.plugins.filter(plugin => {
          if (uniqueSlugs.has(plugin.slug)) {
            return false
          }
          uniqueSlugs.add(plugin.slug)
          return true
        })
        
        allPlugins = [...allPlugins, ...uniquePluginsFromPage]
        console.log(`Added ${uniquePluginsFromPage.length} unique plugins from page ${currentPage}. Total: ${allPlugins.length}`)
        
        // If this page returned fewer than 24 plugins, it's likely the last page
        if (pageData.plugins.length < 24) {
          console.log(`Page ${currentPage} returned fewer than 24 plugins, likely the last page`)
          break
        }
        
        // If we've reached the total available pages, stop
        if (currentPage >= pageData.info.pages) {
          console.log(`Reached maximum available pages (${pageData.info.pages})`)
          break
        }
        
        currentPage++
        
        // Add a small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error)
        // If we have some plugins already, continue with what we have
        if (allPlugins.length > 0) {
          console.log(`Continuing with ${allPlugins.length} plugins from previous pages`)
          break
        } else {
          // If we don't have any plugins yet, re-throw the error
          throw error
        }
      }
    }
    
    console.log(`Final result: ${allPlugins.length} unique plugins collected`)
    
    // If we still don't have many plugins and we used a search term, 
    // the search might be too specific - let's inform about this
    if (searchTerm.trim() && allPlugins.length < 10) {
      console.log(`Search for "${searchTerm}" returned only ${allPlugins.length} plugins - search might be too specific`)
    }
    
    // Transform the WordPress API response to our Plugin interface
    const transformedPlugins = allPlugins.map(plugin => {
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

    console.log(`Successfully transformed ${transformedPlugins.length} unique plugins`)
    
    return transformedPlugins
  } catch (error) {
    console.error('Error fetching WordPress plugins:', error)
    throw error
  }
}