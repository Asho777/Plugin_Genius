import { Plugin } from '../pages/TemplatesPage'
import { supabase } from '../lib/supabase'

// Local storage key for saved plugins (kept for fallback)
const SAVED_PLUGINS_KEY = 'savedPlugins'

// Function to save a plugin to database
export const savePlugin = async (plugin: Plugin): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    
    if (!userId) {
      // Fallback to local storage if user is not logged in
      const savedPlugins = getSavedPluginsFromLocalStorage()
      if (!savedPlugins.some(p => p.id === plugin.id)) {
        savedPlugins.push(plugin)
        localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(savedPlugins))
      }
      return
    }
    
    // Check if plugin already exists for this user
    const { data, error } = await supabase
      .from('user_plugins')
      .select('id')
      .eq('user_id', userId)
      .eq('plugin_id', plugin.id)
    
    if (error) {
      console.error('Error checking if plugin exists:', error)
      throw error
    }
    
    // Only insert if the plugin doesn't already exist
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('user_plugins')
        .insert({
          user_id: userId,
          plugin_id: plugin.id,
          plugin_data: plugin
        })
      
      if (insertError) {
        console.error('Error inserting plugin:', insertError)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error saving plugin:', error)
    // Fallback to local storage
    const savedPlugins = getSavedPluginsFromLocalStorage()
    if (!savedPlugins.some(p => p.id === plugin.id)) {
      savedPlugins.push(plugin)
      localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(savedPlugins))
    }
  }
}

// Function to get all saved plugins from database
export const getSavedPlugins = async (): Promise<Plugin[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    
    if (!userId) {
      // Fallback to local storage if user is not logged in
      return getSavedPluginsFromLocalStorage()
    }
    
    // Get plugins from database
    const { data, error } = await supabase
      .from('user_plugins')
      .select('plugin_data')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching plugins:', error)
      throw error
    }
    
    return data && data.length > 0 ? data.map(item => item.plugin_data as Plugin) : []
  } catch (error) {
    console.error('Error getting saved plugins:', error)
    // Fallback to local storage
    return getSavedPluginsFromLocalStorage()
  }
}

// Function to remove a plugin from database
export const removeSavedPlugin = async (pluginId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    
    if (!userId) {
      // Fallback to local storage if user is not logged in
      const savedPlugins = getSavedPluginsFromLocalStorage()
      const updatedPlugins = savedPlugins.filter(plugin => plugin.id !== pluginId)
      localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(updatedPlugins))
      return
    }
    
    // Remove from database
    const { error } = await supabase
      .from('user_plugins')
      .delete()
      .eq('user_id', userId)
      .eq('plugin_id', pluginId)
    
    if (error) {
      console.error('Error deleting plugin:', error)
      throw error
    }
  } catch (error) {
    console.error('Error removing plugin:', error)
    // Fallback to local storage
    const savedPlugins = getSavedPluginsFromLocalStorage()
    const updatedPlugins = savedPlugins.filter(plugin => plugin.id !== pluginId)
    localStorage.setItem(SAVED_PLUGINS_KEY, JSON.stringify(updatedPlugins))
  }
}

// Helper function to get plugins from local storage
const getSavedPluginsFromLocalStorage = (): Plugin[] => {
  const savedPluginsJson = localStorage.getItem(SAVED_PLUGINS_KEY)
  return savedPluginsJson ? JSON.parse(savedPluginsJson) : []
}

// Add alias for backward compatibility
export const removePlugin = removeSavedPlugin
