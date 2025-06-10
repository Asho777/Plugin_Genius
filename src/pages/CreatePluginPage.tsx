import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiTerminal, FiEye, FiMessageSquare, FiSave, FiDownload, FiSettings, FiCopy, FiCheck } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { AI_MODELS, Message, sendMessage, getApiKey } from '../services/aiService'
import { savePlugin } from '../services/pluginService'
import '../styles/create-plugin.css'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
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
  
  // Update code when plugin name changes
  useEffect(() => {
    setCode(`<?php
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
add_action('init', 'register_custom_block');`);
  }, [pluginName]);
  
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
          setCode(codeMatch[1]);
          if (activeTab !== 'code') {
            setActiveTab('code');
          }
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
      setTerminalOutput([...terminalOutput, `$ ${terminalInput}`, `Command executed: ${terminalInput}`]);
      setTerminalInput('');
    }
  };
  
  // Handle copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle save plugin
  const handleSavePlugin = () => {
    if (!pluginName) {
      alert('Please enter a plugin name before saving.');
      return;
    }
    
    savePlugin({
      id: Date.now().toString(),
      name: pluginName,
      description: 'A custom WordPress plugin created with Plugin Genius',
      thumbnail: '/images/plugin-thumbnail.jpg',
      code: code,
      createdAt: new Date().toISOString()
    });
    
    alert('Plugin saved successfully!');
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
                <button className="action-button">
                  <FiDownload />
                  <span>Export</span>
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
                        <button className="code-action">Format</button>
                        <button className="code-action" onClick={handleSavePlugin}>Save</button>
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
                    <button className="preview-control">Desktop</button>
                    <button className="preview-control">Tablet</button>
                    <button className="preview-control">Mobile</button>
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-wordpress">
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
                          <button className="preview-wp-plugin-action">Activate</button>
                          <button className="preview-wp-plugin-action">Edit</button>
                          <button className="preview-wp-plugin-action">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
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
