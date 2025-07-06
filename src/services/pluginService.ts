import { Plugin } from '../pages/TemplatesPage'

// Local storage key for saved plugins
const SAVED_PLUGINS_KEY = 'savedPlugins'

// Function to save a plugin to local storage
export const savePlugin = (plugin: Plugin): void => {
  const savedPlugins = getSavedPlugins()
  
  // Check if plugin already exists
  if (!savedPlugins.some(p => p.id === plugin.id)) {
    savedPlugins.push(plugin)
    localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(savedPlugins))
  }
}

// Function to get all saved plugins from local storage
export const getSavedPlugins = (): Plugin[] => {
  const savedPluginsJson = localStorage.getItem(SAVED_PLUGINS_KEY)
  return savedPluginsJson ? JSON.parse(savedPluginsJson) : []
}

// Function to remove a plugin from saved plugins
export const removeSavedPlugin = (pluginId: string): void => {
  const savedPlugins = getSavedPlugins()
  const updatedPlugins = savedPlugins.filter(plugin => plugin.id !== pluginId)
  localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(updatedPlugins))
}

// Add alias for backward compatibility
export const removePlugin = removeSavedPlugin
