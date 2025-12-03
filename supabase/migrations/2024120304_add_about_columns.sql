-- Add missing columns to about table
ALTER TABLE about 
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'item' CHECK (type IN ('section', 'item')),
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update any existing records to have default values
UPDATE about SET 
  title = COALESCE(title, ''),
  description = COALESCE(description, ''),
  type = COALESCE(type, 'item'),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE title IS NULL OR description IS NULL OR type IS NULL;
