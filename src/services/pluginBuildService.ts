import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { extractPluginMetadata } from './pluginExecutionService'

// Interface for plugin build options
export interface PluginBuildOptions {
  code: string
  name?: string
  includeAssets?: boolean
  includeReadme?: boolean
}

// Interface for plugin build result
export interface PluginBuildResult {
  success: boolean
  message: string
  filename?: string
  error?: string
}

/**
 * Build a WordPress plugin zip file from the provided code
 */
export const buildPlugin = async (options: PluginBuildOptions): Promise<PluginBuildResult> => {
  try {
    const { code, includeAssets = true, includeReadme = true } = options
    
    // Extract metadata from the plugin code
    const metadata = extractPluginMetadata(code)
    
    // Determine plugin slug (used for folder and file naming)
    const pluginName = metadata.name || options.name || 'my-custom-plugin'
    const pluginSlug = createPluginSlug(pluginName)
    
    // Create a new zip instance
    const zip = new JSZip()
    
    // Create the main plugin folder
    const pluginFolder = zip.folder(pluginSlug)
    if (!pluginFolder) {
      throw new Error('Failed to create plugin folder in zip')
    }
    
    // Add the main plugin file
    pluginFolder.file(`${pluginSlug}.php`, code)
    
    // Add readme.txt if requested
    if (includeReadme) {
      pluginFolder.file('readme.txt', generateReadme(metadata))
    }
    
    // Add basic asset files if requested
    if (includeAssets) {
      // Create assets folder
      const assetsFolder = pluginFolder.folder('assets')
      if (assetsFolder) {
        // Add CSS file
        assetsFolder.file('css/style.css', generateCssFile(pluginSlug))
        
        // Add JS file
        assetsFolder.file('js/script.js', generateJsFile(pluginSlug))
        
        // Add index.php files for security (prevent directory listing)
        assetsFolder.file('index.php', '<?php // Silence is golden.')
        assetsFolder.file('css/index.php', '<?php // Silence is golden.')
        assetsFolder.file('js/index.php', '<?php // Silence is golden.')
      }
    }
    
    // Add index.php to the root folder for security
    pluginFolder.file('index.php', '<?php // Silence is golden.')
    
    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // Save the zip file
    const filename = `${pluginSlug}.zip`
    
    try {
      // Attempt to save the file
      saveAs(zipBlob, filename)
      
      // Log success for debugging
      console.log('File download initiated:', filename)
      
      return {
        success: true,
        message: `Plugin "${pluginName}" has been built successfully.`,
        filename
      }
    } catch (saveError) {
      console.error('Error saving file:', saveError)
      
      // Try an alternative approach for browsers that might block saveAs
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(zipBlob)
      downloadLink.download = filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      
      return {
        success: true,
        message: `Plugin "${pluginName}" has been built successfully.`,
        filename
      }
    }
  } catch (error) {
    console.error('Error building plugin:', error)
    return {
      success: false,
      message: 'Failed to build plugin.',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Create a valid plugin slug from the plugin name
 */
const createPluginSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    || 'my-custom-plugin' // Fallback if the result is empty
}

/**
 * Generate a readme.txt file based on plugin metadata
 */
const generateReadme = (metadata: Record<string, string>): string => {
  const pluginName = metadata.name || 'My Custom Plugin'
  const description = metadata.description || 'A custom WordPress plugin.'
  const version = metadata.version || '1.0.0'
  const author = metadata.author || 'Plugin Genius'
  const authorUri = metadata.authorUri || ''
  const requires = metadata.requires || '5.0'
  const tested = metadata.tested || '6.3'
  const requiresPHP = metadata.requiresPHP || '7.0'
  
  return `=== ${pluginName} ===
Contributors: ${author.toLowerCase().replace(/[^a-z0-9]+/g, '')}
Tags: custom, plugin
Requires at least: ${requires}
Tested up to: ${tested}
Requires PHP: ${requiresPHP}
Stable tag: ${version}
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

${description}

== Description ==

${description}

This plugin was created with Plugin Genius, an AI-powered WordPress plugin development tool.

== Installation ==

1. Upload the plugin files to the \`/wp-content/plugins/${createPluginSlug(pluginName)}\` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Use the plugin's features as needed.

== Frequently Asked Questions ==

= How do I get support for this plugin? =

Please contact the plugin author for support.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif).

== Changelog ==

= ${version} =
* Initial release.

== Upgrade Notice ==

= ${version} =
Initial release.
`
}

/**
 * Generate a basic CSS file for the plugin
 */
const generateCssFile = (pluginSlug: string): string => {
  return `/**
 * ${pluginSlug} Styles
 */

.${pluginSlug}-container {
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.${pluginSlug}-title {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #333;
}

.${pluginSlug}-content {
  line-height: 1.5;
}

.${pluginSlug}-button {
  display: inline-block;
  padding: 8px 15px;
  background-color: #0073aa;
  color: #fff;
  text-decoration: none;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.${pluginSlug}-button:hover {
  background-color: #005177;
}
`
}

/**
 * Generate a basic JavaScript file for the plugin
 */
const generateJsFile = (pluginSlug: string): string => {
  return `/**
 * ${pluginSlug} Scripts
 */

(function($) {
  'use strict';
  
  // Document ready
  $(function() {
    // Initialize plugin functionality
    init${toCamelCase(pluginSlug)}();
  });
  
  /**
   * Initialize plugin functionality
   */
  function init${toCamelCase(pluginSlug)}() {
    // Plugin initialization code
    console.log('${pluginSlug} initialized');
    
    // Example: Add click handler to plugin buttons
    $('.${pluginSlug}-button').on('click', function(e) {
      e.preventDefault();
      console.log('${pluginSlug} button clicked');
    });
  }
  
})(jQuery);
`
}

/**
 * Convert a hyphenated string to camelCase
 */
const toCamelCase = (str: string): string => {
  return str
    .split('-')
    .map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')
}
