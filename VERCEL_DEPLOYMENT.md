# 🚀 Deploy to Vercel Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Your code should be in a Git repository
3. **Supabase Project**: Your Supabase project should be set up and ready

## 🔧 Step 1: Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 🔧 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure the project:**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install --legacy-peer-deps` (should auto-detect)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## 🔧 Step 3: Configure Environment Variables

**IMPORTANT**: You must set these environment variables in your Vercel project:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add these variables:**

### Required Variables:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables:
```
NODE_ENV=production
APP_URL=https://your-app.vercel.app
```

## 🔧 Step 4: Deploy

1. **Click "Deploy"** in the Vercel dashboard
2. **Wait for the build to complete** (usually 2-3 minutes)
3. **Your app will be live** at `https://your-app.vercel.app`

## 🧪 Step 5: Test Your Deployment

1. **Visit your deployed app**
2. **Test the waitlist form** by submitting an email
3. **Check your Supabase dashboard** to verify emails are being saved
4. **Test the API endpoints:**
   - `https://your-app.vercel.app/api/test-email` (GET)
   - `https://your-app.vercel.app/test-email` (test page)

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Verify the build command is correct
   - Check the build logs for specific errors

2. **Environment Variables Not Working**
   - Make sure you've added them in Vercel dashboard
   - Redeploy after adding environment variables
   - Check that variable names match exactly

3. **Supabase Connection Fails**
   - Verify your Supabase URL and API key
   - Check that your Supabase project is active
   - Ensure RLS policies allow public inserts

4. **API Routes Return 500**
   - Check Vercel function logs
   - Verify environment variables are set
   - Test locally first

### Debug Commands:

```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

## 🔄 Continuous Deployment

Once deployed, Vercel will automatically:
- **Deploy on every push** to your main branch
- **Create preview deployments** for pull requests
- **Provide automatic HTTPS** and CDN

## 📊 Monitoring

After deployment, you can:
- **View analytics** in your Vercel dashboard
- **Monitor function logs** for API routes
- **Set up alerts** for build failures
- **Track performance** with Vercel Analytics

## 🎉 Success!

Your waitlist app is now live and will:
- ✅ Accept email submissions from users
- ✅ Save emails to your Supabase `waitlist_emails` table
- ✅ Work reliably in production
- ✅ Scale automatically with Vercel

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Your App Dashboard](https://vercel.com/dashboard) 