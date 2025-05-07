# Email Scanning Feature Setup

This document provides instructions for setting up the email scanning feature in the Agent page.

## Overview

The email scanning feature allows users to scan their emails for bills and automatically add them to the Upcoming Payments section. It uses Google OAuth to access the user's Gmail account and scans for emails that look like bills.

## Prerequisites

1. A Google Cloud Platform account
2. A Supabase project
3. Environment variables set up in your project

## Setup Steps

### 1. Update Supabase Schema

Run the `supabase/schema_update.sql` file in your Supabase SQL Editor to create the necessary tables and policies:

```sql
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

-- Enable RLS on email_auth
ALTER TABLE email_auth ENABLE ROW LEVEL SECURITY;

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
```

### 2. Set Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/email-auth-callback` (for local development)
   - `https://your-production-domain.com/api/email-auth-callback` (for production)
7. Click "Create" and note down the Client ID and Client Secret

### 3. Set Environment Variables

Add the following environment variables to your project:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_URL=https://your-production-domain.com (or http://localhost:3000 for local development)
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### 4. Test the Feature

1. Run your application
2. Navigate to the Agent page
3. Click on the "Payments" tab
4. Click on the "Scan Emails" button
5. Follow the OAuth flow to grant access to your Gmail account
6. The application should scan your emails and display any detected bills

## Troubleshooting

### OAuth Errors

If you encounter OAuth errors, check the following:

1. Make sure your redirect URIs are correctly set up in the Google Cloud Console
2. Verify that your environment variables are correctly set
3. Check the browser console and server logs for error messages

### Database Errors

If you encounter database errors, check the following:

1. Make sure the email_auth table is created in your Supabase database
2. Verify that the RLS policies are correctly set up
3. Check that your Supabase service key has the necessary permissions

## Security Considerations

1. The application only requests read-only access to the user's Gmail account
2. OAuth tokens are stored securely in the Supabase database
3. Row Level Security ensures that users can only access their own data
4. The application does not store the content of emails, only the detected bills

## Future Improvements

1. Add support for other email providers (Outlook, Yahoo, etc.)
2. Improve the bill detection algorithm with machine learning
3. Add support for recurring bills
4. Add support for bill reminders
5. Add support for bill categorization
