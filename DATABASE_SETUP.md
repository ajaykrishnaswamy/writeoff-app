# Database Setup Guide for WriteOff Waitlist System

## 🚨 Issue: "Failed to join waitlist" Error

If you're encountering the "Failed to join waitlist" error when users try to sign up for your waitlist, the issue is most likely that the database hasn't been properly set up. This guide will walk you through the complete database setup process to get your waitlist system working correctly.

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js installed on your system
- A Supabase account and project created
- Your Supabase credentials (URL and anon key)
- The project files downloaded/cloned

## 🗂️ Files Involved in the Waitlist System

The following files are part of the waitlist functionality:

### Database Files
- `scripts/create-db.js` - Database creation and setup script
- `lib/supabase.js` - Supabase client configuration

### Frontend Files
- `app/page.js` - Main page with waitlist signup form
- `app/api/waitlist/route.js` - API endpoint for handling waitlist signups
- `components/WaitlistForm.js` - Waitlist signup form component

## 🔧 Step-by-Step Database Setup

### Step 1: Configure Your Environment Variables

1. Create a `.env.local` file in your project root if it doesn't exist
2. Add your Supabase credentials:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
**How to find your Supabase credentials:**
- Go to your Supabase dashboard
- Select your project
- Go to Settings > API
- Copy the "Project URL" and "Project API keys" (anon/public key)

### Step 2: Install Dependencies

Run the following command in your project directory:

npm install
### Step 3: Run the Database Creation Script

Execute the database setup script:

node scripts/create-db.js
**What this script does:**
- Creates a `waitlist` table in your Supabase database
- Sets up the proper columns (id, email, name, created_at)
- Configures Row Level Security (RLS) policies
- Enables public access for insertions (signup)
- Restricts read access to authenticated users only

**Expected output:**
Database setup completed successfully!
✅ Waitlist table created
✅ RLS policies configured
✅ Public insert access enabled
### Step 4: Verify Database Setup

1. **Check in Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to "Table Editor"
   - You should see a `waitlist` table with columns: `id`, `email`, `name`, `created_at`

2. **Check RLS Policies:**
   - In the Table Editor, click on your `waitlist` table
   - Go to the "Policies" tab
   - You should see policies for INSERT and SELECT operations

### Step 5: Test the Database Connection

Create a simple test script to verify the connection:

// test-db.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('count')
      .single();
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful!');
    }
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testConnection();
Run the test:
node test-db.js
## 🧪 Testing the Waitlist System

### 1. Start Your Development Server

npm run dev
### 2. Test the Waitlist Form

1. Open your browser and go to `http://localhost:3000`
2. Find the waitlist signup form
3. Enter a test email and name
4. Submit the form
5. You should see a success message

### 3. Verify Data in Supabase

1. Go to your Supabase dashboard
2. Navigate to "Table Editor"
3. Click on the `waitlist` table
4. You should see your test entry

## 🔍 Common Troubleshooting Steps

### Problem 1: "Failed to join waitlist" Error

**Possible causes:**
- Database table doesn't exist
- Incorrect environment variables
- RLS policies not configured properly
- Network/connection issues

**Solutions:**
1. Re-run the database creation script: `node scripts/create-db.js`
2. Double-check your `.env.local` file
3. Verify your Supabase project is active
4. Check your internet connection

### Problem 2: Environment Variables Not Loading

**Solutions:**
1. Restart your development server after adding `.env.local`
2. Make sure the file is in the project root
3. Check that variable names start with `NEXT_PUBLIC_`

### Problem 3: Database Creation Script Fails

**Common errors and solutions:**

# Error: Cannot find module '@supabase/supabase-js'
npm install @supabase/supabase-js

# Error: Invalid API key
# Check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

# Error: Project not found
# Verify your NEXT_PUBLIC_SUPABASE_URL in .env.local
### Problem 4: RLS Policy Issues

If you're getting permission errors:

1. Go to Supabase Dashboard > Authentication > Policies
2. Make sure the `waitlist` table has:
   - INSERT policy allowing public access
   - SELECT policy (optional, for admin access)

### Problem 5: CORS Issues

If you're getting CORS errors:
1. Check that your Supabase project allows your domain
2. Verify you're using the correct anon key (not the service key)

## 📱 Testing on Different Devices

### Desktop Testing
- Test in multiple browsers (Chrome, Firefox, Safari)
- Test form validation
- Test responsive design

### Mobile Testing
- Test on actual mobile devices
- Check touch interactions
- Verify form usability

## 🔐 Security Considerations

1. **Never commit your `.env.local` file** - Add it to `.gitignore`
2. **Use anon key for client-side** - Never use the service key in frontend code
3. **RLS policies are crucial** - They protect your data from unauthorized access
4. **Validate email format** - Both client and server side

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Database is set up and tested
- [ ] Environment variables are configured in your hosting platform
- [ ] RLS policies are properly configured
- [ ] API endpoints are working correctly
- [ ] Form validation is working
- [ ] Success/error messages are user-friendly
- [ ] The waitlist system has been tested end-to-end

## 📞 Getting Help

If you're still experiencing issues:

1. Check the browser console for error messages
2. Review the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Test the database connection independently
5. Check that your Supabase project is active and not paused

## 🎯 Success Verification

Your waitlist system is working correctly when:

✅ Users can submit the form without errors  
✅ Data appears in your Supabase waitlist table  
✅ Success messages are displayed to users  
✅ Form validation works properly  
✅ No console errors appear  
✅ The system works on different devices and browsers  

---

**Need additional help?** Check your Supabase project logs and ensure all the steps above were completed successfully. The most common issue is skipping the database creation script or having incorrect environment variables.