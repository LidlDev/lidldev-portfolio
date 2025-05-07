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
import { ChevronLeft, ChevronRight, Calendar, Pencil, Trash, X } from 'lucide-react';
import { toast } from 'sonner';

interface DatabaseExpense {
  id: string;
  category: string;
  amount: number;
  date: string;
  user_id: string;
  created_at: string;
  payment_id?: string | null; // Optional field to link to a payment
}

const SpendingTracker: React.FC = () => {
  const { user } = useAuth();
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Housing',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Time period filtering
  const [timePeriod, setTimePeriod] = useState<'month' | 'week' | 'fortnight'>('month');
  const [periodOffset, setPeriodOffset] = useState(0); // 0 = current period, -1 = previous period, etc.

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

  // Use the appropriate handlers based on whether we're using local data or Supabase
  const handleAddExpense = useLocalData ? handleAddExpenseLocal : handleAddExpenseSupabase;

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
        totals[expense.category] += expense.amount;
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

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
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
        <h2 className="text-xl font-semibold text-primary">Spending Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

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
              .map(expense => (
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
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(expense.amount)}</div>
                    <div className="text-xs text-primary/70">
                      {expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-primary/50 py-4">No expenses recorded for this period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpendingTracker;
