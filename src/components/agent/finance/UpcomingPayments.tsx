import React, { useState } from 'react';
import {
  Payment,
  initialPayments,
  generateId,
  formatCurrency,
  expenseCategories
} from '@/utils/agentData';
import { Check } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
// Email scanning feature temporarily disabled
// import EmailScanner, { DetectedBill } from '../email/EmailScanner';
// import BillSuggestions from '../email/BillSuggestions';

interface DatabasePayment {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  recurring: boolean;
  category: string;
  paid: boolean;
  user_id: string;
  created_at: string;
}

const UpcomingPayments: React.FC = () => {
  const { user } = useAuth();
  const [localPayments, setLocalPayments] = useState<Payment[]>(initialPayments);
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    recurring: false,
    category: 'Housing'
  });

  // Try to use Supabase data if available, otherwise fall back to local state
  let useLocalData = true;

  try {
    var {
      data: payments,
      loading,
      addItem,
      updateItem,
      deleteItem,
      fetchData
    } = useSupabaseData<DatabasePayment>({
      table: 'payments',
      initialData: initialPayments.map(payment => ({
        id: payment.id,
        title: payment.title,
        amount: payment.amount,
        due_date: payment.dueDate.toISOString(),
        recurring: payment.recurring,
        category: payment.category,
        paid: payment.paid,
        user_id: 'anonymous',
        created_at: new Date().toISOString()
      })),
      orderBy: { column: 'due_date', ascending: true }
    });

    useLocalData = false;
  } catch (error) {
    console.error('Error using Supabase data:', error);
    // Fall back to local state
  }

  // Local handlers (used when Supabase is not available)
  const handleAddPaymentLocal = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPayment.title && newPayment.amount > 0) {
      const payment: Payment = {
        id: generateId(),
        title: newPayment.title,
        amount: newPayment.amount,
        dueDate: new Date(newPayment.dueDate),
        recurring: newPayment.recurring,
        category: newPayment.category,
        paid: false
      };

      setLocalPayments([...localPayments, payment]);
      setNewPayment({
        title: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        recurring: false,
        category: 'Housing'
      });
      setShowForm(false);
    }
  };

  const handleTogglePaidLocal = (id: string) => {
    setLocalPayments(
      localPayments.map(payment =>
        payment.id === id ? { ...payment, paid: !payment.paid } : payment
      )
    );
  };

  // Supabase handlers
  const handleAddPaymentSupabase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // If not logged in, fall back to local state
      handleAddPaymentLocal(e);
      return;
    }

    if (newPayment.title && newPayment.amount > 0) {
      try {
        await addItem({
          title: newPayment.title,
          amount: newPayment.amount,
          due_date: new Date(newPayment.dueDate).toISOString(),
          recurring: newPayment.recurring,
          category: newPayment.category,
          paid: false
        });

        setNewPayment({
          title: '',
          amount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          recurring: false,
          category: 'Housing'
        });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding payment to Supabase:', error);
        // Fall back to local state
        handleAddPaymentLocal(e);
      }
    }
  };

  const handleTogglePaidSupabase = async (id: string) => {
    if (!user) {
      // If not logged in, fall back to local state
      handleTogglePaidLocal(id);
      return;
    }

    try {
      const payment = payments.find(p => p.id === id);
      if (!payment) return;

      const newPaidStatus = !payment.paid;

      // Update the payment status
      await updateItem(id, { paid: newPaidStatus });

      // If the payment is being marked as paid, create an expense record
      if (newPaidStatus) {
        try {
          const { error } = await supabase
            .from('expenses')
            .insert([{
              category: payment.category,
              amount: payment.amount,
              date: new Date().toISOString(),
              user_id: user.id,
              payment_id: payment.id
            }]);

          if (error) {
            console.error('Error creating expense from payment:', error);
            toast.error('Payment marked as paid, but failed to record expense');
          } else {
            toast.success('Payment marked as paid and expense recorded');
          }
        } catch (error) {
          console.error('Error creating expense from payment:', error);
        }
      }

      // If the payment is recurring and was just marked as paid, create the next payment
      if (newPaidStatus && payment.recurring) {
        try {
          // Calculate the next due date (1 month later)
          const nextDueDate = new Date(payment.due_date);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);

          await addItem({
            title: payment.title,
            amount: payment.amount,
            due_date: nextDueDate.toISOString(),
            recurring: true,
            category: payment.category,
            paid: false
          });

          toast.success(`Next recurring payment for ${payment.title} scheduled`);
        } catch (error) {
          console.error('Error creating next recurring payment:', error);
        }
      }

      // Refresh the data to show the new payment
      fetchData();
    } catch (error) {
      console.error('Error toggling payment in Supabase:', error);
      // Fall back to local state
      handleTogglePaidLocal(id);
    }
  };

  // Use the appropriate handlers based on whether we're using local data or Supabase
  const handleAddPayment = useLocalData ? handleAddPaymentLocal : handleAddPaymentSupabase;
  const handleTogglePaid = useLocalData ? handleTogglePaidLocal : handleTogglePaidSupabase;

  // Convert database payments to UI payments if using Supabase
  const convertToUIPayment = (dbPayment: DatabasePayment): Payment => ({
    id: dbPayment.id,
    title: dbPayment.title,
    amount: dbPayment.amount,
    dueDate: new Date(dbPayment.due_date),
    recurring: dbPayment.recurring,
    category: dbPayment.category,
    paid: dbPayment.paid
  });

  // Use the appropriate payments based on whether we're using local data or Supabase
  const uiPayments = useLocalData ? localPayments : payments.map(convertToUIPayment);

  // Sort payments by due date
  const sortedPayments = [...uiPayments].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  // Split into upcoming and paid
  const upcomingPayments = sortedPayments.filter(payment => !payment.paid);
  const paidPayments = sortedPayments.filter(payment => payment.paid);

  const totalUpcoming = upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (!useLocalData && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="h-8 w-8 text-primary animate-spin">⟳</span>
        <span className="ml-2 text-primary">Loading payments...</span>
      </div>
    );
  }

  // Email scanning feature temporarily disabled
  /*
  const [detectedBills, setDetectedBills] = useState<DetectedBill[]>([]);

  const handleBillsDetected = (bills: DetectedBill[]) => {
    setDetectedBills(bills);
  };

  const handleBillApproved = (bill: DetectedBill) => {
    // Remove from detected bills
    setDetectedBills(detectedBills.filter(b => b.id !== bill.id));
    // Refresh payments list
    if (!useLocalData) {
      fetchData();
    }
  };

  const handleBillRejected = (billId: string) => {
    // Remove from detected bills
    setDetectedBills(detectedBills.filter(b => b.id !== billId));
  };
  */

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary">Upcoming Payments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Payment'}
        </button>
      </div>

      {/* Email scanning feature temporarily disabled */}
      {/*
      {user && (
        <EmailScanner onBillsDetected={handleBillsDetected} />
      )}

      {user && (
        <BillSuggestions
          initialBills={detectedBills}
          onBillApproved={handleBillApproved}
          onBillRejected={handleBillRejected}
        />
      )}
      */}

      {showForm && (
        <form onSubmit={handleAddPayment} className="glass-card p-4 mb-6 animate-scale-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Title</label>
              <input
                type="text"
                value={newPayment.title}
                onChange={(e) => setNewPayment({...newPayment, title: e.target.value})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="e.g., Rent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={newPayment.amount || ''}
                onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="0"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newPayment.category}
                onChange={(e) => setNewPayment({...newPayment, category: e.target.value})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                required
              >
                {expenseCategories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={newPayment.dueDate}
                onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                checked={newPayment.recurring}
                onChange={(e) => setNewPayment({...newPayment, recurring: e.target.checked})}
                className="mr-2 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              />
              <label htmlFor="recurring" className="text-sm">Recurring Payment</label>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Payment
            </button>
          </div>
        </form>
      )}

      {/* Summary card */}
      <div className="glass-card p-4 mb-6 animate-fade-in">
        <h3 className="font-medium">Total Upcoming</h3>
        <p className="text-2xl font-bold">{formatCurrency(totalUpcoming)}</p>
        <p className="text-sm text-primary/70 mt-1">{upcomingPayments.length} payments due</p>
      </div>

      {/* Upcoming payments */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Due Soon</h3>
        <div className="space-y-2">
          {upcomingPayments.map(payment => {
            const daysUntilDue = Math.ceil((payment.dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3;

            return (
              <div
                key={payment.id}
                className={`glass p-3 rounded-lg flex justify-between items-center
                  ${isOverdue ? 'border-red-500 border' : ''}
                  ${isDueSoon && !isOverdue ? 'border-yellow-500 border' : ''}
                `}
              >
                <div>
                  <div className="font-medium">{payment.title}</div>
                  <div className="text-xs text-primary/70">
                    {payment.recurring && '↻ '}
                    {payment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' · '}
                    {payment.category}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  <button
                    onClick={() => handleTogglePaid(payment.id)}
                    className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10"
                  >
                    <Check className="w-4 h-4 text-transparent" />
                  </button>
                </div>
              </div>
            );
          })}

          {upcomingPayments.length === 0 && (
            <p className="text-center text-primary/50 py-4">No upcoming payments.</p>
          )}
        </div>
      </div>

      {/* Paid payments */}
      {paidPayments.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Recently Paid</h3>
          <div className="space-y-2 opacity-70">
            {paidPayments.slice(0, 3).map(payment => (
              <div key={payment.id} className="glass p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">{payment.title}</div>
                  <div className="text-xs text-primary/70">
                    {payment.recurring && '↻ '}
                    {payment.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' · '}
                    {payment.category}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                  <button
                    onClick={() => handleTogglePaid(payment.id)}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingPayments;
