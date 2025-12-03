# SCC Supabase Database Setup Guide

This guide will help you set up the Supabase database and storage for the Student Career Committee application.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Your Supabase project URL and anon key

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with your GitHub account
4. Create a new organization if you don't have one
5. Create a new project:
   - Project name: `scc-database`
   - Database password: Generate a strong password
   - Region: Choose your closest region
   - Click "Create new project"

## Step 2: Run SQL Setup Script

1. Once your project is ready, go to the **SQL Editor** in the Supabase dashboard
2. Click "New query"
3. Copy the contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the script

This will create:
- All necessary tables (team_members, events, projects, gallery, announcements, about)
- Row Level Security (RLS) policies
- Storage bucket for images
- Triggers for automatic timestamp updates
- Indexes for better performance

## Step 3: Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in:
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon/public

## Step 4: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin dashboard: `http://localhost:3000/admin`
3. Login with demo credentials: `admin@scc.com` / `admin123`
4. Try adding a team member to test the database connection

## Step 5: Verify Tables

You can verify that everything is working by:

1. Go to **Table Editor** in Supabase dashboard
2. You should see all tables created:
   - `team_members`
   - `events` 
   - `projects`
   - `gallery`
   - `announcements`
   - `about`
   - `messages` (if you had this already)

3. Check the **Storage** section:
   - You should see an `images` bucket

## Database Schema Overview

### Tables

#### team_members
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `role` (TEXT, Required)
- `department` (TEXT, Required)
- `email` (TEXT, Required)
- `linkedin` (TEXT, Optional)
- `image_url` (TEXT, Optional)
- `description` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### events
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `date` (TEXT, Required)
- `location` (TEXT, Required)
- `description` (TEXT, Required)
- `category` (TEXT, Required)
- `image_url` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### projects
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `description` (TEXT, Required)
- `technologies` (TEXT, Optional)
- `github` (TEXT, Optional)
- `demo` (TEXT, Optional)
- `image_url` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### gallery
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `image` (TEXT, Required)
- `category` (TEXT, Required)
- `description` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### announcements
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `content` (TEXT, Required)
- `category` (TEXT, Required)
- `date` (TEXT, Required)
- `image_url` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### about
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `description` (TEXT, Required)
- `type` (TEXT, Required: 'section' or 'item')
- `image_url` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Storage

#### images bucket
- Public bucket for storing all uploaded images
- Organized by folder:
  - `team/` - Team member photos
  - `events/` - Event images
  - `projects/` - Project screenshots
  - `gallery/` - Gallery images
  - `announcements/` - Announcement images

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Public Read Access**: Anyone can view data (for frontend display)
- **Authenticated Write Access**: Only authenticated users can modify data
- **Storage Policies**: Public read access to images, authenticated write access

## Migration from LocalStorage

The application has been updated to use Supabase instead of localStorage:

### What's Changed:
- **Team Manager**: Now stores data in `team_members` table
- **Events Manager**: Now stores data in `events` table
- **Projects Manager**: Now stores data in `projects` table
- **Gallery Manager**: Now stores data in `gallery` table
- **Announcements Manager**: Now stores data in `announcements` table
- **About Manager**: Now stores data in `about` table
- **Messages Manager**: Already using Supabase `messages` table

### Benefits:
- **Persistent Data**: Data is stored in a real database
- **Multi-device Sync**: Changes are reflected across all devices
- **Backup**: Automatic backups by Supabase
- **Scalability**: Can handle multiple users simultaneously
- **Real-time Updates**: Changes appear instantly (with additional setup)

## Troubleshooting

### Common Issues:

1. **"Database relation does not exist"**
   - Make sure you ran the SQL setup script
   - Check that all tables were created in the Table Editor

2. **"Permission denied for relation"**
   - Check your RLS policies
   - Make sure you're authenticated when trying to write data

3. **"Storage bucket does not exist"**
   - Run the SQL script again or create the bucket manually
   - Check that the bucket name is exactly `images`

4. **"CORS policy error"**
   - Make sure your Supabase URL is correct in `.env.local`
   - Check that you're using the anon key, not the service role key

5. **Images not uploading**
   - Check that the storage bucket exists
   - Verify storage policies are correctly set
   - Check browser console for specific error messages

### Debug Steps:

1. Check browser console for error messages
2. Verify Supabase connection in Network tab
3. Test SQL queries directly in Supabase SQL Editor
4. Check RLS policies in Authentication section

## Next Steps

Once everything is working:

1. **Test all admin functions**: Create, read, update, delete for each module
2. **Test public pages**: Verify data displays correctly on frontend
3. **Test image uploads**: Upload and display images
4. **Set up authentication**: Replace demo auth with real Supabase Auth
5. **Enable real-time subscriptions**: For live updates across devices

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the error messages in browser console
3. Verify your SQL script executed successfully
4. Check that environment variables are correctly set

Remember: The demo authentication uses hardcoded credentials. For production, you should implement proper Supabase Authentication.
