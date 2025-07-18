import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit3,
  Target,
  Calendar,
  Wallet,
  Home,
  Utensils,
  Car,
  Zap,
  Film,
  ShoppingBag,
  Dumbbell,
  PiggyBank,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, initialExpenses, initialGoals } from '@/utils/agentData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
  icon: string;
  isEssential: boolean;
}

interface MonthlyBudget {
  month: string;
  year: number;
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

interface DatabaseExpense {
  id: string;
  category: string;
  amount: number;
  date: string;
  user_id: string;
  created_at: string;
}

interface DatabaseGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  target_date: string | null;
  color: string;
  user_id: string;
  created_at: string;
}

const BudgetTracker: React.FC = () => {
  const { user } = useAuth();
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, -1 = previous month, etc.

  // Goal management state
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    current: 0,
    targetDate: '',
    incrementAmount: 100,
  });

  // Budget category editing state
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState(0);

  // Get real expense data
  const {
    data: expenseData = [],
    loading: expensesLoading
  } = useSupabaseData<DatabaseExpense>({
    table: 'expenses',
    initialData: initialExpenses.map(expense => ({
      id: expense.id,
      category: expense.category,
      amount: expense.amount,
      date: expense.date.toISOString(),
      user_id: 'anonymous',
      created_at: new Date().toISOString()
    })),
    orderBy: { column: 'date', ascending: false }
  });

  // Get financial goals data
  const {
    data: goalsData = [],
    updateItem: updateGoal
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
      created_at: new Date().toISOString()
    })),
    orderBy: { column: 'created_at', ascending: false }
  });
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Goal management handlers
  const handleCreateGoal = async () => {
    if (!newGoal.title.trim() || newGoal.target <= 0) return;

    try {
      const goalData = {
        title: newGoal.title,
        target: newGoal.target,
        current: newGoal.current,
        target_date: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
        color: '#174E4F',
        increment_amount: newGoal.incrementAmount,
      };

      // This will be handled by the useSupabaseData hook
      console.log('Creating goal:', goalData);

      setNewGoal({
        title: '',
        target: 0,
        current: 0,
        targetDate: '',
        incrementAmount: 100,
      });
      setShowGoalForm(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleEditGoal = (goal: DatabaseGoal) => {
    setEditingGoal(goal.id);
    setNewGoal({
      title: goal.title,
      target: goal.target,
      current: goal.current,
      targetDate: goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : '',
      incrementAmount: goal.increment_amount || 100,
    });
    setShowGoalForm(true);
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal || !newGoal.title.trim() || newGoal.target <= 0) return;

    try {
      const goalData = {
        title: newGoal.title,
        target: newGoal.target,
        current: newGoal.current,
        target_date: newGoal.targetDate ? new Date(newGoal.targetDate).toISOString() : null,
        increment_amount: newGoal.incrementAmount,
      };

      console.log('Updating goal:', goalData);

      setNewGoal({
        title: '',
        target: 0,
        current: 0,
        targetDate: '',
        incrementAmount: 100,
      });
      setShowGoalForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleIncrementGoal = async (goalId: string, amount: number) => {
    try {
      const goal = goalsData.find(g => g.id === goalId);
      if (!goal) return;

      const newCurrent = Math.min(goal.current + amount, goal.target);

      // Update the goal in the database
      await updateGoal(goalId, {
        current: newCurrent
      });

      // Add visual feedback with animation
      const goalElement = document.querySelector(`[data-goal-id="${goalId}"]`);
      if (goalElement) {
        goalElement.classList.add('animate-pulse');
        setTimeout(() => {
          goalElement.classList.remove('animate-pulse');
        }, 1000);
      }

      // Show success message
      const isCompleted = newCurrent >= goal.target;
      if (isCompleted) {
        console.log(`🎉 Goal "${goal.title}" completed! You reached $${goal.target}!`);
      } else {
        console.log(`Added $${amount} to ${goal.title}! New total: $${newCurrent}`);
      }

    } catch (error) {
      console.error('Error incrementing goal:', error);
    }
  };

  // Budget category editing handlers
  const handleEditBudgetCategory = (categoryId: string, currentBudget: number) => {
    setEditingCategory(categoryId);
    setBudgetAmount(currentBudget);
    setShowBudgetForm(true);
  };

  const handleSaveBudgetCategory = () => {
    if (!editingCategory) return;

    // Here you would typically save to a database
    // For now, we'll just show a success message
    console.log(`Updated budget for category ${editingCategory} to $${budgetAmount}`);

    setShowBudgetForm(false);
    setEditingCategory(null);
    setBudgetAmount(0);
  };

  // Month navigation functions
  const getCurrentMonthYear = () => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return {
      month: targetDate.getMonth(),
      year: targetDate.getFullYear(),
      date: targetDate
    };
  };

  const goToPreviousMonth = () => {
    setMonthOffset(prev => prev - 1);
  };

  const goToNextMonth = () => {
    if (monthOffset < 0) {
      setMonthOffset(prev => prev + 1);
    }
  };

  const goToCurrentMonth = () => {
    setMonthOffset(0);
  };

  const formatMonthLabel = () => {
    const { date } = getCurrentMonthYear();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate real spending from expense data
  const calculateRealSpending = useMemo(() => {
    const { month, year } = getCurrentMonthYear();
    const currentMonthExpenses = expenseData.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });

    // Group expenses by category and calculate totals
    const categorySpending: { [key: string]: number } = {};
    currentMonthExpenses.forEach(expense => {
      const categoryKey = expense.category;
      categorySpending[categoryKey] = Math.round(((categorySpending[categoryKey] || 0) + expense.amount) * 100) / 100;
    });

    return categorySpending;
  }, [expenseData, monthOffset]);

  // Budget categories with real spending data
  const budgetCategories: BudgetCategory[] = [
    {
      id: '1',
      name: 'Housing',
      budgeted: 1500,
      spent: calculateRealSpending['Housing'] || 0,
      color: '#3B82F6',
      icon: 'Home',
      isEssential: true
    },
    {
      id: '2',
      name: 'Food',
      budgeted: 600,
      spent: calculateRealSpending['Food'] || 0,
      color: '#10B981',
      icon: 'Utensils',
      isEssential: true
    },
    {
      id: '3',
      name: 'Transportation',
      budgeted: 400,
      spent: calculateRealSpending['Transportation'] || 0,
      color: '#F59E0B',
      icon: 'Car',
      isEssential: true
    },
    {
      id: '4',
      name: 'Utilities',
      budgeted: 200,
      spent: calculateRealSpending['Utilities'] || 0,
      color: '#8B5CF6',
      icon: 'Zap',
      isEssential: true
    },
    {
      id: '5',
      name: 'Entertainment',
      budgeted: 300,
      spent: calculateRealSpending['Entertainment'] || 0,
      color: '#EC4899',
      icon: 'Film',
      isEssential: false
    },
    {
      id: '6',
      name: 'Other',
      budgeted: 400,
      spent: calculateRealSpending['Other'] || 0,
      color: '#06B6D4',
      icon: 'ShoppingBag',
      isEssential: false
    }
  ];

  // Current budget with real data
  const { month, year } = getCurrentMonthYear();
  const currentBudget: MonthlyBudget = {
    month: formatMonthLabel().split(' ')[0], // Just the month name
    year: year,
    totalIncome: 5000,
    totalBudgeted: budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0),
    totalSpent: budgetCategories.reduce((sum, cat) => sum + cat.spent, 0),
    categories: budgetCategories
  };



  // Calculate budget statistics
  const budgetStats = useMemo(() => {
    const totalBudgeted = currentBudget.totalBudgeted;
    const totalSpent = currentBudget.totalSpent;
    const remaining = totalBudgeted - totalSpent;
    const spentPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    
    const overBudgetCategories = currentBudget.categories.filter(cat => cat.spent > cat.budgeted);
    const underBudgetCategories = currentBudget.categories.filter(cat => cat.spent < cat.budgeted);
    
    const totalSavings = currentBudget.totalIncome - totalSpent;
    const savingsRate = currentBudget.totalIncome > 0 ? (totalSavings / currentBudget.totalIncome) * 100 : 0;

    return {
      totalBudgeted,
      totalSpent,
      remaining,
      spentPercentage,
      overBudgetCategories: overBudgetCategories.length,
      underBudgetCategories: underBudgetCategories.length,
      totalSavings,
      savingsRate
    };
  }, [currentBudget]);

  // Prepare chart data
  const pieChartData = currentBudget.categories.map(category => ({
    name: category.name,
    value: category.spent,
    color: category.color,
    budgeted: category.budgeted,
    percentage: currentBudget.totalSpent > 0 ? (category.spent / currentBudget.totalSpent) * 100 : 0
  }));

  const barChartData = currentBudget.categories.map(category => ({
    name: category.name.length > 10 ? category.name.substring(0, 10) + '...' : category.name,
    budgeted: category.budgeted,
    spent: category.spent,
    remaining: Math.max(0, category.budgeted - category.spent),
    over: Math.max(0, category.spent - category.budgeted)
  }));

  const getCategoryStatus = (category: BudgetCategory) => {
    const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
    
    if (percentage > 100) return { status: 'over', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
    if (percentage > 80) return { status: 'warning', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { status: 'good', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <TrendingUp className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Budget Tracker</h2>
          <div className="flex items-center space-x-2">
            {/* Month Navigation */}
            <button
              onClick={goToPreviousMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={goToCurrentMonth}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                monthOffset === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              title="Current month"
            >
              Today
            </button>

            <button
              onClick={goToNextMonth}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                monthOffset < 0
                  ? 'bg-secondary hover:bg-secondary/80'
                  : 'bg-secondary/50 text-muted-foreground cursor-not-allowed'
              }`}
              disabled={monthOffset >= 0}
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Month Display */}
        <div className="text-center mb-4">
          <span className="text-lg font-medium text-foreground">{formatMonthLabel()}</span>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Budget</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(budgetStats.totalBudgeted)}
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(budgetStats.totalSpent)}
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(budgetStats.spentPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Remaining</span>
            </div>
            <p className={`text-lg font-semibold ${budgetStats.remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(budgetStats.remaining)}
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Savings Rate</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {budgetStats.savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending Distribution Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Spending Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Spent']}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Actual Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget vs Actual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {currentBudget.categories.map((category) => {
            const status = getCategoryStatus(category);
            const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
            
            return (
              <div key={category.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                    {(() => {
                      const IconComponent = {
                        'Home': Home,
                        'Utensils': Utensils,
                        'Car': Car,
                        'Zap': Zap,
                        'Film': Film,
                        'ShoppingBag': ShoppingBag,
                        'Dumbbell': Dumbbell,
                        'PiggyBank': PiggyBank
                      }[category.icon] || DollarSign;
                      return <IconComponent className="w-5 h-5" style={{ color: category.color }} />;
                    })()}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{category.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatCurrency(category.spent)} of {formatCurrency(category.budgeted)}</span>
                      {category.isEssential && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs">
                          Essential
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${status.color}`}>
                      {getStatusIcon(status.status)}
                      <span className="font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.spent > category.budgeted 
                        ? `${formatCurrency(category.spent - category.budgeted)} over`
                        : `${formatCurrency(category.budgeted - category.spent)} left`
                      }
                    </div>
                  </div>
                  
                  <div className="w-32">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage > 100 ? 'bg-red-500' : 
                          percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEditBudgetCategory(category.id, category.budgeted)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Edit budget amount"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Over Budget</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{budgetStats.overBudgetCategories} categories</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Under Budget</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{budgetStats.underBudgetCategories} categories</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Monthly Savings</span>
          </div>
          <p className={`text-lg font-semibold ${budgetStats.totalSavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(budgetStats.totalSavings)}
          </p>
        </div>
      </div>

      {/* Financial Goals Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Financial Goals</h2>
          <button
            onClick={() => setShowGoalForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goalsData.map((goal) => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const isCompleted = progress >= 100;
            const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <div
                key={goal.id}
                data-goal-id={goal.id}
                className="bg-card border border-border rounded-lg p-6 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{goal.title}</h3>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.color }}></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{progress.toFixed(1)}%</span>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: goal.color
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium text-foreground">{formatCurrency(goal.current)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium text-foreground">{formatCurrency(goal.target)}</span>
                  </div>

                  {daysLeft !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Days left</span>
                      <span className={`font-medium ${daysLeft < 30 ? 'text-orange-500' : 'text-foreground'}`}>
                        {daysLeft > 0 ? daysLeft : 'Overdue'}
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    >
                      <Edit3 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleIncrementGoal(goal.id, goal.increment_amount || 100)}
                      className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      Add ${goal.increment_amount || Math.min(100, goal.target - goal.current)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Creation/Edit Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button
                onClick={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                  setNewGoal({
                    title: '',
                    target: 0,
                    current: 0,
                    targetDate: '',
                    incrementAmount: 100,
                  });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Enter goal title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Target Amount</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Current Amount</label>
                  <input
                    type="number"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({...newGoal, current: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Increment Amount</label>
                  <input
                    type="number"
                    value={newGoal.incrementAmount}
                    onChange={(e) => setNewGoal({...newGoal, incrementAmount: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
                    setNewGoal({
                      title: '',
                      target: 0,
                      current: 0,
                      targetDate: '',
                      incrementAmount: 100,
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Category Edit Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Budget Amount</h3>
              <button
                onClick={() => {
                  setShowBudgetForm(false);
                  setEditingCategory(null);
                  setBudgetAmount(0);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Monthly Budget Amount
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Enter budget amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowBudgetForm(false);
                    setEditingCategory(null);
                    setBudgetAmount(0);
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBudgetCategory}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
