/*
# Create User Roles and Permissions System - Final Version

1. New Tables
  - `user_roles` - Defines the 5 hierarchical user roles
  - `user_permissions` - Specific permissions that can be assigned
  - `role_permissions` - Links roles to their permissions
  - Updates to `user_profiles` - Add role assignment

2. User Role Hierarchy (highest to lowest authority)
  - Admin (level 1): Complete system control, all permissions
  - Manager (level 2): Department oversight, user management within scope
  - Editor (level 3): Content creation/editing, data management
  - Contributor (level 4): Content creation with approval workflow
  - User (level 5): Read-only access, basic features only

3. Security
  - Enable RLS on all new tables
  - Hierarchical permission inheritance (higher levels inherit lower level capabilities)
  - Policies ensure users can only access appropriate data based on their role level

4. Key Features
  - Role hierarchy with numeric levels for easy comparison
  - Comprehensive permission system covering all app functions
  - Default role assignment (User) for new registrations
  - Admin-only role management capabilities
*/

-- Create user roles table with hierarchy FIRST
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  level integer UNIQUE NOT NULL, -- 1=Admin, 2=Manager, 3=Editor, 4=Contributor, 5=User
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert the 5 user roles IMMEDIATELY after table creation
INSERT INTO user_roles (name, level, description) VALUES
  ('Admin', 1, 'Super User with complete control over the application. Full system privileges including user management, system configuration, and database access.'),
  ('Manager', 2, 'Elevated permissions for department oversight. Can manage users within scope, access advanced reporting, and modify content in designated areas.'),
  ('Editor', 3, 'Content creation and editing capabilities. Can manage data entries, modify records, and access content management features with approval workflows.'),
  ('Contributor', 4, 'Limited content creation requiring approval. Can submit content and view relevant data but cannot modify system settings or manage users.'),
  ('User', 5, 'Basic read-only access with minimal interaction capabilities. Can view content and use basic features but cannot create, edit, or delete content.')
ON CONFLICT (name) DO NOTHING;

-- NOW add role_id to user_profiles (after user_roles exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role_id uuid REFERENCES user_roles(id);
  END IF;
END $$;

-- Create permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL, -- 'system', 'user_management', 'content', 'reporting'
  created_at timestamptz DEFAULT now()
);

-- Create role-permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES user_roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES user_permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Insert comprehensive permissions
INSERT INTO user_permissions (name, description, category) VALUES
  -- System permissions (Admin only)
  ('system.full_access', 'Complete system control and configuration', 'system'),
  ('system.database_management', 'Database backup, restore, and maintenance', 'system'),
  ('system.security_settings', 'Manage security configurations and settings', 'system'),
  ('system.application_settings', 'Modify application-wide settings and configurations', 'system'),
  ('system.plugin_core_modify', 'Modify Plugin Genius core functionality', 'system'),
  
  -- User management permissions
  ('users.create_all', 'Create user accounts at any level', 'user_management'),
  ('users.edit_all', 'Edit any user account and permissions', 'user_management'),
  ('users.delete_all', 'Delete any user account', 'user_management'),
  ('users.create_subordinate', 'Create user accounts at lower levels only', 'user_management'),
  ('users.edit_subordinate', 'Edit subordinate user accounts only', 'user_management'),
  ('users.view_all', 'View all user accounts and details', 'user_management'),
  ('users.assign_roles', 'Assign and modify user roles', 'user_management'),
  
  -- Content management permissions
  ('content.create', 'Create new content and data entries', 'content'),
  ('content.edit_all', 'Edit any content or data entry', 'content'),
  ('content.edit_own', 'Edit only own content and submissions', 'content'),
  ('content.delete_all', 'Delete any content or data entry', 'content'),
  ('content.delete_own', 'Delete only own content', 'content'),
  ('content.publish', 'Publish content without approval', 'content'),
  ('content.approve', 'Approve content submitted by others', 'content'),
  ('content.submit', 'Submit content for approval', 'content'),
  
  -- Reporting and analytics permissions
  ('reports.view_all', 'Access all reports and analytics', 'reporting'),
  ('reports.view_department', 'View reports for assigned department/area', 'reporting'),
  ('reports.view_own', 'View reports related to own work only', 'reporting'),
  ('reports.export', 'Export reports and data', 'reporting'),
  
  -- Basic access permissions
  ('app.basic_access', 'Basic application access and navigation', 'system'),
  ('profile.edit_own', 'Edit own profile information', 'system'),
  ('app.view_content', 'View published content and information', 'content')
ON CONFLICT (name) DO NOTHING;

-- Admin (Level 1) - All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM user_roles WHERE name = 'Admin'),
  up.id
FROM user_permissions up
ON CONFLICT DO NOTHING;

-- Manager (Level 2) - All except system-level permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM user_roles WHERE name = 'Manager'),
  up.id
FROM user_permissions up
WHERE up.name NOT IN (
  'system.full_access',
  'system.database_management', 
  'system.security_settings',
  'system.application_settings',
  'system.plugin_core_modify'
)
ON CONFLICT DO NOTHING;

-- Editor (Level 3) - Content and reporting permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM user_roles WHERE name = 'Editor'),
  up.id
FROM user_permissions up
WHERE up.name IN (
  'content.create',
  'content.edit_all',
  'content.edit_own',
  'content.delete_own',
  'content.publish',
  'content.approve',
  'reports.view_department',
  'reports.view_own',
  'reports.export',
  'app.basic_access',
  'profile.edit_own',
  'app.view_content'
)
ON CONFLICT DO NOTHING;

-- Contributor (Level 4) - Limited content creation
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM user_roles WHERE name = 'Contributor'),
  up.id
FROM user_permissions up
WHERE up.name IN (
  'content.create',
  'content.edit_own',
  'content.delete_own',
  'content.submit',
  'reports.view_own',
  'app.basic_access',
  'profile.edit_own',
  'app.view_content'
)
ON CONFLICT DO NOTHING;

-- User (Level 5) - Basic read-only access
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM user_roles WHERE name = 'User'),
  up.id
FROM user_permissions up
WHERE up.name IN (
  'app.basic_access',
  'profile.edit_own',
  'app.view_content'
)
ON CONFLICT DO NOTHING;

-- Set default role for existing users (User level)
UPDATE user_profiles 
SET role_id = (SELECT id FROM user_roles WHERE name = 'User')
WHERE role_id IS NULL;

-- RLS Policies (with existence checks)

-- user_roles policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Anyone can view roles'
  ) THEN
    CREATE POLICY "Anyone can view roles"
      ON user_roles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- user_permissions policies  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_permissions' AND policyname = 'Anyone can view permissions'
  ) THEN
    CREATE POLICY "Anyone can view permissions"
      ON user_permissions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- role_permissions policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'role_permissions' AND policyname = 'Anyone can view role permissions'
  ) THEN
    CREATE POLICY "Anyone can view role permissions"
      ON role_permissions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Update user_profiles policies for role management
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Admins can manage all user roles'
  ) THEN
    CREATE POLICY "Admins can manage all user roles"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles up
          JOIN user_roles ur ON up.role_id = ur.id
          WHERE up.id = auth.uid() AND ur.name = 'Admin'
        )
      );
  END IF;
END $$;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(user_id uuid, permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_permission boolean := false;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles up
    JOIN user_roles ur ON up.role_id = ur.id
    JOIN role_permissions rp ON ur.id = rp.role_id
    JOIN user_permissions perm ON rp.permission_id = perm.id
    WHERE up.id = user_id AND perm.name = permission_name
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$$;

-- Function to get user role level
CREATE OR REPLACE FUNCTION get_user_role_level(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_level integer := 5; -- Default to User level
BEGIN
  SELECT ur.level
  FROM user_profiles up
  JOIN user_roles ur ON up.role_id = ur.id
  WHERE up.id = user_id
  INTO role_level;
  
  RETURN COALESCE(role_level, 5);
END;
$$;

-- Function to check if user can manage another user (hierarchical check)
CREATE OR REPLACE FUNCTION can_manage_user(manager_id uuid, target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  manager_level integer;
  target_level integer;
BEGIN
  -- Get manager's role level
  SELECT get_user_role_level(manager_id) INTO manager_level;
  
  -- Get target user's role level
  SELECT get_user_role_level(target_user_id) INTO target_level;
  
  -- Manager can only manage users at lower levels (higher numbers)
  RETURN manager_level < target_level;
END;
$$;