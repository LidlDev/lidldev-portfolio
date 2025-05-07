import React, { useState } from 'react';
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
// import { Loader2 } from 'lucide-react';

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
  const uiExpenses = useLocalData ? localExpenses : expenses.map(convertToUIExpense);

  const getTotalByCategory = () => {
    const totals: Record<string, number> = {};

    uiExpenses.forEach(expense => {
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

  const totalExpenses = uiExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pieData = getTotalByCategory();

  if (!useLocalData && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="h-8 w-8 text-primary animate-spin">⟳</span>
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
              <p>No spending data to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent expenses */}
      <div>
        <h3 className="font-medium mb-3">Recent Expenses</h3>
        <div className="space-y-2">
          {uiExpenses.slice(0, 5).map(expense => (
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
          ))}

          {expenses.length === 0 && (
            <p className="text-center text-primary/50 py-4">No expenses recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpendingTracker;
