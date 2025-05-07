# Setting Up Environment Variables in Vercel

This guide will help you set up the necessary environment variables in Vercel for the email scanning feature to work correctly.

## Required Environment Variables

The following environment variables are required for the email scanning feature to work:

1. `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
2. `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
3. `NEXT_PUBLIC_URL` - Your production URL (e.g., https://your-domain.vercel.app)
4. `SUPABASE_SERVICE_KEY` - Your Supabase service key

## Steps to Add Environment Variables in Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables"
5. Add each of the required environment variables:

### Adding GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Create or select an existing OAuth 2.0 Client ID
4. Copy the Client ID and Client Secret
5. Add them to Vercel:
   - Name: `GOOGLE_CLIENT_ID`
   - Value: Your Google OAuth client ID
   - Environment: Production, Preview, Development
   - Name: `GOOGLE_CLIENT_SECRET`
   - Value: Your Google OAuth client secret
   - Environment: Production, Preview, Development

### Adding NEXT_PUBLIC_URL

1. Add the environment variable:
   - Name: `NEXT_PUBLIC_URL`
   - Value: Your production URL (e.g., https://your-domain.vercel.app)
   - Environment: Production, Preview, Development

### Adding SUPABASE_SERVICE_KEY

1. Go to your [Supabase dashboard](https://app.supabase.io/)
2. Select your project
3. Go to "Settings" > "API"
4. Copy the "service_role key" (not the anon key)
5. Add it to Vercel:
   - Name: `SUPABASE_SERVICE_KEY`
   - Value: Your Supabase service key
   - Environment: Production, Preview, Development

## Configuring Google OAuth Redirect URIs

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth client ID
4. Add the following Authorized Redirect URIs:
   - `https://your-domain.vercel.app/api/email-auth-callback`
   - `https://www.your-domain.vercel.app/api/email-auth-callback` (if you use www)
   - `http://localhost:3000/api/email-auth-callback` (for local development)
5. Save the changes

## Verifying the Setup

After setting up the environment variables, you should:

1. Redeploy your application to Vercel
2. Check the Vercel logs for any errors
3. Try the email scanning feature again

## Troubleshooting

If you're still experiencing issues, check the following:

### 1. Vercel Logs

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Deployments" tab
4. Select the latest deployment
5. Click on "Functions" to see the logs for your API routes

### 2. Environment Variables

1. Make sure all environment variables are set correctly
2. Check that they're available in the correct environments (Production, Preview, Development)
3. Verify that the values are correct (no extra spaces, etc.)

### 3. Google OAuth Configuration

1. Make sure the redirect URIs are set correctly in the Google Cloud Console
2. Verify that the OAuth consent screen is configured properly
3. Check that you've enabled the Gmail API in the Google Cloud Console

### 4. Supabase Configuration

1. Make sure your Supabase service key is correct
2. Verify that the Supabase URL is correct
3. Check that the required tables exist in your Supabase database

## Common Errors and Solutions

### "Failed to scan emails. The server returned an invalid response."

This error usually indicates that the API endpoint is not returning a valid JSON response. Check:

1. Environment variables are set correctly
2. The API endpoint is properly deployed
3. The Supabase connection is working

### "Email scanning is not available. Please contact the administrator to set up Google OAuth credentials."

This error indicates that the Google OAuth credentials are not set. Check:

1. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
2. The Google Cloud project has the Gmail API enabled

### "Token exchange failed"

This error indicates that the OAuth token exchange failed. Check:

1. The redirect URI is set correctly in the Google Cloud Console
2. The OAuth consent screen is configured properly
3. The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
