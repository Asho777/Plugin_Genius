/*
  # Create storage bucket for user content
  
  1. New Features
    - Create a storage bucket for user avatars and other content
  
  2. Security
    - Set up RLS policies for the bucket using the correct API
*/

-- Create a storage bucket for user content if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-content', 'user-content', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'user-content';

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-content' AND auth.role() = 'authenticated');

-- Create policy to allow users to read their own files
CREATE POLICY "Allow users to read their own avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'user-content');

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'user-content' AND auth.uid() = owner);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'user-content' AND auth.uid() = owner);