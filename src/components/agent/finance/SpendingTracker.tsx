import React, { useState } from 'react';
import { 
  Expense, 
  initialExpenses, 
  expenseCategories, 
  generateId, 
  formatCurrency 
} from '@/utils/agentData';

const SpendingTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Housing',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newExpense.amount > 0) {
      const expense: Expense = {
        id: generateId(),
        category: newExpense.category,
        amount: newExpense.amount,
        date: new Date(newExpense.date)
      };
      
      setExpenses([expense, ...expenses]);
      setNewExpense({
        category: 'Housing',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    }
  };

  const getTotalByCategory = () => {
    const totals: Record<string, number> = {};
    
    expenses.forEach(expense => {
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pieData = getTotalByCategory();

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
        
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-primary/70">
            <p>Pie chart visualization would appear here</p>
            <p className="text-sm mt-2">Using data from {pieData.length} categories</p>
          </div>
        </div>
      </div>

      {/* Recent expenses */}
      <div>
        <h3 className="font-medium mb-3">Recent Expenses</h3>
        <div className="space-y-2">
          {expenses.slice(0, 5).map(expense => (
            <div key={expense.id} className="glass p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ 
                    backgroundColor: expenseCategories.find(c => c.name === expense.category)?.color || '#174E4F'
                  }} 
                />
                <span>{expense.category}</span>
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
