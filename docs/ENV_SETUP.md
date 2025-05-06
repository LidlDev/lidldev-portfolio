# Environment Variables Setup Guide

This guide provides detailed instructions for setting up environment variables for the LidlDev Portfolio application.

## Why Environment Variables?

Environment variables are used to store sensitive information like API keys and configuration settings that:
1. Should not be hardcoded in the source code
2. May change between different environments (development, staging, production)
3. Should not be committed to version control

## Required Environment Variables

The application requires the following environment variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Setting Up Environment Variables

### Method 1: Using a .env File (Recommended for Development)

1. Create a file named `.env` in the root directory of the project:

```sh
touch .env
```

2. Open the `.env` file and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Save the file and restart the development server:

```sh
npm run dev
```

### Method 2: Setting Environment Variables in the Shell

You can also set environment variables directly in your shell before starting the application:

**For Linux/macOS:**
```sh
export VITE_SUPABASE_URL=https://your-project-id.supabase.co
export VITE_SUPABASE_ANON_KEY=your-anon-key
npm run dev
```

**For Windows (Command Prompt):**
```cmd
set VITE_SUPABASE_URL=https://your-project-id.supabase.co
set VITE_SUPABASE_ANON_KEY=your-anon-key
npm run dev
```

**For Windows (PowerShell):**
```powershell
$env:VITE_SUPABASE_URL="https://your-project-id.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="your-anon-key"
npm run dev
```

## Finding Your Supabase Credentials

1. Go to [https://app.supabase.io](https://app.supabase.io) and sign in
2. Select your project
3. Go to Project Settings > API
4. Under "Project API keys", you'll find:
   - Project URL: This is your `VITE_SUPABASE_URL`
   - anon/public key: This is your `VITE_SUPABASE_ANON_KEY`

## Verifying Environment Variables

To verify that your environment variables are properly loaded:

1. Start the application with `npm run dev`
2. Open the application in your browser
3. Go to the Agent page and click "Sign In"
4. Click the "Debug" button in the top-left corner of the login modal
5. Check if the environment variables are shown as "Defined"

## Troubleshooting

### Environment Variables Not Loading

If your environment variables are not being loaded:

1. Make sure the `.env` file is in the root directory of the project
2. Make sure the variable names start with `VITE_` (this is required by Vite)
3. Try restarting the development server
4. Check if there are any errors in the console

### Using Hardcoded Credentials

The application includes hardcoded credentials as a fallback for development. This is **not secure** and should be removed in production.

To remove the hardcoded credentials:

1. Open `src/lib/supabase.ts`
2. Remove the hardcoded values in the following section:

```typescript
// Hardcoded values for development only - REMOVE IN PRODUCTION
if (!supabaseUrl || !supabaseKey) {
  // These are the values from your .env file
  supabaseUrl = 'https://mszyijbyiyvjocjtcobh.supabase.co';
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zenlpamJ5aXl2am9janRjb2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTM2NDIsImV4cCI6MjA2MjAyOTY0Mn0.BUD46aMAsowGWxRpdQxuh-RzQXBciLnx1ISvuQVbAqc';
  
  console.warn('Using hardcoded Supabase credentials for development. This is insecure and should be removed in production.');
}
```

## Production Deployment

For production deployment, you should set environment variables in your hosting platform:

### GitHub Pages

For GitHub Pages deployment with GitHub Actions:

1. Go to your GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Update your GitHub Actions workflow file to use these secrets:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ... other steps
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### Other Hosting Platforms

Most hosting platforms provide a way to set environment variables:

- **Vercel**: Set environment variables in the project settings
- **Netlify**: Set environment variables in the site settings
- **Heroku**: Use the Heroku CLI or dashboard to set config vars

## Security Considerations

- Never commit your `.env` file to version control
- Regularly rotate your API keys
- Use different API keys for development and production
- Consider using more restrictive permissions for your production API keys
