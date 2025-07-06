/*
  # Create Profile Images Table and Functions

  1. New Tables
    - `profile_images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `image_url` (text, full URL to the image)
      - `storage_path` (text, path in storage bucket)
      - `file_name` (text, original file name)
      - `file_size` (integer, file size in bytes)
      - `mime_type` (text, image MIME type)
      - `is_active` (boolean, current profile image)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Functions
    - Function to automatically update user_profiles.avatar_url when new profile image is set
    - Function to deactivate old profile images when new one is uploaded

  3. Security
    - Enable RLS on `profile_images` table
    - Add policies for authenticated users to manage their own profile images
    - Users can only access their own profile image data

  4. Triggers
    - Auto-update user_profiles.avatar_url when profile image changes
    - Auto-deactivate old profile images when new one is set as active
*/

-- Create profile_images table
CREATE TABLE IF NOT EXISTS profile_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  mime_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_images_user_id ON profile_images(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_images_active ON profile_images(user_id, is_active) WHERE is_active = true;

-- RLS Policies for profile_images
CREATE POLICY "Users can view own profile images"
  ON profile_images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile images"
  ON profile_images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile images"
  ON profile_images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile images"
  ON profile_images
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to deactivate old profile images when a new one is set as active
CREATE OR REPLACE FUNCTION deactivate_old_profile_images()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated image is set as active, deactivate all other images for this user
  IF NEW.is_active = true THEN
    UPDATE profile_images 
    SET is_active = false, updated_at = now()
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update user_profiles.avatar_url when profile image changes
CREATE OR REPLACE FUNCTION update_user_profile_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_profiles.avatar_url with the new active image
  IF NEW.is_active = true THEN
    UPDATE user_profiles 
    SET avatar_url = NEW.image_url, updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  -- If image is being deactivated, check if there are other active images
  IF OLD.is_active = true AND NEW.is_active = false THEN
    -- Set avatar_url to the most recent active image, or null if none
    UPDATE user_profiles 
    SET avatar_url = COALESCE(
      (SELECT image_url FROM profile_images 
       WHERE user_id = NEW.user_id AND is_active = true 
       ORDER BY created_at DESC LIMIT 1), 
      NULL
    ), updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up user_profiles.avatar_url when profile image is deleted
CREATE OR REPLACE FUNCTION cleanup_user_profile_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- If the deleted image was active, update user_profiles.avatar_url
  IF OLD.is_active = true THEN
    UPDATE user_profiles 
    SET avatar_url = COALESCE(
      (SELECT image_url FROM profile_images 
       WHERE user_id = OLD.user_id AND is_active = true 
       ORDER BY created_at DESC LIMIT 1), 
      NULL
    ), updated_at = now()
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_deactivate_old_profile_images
  BEFORE INSERT OR UPDATE ON profile_images
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_old_profile_images();

CREATE TRIGGER trigger_update_user_profile_avatar
  AFTER INSERT OR UPDATE ON profile_images
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_avatar();

CREATE TRIGGER trigger_cleanup_user_profile_avatar
  AFTER DELETE ON profile_images
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_profile_avatar();

-- Create a view for easy access to active profile images
CREATE OR REPLACE VIEW active_profile_images AS
SELECT 
  pi.id,
  pi.user_id,
  pi.image_url,
  pi.storage_path,
  pi.file_name,
  pi.file_size,
  pi.mime_type,
  pi.created_at,
  pi.updated_at,
  up.full_name,
  up.email
FROM profile_images pi
JOIN user_profiles up ON pi.user_id = up.user_id
WHERE pi.is_active = true;

-- Grant access to the view
GRANT SELECT ON active_profile_images TO authenticated;

-- Add RLS to the view
ALTER VIEW active_profile_images SET (security_invoker = true);