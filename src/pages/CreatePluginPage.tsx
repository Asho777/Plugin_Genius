import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiTerminal, FiEye, FiMessageSquare, FiSave, FiDownload, FiSettings, FiCopy, FiCheck, FiPlay, FiRefreshCw, FiPackage, FiLoader, FiBook } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { AI_MODELS, Message, sendMessage, getApiKey } from '../services/aiService'
import { savePlugin } from '../services/pluginService'
import { formatCode } from '../services/codeService'
import { executePlugin, PluginExecutionResult } from '../services/pluginExecutionService'
import { buildPlugin, PluginBuildResult } from '../services/pluginBuildService'
import '../styles/create-plugin.css'
import '../styles/plugin-preview.css'
import { useScrollReset } from '../hooks/useScrollReset';
import { useScrollLock } from '../hooks/useScrollLock';

// Force scroll to top immediately before component even renders
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

const CreatePluginPage = () => {
  // Use the scroll reset hook inside the component
  useScrollReset();
  
  // Use scroll lock hook
  const { lockScroll, unlockScroll } = useScrollLock();
  
  const [activeAI, setActiveAI] = useState('gpt-4-1')
  const [pluginName, setPluginName] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: AI_MODELS.find(model => model.id === 'gpt-4-1')?.systemPrompt || ''
    },
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I\'ll help you create a WordPress plugin. What kind of functionality would you like to build?'
    }
  ])
  const [userMessage, setUserMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  // Pre-populate terminal output with static content instead of generating it dynamically
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npm init -y',
    'Wrote to package.json:',
    '{',
    `  "name": "${pluginName || 'my-custom-plugin'}",`,
    '  "version": "1.0.0",',
    '  "description": "",',
    '  ...',
    '}',
    '$ npm install @wordpress/scripts --save-dev',
    'Installing @wordpress/scripts...',
    '+ @wordpress/scripts@25.0.0',
    'added 1000 packages in 25s',
    '$ _'
  ])
  // Pre-populate code with a more premium WordPress plugin template
  const [code, setCode] = useState(`<?php
/**
 * Plugin Name: ${pluginName || 'My Custom Plugin'}
 * Description: A premium WordPress plugin created with Plugin Genius
 * Version: 1.0.0
 * Author: Plugin Genius
 * Author URI: https://plugingenius.ai
 * Text Domain: ${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}
 * Domain Path: /languages
 * License: GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main plugin class
 */
class ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_') : 'My_Custom_Plugin'} {
    /**
     * Plugin version
     *
     * @var string
     */
    const VERSION = '1.0.0';

    /**
     * Plugin singleton instance
     *
     * @var ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_') : 'My_Custom_Plugin'}
     */
    private static $instance = null;

    /**
     * Plugin constructor
     */
    private function __construct() {
        // Define constants
        $this->define_constants();

        // Initialize hooks
        $this->init_hooks();

        // Load textdomain
        add_action('plugins_loaded', array($this, 'load_textdomain'));
    }

    /**
     * Get plugin singleton instance
     *
     * @return ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_') : 'My_Custom_Plugin'} The plugin singleton instance
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Define plugin constants
     */
    private function define_constants() {
        define('${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_VERSION', self::VERSION);
        define('${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_FILE', __FILE__);
        define('${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_PATH', plugin_dir_path(__FILE__));
        define('${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_URL', plugin_dir_url(__FILE__));
        define('${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_BASENAME', plugin_basename(__FILE__));
    }

    /**
     * Initialize plugin hooks
     */
    private function init_hooks() {
        // Register activation and deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));

        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));

        // Add settings link to plugins page
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_plugin_action_links'));

        // Register shortcode
        add_shortcode('${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}', array($this, 'shortcode_callback'));

        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));

        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Load plugin textdomain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
    }

    /**
     * Plugin activation hook
     */
    public function activate() {
        // Create database tables if needed
        // $this->create_tables();

        // Add capabilities
        // $this->add_capabilities();

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation hook
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Enqueue frontend scripts and styles
     */
    public function enqueue_scripts() {
        // Enqueue CSS
        wp_enqueue_style(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-style',
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_URL . 'assets/css/style.css',
            array(),
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_VERSION
        );

        // Enqueue JS
        wp_enqueue_script(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-script',
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_URL . 'assets/js/script.js',
            array('jquery'),
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_VERSION,
            true
        );

        // Localize script
        wp_localize_script(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-script',
            '${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'my_custom_plugin'}_params',
            array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_nonce'),
            )
        );
    }

    /**
     * Enqueue admin scripts and styles
     */
    public function admin_enqueue_scripts($hook) {
        // Only load on plugin admin pages
        if (strpos($hook, '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}') === false) {
            return;
        }

        // Enqueue admin CSS
        wp_enqueue_style(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-admin-style',
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_URL . 'assets/css/admin.css',
            array(),
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_VERSION
        );

        // Enqueue admin JS
        wp_enqueue_script(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-admin-script',
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_URL . 'assets/js/admin.js',
            array('jquery'),
            ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_VERSION,
            true
        );
    }

    /**
     * Add plugin action links
     *
     * @param array $links Plugin action links
     * @return array Modified plugin action links
     */
    public function add_plugin_action_links($links) {
        $plugin_links = array(
            '<a href="' . admin_url('admin.php?page=${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_settings') . '">' . __('Settings', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}') . '</a>',
        );

        return array_merge($plugin_links, $links);
    }

    /**
     * Shortcode callback
     *
     * @param array $atts Shortcode attributes
     * @param string $content Shortcode content
     * @return string Shortcode output
     */
    public function shortcode_callback($atts, $content = null) {
        // Parse shortcode attributes
        $atts = shortcode_atts(
            array(
                'title' => __('Default Title', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
                'class' => '',
            ),
            $atts,
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}'
        );

        // Start output buffering
        ob_start();

        // Include template
        include ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_PATH . 'templates/shortcode-template.php';

        // Return buffered content
        return ob_get_clean();
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('${pluginName || 'My Custom Plugin'}', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
            __('${pluginName || 'My Custom Plugin'}', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
            'manage_options',
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}',
            array($this, 'admin_page_display'),
            'dashicons-admin-plugins',
            30
        );

        add_submenu_page(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}',
            __('Settings', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
            __('Settings', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
            'manage_options',
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_settings',
            array($this, 'settings_page_display')
        );
    }

    /**
     * Admin page display
     */
    public function admin_page_display() {
        include ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_PATH . 'templates/admin-page.php';
    }

    /**
     * Settings page display
     */
    public function settings_page_display() {
        include ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase() : 'MY_CUSTOM_PLUGIN'}_PATH . 'templates/settings-page.php';
    }

    /**
     * Register plugin settings
     */
    public function register_settings() {
        register_setting(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_settings',
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_options'
        );

        add_settings_section(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_general_section',
            __('General Settings', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
            array($this, 'general_section_callback'),
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_settings'
        );

        add_settings_field(
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_field_example',
            __('Example Field', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}'),
            array($this, 'example_field_callback'),
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_settings',
            '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_general_section'
        );
    }

    /**
     * General section callback
     */
    public function general_section_callback() {
        echo '<p>' . __('Configure the general settings for the plugin.', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}') . '</p>';
    }

    /**
     * Example field callback
     */
    public function example_field_callback() {
        $options = get_option('${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_options');
        $value = isset($options['example_field']) ? $options['example_field'] : '';

        echo '<input type="text" id="${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_field_example" name="${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}_options[example_field]" value="' . esc_attr($value) . '" class="regular-text">';
        echo '<p class="description">' . __('This is an example field description.', '${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}') . '</p>';
    }
}

/**
 * Initialize the plugin
 *
 * @return ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_') : 'My_Custom_Plugin'} The plugin instance
 */
function ${pluginName ? pluginName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_') : 'my_custom_plugin'}() {
    return ${pluginName ? pluginName.replace(/[^a-zA-Z0-9]/g, '_') : 'My_Custom_Plugin'}::instance();
}

// Start the plugin
${pluginName ? pluginName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_') : 'my_custom_plugin'}();`)

  // Pre-populate instructions with comprehensive plugin documentation
  const [instructions, setInstructions] = useState(`# ${pluginName || 'My Custom Plugin'} - WordPress Plugin

## Installation

1. Download the plugin zip file.
2. Log in to your WordPress admin panel.
3. Go to Plugins > Add New.
4. Click the "Upload Plugin" button at the top of the page.
5. Select the plugin zip file and click "Install Now".
6. After installation is complete, click "Activate Plugin".

## Features

- **Admin Dashboard**: Dedicated admin interface for managing plugin settings
- **Shortcode Support**: Use the \`[${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}]\` shortcode to display content on any page or post
- **Widget Support**: Drag and drop widget for easy sidebar integration
- **Customization Options**: Extensive settings to customize the plugin's appearance and behavior
- **Responsive Design**: Works seamlessly on all devices and screen sizes
- **Translation Ready**: Fully translatable with .pot file included

## Usage

### Basic Usage

After activating the plugin, you can use the shortcode \`[${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}]\` in any post or page to display the plugin's content.

### Shortcode Parameters

The shortcode accepts the following parameters:

- **title**: Set a custom title (default: "Default Title")
- **class**: Add custom CSS classes to the container

Example:
\`\`\`
[${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'} title="My Custom Title" class="custom-class"]
\`\`\`

### Admin Settings

1. Navigate to ${pluginName || 'My Custom Plugin'} > Settings in your WordPress admin menu.
2. Configure the plugin settings according to your preferences.
3. Click "Save Changes" to apply your settings.

## Customization

### CSS Customization

You can add custom CSS to style the plugin output. Add your custom styles to your theme's stylesheet or use a custom CSS plugin.

Example CSS:
\`\`\`css
.${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
}

.${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}-title {
    color: #333;
    font-size: 24px;
    margin-bottom: 15px;
}
\`\`\`

### Template Customization

Advanced users can override the plugin templates by copying them to their theme:

1. Create a folder named \`${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}\` in your theme directory.
2. Copy the template files from the plugin's \`templates\` directory to your theme's \`${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-custom-plugin'}\` directory.
3. Modify the templates as needed.

## Frequently Asked Questions

### How do I display the plugin content in a specific location?

Use the \`[${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}]\` shortcode in any post or page where you want the content to appear.

### Can I use the plugin with page builders?

Yes, the plugin is compatible with popular page builders like Elementor, Beaver Builder, and Divi.

### Is the plugin compatible with WPML/Polylang?

Yes, the plugin is translation-ready and compatible with multilingual plugins.

## Troubleshooting

### The plugin styles are not loading

1. Check if your theme is properly enqueuing styles.
2. Verify that the plugin's CSS file is accessible.
3. Clear your browser cache and any caching plugins.

### The shortcode is not working

1. Make sure you're using the correct shortcode syntax: \`[${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '_') : 'my_custom_plugin'}]\`.
2. Check if the plugin is properly activated.
3. Verify that your post or page content is not being filtered by another plugin.

## Support

For support, please contact us through our support portal or email us at support@example.com.

## Changelog

### 1.0.0
- Initial release`)

  const [copied, setCopied] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [pluginExecution, setPluginExecution] = useState<PluginExecutionResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildResult, setBuildResult] = useState<PluginBuildResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)
  const aiOptionsRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const initialRenderRef = useRef(true)
  const codeEditorRef = useRef<HTMLPreElement>(null)
  
  // Super aggressive scroll prevention - runs before anything else
  useEffect(() => {
    // Create a style element to force the page to the top
    const styleElement = document.createElement('style');
    styleElement.id = 'force-top-scroll-style';
    styleElement.innerHTML = `
      html, body {
        scroll-behavior: auto !important;
        overflow-anchor: none !important;
        scroll-padding-top: 0 !important;
        scroll-snap-type: none !important;
        overscroll-behavior: none !important;
      }
      
      body {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Force scroll to top with multiple approaches
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    };
    
    // Execute immediately
    forceScrollTop();
    
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      forceScrollTop();
      
      // Release the body position after a short delay
      setTimeout(() => {
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
        
        // But keep forcing scroll to top
        forceScrollTop();
        
        // Remove the style element after a delay
        setTimeout(() => {
          if (styleElement.parentNode) {
            document.head.removeChild(styleElement);
          }
          
          // One final force to top
          forceScrollTop();
        }, 100);
      }, 50);
    });
    
    // Add a class to body to disable smooth scrolling temporarily
    document.body.classList.add('disable-smooth-scroll');
    document.body.classList.add('create-plugin-body');
    
    // Remove the class after a delay
    const classTimeout = setTimeout(() => {
      document.body.classList.remove('disable-smooth-scroll');
    }, 1000);
    
    // Return cleanup function
    return () => {
      clearTimeout(classTimeout);
      document.body.classList.remove('disable-smooth-scroll');
      document.body.classList.remove('create-plugin-body');
      
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }
      
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
    };
  }, []);
  
  // Secondary scroll prevention that runs on mount
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      // Immediately prevent any default scroll behavior
      if (typeof window !== 'undefined') {
        // Save the current scroll position
        const savedPosition = window.scrollY;
        
        // Force scroll to top with multiple approaches
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Lock scroll temporarily to prevent any automatic scrolling
        document.body.style.overflow = 'hidden';
        
        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
          // Force scroll position again
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
          });
          
          // Unlock scroll after a short delay
          setTimeout(() => {
            document.body.style.overflow = '';
            
            // One final force to top
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }, 50);
        });
      }
    }
  }, []);

  // REMOVED: Dynamic terminal output generation
  // This was causing layout shifts after initial render
  
  // REMOVED: Dynamic code generation
  // This was causing layout shifts after initial render
  
  // Check if API key exists
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = await getApiKey(activeAI);
      setApiKeyMissing(!apiKey);
      
      // Update system prompt when AI model changes
      const model = AI_MODELS.find(model => model.id === activeAI);
      if (model) {
        setMessages(prev => {
          const newMessages = [...prev];
          const systemMessageIndex = newMessages.findIndex(m => m.role === 'system');
          
          if (systemMessageIndex >= 0) {
            newMessages[systemMessageIndex] = {
              role: 'system',
              content: model.systemPrompt
            };
          } else {
            newMessages.unshift({
              role: 'system',
              content: model.systemPrompt
            });
          }
          
          return newMessages;
        });
      }
    };
    
    checkApiKey();
  }, [activeAI]);
  
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Save scroll position before any potential state changes
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Add event listeners to prevent scrolling on AI model buttons
  useEffect(() => {
    const aiOptionsElement = aiOptionsRef.current;
    
    if (aiOptionsElement) {
      const handleTouchStart = (e: TouchEvent) => {
        // Prevent default only for AI model buttons
        const target = e.target as HTMLElement;
        if (target.classList.contains('ai-option')) {
          e.preventDefault();
        }
      };
      
      const handleWheel = (e: WheelEvent) => {
        // Prevent wheel events from propagating when interacting with AI options
        const target = e.target as HTMLElement;
        if (target.classList.contains('ai-option') || target.closest('.ai-options')) {
          e.stopPropagation();
        }
      };
      
      aiOptionsElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      aiOptionsElement.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        aiOptionsElement.removeEventListener('touchstart', handleTouchStart);
        aiOptionsElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);
  
  // Extract and format code from a message
  const extractCodeFromMessage = (message: string): string | null => {
    // Try to extract code from PHP code blocks
    const phpBlockMatch = message.match(/```php\s*([\s\S]*?)\s*```/) || 
                         message.match(/```\s*(<?php[\s\S]*?)\s*```/);
    
    if (phpBlockMatch && phpBlockMatch[1]) {
      // Ensure PHP code starts with <?php tag
      const extractedCode = phpBlockMatch[1].startsWith('<?php') 
        ? phpBlockMatch[1] 
        : `<?php\n${phpBlockMatch[1]}`;
      
      return extractedCode;
    }
    
    // Try to extract inline PHP code
    const inlinePhpMatch = message.match(/<\?php[\s\S]*?\?>/);
    if (inlinePhpMatch && inlinePhpMatch[0]) {
      return inlinePhpMatch[0];
    }
    
    // Try to extract any code block if PHP wasn't found
    const codeBlockMatch = message.match(/```[\w]*\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1];
    }
    
    return null;
  };
  
  // Extract instructions from a message
  const extractInstructionsFromMessage = (message: string): string | null => {
    // Look for sections that might contain instructions
    const instructionSections = [
      // Look for "## Installation" or "# Installation" sections
      message.match(/#{1,2}\s*Installation\s*\n([\s\S]*?)(?=#{1,2}|$)/),
      // Look for "## Usage" or "# Usage" sections
      message.match(/#{1,2}\s*Usage\s*\n([\s\S]*?)(?=#{1,2}|$)/),
      // Look for "## Instructions" or "# Instructions" sections
      message.match(/#{1,2}\s*Instructions\s*\n([\s\S]*?)(?=#{1,2}|$)/),
      // Look for "## How to use" or "# How to use" sections
      message.match(/#{1,2}\s*How to use\s*\n([\s\S]*?)(?=#{1,2}|$)/),
      // Look for "## Setup" or "# Setup" sections
      message.match(/#{1,2}\s*Setup\s*\n([\s\S]*?)(?=#{1,2}|$)/)
    ];
    
    // Combine all found instruction sections
    let extractedInstructions = '';
    instructionSections.forEach(match => {
      if (match && match[0]) {
        extractedInstructions += match[0] + '\n\n';
      }
    });
    
    // If no specific sections were found, look for paragraphs that might contain instructions
    if (!extractedInstructions) {
      // Look for paragraphs containing keywords like "install", "use", "setup", etc.
      const instructionKeywords = ['install', 'setup', 'configure', 'use', 'activate', 'add to', 'settings'];
      
      const paragraphs = message.split('\n\n');
      paragraphs.forEach(paragraph => {
        const containsInstructionKeyword = instructionKeywords.some(keyword => 
          paragraph.toLowerCase().includes(keyword)
        );
        
        if (containsInstructionKeyword && !paragraph.includes('```')) {
          extractedInstructions += paragraph + '\n\n';
        }
      });
    }
    
    return extractedInstructions.trim() || null;
  };
  
  // Format and transfer code to the code editor
  const formatAndTransferCode = async (extractedCode: string) => {
    try {
      // Format the code
      const formattedCode = formatCode(extractedCode);
      
      // Update the code state
      setCode(formattedCode);
      
      // Add to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ Format and transfer code from AI Chat',
        'Code extracted, formatted, and transferred to the Code editor.'
      ]);
      
      // Switch to code tab
      setActiveTab('code');
      
      // Log the code to console for debugging
      console.log("Code transferred to editor:", formattedCode);
      
      return true;
    } catch (error) {
      console.error('Error formatting code:', error);
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ Format and transfer code from AI Chat',
        'Error formatting code. Using unformatted code instead.'
      ]);
      
      // Still update the code state with unformatted code
      setCode(extractedCode);
      
      // Switch to code tab
      setActiveTab('code');
      
      // Log the code to console for debugging
      console.log("Unformatted code transferred to editor:", extractedCode);
      
      return false;
    }
  };
  
  // Process AI response to remove code blocks and add a note about code transfer
  const processAIResponse = (response: string): string => {
    // Check if response contains code
    const hasCode = /```[\w]*\s*([\s\S]*?)\s*```/.test(response) || 
                   /<\?php[\s\S]*?\?>/.test(response);
    
    if (!hasCode) {
      return response;
    }
    
    // Extract code from the response
    const extractedCode = extractCodeFromMessage(response);
    if (extractedCode) {
      // Automatically transfer code to the code editor
      formatAndTransferCode(extractedCode);
    }
    
    // Extract instructions from the response
    const extractedInstructions = extractInstructionsFromMessage(response);
    if (extractedInstructions) {
      // Update instructions
      setInstructions(prev => {
        if (prev) {
          return prev + '\n\n' + extractedInstructions;
        }
        return extractedInstructions;
      });
    }
    
    // Replace code blocks with a note
    let processedResponse = response.replace(/```[\w]*\s*([\s\S]*?)\s*```/g, 
      '```\n[Code has been transferred to the Code tab]\n```');
    
    // Replace inline PHP code
    processedResponse = processedResponse.replace(/<\?php[\s\S]*?\?>/g, 
      '[PHP code has been transferred to the Code tab]');
    
    // Add a note at the end if it's not already there
    if (!processedResponse.includes('transferred to the Code tab')) {
      processedResponse += '\n\n**Note:** All code has been transferred to the Code tab.';
    }
    
    // If instructions were found, add a note about them
    if (extractedInstructions && !processedResponse.includes('Instructions have been added')) {
      processedResponse += '\n\n**Note:** Installation and usage instructions have been added to the Instructions tab.';
    }
    
    return processedResponse;
  };
  
  // Handle sending message to AI
  const handleSendMessage = async (e?: React.FormEvent) => {
    // Prevent default form submission behavior if event is provided
    if (e) {
      e.preventDefault();
    }
    
    if (!userMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    
    setMessages(newMessages);
    setUserMessage('');
    setIsLoading(true);
    
    try {
      // Send message to AI
      const response = await sendMessage(activeAI, newMessages);
      
      // Process response to remove code blocks and extract content
      const processedResponse = processAIResponse(response);
      
      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: 'assistant', content: processedResponse }
      ]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please check your API key and try again.' 
        }
      ]);
      
      setApiKeyMissing(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle transferring code from a specific message
  const handleTransferCodeFromMessage = async (messageContent: string) => {
    const extractedCode = extractCodeFromMessage(messageContent);
    
    if (extractedCode) {
      await formatAndTransferCode(extractedCode);
      return true;
    }
    
    // If no code was found, add a message to the terminal
    setTerminalOutput(prev => [
      ...prev,
      '$ Transfer code from message',
      'No code found in the selected message.'
    ]);
    
    return false;
  };
  
  // Handle transferring instructions from a specific message
  const handleTransferInstructionsFromMessage = (messageContent: string) => {
    const extractedInstructions = extractInstructionsFromMessage(messageContent);
    
    if (extractedInstructions) {
      setInstructions(prev => {
        // If there are already instructions, append the new ones
        if (prev) {
          return prev + '\n\n' + extractedInstructions;
        }
        return extractedInstructions;
      });
      
      // Switch to instructions tab
      setActiveTab('instructions');
      
      return true;
    }
    
    return false;
  };
  
  // Handle terminal command
  const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      // Add command to terminal output
      const command = terminalInput.trim();
      setTerminalOutput(prev => [...prev, `$ ${command}`]);
      
      // Process command
      if (command.startsWith('php ')) {
        // Simulate PHP execution
        setTerminalOutput(prev => [
          ...prev, 
          'Executing PHP code...',
          'PHP code executed successfully.'
        ]);
        
        // Execute plugin if it's a plugin execution command
        if (command.includes('plugin.php')) {
          handleExecutePlugin();
        }
      } else if (command.startsWith('wp ')) {
        // Simulate WordPress CLI
        if (command.includes('plugin activate')) {
          handleExecutePlugin();
          setTerminalOutput(prev => [
            ...prev,
            `Plugin '${pluginName || 'my-custom-plugin'}' activated.`,
            'Success: Activated 1 of 1 plugins.'
          ]);
        } else if (command.includes('plugin install')) {
          setTerminalOutput(prev => [
            ...prev,
            'Installing plugin...',
            'Plugin installed successfully.',
            'Activating plugin...',
            `Plugin '${pluginName || 'my-custom-plugin'}' activated.`,
            'Success: Installed and activated 1 of 1 plugins.'
          ]);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'WordPress CLI command executed successfully.'
          ]);
        }
      } else if (command.startsWith('npm ') || command.startsWith('yarn ')) {
        // Simulate package manager
        if (command.includes('install') || command.includes('add')) {
          setTerminalOutput(prev => [
            ...prev,
            'Installing packages...',
            'added 120 packages in 3.5s',
            'Packages installed successfully.'
          ]);
        } else if (command.includes('build')) {
          setTerminalOutput(prev => [
            ...prev,
            'Building project...',
            'Creating an optimized production build...',
            'Compiled successfully.',
            'Build complete.'
          ]);
          handleBuildPlugin();
        } else if (command.includes('start') || command.includes('dev')) {
          setTerminalOutput(prev => [
            ...prev,
            'Starting development server...',
            'Server running at http://localhost:3000',
            'Ready for development.'
          ]);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'npm command executed successfully.'
          ]);
        }
      } else if (command.startsWith('zip ')) {
        // Simulate zip creation
        handleBuildPlugin();
      } else if (command === 'clear' || command === 'cls') {
        // Clear terminal
        setTerminalOutput(['Terminal cleared.']);
      } else if (command === 'extract-code' || command === 'get-code') {
        // Extract code from the last AI message
        const lastAiMessage = [...messages].reverse().find(m => m.role === 'assistant');
        if (lastAiMessage) {
          handleTransferCodeFromMessage(lastAiMessage.content);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'No AI messages found to extract code from.'
          ]);
        }
      } else if (command === 'extract-instructions' || command === 'get-instructions') {
        // Extract instructions from the last AI message
        const lastAiMessage = [...messages].reverse().find(m => m.role === 'assistant');
        if (lastAiMessage) {
          const success = handleTransferInstructionsFromMessage(lastAiMessage.content);
          if (success) {
            setTerminalOutput(prev => [
              ...prev,
              'Instructions extracted and transferred to the Instructions tab.'
            ]);
          } else {
            setTerminalOutput(prev => [
              ...prev,
              'No instructions found in the last AI message.'
            ]);
          }
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'No AI messages found to extract instructions from.'
          ]);
        }
      } else if (command === 'show-code') {
        // Log current code to terminal
        setTerminalOutput(prev => [
          ...prev,
          'Current code in editor:',
          '---',
          code,
          '---'
        ]);
      } else if (command === 'show-instructions') {
        // Log current instructions to terminal
        setTerminalOutput(prev => [
          ...prev,
          'Current instructions:',
          '---',
          instructions || 'No instructions available.',
          '---'
        ]);
      } else if (command === 'execute' || command === 'run') {
        // Execute the plugin
        handleExecutePlugin();
      } else if (command === 'build') {
        // Build the plugin
        handleBuildPlugin();
      } else if (command === 'save') {
        // Save the plugin
        handleSavePlugin();
      } else if (command === 'help') {
        // Show help
        setTerminalOutput(prev => [
          ...prev,
          'Available commands:',
          '  php <file.php>         - Execute PHP code',
          '  wp plugin activate     - Activate WordPress plugin',
          '  wp plugin install      - Install WordPress plugin',
          '  npm install <package>  - Install npm package',
          '  npm build              - Build project',
          '  npm start              - Start development server',
          '  zip <filename>         - Create zip archive',
          '  clear, cls             - Clear terminal',
          '  extract-code, get-code - Extract code from AI message',
          '  extract-instructions   - Extract instructions from AI message',
          '  show-code              - Show current code',
          '  show-instructions      - Show current instructions',
          '  execute, run           - Execute plugin',
          '  build                  - Build plugin',
          '  save                   - Save plugin',
          '  help                   - Show this help'
        ]);
      } else if (command === 'ls' || command === 'dir') {
        // List files
        setTerminalOutput(prev => [
          ...prev,
          'Directory listing:',
          `${pluginName || 'my-custom-plugin'}/`,
          `├── ${pluginName || 'my-custom-plugin'}.php`,
          '├── assets/',
          '│   ├── css/',
          '│   │   ├── style.css',
          '│   │   └── admin.css',
          '│   └── js/',
          '│       ├── script.js',
          '│       └── admin.js',
          '├── includes/',
          '│   └── functions.php',
          '├── templates/',
          '│   ├── admin-page.php',
          '│   ├── settings-page.php',
          '│   └── shortcode-template.php',
          '├── languages/',
          '│   └── plugin-text-domain.pot',
          '└── readme.txt'
        ]);
      } else if (command === 'cat' && command.includes('.php')) {
        // Show file content
        setTerminalOutput(prev => [
          ...prev,
          'File content:',
          '---',
          code,
          '---'
        ]);
      } else {
        // Generic response
        setTerminalOutput(prev => [
          ...prev,
          `Command executed: ${command}`
        ]);
      }
      
      setTerminalInput('');
    }
  };
  
  // Handle copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle format code
  const handleFormatCode = () => {
    if (!code.trim() || formatting) return;
    
    setFormatting(true);
    
    try {
      // Format the code
      const formattedCode = formatCode(code);
      setCode(formattedCode);
      
      // Add to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ Format code',
        'Code formatted successfully.'
      ]);
    } catch (error) {
      console.error('Error formatting code:', error);
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ Format code',
        'Error formatting code. Please try again.'
      ]);
    } finally {
      setFormatting(false);
    }
  };
  
  // Handle save plugin
  const handleSavePlugin = () => {
    if (!pluginName) {
      alert('Please enter a plugin name before saving.');
      return;
    }
    
    try {
      savePlugin({
        id: Date.now().toString(),
        name: pluginName,
        description: 'A custom WordPress plugin created with Plugin Genius',
        thumbnail: '/images/plugin-thumbnail.jpg',
        code: code,
        createdAt: new Date().toISOString()
      });
      
      // Add to terminal output
      setTerminalOutput(prev => [
        ...prev,
        `$ Save plugin "${pluginName}"`,
        'Plugin saved successfully to your library.'
      ]);
      
      alert('Plugin saved successfully!');
    } catch (error) {
      console.error('Error saving plugin:', error);
      alert('Error saving plugin. Please try again.');
    }
  };
  
  // Handle execute plugin
  const handleExecutePlugin = () => {
    if (!code.trim() || isExecuting) return;
    
    setIsExecuting(true);
    
    try {
      // Execute the plugin code
      const result = executePlugin({ 
        code, 
        name: pluginName || 'My Custom Plugin' 
      });
      
      setPluginExecution(result);
      
      // Add execution result to terminal output
      setTerminalOutput(prev => [
        ...prev,
        `$ php -l plugin.php`,
        result.success 
          ? 'No syntax errors detected in plugin.php' 
          : `PHP Parse error: ${result.errors} in plugin.php`,
        `$ wp plugin activate ${pluginName || 'my-custom-plugin'}`,
        result.success 
          ? `Plugin '${pluginName || 'my-custom-plugin'}' activated.` 
          : `Error: ${result.errors}`
      ]);
      
    } catch (error) {
      console.error('Error executing plugin:', error);
      
      setPluginExecution({
        success: false,
        output: '',
        errors: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ Execute plugin',
        'Error executing plugin. Please check your code and try again.'
      ]);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Handle build plugin
  const handleBuildPlugin = async () => {
    if (!code.trim() || isBuilding) return;
    
    if (!pluginName) {
      alert('Please enter a plugin name before building.');
      return;
    }
    
    setIsBuilding(true);
    setBuildResult(null);
    
    try {
      // Build the plugin
      const result = await buildPlugin({
        code,
        name: pluginName,
        includeAssets: true,
        includeReadme: true
      });
      
      setBuildResult(result);
      
      // Add build result to terminal output
      setTerminalOutput(prev => [
        ...prev,
        `$ zip -r ${result.filename || 'plugin.zip'} .`,
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/` 
          : `Error: ${result.error}`,
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/${pluginName || 'my-custom-plugin'}.php` 
          : '',
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/readme.txt` 
          : '',
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/assets/` 
          : '',
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/assets/css/` 
          : '',
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/assets/js/` 
          : '',
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/templates/` 
          : '',
        result.success 
          ? `  adding: ${pluginName || 'my-custom-plugin'}/languages/` 
          : '',
        result.success 
          ? `Successfully created ${result.filename}` 
          : ''
      ]);
      
      if (result.success) {
        // Add download notification to terminal
        setTerminalOutput(prev => [
          ...prev,
          `Plugin zip file "${result.filename}" has been downloaded to your computer.`
        ]);
      }
      
    } catch (error) {
      console.error('Error building plugin:', error);
      
      setBuildResult({
        success: false,
        message: 'Failed to build plugin.',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ Build plugin',
        'Error building plugin. Please try again.'
      ]);
    } finally {
      setIsBuilding(false);
    }
  };
  
  // Handle AI model selection with aggressive approach to prevent scrolling
  const handleAIModelSelect = (modelId: string) => {
    // Lock scroll before making any changes
    lockScroll();
    
    // Store current scroll position
    const currentScrollPosition = window.scrollY;
    
    // Update the active AI model
    setActiveAI(modelId);
    
    // Use multiple techniques to ensure scroll position is maintained
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
      
      // Schedule multiple attempts to restore scroll position
      setTimeout(() => {
        window.scrollTo(0, currentScrollPosition);
        
        // Unlock scroll after a delay to ensure the position is maintained
        setTimeout(() => {
          unlockScroll();
          
          // One final scroll position check
          setTimeout(() => {
            window.scrollTo(0, currentScrollPosition);
          }, 50);
        }, 50);
      }, 0);
    });
  };
  
  // Update plugin name in code when it changes
  useEffect(() => {
    // Only update the code if the plugin name changes and there's a default code template
    if (code.includes('Plugin Name:')) {
      const updatedCode = code.replace(
        /Plugin Name: .*$/m, 
        `Plugin Name: ${pluginName || 'My Custom Plugin'}`
      );
      setCode(updatedCode);
      
      // Also update instructions with the new plugin name
      if (instructions.includes('# ')) {
        const updatedInstructions = instructions.replace(
          /# .*? - WordPress Plugin/,
          `# ${pluginName || 'My Custom Plugin'} - WordPress Plugin`
        );
        setInstructions(updatedInstructions);
      }
    }
  }, [pluginName]);
  
  return (
    <div className="create-plugin-page" ref={pageRef}>
      <div className="create-plugin-navbar">
        <Navbar />
      </div>
      
      <main className="create-plugin-content">
        <header className="create-plugin-header">
          <motion.div 
            className="header-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="page-title">Create Your Custom Plugin</h1>
            <p className="page-subtitle">Use AI to build powerful WordPress plugins without writing a single line of code</p>
            
            <div className="plugin-name-container">
              <input 
                type="text" 
                className="plugin-name-input" 
                placeholder="Enter Plugin Name" 
                value={pluginName}
                onChange={(e) => setPluginName(e.target.value)}
              />
            </div>
          </motion.div>
        </header>
        
        <section className="workspace-section">
          <div className="workspace-container">
            <div className="ai-selector">
              <div className="ai-selector-label">AI Model:</div>
              <div className="ai-options" ref={aiOptionsRef}>
                {AI_MODELS.map(ai => (
                  <div 
                    key={ai.id}
                    className={`ai-option ${activeAI === ai.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAIModelSelect(ai.id);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={(e) => e.preventDefault()}
                    onTouchEnd={(e) => e.preventDefault()}
                    onTouchMove={(e) => e.preventDefault()}
                    onWheel={(e) => e.preventDefault()}
                  >
                    {ai.name}
                  </div>
                ))}
              </div>
              
              <div className="workspace-actions">
                <button className="action-button" onClick={handleSavePlugin}>
                  <FiSave />
                  <span>Save</span>
                </button>
                <button 
                  className="action-button"
                  onClick={handleBuildPlugin}
                  disabled={isBuilding}
                >
                  {isBuilding ? (
                    <>
                      <FiLoader className="icon-spin" />
                      <span>Building...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload />
                      <span>Build & Export</span>
                    </>
                  )}
                </button>
                <button className="action-button" onClick={() => window.location.href = '/settings'}>
                  <FiSettings />
                  <span>Settings</span>
                </button>
              </div>
            </div>
            
            {apiKeyMissing && (
              <div className="api-key-warning">
                <p>
                  <strong>API Key Required:</strong> Please add your {AI_MODELS.find(model => model.id === activeAI)?.name} API key in settings to use this model.
                </p>
                <button 
                  className="api-key-button"
                  onClick={() => window.location.href = '/settings'}
                >
                  Add API Key
                </button>
              </div>
            )}
            
            {buildResult && (
              <div className={`build-result ${buildResult.success ? 'success' : 'error'}`}>
                <p>
                  <strong>{buildResult.success ? 'Build Successful:' : 'Build Failed:'}</strong> {buildResult.message}
                </p>
                {buildResult.success && (
                  <p className="build-note">
                    The plugin zip file has been downloaded to your computer. You can now install it in WordPress.
                  </p>
                )}
              </div>
            )}
            
            <div className="workspace-layout">
              <div className="workspace-sidebar">
                <div className="workspace-tabs">
                  <button 
                    className={`workspace-tab ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                  >
                    <FiMessageSquare />
                    <span>AI Chat</span>
                  </button>
                  <button 
                    className={`workspace-tab ${activeTab === 'code' ? 'active' : ''}`}
                    onClick={() => setActiveTab('code')}
                  >
                    <FiCode />
                    <span>Code</span>
                  </button>
                  <button 
                    className={`workspace-tab ${activeTab === 'instructions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('instructions')}
                  >
                    <FiBook />
                    <span>Instructions</span>
                  </button>
                  <button 
                    className={`workspace-tab ${activeTab === 'terminal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('terminal')}
                  >
                    <FiTerminal />
                    <span>Terminal</span>
                  </button>
                </div>
                
                <div className="workspace-panel">
                  {activeTab === 'chat' && (
                    <div className="chat-panel">
                      <div className="chat-messages">
                        {messages.filter(m => m.role !== 'system').map((message, index) => (
                          <div 
                            key={index} 
                            className={`message ${message.role === 'assistant' ? 'ai' : 'user'}`}
                          >
                            <div className="message-avatar">
                              {message.role === 'assistant' ? 'AI' : 'You'}
                            </div>
                            <div className="message-content">
                              <div dangerouslySetInnerHTML={{ __html: message.content.replace(/```([\s\S]*?)```/g, (match, code) => {
                                return `<pre style="background-color: #1e1e1e; padding: 10px; border-radius: 4px; overflow-x: auto; color: #d4d4d4;">${code}</pre>`;
                              })}} />
                              {message.role === 'assistant' && (
                                <div className="message-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                  {extractCodeFromMessage(message.content) && (
                                    <button 
                                      className="code-action" 
                                      style={{ 
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                      }}
                                      onClick={() => handleTransferCodeFromMessage(message.content)}
                                    >
                                      <FiCode /> Use this code
                                    </button>
                                  )}
                                  {extractInstructionsFromMessage(message.content) && (
                                    <button 
                                      className="code-action" 
                                      style={{ 
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                      }}
                                      onClick={() => {
                                        handleTransferInstructionsFromMessage(message.content);
                                        setActiveTab('instructions');
                                      }}
                                    >
                                      <FiBook /> View instructions
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="message ai">
                            <div className="message-avatar">AI</div>
                            <div className="message-content typing">
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      <form 
                        className="chat-input-container" 
                        onSubmit={handleSendMessage}
                      >
                        <textarea 
                          className="chat-input" 
                          placeholder="Type your message here..."
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={isLoading || apiKeyMissing}
                        ></textarea>
                        <button 
                          type="button" 
                          className="chat-send-button"
                          onClick={() => handleSendMessage()}
                          disabled={isLoading || apiKeyMissing}
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}
                  
                  {activeTab === 'code' && (
                    <div className="code-panel">
                      <div className="code-editor">
                        <pre className="code-content" ref={codeEditorRef}>
                          {code}
                        </pre>
                      </div>
                      <div className="code-actions">
                        <button 
                          className="code-action"
                          onClick={handleCopyCode}
                        >
                          {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                        </button>
                        <button 
                          className="code-action"
                          onClick={handleFormatCode}
                          disabled={formatting}
                        >
                          {formatting ? 'Formatting...' : 'Format'}
                        </button>
                        <button 
                          className="code-action"
                          onClick={handleExecutePlugin}
                          disabled={isExecuting}
                        >
                          {isExecuting ? <><FiRefreshCw /> Executing...</> : <><FiPlay /> Execute</>}
                        </button>
                        <button 
                          className="code-action"
                          onClick={handleBuildPlugin}
                          disabled={isBuilding}
                        >
                          {isBuilding ? <><FiLoader className="icon-spin" /> Building...</> : <><FiPackage /> Build</>}
                        </button>
                        <button 
                          className="code-action" 
                          onClick={handleSavePlugin}
                        >
                          <FiSave /> Save
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'instructions' && (
                    <div className="instructions-panel">
                      <div className="instructions-content">
                        {instructions ? (
                          <div dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br>').replace(/#{1,6}\s+(.*?)$/gm, '<h3>$1</h3>') }} />
                        ) : (
                          <div className="no-instructions">
                            <p>No instructions available yet. Ask the AI about how to use the plugin to generate instructions.</p>
                            <button 
                              className="code-action"
                              onClick={() => {
                                setUserMessage("Can you provide detailed instructions on how to install and use this plugin?");
                                setActiveTab('chat');
                                setTimeout(() => {
                                  handleSendMessage();
                                }, 100);
                              }}
                            >
                              Ask for instructions
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'terminal' && (
                    <div className="terminal-panel">
                      <div className="terminal-output">
                        {terminalOutput.map((line, index) => (
                          <div key={index} className="terminal-line">{line}</div>
                        ))}
                      </div>
                      <div className="terminal-input-container">
                        <span className="terminal-prompt">$</span>
                        <input 
                          type="text" 
                          className="terminal-input" 
                          placeholder="Enter command... (type 'help' for commands)" 
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyDown={handleTerminalCommand}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="preview-panel">
                <div className="preview-header">
                  <h3 className="preview-title">
                    <FiEye /> Preview
                  </h3>
                  <div className="preview-controls">
                    <button 
                      className={`preview-control ${previewMode === 'desktop' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('desktop')}
                    >
                      Desktop
                    </button>
                    <button 
                      className={`preview-control ${previewMode === 'tablet' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('tablet')}
                    >
                      Tablet
                    </button>
                    <button 
                      className={`preview-control ${previewMode === 'mobile' ? 'active' : ''}`}
                      onClick={() => setPreviewMode('mobile')}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
                <div className="preview-content">
                  {pluginExecution && pluginExecution.renderedHtml ? (
                    // If plugin has been executed, show the rendered HTML
                    <div 
                      className={`preview-wordpress preview-${previewMode}`}
                      dangerouslySetInnerHTML={{ __html: pluginExecution.renderedHtml }}
                    />
                  ) : (
                    // Otherwise show the default WordPress admin preview
                    <div className={`preview-wordpress preview-${previewMode}`}>
                      <div className="preview-wp-header">
                        <div className="preview-wp-logo">W</div>
                        <div className="preview-wp-title">WordPress Admin</div>
                      </div>
                      <div className="preview-wp-sidebar">
                        <div className="preview-wp-menu-item">Dashboard</div>
                        <div className="preview-wp-menu-item">Posts</div>
                        <div className="preview-wp-menu-item">Media</div>
                        <div className="preview-wp-menu-item">Pages</div>
                        <div className="preview-wp-menu-item active">Plugins</div>
                        <div className="preview-wp-menu-item">Appearance</div>
                        <div className="preview-wp-menu-item">Users</div>
                        <div className="preview-wp-menu-item">Tools</div>
                        <div className="preview-wp-menu-item">Settings</div>
                      </div>
                      <div className="preview-wp-content">
                        <div className="preview-wp-page-title">Plugins</div>
                        <div className="preview-wp-plugin-card">
                          <div className="preview-wp-plugin-name">{pluginName || 'My Custom Plugin'}</div>
                          <div className="preview-wp-plugin-description">A custom WordPress plugin created with Plugin Genius</div>
                          <div className="preview-wp-plugin-actions">
                            <button 
                              className="preview-wp-plugin-action"
                              onClick={handleExecutePlugin}
                              disabled={isExecuting}
                            >
                              {isExecuting ? 'Activating...' : 'Activate'}
                            </button>
                            <button className="preview-wp-plugin-action">Edit</button>
                            <button className="preview-wp-plugin-action">Delete</button>
                          </div>
                        </div>
                        
                        {/* Display execution status if plugin has been executed */}
                        {pluginExecution && (
                          <div className={`wp-preview-status ${pluginExecution.success ? 'success' : 'error'}`}>
                            {pluginExecution.success 
                              ? `Plugin "${pluginName || 'My Custom Plugin'}" activated successfully.` 
                              : `Error: ${pluginExecution.errors}`}
                          </div>
                        )}
                        
                        {/* Display execution log if plugin has been executed */}
                        {pluginExecution && pluginExecution.output && (
                          <div className="wp-preview-log">
                            {pluginExecution.output}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default CreatePluginPage
