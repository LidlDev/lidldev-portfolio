import React, { useState } from 'react';
import { 
  FinancialGoal, 
  initialGoals, 
  generateId, 
  formatCurrency 
} from '@/utils/agentData';

const Progress = ({ value }: { value: number }) => {
  return (
    <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-primary h-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const FinancialGoals: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    current: 0,
    targetDate: '',
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newGoal.title && newGoal.target > 0) {
      const goal: FinancialGoal = {
        id: generateId(),
        title: newGoal.title,
        target: newGoal.target,
        current: newGoal.current,
        targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
        color: '#174E4F'
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        target: 0,
        current: 0,
        targetDate: '',
      });
      setShowForm(false);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const handleContribute = (id: string) => {
    // This would typically show a dialog to add funds
    // For now, we'll just add 100 to the goal
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, current: Math.min(goal.current + 100, goal.target) } 
        : goal
    ));
  };

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary">Financial Goals</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGoal} className="glass-card p-4 mb-6 animate-scale-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Goal Name</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="e.g., New Car"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <input
                  type="number"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                  className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Current Savings</label>
                <input
                  type="number"
                  value={newGoal.current || ''}
                  onChange={(e) => setNewGoal({...newGoal, current: Number(e.target.value)})}
                  className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target Date (Optional)</label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {goals.map(goal => {
          const progress = calculateProgress(goal.current, goal.target);
          
          return (
            <div key={goal.id} className="p-4 bg-white/60 border border-white/30 rounded-2xl shadow-md animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{goal.title}</h3>
                  {goal.targetDate && (
                    <p className="text-sm text-primary/70">
                      Target: {goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(goal.current)} <span className="text-sm font-normal text-primary/70">/ {formatCurrency(goal.target)}</span></p>
                  <p className="text-sm text-primary/70">{progress}% complete</p>
                </div>
              </div>
              
              <div className="mt-4 mb-2">
                <Progress value={progress} />
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleContribute(goal.id)}
                  className="text-sm px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                >
                  Add Funds
                </button>
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && !showForm && (
          <p className="text-center text-primary/50 py-8">No financial goals yet. Create a goal to get started!</p>
        )}
      </div>
    </div>
  );
};

export default FinancialGoals;
