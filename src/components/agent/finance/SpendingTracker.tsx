import React, { useState, useMemo } from 'react';
import {
  Expense,
  initialExpenses,
  expenseCategories,
  generateId,
  formatCurrency
} from '@/utils/agentData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, Calendar, Pencil, Trash, X, CreditCard, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import EmailScanner, { DetectedBill } from '@/components/agent/email/EmailScanner';
import { initialPayments } from '@/utils/agentData';

interface DatabaseExpense {
  id: string;
  category: string;
  amount: number;
  date: string;
  user_id: string;
  created_at: string;
  payment_id?: string | null; // Optional field to link to a payment
}

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

interface SpendingTrackerProps {
  initialTab?: 'expenses' | 'payments';
}

const SpendingTracker: React.FC<SpendingTrackerProps> = ({ initialTab = 'expenses' }) => {
  const { user } = useAuth();
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Housing',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const [newPayment, setNewPayment] = useState({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Housing',
    recurring: false
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<'expenses' | 'payments'>(initialTab);

  // Detected bills state
  const [detectedBills, setDetectedBills] = useState<DetectedBill[]>([]);

  // Edit payment state
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [editPaymentFormData, setEditPaymentFormData] = useState({
    title: '',
    amount: 0,
    due_date: '',
    category: 'Housing',
    recurring: false
  });

  // Handle URL parameters for tab navigation after auth redirect
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const authRedirect = urlParams.get('auth_redirect');

    if (tabParam && authRedirect === 'true' && (tabParam === 'expenses' || tabParam === 'payments')) {
      setActiveTab(tabParam);
    }
  }, []);

  // Time period filtering
  const [timePeriod, setTimePeriod] = useState<'month' | 'week' | 'fortnight'>('month');
  const [periodOffset, setPeriodOffset] = useState(0); // 0 = current period, -1 = previous period, etc.

  // State for editing expenses
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    category: 'Housing',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Try to use Supabase data if available, otherwise fall back to local state
  let useLocalData = true;

  try {
    var {
      data: expenses,
      loading,
      addItem,
      updateItem,
      deleteItem
    } = useSupabaseData<DatabaseExpense>({
      table: 'expenses',
      initialData: initialExpenses.map(expense => ({
        id: expense.id,
        category: expense.category,
        amount: expense.amount,
        date: expense.date.toISOString(),
        user_id: 'anonymous',
        created_at: new Date().toISOString(),
        payment_id: null
      })),
      orderBy: { column: 'date', ascending: false }
    });

    useLocalData = false;
  } catch (error) {
    console.error('Error using Supabase data:', error);
    // Fall back to local state
  }

  // Get payments data
  const {
    data: paymentsData = [],
    addItem: addPaymentItem,
    updateItem: updatePaymentItem,
    deleteItem: deletePaymentItem,
    fetchData: fetchPaymentsData
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

  // Local handlers (used when Supabase is not available)
  const handleAddExpenseLocal = (e: React.FormEvent) => {
    e.preventDefault();

    if (newExpense.amount > 0) {
      const expense: Expense = {
        id: generateId(),
        category: newExpense.category,
        amount: newExpense.amount,
        date: new Date(newExpense.date)
      };

      setLocalExpenses([expense, ...localExpenses]);
      setNewExpense({
        category: 'Housing',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    }
  };

  const handleEditExpenseLocal = (id: string) => {
    const expense = localExpenses.find(e => e.id === id);
    if (!expense) return;

    setEditingExpense(id);
    setEditFormData({
      category: expense.category,
      amount: expense.amount,
      date: expense.date.toISOString().split('T')[0]
    });
  };

  const handleSaveEditLocal = (id: string) => {
    if (editFormData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setLocalExpenses(localExpenses.map(expense =>
      expense.id === id ? {
        ...expense,
        category: editFormData.category,
        amount: editFormData.amount,
        date: new Date(editFormData.date)
      } : expense
    ));

    setEditingExpense(null);
    toast.success('Expense updated');
  };

  const handleDeleteExpenseLocal = (id: string) => {
    setLocalExpenses(localExpenses.filter(expense => expense.id !== id));
    toast.success('Expense deleted');
  };

  // Payment handlers
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPayment.title.trim() || newPayment.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (user) {
        // Add to Supabase
        await addItem({
          title: newPayment.title,
          amount: newPayment.amount,
          due_date: new Date(newPayment.dueDate).toISOString(),
          category: newPayment.category,
          recurring: newPayment.recurring,
          paid: false
        });
        toast.success('Payment added successfully');
      } else {
        // For local storage, we'd need to implement local payment storage
        toast.success('Payment added (local mode)');
      }

      setNewPayment({
        title: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Housing',
        recurring: false
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Failed to add payment');
    }
  };

  // Handle detected bills from email scanning
  const handleBillsDetected = (bills: DetectedBill[]) => {
    console.log('🎯 SpendingTracker: handleBillsDetected called with bills:', bills);
    setDetectedBills(bills);
    toast.success(`Found ${bills.length} bills in your emails. Review them below.`);
  };

  // Handle approving a detected bill
  const handleApproveBill = async (bill: DetectedBill) => {
    console.log('🔥 Approving bill:', bill);
    try {
      if (user) {
        const paymentData = {
          title: bill.title,
          amount: bill.amount,
          due_date: bill.dueDate.toISOString(),
          category: bill.category,
          recurring: false,
          paid: false
        };

        console.log('💾 Adding payment to Supabase:', paymentData);

        // Add to payments
        const result = await addPaymentItem(paymentData);
        console.log('✅ Payment added successfully:', result);

        // Refresh payments data to ensure UI updates
        await fetchPaymentsData();
        console.log('🔄 Payments data refreshed');

        // Remove from detected bills
        setDetectedBills(prev => prev.filter(b => b.id !== bill.id));
        toast.success(`Added "${bill.title}" to upcoming payments`);
      } else {
        console.error('❌ No user found when trying to approve bill');
        toast.error('User not authenticated');
      }
    } catch (error) {
      console.error('❌ Error adding detected bill as payment:', error);
      toast.error('Failed to add payment');
    }
  };

  // Handle rejecting a detected bill
  const handleRejectBill = (billId: string) => {
    setDetectedBills(prev => prev.filter(b => b.id !== billId));
    toast.info('Bill rejected');
  };

  // Handle editing a payment
  const handleEditPayment = (payment: DatabasePayment) => {
    setEditingPayment(payment.id);
    setEditPaymentFormData({
      title: payment.title,
      amount: payment.amount,
      due_date: payment.due_date.split('T')[0], // Convert to YYYY-MM-DD format
      category: payment.category,
      recurring: payment.recurring
    });
  };

  // Handle saving edited payment
  const handleSaveEditPayment = async () => {
    if (!editingPayment) return;

    try {
      console.log('💾 Updating payment:', editingPayment, editPaymentFormData);

      await updatePaymentItem(editingPayment, {
        title: editPaymentFormData.title,
        amount: editPaymentFormData.amount,
        due_date: new Date(editPaymentFormData.due_date).toISOString(),
        category: editPaymentFormData.category,
        recurring: editPaymentFormData.recurring
      });

      setEditingPayment(null);
      toast.success('Payment updated successfully');
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingPayment(null);
    setEditPaymentFormData({
      title: '',
      amount: 0,
      due_date: '',
      category: 'Housing',
      recurring: false
    });
  };

  // Handle toggling payment status (paid/unpaid)
  const handleMarkPaymentPaid = async (paymentId: string) => {
    try {
      if (user) {
        // Update payment status in Supabase
        const payment = paymentsData.find(p => p.id === paymentId);
        if (!payment) return;

        const newPaidStatus = !payment.paid;

        // Update the payment status
        await updatePaymentItem(paymentId, { paid: newPaidStatus });

        if (newPaidStatus) {
          // Payment is being marked as paid - create an expense record
          await addItem({
            category: payment.category,
            amount: payment.amount,
            date: new Date().toISOString(),
            payment_id: paymentId
          });
          toast.success('Payment marked as paid and expense recorded');
        } else {
          // Payment is being marked as unpaid - remove the expense record
          // Find the expense record that matches this payment
          const expenseToDelete = expenses.find(expense =>
            expense.payment_id === paymentId ||
            (expense.category === payment.category &&
             expense.amount === payment.amount &&
             Math.abs(new Date(expense.date).getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000) // Within 24 hours
          );

          if (expenseToDelete) {
            await deleteItem(expenseToDelete.id);
            toast.success('Payment marked as unpaid and expense record removed');
          } else {
            toast.success('Payment marked as unpaid');
          }
        }
      } else {
        toast.success('Payment status updated (local mode)');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  // Handle removing payment
  const handleRemovePayment = async (paymentId: string) => {
    try {
      if (user) {
        await deletePaymentItem(paymentId);
        toast.success('Payment removed');
      } else {
        toast.success('Payment removed (local mode)');
      }
    } catch (error) {
      console.error('Error removing payment:', error);
      toast.error('Failed to remove payment');
    }
  };

  // Supabase handlers
  const handleAddExpenseSupabase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // If not logged in, fall back to local state
      handleAddExpenseLocal(e);
      return;
    }

    if (newExpense.amount > 0) {
      try {
        await addItem({
          category: newExpense.category,
          amount: newExpense.amount,
          date: new Date(newExpense.date).toISOString()
        });

        setNewExpense({
          category: 'Housing',
          amount: 0,
          date: new Date().toISOString().split('T')[0]
        });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding expense to Supabase:', error);
        // Fall back to local state
        handleAddExpenseLocal(e);
      }
    }
  };

  // Supabase handlers for editing and deleting expenses
  const handleEditExpenseSupabase = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    setEditingExpense(id);
    setEditFormData({
      category: expense.category,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
  };

  const handleSaveEditSupabase = async (id: string) => {
    if (!user) {
      handleSaveEditLocal(id);
      return;
    }

    if (editFormData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      const result = await updateItem(id, {
        category: editFormData.category,
        amount: editFormData.amount,
        date: new Date(editFormData.date).toISOString()
      });

      if (result) {
        setEditingExpense(null);
        toast.success('Expense updated successfully');
      } else {
        toast.error('Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense in Supabase:', error);
      toast.error('Failed to update expense');
      // Fall back to local state
      handleSaveEditLocal(id);
    }
  };

  const handleDeleteExpenseSupabase = async (id: string) => {
    if (!user) {
      handleDeleteExpenseLocal(id);
      return;
    }

    try {
      // Check if the expense is from a payment
      const expense = expenses.find(e => e.id === id);
      if (expense?.payment_id) {
        toast.error('Cannot delete an expense linked to a payment. Unmark the payment as paid instead.');
        return;
      }

      const result = await deleteItem(id);

      if (result) {
        toast.success('Expense deleted successfully');
      } else {
        toast.error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense from Supabase:', error);
      toast.error('Failed to delete expense');
      // Fall back to local state
      handleDeleteExpenseLocal(id);
    }
  };

  // Use the appropriate handlers based on whether we're using local data or Supabase
  const handleAddExpense = useLocalData ? handleAddExpenseLocal : handleAddExpenseSupabase;
  const handleEditExpense = useLocalData ? handleEditExpenseLocal : handleEditExpenseSupabase;
  const handleSaveEdit = useLocalData ? handleSaveEditLocal : handleSaveEditSupabase;
  const handleDeleteExpense = useLocalData ? handleDeleteExpenseLocal : handleDeleteExpenseSupabase;

  // Convert database expenses to UI expenses if using Supabase
  const convertToUIExpense = (dbExpense: DatabaseExpense): Expense => ({
    id: dbExpense.id,
    category: dbExpense.category,
    amount: dbExpense.amount,
    date: new Date(dbExpense.date),
    fromPayment: !!dbExpense.payment_id
  });

  // Use the appropriate expenses based on whether we're using local data or Supabase
  const allExpenses = useLocalData ? localExpenses : expenses.map(convertToUIExpense);

  // Get the date range for the current time period
  const getDateRange = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate the start of the current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(currentDate - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the start of the current fortnight (2 weeks)
    const startOfFortnight = new Date(startOfWeek);
    const fortnightOffset = currentDay >= 7 ? 7 : 0; // If we're in the second week, go back one more week
    startOfFortnight.setDate(startOfFortnight.getDate() - fortnightOffset);

    // Calculate the start of the current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    // Apply the period offset
    let start: Date;
    let end: Date;

    if (timePeriod === 'month') {
      // For months
      start = new Date(currentYear, currentMonth + periodOffset, 1);
      end = new Date(currentYear, currentMonth + periodOffset + 1, 0); // Last day of the month
    } else if (timePeriod === 'week') {
      // For weeks
      start = new Date(startOfWeek);
      start.setDate(start.getDate() + (periodOffset * 7));
      end = new Date(start);
      end.setDate(end.getDate() + 6);
    } else { // fortnight
      // For fortnights
      start = new Date(startOfFortnight);
      start.setDate(start.getDate() + (periodOffset * 14));
      end = new Date(start);
      end.setDate(end.getDate() + 13);
    }

    // Set the time to the beginning and end of the day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, [timePeriod, periodOffset]);

  // Format the current period for display
  const formatPeriodLabel = useMemo(() => {
    const { start, end } = getDateRange;

    if (timePeriod === 'month') {
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (timePeriod === 'week') {
      return `Week of ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else { // fortnight
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  }, [getDateRange, timePeriod]);

  // Filter expenses by the current time period
  const filteredExpenses = useMemo(() => {
    const { start, end } = getDateRange;

    return allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }, [allExpenses, getDateRange]);

  // Navigate to the previous period
  const goToPreviousPeriod = () => {
    setPeriodOffset(prev => prev - 1);
  };

  // Navigate to the next period
  const goToNextPeriod = () => {
    if (periodOffset < 0) {
      setPeriodOffset(prev => prev + 1);
    }
  };

  // Reset to the current period
  const goToCurrentPeriod = () => {
    setPeriodOffset(0);
  };

  const getTotalByCategory = () => {
    const totals: Record<string, number> = {};

    filteredExpenses.forEach(expense => {
      if (totals[expense.category]) {
        totals[expense.category] = Math.round((totals[expense.category] + expense.amount) * 100) / 100;
      } else {
        totals[expense.category] = expense.amount;
      }
    });

    return Object.keys(totals).map(category => {
      const categoryInfo = expenseCategories.find(c => c.name === category);
      return {
        name: category,
        value: totals[category],
        color: categoryInfo?.color || '#174E4F'
      };
    });
  };

  const totalExpenses = Math.round(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) * 100) / 100;
  const pieData = getTotalByCategory();

  if (!useLocalData && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <svg className="h-8 w-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-2 text-primary">Loading expenses...</span>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Spending & Payments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : activeTab === 'expenses' ? 'Add Expense' : 'Add Payment'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-secondary rounded-lg p-1">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'expenses'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Expenses</span>
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'payments'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Payments</span>
        </button>
      </div>

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <>
          {showForm && (
        <form onSubmit={handleAddExpense} className="glass-card p-4 mb-6 animate-scale-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
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
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="0"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Expense
            </button>
          </div>
        </form>
      )}

      {/* Time period filter */}
      <div className="glass-card p-4 mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex space-x-2 mb-3 sm:mb-0">
            <button
              onClick={() => setTimePeriod('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                timePeriod === 'month'
                  ? 'bg-primary text-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimePeriod('fortnight')}
              className={`px-3 py-1 rounded-lg text-sm ${
                timePeriod === 'fortnight'
                  ? 'bg-primary text-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            >
              Fortnight
            </button>
            <button
              onClick={() => setTimePeriod('week')}
              className={`px-3 py-1 rounded-lg text-sm ${
                timePeriod === 'week'
                  ? 'bg-primary text-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            >
              Week
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPeriod}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/70"
              title="Previous period"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>

            <button
              onClick={goToCurrentPeriod}
              className={`px-2 py-1 rounded-lg text-xs ${
                periodOffset === 0
                  ? 'bg-primary text-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              title="Current period"
            >
              <Calendar className="w-3 h-3 inline mr-1" />
              Current
            </button>

            <button
              onClick={goToNextPeriod}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                periodOffset < 0
                  ? 'bg-white/50 hover:bg-white/70'
                  : 'bg-white/30 text-primary/30 cursor-not-allowed'
              }`}
              disabled={periodOffset >= 0}
              title="Next period"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="text-center mb-2">
          <span className="text-sm font-medium">{formatPeriodLabel}</span>
        </div>
      </div>

      {/* Chart section */}
      <div className="glass-card p-4 mb-6 animate-fade-in">
        <h3 className="font-medium mb-2">Spending Breakdown</h3>
        <p className="text-2xl font-bold mb-4">{formatCurrency(totalExpenses)}</p>

        <div className="h-64">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(name) => `Category: ${name}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-primary/70">
              <p>No spending data for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* Period expenses */}
      <div>
        <h3 className="font-medium mb-3">Expenses in this Period</h3>
        <div className="space-y-2">
          {filteredExpenses.length > 0 ? (
            filteredExpenses
              .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date, newest first
              .map(expense => {
                const isEditing = editingExpense === expense.id;

                if (isEditing) {
                  return (
                    <div key={expense.id} className="glass p-3 rounded-lg animate-scale-in">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Edit Expense</h4>
                        <button
                          onClick={() => setEditingExpense(null)}
                          className="p-1 rounded-full hover:bg-gray-200/50"
                          title="Cancel"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Category</label>
                          <select
                            value={editFormData.category}
                            onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                            className="px-2 py-1 text-sm bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                            required
                          >
                            {expenseCategories.map(category => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium mb-1">Amount</label>
                            <input
                              type="number"
                              value={editFormData.amount || ''}
                              onChange={(e) => setEditFormData({...editFormData, amount: Number(e.target.value)})}
                              className="px-2 py-1 text-sm bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                              min="0.01"
                              step="0.01"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">Date</label>
                            <input
                              type="date"
                              value={editFormData.date}
                              onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                              className="px-2 py-1 text-sm bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            onClick={() => setEditingExpense(null)}
                            className="px-2 py-1 text-xs bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(expense.id)}
                            className="px-2 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={expense.id} className="glass p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor: expenseCategories.find(c => c.name === expense.category)?.color || '#174E4F'
                        }}
                      />
                      <span>{expense.category}</span>
                      {expense.fromPayment && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-1 py-0.5 rounded">
                          Payment
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-2">
                        <div className="font-medium">{formatCurrency(expense.amount)}</div>
                        <div className="text-xs text-primary/70">
                          {expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {!expense.fromPayment && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditExpense(expense.id)}
                            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Edit expense"
                          >
                            <Pencil className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                            title="Delete expense"
                          >
                            <Trash className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-center text-primary/50 py-4">No expenses recorded for this period.</p>
          )}
        </div>
      </div>
        </>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payment Form */}
          {showForm && (
            <form onSubmit={handleAddPayment} className="glass-card p-4 mb-6 animate-scale-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Title</label>
                  <input
                    type="text"
                    value={newPayment.title}
                    onChange={(e) => setNewPayment({...newPayment, title: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                    placeholder="e.g., Rent, Utilities, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      value={newPayment.amount || ''}
                      onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newPayment.dueDate}
                      onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                      className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newPayment.category}
                    onChange={(e) => setNewPayment({...newPayment, category: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                    required
                  >
                    {expenseCategories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newPayment.recurring}
                    onChange={(e) => setNewPayment({...newPayment, recurring: e.target.checked})}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium">
                    Recurring monthly payment
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Payment
                </button>
              </div>
            </form>
          )}

          {/* Email Scanner Component */}
          <EmailScanner onBillsDetected={handleBillsDetected} />

          {/* Detected Bills Section */}
          {detectedBills.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-500" />
                Bills Found in Emails ({detectedBills.length})
              </h3>
              <div className="space-y-3">
                {detectedBills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium text-foreground">{bill.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <span>From: {bill.source}</span>
                            <span>•</span>
                            <span>Due: {bill.dueDate.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{bill.category}</span>
                            <span>•</span>
                            <span>{Math.round(bill.confidence * 100)}% confidence</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(bill.amount)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRejectBill(bill.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Reject this bill"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproveBill(bill)}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Add to upcoming payments"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Overdue</span>
              </div>
              <p className="text-lg font-semibold text-orange-500">
                {paymentsData.filter(p => !p.paid && new Date(p.due_date) < new Date()).length}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Due This Week</span>
              </div>
              <p className="text-lg font-semibold text-blue-500">
                {paymentsData.filter(p => {
                  const dueDate = new Date(p.due_date);
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return !p.paid && dueDate <= weekFromNow && dueDate >= new Date();
                }).length}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Paid This Month</span>
              </div>
              <p className="text-lg font-semibold text-green-500">
                {paymentsData.filter(p => {
                  const paidDate = new Date(p.created_at);
                  const currentMonth = new Date().getMonth();
                  return p.paid && paidDate.getMonth() === currentMonth;
                }).length}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Payments</h3>
            <div className="space-y-3">
              {paymentsData
                .filter(payment => !payment.paid)
                .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                .map(payment => {
                  const dueDate = new Date(payment.due_date);
                  const isOverdue = dueDate < new Date();
                  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${isOverdue ? 'bg-red-500' : daysUntilDue <= 7 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-foreground">{payment.title}</h4>
                          <p className="text-sm text-muted-foreground">{payment.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
                          <p className={`text-sm ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {isOverdue ? 'Overdue' : daysUntilDue === 0 ? 'Due today' : `Due in ${daysUntilDue} days`}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPayment(payment)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit payment"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleRemovePayment(payment.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove payment"
                          >
                            <Trash className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleMarkPaymentPaid(payment.id)}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Mark Paid
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Paid Payments Section */}
          {paymentsData.filter(p => p.paid).length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recently Paid</h3>
              <div className="space-y-3">
                {paymentsData
                  .filter(payment => payment.paid)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <h4 className="font-medium text-foreground">{payment.title}</h4>
                          <p className="text-sm text-muted-foreground">{payment.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Paid
                          </p>
                        </div>

                        <button
                          onClick={() => handleMarkPaymentPaid(payment.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Mark as unpaid"
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Edit Payment Modal */}
          {editingPayment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Edit Payment</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                    <input
                      type="text"
                      value={editPaymentFormData.title}
                      onChange={(e) => setEditPaymentFormData({...editPaymentFormData, title: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Payment title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editPaymentFormData.amount}
                      onChange={(e) => setEditPaymentFormData({...editPaymentFormData, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
                    <input
                      type="date"
                      value={editPaymentFormData.due_date}
                      onChange={(e) => setEditPaymentFormData({...editPaymentFormData, due_date: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <select
                      value={editPaymentFormData.category}
                      onChange={(e) => setEditPaymentFormData({...editPaymentFormData, category: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {expenseCategories.map(category => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-recurring"
                      checked={editPaymentFormData.recurring}
                      onChange={(e) => setEditPaymentFormData({...editPaymentFormData, recurring: e.target.checked})}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="edit-recurring" className="text-sm text-foreground">
                      Recurring monthly
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditPayment}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpendingTracker;
