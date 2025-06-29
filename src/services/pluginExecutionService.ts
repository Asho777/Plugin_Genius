import { Plugin } from '../pages/TemplatesPage'

// Interface for plugin execution result
export interface PluginExecutionResult {
  success: boolean
  output: string
  errors?: string
  renderedHtml?: string
  warnings?: string[]
  hooks?: {
    actions: Array<{ hook: string, callback: string }>
    filters: Array<{ hook: string, callback: string }>
  }
  features?: {
    shortcodes: Array<{ tag: string, callback: string }>
    customPostTypes: string[]
    customTaxonomies: string[]
    adminPages: string[]
    blocks: string[]
    widgets: string[]
    restEndpoints: string[]
  }
}

// Function to parse PHP code and extract plugin metadata
export const extractPluginMetadata = (phpCode: string): Record<string, string> => {
  const metadata: Record<string, string> = {}
  
  // Extract plugin header information
  const headerRegex = /\/\*\*[\s\S]*?\*\//
  const headerMatch = phpCode.match(headerRegex)
  
  if (headerMatch) {
    const header = headerMatch[0]
    
    // Extract common plugin header fields
    const fields = [
      { name: 'name', regex: /Plugin Name:\s*(.+)$/m },
      { name: 'description', regex: /Description:\s*(.+)$/m },
      { name: 'version', regex: /Version:\s*(.+)$/m },
      { name: 'author', regex: /Author:\s*(.+)$/m },
      { name: 'authorUri', regex: /Author URI:\s*(.+)$/m },
      { name: 'textDomain', regex: /Text Domain:\s*(.+)$/m },
      { name: 'domainPath', regex: /Domain Path:\s*(.+)$/m },
      { name: 'requires', regex: /Requires at least:\s*(.+)$/m },
      { name: 'tested', regex: /Tested up to:\s*(.+)$/m },
      { name: 'requiresPHP', regex: /Requires PHP:\s*(.+)$/m },
    ]
    
    fields.forEach(field => {
      const match = header.match(field.regex)
      if (match && match[1]) {
        metadata[field.name] = match[1].trim()
      }
    })
  }
  
  return metadata
}

// Function to analyze plugin code and identify hooks, shortcodes, and other WordPress features
export const analyzePluginCode = (phpCode: string): Record<string, any> => {
  const analysis: Record<string, any> = {
    hooks: {
      actions: [],
      filters: []
    },
    shortcodes: [],
    widgets: [],
    blocks: [],
    adminPages: [],
    customPostTypes: [],
    customTaxonomies: [],
    restEndpoints: [],
    enqueueScripts: [],
    enqueueStyles: [],
    ajaxActions: [],
    capabilities: [],
    options: [],
    dbTables: []
  }
  
  // Extract action hooks
  const actionRegex = /add_action\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]?([^,'"]+)['"]?/g
  let actionMatch
  while ((actionMatch = actionRegex.exec(phpCode)) !== null) {
    analysis.hooks.actions.push({
      hook: actionMatch[1],
      callback: actionMatch[2]
    })
  }
  
  // Extract filter hooks
  const filterRegex = /add_filter\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]?([^,'"]+)['"]?/g
  let filterMatch
  while ((filterMatch = filterRegex.exec(phpCode)) !== null) {
    analysis.hooks.filters.push({
      hook: filterMatch[1],
      callback: filterMatch[2]
    })
  }
  
  // Extract shortcodes
  const shortcodeRegex = /add_shortcode\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]?([^,'"]+)['"]?/g
  let shortcodeMatch
  while ((shortcodeMatch = shortcodeRegex.exec(phpCode)) !== null) {
    analysis.shortcodes.push({
      tag: shortcodeMatch[1],
      callback: shortcodeMatch[2]
    })
  }
  
  // Extract custom post types
  const cptRegex = /register_post_type\s*\(\s*['"]([^'"]+)['"]/g
  let cptMatch
  while ((cptMatch = cptRegex.exec(phpCode)) !== null) {
    analysis.customPostTypes.push(cptMatch[1])
  }
  
  // Extract custom taxonomies
  const taxRegex = /register_taxonomy\s*\(\s*['"]([^'"]+)['"]/g
  let taxMatch
  while ((taxMatch = taxRegex.exec(phpCode)) !== null) {
    analysis.customTaxonomies.push(taxMatch[1])
  }
  
  // Extract admin pages
  const adminPageRegex = /add_menu_page\s*\(\s*['"]([^'"]+)['"]/g
  let adminPageMatch
  while ((adminPageMatch = adminPageRegex.exec(phpCode)) !== null) {
    analysis.adminPages.push(adminPageMatch[1])
  }
  
  // Extract submenu pages
  const subMenuRegex = /add_submenu_page\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g
  let subMenuMatch
  while ((subMenuMatch = subMenuRegex.exec(phpCode)) !== null) {
    analysis.adminPages.push(subMenuMatch[2])
  }
  
  // Extract blocks
  const blockRegex = /register_block_type\s*\(\s*['"]([^'"]+)['"]/g
  let blockMatch
  while ((blockMatch = blockRegex.exec(phpCode)) !== null) {
    analysis.blocks.push(blockMatch[1])
  }
  
  // Extract enqueued scripts
  const scriptRegex = /wp_enqueue_script\s*\(\s*['"]([^'"]+)['"]/g
  let scriptMatch
  while ((scriptMatch = scriptRegex.exec(phpCode)) !== null) {
    analysis.enqueueScripts.push(scriptMatch[1])
  }
  
  // Extract enqueued styles
  const styleRegex = /wp_enqueue_style\s*\(\s*['"]([^'"]+)['"]/g
  let styleMatch
  while ((styleMatch = styleRegex.exec(phpCode)) !== null) {
    analysis.enqueueStyles.push(styleMatch[1])
  }
  
  // Extract AJAX actions
  const ajaxRegex = /wp_ajax_([a-zA-Z_]+)/g
  let ajaxMatch
  while ((ajaxMatch = ajaxRegex.exec(phpCode)) !== null) {
    analysis.ajaxActions.push(ajaxMatch[1])
  }
  
  // Extract REST endpoints
  const restRegex = /register_rest_route\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g
  let restMatch
  while ((restMatch = restRegex.exec(phpCode)) !== null) {
    analysis.restEndpoints.push(`${restMatch[1]}${restMatch[2]}`)
  }
  
  // Extract options
  const optionRegex = /(?:add_option|get_option|update_option)\s*\(\s*['"]([^'"]+)['"]/g
  let optionMatch
  while ((optionMatch = optionRegex.exec(phpCode)) !== null) {
    if (!analysis.options.includes(optionMatch[1])) {
      analysis.options.push(optionMatch[1])
    }
  }
  
  return analysis
}

// Function to validate PHP syntax (basic validation)
export const validatePHPSyntax = (phpCode: string): { isValid: boolean, errors: string[] } => {
  const errors: string[] = []
  
  // Check for basic PHP syntax issues
  if (!phpCode.includes('<?php')) {
    errors.push('Missing PHP opening tag (<?php)')
  }
  
  // Check for unmatched brackets
  const openBraces = (phpCode.match(/{/g) || []).length
  const closeBraces = (phpCode.match(/}/g) || []).length
  if (openBraces !== closeBraces) {
    errors.push(`Unmatched braces: ${openBraces} opening, ${closeBraces} closing`)
  }
  
  // Check for unmatched parentheses
  const openParens = (phpCode.match(/\(/g) || []).length
  const closeParens = (phpCode.match(/\)/g) || []).length
  if (openParens !== closeParens) {
    errors.push(`Unmatched parentheses: ${openParens} opening, ${closeParens} closing`)
  }
  
  // Check for missing semicolons (basic check)
  const lines = phpCode.split('\n')
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed && 
        !trimmed.startsWith('//') && 
        !trimmed.startsWith('/*') && 
        !trimmed.startsWith('*') && 
        !trimmed.startsWith('<?php') &&
        !trimmed.endsWith(';') && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') &&
        !trimmed.includes('?>') &&
        trimmed.length > 5) {
      // This is a very basic check - in reality, not all lines need semicolons
      // But it can catch some obvious issues
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Function to simulate WordPress plugin execution with enhanced analysis
export const executePlugin = (plugin: { code: string, name?: string }): PluginExecutionResult => {
  try {
    // Validate PHP syntax first
    const syntaxValidation = validatePHPSyntax(plugin.code)
    
    // Extract plugin metadata
    const metadata = extractPluginMetadata(plugin.code)
    
    // Analyze plugin code
    const analysis = analyzePluginCode(plugin.code)
    
    // Generate warnings for potential issues
    const warnings: string[] = []
    
    if (!metadata.name) {
      warnings.push('Plugin header is missing or incomplete')
    }
    
    if (!plugin.code.includes('defined(\'ABSPATH\')')) {
      warnings.push('Missing ABSPATH security check')
    }
    
    if (analysis.hooks.actions.length === 0 && analysis.hooks.filters.length === 0) {
      warnings.push('No WordPress hooks detected - plugin may not integrate with WordPress')
    }
    
    // Generate comprehensive output
    let output = `Plugin "${metadata.name || plugin.name || 'Unnamed Plugin'}" analysis completed.\n\n`
    
    // Add syntax validation results
    if (!syntaxValidation.isValid) {
      output += "⚠️ Syntax Issues Found:\n"
      syntaxValidation.errors.forEach(error => {
        output += `- ${error}\n`
      })
      output += "\n"
    } else {
      output += "✅ PHP Syntax: Valid\n\n"
    }
    
    // Add metadata to output
    if (Object.keys(metadata).length > 0) {
      output += "📋 Plugin Metadata:\n"
      Object.entries(metadata).forEach(([key, value]) => {
        output += `- ${key}: ${value}\n`
      })
      output += "\n"
    }
    
    // Add hooks information
    if (analysis.hooks.actions.length > 0) {
      output += "🔗 Action Hooks:\n"
      analysis.hooks.actions.forEach((action: { hook: string, callback: string }) => {
        output += `- ${action.hook} → ${action.callback}()\n`
      })
      output += "\n"
    }
    
    if (analysis.hooks.filters.length > 0) {
      output += "🔧 Filter Hooks:\n"
      analysis.hooks.filters.forEach((filter: { hook: string, callback: string }) => {
        output += `- ${filter.hook} → ${filter.callback}()\n`
      })
      output += "\n"
    }
    
    // Add features information
    if (analysis.shortcodes.length > 0) {
      output += "📝 Shortcodes:\n"
      analysis.shortcodes.forEach((shortcode: { tag: string, callback: string }) => {
        output += `- [${shortcode.tag}] → ${shortcode.callback}()\n`
      })
      output += "\n"
    }
    
    if (analysis.customPostTypes.length > 0) {
      output += "📄 Custom Post Types:\n"
      analysis.customPostTypes.forEach((cpt: string) => {
        output += `- ${cpt}\n`
      })
      output += "\n"
    }
    
    if (analysis.customTaxonomies.length > 0) {
      output += "🏷️ Custom Taxonomies:\n"
      analysis.customTaxonomies.forEach((tax: string) => {
        output += `- ${tax}\n`
      })
      output += "\n"
    }
    
    if (analysis.adminPages.length > 0) {
      output += "⚙️ Admin Pages:\n"
      analysis.adminPages.forEach((page: string) => {
        output += `- ${page}\n`
      })
      output += "\n"
    }
    
    if (analysis.blocks.length > 0) {
      output += "🧱 Gutenberg Blocks:\n"
      analysis.blocks.forEach((block: string) => {
        output += `- ${block}\n`
      })
      output += "\n"
    }
    
    if (analysis.restEndpoints.length > 0) {
      output += "🌐 REST API Endpoints:\n"
      analysis.restEndpoints.forEach((endpoint: string) => {
        output += `- ${endpoint}\n`
      })
      output += "\n"
    }
    
    if (analysis.enqueueScripts.length > 0) {
      output += "📜 Enqueued Scripts:\n"
      analysis.enqueueScripts.forEach((script: string) => {
        output += `- ${script}\n`
      })
      output += "\n"
    }
    
    if (analysis.enqueueStyles.length > 0) {
      output += "🎨 Enqueued Styles:\n"
      analysis.enqueueStyles.forEach((style: string) => {
        output += `- ${style}\n`
      })
      output += "\n"
    }
    
    if (analysis.options.length > 0) {
      output += "⚙️ WordPress Options:\n"
      analysis.options.forEach((option: string) => {
        output += `- ${option}\n`
      })
      output += "\n"
    }
    
    // Add warnings if any
    if (warnings.length > 0) {
      output += "⚠️ Warnings:\n"
      warnings.forEach(warning => {
        output += `- ${warning}\n`
      })
      output += "\n"
    }
    
    // Generate enhanced HTML preview for the plugin
    const renderedHtml = generateEnhancedPluginPreview(metadata, analysis)
    
    return {
      success: syntaxValidation.isValid,
      output,
      renderedHtml,
      warnings,
      errors: syntaxValidation.isValid ? undefined : syntaxValidation.errors.join('; '),
      hooks: analysis.hooks,
      features: {
        shortcodes: analysis.shortcodes,
        customPostTypes: analysis.customPostTypes,
        customTaxonomies: analysis.customTaxonomies,
        adminPages: analysis.adminPages,
        blocks: analysis.blocks,
        widgets: analysis.widgets,
        restEndpoints: analysis.restEndpoints
      }
    }
  } catch (error) {
    console.error('Error executing plugin:', error)
    return {
      success: false,
      output: '',
      errors: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Function to generate enhanced HTML preview for the plugin
const generateEnhancedPluginPreview = (
  metadata: Record<string, string>, 
  analysis: Record<string, any>
): string => {
  // Start with enhanced WordPress admin structure
  let html = `
    <div class="wp-preview-container">
      <div class="wp-preview-header">
        <div class="wp-preview-plugin-icon">
          <div class="plugin-icon-placeholder">🔌</div>
        </div>
        <div class="wp-preview-header-content">
          <h2>${metadata.name || 'Custom Plugin'}</h2>
          <p class="wp-preview-description">${metadata.description || 'A custom WordPress plugin created with Plugin Genius'}</p>
          <div class="wp-preview-meta">
            <span class="version">Version ${metadata.version || '1.0.0'}</span>
            <span class="author">by ${metadata.author || 'Plugin Genius'}</span>
          </div>
        </div>
        <div class="wp-preview-actions">
          <button class="wp-preview-button primary">Activate</button>
          <button class="wp-preview-button secondary">Edit</button>
        </div>
      </div>
      <div class="wp-preview-content">
  `
  
  // Add plugin features based on analysis
  
  // Add shortcodes preview if any
  if (analysis.shortcodes.length > 0) {
    html += `
      <div class="wp-preview-section">
        <h3>📝 Shortcodes</h3>
        <div class="wp-preview-shortcodes">
    `
    
    analysis.shortcodes.forEach((shortcode: { tag: string, callback: string }) => {
      html += `
        <div class="wp-preview-shortcode">
          <div class="wp-preview-shortcode-tag">[${shortcode.tag}]</div>
          <div class="wp-preview-shortcode-output">
            <div class="shortcode-demo">
              <h4>Shortcode Output Preview</h4>
              <div class="wp-preview-placeholder"></div>
              <p>This shortcode would render dynamic content when used in posts or pages.</p>
            </div>
          </div>
        </div>
      `
    })
    
    html += `
        </div>
      </div>
    `
  }
  
  // Add custom post types preview if any
  if (analysis.customPostTypes.length > 0) {
    html += `
      <div class="wp-preview-section">
        <h3>📄 Custom Post Types</h3>
        <div class="wp-preview-cpt">
    `
    
    analysis.customPostTypes.forEach((cpt: string) => {
      html += `
        <div class="wp-preview-cpt-item">
          <h4>${cpt.charAt(0).toUpperCase() + cpt.slice(1)}</h4>
          <div class="wp-preview-cpt-posts">
            <div class="wp-preview-post">
              <h5>Sample ${cpt} #1</h5>
              <p>This is a sample post of the custom post type "${cpt}".</p>
              <div class="post-meta">
                <span>Published: Today</span>
                <span>Status: Published</span>
              </div>
            </div>
            <div class="wp-preview-post">
              <h5>Sample ${cpt} #2</h5>
              <p>Another example of the "${cpt}" post type with custom fields and metadata.</p>
              <div class="post-meta">
                <span>Published: Yesterday</span>
                <span>Status: Draft</span>
              </div>
            </div>
          </div>
        </div>
      `
    })
    
    html += `
        </div>
      </div>
    `
  }
  
  // Add admin pages preview if any
  if (analysis.adminPages.length > 0) {
    html += `
      <div class="wp-preview-section">
        <h3>⚙️ Admin Pages</h3>
        <div class="wp-preview-admin-pages">
    `
    
    analysis.adminPages.forEach((page: string) => {
      html += `
        <div class="wp-preview-admin-page">
          <h4>${page}</h4>
          <div class="wp-preview-admin-content">
            <div class="wp-preview-form">
              <div class="wp-preview-form-field">
                <label>Plugin Setting 1</label>
                <input type="text" value="Default Value" disabled />
              </div>
              <div class="wp-preview-form-field">
                <label>Plugin Setting 2</label>
                <select disabled>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              <div class="wp-preview-form-field">
                <label>Enable Feature</label>
                <input type="checkbox" checked disabled />
                <span>Enable this plugin feature</span>
              </div>
              <button class="wp-preview-button primary" disabled>Save Changes</button>
            </div>
          </div>
        </div>
      `
    })
    
    html += `
        </div>
      </div>
    `
  }
  
  // Add blocks preview if any
  if (analysis.blocks.length > 0) {
    html += `
      <div class="wp-preview-section">
        <h3>🧱 Gutenberg Blocks</h3>
        <div class="wp-preview-blocks">
    `
    
    analysis.blocks.forEach((block: string) => {
      html += `
        <div class="wp-preview-block">
          <h4>${block}</h4>
          <div class="wp-preview-block-content">
            <div class="block-preview">
              <div class="wp-preview-placeholder"></div>
              <p><strong>Block Preview:</strong> This custom block would appear in the Gutenberg editor.</p>
              <div class="block-controls">
                <button class="block-control">Edit</button>
                <button class="block-control">Settings</button>
                <button class="block-control">Remove</button>
              </div>
            </div>
          </div>
        </div>
      `
    })
    
    html += `
        </div>
      </div>
    `
  }
  
  // Add REST API endpoints if any
  if (analysis.restEndpoints.length > 0) {
    html += `
      <div class="wp-preview-section">
        <h3>🌐 REST API Endpoints</h3>
        <div class="wp-preview-rest">
    `
    
    analysis.restEndpoints.forEach((endpoint: string) => {
      html += `
        <div class="wp-preview-endpoint">
          <code>GET ${endpoint}</code>
          <p>Custom REST API endpoint for external integrations</p>
        </div>
      `
    })
    
    html += `
        </div>
      </div>
    `
  }
  
  // Add hooks summary
  if (analysis.hooks.actions.length > 0 || analysis.hooks.filters.length > 0) {
    html += `
      <div class="wp-preview-section">
        <h3>🔗 WordPress Integration</h3>
        <div class="wp-preview-hooks">
          <div class="hooks-summary">
            <div class="hook-count">
              <span class="count">${analysis.hooks.actions.length}</span>
              <span class="label">Action Hooks</span>
            </div>
            <div class="hook-count">
              <span class="count">${analysis.hooks.filters.length}</span>
              <span class="label">Filter Hooks</span>
            </div>
          </div>
          <p>This plugin integrates with WordPress using ${analysis.hooks.actions.length + analysis.hooks.filters.length} hooks for seamless functionality.</p>
        </div>
      </div>
    `
  }
  
  // Close main containers
  html += `
      </div>
    </div>
  `
  
  return html
}