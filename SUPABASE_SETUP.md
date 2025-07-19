# 🚀 Supabase Setup Guide for Waitlist Emails

## 📋 Overview

This guide will help you set up Supabase to save user emails to the `waitlist_emails` table when they submit the waitlist form.

## 🔧 Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project (or create a new one)

2. **Get your Project URL and API Key**
   - Go to **Settings** → **API**
   - Copy the **Project URL** (looks like: `https://your-project.supabase.co`)
   - Copy the **anon/public** key (starts with `eyJ...`)

## 🔧 Step 2: Configure Environment Variables

1. **Open your `env` file** in the project root
2. **Replace the placeholder values** with your actual Supabase credentials:

```bash
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔧 Step 3: Create the waitlist_emails Table

1. **Go to your Supabase Dashboard**
2. **Navigate to Table Editor**
3. **Click "New Table"**
4. **Create the table with these settings:**

```sql
-- Table name: waitlist_emails
-- Columns:
- id (int8, primary key, auto-increment)
- email (text, not null, unique)
- name (text, not null)
- phone (text, nullable)
- signup_date (timestamptz, default: now())
```

**Or use this SQL in the SQL Editor:**

```sql
CREATE TABLE waitlist_emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  signup_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_emails_email ON waitlist_emails(email);
CREATE INDEX idx_waitlist_emails_signup_date ON waitlist_emails(signup_date);
```

## 🔧 Step 4: Set Up Row Level Security (RLS)

1. **Enable RLS on the table:**
   ```sql
   ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;
   ```

2. **Create a policy to allow inserts:**
   ```sql
   CREATE POLICY "Allow public inserts" ON waitlist_emails
   FOR INSERT WITH CHECK (true);
   ```

3. **Create a policy to allow reads (optional, for admin access):**
   ```sql
   CREATE POLICY "Allow authenticated reads" ON waitlist_emails
   FOR SELECT USING (auth.role() = 'authenticated');
   ```

## 🧪 Step 5: Test the Setup

1. **Run the test script:**
   ```bash
   node src/scripts/test-supabase-email.js
   ```

2. **Or test via API:**
   ```bash
   # Test connection
   curl http://localhost:3000/api/test-email
   
   # Test email insertion
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User"}'
   ```

## ✅ Step 6: Verify Everything Works

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Go to your website** and try submitting the waitlist form

3. **Check your Supabase dashboard** - you should see the email appear in the `waitlist_emails` table

## 🔍 Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Make sure you've set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your `env` file

2. **"Table doesn't exist"**
   - Make sure you've created the `waitlist_emails` table in Supabase

3. **"Permission denied"**
   - Check that RLS policies are set up correctly
   - Verify your API key has the right permissions

4. **"Connection failed"**
   - Check your internet connection
   - Verify your Supabase URL is correct

### Debug Commands:

```bash
# Check environment variables
cat env | grep SUPABASE

# Test Supabase connection
node src/scripts/test-supabase-email.js

# Check API endpoint
curl http://localhost:3000/api/test-email
```

## 🎉 Success!

Once everything is working, every time a user submits their email through the waitlist form, it will be automatically saved to your `waitlist_emails` table in Supabase!

You can view all collected emails in your Supabase dashboard under **Table Editor** → **waitlist_emails**. 