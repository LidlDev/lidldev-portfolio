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
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Use the API endpoint to scan emails
  const scanEmails = async () => {
    if (!user) {
      toast.error('You must be logged in to scan emails');
      return;
    }

    if (!permissionGranted) {
      setShowPermissionDialog(true);
      return;
    }

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

  // Check for OAuth callback parameters
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
    if (user) {
      supabase
        .from('profiles')
        .select('email_scan_permission')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.email_scan_permission) {
            setPermissionGranted(true);
          }
        });
    }
  }, [user]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-primary">Email Bill Detection</h3>
        <button
          onClick={scanEmails}
          disabled={scanning || (!permissionGranted && !showPermissionDialog)}
          className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
            permissionGranted
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:opacity-50`}
        >
          {scanning ? (
            <>
              <span className="w-4 h-4 mr-2 animate-spin">⟳</span>
              Scanning...
            </>
          ) : permissionGranted ? (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Scan Emails
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Grant Permission
            </>
          )}
        </button>
      </div>

      {!permissionGranted && !showPermissionDialog && (
        <p className="text-sm text-primary/70 mb-2">
          Grant permission to scan your emails for bills and upcoming payments.
        </p>
      )}

      {showPermissionDialog && (
        <div className="glass-card p-4 mb-4 border border-primary/20 animate-scale-in">
          <div className="flex items-start mb-3">
            <span className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <h4 className="font-medium">Permission Required</h4>
              <p className="text-sm text-primary/70 mt-1">
                To scan your emails for bills, we need your permission. We'll only look for bill-related emails and won't store your email content.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowPermissionDialog(false)}
              className="px-3 py-1.5 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGrantPermission}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Grant Permission
            </button>
          </div>
        </div>
      )}

      {permissionGranted && (
        <div className="flex items-center text-sm text-green-600 mb-2">
          <span className="w-4 h-4 mr-1 text-green-600">✓</span>
          Email scanning permission granted
        </div>
      )}
    </div>
  );
};

export default EmailScanner;
