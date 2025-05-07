import React, { useState } from 'react';
import {
  FinancialGoal,
  initialGoals,
  generateId,
  formatCurrency
} from '@/utils/agentData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Minus } from 'lucide-react';

interface DatabaseGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  target_date: string | null;
  color: string;
  user_id: string;
  created_at: string;
  increment_amount: number;
}

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
  const { user } = useAuth();
  const [localGoals, setLocalGoals] = useState<FinancialGoal[]>(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    current: 0,
    targetDate: '',
    incrementAmount: 100,
  });

  // Try to use Supabase data if available, otherwise fall back to local state
  let useLocalData = true;

  try {
    var {
      data: goals,
      loading,
      addItem,
      updateItem,
      deleteItem
    } = useSupabaseData<DatabaseGoal>({
      table: 'financial_goals',
      initialData: initialGoals.map(goal => ({
        id: goal.id,
        title: goal.title,
        target: goal.target,
        current: goal.current,
        target_date: goal.targetDate ? goal.targetDate.toISOString() : null,
        color: goal.color,
        user_id: 'anonymous',
        created_at: new Date().toISOString(),
        increment_amount: goal.incrementAmount || 100
      })),
      orderBy: { column: 'created_at', ascending: false }
    });

    useLocalData = false;
  } catch (error) {
    console.error('Error using Supabase data:', error);
    // Fall back to local state
  }

  // Local handlers (used when Supabase is not available)
  const handleAddGoalLocal = (e: React.FormEvent) => {
    e.preventDefault();

    if (newGoal.title && newGoal.target > 0) {
      const goal: FinancialGoal = {
        id: generateId(),
        title: newGoal.title,
        target: newGoal.target,
        current: newGoal.current,
        targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
        color: '#174E4F',
        incrementAmount: newGoal.incrementAmount
      };

      setLocalGoals([...localGoals, goal]);
      setNewGoal({
        title: '',
        target: 0,
        current: 0,
        targetDate: '',
        incrementAmount: 100,
      });
      setShowForm(false);
    }
  };

  const handleContributeLocal = (id: string) => {
    // Add the increment amount to the goal
    setLocalGoals(localGoals.map(goal =>
      goal.id === id
        ? { ...goal, current: Math.min(goal.current + (goal.incrementAmount || 100), goal.target) }
        : goal
    ));
  };

  // Supabase handlers
  const handleAddGoalSupabase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // If not logged in, fall back to local state
      handleAddGoalLocal(e);
      return;
    }

    if (newGoal.title && newGoal.target > 0) {
      try {
        const result = await addItem({
          title: newGoal.title,
          target: newGoal.target,
          current: newGoal.current,
          target_date: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
          color: '#174E4F',
          increment_amount: newGoal.incrementAmount
        });

        setNewGoal({
          title: '',
          target: 0,
          current: 0,
          targetDate: '',
          incrementAmount: 100,
        });
        setShowForm(false);

        // Refresh the data to show the new goal
        if (result) {
          toast.success('Goal created successfully');
          fetchData();
        }
      } catch (error) {
        console.error('Error adding goal to Supabase:', error);
        toast.error('Failed to create goal');
        // Fall back to local state
        handleAddGoalLocal(e);
      }
    }
  };

  const handleContributeSupabase = async (id: string) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (goal) {
        const incrementAmount = goal.increment_amount || 100;
        const newAmount = Math.min(goal.current + incrementAmount, goal.target);
        const result = await updateItem(id, { current: newAmount });

        if (result) {
          toast.success(`Added ${formatCurrency(incrementAmount)} to ${goal.title}`);
          // Refresh the data to show the updated goal
          fetchData();
        }
      }
    } catch (error) {
      console.error('Error updating goal in Supabase:', error);
      toast.error('Failed to update goal');
      // Fall back to local state
      handleContributeLocal(id);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  // Use the appropriate handlers based on whether we're using local data or Supabase
  const handleAddGoal = useLocalData ? handleAddGoalLocal : handleAddGoalSupabase;
  const handleContribute = useLocalData ? handleContributeLocal : handleContributeSupabase;

  // Convert database goals to UI goals if using Supabase
  const convertToUIGoal = (dbGoal: DatabaseGoal): FinancialGoal => ({
    id: dbGoal.id,
    title: dbGoal.title,
    target: dbGoal.target,
    current: dbGoal.current,
    targetDate: dbGoal.target_date ? new Date(dbGoal.target_date) : undefined,
    color: dbGoal.color,
    incrementAmount: dbGoal.increment_amount
  });

  // Use the appropriate goals based on whether we're using local data or Supabase
  const uiGoals = useLocalData ? localGoals : goals.map(convertToUIGoal);

  if (!useLocalData && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <svg className="h-8 w-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-2 text-primary">Loading goals...</span>
      </div>
    );
  }

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Increment Amount</label>
                <input
                  type="number"
                  value={newGoal.incrementAmount || ''}
                  onChange={(e) => setNewGoal({...newGoal, incrementAmount: Number(e.target.value)})}
                  className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
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
        {uiGoals.map(goal => {
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

              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-primary/70">
                  Increment: {formatCurrency(goal.incrementAmount || 100)}
                </div>
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

        {uiGoals.length === 0 && !showForm && (
          <p className="text-center text-primary/50 py-8">No financial goals yet. Create a goal to get started!</p>
        )}
      </div>
    </div>
  );
};

export default FinancialGoals;
