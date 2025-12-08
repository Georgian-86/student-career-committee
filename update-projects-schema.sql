-- Update projects table schema
-- Run this in your Supabase SQL Editor

-- Add missing columns if they don't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS technologies TEXT;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS github TEXT;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS demo TEXT;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;
