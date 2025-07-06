/*
  # Create Generated Plugins Table

  1. New Tables
    - `generated_plugins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, plugin name)
      - `description` (text, plugin description)
      - `category` (text, plugin category)
      - `features` (jsonb, array of features)
      - `code` (text, generated plugin code)
      - `version` (text, plugin version)
      - `status` (text, generation status)
      - `download_count` (integer, number of downloads)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `generated_plugins` table
    - Add policy for authenticated users to manage their own plugins
    - Users can only access their own generated plugins

  3. Indexes
    - Index on user_id for fast lookups
    - Index on category for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS generated_plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  features jsonb DEFAULT '[]'::jsonb,
  code text NOT NULL DEFAULT '',
  version text DEFAULT '1.0.0',
  status text DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'error')),
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_plugins ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generated_plugins_user_id ON generated_plugins(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_plugins_category ON generated_plugins(category);
CREATE INDEX IF NOT EXISTS idx_generated_plugins_created_at ON generated_plugins(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can view own plugins"
  ON generated_plugins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plugins"
  ON generated_plugins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plugins"
  ON generated_plugins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own plugins"
  ON generated_plugins
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);