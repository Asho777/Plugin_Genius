import { supabase } from '../lib/supabase'

export interface UserProfile {
  id?: string
  user_id: string
  full_name?: string
  email?: string
  company?: string
  avatar_url?: string
  api_key?: string
  created_at?: string
  updated_at?: string
}

export interface UserSecurity {
  id?: string
  user_id: string
  password_last_changed?: string
  two_factor_enabled: boolean
  created_at?: string
  updated_at?: string
}

export interface UserNotifications {
  id?: string
  user_id: string
  email_notifications: boolean
  update_notifications: boolean
  marketing_notifications: boolean
  created_at?: string
  updated_at?: string
}

export interface UserPreferences {
  id?: string
  user_id: string
  language?: string
  timezone?: string
  dark_mode: boolean
  created_at?: string
  updated_at?: string
}

export interface ProfileImage {
  id?: string
  user_id: string
  image_url: string
  storage_path: string
  file_name: string
  file_size: number
  mime_type: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Get current user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

// Get user security settings - create if doesn't exist
export const getUserSecurity = async (): Promise<UserSecurity | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // Try to get existing record
    const { data, error } = await supabase
      .from('user_security')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user security:', error)
      return null
    }

    // If no record exists, create one with defaults
    if (!data) {
      console.log('No security record found, creating default...')
      const defaultSecurity = {
        user_id: user.id,
        two_factor_enabled: false,
        password_last_changed: new Date().toISOString()
      }

      const { data: newData, error: insertError } = await supabase
        .from('user_security')
        .insert(defaultSecurity)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default security record:', insertError)
        return null
      }

      return newData
    }

    return data
  } catch (error) {
    console.error('Error in getUserSecurity:', error)
    return null
  }
}

// Get user notification settings - create if doesn't exist
export const getUserNotifications = async (): Promise<UserNotifications | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // Try to get existing record
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user notifications:', error)
      return null
    }

    // If no record exists, create one with defaults
    if (!data) {
      console.log('No notifications record found, creating default...')
      const defaultNotifications = {
        user_id: user.id,
        email_notifications: true,
        update_notifications: true,
        marketing_notifications: false
      }

      const { data: newData, error: insertError } = await supabase
        .from('user_notifications')
        .insert(defaultNotifications)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default notifications record:', insertError)
        return null
      }

      return newData
    }

    return data
  } catch (error) {
    console.error('Error in getUserNotifications:', error)
    return null
  }
}

// Get user preferences - create if doesn't exist
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // Try to get existing record
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }

    // If no record exists, create one with defaults
    if (!data) {
      console.log('No preferences record found, creating default...')
      const defaultPreferences = {
        user_id: user.id,
        language: 'en',
        timezone: 'utc',
        dark_mode: false
      }

      const { data: newData, error: insertError } = await supabase
        .from('user_preferences')
        .insert(defaultPreferences)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default preferences record:', insertError)
        return null
      }

      return newData
    }

    return data
  } catch (error) {
    console.error('Error in getUserPreferences:', error)
    return null
  }
}

// Save API key to user profile
export const saveUserApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing profile:', checkError)
      throw checkError
    }

    const updateData = {
      user_id: user.id,
      api_key: apiKey,
      updated_at: new Date().toISOString()
    }

    let data, error

    if (existingProfile) {
      // Update existing profile
      const result = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      data = result.data
      error = result.error
    } else {
      // Create new profile
      const result = await supabase
        .from('user_profiles')
        .insert({
          ...updateData,
          email: user.email,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error saving API key to user profile:', error)
      throw error
    }

    console.log('API key saved to user profile successfully')
    return true
  } catch (error) {
    console.error('Error in saveUserApiKey:', error)
    return false
  }
}

// Get API key from user profile
export const getUserApiKey = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('api_key')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user API key:', error)
      return null
    }

    return data?.api_key || null
  } catch (error) {
    console.error('Error in getUserApiKey:', error)
    return null
  }
}

// Upload avatar - assumes bucket exists (created manually)
export const uploadAvatar = async (file: File): Promise<string | null> => {
  try {
    console.log('Starting avatar upload process...')
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    console.log('User authenticated:', user.id)

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size must be less than 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`
    const storagePath = `avatars/${fileName}`

    console.log('Uploading to storage path:', storagePath)

    // Upload to Supabase storage (bucket must exist)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      
      // Provide helpful error message if bucket doesn't exist
      if (uploadError.message.includes('Bucket not found')) {
        throw new Error('Storage bucket not found. Please create the "user-content" bucket manually in Supabase dashboard. See STORAGE_SETUP.md for instructions.')
      }
      
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    console.log('File uploaded to storage successfully:', uploadData)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-content')
      .getPublicUrl(storagePath)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    const publicUrl = urlData.publicUrl
    console.log('Generated public URL:', publicUrl)

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing profile:', checkError)
      
      // Clean up uploaded file if check fails
      await supabase.storage
        .from('user-content')
        .remove([storagePath])
      
      throw new Error(`Profile check failed: ${checkError.message}`)
    }

    let updateData, updateError

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      updateData = data
      updateError = error
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({ 
          user_id: user.id,
          avatar_url: publicUrl,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      updateData = data
      updateError = error
    }

    if (updateError) {
      console.error('Profile update error:', updateError)
      
      // Clean up uploaded file if profile update fails
      await supabase.storage
        .from('user-content')
        .remove([storagePath])
      
      throw new Error(`Profile update failed: ${updateError.message}`)
    }

    console.log('Profile updated successfully:', updateData)
    return publicUrl

  } catch (error) {
    console.error('Error in uploadAvatar:', error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing profile:', checkError)
      throw checkError
    }

    const updateData = {
      ...profile,
      user_id: user.id,
      updated_at: new Date().toISOString()
    }

    let data, error

    if (existingProfile) {
      // Update existing profile
      const result = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      data = result.data
      error = result.error
    } else {
      // Create new profile
      const result = await supabase
        .from('user_profiles')
        .insert({
          ...updateData,
          email: user.email,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    return null
  }
}

// Update user security settings
export const updateUserSecurity = async (security: Partial<UserSecurity>): Promise<UserSecurity | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First check if security record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_security')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing security record:', checkError)
      throw checkError
    }

    const updateData = {
      ...security,
      user_id: user.id,
      updated_at: new Date().toISOString()
    }

    let data, error

    if (existingRecord) {
      // Update existing record
      const result = await supabase
        .from('user_security')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      data = result.data
      error = result.error
    } else {
      // Create new record
      const result = await supabase
        .from('user_security')
        .insert({
          ...updateData,
          two_factor_enabled: updateData.two_factor_enabled ?? false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error updating user security:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateUserSecurity:', error)
    return null
  }
}

// Update user password
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Error updating password:', error)
      return false
    }

    // Update the password_last_changed field
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await updateUserSecurity({ 
        password_last_changed: new Date().toISOString()
      })
    }

    return true
  } catch (error) {
    console.error('Error in updateUserPassword:', error)
    return false
  }
}

// Update user notification settings
export const updateUserNotifications = async (notifications: Partial<UserNotifications>): Promise<UserNotifications | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First check if notifications record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_notifications')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing notifications record:', checkError)
      throw checkError
    }

    const updateData = {
      ...notifications,
      user_id: user.id,
      updated_at: new Date().toISOString()
    }

    let data, error

    if (existingRecord) {
      // Update existing record
      const result = await supabase
        .from('user_notifications')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      data = result.data
      error = result.error
    } else {
      // Create new record with defaults
      const result = await supabase
        .from('user_notifications')
        .insert({
          ...updateData,
          email_notifications: updateData.email_notifications ?? true,
          update_notifications: updateData.update_notifications ?? true,
          marketing_notifications: updateData.marketing_notifications ?? false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error updating user notifications:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateUserNotifications:', error)
    return null
  }
}

// Update user preferences
export const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First check if preferences record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing preferences record:', checkError)
      throw checkError
    }

    const updateData = {
      ...preferences,
      user_id: user.id,
      updated_at: new Date().toISOString()
    }

    let data, error

    if (existingRecord) {
      // Update existing record
      const result = await supabase
        .from('user_preferences')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .maybeSingle()

      data = result.data
      error = result.error
    } else {
      // Create new record with defaults
      const result = await supabase
        .from('user_preferences')
        .insert({
          ...updateData,
          language: updateData.language ?? 'en',
          timezone: updateData.timezone ?? 'utc',
          dark_mode: updateData.dark_mode ?? false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateUserPreferences:', error)
    return null
  }
}

// Get user's profile images
export const getUserProfileImages = async (): Promise<ProfileImage[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching profile images:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserProfileImages:', error)
    return []
  }
}

// Get active profile image
export const getActiveProfileImage = async (): Promise<ProfileImage | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    const { data, error } = await supabase
      .from('profile_images')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error fetching active profile image:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getActiveProfileImage:', error)
    return null
  }
}

// Delete profile image
export const deleteProfileImage = async (imageId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No authenticated user')
    }

    // First get the image to delete from storage
    const { data: imageData, error: fetchError } = await supabase
      .from('profile_images')
      .select('storage_path')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching image for deletion:', fetchError)
      throw fetchError
    }

    if (!imageData) {
      throw new Error('Image not found')
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('user-content')
      .remove([imageData.storage_path])

    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting from database:', deleteError)
      throw deleteError
    }

    return true
  } catch (error) {
    console.error('Error in deleteProfileImage:', error)
    return false
  }
}
