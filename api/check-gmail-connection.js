import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase environment variables are not set:', {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'Set' : 'Not set',
    SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'Set' : 'Not set',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Not set'
  });
}

// Create service client for database operations
const supabaseService = supabaseUrl && supabaseServiceKey ?
  createClient(supabaseUrl, supabaseServiceKey) :
  null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase clients are initialized
    if (!supabaseService) {
      console.error('Supabase clients are not initialized due to missing environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please contact the administrator.',
        details: 'Supabase environment variables are not set'
      });
    }

    const { userId, accessToken: userAccessToken } = req.body;

    // Log request details for debugging (without exposing the full token)
    console.log('Check Gmail connection request:', {
      userId: userId ? 'Present' : 'Missing',
      accessToken: userAccessToken ? `${userAccessToken.substring(0, 20)}...` : 'Missing',
      tokenLength: userAccessToken ? userAccessToken.length : 0
    });

    if (!userId || !userAccessToken) {
      console.error('Missing required parameters:', { userId: !!userId, accessToken: !!userAccessToken });
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify the user's token using the client instance
    let user;
    try {
      // Create a temporary client instance with the user's token
      const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${userAccessToken}`
          }
        }
      });
      
      const { data: userData, error: authError } = await userSupabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        return res.status(401).json({ 
          error: 'Authentication failed', 
          details: authError.message 
        });
      }
      
      if (!userData || !userData.user) {
        console.error('No user data returned from token verification');
        return res.status(401).json({ 
          error: 'Invalid token - no user data' 
        });
      }
      
      if (userData.user.id !== userId) {
        console.error('User ID mismatch:', { 
          tokenUserId: userData.user.id, 
          requestUserId: userId 
        });
        return res.status(401).json({ 
          error: 'User ID mismatch' 
        });
      }
      
      user = userData.user;
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({ 
        error: 'Token verification failed', 
        details: tokenError.message 
      });
    }

    // Get the user's OAuth tokens from the database
    const { data: authData, error: authDataError } = await supabaseService
      .from('email_auth')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (authDataError || !authData) {
      console.log('No Gmail auth data found for user:', userId);
      return res.status(200).json({ connected: false, reason: 'No auth data' });
    }

    // Check if the access token is expired
    const now = new Date();
    const expiresAt = new Date(authData.expires_at);
    
    if (now >= expiresAt) {
      console.log('Access token expired, attempting refresh...');
      
      // Try to refresh the token
      try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const nextPublicUrl = process.env.NEXT_PUBLIC_URL;

        if (!googleClientId || !googleClientSecret || !nextPublicUrl) {
          console.error('Google OAuth environment variables are not set');
          return res.status(200).json({ connected: false, reason: 'Server configuration error' });
        }

        const oauth2Client = new google.auth.OAuth2(
          googleClientId,
          googleClientSecret,
          `${nextPublicUrl}/api/email-auth-callback`
        );

        oauth2Client.setCredentials({
          refresh_token: authData.refresh_token
        });

        const { token } = await oauth2Client.getAccessToken();
        
        if (!token) {
          console.log('Failed to refresh token');
          return res.status(200).json({ connected: false, reason: 'Token refresh failed' });
        }

        // Update the token in the database
        await supabaseService
          .from('email_auth')
          .update({
            access_token: token,
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour from now
          })
          .eq('id', authData.id);

        console.log('Token refreshed successfully');
        return res.status(200).json({ connected: true, refreshed: true });
        
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);

        // If it's an invalid_grant error, the refresh token is invalid
        // We need to clear the old auth data so user can re-authenticate
        if (refreshError.message && refreshError.message.includes('invalid_grant')) {
          console.log('Refresh token is invalid, clearing auth data for re-authentication');
          try {
            await supabaseService
              .from('email_auth')
              .delete()
              .eq('user_id', userId)
              .eq('provider', 'google');

            // Also clear the profile permission so they get prompted to re-auth
            await supabaseService
              .from('profiles')
              .update({ email_scan_permission: false })
              .eq('id', userId);

            console.log('Cleared invalid auth data');
          } catch (clearError) {
            console.error('Error clearing invalid auth data:', clearError);
          }
        }

        return res.status(200).json({
          connected: false,
          reason: 'Token refresh failed',
          requiresReauth: refreshError.message && refreshError.message.includes('invalid_grant')
        });
      }
    }

    // Token is still valid
    console.log('Gmail connection is valid');
    return res.status(200).json({ connected: true });

  } catch (error) {
    console.error('Error checking Gmail connection:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
