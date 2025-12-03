-- Disable RLS for about table to allow admin operations without Supabase auth
ALTER TABLE about DISABLE ROW LEVEL SECURITY;

-- Drop existing policies since RLS is disabled
DROP POLICY IF EXISTS "about_public_select" ON about;
DROP POLICY IF EXISTS "about_authenticated_insert" ON about;
DROP POLICY IF EXISTS "about_authenticated_update" ON about;
DROP POLICY IF EXISTS "about_authenticated_delete" ON about;
