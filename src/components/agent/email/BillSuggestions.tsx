import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { DetectedBill } from './EmailScanner';
import { Mail, Calendar, X, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/agentData';
import { toast } from 'sonner';

interface BillSuggestionsProps {
  initialBills?: DetectedBill[];
  onBillApproved: (bill: DetectedBill) => void;
  onBillRejected: (billId: string) => void;
}

const BillSuggestions: React.FC<BillSuggestionsProps> = ({
  initialBills = [],
  onBillApproved,
  onBillRejected
}) => {
  const { user } = useAuth();
  const [bills, setBills] = useState<DetectedBill[]>(initialBills);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('BillSuggestions useEffect triggered, initialBills:', initialBills);

    // If we have initialBills (from EmailScanner), use them immediately for better UX
    if (initialBills.length > 0) {
      console.log('Using initialBills immediately:', initialBills);
      setBills(prevBills => {
        // Merge with existing bills, avoiding duplicates
        const existingSources = prevBills.map(b => b.source);
        const newBills = initialBills.filter(b => !existingSources.includes(b.source));
        return [...prevBills, ...newBills];
      });
    }

    // Always also fetch from database to get complete list
    const fetchDetectedBills = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('detected_bills')
          .select('*')
          .eq('user_id', user.id)
          .eq('approved', false)
          .order('due_date', { ascending: true });

        if (error) throw error;

        const formattedBills: DetectedBill[] = (data || []).map(bill => ({
          id: bill.id,
          title: bill.title,
          amount: bill.amount,
          dueDate: new Date(bill.due_date),
          category: bill.category,
          confidence: bill.confidence,
          source: bill.source,
          approved: bill.approved
        }));

        console.log('BillSuggestions fetched bills from database:', formattedBills);
        setBills(formattedBills);
      } catch (error) {
        console.error('Error fetching detected bills:', error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to allow database operations to complete if we just got initialBills
    const delay = initialBills.length > 0 ? 1000 : 0;
    setTimeout(() => {
      fetchDetectedBills();
    }, delay);
  }, [user, initialBills]);

  const handleApproveBill = async (bill: DetectedBill) => {
    if (!user) return;

    try {
      // First, find the detected bill in the database
      const { data: detectedBills, error: findError } = await supabase
        .from('detected_bills')
        .select('*')
        .eq('source', bill.source)
        .eq('amount', bill.amount)
        .eq('user_id', user.id);

      if (findError) throw findError;

      // If the bill exists in the database, update its status
      if (detectedBills && detectedBills.length > 0) {
        const dbBill = detectedBills[0];
        const { error: updateError } = await supabase
          .from('detected_bills')
          .update({ approved: true })
          .eq('id', dbBill.id);

        if (updateError) throw updateError;
      }

      // Then create a new payment
      try {
        const { data: newPayment, error: paymentError } = await supabase
          .from('payments')
          .insert([{
            title: bill.title,
            amount: bill.amount,
            due_date: bill.dueDate.toISOString(),
            recurring: false, // Default to non-recurring, user can change later
            category: bill.category,
            paid: false,
            user_id: user.id
          }])
          .select();

        if (paymentError) throw paymentError;

        console.log('Successfully created payment:', newPayment);
      } catch (paymentError) {
        console.error('Detailed payment error:', paymentError);
        throw new Error('Failed to create payment: ' + (paymentError.message || 'Unknown error'));
      }

      // Update local state
      setBills(bills.filter(b => b.id !== bill.id));

      // Notify parent component
      onBillApproved(bill);

      toast.success(`Added "${bill.title}" to your upcoming payments`);
    } catch (error) {
      console.error('Error approving bill:', error);
      toast.error('Failed to add payment. Please try again.');
    }
  };

  const handleRejectBill = async (billId: string) => {
    if (!user) return;

    try {
      // Find the bill in our local state
      const billToReject = bills.find(bill => bill.id === billId);

      if (!billToReject) {
        console.error('Bill not found in local state:', billId);
        return;
      }

      // Try to find the bill in the database
      const { data: detectedBills, error: findError } = await supabase
        .from('detected_bills')
        .select('*')
        .eq('source', billToReject.source)
        .eq('amount', billToReject.amount)
        .eq('user_id', user.id);

      if (findError) {
        console.error('Error finding bill in database:', findError);
      }

      // If the bill exists in the database, delete it
      if (detectedBills && detectedBills.length > 0) {
        const dbBill = detectedBills[0];
        const { error: deleteError } = await supabase
          .from('detected_bills')
          .delete()
          .eq('id', dbBill.id);

        if (deleteError) {
          console.error('Error deleting bill from database:', deleteError);
        }
      }

      // Update local state regardless of database operation
      setBills(bills.filter(bill => bill.id !== billId));

      // Notify parent component
      onBillRejected(billId);

      toast.success('Bill suggestion removed');
    } catch (error) {
      console.error('Error rejecting bill:', error);
      toast.error('Failed to remove suggestion. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-primary/70">
        Loading bill suggestions...
      </div>
    );
  }

  if (bills.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium text-primary mb-3 flex items-center">
        <Mail className="w-4 h-4 mr-2 text-amber-500" />
        Suggested Bills from Emails
      </h3>

      <div className="space-y-2">
        {bills.map(bill => (
          <div key={bill.id} className="glass-card p-3 rounded-lg animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{bill.title}</div>
                <div className="text-xs text-primary/70 mt-0.5">
                  From: {bill.source}
                </div>
                <div className="flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1 text-primary/70" />
                  <span className="text-xs">
                    Due: {bill.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="mx-1 text-xs text-primary/50">•</span>
                  <span className="text-xs">{bill.category}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium">{formatCurrency(bill.amount)}</div>
                <div className="text-xs text-primary/70 mt-0.5">
                  Confidence: {Math.round(bill.confidence * 100)}%
                </div>

                <div className="flex space-x-1 mt-2">
                  <button
                    onClick={() => handleRejectBill(bill.id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleApproveBill(bill)}
                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillSuggestions;
