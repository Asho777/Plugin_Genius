import { useState, useEffect, createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthUser, UserProfile, UserRole } from '../types/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  canManageUser: (targetUserId: string) => boolean
  isAdmin: () => boolean
  isManagerOrAbove: () => boolean
  isEditorOrAbove: () => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (authUser: User): Promise<AuthUser | null> => {
    try {
      // Get user profile with role information
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          role:user_roles(*)
        `)
        .eq('id', authUser.id)
        .single()

      if (profileError) throw profileError

      // Get user permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          user_permissions(name)
        `)
        .eq('role_id', profile.role_id)

      if (permissionsError) throw permissionsError

      const userPermissions = permissions?.map(p => p.user_permissions.name) || []

      return {
        id: authUser.id,
        email: authUser.email!,
        profile: profile as UserProfile & { role: UserRole },
        permissions: userPermissions,
        roleLevel: profile.role?.level || 5
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const userProfile = await fetchUserProfile(authUser)
      setUser(userProfile)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user)
        setUser(userProfile)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user)
          setUser(userProfile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const canManageUser = async (targetUserId: string): Promise<boolean> => {
    if (!user) return false
    
    try {
      const { data, error } = await supabase
        .rpc('can_manage_user', {
          manager_id: user.id,
          target_user_id: targetUserId
        })
      
      return !error && data === true
    } catch {
      return false
    }
  }

  const isAdmin = (): boolean => {
    return user?.profile.role?.name === 'Admin'
  }

  const isManagerOrAbove = (): boolean => {
    return user ? user.roleLevel <= 2 : false
  }

  const isEditorOrAbove = (): boolean => {
    return user ? user.roleLevel <= 3 : false
  }

  return {
    user,
    loading,
    signOut,
    hasPermission,
    canManageUser: (targetUserId: string) => canManageUser(targetUserId),
    isAdmin,
    isManagerOrAbove,
    isEditorOrAbove,
    refreshUser
  }
}

export { AuthContext }
