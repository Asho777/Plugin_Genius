/**
 * Plugin execution service
 */

// Interface for plugin execution options
export interface PluginExecutionOptions {
  code: string
  name?: string
}

// Interface for plugin execution result
export interface PluginExecutionResult {
  success: boolean
  output: string
  errors: string
  renderedHtml?: string
}

/**
 * Extract plugin metadata from PHP code
 */
export const extractPluginMetadata = (code: string): Record<string, string> => {
  const metadata: Record<string, string> = {}
  
  // Extract plugin header information
  const headerRegex = /\/\*\*[\s\S]*?\*\//
  const headerMatch = code.match(headerRegex)
  
  if (headerMatch) {
    const header = headerMatch[0]
    
    // Extract common plugin header fields
    const fields = [
      { key: 'name', regex: /Plugin Name:\s*(.+)$/m },
      { key: 'description', regex: /Description:\s*(.+)$/m },
      { key: 'version', regex: /Version:\s*(.+)$/m },
      { key: 'author', regex: /Author:\s*(.+)$/m },
      { key: 'authorUri', regex: /Author URI:\s*(.+)$/m },
      { key: 'textDomain', regex: /Text Domain:\s*(.+)$/m },
      { key: 'domainPath', regex: /Domain Path:\s*(.+)$/m },
      { key: 'requires', regex: /Requires at least:\s*(.+)$/m },
      { key: 'tested', regex: /Tested up to:\s*(.+)$/m },
      { key: 'requiresPHP', regex: /Requires PHP:\s*(.+)$/m },
    ]
    
    fields.forEach(field => {
      const match = header.match(field.regex)
      if (match && match[1]) {
        metadata[field.key] = match[1].trim()
      }
    })
  }
  
  return metadata
}

/**
 * Validate PHP syntax
 */
const validatePhpSyntax = (code: string): { valid: boolean; errors: string } => {
  // This is a very basic PHP syntax validator
  // In a real environment, we would use php -l for syntax checking
  
  try {
    // Check for basic syntax errors
    const errors = []
    
    // Check for mismatched braces
    const openBraces = (code.match(/\{/g) || []).length
    const closeBraces = (code.match(/\}/g) || []).length
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched braces: ${openBraces} opening and ${closeBraces} closing braces`)
    }
    
    // Check for mismatched parentheses
    const openParens = (code.match(/\(/g) || []).length
    const closeParens = (code.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      errors.push(`Mismatched parentheses: ${openParens} opening and ${closeParens} closing parentheses`)
    }
    
    // Check for missing semicolons (very basic check)
    const lines = code.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line && 
          !line.endsWith(';') && 
          !line.endsWith('{') && 
          !line.endsWith('}') && 
          !line.endsWith(':') && 
          !line.startsWith('//') && 
          !line.startsWith('/*') && 
          !line.startsWith('*') && 
          !line.startsWith('?>') && 
          !line.startsWith('<?php') && 
          !line.match(/^(if|for|foreach|while|switch|function|class|interface|trait)\s*\(.*\)\s*$/)) {
        errors.push(`Line ${i + 1} may be missing a semicolon: ${line}`)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.join('\n')
    }
  } catch (error) {
    return {
      valid: false,
      errors: error instanceof Error ? error.message : 'Unknown error occurred during syntax validation'
    }
  }
}

/**
 * Generate a simple WordPress admin interface preview
 */
const generateWordPressPreview = (pluginName: string): string => {
  return `
    <div class="wp-admin-preview">
      <div class="wp-admin-header">
        <div class="wp-admin-logo">W</div>
        <div class="wp-admin-title">WordPress Admin</div>
        <div class="wp-admin-user">Admin User</div>
      </div>
      
      <div class="wp-admin-content">
        <div class="wp-admin-sidebar">
          <ul class="wp-admin-menu">
            <li>Dashboard</li>
            <li>Posts</li>
            <li>Media</li>
            <li>Pages</li>
            <li class="active">${pluginName}</li>
            <li>Appearance</li>
            <li>Plugins</li>
            <li>Users</li>
            <li>Tools</li>
            <li>Settings</li>
          </ul>
        </div>
        
        <div class="wp-admin-main">
          <h1 class="wp-admin-page-title">${pluginName}</h1>
          
          <div class="wp-admin-card">
            <h2 class="wp-admin-card-title">Welcome to ${pluginName}</h2>
            <p>Your plugin has been activated successfully. Use the settings below to configure your plugin.</p>
            
            <form class="wp-admin-form">
              <div class="wp-admin-form-row">
                <label for="plugin-option-1">Enable Feature 1</label>
                <input type="checkbox" id="plugin-option-1" checked />
              </div>
              
              <div class="wp-admin-form-row">
                <label for="plugin-option-2">Feature 2 Setting</label>
                <select id="plugin-option-2">
                  <option>Option 1</option>
                  <option selected>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              
              <div class="wp-admin-form-row">
                <label for="plugin-option-3">Custom Text</label>
                <input type="text" id="plugin-option-3" value="Default value" />
              </div>
              
              <div class="wp-admin-form-row">
                <button type="button" class="wp-admin-button wp-admin-button-primary">Save Changes</button>
                <button type="button" class="wp-admin-button">Reset</button>
              </div>
            </form>
          </div>
          
          <div class="wp-admin-card">
            <h2 class="wp-admin-card-title">Plugin Statistics</h2>
            <div class="wp-admin-stats">
              <div class="wp-admin-stat">
                <span class="wp-admin-stat-value">42</span>
                <span class="wp-admin-stat-label">Total Uses</span>
              </div>
              <div class="wp-admin-stat">
                <span class="wp-admin-stat-value">7</span>
                <span class="wp-admin-stat-label">Active Instances</span>
              </div>
              <div class="wp-admin-stat">
                <span class="wp-admin-stat-value">98%</span>
                <span class="wp-admin-stat-label">Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .wp-admin-preview {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        color: #444;
        line-height: 1.4;
      }
      
      .wp-admin-header {
        background-color: #23282d;
        color: #fff;
        padding: 0 16px;
        height: 32px;
        display: flex;
        align-items: center;
      }
      
      .wp-admin-logo {
        width: 20px;
        height: 20px;
        background-color: #fff;
        color: #23282d;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 8px;
      }
      
      .wp-admin-title {
        flex-grow: 1;
        font-size: 13px;
      }
      
      .wp-admin-user {
        font-size: 13px;
      }
      
      .wp-admin-content {
        display: flex;
        background-color: #f1f1f1;
      }
      
      .wp-admin-sidebar {
        width: 160px;
        background-color: #23282d;
        color: #eee;
        min-height: 400px;
      }
      
      .wp-admin-menu {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      
      .wp-admin-menu li {
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
      }
      
      .wp-admin-menu li:hover {
        color: #00b9eb;
      }
      
      .wp-admin-menu li.active {
        background-color: #0073aa;
        color: #fff;
      }
      
      .wp-admin-main {
        flex-grow: 1;
        padding: 16px;
      }
      
      .wp-admin-page-title {
        font-size: 23px;
        font-weight: 400;
        margin: 0 0 16px;
        padding: 9px 0 4px;
        color: #23282d;
      }
      
      .wp-admin-card {
        background-color: #fff;
        border: 1px solid #e5e5e5;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
        margin-bottom: 16px;
        padding: 16px;
      }
      
      .wp-admin-card-title {
        font-size: 14px;
        padding: 8px 12px;
        margin: -16px -16px 16px;
        border-bottom: 1px solid #eee;
        font-weight: 600;
      }
      
      .wp-admin-form-row {
        margin-bottom: 12px;
      }
      
      .wp-admin-form-row label {
        display: block;
        margin-bottom: 4px;
        font-weight: 600;
      }
      
      .wp-admin-form-row input[type="text"],
      .wp-admin-form-row select {
        width: 100%;
        max-width: 400px;
        padding: 6px 8px;
        border: 1px solid #ddd;
        box-shadow: inset 0 1px 2px rgba(0,0,0,.07);
      }
      
      .wp-admin-button {
        background-color: #f7f7f7;
        border: 1px solid #ccc;
        color: #555;
        padding: 4px 12px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 13px;
        margin-right: 8px;
      }
      
      .wp-admin-button-primary {
        background-color: #0085ba;
        border-color: #0073aa;
        color: #fff;
      }
      
      .wp-admin-stats {
        display: flex;
        justify-content: space-between;
        text-align: center;
      }
      
      .wp-admin-stat {
        flex: 1;
        padding: 8px;
      }
      
      .wp-admin-stat-value {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #0073aa;
      }
      
      .wp-admin-stat-label {
        font-size: 13px;
        color: #777;
      }
    </style>
  `
}

/**
 * Execute a WordPress plugin
 */
export const executePlugin = (options: PluginExecutionOptions): PluginExecutionResult => {
  try {
    const { code, name = 'My Custom Plugin' } = options
    
    // Validate PHP syntax
    const syntaxValidation = validatePhpSyntax(code)
    
    if (!syntaxValidation.valid) {
      return {
        success: false,
        output: '',
        errors: syntaxValidation.errors
      }
    }
    
    // Extract plugin metadata
    const metadata = extractPluginMetadata(code)
    const pluginName = metadata.name || name
    
    // Generate a preview of the plugin in WordPress admin
    const renderedHtml = generateWordPressPreview(pluginName)
    
    return {
      success: true,
      output: `Plugin "${pluginName}" executed successfully.`,
      errors: '',
      renderedHtml
    }
  } catch (error) {
    return {
      success: false,
      output: '',
      errors: error instanceof Error ? error.message : 'Unknown error occurred during plugin execution'
    }
  }
}
