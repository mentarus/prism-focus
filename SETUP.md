# Prism Focus Setup Guide

Welcome to Prism Focus! This guide will help you get the application up and running.

## Current Status

✅ Next.js project initialized
✅ All dependencies installed
✅ Supabase clients configured
✅ Authentication flow (magic link) created
✅ Database migrations created
✅ Layout components built
✅ Core pages created (Dashboard, Founders, Companies)
✅ YC-inspired design system implemented

## Next Steps

### 1. Run Database Migrations

You need to run the SQL migrations to create the database tables. You have two options:

**Option A: Using Supabase Dashboard (Recommended for first time)**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - Copy content from `supabase/migrations/20260204000001_create_profiles.sql`
   - Paste and run it in SQL Editor
   - Repeat for `20260204000002_create_companies.sql`
   - Repeat for `20260204000003_create_posts.sql`

**Option B: Using Supabase CLI**

```bash
npx supabase db push
```

### 2. Configure Email Templates (Optional but Recommended)

For the magic link authentication to work properly:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize the "Magic Link" template to match your branding
3. Make sure the redirect URL is set correctly

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 4. Test the Flow

1. Visit [http://localhost:3000](http://localhost:3000) (redirects to login)
2. Enter your email
3. Check your email for the magic link
4. Click the link to log in
5. You should be redirected to the dashboard

## Project Structure

```
src/
├── app/
│   ├── login/              # Magic link login page
│   ├── auth/callback/      # OAuth callback handler
│   ├── dashboard/          # Community board
│   ├── founders/           # Founder directory
│   ├── companies/          # Company directory
│   ├── layout.tsx          # Root layout with sidebar
│   └── providers.tsx       # React Query provider
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/
│   │   └── sidebar.tsx     # Main navigation
│   ├── posts/
│   │   └── post-card.tsx   # Post component
│   └── founders/
│       └── founder-card.tsx # Founder component
├── hooks/
│   ├── use-posts.ts        # Posts data fetching
│   ├── use-founders.ts     # Founders data fetching
│   └── use-companies.ts    # Companies data fetching
└── lib/
    ├── supabase/
    │   ├── client.ts       # Browser client
    │   └── server.ts       # Server client
    └── utils.ts            # Utility functions
```

## Features Implemented

### ✅ Authentication
- Magic link (passwordless) authentication
- Automatic profile creation on signup
- Protected routes via middleware

### ✅ Community Board
- View posts by category
- Post creation (UI ready, backend connected)
- View counts and engagement metrics

### ✅ Founder Directory
- Searchable list of all founders
- Profile cards with bio, interests, social links
- Location and headline display

### ✅ Company Directory
- Searchable list of all companies
- Company cards with description, tags, founders
- Logo display

### ✅ Design System
- YC-inspired clean aesthetic
- Inter font family
- Tailwind CSS with custom colors
- shadcn/ui components

## Known Issues / TODOs

### Immediate
- [ ] Need seed data for testing (sample founders, companies, posts)
- [ ] Post creation modal not implemented (button shows but no form)
- [ ] No profile detail pages yet (founder/company detail views)
- [ ] Comments and reactions not functional yet

### Future Enhancements
- [ ] Direct messaging between founders
- [ ] Rich text editor for posts
- [ ] Advanced search filters
- [ ] Notifications system
- [ ] Admin dashboard
- [ ] OAuth providers (Google, LinkedIn)

## Adding Seed Data

To test the application, you'll need to add some data. Here's how:

### Add a Test Company

```sql
INSERT INTO public.companies (slug, name, tagline, description, location, team_size, tags)
VALUES (
  'test-company',
  'Test Company',
  'Building something amazing',
  'We are building a platform to help LGBTQ+ founders connect and grow.',
  'San Francisco, CA',
  '1-10',
  ARRAY['SaaS', 'B2B', 'Community']
);
```

### Link Your Profile to a Company

After you create your account and get your user ID:

```sql
INSERT INTO public.company_founders (company_id, founder_id, role, is_primary)
VALUES (
  (SELECT id FROM public.companies WHERE slug = 'test-company'),
  'your-user-id-here',
  'Co-founder & CEO',
  true
);
```

### Create a Test Post

```sql
INSERT INTO public.posts (author_id, category, content)
VALUES (
  'your-user-id-here',
  'general',
  'Hello Prism Focus! Excited to be here and connect with fellow LGBTQ+ founders. 🏳️‍🌈'
);
```

## Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

Ready to deploy? Here's what you need to do:

1. **Deploy to Vercel** (recommended):
   ```bash
   vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production domain)

3. **Update Supabase settings**:
   - Add your production URL to "Redirect URLs" in Authentication settings
   - Update site URL in Authentication settings

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure database migrations ran successfully

## Next Development Steps

1. **Complete Profile Pages**: Build founder and company detail pages
2. **Post Creation Modal**: Implement the post creation form
3. **Comments System**: Add comment functionality to posts
4. **Profile Editing**: Allow users to edit their profiles
5. **Company Management**: Allow founders to create/edit companies
6. **Search Improvements**: Add filters for location, interests, etc.

---

Built with Next.js, Supabase, and ❤️ for the LGBTQ+ founder community.
