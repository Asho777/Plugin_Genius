/*
  # Fix Avatar Storage Configuration

  1. Storage Setup
    - Create avatars bucket if it doesn't exist
    - Set proper public access policies
    - Configure CORS settings

  2. Security
    - Enable RLS on storage objects
    - Add policies for authenticated users to upload/read their avatars
    - Ensure proper file access controls

  3. File Management
    - Set up proper file naming conventions
    - Add file size and type restrictions
*/

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow public read access to avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
