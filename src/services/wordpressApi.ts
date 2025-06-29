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
    console.log('Fetching plugins from WordPress API...')
    
    // Create base request parameters
    const baseRequestObj: any = {
      per_page: 24, // WordPress API limit is 24 per request
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
      baseRequestObj.search = searchTerm.trim()
    } else {
      // If no search term, show popular plugins
      baseRequestObj.browse = 'popular'
    }
    
    // Function to make a single API request
    const makeRequest = async (page: number = 1) => {
      const requestObj = { ...baseRequestObj, page }
      const params = new URLSearchParams({
        action: 'query_plugins',
        request: JSON.stringify(requestObj)
      })

      const response = await fetch(`${WP_API_URL}?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json() as WordPressApiResponse
    }

    // Make the first request
    console.log('Making first API request (page 1)...')
    const firstPageData = await makeRequest(1)
    console.log(`First page returned ${firstPageData.plugins.length} plugins`)
    
    let allPlugins = [...firstPageData.plugins]
    const uniqueSlugs = new Set(firstPageData.plugins.map(p => p.slug))
    
    // If we got plugins and need more to reach 48, make a second request
    if (firstPageData.plugins.length > 0 && allPlugins.length < 48) {
      try {
        console.log('Making second API request (page 2)...')
        const secondPageData = await makeRequest(2)
        console.log(`Second page returned ${secondPageData.plugins.length} plugins`)
        
        // Add unique plugins from second page
        const uniqueSecondPagePlugins = secondPageData.plugins.filter(plugin => {
          if (uniqueSlugs.has(plugin.slug)) {
            return false
          }
          uniqueSlugs.add(plugin.slug)
          return true
        })
        
        allPlugins = [...allPlugins, ...uniqueSecondPagePlugins]
        console.log(`Added ${uniqueSecondPagePlugins.length} unique plugins from second page`)
        
        // If we still need more and there might be a third page, try it
        if (allPlugins.length < 48 && secondPageData.plugins.length === 24) {
          try {
            console.log('Making third API request (page 3)...')
            const thirdPageData = await makeRequest(3)
            console.log(`Third page returned ${thirdPageData.plugins.length} plugins`)
            
            // Add unique plugins from third page
            const uniqueThirdPagePlugins = thirdPageData.plugins.filter(plugin => {
              if (uniqueSlugs.has(plugin.slug)) {
                return false
              }
              uniqueSlugs.add(plugin.slug)
              return true
            })
            
            allPlugins = [...allPlugins, ...uniqueThirdPagePlugins]
            console.log(`Added ${uniqueThirdPagePlugins.length} unique plugins from third page`)
          } catch (error) {
            console.log('Third request failed, using first two pages only')
          }
        }
      } catch (error) {
        console.log('Second request failed, using first page only')
      }
    }
    
    console.log(`Total unique plugins collected: ${allPlugins.length}`)
    
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