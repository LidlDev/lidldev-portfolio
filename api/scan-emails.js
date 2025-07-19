import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

// Regular expressions for bill detection
const BILL_KEYWORDS = [
  'invoice', 'bill', 'payment due', 'due date', 'statement',
  'autopay', 'auto-pay', 'direct debit', 'scheduled payment',
  'utility bill', 'monthly bill', 'subscription renewal',
  // Adding more general terms to catch more potential bills
  'payment', 'due', 'balance', 'account', 'monthly', 'service',
  'utility', 'electricity', 'gas', 'water', 'internet', 'phone',
  'rent', 'mortgage', 'insurance'
];

// Essential bill types that should be prioritized
const ESSENTIAL_BILL_TYPES = [
  'electricity', 'electric bill', 'power bill', 'energy bill',
  'gas bill', 'water bill', 'utility bill', 'utilities',
  'rent', 'mortgage', 'lease payment', 'housing',
  'internet', 'broadband', 'wifi', 'phone bill', 'mobile bill',
  'insurance', 'health insurance', 'car insurance', 'home insurance',
  'council tax', 'property tax', 'rates', 'homeowners association',
  'loan payment', 'credit card bill', 'minimum payment'
];

// Strong bill indicators (presence of these terms increases confidence significantly)
const STRONG_BILL_INDICATORS = [
  'invoice #', 'invoice number', 'account number', 'customer #',
  'payment due on', 'please pay by', 'amount due', 'total due',
  'minimum payment', 'autopay scheduled', 'direct debit scheduled',
  'monthly statement', 'billing period', 'billing date',
  'your bill is ready', 'new bill available'
];

// Urgent payment reminders (these indicate a bill that needs immediate attention)
const URGENT_PAYMENT_REMINDERS = [
  'missed payment', 'late payment', 'overdue payment', 'payment reminder',
  'reminder your bill is due', 'payment is past due', 'bill is overdue',
  'urgent payment required', 'payment needed', 'please pay immediately',
  'final notice', 'disconnection notice', 'service interruption',
  'avoid late fees', 'avoid service interruption', 'payment deadline',
  'your payment is late', 'your account is past due', 'payment not received'
];

// Negative keywords (presence of these terms decreases confidence or excludes the email)
const NEGATIVE_KEYWORDS = [
  'save money', 'discount', 'offer', 'promotion', 'sale', 'deal',
  'transferred', 'sent you', 'receipt for your payment',
  'thank you for your payment', 'payment confirmation', 'order confirmation',
  'money transfer', 'you paid', 'you sent', 'suggestion', 'recommend',
  'invitation', 'verify your', 'confirm your', 'update your', 'welcome to'
];

// Specific services that often send non-bill emails that might be confused as bills
const NON_BILL_SERVICES = [
  'uber.com', 'ubereats', 'doordash', 'grubhub',
  'venmo', 'cashapp', 'zelle', 'facebook', 'instagram', 'twitter',
  'tiktok', 'snapchat', 'linkedin', 'pinterest', 'youtube'
];

// Common utility and essential service providers (these are likely to send actual bills)
const ESSENTIAL_SERVICES = [
  'electric', 'energy', 'power', 'gas', 'water', 'utility',
  'internet', 'broadband', 'telecom', 'fiber', 'comcast', 'xfinity',
  'verizon', 'at&t', 'sprint', 't-mobile', 'vodafone',
  'mortgage', 'rent', 'lease', 'apartment', 'property', 'housing',
  'insurance', 'bank', 'credit', 'loan', 'financial'
];

// Amount regex - matches currency amounts
const AMOUNT_REGEX = /\$\s?(\d+(?:\.\d{2})?)/g;

// Improved date regex patterns
const DUE_DATE_REGEX = /(?:due|payment due|please pay by|pay before|payment date).{1,30}((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:[,\s]+\d{2,4})?|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{2,4})?)/i;

// Fallback date regex for when no due date is explicitly mentioned
const ANY_DATE_REGEX = /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:[,\s]+\d{2,4})?|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{2,4})?)/gi;

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

// Create client for user token validation (using anon key)
const supabaseClient = supabaseUrl && supabaseAnonKey ?
  createClient(supabaseUrl, supabaseAnonKey) :
  null;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Supabase clients are initialized
    if (!supabaseService || !supabaseClient) {
      console.error('Supabase clients are not initialized due to missing environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please contact the administrator.',
        details: 'Supabase environment variables are not set'
      });
    }

    const { userId, accessToken: userAccessToken } = req.body;

    // Log request details for debugging (without exposing the full token)
    console.log('Scan emails request:', {
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
    console.log('Checking email scan permission for user:', userId);
    const { data: profile, error: profileError } = await supabaseService
      .from('profiles')
      .select('email_scan_permission')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return res.status(403).json({ error: 'Error checking email scanning permission' });
    }

    if (!profile) {
      console.error('No profile found for user:', userId);
      return res.status(403).json({ error: 'User profile not found' });
    }

    if (!profile.email_scan_permission) {
      console.log('Email scan permission not granted for user:', userId);
      return res.status(403).json({ error: 'Email scanning permission not granted' });
    }

    console.log('Email scan permission granted, checking OAuth tokens...');

    // Get the user's OAuth tokens from the database
    const { data: authData, error: authDataError } = await supabaseService
      .from('email_auth')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (authDataError) {
      console.error('Auth data error:', authDataError);
      return res.status(403).json({ error: 'Error retrieving email authentication data' });
    }

    if (!authData) {
      console.log('No OAuth tokens found for user:', userId);
      return res.status(403).json({ error: 'Email authentication not found. Please reconnect your Gmail account.' });
    }

    console.log('OAuth tokens found, expires at:', authData.expires_at);

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
        await supabaseService
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
      // Get the list of emails from the last 90 days (expanded from 30)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // Log the search query for debugging
      const searchQuery = `after:${Math.floor(ninetyDaysAgo.getTime() / 1000)}`;
      console.log(`Searching emails with query: ${searchQuery}`);

      // First try a broader search without keywords to see if we get any emails at all
      const testResponse = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 1
      });

      console.log(`Test query found ${testResponse.data.messages ? testResponse.data.messages.length : 0} emails`);

      // Now do the actual search with a broader set of terms
      // We'll use a simpler query first to get more results, then filter them in our code
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: searchQuery,
        maxResults: 50 // Increased from 20 to get more potential matches
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

        // Initial check for bill keywords
        const hasBasicBillKeywords = BILL_KEYWORDS.some(keyword =>
          content.toLowerCase().includes(keyword.toLowerCase())
        );

        if (!hasBasicBillKeywords) continue;

        // Check if this is an essential bill type
        const isEssentialBillType = ESSENTIAL_BILL_TYPES.some(type =>
          content.toLowerCase().includes(type.toLowerCase()) ||
          subject.toLowerCase().includes(type.toLowerCase())
        );

        // Check if the email is from an essential service provider
        const isFromEssentialService = ESSENTIAL_SERVICES.some(service =>
          sender.toLowerCase().includes(service.toLowerCase()) ||
          from.toLowerCase().includes(service.toLowerCase())
        );

        // Check for negative keywords that indicate this is NOT a bill
        const hasNegativeKeywords = NEGATIVE_KEYWORDS.some(keyword =>
          content.toLowerCase().includes(keyword.toLowerCase())
        );

        // Check if the email is from a service that often sends non-bill emails
        const isFromNonBillService = NON_BILL_SERVICES.some(service =>
          sender.toLowerCase().includes(service.toLowerCase())
        );

        // Check for strong bill indicators
        const hasStrongIndicators = STRONG_BILL_INDICATORS.some(indicator =>
          content.toLowerCase().includes(indicator.toLowerCase())
        );

        // Check for urgent payment reminders
        const hasUrgentReminders = URGENT_PAYMENT_REMINDERS.some(reminder =>
          content.toLowerCase().includes(reminder.toLowerCase()) ||
          subject.toLowerCase().includes(reminder.toLowerCase())
        );

        // Skip this email if it has negative keywords or is from a non-bill service
        // UNLESS it has strong bill indicators OR urgent reminders OR is an essential bill type OR is from an essential service
        if (hasNegativeKeywords || isFromNonBillService) {
          if (!hasStrongIndicators && !hasUrgentReminders && !isEssentialBillType && !isFromEssentialService) {
            console.log(`Skipping email with subject "${subject}" - has negative indicators`);
            if (hasNegativeKeywords) {
              console.log(`  Negative keywords found in: ${from}`);
            }
            if (isFromNonBillService) {
              console.log(`  Non-bill service: ${sender}`);
            }
            continue;
          }
        }

        // Start with a base confidence
        let confidence = 0.3;

        // Increase confidence for strong indicators
        if (hasStrongIndicators) {
          confidence += 0.3;
        }

        // Increase confidence for urgent payment reminders (high priority)
        if (hasUrgentReminders) {
          confidence += 0.4;
          console.log(`Found urgent payment reminder in email with subject "${subject}"`);
        }

        // Increase confidence for essential bill types
        if (isEssentialBillType) {
          confidence += 0.25;
          console.log(`Found essential bill type in email with subject "${subject}"`);
        }

        // Increase confidence for essential services
        if (isFromEssentialService) {
          confidence += 0.25;
          console.log(`Email from essential service: ${sender} - Subject: "${subject}"`);
        }

        // Extract amount
        let amount = 0;
        const amountMatches = [...content.matchAll(AMOUNT_REGEX)];

        if (amountMatches.length > 0) {
          // Use the largest amount as it's likely the total
          const amounts = amountMatches.map(match => parseFloat(match[1]));
          amount = Math.max(...amounts);
          confidence += 0.2;
        } else {
          // No amount found, this is less likely to be a bill
          confidence -= 0.1;
        }

        // Extract due date
        let dueDate = new Date();
        let foundExplicitDueDate = false;

        // First try to find an explicit due date
        const dueDateMatch = content.match(DUE_DATE_REGEX);
        if (dueDateMatch) {
          const extractedDate = dueDateMatch[1];
          try {
            const parsedDate = new Date(extractedDate);
            if (!isNaN(parsedDate.getTime())) {
              dueDate = parsedDate;
              confidence += 0.2;
              foundExplicitDueDate = true;
            }
          } catch (e) {
            // Try a different parsing approach
            try {
              // Handle formats like "January 15th" or "15th of January"
              const cleanedDate = extractedDate
                .replace(/(st|nd|rd|th)/g, '')
                .replace(/of\s+/g, '');

              const parsedDate = new Date(cleanedDate);
              if (!isNaN(parsedDate.getTime())) {
                dueDate = parsedDate;
                confidence += 0.2;
                foundExplicitDueDate = true;
              }
            } catch (e2) {
              // Use default date
            }
          }
        }

        // If no explicit due date was found, look for any date in the email
        if (!foundExplicitDueDate) {
          const allDates = [...content.matchAll(ANY_DATE_REGEX)];

          if (allDates.length > 0) {
            // Try to find a date that's in the future
            const now = new Date();
            let futureDates = [];

            for (const dateMatch of allDates) {
              try {
                const parsedDate = new Date(dateMatch[0]);
                if (!isNaN(parsedDate.getTime()) && parsedDate > now) {
                  futureDates.push(parsedDate);
                }
              } catch (e) {
                // Skip this date
              }
            }

            if (futureDates.length > 0) {
              // Use the earliest future date
              dueDate = new Date(Math.min(...futureDates.map(d => d.getTime())));
              confidence += 0.1;
            } else {
              // No future dates found, default to 2 weeks from now
              dueDate = new Date();
              dueDate.setDate(dueDate.getDate() + 14);
            }
          } else {
            // No dates found at all, default to 2 weeks from now
            dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
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

      // Log all detected bills before filtering
      console.log('All detected bills before filtering:');
      detectedBills.forEach(bill => {
        console.log(`- Title: "${bill.title}", Amount: $${bill.amount}, Due: ${new Date(bill.dueDate).toLocaleDateString()}, Confidence: ${bill.confidence.toFixed(2)}, Source: ${bill.source}`);
      });

      // Filter out low confidence bills
      const filteredBills = detectedBills.filter(bill => bill.confidence >= 0.5);

      // Log filtered out bills
      const filteredOutBills = detectedBills.filter(bill => bill.confidence < 0.5);
      console.log(`Filtered out ${filteredOutBills.length} low-confidence bills:`);
      filteredOutBills.forEach(bill => {
        console.log(`- FILTERED OUT: "${bill.title}", Amount: $${bill.amount}, Due: ${new Date(bill.dueDate).toLocaleDateString()}, Confidence: ${bill.confidence.toFixed(2)}, Source: ${bill.source}`);
      });

      // Sort by confidence (highest first)

      const sortedBills = filteredBills.sort((a, b) => b.confidence - a.confidence);

      // Check if these bills already exist in the database
      const { data: existingBills, error: billsError } = await supabaseService
        .from('detected_bills')
        .select('source, amount, approved')
        .eq('user_id', userId);

      if (billsError) {
        throw new Error('Error checking existing bills');
      }

      console.log(`Found ${existingBills ? existingBills.length : 0} existing bills in database`);

      // Only filter out bills that already exist AND were approved
      // This allows previously declined bills to be suggested again
      newBills = sortedBills.filter(bill =>
        !existingBills?.some(existing =>
          existing.source === bill.source &&
          existing.amount === bill.amount &&
          existing.approved === true
        )
      );

      // Log how many bills were filtered out as duplicates
      console.log(`Filtered out ${sortedBills.length - newBills.length} bills that were already approved`);
    } catch (emailError) {
      console.error('Error processing emails:', emailError);
      return res.status(500).json({ error: 'Error processing emails: ' + emailError.message });
    }

    // Log if no bills were found
    if (newBills.length === 0) {
      console.log('No bills found in emails.');
    }

    // Insert new bills into the database
    if (newBills.length > 0) {
      const { error: insertError } = await supabaseService
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
        console.error('Error storing detected bills:', insertError);
        return res.status(500).json({ error: 'Error storing detected bills' });
      }
    }

    // Log the final bills that will be returned
    console.log('Final bills being returned:');
    newBills.forEach(bill => {
      console.log(`- APPROVED: "${bill.title}", Amount: $${bill.amount}, Due: ${new Date(bill.dueDate).toLocaleDateString()}, Confidence: ${bill.confidence.toFixed(2)}, Source: ${bill.source}`);
    });

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
