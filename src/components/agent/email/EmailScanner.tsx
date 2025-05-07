import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

/**
 * A simplified email scanner component that doesn't use any problematic icons.
 * This is a placeholder for the actual email scanning functionality.
 */
const EmailScanner: React.FC<EmailScannerProps> = ({ onBillsDetected }) => {
  const { user } = useAuth();

  const scanEmails = async () => {
    if (!user) {
      toast.error('You must be logged in to scan emails');
      return;
    }

    toast.info('Email scanning feature is coming soon!');

    // For demonstration purposes, we'll just show a message
    // In a real implementation, this would scan emails and detect bills
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-primary">Email Bill Detection</h3>
        <button
          onClick={scanEmails}
          className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Scan Emails
        </button>
      </div>

      <p className="text-sm text-primary/70 mb-2">
        Scan your emails to automatically detect bills and upcoming payments.
      </p>
    </div>
  );
};

export default EmailScanner;
