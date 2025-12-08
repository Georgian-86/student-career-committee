-- SCC Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  gallery_images TEXT[],
  attendees INTEGER,
  outcome TEXT,
  guest_feedback TEXT,
  student_feedback TEXT,
  guests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT,
  github TEXT,
  demo TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create about table
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('section', 'item')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_about_created_at ON about(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for frontend)
CREATE POLICY "Team members are publicly viewable" ON team_members
    FOR SELECT USING (true);

CREATE POLICY "Events are publicly viewable" ON events
    FOR SELECT USING (true);

CREATE POLICY "Projects are publicly viewable" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Gallery images are publicly viewable" ON gallery
    FOR SELECT USING (true);

CREATE POLICY "Announcements are publicly viewable" ON announcements
    FOR SELECT USING (true);

CREATE POLICY "About items are publicly viewable" ON about
    FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Authenticated users can manage team members" ON team_members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage events" ON events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage gallery" ON gallery
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage announcements" ON announcements
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage about" ON about
    FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Images are publicly viewable" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant storage permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
