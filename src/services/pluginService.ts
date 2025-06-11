import { Plugin } from '../pages/TemplatesPage'

// Local storage key for saved plugins
const SAVED_PLUGINS_KEY = 'savedWordPressPlugins'

// Function to save a plugin to local storage
export const savePlugin = (plugin: Plugin): void => {
  const savedPlugins = getSavedPlugins()
  
  // Check if plugin is already saved
  if (!savedPlugins.some(p => p.id === plugin.id)) {
    savedPlugins.push(plugin)
    localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(savedPlugins))
  }
}

// Function to remove a plugin from saved plugins
export const removePlugin = (pluginId: string): void => {
  const savedPlugins = getSavedPlugins()
  const updatedPlugins = savedPlugins.filter(plugin => plugin.id !== pluginId)
  localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(updatedPlugins))
}

// Function to get all saved plugins
export const getSavedPlugins = (): Plugin[] => {
  const savedPluginsJson = localStorage.getItem(SAVED_PLUGINS_KEY)
  return savedPluginsJson ? JSON.parse(savedPluginsJson) : []
}

// Function to check if a plugin is saved
export const isPluginSaved = (pluginId: string): boolean => {
  const savedPlugins = getSavedPlugins()
  return savedPlugins.some(plugin => plugin.id === pluginId)
}
