/*
  # Create user_plugins table
  
  1. New Tables
    - `user_plugins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plugin_id` (text, plugin identifier)
      - `plugin_data` (jsonb, full plugin data)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `user_plugins` table
    - Add policies for authenticated users to manage their own plugins
*/

-- Create the user_plugins table
CREATE TABLE IF NOT EXISTS user_plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plugin_id text NOT NULL,
  plugin_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plugin_id)
);

-- Enable Row Level Security
ALTER TABLE user_plugins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own plugins"
  ON user_plugins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plugins"
  ON user_plugins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plugins"
  ON user_plugins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plugins"
  ON user_plugins
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_plugins_user_id_idx ON user_plugins (user_id);