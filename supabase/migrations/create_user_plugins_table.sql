/*
# Create user plugins table

1. New Tables
  - `user_plugins`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to auth.users)
    - `plugin_id` (text, the plugin identifier)
    - `plugin_name` (text)
    - `plugin_description` (text)
    - `plugin_author` (text)
    - `plugin_image_url` (text)
    - `plugin_detail_url` (text)
    - `plugin_rating` (numeric)
    - `plugin_downloads` (integer)
    - `plugin_last_updated` (text)
    - `plugin_tags` (jsonb, array of tags)
    - `created_at` (timestamp)

2. Security
  - Enable RLS on `user_plugins` table
  - Add policy for authenticated users to manage their own plugins only

3. Changes
  - Users can now save plugins to their personal collection
  - Each user's plugins are completely isolated from other users
*/

CREATE TABLE IF NOT EXISTS user_plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plugin_id text NOT NULL,
  plugin_name text NOT NULL,
  plugin_description text,
  plugin_author text,
  plugin_image_url text,
  plugin_detail_url text,
  plugin_rating numeric DEFAULT 0,
  plugin_downloads integer DEFAULT 0,
  plugin_last_updated text,
  plugin_tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plugin_id)
);

ALTER TABLE user_plugins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own plugins"
  ON user_plugins
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
