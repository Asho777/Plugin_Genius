import { DOMParser } from 'xmldom';

// Interface for plugin execution options
export interface PluginExecutionOptions {
  code: string;
  name?: string;
}

// Interface for plugin execution result
export interface PluginExecutionResult {
  success: boolean;
  output: string;
  errors: string;
  renderedHtml?: string;
}

/**
 * Extract plugin metadata from PHP code
 */
export const extractPluginMetadata = (code: string): Record<string, string> => {
  const metadata: Record<string, string> = {};
  
  // Extract plugin header information
  const headerRegex = /\/\*\*[\s\S]*?Plugin Name:[\s\S]*?\*\//;
  const headerMatch = code.match(headerRegex);
  
  if (headerMatch) {
    const header = headerMatch[0];
    
    // Extract individual metadata fields
    const fields = [
      { key: 'name', regex: /Plugin Name:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'description', regex: /Description:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'version', regex: /Version:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'author', regex: /Author:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'authorUri', regex: /Author URI:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'textDomain', regex: /Text Domain:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'domainPath', regex: /Domain Path:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'requires', regex: /Requires at least:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'tested', regex: /Tested up to:\s*(.+?)(\r?\n|\*\/)/i },
      { key: 'requiresPHP', regex: /Requires PHP:\s*(.+?)(\r?\n|\*\/)/i },
    ];
    
    fields.forEach(field => {
      const match = header.match(field.regex);
      if (match && match[1]) {
        metadata[field.key] = match[1].trim();
      }
    });
  }
  
  return metadata;
};

/**
 * Execute WordPress plugin code and return the result
 */
export const executePlugin = (options: PluginExecutionOptions): PluginExecutionResult => {
  try {
    const { code } = options;
    
    // Basic PHP syntax validation
    validatePhpSyntax(code);
    
    // Extract plugin metadata
    const metadata = extractPluginMetadata(code);
    
    // Simulate plugin execution
    const output = simulatePluginExecution(code, metadata);
    
    // Generate a simple HTML preview
    const renderedHtml = generateHtmlPreview(code, metadata);
    
    return {
      success: true,
      output,
      errors: '',
      renderedHtml
    };
  } catch (error) {
    console.error('Error executing plugin:', error);
    
    return {
      success: false,
      output: '',
      errors: error instanceof Error ? error.message : 'Unknown error occurred',
      renderedHtml: undefined
    };
  }
};

/**
 * Validate PHP syntax
 */
const validatePhpSyntax = (code: string): void => {
  // Check for opening and closing PHP tags
  if (!code.includes('<?php')) {
    throw new Error('Missing opening PHP tag (<?php)');
  }
  
  // Check for balanced braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    throw new Error(`Unbalanced braces: ${openBraces} opening vs ${closeBraces} closing`);
  }
  
  // Check for common PHP syntax errors
  if (code.includes('<?') && !code.includes('<?php') && !code.includes('<?=')) {
    throw new Error('Short open tags (<?) are not recommended. Use <?php instead.');
  }
  
  // Check for unclosed strings
  const singleQuotes = (code.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    throw new Error('Unclosed single quote detected');
  }
  
  const doubleQuotes = (code.match(/"/g) || []).length;
  if (doubleQuotes % 2 !== 0) {
    throw new Error('Unclosed double quote detected');
  }
};

/**
 * Simulate plugin execution
 */
const simulatePluginExecution = (code: string, metadata: Record<string, string>): string => {
  let output = '';
  
  // Check for common WordPress hooks
  if (code.includes('add_action') || code.includes('add_filter')) {
    output += 'WordPress hooks detected and registered.\n';
  }
  
  // Check for shortcodes
  if (code.includes('add_shortcode')) {
    output += 'Shortcodes registered.\n';
  }
  
  // Check for widgets
  if (code.includes('register_widget') || (code.includes('extends WP_Widget') && code.includes('register_widget'))) {
    output += 'Widgets registered.\n';
  }
  
  // Check for blocks
  if (code.includes('register_block_type')) {
    output += 'Gutenberg blocks registered.\n';
  }
  
  // Check for admin pages
  if (code.includes('add_menu_page') || code.includes('add_submenu_page')) {
    output += 'Admin pages registered.\n';
  }
  
  // Check for REST API endpoints
  if (code.includes('register_rest_route')) {
    output += 'REST API endpoints registered.\n';
  }
  
  // Check for custom post types
  if (code.includes('register_post_type')) {
    output += 'Custom post types registered.\n';
  }
  
  // Check for custom taxonomies
  if (code.includes('register_taxonomy')) {
    output += 'Custom taxonomies registered.\n';
  }
  
  // Check for database operations
  if (code.includes('$wpdb')) {
    output += 'Database operations detected.\n';
  }
  
  // If no specific features were detected
  if (output === '') {
    output = 'Plugin activated successfully, but no specific WordPress features were detected.';
  } else {
    output = `Plugin "${metadata.name || 'Unknown'}" activated successfully.\n\n` + output;
  }
  
  return output;
};

/**
 * Generate a simple HTML preview for the plugin
 */
const generateHtmlPreview = (code: string, metadata: Record<string, string>): string => {
  const pluginName = metadata.name || 'Unknown Plugin';
  const description = metadata.description || 'No description provided.';
  const version = metadata.version || '1.0.0';
  const author = metadata.author || 'Unknown';
  
  // Determine plugin type and features
  const hasShortcodes = code.includes('add_shortcode');
  const hasWidgets = code.includes('register_widget') || (code.includes('extends WP_Widget') && code.includes('register_widget'));
  const hasBlocks = code.includes('register_block_type');
  const hasAdminPages = code.includes('add_menu_page') || code.includes('add_submenu_page');
  const hasRestApi = code.includes('register_rest_route');
  const hasCustomPostTypes = code.includes('register_post_type');
  const hasCustomTaxonomies = code.includes('register_taxonomy');
  const hasDatabaseOperations = code.includes('$wpdb');
  
  // Create HTML preview
  let html = `
    <div class="preview-wp-header">
      <div class="preview-wp-logo">W</div>
      <div class="preview-wp-title">WordPress Admin</div>
    </div>
    <div class="preview-wp-sidebar">
      <div class="preview-wp-menu-item">Dashboard</div>
      <div class="preview-wp-menu-item">Posts</div>
      <div class="preview-wp-menu-item">Media</div>
      <div class="preview-wp-menu-item">Pages</div>
      <div class="preview-wp-menu-item active">Plugins</div>
      <div class="preview-wp-menu-item">Appearance</div>
      <div class="preview-wp-menu-item">Users</div>
      <div class="preview-wp-menu-item">Tools</div>
      <div class="preview-wp-menu-item">Settings</div>
    </div>
    <div class="preview-wp-content">
      <div class="preview-wp-page-title">Plugins</div>
      
      <div class="preview-wp-plugin-card active-plugin">
        <div class="preview-wp-plugin-name">${pluginName}</div>
        <div class="preview-wp-plugin-description">${description}</div>
        <div class="preview-wp-plugin-meta">
          <span>Version: ${version}</span>
          <span>Author: ${author}</span>
        </div>
        <div class="preview-wp-plugin-status success">
          Plugin activated successfully
        </div>
        <div class="preview-wp-plugin-actions">
          <button class="preview-wp-plugin-action">Settings</button>
          <button class="preview-wp-plugin-action">Deactivate</button>
        </div>
      </div>
      
      <div class="preview-wp-plugin-features">
        <h3>Plugin Features</h3>
        <ul>
  `;
  
  // Add detected features
  if (hasShortcodes) {
    html += `<li>Shortcodes</li>`;
  }
  if (hasWidgets) {
    html += `<li>Widgets</li>`;
  }
  if (hasBlocks) {
    html += `<li>Gutenberg Blocks</li>`;
  }
  if (hasAdminPages) {
    html += `<li>Admin Pages</li>`;
  }
  if (hasRestApi) {
    html += `<li>REST API Endpoints</li>`;
  }
  if (hasCustomPostTypes) {
    html += `<li>Custom Post Types</li>`;
  }
  if (hasCustomTaxonomies) {
    html += `<li>Custom Taxonomies</li>`;
  }
  if (hasDatabaseOperations) {
    html += `<li>Database Operations</li>`;
  }
  
  // If no features were detected
  if (!hasShortcodes && !hasWidgets && !hasBlocks && !hasAdminPages && 
      !hasRestApi && !hasCustomPostTypes && !hasCustomTaxonomies && !hasDatabaseOperations) {
    html += `<li>Basic WordPress Plugin</li>`;
  }
  
  html += `
        </ul>
      </div>
    </div>
  `;
  
  return html;
};
