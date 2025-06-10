import { supabase } from '../lib/supabase';

// Types for settings
export interface UserProfile {
  id?: string;
  user_id?: string;
  full_name: string;
  email: string;
  company: string;
  avatar_url?: string;
}

export interface UserSecurity {
  id?: string;
  user_id?: string;
  password_last_changed?: string;
  two_factor_enabled: boolean;
}

export interface UserNotifications {
  id?: string;
  user_id?: string;
  email_notifications: boolean;
  update_notifications: boolean;
  marketing_notifications: boolean;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  language: string;
  timezone: string;
  dark_mode: boolean;
}

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Update user profile
export const updateUserProfile = async (profile: UserProfile): Promise<UserProfile | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.user.id)
    .single();
  
  let result;
  
  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        full_name: profile.full_name,
        email: profile.email,
        company: profile.company,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    result = data;
  } else {
    // Insert new profile
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.user.id,
        full_name: profile.full_name,
        email: profile.email,
        company: profile.company,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    result = data;
  }
  
  return result;
};

// Upload avatar image
export const uploadAvatar = async (file: File): Promise<string | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return null;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }
    
    const { data } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);
      
    // Update user profile with avatar URL
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        avatar_url: data.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user.id);
      
    if (updateError) {
      console.error('Error updating avatar URL:', updateError);
    }
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
};

// Get user security settings
export const getUserSecurity = async (): Promise<UserSecurity | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_security')
    .select('*')
    .eq('user_id', user.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user security settings:', error);
    return null;
  }
  
  return data;
};

// Update user security settings
export const updateUserSecurity = async (security: UserSecurity): Promise<UserSecurity | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  // Check if security settings exist
  const { data: existingSecurity } = await supabase
    .from('user_security')
    .select('id')
    .eq('user_id', user.user.id)
    .single();
  
  let result;
  
  if (existingSecurity) {
    // Update existing security settings
    const { data, error } = await supabase
      .from('user_security')
      .update({
        two_factor_enabled: security.two_factor_enabled,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user security settings:', error);
      return null;
    }
    
    result = data;
  } else {
    // Insert new security settings
    const { data, error } = await supabase
      .from('user_security')
      .insert({
        user_id: user.user.id,
        two_factor_enabled: security.two_factor_enabled,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user security settings:', error);
      return null;
    }
    
    result = data;
  }
  
  return result;
};

// Update user password
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Error updating password:', error);
      return false;
    }
    
    // Update password_last_changed in user_security
    const { data: user } = await supabase.auth.getUser();
    
    if (user.user) {
      // Check if security settings exist
      const { data: existingSecurity } = await supabase
        .from('user_security')
        .select('id')
        .eq('user_id', user.user.id)
        .single();
      
      if (existingSecurity) {
        await supabase
          .from('user_security')
          .update({
            password_last_changed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user.id);
      } else {
        await supabase
          .from('user_security')
          .insert({
            user_id: user.user.id,
            password_last_changed: new Date().toISOString(),
            two_factor_enabled: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
};

// Get user notification settings
export const getUserNotifications = async (): Promise<UserNotifications | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_notifications')
    .select('*')
    .eq('user_id', user.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user notification settings:', error);
    return null;
  }
  
  return data;
};

// Update user notification settings
export const updateUserNotifications = async (notifications: UserNotifications): Promise<UserNotifications | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  // Check if notification settings exist
  const { data: existingNotifications } = await supabase
    .from('user_notifications')
    .select('id')
    .eq('user_id', user.user.id)
    .single();
  
  let result;
  
  if (existingNotifications) {
    // Update existing notification settings
    const { data, error } = await supabase
      .from('user_notifications')
      .update({
        email_notifications: notifications.email_notifications,
        update_notifications: notifications.update_notifications,
        marketing_notifications: notifications.marketing_notifications,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user notification settings:', error);
      return null;
    }
    
    result = data;
  } else {
    // Insert new notification settings
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: user.user.id,
        email_notifications: notifications.email_notifications,
        update_notifications: notifications.update_notifications,
        marketing_notifications: notifications.marketing_notifications,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user notification settings:', error);
      return null;
    }
    
    result = data;
  }
  
  return result;
};

// Get user preferences
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
  
  return data;
};

// Update user preferences
export const updateUserPreferences = async (preferences: UserPreferences): Promise<UserPreferences | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return null;
  }
  
  // Check if preferences exist
  const { data: existingPreferences } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', user.user.id)
    .single();
  
  let result;
  
  if (existingPreferences) {
    // Update existing preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        language: preferences.language,
        timezone: preferences.timezone,
        // Note: We still send dark_mode to the database even though we removed it from the UI
        dark_mode: preferences.dark_mode,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
    
    result = data;
  } else {
    // Insert new preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: user.user.id,
        language: preferences.language,
        timezone: preferences.timezone,
        dark_mode: preferences.dark_mode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user preferences:', error);
      return null;
    }
    
    result = data;
  }
  
  return result;
};
