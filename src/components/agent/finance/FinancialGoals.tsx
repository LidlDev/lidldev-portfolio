import React, { useState } from 'react';
import {
  FinancialGoal,
  initialGoals,
  generateId,
  formatCurrency
} from '@/utils/agentData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Minus, Pencil, Trash, X } from 'lucide-react';

interface DatabaseGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  target_date: string | null;
  color: string;
  user_id: string;
  created_at: string;
  increment_amount?: number; // Make this optional to handle schema differences
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

  // State for editing goals
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    target: 0,
    current: 0,
    targetDate: '',
    incrementAmount: 100,
  });

  // Try to use Supabase data if available, otherwise fall back to local state
  let useLocalData = !user;

  // Add debugging for Vercel deployment
  console.log('[FinancialGoals] User authenticated:', !!user);
  console.log('[FinancialGoals] User details:', user ? {
    id: user.id,
    email: user.email,
    role: user.role
  } : 'No user');

  const {
    data: goals = [],
    loading = false,
    addItem = async () => null,
    updateItem = async () => false,
    deleteItem = async () => false,
    fetchData = async () => {}
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

  console.log('[FinancialGoals] Financial goals from Supabase:', goals);
  console.log('[FinancialGoals] Using local data:', useLocalData);

  // We'll calculate uiGoals later after defining convertToUIGoal
  console.log('[FinancialGoals] Goals from Supabase before conversion:', goals);

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

  // Local handlers for editing and deleting goals
  const handleEditGoalLocal = (id: string) => {
    const goal = localGoals.find(g => g.id === id);
    if (!goal) return;

    setEditingGoal(id);
    setEditFormData({
      title: goal.title,
      target: goal.target,
      current: goal.current,
      targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : '',
      incrementAmount: goal.incrementAmount || 100
    });
  };

  const handleSaveEditLocal = (id: string) => {
    setLocalGoals(localGoals.map(goal =>
      goal.id === id ? {
        ...goal,
        title: editFormData.title,
        target: editFormData.target,
        current: editFormData.current,
        targetDate: editFormData.targetDate ? new Date(editFormData.targetDate) : undefined,
        incrementAmount: editFormData.incrementAmount
      } : goal
    ));

    setEditingGoal(null);
    toast.success('Goal updated');
  };

  const handleDeleteGoalLocal = (id: string) => {
    setLocalGoals(localGoals.filter(goal => goal.id !== id));
    toast.success('Goal deleted');
  };

  // Supabase handlers
  const handleAddGoalSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[FinancialGoals] handleAddGoalSupabase called');

    if (!user) {
      console.log('[FinancialGoals] No user, falling back to local state');
      // If not logged in, fall back to local state
      handleAddGoalLocal(e);
      return;
    }

    if (newGoal.title && newGoal.target > 0) {
      try {
        // First, try to add with increment_amount to see if the column exists
        const goalData = {
          title: newGoal.title,
          target: newGoal.target,
          current: newGoal.current,
          target_date: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
          color: '#174E4F',
          increment_amount: newGoal.incrementAmount,
          user_id: user.id // Explicitly set the user_id
        };

        console.log('[FinancialGoals] Adding goal with data (including increment_amount):', goalData);

        let result = await addItem(goalData);
        let errorMessage = '';

        // Check if the error is related to missing increment_amount column
        if (!result) {
          const error = result as any;
          console.error('[FinancialGoals] Error response:', error);

          if (error?.message?.includes('increment_amount') ||
              error?.error?.message?.includes('increment_amount') ||
              error?.details?.includes('increment_amount')) {

            console.log('[FinancialGoals] Detected missing increment_amount column, trying without it');

            // Try again without the increment_amount field
            const fallbackData = {
              title: newGoal.title,
              target: newGoal.target,
              current: newGoal.current,
              target_date: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
              color: '#174E4F',
              user_id: user.id
            };

            console.log('[FinancialGoals] Retrying with fallback data:', fallbackData);
            result = await addItem(fallbackData);

            if (result) {
              errorMessage = 'Goal created, but increment amount feature is not available. Please contact the administrator to update the database schema.';
            }
          }
        }

        console.log('[FinancialGoals] Add goal result:', result);

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
          if (errorMessage) {
            toast.warning(errorMessage);
          } else {
            toast.success('Goal created successfully');
          }
          console.log('[FinancialGoals] Calling fetchData to refresh goals');
          await fetchData();
          console.log('[FinancialGoals] fetchData completed, goals should be updated');
        } else {
          console.error('[FinancialGoals] Failed to add goal, result was falsy');
          toast.error('Failed to create goal');
        }
      } catch (error: any) {
        console.error('[FinancialGoals] Error adding goal to Supabase:', error);

        // Check if the error is related to missing increment_amount column
        if (error?.message?.includes('increment_amount') ||
            error?.details?.includes('increment_amount')) {

          toast.error('Database schema needs to be updated. The increment_amount column is missing.');
          console.log('[FinancialGoals] Schema issue detected: increment_amount column is missing');
        } else {
          toast.error('Failed to create goal');
        }

        // Fall back to local state
        handleAddGoalLocal(e);
      }
    } else {
      console.log('[FinancialGoals] Invalid goal data:', {
        title: newGoal.title,
        target: newGoal.target
      });
      toast.error('Please provide a title and target amount');
    }
  };

  const handleContributeSupabase = async (id: string) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (goal) {
        // Use a default value of 100 if increment_amount is not available
        const incrementAmount = goal.increment_amount || 100;
        const newAmount = Math.min(goal.current + incrementAmount, goal.target);

        console.log('[FinancialGoals] Contributing to goal:', {
          id,
          incrementAmount,
          currentAmount: goal.current,
          newAmount,
          hasIncrementAmount: 'increment_amount' in goal
        });

        const result = await updateItem(id, { current: newAmount });

        if (result) {
          toast.success(`Added ${formatCurrency(incrementAmount)} to ${goal.title}`);
          // Refresh the data to show the updated goal
          fetchData();
        } else {
          console.error('[FinancialGoals] Failed to update goal amount');
          toast.error('Failed to update goal');
        }
      } else {
        console.error('[FinancialGoals] Goal not found:', id);
        toast.error('Goal not found');
      }
    } catch (error: any) {
      console.error('[FinancialGoals] Error updating goal in Supabase:', error);

      // Check if the error is related to missing increment_amount column
      if (error?.message?.includes('increment_amount') ||
          error?.details?.includes('increment_amount')) {

        console.log('[FinancialGoals] Schema issue detected in contribute: increment_amount column is missing');
      }

      toast.error('Failed to update goal');
      // Fall back to local state
      handleContributeLocal(id);
    }
  };

  // Supabase handlers for editing and deleting goals
  const handleEditGoalSupabase = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    setEditingGoal(id);
    setEditFormData({
      title: goal.title,
      target: goal.target,
      current: goal.current,
      targetDate: goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : '',
      incrementAmount: goal.increment_amount || 100
    });
  };

  const handleSaveEditSupabase = async (id: string) => {
    if (!user) {
      handleSaveEditLocal(id);
      return;
    }

    try {
      // First, try to update with increment_amount to see if the column exists
      const updateData = {
        title: editFormData.title,
        target: editFormData.target,
        current: editFormData.current,
        target_date: editFormData.targetDate ? new Date(editFormData.targetDate).toISOString() : null,
        increment_amount: editFormData.incrementAmount
      };

      console.log('[FinancialGoals] Updating goal with data (including increment_amount):', updateData);

      let result = await updateItem(id, updateData);
      let errorMessage = '';

      // Check if the error is related to missing increment_amount column
      if (!result) {
        const error = result as any;
        console.error('[FinancialGoals] Error response from update:', error);

        if (error?.message?.includes('increment_amount') ||
            error?.error?.message?.includes('increment_amount') ||
            error?.details?.includes('increment_amount')) {

          console.log('[FinancialGoals] Detected missing increment_amount column in update, trying without it');

          // Try again without the increment_amount field
          const fallbackData = {
            title: editFormData.title,
            target: editFormData.target,
            current: editFormData.current,
            target_date: editFormData.targetDate ? new Date(editFormData.targetDate).toISOString() : null
          };

          console.log('[FinancialGoals] Retrying update with fallback data:', fallbackData);
          result = await updateItem(id, fallbackData);

          if (result) {
            errorMessage = 'Goal updated, but increment amount feature is not available. Please contact the administrator to update the database schema.';
          }
        }
      }

      if (result) {
        setEditingGoal(null);
        if (errorMessage) {
          toast.warning(errorMessage);
        } else {
          toast.success('Goal updated successfully');
        }
        fetchData();
      } else {
        console.error('[FinancialGoals] Failed to update goal, result was falsy');
        toast.error('Failed to update goal');
      }
    } catch (error: any) {
      console.error('[FinancialGoals] Error updating goal in Supabase:', error);

      // Check if the error is related to missing increment_amount column
      if (error?.message?.includes('increment_amount') ||
          error?.details?.includes('increment_amount')) {

        toast.error('Database schema needs to be updated. The increment_amount column is missing.');
        console.log('[FinancialGoals] Schema issue detected in edit: increment_amount column is missing');
      } else {
        toast.error('Failed to update goal');
      }

      // Fall back to local state
      handleSaveEditLocal(id);
    }
  };

  const handleDeleteGoalSupabase = async (id: string) => {
    if (!user) {
      handleDeleteGoalLocal(id);
      return;
    }

    try {
      const result = await deleteItem(id);

      if (result) {
        toast.success('Goal deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting goal from Supabase:', error);
      toast.error('Failed to delete goal');
      // Fall back to local state
      handleDeleteGoalLocal(id);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  // Use the appropriate handlers based on whether we're using local data or Supabase
  const handleAddGoal = useLocalData ? handleAddGoalLocal : handleAddGoalSupabase;
  const handleContribute = useLocalData ? handleContributeLocal : handleContributeSupabase;
  const handleEditGoal = useLocalData ? handleEditGoalLocal : handleEditGoalSupabase;
  const handleSaveEdit = useLocalData ? handleSaveEditLocal : handleSaveEditSupabase;
  const handleDeleteGoal = useLocalData ? handleDeleteGoalLocal : handleDeleteGoalSupabase;

  // Convert database goals to UI goals if using Supabase
  const convertToUIGoal = (dbGoal: DatabaseGoal): FinancialGoal => {
    // Check if the increment_amount property exists in the database goal
    const hasIncrementAmount = 'increment_amount' in dbGoal;
    console.log(`[FinancialGoals] Converting goal ${dbGoal.id}, has increment_amount: ${hasIncrementAmount}`);

    return {
      id: dbGoal.id,
      title: dbGoal.title,
      target: dbGoal.target,
      current: dbGoal.current,
      targetDate: dbGoal.target_date ? new Date(dbGoal.target_date) : undefined,
      color: dbGoal.color,
      // Use a default value of 100 if increment_amount is not available
      incrementAmount: hasIncrementAmount ? dbGoal.increment_amount : 100
    };
  };

  // Use the appropriate goals based on whether we're using local data or Supabase
  const uiGoals = useLocalData ? localGoals : goals.map(convertToUIGoal);
  console.log('[FinancialGoals] UI goals to display:', uiGoals);

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
          const isEditing = editingGoal === goal.id;

          return (
            <div key={goal.id} className="p-4 bg-white/60 border border-white/30 rounded-2xl shadow-md animate-fade-in">
              {isEditing ? (
                <div className="animate-scale-in">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-lg">Edit Goal</h3>
                    <button
                      onClick={() => setEditingGoal(null)}
                      className="p-1 rounded-full hover:bg-gray-200/50"
                      title="Cancel"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Goal Name</label>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                        className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Target Amount</label>
                        <input
                          type="number"
                          value={editFormData.target || ''}
                          onChange={(e) => setEditFormData({...editFormData, target: Number(e.target.value)})}
                          className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Current Savings</label>
                        <input
                          type="number"
                          value={editFormData.current || ''}
                          onChange={(e) => setEditFormData({...editFormData, current: Number(e.target.value)})}
                          className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Target Date</label>
                        <input
                          type="date"
                          value={editFormData.targetDate}
                          onChange={(e) => setEditFormData({...editFormData, targetDate: e.target.value})}
                          className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Increment Amount</label>
                        <input
                          type="number"
                          value={editFormData.incrementAmount || ''}
                          onChange={(e) => setEditFormData({...editFormData, incrementAmount: Number(e.target.value)})}
                          className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="px-3 py-1.5 text-sm bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(goal.id)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditGoal(goal.id)}
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Edit goal"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete goal"
                      >
                        <Trash className="w-3.5 h-3.5 text-red-500" />
                      </button>
                      <div className="text-xs text-primary/70 flex items-center ml-1">
                        Increment: {formatCurrency(goal.incrementAmount || 100)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleContribute(goal.id)}
                      className="text-sm px-3 py-1.5 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                    >
                      Add Funds
                    </button>
                  </div>
                </>
              )}
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
