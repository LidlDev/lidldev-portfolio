# Setting Up Email Scanning Feature

This guide provides detailed instructions for setting up the email scanning feature in your application.

## Overview

The email scanning feature allows users to scan their emails for bills and automatically add them to the Upcoming Payments section. It uses Google OAuth to access the user's Gmail account and scans for emails that look like bills.

## Prerequisites

1. A Google Cloud Platform account
2. A Supabase project
3. Environment variables set up in your Vercel project

## Step 1: Set Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for and enable the "Gmail API"
5. Go to "APIs & Services" > "OAuth consent screen"
6. Set up the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer contact information)
   - Add the "https://www.googleapis.com/auth/gmail.readonly" scope
   - Add test users (your email and any other testers)
7. Go to "APIs & Services" > "Credentials"
8. Click "Create Credentials" > "OAuth client ID"
9. Select "Web application" as the application type
10. Add the following authorized redirect URIs:
    - `https://www.lidldev.com/api/email-auth-callback` (for production)
    - `http://localhost:3000/api/email-auth-callback` (for local development)
11. Click "Create" and note down the Client ID and Client Secret

## Step 2: Set Up Supabase Tables

1. Log in to your [Supabase dashboard](https://app.supabase.io/)
2. Select your project
3. Go to the "SQL Editor" tab
4. Run the following SQL to create the necessary tables:

```sql
-- Add email_scan_permission to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_scan_permission BOOLEAN DEFAULT FALSE;

-- Create email_auth table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS email_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, provider)
);

-- Create detected_bills table if it doesn't exist
CREATE TABLE IF NOT EXISTS detected_bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT NOT NULL,
  confidence DECIMAL NOT NULL,
  source TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Enable RLS on the tables
ALTER TABLE email_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_bills ENABLE ROW LEVEL SECURITY;

-- Create policies for email_auth
CREATE POLICY "Users can view their own email auth" 
  ON email_auth FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email auth" 
  ON email_auth FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email auth" 
  ON email_auth FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email auth" 
  ON email_auth FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for detected_bills
CREATE POLICY "Users can view their own detected bills" 
  ON detected_bills FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own detected bills" 
  ON detected_bills FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detected bills" 
  ON detected_bills FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detected bills" 
  ON detected_bills FOR DELETE 
  USING (auth.uid() = user_id);
```

## Step 3: Set Up Environment Variables in Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables"
5. Add the following environment variables:
   - `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
   - `NEXT_PUBLIC_URL` - Your production URL (e.g., https://www.lidldev.com)
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` - Your Supabase service role key

## Step 4: Add Test Users in Google Cloud Console

Since your Google Cloud project is in "Testing" mode, you need to add test users:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. In the "Test users" section, click "Add users"
5. Add the email addresses of the users who need to test the application
6. Save the changes

## Step 5: Deploy Your Application

1. Commit and push your changes to your repository
2. Vercel should automatically deploy the updated project
3. Your API routes should now be accessible at:
   - `https://www.lidldev.com/api/email-auth`
   - `https://www.lidldev.com/api/email-auth-callback`
   - `https://www.lidldev.com/api/scan-emails`

## Troubleshooting

### "Email access error: missing_user_id"

This error occurs when the user ID is not being properly passed between the OAuth flow steps. Check:

1. The cookie is being set correctly in the `email-auth.js` file
2. The cookie is being read correctly in the `email-auth-callback.js` file
3. The domain is set correctly for the cookie

### "Email access error: oauth_credentials_not_set"

This error occurs when the Google OAuth credentials are not set correctly. Check:

1. The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables are set correctly
2. The environment variables are available to the API routes

### "Email access error: token_exchange_failed"

This error occurs when the OAuth token exchange fails. Check:

1. The redirect URI is set correctly in the Google Cloud Console
2. The redirect URI matches the one used in the API routes
3. The Google OAuth credentials are correct

### "lidldev.com has not completed the Google verification process"

This error occurs when a user who is not added as a test user tries to use the application. To fix this:

1. Add the user as a test user in the Google Cloud Console
2. If you want to make the application available to all users, you need to complete the Google verification process

## Testing the Feature

1. Log in to your application
2. Navigate to the Agent page
3. Click on the "Payments" tab
4. Click on the "Scan Emails" button
5. Follow the OAuth flow to grant access to your Gmail account
6. The application should scan your emails and display any detected bills
