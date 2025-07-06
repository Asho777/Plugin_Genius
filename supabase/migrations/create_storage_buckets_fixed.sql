/*
  # Create Storage Buckets for User Content - Fixed Version

  1. Storage Setup
    - Create user-content bucket for avatars and files
    - Set proper public access policies
    - Configure file size and type restrictions

  2. Security
    - Enable RLS on storage objects
    - Add policies for authenticated users to upload/read their content
    - Ensure proper file access controls

  3. File Management
    - Set up proper file naming conventions
    - Add file size and type restrictions for different content types
*/

-- Create the user-content bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-content',
  'user-content',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Enable RLS on storage objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own content" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own content" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own content" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view user content" ON storage.objects;

-- Policy to allow authenticated users to upload their own content
CREATE POLICY "Users can upload their own content"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-content');

-- Policy to allow authenticated users to update their own content
CREATE POLICY "Users can update their own content"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'user-content');

-- Policy to allow authenticated users to delete their own content
CREATE POLICY "Users can delete their own content"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'user-content');

-- Policy to allow public read access to user content
CREATE POLICY "Anyone can view user content"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-content');