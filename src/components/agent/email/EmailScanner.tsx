import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

interface EmailScannerProps {
  onBillsDetected: (bills: DetectedBill[]) => void;
}

export interface DetectedBill {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  category: string;
  confidence: number;
  source: string;
  approved: boolean;
}

const EmailScanner: React.FC<EmailScannerProps> = ({ onBillsDetected }) => {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  // We'll initialize with false and update in useEffect
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Use the API endpoint to scan emails
  const scanEmails = async () => {
    if (!user) {
      toast.error('You must be logged in to scan emails');
      return;
    }

    // Check if permission is already granted
    if (!permissionGranted) {
      // First check if we have OAuth tokens or permission in the database
      try {
        const { data: authData } = await supabase
          .from('email_auth')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .single();

        if (authData) {
          // We have OAuth tokens, so we can proceed
          setPermissionGranted(true);
        } else {
          // No OAuth tokens, check profile permissions
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email_scan_permission')
            .eq('id', user.id)
            .single();

          if (profileData?.email_scan_permission) {
            // We have permission in the profile, so we can proceed
            setPermissionGranted(true);
          } else {
            // No permission found, show the permission dialog
            setShowPermissionDialog(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        // If there's an error, show the permission dialog to be safe
        setShowPermissionDialog(true);
        return;
      }
    }

    // If we get here, we have permission
    setScanning(true);

    try {
      // Get the user's session
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        toast.error('Authentication error. Please log in again.');
        setScanning(false);
        return;
      }

      // Call the API endpoint to scan emails
      const response = await fetch('/api/scan-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          accessToken
        }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to scan emails');
        } catch (jsonError) {
          // If the response is not valid JSON, use a generic error message
          throw new Error('Failed to scan emails. The server returned an invalid response.');
        }
      }

      const data = await response.json();

      // Generate IDs for the bills (the API doesn't include IDs)
      const generateId = () => Math.random().toString(36).substring(2, 15);

      // Process the detected bills
      const detectedBills: DetectedBill[] = data.bills.map((bill: any) => ({
        id: generateId(),
        title: bill.title,
        amount: bill.amount,
        dueDate: new Date(bill.dueDate),
        category: bill.category,
        confidence: bill.confidence,
        source: bill.source,
        approved: bill.approved
      }));

      if (detectedBills.length > 0) {
        toast.success(`Found ${detectedBills.length} new bills in your emails`);
        onBillsDetected(detectedBills);
      } else {
        toast.info('No new bills found in your emails');
      }
    } catch (error) {
      console.error('Error scanning emails:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to scan emails. Please try again later.');
    } finally {
      setScanning(false);
    }
  };

  const handleGrantPermission = () => {
    setShowPermissionDialog(false);

    // Redirect to the OAuth flow
    if (user) {
      // First check if we already have OAuth tokens
      supabase
        .from('email_auth')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            // No tokens found, redirect to OAuth flow
            // Use window.location to redirect to the API endpoint
            // The user ID will be passed via the state parameter
            window.location.href = `/api/email-auth?userId=${encodeURIComponent(user.id)}`;
          } else {
            // Tokens found, update permission and scan emails
            setPermissionGranted(true);

            supabase.from('profiles')
              .update({ email_scan_permission: true })
              .eq('id', user.id)
              .then(({ error }) => {
                if (error) {
                  console.error('Error updating user profile:', error);
                  return;
                }

                toast.success('Email scanning permission granted');
                // Start scanning immediately
                scanEmails();
              });
          }
        });
    }
  };

  // Check for OAuth callback parameters and existing permissions
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const authError = urlParams.get('auth_error');

    if (authSuccess === 'true' && user) {
      setPermissionGranted(true);
      toast.success('Email access granted successfully');

      // Remove the query parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // Show scanning in progress
      setScanning(true);

      // Start scanning emails with a slight delay to allow UI to update
      setTimeout(() => {
        scanEmails();
      }, 500);
    } else if (authError && user) {
      // Handle specific error cases
      if (authError === 'oauth_credentials_not_set') {
        toast.error('Email scanning is not available. Please contact the administrator to set up Google OAuth credentials.');
      } else if (authError === 'server_configuration_error') {
        toast.error('Server configuration error. Please contact the administrator to set up the required environment variables.');
      } else if (authError === 'missing_state_parameter' || authError === 'invalid_state_parameter') {
        toast.error('Authentication error: Invalid or missing state parameter. Please try again.');
      } else {
        toast.error(`Email access error: ${authError}`);
      }

      // Remove the query parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // Check if the user already has permission
    const checkPermission = async () => {
      if (!user) return;

      try {
        // First check if we have OAuth tokens
        const { data: authData, error: authError } = await supabase
          .from('email_auth')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .single();

        if (!authError && authData) {
          console.log('Found existing OAuth tokens');
          setPermissionGranted(true);
          return;
        }

        // If no OAuth tokens, check profile permissions
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email_scan_permission')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData && profileData.email_scan_permission) {
          console.log('Found email_scan_permission in profile');
          setPermissionGranted(true);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };

    checkPermission();
  }, [user]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-primary">Email Bill Detection</h3>
        <button
          onClick={scanEmails}
          disabled={scanning}
          className="flex items-center px-3 py-1.5 rounded-lg transition-colors bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Scan Emails
            </>
          )}
        </button>
      </div>

      {!showPermissionDialog && (
        <p className="text-sm text-primary/70 mb-2">
          Scan your emails to automatically detect bills and upcoming payments.
        </p>
      )}

      {showPermissionDialog && (
        <div className="glass-card p-4 mb-4 border border-primary/20 animate-scale-in">
          <div className="flex items-start mb-4">
            <span className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <h4 className="font-medium">Email Access Permission Required</h4>
              <p className="text-sm text-primary/70 mt-1">
                To scan your emails for bills, we need your permission to access your Gmail account. Here's what you should know:
              </p>
              <ul className="text-sm text-primary/70 mt-2 list-disc pl-5 space-y-1">
                <li>We'll only look for bill-related emails</li>
                <li>We won't store your email content</li>
                <li>We'll only extract bill information (amount, due date, etc.)</li>
                <li>You can revoke access at any time in your Google account settings</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowPermissionDialog(false)}
              className="px-3 py-1.5 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={handleGrantPermission}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Connect Gmail
            </button>
          </div>
        </div>
      )}

      {permissionGranted && (
        <div className="flex items-center text-xs text-green-600 mb-2 opacity-80">
          <span className="w-3 h-3 mr-1 text-green-600">✓</span>
          Gmail connected
        </div>
      )}
    </div>
  );
};

export default EmailScanner;
