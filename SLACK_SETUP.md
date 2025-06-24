# Slack OAuth Setup Guide for Textual Garden Forge

## Quick Setup Steps

### 1. Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From Scratch"
3. Name: "Textual Garden Forge" (or your preferred name)
4. Select your workspace
5. Click "Create App"

### 2. Configure OAuth & Permissions
1. In the left sidebar, click "OAuth & Permissions"
2. Under "Redirect URLs", add:
   ```
   https://liaafawutjhfqvqtqtpm.supabase.co/auth/v1/callback
   ```
3. Under "Scopes" → "User Token Scopes", add:
   - `users:read`
   - `users:read.email`
   - `openid`
   - `profile`
   - `email`

### 3. Get Your Credentials
1. Go to "Basic Information" in the left sidebar
2. Under "App Credentials", copy:
   - **Client ID**: (starts with numbers.letters)
   - **Client Secret**: (32 character string)

### 4. Configure Supabase
1. Go to https://supabase.com/dashboard/project/liaafawutjhfqvqtqtpm/auth/providers
2. Find "Slack (OIDC)" and enable it
3. Enter your Client ID and Client Secret from step 3
4. Save

### 5. Environment Variables
Create a `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://liaafawutjhfqvqtqtpm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpYWFmYXd1dGpoZnF2cXRxdHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDI5NTYsImV4cCI6MjA2NjMxODk1Nn0.qUBCrMdTIKUSmSIPhLVOBNycYx8dOAUZZEPv9HO32-g

# Optional: Restrict to specific Slack workspace
NEXT_PUBLIC_SLACK_TEAM_ID=your-team-id-here
```

### 6. Team Access Control

The app uses a whitelist system. Current allowed emails:
- instabidssystem@gmail.com (admin)
- ah.foroughi98@gmail.com
- achaudhary.chaudhary9@gmail.com
- jayprajapati0805@gmail.com

To add more team members, run this SQL in Supabase SQL editor:
```sql
INSERT INTO public.whitelist (email, allowed) 
VALUES ('new-email@example.com', true);
```

### 7. Make Yourself Admin
Run this SQL to make yourself an admin:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Testing the Setup

1. Run your app locally:
   ```bash
   npm install
   npm run dev
   ```

2. Go to http://localhost:3000
3. Click "Sign in with Slack"
4. You should be redirected to Slack OAuth
5. After authorization, you'll be logged in!

## Troubleshooting

### "Access denied" error
- Check if your email is in the whitelist table
- Verify you're using the correct Slack workspace

### OAuth redirect error
- Ensure the redirect URL in Slack app matches exactly
- Check that Supabase Slack provider is enabled

### Can't see data
- Check RLS policies are correct
- Verify your user ID matches the data owner

## Security Notes

1. The app restricts access to whitelisted emails only
2. Each user can only see/edit their own pages
3. Only admins can modify the whitelist
4. All data is encrypted in transit

## Next Steps

Once working:
1. Deploy to Vercel/Netlify
2. Update redirect URL in Slack app to production URL
3. Add more team members to whitelist
4. Start creating your knowledge base!
