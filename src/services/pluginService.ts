import { Plugin } from '../pages/TemplatesPage'
import { supabase } from '../lib/supabase'

// Function to save a plugin to the authenticated user's collection
export const savePlugin = async (plugin: Plugin): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to save plugins')
    }

    // Prepare plugin data for database
    const pluginData = {
      user_id: user.id,
      plugin_id: plugin.id,
      plugin_name: plugin.name || '',
      plugin_description: plugin.description || '',
      plugin_author: plugin.author || '',
      plugin_image_url: plugin.imageUrl || '',
      plugin_detail_url: plugin.detailUrl || '',
      plugin_rating: plugin.rating || 0,
      plugin_downloads: plugin.downloads || 0,
      plugin_last_updated: plugin.lastUpdated || '',
      plugin_tags: Array.isArray(plugin.tags) ? plugin.tags : []
    }

    const { error } = await supabase
      .from('user_plugins')
      .upsert(pluginData, {
        onConflict: 'user_id,plugin_id'
      })

    if (error) {
      console.error('Supabase error saving plugin:', error)
      throw new Error(`Failed to save plugin: ${error.message}`)
    }

    console.log('Plugin saved successfully to database')
  } catch (error) {
    console.error('Error in savePlugin function:', error)
    throw error
  }
}

// Function to get all saved plugins for the authenticated user
export const getSavedPlugins = async (): Promise<Plugin[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('user_plugins')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved plugins:', error)
      return []
    }

    // Ensure we always return an array and handle null/undefined data
    if (!data || !Array.isArray(data)) {
      return []
    }

    // Transform database records back to Plugin objects
    return data.map(record => ({
      id: record.plugin_id,
      name: record.plugin_name || '',
      description: record.plugin_description || '',
      author: record.plugin_author || '',
      imageUrl: record.plugin_image_url || '',
      detailUrl: record.plugin_detail_url || '',
      rating: record.plugin_rating || 0,
      downloads: record.plugin_downloads || 0,
      lastUpdated: record.plugin_last_updated || '',
      tags: Array.isArray(record.plugin_tags) ? record.plugin_tags : [],
      createdAt: record.updated_at
    }))
  } catch (error) {
    console.error('Error in getSavedPlugins:', error)
    return []
  }
}

// Function to remove a plugin from the authenticated user's saved plugins
export const removeSavedPlugin = async (pluginId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to remove plugins')
    }

    const { error } = await supabase
      .from('user_plugins')
      .delete()
      .eq('user_id', user.id)
      .eq('plugin_id', pluginId)

    if (error) {
      console.error('Error removing plugin:', error)
      throw new Error('Failed to remove plugin')
    }
  } catch (error) {
    console.error('Error in removeSavedPlugin:', error)
    throw error
  }
}

// Add alias for backward compatibility
export const removePlugin = removeSavedPlugin

// Function to check if a plugin is saved by the authenticated user
export const isPluginSaved = async (pluginId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('user_plugins')
      .select('id')
      .eq('user_id', user.id)
      .eq('plugin_id', pluginId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking if plugin is saved:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isPluginSaved:', error)
    return false
  }
}
