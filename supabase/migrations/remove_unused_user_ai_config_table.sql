/*
# Remove unused user_ai_config table

1. Changes
  - Drop the unused `user_ai_config` table
  - This table was created but never used since API keys are stored in user_profiles instead

2. Notes
  - API keys are now properly stored in the user_profiles table
  - This cleanup removes unnecessary database objects
  - No data loss since the table was not being used
*/

DROP TABLE IF EXISTS user_ai_config;