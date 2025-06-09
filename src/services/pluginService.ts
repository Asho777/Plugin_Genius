import { Plugin } from '../pages/TemplatesPage'

// Local storage key for saved plugins
const SAVED_PLUGINS_KEY = 'plugin_genius_saved_plugins'

// Get saved plugins from local storage
export const getSavedPlugins = (): Plugin[] => {
  const savedPluginsJson = localStorage.getItem(SAVED_PLUGINS_KEY)
  if (!savedPluginsJson) return []
  
  try {
    return JSON.parse(savedPluginsJson)
  } catch (error) {
    console.error('Error parsing saved plugins:', error)
    return []
  }
}

// Save a plugin to local storage
export const savePlugin = (plugin: Plugin): void => {
  const savedPlugins = getSavedPlugins()
  
  // Check if plugin already exists
  const exists = savedPlugins.some(p => p.id === plugin.id)
  
  if (!exists) {
    // Add plugin to saved plugins
    const updatedPlugins = [...savedPlugins, plugin]
    localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(updatedPlugins))
  }
}

// Remove a plugin from local storage
export const removePlugin = (pluginId: string): void => {
  const savedPlugins = getSavedPlugins()
  const updatedPlugins = savedPlugins.filter(plugin => plugin.id !== pluginId)
  localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(updatedPlugins))
}
