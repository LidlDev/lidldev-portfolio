import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

// Regular expressions for bill detection
const BILL_KEYWORDS = [
  'invoice', 'bill', 'payment', 'due', 'statement', 'balance',
  'utility', 'subscription', 'receipt', 'charge', 'amount'
];

const AMOUNT_REGEX = /\$\s?(\d+(?:\.\d{2})?)/g;
const DATE_REGEX = /(?:due|payment).{1,20}((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:[,\s]+\d{2,4})?|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;

// Category detection
const CATEGORY_KEYWORDS = {
  'Utilities': ['electric', 'electricity', 'power', 'energy', 'utility', 'gas', 'water', 'sewage'],
  'Internet': ['internet', 'wifi', 'broadband', 'fiber', 'connection'],
  'Phone': ['phone', 'mobile', 'wireless', 'cell', 'cellular'],
  'Streaming': ['streaming', 'subscription', 'netflix', 'hulu', 'disney', 'spotify', 'apple music', 'prime'],
  'Housing': ['rent', 'mortgage', 'lease', 'housing', 'apartment', 'condo', 'home'],
  'Insurance': ['insurance', 'coverage', 'policy', 'premium'],
  'Credit Card': ['credit card', 'credit', 'card', 'statement', 'balance'],
  'Other': []
};

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
const supabase = supabaseUrl && supabaseServiceKey ?
  createClient(supabaseUrl, supabaseServiceKey) :
  null;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.error('Supabase client is not initialized due to missing environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please contact the administrator.',
        details: 'Supabase environment variables are not set'
      });
    }

    const { userId, accessToken: userAccessToken } = req.body;

    if (!userId || !userAccessToken) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify the user's token
    const { data: user, error: authError } = await supabase.auth.getUser(userAccessToken);

    if (authError || !user || user.user.id !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if Google OAuth credentials are set
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const nextPublicUrl = process.env.NEXT_PUBLIC_URL;

    // Log environment variables (redacted for security)
    console.log('Environment variables check:', {
      GOOGLE_CLIENT_ID: googleClientId ? 'Set' : 'Not set',
      GOOGLE_CLIENT_SECRET: googleClientSecret ? 'Set' : 'Not set',
      NEXT_PUBLIC_URL: nextPublicUrl ? nextPublicUrl : 'Not set',
      SUPABASE_URL: supabaseUrl ? 'Set' : 'Not set',
      SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'Set' : 'Not set'
    });

    if (!googleClientId || !googleClientSecret) {
      return res.status(503).json({
        error: 'Email scanning is not available. Please contact the administrator to set up Google OAuth credentials.'
      });
    }

    if (!nextPublicUrl) {
      console.warn('NEXT_PUBLIC_URL is not set. Using default redirect URI.');
    }

    // Check if the user has granted permission to scan emails
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email_scan_permission')
      .eq('id', userId)
      .single();

    if (profileError || !profile || !profile.email_scan_permission) {
      return res.status(403).json({ error: 'Email scanning permission not granted' });
    }

    // Get the user's OAuth tokens from the database
    const { data: authData, error: authDataError } = await supabase
      .from('email_auth')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (authDataError || !authData) {
      return res.status(403).json({ error: 'Email authentication not found. Please reconnect your Gmail account.' });
    }

    // Check if the token is expired and refresh if needed
    let gmailToken = authData.access_token;
    if (authData.expires_at && new Date(authData.expires_at) < new Date()) {
      console.log('Token expired, refreshing...');

      if (!authData.refresh_token) {
        return res.status(403).json({ error: 'Refresh token not available. Please reconnect your Gmail account.' });
      }

      try {
        const oauth2Client = new google.auth.OAuth2(
          googleClientId,
          googleClientSecret,
          `${nextPublicUrl}/api/email-auth-callback`
        );

        oauth2Client.setCredentials({
          refresh_token: authData.refresh_token
        });

        const { token } = await oauth2Client.getAccessToken();
        gmailToken = token;

        // Update the token in the database
        await supabase
          .from('email_auth')
          .update({
            access_token: gmailToken,
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour from now
          })
          .eq('id', authData.id);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return res.status(403).json({ error: 'Failed to refresh authentication. Please reconnect your Gmail account.' });
      }
    }

    // Initialize the Gmail API client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: gmailToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Process emails to find bills
    let newBills = [];

    try {
      // Get the list of emails from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: `after:${Math.floor(thirtyDaysAgo.getTime() / 1000)} (${BILL_KEYWORDS.join(' OR ')})`,
        maxResults: 20
      });

      const messages = response.data.messages || [];
      console.log(`Found ${messages.length} potential bill emails`);

      // Process each email to detect bills
      const detectedBills = [];

      for (const message of messages) {
        // Get the full email content
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        // Extract email data
        const headers = email.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const from = headers.find(h => h.name === 'From')?.value || '';
        const sender = from.match(/<(.+?)>/) ? from.match(/<(.+?)>/)[1] : from;

        // Get email body
        let body = '';

        if (email.data.payload.parts) {
          // Multipart email
          for (const part of email.data.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body.data) {
              body += Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
          }
        } else if (email.data.payload.body.data) {
          // Simple email
          body = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8');
        }

        // Combine subject and body for analysis
        const content = `${subject}\n${body}`;

        // Check if this looks like a bill
        const isBill = BILL_KEYWORDS.some(keyword =>
          content.toLowerCase().includes(keyword.toLowerCase())
        );

        if (!isBill) continue;

        // Extract amount
        let amount = 0;
        let confidence = 0.5;
        const amountMatches = [...content.matchAll(AMOUNT_REGEX)];

        if (amountMatches.length > 0) {
          // Use the largest amount as it's likely the total
          const amounts = amountMatches.map(match => parseFloat(match[1]));
          amount = Math.max(...amounts);
          confidence += 0.2;
        }

        // Extract due date
        let dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // Default to 2 weeks from now

        const dateMatch = content.match(DATE_REGEX);
        if (dateMatch) {
          const extractedDate = dateMatch[1];
          try {
            const parsedDate = new Date(extractedDate);
            if (!isNaN(parsedDate.getTime())) {
              dueDate = parsedDate;
              confidence += 0.1;
            }
          } catch (e) {
            // Use default date
          }
        }

        // Determine category
        let category = 'Other';
        let highestMatchCount = 0;

        for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
          if (cat === 'Other') continue;

          const matchCount = keywords.filter(keyword =>
            content.toLowerCase().includes(keyword.toLowerCase())
          ).length;

          if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            category = cat;
            confidence += 0.05;
          }
        }

        // Extract title from subject
        let title = subject.replace(/re:/i, '').trim();
        if (title.length > 50) {
          title = title.substring(0, 47) + '...';
        }

        // If title is empty or just contains "statement" or similar, use sender + category
        if (!title || BILL_KEYWORDS.some(kw => title.toLowerCase() === kw.toLowerCase())) {
          const senderName = sender.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim();
          title = `${senderName.charAt(0).toUpperCase() + senderName.slice(1)} ${category}`;
        }

        // Add to detected bills
        detectedBills.push({
          title,
          amount,
          dueDate: dueDate.toISOString(),
          category,
          confidence: Math.min(0.95, confidence), // Cap at 0.95
          source: sender,
          approved: false,
          userId
        });
      }

      console.log(`Detected ${detectedBills.length} bills`);

      // Sort by confidence (highest first)
      const sortedBills = detectedBills.sort((a, b) => b.confidence - a.confidence);

      // Check if these bills already exist in the database
      const { data: existingBills, error: billsError } = await supabase
        .from('detected_bills')
        .select('source, amount')
        .eq('user_id', userId);

      if (billsError) {
        throw new Error('Error checking existing bills');
      }

      // Filter out bills that already exist
      newBills = sortedBills.filter(bill =>
        !existingBills?.some(existing =>
          existing.source === bill.source && existing.amount === bill.amount
        )
      );
    } catch (emailError) {
      console.error('Error processing emails:', emailError);
      return res.status(500).json({ error: 'Error processing emails: ' + emailError.message });
    }

    // Insert new bills into the database
    if (newBills.length > 0) {
      const { error: insertError } = await supabase
        .from('detected_bills')
        .insert(
          newBills.map(bill => ({
            title: bill.title,
            amount: bill.amount,
            due_date: bill.dueDate,
            category: bill.category,
            confidence: bill.confidence,
            source: bill.source,
            approved: false,
            user_id: bill.userId
          }))
        );

      if (insertError) {
        return res.status(500).json({ error: 'Error storing detected bills' });
      }
    }

    // Return the detected bills
    return res.status(200).json({
      success: true,
      bills: newBills.map(bill => ({
        ...bill,
        dueDate: new Date(bill.dueDate)
      })),
      count: newBills.length
    });
  } catch (error) {
    console.error('Error scanning emails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
