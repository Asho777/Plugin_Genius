/*
  # Create Storage Bucket for User Content

  1. Storage Setup
    - Create user-content bucket for avatars and files
    - Set proper public access and file restrictions
    - Configure RLS policies for storage objects

  2. Security
    - Enable RLS on storage objects
    - Add policies for authenticated users to manage their content
    - Allow public read access to user content

  3. File Management
    - Set file size limit to 10MB
    - Allow common image formats (JPEG, PNG, WebP, GIF)
*/

-- Create the user-content bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-content',
  'user-content', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload to user-content bucket
CREATE POLICY "Users can upload to user-content bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-content');

-- Policy: Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'user-content');

-- Policy: Allow authenticated users to delete their own files  
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'user-content');

-- Policy: Allow public read access to user-content
CREATE POLICY "Public can view user-content"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-content');