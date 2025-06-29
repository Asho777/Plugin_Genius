import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiTerminal, FiEye, FiMessageSquare, FiSave, FiDownload, FiSettings, FiCopy, FiCheck, FiPlay, FiRefreshCw, FiPackage, FiLoader } from 'react-icons/fi'
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
  
  const [activeAI, setActiveAI] = useState('xbesh')
  const [pluginName, setPluginName] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: AI_MODELS.find(model => model.id === 'xbesh')?.systemPrompt || ''
    },
    {
      role: 'assistant',
      content: 'Hello! I\'m your xBesh AI assistant. I\'ll help you create a WordPress plugin. What kind of functionality would you like to build? For example:\n\n• A contact form plugin\n• A custom post type for portfolios\n• An e-commerce integration\n• A social media widget\n• A custom dashboard widget\n\nJust describe what you want, and I\'ll generate the complete WordPress plugin code for you!'
    }
  ])
  const [userMessage, setUserMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'WordPress Plugin Development Environment',
    'Plugin Genius Terminal v1.0.0',
    '=====================================',
    '',
    'Welcome to the WordPress Plugin Creator!',
    'Type "help" for available commands.',
    '',
    '$ _'
  ])
  const [code, setCode] = useState(`<?php
/**
 * Plugin Name: ${pluginName || 'My Custom Plugin'}
 * Description: A custom WordPress plugin created with Plugin Genius
 * Version: 1.0.0
 * Author: Plugin Genius
 * Text Domain: my-custom-plugin
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Plugin activation hook
register_activation_hook(__FILE__, 'my_custom_plugin_activate');

function my_custom_plugin_activate() {
    // Activation code here
    flush_rewrite_rules();
}

// Plugin deactivation hook
register_deactivation_hook(__FILE__, 'my_custom_plugin_deactivate');

function my_custom_plugin_deactivate() {
    // Deactivation code here
    flush_rewrite_rules();
}

// Initialize the plugin
add_action('init', 'my_custom_plugin_init');

function my_custom_plugin_init() {
    // Plugin initialization code here
    
    // Example: Add a simple shortcode
    add_shortcode('my_custom_shortcode', 'my_custom_shortcode_handler');
}

// Shortcode handler function
function my_custom_shortcode_handler($atts) {
    $atts = shortcode_atts(array(
        'text' => 'Hello World!',
    ), $atts);
    
    return '<div class="my-custom-plugin-output">' . esc_html($atts['text']) . '</div>';
}

// Add admin menu
add_action('admin_menu', 'my_custom_plugin_admin_menu');

function my_custom_plugin_admin_menu() {
    add_options_page(
        'My Custom Plugin Settings',
        'My Custom Plugin',
        'manage_options',
        'my-custom-plugin',
        'my_custom_plugin_settings_page'
    );
}

// Settings page callback
function my_custom_plugin_settings_page() {
    ?>
    <div class="wrap">
        <h1>My Custom Plugin Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('my_custom_plugin_settings');
            do_settings_sections('my_custom_plugin_settings');
            ?>
            <table class="form-table">
                <tr>
                    <th scope="row">Plugin Setting</th>
                    <td>
                        <input type="text" name="my_custom_plugin_setting" value="<?php echo esc_attr(get_option('my_custom_plugin_setting')); ?>" />
                        <p class="description">Enter your plugin setting here.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Register settings
add_action('admin_init', 'my_custom_plugin_admin_init');

function my_custom_plugin_admin_init() {
    register_setting('my_custom_plugin_settings', 'my_custom_plugin_setting');
}`)
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
        '$ extract-code --from-ai-chat',
        'Code extracted from AI response.',
        'Formatting code...',
        'Code formatted and transferred to Code editor.',
        'Ready for testing and deployment.',
        ''
      ]);
      
      // Switch to code tab
      setActiveTab('code');
      
      // Auto-execute the plugin to show preview
      setTimeout(() => {
        handleExecutePlugin();
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error formatting code:', error);
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ extract-code --from-ai-chat',
        'Error formatting code. Using unformatted code instead.',
        'Code transferred to Code editor.',
        ''
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
      '```\n[Code has been automatically transferred to the Code tab]\n```');
    
    // Replace inline PHP code
    processedResponse = processedResponse.replace(/<\?php[\s\S]*?\?>/g, 
      '[PHP code has been transferred to the Code tab]');
    
    // Add a note at the end if it's not already there
    if (!processedResponse.includes('transferred to the Code tab')) {
      processedResponse += '\n\n**✅ Code Transfer Complete:** All generated code has been automatically transferred to the Code tab and is ready for testing!';
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
      '$ transfer-code --from-message',
      'No code found in the selected message.',
      ''
    ]);
    
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
          'Checking syntax...',
          'PHP code executed successfully.',
          ''
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
            `Activating plugin '${pluginName || 'my-custom-plugin'}'...`,
            'Plugin activated successfully.',
            'Success: Activated 1 of 1 plugins.',
            ''
          ]);
        } else if (command.includes('plugin install')) {
          setTerminalOutput(prev => [
            ...prev,
            'Installing plugin...',
            'Plugin installed successfully.',
            'Activating plugin...',
            `Plugin '${pluginName || 'my-custom-plugin'}' activated.`,
            'Success: Installed and activated 1 of 1 plugins.',
            ''
          ]);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'WordPress CLI command executed successfully.',
            ''
          ]);
        }
      } else if (command.startsWith('npm ') || command.startsWith('yarn ')) {
        // Simulate package manager
        if (command.includes('install') || command.includes('add')) {
          setTerminalOutput(prev => [
            ...prev,
            'Installing packages...',
            'Resolving dependencies...',
            'added 120 packages in 3.5s',
            'Packages installed successfully.',
            ''
          ]);
        } else if (command.includes('build')) {
          setTerminalOutput(prev => [
            ...prev,
            'Building project...',
            'Creating an optimized production build...',
            'Compiled successfully.',
            'Build complete.',
            ''
          ]);
          handleBuildPlugin();
        } else if (command.includes('start') || command.includes('dev')) {
          setTerminalOutput(prev => [
            ...prev,
            'Starting development server...',
            'Server running at http://localhost:3000',
            'Ready for development.',
            ''
          ]);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'npm command executed successfully.',
            ''
          ]);
        }
      } else if (command.startsWith('zip ')) {
        // Simulate zip creation
        handleBuildPlugin();
      } else if (command === 'clear' || command === 'cls') {
        // Clear terminal
        setTerminalOutput(['Terminal cleared.', '']);
      } else if (command === 'extract-code' || command === 'get-code') {
        // Extract code from the last AI message
        const lastAiMessage = [...messages].reverse().find(m => m.role === 'assistant');
        if (lastAiMessage) {
          handleTransferCodeFromMessage(lastAiMessage.content);
        } else {
          setTerminalOutput(prev => [
            ...prev,
            'No AI messages found to extract code from.',
            ''
          ]);
        }
      } else if (command === 'show-code') {
        // Log current code to terminal
        setTerminalOutput(prev => [
          ...prev,
          'Current code in editor:',
          '---',
          code,
          '---',
          ''
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
          '',
          'WordPress Commands:',
          '  wp plugin activate     - Activate WordPress plugin',
          '  wp plugin install      - Install WordPress plugin',
          '',
          'Development Commands:',
          '  php <file.php>         - Execute PHP code',
          '  npm install <package>  - Install npm package',
          '  npm build              - Build project',
          '  npm start              - Start development server',
          '',
          'Plugin Commands:',
          '  execute, run           - Execute/test plugin',
          '  build                  - Build plugin for distribution',
          '  save                   - Save plugin to library',
          '',
          'Code Commands:',
          '  extract-code, get-code - Extract code from AI message',
          '  show-code              - Show current code',
          '',
          'Utility Commands:',
          '  clear, cls             - Clear terminal',
          '  ls, dir                - List files',
          '  help                   - Show this help',
          ''
        ]);
      } else if (command === 'ls' || command === 'dir') {
        // List files
        setTerminalOutput(prev => [
          ...prev,
          'Directory listing:',
          '',
          `${pluginName || 'my-custom-plugin'}/`,
          `├── ${pluginName || 'my-custom-plugin'}.php`,
          '├── assets/',
          '│   ├── css/',
          '│   │   └── style.css',
          '│   └── js/',
          '│       └── script.js',
          '├── includes/',
          '│   └── functions.php',
          '├── languages/',
          '│   └── my-custom-plugin.pot',
          '└── readme.txt',
          ''
        ]);
      } else if (command === 'cat' && command.includes('.php')) {
        // Show file content
        setTerminalOutput(prev => [
          ...prev,
          'File content:',
          '---',
          code,
          '---',
          ''
        ]);
      } else if (command === 'status') {
        // Show plugin status
        setTerminalOutput(prev => [
          ...prev,
          'Plugin Status:',
          `Name: ${pluginName || 'My Custom Plugin'}`,
          `Status: ${pluginExecution?.success ? 'Active' : 'Inactive'}`,
          `Code Lines: ${code.split('\n').length}`,
          `Last Modified: ${new Date().toLocaleString()}`,
          ''
        ]);
      } else {
        // Generic response
        setTerminalOutput(prev => [
          ...prev,
          `Command executed: ${command}`,
          'Type "help" for available commands.',
          ''
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
    
    // Add to terminal output
    setTerminalOutput(prev => [
      ...prev,
      '$ copy-code',
      'Code copied to clipboard.',
      ''
    ]);
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
        '$ format-code',
        'Code formatted successfully.',
        ''
      ]);
    } catch (error) {
      console.error('Error formatting code:', error);
      
      // Add error to terminal output
      setTerminalOutput(prev => [
        ...prev,
        '$ format-code',
        'Error formatting code. Please try again.',
        ''
      ]);
    } finally {
      setFormatting(false);
    }
  };
  
  // Handle save plugin
  const handleSavePlugin = () => {
    if (!pluginName) {
      setTerminalOutput(prev => [
        ...prev,
        '$ save-plugin',
        'Error: Please enter a plugin name before saving.',
        ''
      ]);
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
        `$ save-plugin "${pluginName}"`,
        'Plugin saved successfully to your library.',
        'You can find it in the "My Plugins" section.',
        ''
      ]);
      
    } catch (error) {
      console.error('Error saving plugin:', error);
      setTerminalOutput(prev => [
        ...prev,
        '$ save-plugin',
        'Error saving plugin. Please try again.',
        ''
      ]);
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
        `$ execute-plugin "${pluginName || 'my-custom-plugin'}"`,
        'Analyzing plugin code...',
        'Checking WordPress compatibility...',
        result.success 
          ? '✅ Plugin executed successfully!' 
          : `❌ Plugin execution failed: ${result.errors}`,
        result.success 
          ? 'Plugin is ready for activation.' 
          : 'Please fix the errors and try again.',
        ''
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
        '$ execute-plugin',
        'Error executing plugin. Please check your code and try again.',
        ''
      ]);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Handle build plugin
  const handleBuildPlugin = async () => {
    if (!code.trim() || isBuilding) return;
    
    if (!pluginName) {
      setTerminalOutput(prev => [
        ...prev,
        '$ build-plugin',
        'Error: Please enter a plugin name before building.',
        ''
      ]);
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
        `$ build-plugin "${pluginName}"`,
        'Creating plugin structure...',
        'Generating assets...',
        'Creating readme.txt...',
        'Compressing files...',
        result.success 
          ? `✅ Plugin built successfully: ${result.filename}` 
          : `❌ Build failed: ${result.error}`,
        result.success 
          ? 'Plugin zip file has been downloaded.' 
          : 'Please fix the errors and try again.',
        ''
      ]);
      
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
        '$ build-plugin',
        'Error building plugin. Please try again.',
        ''
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
            <p className="page-subtitle">Use xBesh AI to build powerful WordPress plugins without writing a single line of code</p>
            
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
                {AI_MODELS.filter(ai => ai.id === 'xbesh').map(ai => (
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
                  <strong>API Key Required:</strong> Please add your xBesh AI API key in settings to use this model.
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
                                  <FiCode /> Use this code
                                </button>
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
                          placeholder="Describe the WordPress plugin you want to create..."
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
                    <FiEye /> Live Preview
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
                              ? `✅ Plugin "${pluginName || 'My Custom Plugin'}" activated successfully!` 
                              : `❌ Error: ${pluginExecution.errors}`}
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