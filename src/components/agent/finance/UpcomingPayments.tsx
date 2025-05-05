import React, { useState } from 'react';
import { 
  Payment, 
  initialPayments, 
  generateId, 
  formatCurrency, 
  expenseCategories 
} from '@/utils/agentData';
import { Check } from 'lucide-react';

const UpcomingPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    recurring: false,
    category: 'Housing'
  });

  const handleAddPayment = (e: React.FormEvent) => {
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
      
      setPayments([...payments, payment]);
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

  const handleTogglePaid = (id: string) => {
    setPayments(
      payments.map(payment =>
        payment.id === id ? { ...payment, paid: !payment.paid } : payment
      )
    );
  };

  // Sort payments by due date
  const sortedPayments = [...payments].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  // Split into upcoming and paid
  const upcomingPayments = sortedPayments.filter(payment => !payment.paid);
  const paidPayments = sortedPayments.filter(payment => payment.paid);

  const totalUpcoming = upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0);

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
