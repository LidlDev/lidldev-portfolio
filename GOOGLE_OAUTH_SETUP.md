# Setting Up Google OAuth Redirect URIs

This guide provides detailed instructions for setting up the Google OAuth redirect URIs correctly to avoid the "redirect_uri_mismatch" error.

## Understanding the Error

The "redirect_uri_mismatch" error occurs when the redirect URI used in the OAuth request doesn't match any of the authorized redirect URIs configured in your Google Cloud Console. Google OAuth doesn't allow query parameters in the registered redirect URIs.

## Step 1: Configure Redirect URIs in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID and click the edit button (pencil icon)
5. In the "Authorized redirect URIs" section, add the following URI:
   ```
   https://www.lidldev.com/api/email-auth-callback
   ```
   (Note: Do NOT include any query parameters like `?userId=...`)
6. If you're also testing locally, add:
   ```
   http://localhost:3000/api/email-auth-callback
   ```
7. Click "Save"

## Step 2: Verify the Configuration

After saving the changes, it may take a few minutes for the changes to propagate. You can verify the configuration by:

1. Going back to the "Credentials" page
2. Clicking on your OAuth 2.0 Client ID
3. Checking that the redirect URIs are listed correctly

## Step 3: Test the OAuth Flow

1. Log in to your application
2. Navigate to the Agent page
3. Click on the "Payments" tab
4. Click on the "Scan Emails" button
5. You should now be redirected to the Google OAuth consent screen without any errors

## Common Issues and Solutions

### Error: "redirect_uri_mismatch"

If you're still seeing this error, check:

1. The exact URL being used in the OAuth request (check the browser's address bar)
2. Make sure it matches exactly with what you've configured in the Google Cloud Console
3. Remember that Google OAuth is case-sensitive and protocol-sensitive (http vs https)

### Error: "invalid_request"

This error can occur if:

1. The redirect URI contains invalid characters
2. The redirect URI is not properly URL-encoded
3. The OAuth request is missing required parameters

### Error: "access_denied"

This error can occur if:

1. The user denies permission
2. The user is not added as a test user (if your app is in testing mode)
3. The requested scopes are not approved for your application

## How Our Code Works

Our application now uses the OAuth state parameter to securely pass the user ID between the authorization request and callback:

1. When the user clicks "Grant Permission", we redirect them to:
   ```
   /api/email-auth?userId=...
   ```

2. The `email-auth.js` API route:
   - Takes the user ID from the query parameters
   - Encodes it in a base64 string and passes it as the `state` parameter
   - Redirects to Google's OAuth authorization endpoint

3. After the user grants permission, Google redirects back to:
   ```
   /api/email-auth-callback?code=...&state=...
   ```

4. The `email-auth-callback.js` API route:
   - Extracts the user ID from the state parameter
   - Exchanges the authorization code for access and refresh tokens
   - Stores the tokens in Supabase
   - Redirects back to the Agent page

This approach is more secure and compliant with Google's OAuth requirements.

## Additional Resources

- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [OAuth 2.0 State Parameter](https://auth0.com/docs/secure/attack-protection/state-parameters)
- [Google OAuth Redirect URI Requirements](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation)
