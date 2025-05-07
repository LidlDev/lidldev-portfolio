# Setting Up API Routes in Vercel for Vite Projects

This guide explains how to set up API routes in a Vite project deployed to Vercel.

## Understanding the Issue

When using Vite with Vercel, API routes need to be set up differently than with Next.js. The 404 error you're seeing when accessing `/api/email-auth` is because Vercel doesn't automatically recognize API routes in Vite projects.

## Solution: Serverless Functions

Vercel supports serverless functions that can be used to create API endpoints. Here's how to set them up:

### 1. Create an `api` Directory

Create an `api` directory in the root of your project. This is where your serverless functions will live.

### 2. Create API Route Files

Create JavaScript files in the `api` directory for each API endpoint:

- `api/email-auth.js`
- `api/email-auth-callback.js`
- `api/scan-emails.js`

### 3. Update `vercel.json`

Update your `vercel.json` file to properly route API requests:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)\\.(.+)",
      "dest": "/$1.$2"
    },
    {
      "src": "/((?!api/).*)",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

This configuration ensures that:
- Requests to `/api/*` are routed to the corresponding serverless functions
- Static assets are served correctly
- All other routes are handled by the SPA (Single Page Application)

### 4. Set Environment Variables

Make sure to set the required environment variables in your Vercel project:

1. `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
2. `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
3. `NEXT_PUBLIC_URL` - Your production URL (e.g., https://www.lidldev.com)
4. `SUPABASE_SERVICE_KEY` - Your Supabase service key
5. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL

### 5. Configure Google OAuth

Make sure your Google OAuth configuration includes the correct redirect URI:

- `https://www.lidldev.com/api/email-auth-callback`

## Deployment

After making these changes:

1. Commit and push your changes to your repository
2. Vercel should automatically deploy the updated project
3. Your API routes should now be accessible at:
   - `https://www.lidldev.com/api/email-auth`
   - `https://www.lidldev.com/api/email-auth-callback`
   - `https://www.lidldev.com/api/scan-emails`

## Troubleshooting

If you're still experiencing issues:

### Check Vercel Logs

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Deployments" tab
4. Select the latest deployment
5. Click on "Functions" to see the logs for your API routes

### Check Environment Variables

Make sure all environment variables are set correctly in your Vercel project.

### Check CORS Issues

If you're experiencing CORS issues, add the following headers to your API responses:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Check for Syntax Errors

Make sure your API route files don't have any syntax errors. Vercel will not deploy functions with syntax errors.

## Testing Locally

To test your API routes locally before deploying to Vercel:

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` in your project directory
3. Your API routes should be available at `http://localhost:3000/api/*`
