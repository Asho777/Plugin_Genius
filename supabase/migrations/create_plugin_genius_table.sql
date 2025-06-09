/*
  # Create Plugin Genius Table

  1. New Tables
    - `plugin_genius`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `user_id` (uuid, references auth.users)
      - `name` (text, not null)
      - `description` (text)
      - `category` (text)
      - `version` (text)
      - `status` (text)
      - `is_featured` (boolean)
      - `download_count` (integer)
      - `rating` (numeric)
      - `icon_url` (text)
      - `repository_url` (text)
      - `documentation_url` (text)
  
  2. Security
    - Enable RLS on `plugin_genius` table
    - Add policies for authenticated users to:
      - Read all plugins
      - Create their own plugins
      - Update their own plugins
      - Delete their own plugins
*/

-- Create the plugin_genius table
CREATE TABLE IF NOT EXISTS plugin_genius (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  category text,
  version text DEFAULT '1.0.0',
  status text DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  download_count integer DEFAULT 0,
  rating numeric DEFAULT 0,
  icon_url text,
  repository_url text,
  documentation_url text
);

-- Enable Row Level Security
ALTER TABLE plugin_genius ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Allow users to read all plugins
CREATE POLICY "Anyone can read plugins"
  ON plugin_genius
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own plugins
CREATE POLICY "Users can create their own plugins"
  ON plugin_genius
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own plugins
CREATE POLICY "Users can update their own plugins"
  ON plugin_genius
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own plugins
CREATE POLICY "Users can delete their own plugins"
  ON plugin_genius
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS plugin_genius_user_id_idx ON plugin_genius (user_id);
CREATE INDEX IF NOT EXISTS plugin_genius_category_idx ON plugin_genius (category);
CREATE INDEX IF NOT EXISTS plugin_genius_is_featured_idx ON plugin_genius (is_featured);
