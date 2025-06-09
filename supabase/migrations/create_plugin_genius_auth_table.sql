/*
  # Create Plugin Genius Auth Table

  1. New Tables
    - `plugin_genius`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `user_id` (uuid, references auth.users)
      - `name` (text, not null)
      - `email` (text, not null)
      - `password` (text, not null) - Note: This is only for reference, actual auth is handled by Supabase Auth
      - `remember_me` (boolean)
      - `agree_to_terms` (boolean)
  
  2. Security
    - Enable RLS on `plugin_genius` table
    - Add policies for authenticated users to:
      - Read their own data
      - Create their own data
      - Update their own data
      - Delete their own data
*/

-- Create the plugin_genius table
CREATE TABLE IF NOT EXISTS plugin_genius (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text,
  email text NOT NULL,
  remember_me boolean DEFAULT false,
  agree_to_terms boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE plugin_genius ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Allow users to read only their own data
CREATE POLICY "Users can read their own data"
  ON plugin_genius
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own data
CREATE POLICY "Users can create their own data"
  ON plugin_genius
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data"
  ON plugin_genius
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own data
CREATE POLICY "Users can delete their own data"
  ON plugin_genius
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS plugin_genius_user_id_idx ON plugin_genius (user_id);
CREATE INDEX IF NOT EXISTS plugin_genius_email_idx ON plugin_genius (email);