# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the LidlDev Portfolio application to Vercel.

## Why Vercel?

Vercel is an excellent platform for deploying React applications because:

1. It has built-in support for client-side routing
2. It handles environment variables securely
3. It provides automatic HTTPS
4. It offers preview deployments for pull requests
5. It has a global CDN for fast loading times
6. It integrates seamlessly with GitHub

## Prerequisites

1. A GitHub account with access to the repository
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
3. Your Supabase credentials (URL and anon key)

## Step 1: Connect Your GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click on "Add New..." > "Project"
3. Find and select your repository (`lidldev-portfolio`)
4. Click "Import"

## Step 2: Configure Project Settings

1. In the "Configure Project" screen:
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Leave as `.` (the project root)
   - **Build Command**: Leave as default (`npm run build`)
   - **Output Directory**: Leave as default (`dist`)

2. Expand the "Environment Variables" section and add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. Click "Deploy"

## Step 3: Set Up Custom Domain

1. After the initial deployment, go to the project dashboard
2. Click on "Settings" > "Domains"
3. Add your custom domain (`www.lidldev.com`)
4. Follow Vercel's instructions to verify domain ownership and set up DNS records

## Step 4: Update DNS Settings

1. Go to your domain registrar's website
2. Update your DNS settings to point to Vercel:
   - Add an `A` record pointing your apex domain (`lidldev.com`) to Vercel's IP: `76.76.21.21`
   - Add a `CNAME` record pointing `www` to `cname.vercel-dns.com.`

## Step 5: Configure OAuth Providers

After deploying to Vercel, you need to update your OAuth provider settings:

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your project > "APIs & Services" > "Credentials"
3. Edit your OAuth client
4. Update the authorized JavaScript origins:
   - Add `https://www.lidldev.com` and `https://lidldev.com`
5. Update the authorized redirect URIs:
   - Add `https://www.lidldev.com/agent` and `https://lidldev.com/agent`
   - Keep `https://mszyijbyiyvjocjtcobh.supabase.co/auth/v1/callback`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update the homepage URL to `https://www.lidldev.com`
4. Keep the authorization callback URL as `https://mszyijbyiyvjocjtcobh.supabase.co/auth/v1/callback`

## Step 6: Update Supabase Settings

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "URL Configuration"
3. Update the Site URL to `https://www.lidldev.com`
4. Update the Redirect URLs to include:
   - `https://www.lidldev.com/agent`
   - `https://lidldev.com/agent`
   - `https://www.lidldev.com`
   - `https://lidldev.com`
   - Keep the development URLs if needed

**Important Notes**:
- Make sure to include both the `/agent` paths and the root paths to ensure proper redirection after authentication
- For mobile devices, users will need to manually return to the app after authentication
- The authentication flow uses a full-page redirect rather than a popup to ensure compatibility with all devices

## Vercel Deployment Features

### Automatic Deployments

Vercel automatically deploys your application when you push to the main branch. You don't need to run any manual deployment commands.

### Preview Deployments

When you create a pull request, Vercel automatically creates a preview deployment, allowing you to test changes before merging.

### Environment Variables

Vercel securely manages your environment variables and injects them during the build process. You can set different values for production, preview, and development environments.

### Logs and Monitoring

Vercel provides deployment logs and basic monitoring for your application. You can view these in the Vercel dashboard.

## Troubleshooting

### Deployment Failures

If your deployment fails:

1. Check the deployment logs in the Vercel dashboard
2. Ensure all required environment variables are set
3. Verify that the build command works locally

### OAuth Issues

If OAuth authentication doesn't work:

1. Check that the redirect URLs are correctly set in both OAuth providers and Supabase
2. Verify that the environment variables are correctly set in Vercel
3. Check the browser console for any errors

### Custom Domain Issues

If your custom domain doesn't work:

1. Verify that the DNS records are correctly set
2. Check the domain settings in the Vercel dashboard
3. Wait for DNS propagation (can take up to 48 hours)
