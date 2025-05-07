import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/api/email-auth-callback` : 'http://localhost:3000/api/email-auth-callback';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests for OAuth callback
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, error } = req.query;

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect('/agent?auth_error=' + encodeURIComponent(error as string));
    }

    if (!code) {
      return res.redirect('/agent?auth_error=missing_code');
    }

    // Get the user ID from the cookie
    const userId = req.cookies.email_auth_user_id;
    if (!userId) {
      return res.redirect('/agent?auth_error=missing_user_id');
    }

    // Exchange the authorization code for access and refresh tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return res.redirect('/agent?auth_error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Store the tokens in Supabase
    const { error: updateError } = await supabase
      .from('email_auth')
      .upsert({
        user_id: userId,
        access_token,
        refresh_token,
        expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        provider: 'google',
      });

    if (updateError) {
      console.error('Error storing tokens:', updateError);
      return res.redirect('/agent?auth_error=token_storage_failed');
    }

    // Update the user's profile to indicate email scanning permission
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ email_scan_permission: true })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Continue anyway, as the tokens were stored successfully
    }

    // Clear the cookie
    res.setHeader('Set-Cookie', 'email_auth_user_id=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');

    // Redirect back to the agent page with success
    return res.redirect('/agent?auth_success=true');
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return res.redirect('/agent?auth_error=server_error');
  }
}
