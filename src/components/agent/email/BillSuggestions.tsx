import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { DetectedBill } from './EmailScanner';
import { Mail } from 'lucide-react';
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
    if (initialBills.length > 0) {
      setBills(initialBills);
      setLoading(false);
      return;
    }

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

        setBills(formattedBills);
      } catch (error) {
        console.error('Error fetching detected bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetectedBills();
  }, [user, initialBills]);

  const handleApproveBill = async (bill: DetectedBill) => {
    if (!user) return;

    try {
      // First, update the detected bill status
      const { error: updateError } = await supabase
        .from('detected_bills')
        .update({ approved: true })
        .eq('id', bill.id);

      if (updateError) throw updateError;

      // Then create a new payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          title: bill.title,
          amount: bill.amount,
          due_date: bill.dueDate.toISOString(),
          recurring: false, // Default to non-recurring, user can change later
          category: bill.category,
          paid: false,
          user_id: user.id
        }]);

      if (paymentError) throw paymentError;

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
      // Update the detected bill status or delete it
      const { error } = await supabase
        .from('detected_bills')
        .delete()
        .eq('id', billId);

      if (error) throw error;

      // Update local state
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
                  <span className="w-3 h-3 mr-1 text-primary/70">📅</span>
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
                    ✕
                  </button>
                  <button
                    onClick={() => handleApproveBill(bill)}
                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    title="Approve"
                  >
                    ✓
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
