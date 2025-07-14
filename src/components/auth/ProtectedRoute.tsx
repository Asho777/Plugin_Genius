import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: 'Admin' | 'Manager' | 'Editor' | 'Contributor' | 'User'
  minRoleLevel?: number
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  minRoleLevel,
  fallback
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Check specific permission
  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return fallback || (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this resource.</p>
      </div>
    )
  }

  // Check specific role
  if (requiredRole && user.profile.role?.name !== requiredRole) {
    return fallback || (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>This resource requires {requiredRole} role.</p>
      </div>
    )
  }

  // Check minimum role level
  if (minRoleLevel && user.roleLevel > minRoleLevel) {
    return fallback || (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have sufficient privileges to access this resource.</p>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
