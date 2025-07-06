/*
  # Create user AI configuration table

  1. New Tables
    - `user_ai_config`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, AI model name)
      - `api_endpoint` (text, API endpoint URL)
      - `api_key` (text, encrypted API key)
      - `model` (text, model identifier)
      - `headers` (jsonb, optional headers)
      - `system_prompt` (text, system prompt)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_ai_config` table
    - Add policy for authenticated users to manage their own AI config
    - Users can only access their own AI configuration

  3. Indexes
    - Index on user_id for fast lookups
    - Unique constraint on user_id (one config per user)
*/

CREATE TABLE IF NOT EXISTS user_ai_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT 'Custom AI Model',
  api_endpoint text NOT NULL,
  api_key text NOT NULL,
  model text NOT NULL,
  headers jsonb DEFAULT NULL,
  system_prompt text DEFAULT 'You are a WordPress plugin development expert. Help the user create high-quality, secure, and efficient WordPress plugins.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_ai_config ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_ai_config_user_id ON user_ai_config(user_id);

-- RLS Policies
CREATE POLICY "Users can view own AI config"
  ON user_ai_config
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI config"
  ON user_ai_config
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI config"
  ON user_ai_config
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI config"
  ON user_ai_config
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
