# OAuth Setup Guide for Supabase Authentication

This guide provides step-by-step instructions for setting up OAuth authentication with Google and GitHub for your Supabase project.

## Prerequisites

1. A Supabase project (create one at [https://app.supabase.io](https://app.supabase.io) if you don't have one)
2. Access to Google Cloud Console (for Google OAuth)
3. A GitHub account (for GitHub OAuth)
4. Your application's URL (local development: `http://localhost:8080`, production: your actual domain)

## Environment Variables Setup

First, ensure your environment variables are properly set up in your `.env` file:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**IMPORTANT: Never commit your `.env` file to version control!**

## 1. Setting Up Google OAuth

### Step 1: Create OAuth Credentials in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client (e.g., "LidlDev Portfolio Authentication")
7. Add authorized JavaScript origins:
   - For development: `http://localhost:8080` and `http://localhost:8081`
   - For production: `https://www.lidldev.com` and `https://lidldev.com`
8. Add authorized redirect URIs:
   - For development: `http://localhost:8080/agent` and `http://localhost:8081/agent`
   - For production: `https://www.lidldev.com/agent` and `https://lidldev.com/agent`
   - Also add your Supabase URL: `https://mszyijbyiyvjocjtcobh.supabase.co/auth/v1/callback`
9. Click "Create"
10. Note down the "Client ID" and "Client Secret"

### Step 2: Configure Google OAuth in Supabase

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click "Enable"
4. Enter the "Client ID" and "Client Secret" from Google Cloud Console
5. Save the changes

## 2. Setting Up GitHub OAuth

### Step 1: Create OAuth App in GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "OAuth Apps" > "New OAuth App"
3. Fill in the application details:
   - Application name: LidlDev Portfolio
   - Homepage URL:
     - For development: `http://localhost:8080`
     - For production: `https://www.lidldev.com`
   - Authorization callback URL:
     - `https://mszyijbyiyvjocjtcobh.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Generate a new client secret
6. Note down the "Client ID" and "Client Secret"

### Step 2: Configure GitHub OAuth in Supabase

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "GitHub" in the list and click "Enable"
4. Enter the "Client ID" and "Client Secret" from GitHub
5. Save the changes

## 3. Testing OAuth Integration

1. Start your application in development mode (`npm run dev`)
2. Navigate to the Agent page
3. Click "Sign In" and try signing in with Google or GitHub
4. You should be redirected to the respective service for authentication
5. After successful authentication, you should be redirected back to your application

## 4. Troubleshooting

### Common Issues:

1. **Redirect URI Mismatch**: Ensure the redirect URIs in your OAuth providers match exactly with what Supabase expects.

2. **CORS Issues**: If you're getting CORS errors, make sure your domains are properly configured in both the OAuth provider and Supabase.

3. **Callback Not Working**: Verify that `https://your-project-id.supabase.co/auth/v1/callback` is added as an authorized redirect URI in both Google and GitHub.

4. **Environment Variables Not Loading**: Check that your `.env` file is in the correct location and that you're using the variables correctly in your code.

5. **"Invalid Client" Error**: This usually means your Client ID or Client Secret is incorrect or has been revoked.

## 5. Security Best Practices

1. **Never hardcode OAuth credentials** in your application code.

2. **Use environment variables** for all sensitive information.

3. **Implement proper CORS settings** to prevent unauthorized domains from accessing your authentication.

4. **Set up Row Level Security (RLS)** in Supabase to protect user data.

5. **Regularly rotate your client secrets** for enhanced security.

6. **Use HTTPS** for all production environments.

## 6. Additional Configuration

### Custom Redirect After Authentication

To customize where users are redirected after authentication:

```typescript
// In your OAuth sign-in function
await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github'
  options: {
    redirectTo: `${window.location.origin}/custom-redirect-path`,
  },
});
```

### Requesting Additional Scopes

To request additional permissions from OAuth providers:

```typescript
// For Google
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'email profile',
    redirectTo: `${window.location.origin}/agent`,
  },
});

// For GitHub
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'user:email repo',
    redirectTo: `${window.location.origin}/agent`,
  },
});
```

## 7. Production Deployment Considerations

1. Update all OAuth redirect URIs to use your production domain.
2. Ensure your production environment variables are properly set.
3. Add the Supabase environment variables as GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following repository secrets:
     - `VITE_SUPABASE_URL`: `https://mszyijbyiyvjocjtcobh.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Test the authentication flow in production before releasing to users.
5. Monitor authentication logs for any unusual activity.

## 8. Troubleshooting OAuth Redirect Issues

If you encounter OAuth redirect issues in production:

1. **Check the redirect URLs in your OAuth providers**:
   - Make sure both `https://www.lidldev.com` and `https://lidldev.com` are added as authorized origins
   - Make sure both `https://www.lidldev.com/agent` and `https://lidldev.com/agent` are added as authorized redirect URIs

2. **Check the redirect URLs in Supabase**:
   - Go to Authentication > URL Configuration
   - Make sure the Site URL is set to your production domain (`https://www.lidldev.com`)
   - Make sure the Redirect URLs include both development and production URLs:
     - `http://localhost:8080/agent`
     - `http://localhost:8081/agent`
     - `https://www.lidldev.com/agent`
     - `https://lidldev.com/agent`

3. **Check for hardcoded localhost URLs in your code**:
   - Make sure all redirect URLs are using the environment utility functions
   - Check for any hardcoded `localhost` URLs in your code

4. **Clear browser cache and cookies**:
   - Sometimes OAuth issues can be caused by cached tokens or cookies
   - Try clearing your browser cache and cookies before testing again

For more detailed information, refer to the [Supabase Authentication documentation](https://supabase.com/docs/guides/auth).
