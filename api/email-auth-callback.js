import { createClient } from '@supabase/supabase-js';

// Helper function to create redirect URLs with return path
function createRedirectUrl(returnPath, isSuccess = false, errorType = null) {
  const baseUrl = returnPath || '/agent';
  const separator = baseUrl.includes('?') ? '&' : '?';

  if (isSuccess) {
    return `${baseUrl}${separator}auth_success=true`;
  } else if (errorType) {
    return `${baseUrl}${separator}auth_error=${encodeURIComponent(errorType)}`;
  }

  return baseUrl;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Check if Supabase environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase environment variables are not set:', {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'Set' : 'Not set',
    SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'Set' : 'Not set'
  });
}

// Only create the Supabase client if the URL and key are available
const supabaseService = supabaseUrl && supabaseServiceKey ?
  createClient(supabaseUrl, supabaseServiceKey) :
  null;

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_URL
  ? `${process.env.NEXT_PUBLIC_URL}/api/email-auth-callback`
  : 'http://localhost:3000/api/email-auth-callback';

export default async function handler(req, res) {
  // Only allow GET requests for OAuth callback
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase client is initialized
    if (!supabaseService) {
      console.error('Supabase client is not initialized due to missing environment variables');
      return res.redirect('/agent?auth_error=server_configuration_error');
    }

    const { code, error } = req.query;

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect('/agent?auth_error=' + encodeURIComponent(error));
    }

    if (!code) {
      return res.redirect('/agent?auth_error=missing_code');
    }

    // Get the user ID from the state parameter
    const { state } = req.query;

    if (!state) {
      console.error('State parameter not found in the callback');
      return res.redirect('/agent?auth_error=missing_state_parameter');
    }

    let userId, returnPath;
    try {
      // Decode the state parameter to get the user ID and return path
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      userId = stateData.userId;
      returnPath = stateData.returnPath;

      console.log('Extracted user ID from state parameter:', userId);
      console.log('Extracted return path from state parameter:', returnPath);

      if (!userId) {
        throw new Error('User ID not found in state parameter');
      }
    } catch (error) {
      console.error('Error parsing state parameter:', error);
      return res.redirect('/agent?auth_error=invalid_state_parameter');
    }

    // Continue with the user ID from the state parameter
    return handleOAuthWithUserId(userId, code, res, returnPath);
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return res.redirect('/agent?auth_error=server_error');
  }
}

// Helper function to handle the OAuth callback with a specific user ID
async function handleOAuthWithUserId(userId, code, res, returnPath = null) {
  try {
    // Check if Supabase client is initialized
    if (!supabaseService) {
      console.error('Supabase client is not initialized due to missing environment variables');
      return res.redirect('/agent?auth_error=server_configuration_error');
    }

    // Log environment variables (redacted for security)
    console.log('Environment variables check in email-auth-callback:', {
      GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
      GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : 'Not set',
      REDIRECT_URI: REDIRECT_URI,
      SUPABASE_URL: supabaseUrl ? 'Set' : 'Not set',
      SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'Set' : 'Not set'
    });

    // Exchange the authorization code for access and refresh tokens
    let tokenResponse;
    let tokenData;

    try {
      tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      console.log('Token response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        let errorMessage = 'Token exchange failed';
        try {
          const errorData = await tokenResponse.json();
          console.error('Token exchange error:', errorData);
          errorMessage = errorData.error_description || errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse token error response:', e);
          // Try to get the text response
          try {
            const errorText = await tokenResponse.text();
            console.error('Token error response text:', errorText);
          } catch (textError) {
            console.error('Failed to get token error response text:', textError);
          }
        }
        return res.redirect(`/agent?auth_error=${encodeURIComponent(errorMessage)}`);
      }

      tokenData = await tokenResponse.json();
    } catch (fetchError) {
      console.error('Fetch error during token exchange:', fetchError);
      return res.redirect(`/agent?auth_error=${encodeURIComponent('Network error during token exchange')}`);
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Calculate the expiration time
    const expiresAt = new Date(Date.now() + (expires_in * 1000)).toISOString();

    // Store the tokens in Supabase - first try to update, then insert if not exists
    let finalError;

    console.log('Attempting to store tokens for user:', userId);

    // Try to update existing record first
    const { data: updateData, error: updateExistingError } = await supabaseService
      .from('email_auth')
      .update({
        access_token,
        refresh_token,
        expires_at: expiresAt,
      })
      .eq('user_id', userId)
      .eq('provider', 'google')
      .select();

    if (updateExistingError) {
      console.log('Update failed, trying insert:', updateExistingError.message);
      // If update failed, try to insert new record
      const { data: insertData, error: insertError } = await supabaseService
        .from('email_auth')
        .insert({
          user_id: userId,
          access_token,
          refresh_token,
          expires_at: expiresAt,
          provider: 'google',
        })
        .select();

      if (insertError) {
        console.error('Insert also failed:', insertError);
        finalError = insertError;
      } else {
        console.log('Insert successful:', insertData);
      }
    } else if (updateData && updateData.length > 0) {
      console.log('Update successful:', updateData);
    } else {
      console.log('Update returned no data, trying insert...');
      // Update succeeded but no rows were affected, try insert
      const { data: insertData, error: insertError } = await supabaseService
        .from('email_auth')
        .insert({
          user_id: userId,
          access_token,
          refresh_token,
          expires_at: expiresAt,
          provider: 'google',
        })
        .select();

      if (insertError) {
        console.error('Insert failed:', insertError);
        finalError = insertError;
      } else {
        console.log('Insert successful:', insertData);
      }
    }

    if (finalError) {
      console.error('Error storing tokens:', finalError);
      console.error('Token storage error details:', {
        message: finalError.message,
        details: finalError.details,
        hint: finalError.hint,
        code: finalError.code
      });
      return res.redirect(createRedirectUrl(returnPath, false, 'token_storage_failed'));
    }

    // Update the user's profile to indicate email scanning permission
    const { error: profileError } = await supabaseService
      .from('profiles')
      .update({ email_scan_permission: true })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Continue anyway, as the tokens were stored successfully
    }

    console.log('OAuth flow completed successfully for user:', userId);

    // Verify that the tokens were actually saved
    try {
      const { data: verifyData, error: verifyError } = await supabaseService
        .from('email_auth')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .single();

      if (verifyError || !verifyData) {
        console.error('CRITICAL: Tokens were not saved properly!', verifyError);
        return res.redirect(createRedirectUrl(returnPath, false, 'token_verification_failed'));
      } else {
        console.log('✅ Tokens verified in database:', {
          userId: verifyData.user_id,
          provider: verifyData.provider,
          expiresAt: verifyData.expires_at,
          hasAccessToken: !!verifyData.access_token,
          hasRefreshToken: !!verifyData.refresh_token
        });
      }
    } catch (verifyErr) {
      console.error('Error verifying saved tokens:', verifyErr);
      return res.redirect(createRedirectUrl(returnPath, false, 'token_verification_error'));
    }

    // Redirect back to the return path or agent page with success
    return res.redirect(createRedirectUrl(returnPath, true));
  } catch (error) {
    console.error('Error in handleOAuthWithUserId:', error);
    return res.redirect(createRedirectUrl(returnPath, false, 'server_error'));
  }
}
