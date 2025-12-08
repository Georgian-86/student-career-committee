# SCC Project Deployment Guide

## Deploy to Supabase

### Prerequisites
- Supabase account
- Node.js 18+ installed
- Git installed

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Initialize Supabase Project
```bash
supabase init
supabase link --project-ref <your-project-ref>
```

### Step 4: Deploy Database Schema
```bash
supabase db push
```

### Step 5: Deploy Functions
```bash
supabase functions deploy
```

### Step 6: Deploy Auth Configuration
```bash
supabase auth deploy
```

### Step 7: Deploy Storage
```bash
supabase storage deploy
```

### Step 8: Configure Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 9: Build the Project
```bash
npm run build
```

### Step 10: Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Alternative: Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

### Step 11: Configure Custom Domain
In Supabase dashboard:
1. Go to Settings → Authentication
2. Add your deployed URL to Site URL
3. Configure redirect URLs

### Step 12: Test the Deployment
1. Visit your deployed site
2. Test all functionality
3. Check admin panel access
4. Verify database connections

### Troubleshooting
- Clear browser cache if issues persist
- Check environment variables
- Verify Supabase project settings
- Check deployment logs

### Notes
- Supabase hosting is for backend/database only
- Frontend should be deployed to Vercel/Netlify
- Update middleware.ts with production URLs
- Test all admin functions post-deployment
