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

// Define common keyword expansions for popular search categories
const KEYWORD_EXPANSIONS: Record<string, string[]> = {
  // E-commerce related terms
  'commerce': ['ecommerce', 'e-commerce', 'woocommerce', 'shop', 'store', 'product', 'cart', 'checkout'],
  'ecommerce': ['commerce', 'e-commerce', 'woocommerce', 'shop', 'store', 'product', 'cart', 'checkout'],
  'e-commerce': ['commerce', 'ecommerce', 'woocommerce', 'shop', 'store', 'product', 'cart', 'checkout'],
  'shop': ['store', 'commerce', 'ecommerce', 'e-commerce', 'woocommerce', 'product'],
  'store': ['shop', 'commerce', 'ecommerce', 'e-commerce', 'woocommerce', 'product'],
  
  // SEO related terms
  'seo': ['search engine', 'optimization', 'meta', 'sitemap', 'keyword', 'ranking', 'analytics'],
  'search': ['seo', 'search engine', 'find', 'discover', 'keyword'],
  
  // Security related terms
  'security': ['secure', 'protection', 'firewall', 'malware', 'antivirus', 'spam', 'hack', 'ssl'],
  'protection': ['security', 'secure', 'firewall', 'malware', 'antivirus', 'spam'],
  'firewall': ['security', 'protection', 'malware', 'hack'],
  
  // Form related terms
  'form': ['contact', 'input', 'field', 'submission', 'survey', 'questionnaire'],
  'contact': ['form', 'email', 'message', 'communication'],
  
  // Media related terms
  'media': ['image', 'video', 'audio', 'gallery', 'photo', 'picture'],
  'gallery': ['image', 'photo', 'picture', 'portfolio', 'album', 'media'],
  'image': ['photo', 'picture', 'gallery', 'media'],
  
  // Performance related terms
  'performance': ['speed', 'optimization', 'cache', 'compress', 'minify', 'fast', 'loading'],
  'speed': ['performance', 'fast', 'optimization', 'cache', 'loading'],
  'cache': ['performance', 'speed', 'optimization', 'fast'],
  
  // Social media related terms
  'social': ['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest', 'share', 'follow'],
  'share': ['social', 'facebook', 'twitter', 'instagram', 'linkedin', 'pinterest'],
  
  // Backup related terms
  'backup': ['restore', 'migration', 'clone', 'copy', 'export', 'import', 'save'],
  'migration': ['backup', 'move', 'transfer', 'clone', 'copy', 'export', 'import'],
  
  // Content related terms
  'content': ['post', 'page', 'article', 'blog', 'editor', 'text'],
  'blog': ['post', 'article', 'content', 'writing'],
  
  // Membership related terms
  'membership': ['member', 'subscription', 'user', 'access', 'restrict', 'login'],
  'subscription': ['membership', 'payment', 'recurring', 'access'],
  
  // Payment related terms
  'payment': ['transaction', 'gateway', 'stripe', 'paypal', 'checkout', 'purchase', 'subscription'],
  'donation': ['payment', 'give', 'charity', 'fundraising']
}

// Define special case plugins that should get extra points for certain search terms
const SPECIAL_CASE_PLUGINS: Record<string, Record<string, number>> = {
  // E-commerce special cases
  'commerce': {
    'woocommerce': 500,
    'easy-digital-downloads': 300,
    'woo-gutenberg-products-block': 200
  },
  'ecommerce': {
    'woocommerce': 500,
    'easy-digital-downloads': 300,
    'woo-gutenberg-products-block': 200
  },
  'e-commerce': {
    'woocommerce': 500,
    'easy-digital-downloads': 300,
    'woo-gutenberg-products-block': 200
  },
  
  // SEO special cases
  'seo': {
    'wordpress-seo': 500, // Yoast SEO
    'seo-by-rank-math': 400,
    'all-in-one-seo-pack': 400
  },
  
  // Security special cases
  'security': {
    'wordfence': 500,
    'sucuri-scanner': 400,
    'better-wp-security': 400, // iThemes Security
    'really-simple-ssl': 300
  },
  
  // Form special cases
  'form': {
    'contact-form-7': 500,
    'wpforms-lite': 400,
    'ninja-forms': 300,
    'formidable': 300
  },
  'contact': {
    'contact-form-7': 500,
    'wpforms-lite': 400
  },
  
  // Gallery special cases
  'gallery': {
    'envira-gallery-lite': 400,
    'modula-best-grid-gallery': 300,
    'nextgen-gallery': 300
  },
  
  // Cache/Performance special cases
  'cache': {
    'wp-super-cache': 400,
    'w3-total-cache': 400,
    'litespeed-cache': 400,
    'wp-fastest-cache': 300
  },
  'performance': {
    'wp-super-cache': 300,
    'w3-total-cache': 300,
    'litespeed-cache': 300,
    'autoptimize': 300
  },
  
  // Backup special cases
  'backup': {
    'updraftplus': 500,
    'backwpup': 400,
    'duplicator': 400,
    'all-in-one-wp-migration': 300
  },
  
  // Social media special cases
  'social': {
    'social-warfare': 400,
    'simple-social-icons': 300,
    'social-icons': 300
  }
}

// Function to fetch WordPress plugins from the official API
export const fetchWordPressPlugins = async (searchTerm: string = ''): Promise<Plugin[]> => {
  try {
    // Create request parameters
    const requestObj: any = {
      per_page: 100, // Request more plugins to get better diversity (API max is 250)
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
      
      // Important: For search queries, we should NOT include browse parameter
      delete requestObj.browse
    } else {
      // If no search term, show popular plugins
      requestObj.browse = 'popular'
    }
    
    const params = new URLSearchParams({
      action: 'query_plugins',
      request: JSON.stringify(requestObj)
    })

    // Log the search parameters for debugging
    console.log('Search term:', searchTerm)
    console.log('Request object:', requestObj)
    console.log('Request params:', params.toString())

    // Make the API request
    const response = await fetch(`${WP_API_URL}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const data: WordPressApiResponse = await response.json()
    
    // Log the API response for debugging
    console.log('API response info:', data.info)
    console.log('Number of plugins returned:', data.plugins.length)
    
    // Additional debugging - log the first few plugin names to verify relevance
    if (data.plugins.length > 0) {
      console.log('First 5 plugin names before sorting:');
      data.plugins.slice(0, 5).forEach((plugin, index) => {
        console.log(`${index + 1}. ${decodeHtmlEntities(plugin.name)} - ${plugin.short_description.substring(0, 100)}...`);
      });
    }
    
    // If we have a search term, perform additional client-side filtering
    // to improve relevance of results
    let plugins = data.plugins;
    
    if (searchTerm.trim()) {
      // Normalize search term - handle special cases for common search terms
      let normalizedSearchTerm = searchTerm.toLowerCase().trim();
      
      // Special case handling for common search terms
      if (normalizedSearchTerm === 'e-commerce' || normalizedSearchTerm === 'ecommerce') {
        normalizedSearchTerm = 'commerce';
        console.log('Normalized search term to:', normalizedSearchTerm);
      } else if (normalizedSearchTerm === 'security plugin' || normalizedSearchTerm === 'protection') {
        normalizedSearchTerm = 'security';
        console.log('Normalized search term to:', normalizedSearchTerm);
      } else if (normalizedSearchTerm === 'contact form' || normalizedSearchTerm === 'contact forms') {
        normalizedSearchTerm = 'form';
        console.log('Normalized search term to:', normalizedSearchTerm);
      } else if (normalizedSearchTerm === 'image gallery' || normalizedSearchTerm === 'photo gallery') {
        normalizedSearchTerm = 'gallery';
        console.log('Normalized search term to:', normalizedSearchTerm);
      } else if (normalizedSearchTerm === 'speed' || normalizedSearchTerm === 'optimization') {
        normalizedSearchTerm = 'performance';
        console.log('Normalized search term to:', normalizedSearchTerm);
      }
      
      // Extract keywords from search term
      const keywords = normalizedSearchTerm.split(/\s+/).filter(word => word.length > 2);
      
      // Add common variations for better matching
      const expandedKeywords = [...keywords];
      
      // Expand keywords based on our predefined expansions
      keywords.forEach(keyword => {
        if (KEYWORD_EXPANSIONS[keyword]) {
          // Add all expansions for this keyword
          KEYWORD_EXPANSIONS[keyword].forEach(expansion => {
            if (!expandedKeywords.includes(expansion)) {
              expandedKeywords.push(expansion);
            }
          });
        }
      });
      
      console.log('Search keywords (expanded):', expandedKeywords);
      
      // Score each plugin based on keyword matches in name, description, and tags
      const scoredPlugins = plugins.map(plugin => {
        let score = 0;
        const decodedName = decodeHtmlEntities(plugin.name);
        const normalizedName = decodedName.toLowerCase();
        const normalizedDescription = plugin.short_description.toLowerCase();
        const normalizedSlug = plugin.slug.toLowerCase();
        const tagKeys = Object.keys(plugin.tags || {}).map(tag => tag.toLowerCase());
        
        // Debug individual plugin scoring
        console.log(`\nScoring plugin: ${decodedName}`);
        
        // Check for special case plugins that should get extra points
        keywords.forEach(keyword => {
          if (SPECIAL_CASE_PLUGINS[keyword] && SPECIAL_CASE_PLUGINS[keyword][plugin.slug]) {
            const bonus = SPECIAL_CASE_PLUGINS[keyword][plugin.slug];
            console.log(`  +${bonus} points: Special case match for ${keyword} search`);
            score += bonus;
          }
        });
        
        // Check for exact matches in name or slug (highest priority)
        if (normalizedName.includes(normalizedSearchTerm)) {
          const bonus = 200;
          console.log(`  +${bonus} points: Name contains exact search term`);
          score += bonus;
        }
        
        if (normalizedSlug.includes(normalizedSearchTerm.replace(/\s+/g, ''))) {
          const bonus = 200;
          console.log(`  +${bonus} points: Slug contains exact search term`);
          score += bonus;
        }
        
        // Check for keyword matches in name (high priority)
        expandedKeywords.forEach(keyword => {
          if (normalizedName.includes(keyword)) {
            const bonus = 100;
            console.log(`  +${bonus} points: Name contains keyword "${keyword}"`);
            score += bonus;
          }
        });
        
        // Check for keyword matches in slug (high priority)
        expandedKeywords.forEach(keyword => {
          if (normalizedSlug.includes(keyword)) {
            const bonus = 100;
            console.log(`  +${bonus} points: Slug contains keyword "${keyword}"`);
            score += bonus;
          }
        });
        
        // Check for keyword matches in tags (medium priority)
        expandedKeywords.forEach(keyword => {
          const matchingTags = tagKeys.filter(tag => tag.includes(keyword));
          if (matchingTags.length > 0) {
            const bonus = 50 * matchingTags.length;
            console.log(`  +${bonus} points: ${matchingTags.length} tags contain keyword "${keyword}"`);
            score += bonus;
          }
        });
        
        // Check for keyword matches in description (lower priority)
        expandedKeywords.forEach(keyword => {
          if (normalizedDescription.includes(keyword)) {
            const bonus = 20;
            console.log(`  +${bonus} points: Description contains keyword "${keyword}"`);
            score += bonus;
          }
        });
        
        // Add a small bonus for overall popularity, but with diminishing returns
        // This helps prevent only the most popular plugins from dominating
        const popularityBonus = Math.log10(plugin.downloaded) * 0.3;
        console.log(`  +${popularityBonus.toFixed(2)} points: Popularity bonus`);
        score += popularityBonus;
        
        console.log(`  Total score: ${score}`);
        
        return { plugin, score };
      });
      
      // Sort by score (descending) and extract just the plugins
      const sortedPlugins = scoredPlugins
        .sort((a, b) => b.score - a.score)
        .map(item => item.plugin);
      
      // DIVERSITY ENHANCEMENT: Ensure we have a mix of plugins
      // Take the top 12 highest scoring plugins
      const topPlugins = sortedPlugins.slice(0, 12);
      
      // For the remaining slots, select plugins with some relevance but more diversity
      // Get plugins ranked 13-50 by score
      const secondTierPlugins = sortedPlugins.slice(12, 50);
      
      // Randomly select 12 plugins from the second tier for diversity
      const diversityPlugins = [];
      const secondTierCount = Math.min(12, secondTierPlugins.length);
      
      // Create a copy of the array to shuffle
      const shuffledSecondTier = [...secondTierPlugins];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffledSecondTier.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSecondTier[i], shuffledSecondTier[j]] = [shuffledSecondTier[j], shuffledSecondTier[i]];
      }
      
      // Take the first N plugins from the shuffled array
      diversityPlugins.push(...shuffledSecondTier.slice(0, secondTierCount));
      
      // Combine the top plugins with the diversity plugins
      plugins = [...topPlugins, ...diversityPlugins];
      
      // Limit to 24 plugins total
      plugins = plugins.slice(0, 24);
      
      // Log the final plugin selection
      console.log('\nFinal plugin selection after diversity enhancement:');
      plugins.forEach((plugin, index) => {
        console.log(`${index + 1}. ${decodeHtmlEntities(plugin.name)}`);
      });
    } else {
      // For popular plugins (no search term), just take the first 24
      plugins = plugins.slice(0, 24);
    }
    
    // Transform the WordPress API response to our Plugin interface
    return plugins.map(plugin => {
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
