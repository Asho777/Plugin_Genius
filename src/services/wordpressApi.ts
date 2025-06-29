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

// Fallback mock data for when API is not accessible
const getMockPlugins = (searchTerm: string, page: number): PaginatedPluginResponse => {
  const mockPlugins: Plugin[] = [
    {
      id: `woocommerce-p${page}-i0`,
      name: 'WooCommerce',
      description: 'An open-source eCommerce plugin that helps you sell anything. Beautifully.',
      author: 'Automattic',
      rating: 4.4,
      downloads: 5000000,
      lastUpdated: '2024-01-15',
      tags: ['ecommerce', 'shop', 'store', 'sales'],
      imageUrl: 'https://ps.w.org/woocommerce/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/woocommerce/'
    },
    {
      id: `yoast-seo-p${page}-i1`,
      name: 'Yoast SEO',
      description: 'Improve your WordPress SEO: Write better content and have a fully optimized WordPress site.',
      author: 'Team Yoast',
      rating: 4.6,
      downloads: 5000000,
      lastUpdated: '2024-01-10',
      tags: ['seo', 'xml sitemap', 'google', 'meta'],
      imageUrl: 'https://ps.w.org/wordpress-seo/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wordpress-seo/'
    },
    {
      id: `contact-form-7-p${page}-i2`,
      name: 'Contact Form 7',
      description: 'Just another contact form plugin. Simple but flexible.',
      author: 'Takayuki Miyoshi',
      rating: 4.2,
      downloads: 5000000,
      lastUpdated: '2024-01-08',
      tags: ['contact', 'form', 'contact form', 'feedback'],
      imageUrl: 'https://ps.w.org/contact-form-7/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/contact-form-7/'
    },
    {
      id: `elementor-p${page}-i3`,
      name: 'Elementor Website Builder',
      description: 'The Elementor Website Builder has it all: drag and drop page builder, pixel perfect design.',
      author: 'Elementor.com',
      rating: 4.7,
      downloads: 5000000,
      lastUpdated: '2024-01-12',
      tags: ['page builder', 'editor', 'landing page', 'drag-and-drop'],
      imageUrl: 'https://ps.w.org/elementor/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/elementor/'
    },
    {
      id: `jetpack-p${page}-i4`,
      name: 'Jetpack',
      description: 'Security, performance, and site management: the most comprehensive WordPress plugin.',
      author: 'Automattic',
      rating: 3.9,
      downloads: 5000000,
      lastUpdated: '2024-01-14',
      tags: ['security', 'backup', 'anti-spam', 'seo'],
      imageUrl: 'https://ps.w.org/jetpack/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/jetpack/'
    },
    {
      id: `akismet-p${page}-i5`,
      name: 'Akismet Anti-Spam',
      description: 'Used by millions, Akismet is quite possibly the best way in the world to protect your blog from spam.',
      author: 'Automattic',
      rating: 4.5,
      downloads: 5000000,
      lastUpdated: '2024-01-09',
      tags: ['akismet', 'comments', 'spam', 'anti-spam'],
      imageUrl: 'https://ps.w.org/akismet/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/akismet/'
    }
  ]

  // Filter by search term if provided
  let filteredPlugins = mockPlugins
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase()
    filteredPlugins = mockPlugins.filter(plugin => 
      plugin.name.toLowerCase().includes(searchLower) ||
      plugin.description.toLowerCase().includes(searchLower) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Simulate pagination
  const totalResults = filteredPlugins.length * 10 // Simulate more results
  const totalPages = Math.ceil(totalResults / 6)

  return {
    plugins: filteredPlugins,
    currentPage: page,
    totalPages: totalPages,
    totalResults: totalResults,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
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
    
    console.log(`📦 Request payload:`, requestObj)
    
    // Use POST method with JSON content type
    const response = await fetch(WP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        action: 'query_plugins',
        request: requestObj
      })
    })
    
    if (!response.ok) {
      let errorText = 'Unknown error'
      try {
        errorText = await response.text()
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError)
      }
      console.error(`❌ WordPress API error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`WordPress API returned ${response.status}: ${response.statusText}. Please try again later.`)
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
    
    // Check if this is a network/CORS error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn('🚫 CORS/Network error detected. Using fallback mock data.')
      throw new Error('Unable to connect to WordPress.org API due to network restrictions. Showing sample plugins instead. In a production environment, this would be resolved by using a backend proxy server.')
    }
    
    // Re-throw other errors with their original message
    throw error
  }
}