import React, { useState, useEffect } from 'react'
import { FiUsers, FiEdit, FiTrash2, FiPlus, FiShield } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { UserProfile, UserRole } from '../../types/auth'

const UserManagement = () => {
  const { user, hasPermission } = useAuth()
  const [users, setUsers] = useState<(UserProfile & { role: UserRole })[]>([])
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          role:user_roles(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('level', { ascending: true })

      if (error) throw error
      setRoles(data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const updateUserRole = async (userId: string, roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role_id: roleId })
        .eq('id', userId)

      if (error) throw error
      
      await fetchUsers() // Refresh the list
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return 'badge-admin'
      case 'Manager': return 'badge-manager'
      case 'Editor': return 'badge-editor'
      case 'Contributor': return 'badge-contributor'
      default: return 'badge-user'
    }
  }

  const canEditUser = (targetUser: UserProfile & { role: UserRole }) => {
    if (!user) return false
    
    // Admins can edit anyone
    if (user.profile.role?.name === 'Admin') return true
    
    // Users can only be edited by higher-level roles
    return user.roleLevel < targetUser.role.level
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  if (!hasPermission('users.view_all')) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view user management.</p>
      </div>
    )
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-content">
          <FiUsers className="header-icon" />
          <div>
            <h1>User Management</h1>
            <p>Manage user accounts and role assignments</p>
          </div>
        </div>
        
        {hasPermission('users.create_all') && (
          <button className="btn btn-primary">
            <FiPlus />
            Add User
          </button>
        )}
      </div>

      <div className="users-grid">
        {users.map((userProfile) => (
          <div key={userProfile.id} className="user-card">
            <div className="user-info">
              <div className="user-avatar">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{userProfile.name}</h3>
                <p>{userProfile.email}</p>
                <span className={`role-badge ${getRoleBadgeColor(userProfile.role.name)}`}>
                  <FiShield />
                  {userProfile.role.name}
                </span>
              </div>
            </div>

            <div className="user-actions">
              {canEditUser(userProfile) && (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedUser(userProfile.id)}
                  >
                    <FiEdit />
                    Edit Role
                  </button>
                  
                  {hasPermission('users.delete_all') && userProfile.id !== user?.id && (
                    <button className="btn btn-danger btn-sm">
                      <FiTrash2 />
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role Assignment Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change User Role</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <p>Select a new role for this user:</p>
              
              <div className="role-options">
                {roles.map((role) => {
                  const selectedUserData = users.find(u => u.id === selectedUser)
                  const canAssignRole = user?.roleLevel === 1 || // Admin can assign any role
                    (user && role.level > user.roleLevel) // Others can only assign lower roles
                  
                  return (
                    <button
                      key={role.id}
                      className={`role-option ${selectedUserData?.role_id === role.id ? 'active' : ''}`}
                      disabled={!canAssignRole}
                      onClick={() => updateUserRole(selectedUser, role.id)}
                    >
                      <div className="role-info">
                        <span className={`role-badge ${getRoleBadgeColor(role.name)}`}>
                          <FiShield />
                          {role.name}
                        </span>
                        <p>{role.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
