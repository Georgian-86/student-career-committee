-- Add new fields to events table
-- Run this in your Supabase SQL Editor

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS attendees INTEGER,
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS guest_feedback TEXT,
ADD COLUMN IF NOT EXISTS student_feedback TEXT,
ADD COLUMN IF NOT EXISTS guests TEXT[],
ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[];
