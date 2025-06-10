import { Plugin } from '../pages/TemplatesPage'

// Mock data for WordPress plugins
export const fetchWordPressPlugins = async (): Promise<Plugin[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Return mock data
  return [
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description: 'The most customizable eCommerce platform for building your online business. Perfect for selling products and services.',
      author: 'Automattic',
      rating: 4.7,
      downloads: 5000000,
      lastUpdated: '2023-09-15',
      tags: ['ecommerce', 'shop', 'store', 'cart'],
      imageUrl: 'https://ps.w.org/woocommerce/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/woocommerce/'
    },
    {
      id: 'yoast-seo',
      name: 'Yoast SEO',
      description: 'Improve your WordPress SEO: Write better content and have a fully optimized WordPress site.',
      author: 'Team Yoast',
      rating: 4.8,
      downloads: 5500000,
      lastUpdated: '2023-09-20',
      tags: ['seo', 'analytics', 'content', 'marketing'],
      imageUrl: 'https://ps.w.org/wordpress-seo/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wordpress-seo/'
    },
    {
      id: 'elementor',
      name: 'Elementor Website Builder',
      description: 'The most advanced frontend drag & drop page builder. Create high-end, pixel perfect websites at record speeds.',
      author: 'Elementor.com',
      rating: 4.6,
      downloads: 5000000,
      lastUpdated: '2023-09-18',
      tags: ['page builder', 'editor', 'design', 'templates'],
      imageUrl: 'https://ps.w.org/elementor/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/elementor/'
    },
    {
      id: 'wordfence',
      name: 'Wordfence Security',
      description: 'Firewall, malware scan, blocking, live traffic, login security & more. Wordfence provides comprehensive security.',
      author: 'Wordfence',
      rating: 4.9,
      downloads: 4000000,
      lastUpdated: '2023-09-10',
      tags: ['security', 'firewall', 'malware', 'protection'],
      imageUrl: 'https://ps.w.org/wordfence/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wordfence/'
    },
    {
      id: 'contact-form-7',
      name: 'Contact Form 7',
      description: 'Just another contact form plugin. Simple but flexible.',
      author: 'Takayuki Miyoshi',
      rating: 4.5,
      downloads: 5500000,
      lastUpdated: '2023-08-25',
      tags: ['forms', 'contact', 'email', 'feedback'],
      imageUrl: 'https://ps.w.org/contact-form-7/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/contact-form-7/'
    },
    {
      id: 'wp-super-cache',
      name: 'WP Super Cache',
      description: 'Very fast caching plugin for WordPress.',
      author: 'Automattic',
      rating: 4.3,
      downloads: 2000000,
      lastUpdated: '2023-07-30',
      tags: ['performance', 'cache', 'speed', 'optimization'],
      imageUrl: 'https://ps.w.org/wp-super-cache/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wp-super-cache/'
    },
    {
      id: 'akismet',
      name: 'Akismet Anti-Spam',
      description: 'Used by millions, Akismet is quite possibly the best way to protect your blog from spam comments.',
      author: 'Automattic',
      rating: 4.7,
      downloads: 5000000,
      lastUpdated: '2023-09-05',
      tags: ['spam', 'security', 'comments', 'protection'],
      imageUrl: 'https://ps.w.org/akismet/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/akismet/'
    },
    {
      id: 'jetpack',
      name: 'Jetpack',
      description: 'Security, performance, and marketing tools made by WordPress experts.',
      author: 'Automattic',
      rating: 4.2,
      downloads: 5000000,
      lastUpdated: '2023-09-22',
      tags: ['security', 'performance', 'marketing', 'social'],
      imageUrl: 'https://ps.w.org/jetpack/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/jetpack/'
    },
    {
      id: 'google-analytics-for-wordpress',
      name: 'MonsterInsights',
      description: 'The best Google Analytics plugin for WordPress. See how visitors find and use your website.',
      author: 'MonsterInsights',
      rating: 4.8,
      downloads: 3000000,
      lastUpdated: '2023-09-12',
      tags: ['analytics', 'statistics', 'google', 'tracking'],
      imageUrl: 'https://ps.w.org/google-analytics-for-wordpress/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/google-analytics-for-wordpress/'
    },
    {
      id: 'wp-mail-smtp',
      name: 'WP Mail SMTP',
      description: 'Reconfigures the wp_mail() function to use SMTP instead of mail() and creates an options page.',
      author: 'WPForms',
      rating: 4.9,
      downloads: 3000000,
      lastUpdated: '2023-09-08',
      tags: ['mail', 'smtp', 'email', 'notification'],
      imageUrl: 'https://ps.w.org/wp-mail-smtp/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wp-mail-smtp/'
    },
    {
      id: 'all-in-one-seo-pack',
      name: 'All in One SEO',
      description: 'The original WordPress SEO plugin, downloaded over 100 million times since 2007.',
      author: 'All in One SEO Team',
      rating: 4.6,
      downloads: 3000000,
      lastUpdated: '2023-09-14',
      tags: ['seo', 'sitemap', 'google', 'analytics'],
      imageUrl: 'https://ps.w.org/all-in-one-seo-pack/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/all-in-one-seo-pack/'
    },
    {
      id: 'updraftplus',
      name: 'UpdraftPlus',
      description: 'Backup and restoration made easy. Complete backups; manual or scheduled.',
      author: 'UpdraftPlus.Com',
      rating: 4.8,
      downloads: 3000000,
      lastUpdated: '2023-09-01',
      tags: ['backup', 'restore', 'cloud', 'security'],
      imageUrl: 'https://ps.w.org/updraftplus/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/updraftplus/'
    },
    {
      id: 'wpforms-lite',
      name: 'WPForms Lite',
      description: 'Beginner friendly WordPress contact form plugin. Use our Drag & Drop form builder to create your forms.',
      author: 'WPForms',
      rating: 4.9,
      downloads: 5000000,
      lastUpdated: '2023-09-19',
      tags: ['forms', 'contact', 'email', 'builder'],
      imageUrl: 'https://ps.w.org/wpforms-lite/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wpforms-lite/'
    },
    {
      id: 'really-simple-ssl',
      name: 'Really Simple SSL',
      description: 'Lightweight plugin without any setup to make your site SSL proof.',
      author: 'Really Simple Plugins',
      rating: 4.9,
      downloads: 4000000,
      lastUpdated: '2023-09-07',
      tags: ['ssl', 'https', 'security', 'encryption'],
      imageUrl: 'https://ps.w.org/really-simple-ssl/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/really-simple-ssl/'
    },
    {
      id: 'w3-total-cache',
      name: 'W3 Total Cache',
      description: 'Improve site performance and user experience via caching.',
      author: 'BoldGrid',
      rating: 4.4,
      downloads: 1000000,
      lastUpdated: '2023-08-15',
      tags: ['cache', 'performance', 'speed', 'optimization'],
      imageUrl: 'https://ps.w.org/w3-total-cache/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/w3-total-cache/'
    },
    {
      id: 'redirection',
      name: 'Redirection',
      description: 'Manage 301 redirections, keep track of 404 errors, and improve your site ranking.',
      author: 'John Godley',
      rating: 4.7,
      downloads: 2000000,
      lastUpdated: '2023-08-20',
      tags: ['redirect', '301', 'seo', 'url'],
      imageUrl: 'https://ps.w.org/redirection/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/redirection/'
    },
    {
      id: 'duplicate-page',
      name: 'Duplicate Page',
      description: 'Duplicate Posts, Pages and Custom Posts using single click.',
      author: 'Webshouter',
      rating: 4.8,
      downloads: 2000000,
      lastUpdated: '2023-07-25',
      tags: ['duplicate', 'clone', 'copy', 'post'],
      imageUrl: 'https://ps.w.org/duplicate-page/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/duplicate-page/'
    },
    {
      id: 'classic-editor',
      name: 'Classic Editor',
      description: 'Enables the WordPress classic editor and the old-style Edit Post screen.',
      author: 'WordPress Contributors',
      rating: 4.9,
      downloads: 5000000,
      lastUpdated: '2023-06-10',
      tags: ['editor', 'gutenberg', 'classic', 'block'],
      imageUrl: 'https://ps.w.org/classic-editor/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/classic-editor/'
    },
    {
      id: 'advanced-custom-fields',
      name: 'Advanced Custom Fields',
      description: 'Customize WordPress with powerful, professional and intuitive fields.',
      author: 'WP Engine',
      rating: 4.9,
      downloads: 2000000,
      lastUpdated: '2023-09-11',
      tags: ['custom fields', 'meta', 'editor', 'developer'],
      imageUrl: 'https://ps.w.org/advanced-custom-fields/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/advanced-custom-fields/'
    },
    {
      id: 'wp-optimize',
      name: 'WP-Optimize',
      description: 'WP-Optimize makes your site fast and efficient. It cleans the database, compresses images and caches pages.',
      author: 'David Anderson',
      rating: 4.8,
      downloads: 1000000,
      lastUpdated: '2023-09-03',
      tags: ['optimize', 'clean', 'database', 'performance'],
      imageUrl: 'https://ps.w.org/wp-optimize/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/wp-optimize/'
    },
    {
      id: 'cookie-notice',
      name: 'Cookie Notice & Compliance',
      description: 'Cookie Notice allows you to elegantly inform users that your site uses cookies.',
      author: 'Hu-manity.co',
      rating: 4.5,
      downloads: 2000000,
      lastUpdated: '2023-08-28',
      tags: ['cookie', 'notice', 'gdpr', 'compliance'],
      imageUrl: 'https://ps.w.org/cookie-notice/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/cookie-notice/'
    },
    {
      id: 'broken-link-checker',
      name: 'Broken Link Checker',
      description: 'Checks your blog for broken links and missing images and notifies you on the dashboard.',
      author: 'WPMU DEV',
      rating: 4.6,
      downloads: 800000,
      lastUpdated: '2023-07-15',
      tags: ['links', 'seo', 'maintenance', 'checker'],
      imageUrl: 'https://ps.w.org/broken-link-checker/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/broken-link-checker/'
    },
    {
      id: 'limit-login-attempts-reloaded',
      name: 'Limit Login Attempts Reloaded',
      description: 'Block excessive login attempts and protect your site against brute force attacks.',
      author: 'Limit Login Attempts Reloaded',
      rating: 4.7,
      downloads: 1000000,
      lastUpdated: '2023-08-05',
      tags: ['security', 'login', 'brute force', 'protection'],
      imageUrl: 'https://ps.w.org/limit-login-attempts-reloaded/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/limit-login-attempts-reloaded/'
    },
    {
      id: 'google-site-kit',
      name: 'Site Kit by Google',
      description: 'Get insights from Google products in your WordPress dashboard.',
      author: 'Google',
      rating: 4.4,
      downloads: 2000000,
      lastUpdated: '2023-09-17',
      tags: ['google', 'analytics', 'search console', 'adsense'],
      imageUrl: 'https://ps.w.org/google-site-kit/assets/icon-256x256.png',
      detailUrl: 'https://wordpress.org/plugins/google-site-kit/'
    }
  ]
}
