-- Drop the existing about table and recreate it with the correct structure
DROP TABLE IF EXISTS about CASCADE;

-- Recreate about table with correct structure
CREATE TABLE about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('section', 'item')) DEFAULT 'item',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- No RLS for admin operations
