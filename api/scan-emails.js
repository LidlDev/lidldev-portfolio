import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, accessToken } = req.body;

    if (!userId || !accessToken) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify the user's token
    const { data: user, error: authError } = await supabase.auth.getUser(accessToken);
    
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

    // In a real implementation, this would connect to the user's email provider
    // using OAuth and scan for bills. For now, we'll simulate this with mock data.
    
    // Simulate email scanning delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock detected bills
    const mockBills = [
      {
        title: 'Electric Bill',
        amount: 89.99,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        category: 'Utilities',
        confidence: 0.92,
        source: 'electric@example.com',
        approved: false,
        userId
      },
      {
        title: 'Internet Service',
        amount: 65.00,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        category: 'Utilities',
        confidence: 0.87,
        source: 'internet@example.com',
        approved: false,
        userId
      },
      {
        title: 'Streaming Subscription',
        amount: 14.99,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        category: 'Entertainment',
        confidence: 0.75,
        source: 'streaming@example.com',
        approved: false,
        userId
      }
    ];

    // Check if these bills already exist in the database
    const { data: existingBills, error: billsError } = await supabase
      .from('detected_bills')
      .select('source, amount')
      .eq('user_id', userId);

    if (billsError) {
      return res.status(500).json({ error: 'Error checking existing bills' });
    }

    // Filter out bills that already exist
    const newBills = mockBills.filter(bill => 
      !existingBills?.some(existing => 
        existing.source === bill.source && existing.amount === bill.amount
      )
    );

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
