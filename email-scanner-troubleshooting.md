# Email Scanner Troubleshooting Guide

## Common Issues and Solutions

### 1. "OAuth credentials not set" Error
**Problem**: Google OAuth credentials are missing
**Solution**: 
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Vercel environment variables
- Redeploy after adding environment variables

### 2. "Server configuration error" 
**Problem**: Supabase environment variables are missing
**Solution**:
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set
- Verify the service key has the correct permissions

### 3. "Email authentication not found"
**Problem**: OAuth tokens are not stored properly
**Solution**:
- Check if the `email_auth` table exists in Supabase
- Run the SQL setup script provided
- Try reconnecting Gmail account

### 4. "Failed to scan emails" with 404 Error
**Problem**: API endpoints are not deployed
**Solution**:
- Ensure the `api/` folder is in your project root
- Check Vercel function logs for deployment errors
- Verify the API routes are accessible

### 5. Gmail Authorization Redirect Issues
**Problem**: OAuth redirect doesn't work
**Solution**:
- Check that `NEXT_PUBLIC_URL` matches your actual domain
- Verify redirect URI in Google Cloud Console matches exactly
- Ensure redirect URI includes `/api/email-auth-callback`

### 6. No Bills Detected
**Problem**: Scanner runs but finds no bills
**Solution**:
- Check if you have bill-related emails in the last 90 days
- Look at Vercel function logs for detailed scanning results
- The scanner looks for keywords like "invoice", "bill", "payment due"

### 7. Database Permission Errors
**Problem**: RLS policies blocking access
**Solution**:
- Run the RLS policy setup from the SQL script
- Ensure user is properly authenticated
- Check Supabase logs for permission errors

## Checking Logs

### Vercel Function Logs
1. Go to Vercel Dashboard > Your Project > Functions
2. Click on the API function that's failing
3. Check the logs for detailed error messages

### Supabase Logs
1. Go to Supabase Dashboard > Your Project > Logs
2. Filter by API or Database logs
3. Look for authentication or permission errors

## Testing Steps

### 1. Test API Endpoints
```bash
# Test if API endpoints are accessible
curl https://your-domain.vercel.app/api/scan-emails
# Should return "Method not allowed" (405) - this means the endpoint exists

curl https://your-domain.vercel.app/api/email-auth
# Should redirect or return an error about missing parameters
```

### 2. Test Database Connection
- Go to Supabase SQL Editor
- Run: `SELECT * FROM email_auth LIMIT 1;`
- Should return empty result or existing data (not an error)

### 3. Test Gmail API Access
- Try the OAuth flow in the app
- Check if you get redirected to Google's authorization page
- Verify the callback URL works

## Environment Variables Checklist

Make sure these are set in Vercel:
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET` 
- [ ] `NEXT_PUBLIC_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_KEY`

## Google Cloud Console Setup Checklist

- [ ] Gmail API is enabled
- [ ] OAuth 2.0 Client ID is created
- [ ] Authorized redirect URIs include your callback URL
- [ ] OAuth consent screen is configured
- [ ] Scopes include `https://www.googleapis.com/auth/gmail.readonly`

## Security Notes

- The `SUPABASE_SERVICE_KEY` should be the service role key (not anon key)
- OAuth credentials should be kept secure
- The app only requests read-only Gmail access
- All data is stored in your Supabase database with RLS enabled

## Support

If you continue to have issues:
1. Check the Vercel function logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the Supabase database tables are created
4. Test the OAuth flow step by step
