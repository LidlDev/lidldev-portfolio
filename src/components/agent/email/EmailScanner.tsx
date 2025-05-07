import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { RotateCw, Mail, AlertCircle, CheckCircle } from 'lucide-react';
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

  // This would be replaced with actual email scanning functionality
  // For now, we'll simulate finding bills with a timeout
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
      // In a real implementation, this would call an API endpoint
      // that would use OAuth to access the user's emails
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a simple random ID
      const generateId = () => Math.random().toString(36).substring(2, 15);

      // Mock detected bills
      const mockBills: DetectedBill[] = [
        {
          id: generateId(),
          title: 'Electric Bill',
          amount: 89.99,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          category: 'Utilities',
          confidence: 0.92,
          source: 'electric@example.com',
          approved: false
        },
        {
          id: generateId(),
          title: 'Internet Service',
          amount: 65.00,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          category: 'Utilities',
          confidence: 0.87,
          source: 'internet@example.com',
          approved: false
        },
        {
          id: generateId(),
          title: 'Streaming Subscription',
          amount: 14.99,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          category: 'Entertainment',
          confidence: 0.75,
          source: 'streaming@example.com',
          approved: false
        }
      ];

      // Store the detected bills in Supabase for this user
      // In a real implementation, this would be done server-side
      try {
        // First, check if we already have these bills stored
        const { data: existingBills } = await supabase
          .from('detected_bills')
          .select('source, amount')
          .eq('user_id', user.id);

        // Filter out bills that already exist
        const newBills = mockBills.filter(bill =>
          !existingBills?.some(existing =>
            existing.source === bill.source && existing.amount === bill.amount
          )
        );

        if (newBills.length > 0) {
          // Insert new bills
          await supabase.from('detected_bills').insert(
            newBills.map(bill => ({
              title: bill.title,
              amount: bill.amount,
              due_date: bill.dueDate.toISOString(),
              category: bill.category,
              confidence: bill.confidence,
              source: bill.source,
              approved: false,
              user_id: user.id
            }))
          );

          toast.success(`Found ${newBills.length} new bills in your emails`);
          onBillsDetected(newBills);
        } else {
          toast.info('No new bills found in your emails');
        }
      } catch (error) {
        console.error('Error storing detected bills:', error);
      }
    } catch (error) {
      console.error('Error scanning emails:', error);
      toast.error('Failed to scan emails. Please try again later.');
    } finally {
      setScanning(false);
    }
  };

  const handleGrantPermission = () => {
    setPermissionGranted(true);
    setShowPermissionDialog(false);

    // Store the permission in user metadata
    if (user) {
      supabase.from('profiles')
        .update({ email_scan_permission: true })
        .eq('id', user.id)
        .then(() => {
          toast.success('Email scanning permission granted');
          // Start scanning immediately
          scanEmails();
        })
        .catch(err => {
          console.error('Error updating user profile:', err);
        });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-primary">Email Bill Detection</h3>
        <button
          onClick={scanEmails}
          disabled={scanning}
          className="flex items-center px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {scanning ? (
            <>
              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
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

      {!permissionGranted && !showPermissionDialog && (
        <p className="text-sm text-primary/70 mb-2">
          Scan your emails to automatically detect bills and upcoming payments.
        </p>
      )}

      {showPermissionDialog && (
        <div className="glass-card p-4 mb-4 border border-primary/20 animate-scale-in">
          <div className="flex items-start mb-3">
            <AlertCircle className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
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
          <CheckCircle className="w-4 h-4 mr-1" />
          Email scanning permission granted
        </div>
      )}
    </div>
  );
};

export default EmailScanner;
