export interface UserRole {
  id: string
  name: 'Admin' | 'Manager' | 'Editor' | 'Contributor' | 'User'
  level: number
  description: string
  created_at: string
  updated_at: string
}

export interface UserPermission {
  id: string
  name: string
  description: string
  category: 'system' | 'user_management' | 'content' | 'reporting'
  created_at: string
}

export interface RolePermission {
  id: string
  role_id: string
  permission_id: string
  created_at: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role_id: string
  api_key?: string
  created_at: string
  updated_at: string
  role?: UserRole
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile
  permissions: string[]
  roleLevel: number
}
