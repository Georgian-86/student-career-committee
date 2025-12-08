-- Fix announcements table schema
-- Run this in your Supabase SQL Editor

-- Add missing category column if it doesn't exist
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';

-- Add missing date column if it doesn't exist
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add missing image_url column if it doesn't exist
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update any existing announcements to have default values
UPDATE announcements 
SET category = 'General' 
WHERE category IS NULL;

UPDATE announcements 
SET date = to_char(created_at, 'YYYY-MM-DD') 
WHERE date IS NULL;
