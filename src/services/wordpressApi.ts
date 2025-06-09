import { Plugin } from '../pages/TemplatesPage'

// This is a mock API service that simulates fetching WordPress plugins
// In a real application, you would connect to the WordPress.org API

export const fetchWordPressPlugins = async (): Promise<Plugin[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock data based on real WordPress plugins
  return [
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description: "WooCommerce is the world's most popular open-source eCommerce solution. Whether you're launching a business, taking an existing brick and mortar store online, or designing sites for clients, use WooCommerce for a store that powerfully blends content and commerce.",
      author: 'Automattic',
      rating: 4.5,
      downloads: 5000000,
      lastUpdated: '2023-11-15',
      tags: ['ecommerce', 'shop', 'store', 'cart', 'checkout', 'payments'],
      imageUrl: 'https://ps.w.org/woocommerce/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/woocommerce/'
    },
    {
      id: 'wordpress-seo',
      name: 'Yoast SEO',
      description: 'Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin.',
      author: 'Team Yoast',
      rating: 4.8,
      downloads: 5500000,
      lastUpdated: '2023-12-01',
      tags: ['seo', 'xml sitemap', 'google', 'search engine', 'optimization'],
      imageUrl: 'https://ps.w.org/wordpress-seo/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/wordpress-seo/'
    },
    {
      id: 'elementor',
      name: 'Elementor Website Builder',
      description: 'The Elementor Website Builder has it all: drag and drop page builder, pixel perfect design, mobile responsive editing, and more. Get started now!',
      author: 'Elementor.com',
      rating: 4.7,
      downloads: 5000000,
      lastUpdated: '2023-12-05',
      tags: ['page builder', 'editor', 'landing page', 'drag-and-drop', 'visual editor'],
      imageUrl: 'https://ps.w.org/elementor/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/elementor/'
    },
    {
      id: 'contact-form-7',
      name: 'Contact Form 7',
      description: 'Just another contact form plugin. Simple but flexible.',
      author: 'Takayuki Miyoshi',
      rating: 4.5,
      downloads: 5000000,
      lastUpdated: '2023-10-20',
      tags: ['forms', 'contact form', 'email', 'feedback'],
      imageUrl: 'https://ps.w.org/contact-form-7/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/contact-form-7/'
    },
    {
      id: 'akismet',
      name: 'Akismet Anti-Spam',
      description: 'Used by millions, Akismet is quite possibly the best way in the world to protect your blog from spam. It keeps your site protected even while you sleep.',
      author: 'Automattic',
      rating: 4.6,
      downloads: 5000000,
      lastUpdated: '2023-11-10',
      tags: ['spam', 'anti-spam', 'comments', 'security'],
      imageUrl: 'https://ps.w.org/akismet/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/akismet/'
    },
    {
      id: 'wordfence',
      name: 'Wordfence Security',
      description: 'Wordfence Security is a free enterprise class security and performance plugin that makes your site up to 50 times faster and more secure.',
      author: 'Wordfence',
      rating: 4.8,
      downloads: 4000000,
      lastUpdated: '2023-12-03',
      tags: ['security', 'firewall', 'malware', 'scan', 'login'],
      imageUrl: 'https://ps.w.org/wordfence/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/wordfence/'
    },
    {
      id: 'wp-super-cache',
      name: 'WP Super Cache',
      description: 'A very fast caching engine for WordPress that produces static html files.',
      author: 'Automattic',
      rating: 4.2,
      downloads: 2000000,
      lastUpdated: '2023-09-15',
      tags: ['performance', 'cache', 'caching', 'speed'],
      imageUrl: 'https://ps.w.org/wp-super-cache/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/wp-super-cache/'
    },
    {
      id: 'really-simple-ssl',
      name: 'Really Simple SSL',
      description: 'Lightweight plugin without any setup to make your site SSL proof',
      author: 'Really Simple Plugins',
      rating: 4.9,
      downloads: 4000000,
      lastUpdated: '2023-11-28',
      tags: ['security', 'ssl', 'https', 'mixed content'],
      imageUrl: 'https://ps.w.org/really-simple-ssl/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/really-simple-ssl/'
    },
    {
      id: 'google-analytics-for-wordpress',
      name: 'Google Analytics for WordPress by MonsterInsights',
      description: 'The best Google Analytics plugin for WordPress. See how visitors find and use your website, so you can keep them coming back.',
      author: 'MonsterInsights',
      rating: 4.7,
      downloads: 3000000,
      lastUpdated: '2023-11-20',
      tags: ['analytics', 'google analytics', 'statistics', 'tracking'],
      imageUrl: 'https://ps.w.org/google-analytics-for-wordpress/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/google-analytics-for-wordpress/'
    },
    {
      id: 'wp-mail-smtp',
      name: 'WP Mail SMTP',
      description: 'Reconfigures the wp_mail() function to use SMTP instead of mail() and creates an options page to manage the settings.',
      author: 'WPForms',
      rating: 4.9,
      downloads: 3000000,
      lastUpdated: '2023-12-02',
      tags: ['mail', 'smtp', 'email', 'wp_mail', 'mailer'],
      imageUrl: 'https://ps.w.org/wp-mail-smtp/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/wp-mail-smtp/'
    },
    {
      id: 'all-in-one-seo-pack',
      name: 'All in One SEO',
      description: 'The original WordPress SEO plugin, downloaded over 100 million times since 2007.',
      author: 'All in One SEO Team',
      rating: 4.6,
      downloads: 3000000,
      lastUpdated: '2023-11-25',
      tags: ['seo', 'sitemap', 'google', 'schema', 'search engine'],
      imageUrl: 'https://ps.w.org/all-in-one-seo-pack/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/all-in-one-seo-pack/'
    },
    {
      id: 'updraftplus',
      name: 'UpdraftPlus WordPress Backup Plugin',
      description: 'Backup and restore: take backups locally, or backup to Amazon S3, Dropbox, Google Drive, Rackspace, (S)FTP, WebDAV & email, on automatic schedules.',
      author: 'UpdraftPlus.Com',
      rating: 4.8,
      downloads: 3000000,
      lastUpdated: '2023-11-15',
      tags: ['backup', 'restore', 'cloud', 'security', 'database'],
      imageUrl: 'https://ps.w.org/updraftplus/assets/icon-256x256.jpg',
      detailUrl: 'https://en-au.wordpress.org/plugins/updraftplus/'
    },
    {
      id: 'wpforms-lite',
      name: 'WPForms Lite',
      description: 'Beginner friendly WordPress contact form plugin. Use our Drag & Drop form builder to create your WordPress forms.',
      author: 'WPForms',
      rating: 4.9,
      downloads: 5000000,
      lastUpdated: '2023-12-01',
      tags: ['forms', 'contact form', 'drag-and-drop', 'email'],
      imageUrl: 'https://ps.w.org/wpforms-lite/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/wpforms-lite/'
    },
    {
      id: 'jetpack',
      name: 'Jetpack',
      description: 'Security, performance, and marketing tools made by WordPress experts. Jetpack keeps your site protected so you can focus on more important things.',
      author: 'Automattic',
      rating: 4.1,
      downloads: 5000000,
      lastUpdated: '2023-12-05',
      tags: ['security', 'performance', 'social', 'stats', 'cdn'],
      imageUrl: 'https://ps.w.org/jetpack/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/jetpack/'
    },
    {
      id: 'duplicate-page',
      name: 'Duplicate Page',
      description: 'Duplicate Posts, Pages and Custom Posts using single click.',
      author: 'Arshid',
      rating: 4.9,
      downloads: 2000000,
      lastUpdated: '2023-10-10',
      tags: ['duplicate', 'clone', 'copy', 'post', 'page'],
      imageUrl: 'https://ps.w.org/duplicate-page/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/duplicate-page/'
    },
    {
      id: 'classic-editor',
      name: 'Classic Editor',
      description: 'Enables the WordPress classic editor and the old-style Edit Post screen with TinyMCE, Meta Boxes, etc. Supports the older plugins that extend this screen.',
      author: 'WordPress Contributors',
      rating: 4.9,
      downloads: 5000000,
      lastUpdated: '2023-06-15',
      tags: ['editor', 'classic editor', 'block editor', 'gutenberg'],
      imageUrl: 'https://ps.w.org/classic-editor/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/classic-editor/'
    },
    {
      id: 'advanced-custom-fields',
      name: 'Advanced Custom Fields',
      description: 'Customize WordPress with powerful, professional and intuitive fields.',
      author: 'WP Engine',
      rating: 4.9,
      downloads: 2000000,
      lastUpdated: '2023-11-20',
      tags: ['custom fields', 'meta', 'editor', 'developer'],
      imageUrl: 'https://ps.w.org/advanced-custom-fields/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/advanced-custom-fields/'
    },
    {
      id: 'redirection',
      name: 'Redirection',
      description: 'Manage 301 redirections, keep track of 404 errors, and improve your site ranking.',
      author: 'John Godley',
      rating: 4.7,
      downloads: 2000000,
      lastUpdated: '2023-10-25',
      tags: ['redirect', '301', 'seo', '404', 'permalink'],
      imageUrl: 'https://ps.w.org/redirection/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/redirection/'
    },
    {
      id: 'wp-fastest-cache',
      name: 'WP Fastest Cache',
      description: 'The simplest and fastest WP Cache system.',
      author: 'Emre Vona',
      rating: 4.8,
      downloads: 2000000,
      lastUpdated: '2023-11-10',
      tags: ['cache', 'performance', 'speed', 'optimization'],
      imageUrl: 'https://ps.w.org/wp-fastest-cache/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/wp-fastest-cache/'
    },
    {
      id: 'limit-login-attempts-reloaded',
      name: 'Limit Login Attempts Reloaded',
      description: 'Block excessive login attempts and protect your site against brute force attacks.',
      author: 'Limit Login Attempts Reloaded',
      rating: 4.7,
      downloads: 1000000,
      lastUpdated: '2023-11-28',
      tags: ['security', 'login', 'brute force', 'protection'],
      imageUrl: 'https://ps.w.org/limit-login-attempts-reloaded/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/limit-login-attempts-reloaded/'
    },
    {
      id: 'cookie-notice',
      name: 'Cookie Notice & Compliance for GDPR / CCPA',
      description: 'Cookie Notice allows you to elegantly inform users that your site uses cookies and helps you comply with GDPR, CCPA and other data privacy laws.',
      author: 'Hu-manity.co',
      rating: 4.5,
      downloads: 2000000,
      lastUpdated: '2023-11-15',
      tags: ['cookie', 'notice', 'gdpr', 'compliance', 'privacy'],
      imageUrl: 'https://ps.w.org/cookie-notice/assets/icon-256x256.png',
      detailUrl: 'https://en-au.wordpress.org/plugins/cookie-notice/'
    }
  ]
}
