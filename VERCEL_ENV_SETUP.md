# Setting Up Environment Variables in Vercel

This guide provides detailed instructions for setting up the required environment variables in your Vercel project to fix the "supabaseUrl is required" error.

## Required Environment Variables

Your project requires the following environment variables to be set in Vercel:

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `SUPABASE_SERVICE_KEY` - Your Supabase service role key
3. `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
4. `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
5. `NEXT_PUBLIC_URL` - Your production URL (e.g., https://www.lidldev.com)

## Step-by-Step Instructions

### 1. Get Your Supabase URL and Service Key

1. Log in to your [Supabase dashboard](https://app.supabase.io/)
2. Select your project
3. Go to "Settings" > "API"
4. Copy the "URL" value - this is your `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the "service_role key" (not the anon key) - this is your `SUPABASE_SERVICE_KEY`

### 2. Add Environment Variables to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables"
5. Add each of the required environment variables:

#### Adding NEXT_PUBLIC_SUPABASE_URL

- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: Your Supabase project URL (e.g., https://abcdefghijklm.supabase.co)
- Environment: Production, Preview, Development

#### Adding SUPABASE_SERVICE_KEY

- Name: `SUPABASE_SERVICE_KEY`
- Value: Your Supabase service role key
- Environment: Production, Preview, Development

#### Adding GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

- Name: `GOOGLE_CLIENT_ID`
- Value: Your Google OAuth client ID
- Environment: Production, Preview, Development

- Name: `GOOGLE_CLIENT_SECRET`
- Value: Your Google OAuth client secret
- Environment: Production, Preview, Development

#### Adding NEXT_PUBLIC_URL

- Name: `NEXT_PUBLIC_URL`
- Value: Your production URL (e.g., https://www.lidldev.com)
- Environment: Production, Preview, Development

### 3. Redeploy Your Project

After adding all the environment variables:

1. Go to the "Deployments" tab
2. Click on "Redeploy" for your latest deployment
3. Select "Redeploy with existing build cache"

## Verifying the Setup

To verify that your environment variables are set correctly:

1. After redeployment, try the email scanning feature again
2. Check the Vercel logs for any errors:
   - Go to your Vercel dashboard
   - Select your project
   - Go to the "Deployments" tab
   - Select the latest deployment
   - Click on "Functions" to see the logs for your API routes

## Troubleshooting

### Error: "supabaseUrl is required"

This error occurs when the `NEXT_PUBLIC_SUPABASE_URL` environment variable is not set or is empty. Make sure:

1. You've added the `NEXT_PUBLIC_SUPABASE_URL` environment variable to your Vercel project
2. The value is correct (no extra spaces, etc.)
3. You've redeployed your project after adding the environment variable

### Error: "Invalid service_role key"

This error occurs when the `SUPABASE_SERVICE_KEY` environment variable is incorrect. Make sure:

1. You're using the "service_role key" from your Supabase project, not the "anon key"
2. The key is copied correctly (no extra spaces, etc.)

### Other Errors

If you're still experiencing issues:

1. Check the Vercel logs for specific error messages
2. Make sure all environment variables are set correctly
3. Verify that your Supabase project is active and accessible

## Important Notes

- Environment variables in Vercel are encrypted and not visible after you add them
- If you need to update an environment variable, you'll need to delete it and add it again
- Changes to environment variables require a redeployment to take effect
- The `NEXT_PUBLIC_` prefix makes the variable available to the client-side code, while variables without this prefix are only available to server-side code
