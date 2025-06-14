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

const CreatePluginPage = () => {
  const [activeAI, setActiveAI] = useState('gpt-4')
  const [pluginName, setPluginName] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: AI_MODELS.find(model => model.id === 'gpt-4')?.systemPrompt || ''
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
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [pluginExecution, setPluginExecution] = useState<PluginExecutionResult | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildResult, setBuildResult] = useState<PluginBuildResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Generate more terminal output for scrolling demo
  useEffect(() => {
    const moreOutput = [...terminalOutput];
    for (let i = 0; i < 20; i++) {
      moreOutput.push(`$ echo "Line ${i + 1} - This is sample terminal output to demonstrate scrolling"`);
      moreOutput.push(`Line ${i + 1} - This is sample terminal output to demonstrate scrolling`);
    }
    setTerminalOutput(moreOutput);
  }, []);
  
  // Generate more code for scrolling demo
  useEffect(() => {
    let demoCode = `<?php
/**
 * Plugin Name: ${pluginName || 'My Custom Plugin'}
 * Description: A custom WordPress plugin created with Plugin Genius
 * Version: 1.0.0
 * Author: Plugin Genius
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Register block
function register_custom_block() {
    // Register script
    wp_register_script(
        'custom-block-editor',
        plugins_url('block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor')
    );

    // Register block
    register_block_type('custom/block', array(
        'editor_script' => 'custom-block-editor',
    ));
}
add_action('init', 'register_custom_block');`;

    // Add more code to demonstrate scrolling
    for (let i = 0; i < 20; i++) {
      demoCode += `\n\n// Function ${i + 1}
function custom_function_${i + 1}() {
    // This is a sample function to demonstrate scrolling
    $value = "Sample value ${i + 1}";
    return $value;
}`;
    }
    
    setCode(demoCode);
  }, [pluginName]);
  
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
      
      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: 'assistant', content: response }
      ]);
      
      // Update code if response contains PHP code
      if (response.includes('<?php') && response.includes('?>')) {
        const codeMatch = response.match(/```php\s*([\s\S]*?)\s*```/) || 
                         response.match(/```\s*(<?php[\s\S]*?)\s*```/) ||
                         response.match(/<\?php[\s\S]*?\?>/);
        
        if (codeMatch && codeMatch[1]) {
          const extractedCode = codeMatch[1].replace(/^<\?php/, '<?php');
          setCode(extractedCode);
          
          // Add to terminal output
          setTerminalOutput(prev => [
            ...prev,
            '$ Extracted PHP code from AI response',
            'Code extracted successfully and placed in editor.'
          ]);
          
          // Switch to code tab
          setActiveTab('code');
        }
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
        setTerminalOutput(prev => [
          ...prev,
          'WordPress CLI command executed successfully.'
        ]);
      } else if (command.startsWith('npm ') || command.startsWith('yarn ')) {
        // Simulate package manager
        setTerminalOutput(prev => [
          ...prev,
          'Installing packages...',
          'Packages installed successfully.'
        ]);
      } else if (command.startsWith('zip ')) {
        // Simulate zip creation
        handleBuildPlugin();
      } else if (command === 'clear' || command === 'cls') {
        // Clear terminal
        setTerminalOutput(['Terminal cleared.']);
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
  
  return (
    <div className="create-plugin-page">
      <Navbar />
      
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
              <div className="ai-options">
                {AI_MODELS.map(ai => (
                  <button 
                    key={ai.id}
                    className={`ai-option ${activeAI === ai.id ? 'active' : ''}`}
                    onClick={() => setActiveAI(ai.id)}
                  >
                    {ai.name}
                  </button>
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
                              <p>{message.content}</p>
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
                        <pre className="code-content">
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
                          placeholder="Enter command..." 
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
                        
                        {/* Add more plugin cards to demonstrate scrolling */}
                        {Array.from({ length: 10 }).map((_, index) => (
                          <div className="preview-wp-plugin-card" key={index}>
                            <div className="preview-wp-plugin-name">Sample Plugin {index + 1}</div>
                            <div className="preview-wp-plugin-description">This is a sample plugin to demonstrate scrolling in the preview panel</div>
                            <div className="preview-wp-plugin-actions">
                              <button className="preview-wp-plugin-action">Activate</button>
                              <button className="preview-wp-plugin-action">Edit</button>
                              <button className="preview-wp-plugin-action">Delete</button>
                            </div>
                          </div>
                        ))}
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
