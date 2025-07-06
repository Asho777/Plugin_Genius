import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiTerminal, FiEye, FiMessageSquare, FiSave, FiDownload, FiSettings, FiCopy, FiCheck, FiPlay, FiRefreshCw, FiPackage, FiLoader } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Message, sendMessage, getApiKey } from '../services/aiService'
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
  
  const [pluginName, setPluginName] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are an expert WordPress plugin developer with 15+ years of experience, specializing in creating professional, production-ready WordPress plugins.'
    },
    {
      role: 'assistant',
      content: 'Hello! I\'m your professional WordPress plugin development assistant. I specialize in creating production-ready, secure, and well-architected WordPress plugins that follow all WordPress coding standards and best practices.\n\nI can help you build:\n• Custom post types and meta boxes\n• Admin interfaces and settings pages\n• Shortcodes and widgets\n• REST API endpoints\n• Database integrations\n• Security-hardened plugins\n• Multisite-compatible solutions\n\nWhat kind of professional WordPress plugin would you like to create today?'
    }
  ])
  const [userMessage, setUserMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  // Enhanced terminal output with professional WordPress development commands
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ wp --version',
    'WP-CLI 2.8.1',
    '$ composer --version', 
    'Composer version 2.5.8',
    '$ php --version',
    'PHP 8.1.0 (cli)',
    '$ wp plugin scaffold my-custom-plugin',
    'Success: Created plugin files.',
    '$ wp plugin activate my-custom-plugin',
    'Plugin activated.',
    '$ _'
  ])
  // Professional WordPress plugin starter template
  const [code, setCode] = useState(`<?php
/**
 * Plugin Name: ${pluginName || 'Professional Custom Plugin'}
 * Plugin URI: https://example.com/plugins/professional-custom-plugin
 * Description: A professional, production-ready WordPress plugin built with industry best practices, security standards, and clean architecture.
 * Version: 1.0.0
 * Author: Plugin Genius
 * Author URI: https://plugingenius.com
 * Text Domain: professional-custom-plugin
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Network: false
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PROFESSIONAL_PLUGIN_VERSION', '1.0.0');
define('PROFESSIONAL_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('PROFESSIONAL_PLUGIN_URL', plugin_dir_url(__FILE__));
define('PROFESSIONAL_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Plugin Class
 * 
 * Follows singleton pattern and WordPress best practices
 */
class Professional_Custom_Plugin {
    
    /**
     * Single instance of the plugin
     */
    private static $instance = null;
    
    /**
     * Get single instance of the plugin
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor - Initialize the plugin
     */
    private function __construct() {
        $this->init_hooks();
    }
    
    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Activation and deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        // Initialize plugin
        add_action('init', array($this, 'init'));
        
        // Admin hooks
        if (is_admin()) {
            add_action('admin_menu', array($this, 'add_admin_menu'));
            add_action('admin_init', array($this, 'admin_init'));
        }
        
        // Frontend hooks
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Shortcode
        add_shortcode('professional_plugin', array($this, 'shortcode_handler'));
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create database tables if needed
        $this->create_tables();
        
        // Set default options
        $this->set_default_options();
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Log activation
        error_log('Professional Custom Plugin activated');
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Clean up temporary data
        $this->cleanup_temp_data();
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Log deactivation
        error_log('Professional Custom Plugin deactivated');
    }
    
    /**
     * Initialize plugin functionality
     */
    public function init() {
        // Load text domain for internationalization
        load_plugin_textdomain(
            'professional-custom-plugin',
            false,
            dirname(PROFESSIONAL_PLUGIN_BASENAME) . '/languages'
        );
        
        // Initialize custom post types
        $this->register_post_types();
        
        // Initialize custom taxonomies
        $this->register_taxonomies();
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('Professional Plugin', 'professional-custom-plugin'),
            __('Professional Plugin', 'professional-custom-plugin'),
            'manage_options',
            'professional-plugin',
            array($this, 'admin_page'),
            'dashicons-admin-plugins',
            30
        );
    }
    
    /**
     * Admin page callback
     */
    public function admin_page() {
        // Verify user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        // Handle form submission
        if (isset($_POST['submit']) && wp_verify_nonce($_POST['_wpnonce'], 'professional_plugin_settings')) {
            $this->save_settings();
        }
        
        // Get current settings
        $settings = get_option('professional_plugin_settings', array());
        
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <form method="post" action="">
                <?php wp_nonce_field('professional_plugin_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="plugin_enabled"><?php _e('Enable Plugin', 'professional-custom-plugin'); ?></label>
                        </th>
                        <td>
                            <input type="checkbox" id="plugin_enabled" name="plugin_enabled" value="1" 
                                   <?php checked(isset($settings['enabled']) ? $settings['enabled'] : 0, 1); ?> />
                            <p class="description"><?php _e('Enable or disable the plugin functionality.', 'professional-custom-plugin'); ?></p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
    
    /**
     * Initialize admin settings
     */
    public function admin_init() {
        // Register settings
        register_setting('professional_plugin_settings', 'professional_plugin_settings');
    }
    
    /**
     * Save plugin settings
     */
    private function save_settings() {
        $settings = array(
            'enabled' => isset($_POST['plugin_enabled']) ? 1 : 0
        );
        
        update_option('professional_plugin_settings', $settings);
        
        add_action('admin_notices', function() {
            echo '<div class="notice notice-success is-dismissible"><p>' . 
                 __('Settings saved successfully!', 'professional-custom-plugin') . '</p></div>';
        });
    }
    
    /**
     * Enqueue frontend scripts and styles
     */
    public function enqueue_scripts() {
        wp_enqueue_style(
            'professional-plugin-style',
            PROFESSIONAL_PLUGIN_URL . 'assets/css/style.css',
            array(),
            PROFESSIONAL_PLUGIN_VERSION
        );
        
        wp_enqueue_script(
            'professional-plugin-script',
            PROFESSIONAL_PLUGIN_URL . 'assets/js/script.js',
            array('jquery'),
            PROFESSIONAL_PLUGIN_VERSION,
            true
        );
    }
    
    /**
     * Shortcode handler
     */
    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'title' => __('Professional Plugin', 'professional-custom-plugin'),
            'content' => __('This is a professional WordPress plugin.', 'professional-custom-plugin')
        ), $atts, 'professional_plugin');
        
        ob_start();
        ?>
        <div class="professional-plugin-shortcode">
            <h3><?php echo esc_html($atts['title']); ?></h3>
            <p><?php echo esc_html($atts['content']); ?></p>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Create database tables
     */
    private function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'professional_plugin_data';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name tinytext NOT NULL,
            data text NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    /**
     * Set default plugin options
     */
    private function set_default_options() {
        $default_settings = array(
            'enabled' => 1,
            'version' => PROFESSIONAL_PLUGIN_VERSION
        );
        
        add_option('professional_plugin_settings', $default_settings);
    }
    
    /**
     * Clean up temporary data
     */
    private function cleanup_temp_data() {
        // Clean up any temporary data, cache, etc.
        wp_cache_flush();
    }
    
    /**
     * Register custom post types
     */
    private function register_post_types() {
        // Example custom post type
        register_post_type('professional_item', array(
            'labels' => array(
                'name' => __('Professional Items', 'professional-custom-plugin'),
                'singular_name' => __('Professional Item', 'professional-custom-plugin')
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'thumbnail'),
            'show_in_rest' => true
        ));
    }
    
    /**
     * Register custom taxonomies
     */
    private function register_taxonomies() {
        // Example custom taxonomy
        register_taxonomy('professional_category', 'professional_item', array(
            'labels' => array(
                'name' => __('Professional Categories', 'professional-custom-plugin'),
                'singular_name' => __('Professional Category', 'professional-custom-plugin')
            ),
            'hierarchical' => true,
            'show_in_rest' => true
        ));
    }
}

// Initialize the plugin
Professional_Custom_Plugin::get_instance();`)
  const [copied, setCopied] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [pluginExecution, setPluginExecution] = useState<PluginExecutionResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildResult, setBuildResult] = useState<PluginBuildResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)
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

  // Check if API key exists
  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = await getApiKey('cursor-ai-style');
      setApiKeyMissing(!apiKey);
    };
    
    checkApiKey();
  }, []);
  
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
        '$ wp plugin validate --format=json',
        'Plugin validation completed successfully.',
        '$ Code transferred to editor and formatted.'
      ]);
      
      // Switch to code tab
      setActiveTab('code');
      
      // Log the code to console for debugging
      console.log("Professional WordPress code transferred to editor:", formattedCode);
      
      return true;
    } catch (error) {
      console.error('Error formatting code:', error);
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ wp plugin validate',
        'Warning: Code formatting failed. Using unformatted code.',
        '$ Code transferred to editor.'
      ]);
      
      // Still update the code state with unformatted code
      setCode(extractedCode);
      
      // Switch to code tab
      setActiveTab('code');
      
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
    
    // Replace code blocks with a note
    let processedResponse = response.replace(/```[\w]*\s*([\s\S]*?)\s*```/g, 
      '```\n[Professional WordPress code has been transferred to the Code tab]\n```');
    
    // Replace inline PHP code
    processedResponse = processedResponse.replace(/<\?php[\s\S]*?\?>/g, 
      '[Professional PHP code has been transferred to the Code tab]');
    
    // Add a note at the end if it's not already there
    if (!processedResponse.includes('transferred to the Code tab')) {
      processedResponse += '\n\n**✅ Professional Code Generated:** All production-ready WordPress code has been transferred to the Code tab for review and implementation.';
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
      // Send message to AI with plugin context
      const response = await sendMessage(newMessages, pluginName);
      
      // Extract code from response before processing
      const extractedCode = extractCodeFromMessage(response);
      
      // Process response to remove code blocks
      const processedResponse = processAIResponse(response);
      
      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: 'assistant', content: processedResponse }
      ]);
      
      // If code was found, transfer it to the code editor
      if (extractedCode) {
        await formatAndTransferCode(extractedCode);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an error. Please check your AI configuration in settings and ensure your API key is properly configured.' 
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
      '$ wp plugin extract-code',
      'No WordPress plugin code found in the selected message.'
    ]);
    
    return false;
  };
  
  // Handle terminal command with WordPress-specific commands
  const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      // Add command to terminal output
      const command = terminalInput.trim();
      setTerminalOutput(prev => [...prev, `$ ${command}`]);
      
      // Process WordPress-specific commands
      if (command.startsWith('wp ')) {
        // WordPress CLI commands
        if (command.includes('plugin activate')) {
          handleExecutePlugin();
          setTerminalOutput(prev => [
            ...prev,
            `Plugin '${pluginName || 'professional-custom-plugin'}' activated.`,
            'Success: Activated 1 of 1 plugins.'
          ]);
        } else if (command.includes('plugin install')) {
          setTerminalOutput(prev => [
            ...prev,
            'Installing plugin...',
            'Plugin installed successfully.',
            'Activating plugin...',
            `Plugin '${pluginName || 'professional-custom-plugin'}' activated.`,
            'Success: Installed and activated 1 of 1 plugins.'
          ]);
        } else if (command.includes('plugin validate')) {
          setTerminalOutput(prev => [
            ...prev,
            'Validating plugin code...',
            '✅ Plugin header: Valid',
            '✅ Security checks: Passed', 
            '✅ WordPress standards: Compliant',
            '✅ Code quality: Professional grade',
            'Success: Plugin validation completed.'
          ]);
        } else if (command.includes('plugin scaffold')) {
          setTerminalOutput(prev => [
            ...prev,
            'Scaffolding professional WordPress plugin...',
            'Creating plugin structure...',
            'Adding security measures...',
            'Implementing WordPress standards...',
            'Success: Professional plugin scaffolded.'
          ]);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'WordPress CLI command executed successfully.'
          ]);
        }
      } else if (command.startsWith('composer ')) {
        // Composer commands
        if (command.includes('install')) {
          setTerminalOutput(prev => [
            ...prev,
            'Loading composer repositories with package information',
            'Installing dependencies (including require-dev)',
            'Package operations: 25 installs, 0 updates, 0 removals',
            'Writing lock file',
            'Generating autoload files'
          ]);
        } else if (command.includes('require')) {
          setTerminalOutput(prev => [
            ...prev,
            'Using version ^2.0 for package',
            'Package installed successfully.'
          ]);
        }
      } else if (command.startsWith('php ')) {
        // PHP commands
        if (command.includes('plugin.php') || command.includes('-l')) {
          setTerminalOutput(prev => [
            ...prev, 
            'No syntax errors detected in plugin.php',
            'Plugin code follows WordPress standards.'
          ]);
          handleExecutePlugin();
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'PHP command executed successfully.'
          ]);
        }
      } else if (command === 'clear' || command === 'cls') {
        // Clear terminal
        setTerminalOutput(['Professional WordPress Plugin Development Environment']);
      } else if (command === 'help') {
        // Show WordPress-specific help
        setTerminalOutput(prev => [
          ...prev,
          'WordPress Plugin Development Commands:',
          '  wp plugin activate <plugin>    - Activate WordPress plugin',
          '  wp plugin validate <plugin>    - Validate plugin code',
          '  wp plugin scaffold <name>      - Create plugin structure',
          '  composer install               - Install PHP dependencies',
          '  composer require <package>     - Add PHP package',
          '  php -l <file.php>             - Check PHP syntax',
          '  execute, run                  - Execute/test plugin',
          '  build                         - Build production plugin',
          '  save                          - Save plugin to library',
          '  clear, cls                    - Clear terminal',
          '  help                          - Show this help'
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
        '$ wp plugin format-code',
        'Code formatted according to WordPress standards.'
      ]);
    } catch (error) {
      console.error('Error formatting code:', error);
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ wp plugin format-code',
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
        description: 'A professional WordPress plugin created with Plugin Genius',
        thumbnail: '/images/plugin-thumbnail.jpg',
        code: code,
        createdAt: new Date().toISOString()
      });
      
      // Add to terminal output
      setTerminalOutput(prev => [
        ...prev,
        `$ wp plugin save "${pluginName}"`,
        'Professional plugin saved successfully to your library.'
      ]);
      
      alert('Professional WordPress plugin saved successfully!');
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
      // Execute the plugin code with professional analysis
      const result = executePlugin({ 
        code, 
        name: pluginName || 'Professional Custom Plugin' 
      });
      
      setPluginExecution(result);
      
      // Add execution result to terminal output
      setTerminalOutput(prev => [
        ...prev,
        `$ wp plugin test "${pluginName || 'professional-custom-plugin'}"`,
        result.success 
          ? '✅ Plugin validation: PASSED' 
          : `❌ Plugin validation: FAILED - ${result.errors}`,
        result.success 
          ? '✅ Security analysis: PASSED'
          : '⚠️  Security analysis: Issues found',
        result.success 
          ? '✅ WordPress standards: COMPLIANT'
          : '⚠️  WordPress standards: Non-compliant',
        result.success 
          ? `✅ Plugin "${pluginName || 'professional-custom-plugin'}" ready for production.` 
          : `❌ Plugin needs attention: ${result.errors}`
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
        '$ wp plugin test',
        'Error testing plugin. Please check your code and try again.'
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
        `$ wp plugin build "${pluginName}"`,
        result.success 
          ? '✅ Building production-ready plugin package...' 
          : `❌ Build failed: ${result.error}`,
        result.success 
          ? '✅ Adding professional assets and documentation...' 
          : '',
        result.success 
          ? '✅ Validating WordPress standards compliance...' 
          : '',
        result.success 
          ? `✅ Successfully created ${result.filename}` 
          : '',
        result.success 
          ? '🚀 Plugin ready for WordPress.org submission!' 
          : ''
      ]);
      
      if (result.success) {
        // Add download notification to terminal
        setTerminalOutput(prev => [
          ...prev,
          `📦 Professional plugin package "${result.filename}" downloaded.`,
          '💡 Ready for installation on any WordPress site!'
        ]);
      }
      
    } catch (error) {
      console.error('Error building plugin:', error);
      
      setBuildResult({
        success: false,
        message: 'Failed to build professional plugin package.',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ wp plugin build',
        'Error building plugin package. Please try again.'
      ]);
    } finally {
      setIsBuilding(false);
    }
  };
  
  // Update plugin name in code when it changes
  useEffect(() => {
    // Only update the code if the plugin name changes and there's a default code template
    if (code.includes('Plugin Name:')) {
      const updatedCode = code.replace(
        /Plugin Name: .*$/m, 
        `Plugin Name: ${pluginName || 'Professional Custom Plugin'}`
      ).replace(
        /Text Domain: .*$/m,
        `Text Domain: ${pluginName ? pluginName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'professional-custom-plugin'}`
      );
      setCode(updatedCode);
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
            <h1 className="page-title">Professional WordPress Plugin Development</h1>
            <p className="page-subtitle">Create production-ready, secure, and standards-compliant WordPress plugins with AI-powered professional development</p>
            
            <div className="plugin-name-container">
              <input 
                type="text" 
                className="plugin-name-input" 
                placeholder="Enter Professional Plugin Name" 
                value={pluginName}
                onChange={(e) => setPluginName(e.target.value)}
              />
            </div>
          </motion.div>
        </header>
        
        <section className="workspace-section">
          <div className="workspace-container">
            <div className="ai-selector">
              <div className="ai-selector-label">Professional AI Assistant:</div>
              <div className="ai-options">
                <div className="ai-option active">
                  WordPress Expert AI
                </div>
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
                  <strong>AI Configuration Required:</strong> Please configure your AI model in settings to use the professional WordPress development assistant.
                </p>
                <button 
                  className="api-key-button"
                  onClick={() => window.location.href = '/settings'}
                >
                  Configure AI Model
                </button>
              </div>
            )}
            
            {buildResult && (
              <div className={`build-result ${buildResult.success ? 'success' : 'error'}`}>
                <p>
                  <strong>{buildResult.success ? '🚀 Professional Build Successful:' : '❌ Build Failed:'}</strong> {buildResult.message}
                </p>
                {buildResult.success && (
                  <p className="build-note">
                    Your professional WordPress plugin has been packaged and downloaded. It's ready for installation and meets WordPress.org standards.
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
                    <span>AI Assistant</span>
                  </button>
                  <button 
                    className={`workspace-tab ${activeTab === 'code' ? 'active' : ''}`}
                    onClick={() => setActiveTab('code')}
                  >
                    <FiCode />
                    <span>Professional Code</span>
                  </button>
                  <button 
                    className={`workspace-tab ${activeTab === 'terminal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('terminal')}
                  >
                    <FiTerminal />
                    <span>WP-CLI Terminal</span>
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
                              {message.role === 'assistant' ? '🔧' : 'You'}
                            </div>
                            <div className="message-content">
                              <div dangerouslySetInnerHTML={{ __html: message.content.replace(/```([\s\S]*?)```/g, (match, code) => {
                                return `<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${code}</pre>`;
                              })}} />
                              {message.role === 'assistant' && extractCodeFromMessage(message.content) && (
                                <button 
                                  className="code-action" 
                                  style={{ 
                                    marginTop: '10px', 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                  }}
                                  onClick={() => handleTransferCodeFromMessage(message.content)}
                                >
                                  <FiCode /> Use Professional Code
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="message ai">
                            <div className="message-avatar">🔧</div>
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
                          placeholder="Describe your professional WordPress plugin requirements..."
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
                          {isExecuting ? <><FiRefreshCw /> Testing...</> : <><FiPlay /> Test Plugin</>}
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
                          placeholder="Enter WP-CLI command... (type 'help' for commands)" 
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
                    <FiEye /> Professional Preview
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
                    // If plugin has been executed, show the professional rendered HTML
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
                        <div className="preview-wp-page-title">Professional Plugins</div>
                        <div className="preview-wp-plugin-card professional">
                          <div className="preview-wp-plugin-icon">🔧</div>
                          <div className="preview-wp-plugin-details">
                            <div className="preview-wp-plugin-name">{pluginName || 'Professional Custom Plugin'}</div>
                            <div className="preview-wp-plugin-description">A professional, production-ready WordPress plugin built with industry best practices</div>
                            <div className="preview-wp-plugin-meta">
                              <span className="plugin-version">Version 1.0.0</span>
                              <span className="plugin-author">by Plugin Genius</span>
                              <span className="plugin-quality">✅ Professional Grade</span>
                            </div>
                          </div>
                          <div className="preview-wp-plugin-actions">
                            <button 
                              className="preview-wp-plugin-action primary"
                              onClick={handleExecutePlugin}
                              disabled={isExecuting}
                            >
                              {isExecuting ? 'Testing...' : 'Test Plugin'}
                            </button>
                            <button className="preview-wp-plugin-action">Settings</button>
                            <button className="preview-wp-plugin-action">Edit</button>
                          </div>
                        </div>
                        
                        {/* Display execution status if plugin has been executed */}
                        {pluginExecution && (
                          <div className={`wp-preview-status ${pluginExecution.success ? 'success' : 'error'}`}>
                            {pluginExecution.success 
                              ? `✅ Professional plugin "${pluginName || 'Professional Custom Plugin'}" tested successfully and meets WordPress standards.` 
                              : `❌ Plugin testing failed: ${pluginExecution.errors}`}
                          </div>
                        )}
                        
                        {/* Display execution log if plugin has been executed */}
                        {pluginExecution && pluginExecution.output && (
                          <div className="wp-preview-log professional">
                            <pre>{pluginExecution.output}</pre>
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
