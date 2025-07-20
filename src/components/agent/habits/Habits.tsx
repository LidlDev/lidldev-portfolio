import React, { useState, useMemo } from 'react';
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Award,
  BarChart3,
  Clock,
  Dumbbell,
  BookOpen,
  Brain,
  Droplets,
  X,
  Edit3,
  Trash2,
  MoreHorizontal,
  Loader2,
  WifiOff,
  Heart,
  Utensils,
  Moon,
  Briefcase,
  Users,
  Palette,
  Music,
  Coffee,
  Smartphone,
  Home,
  Car,
  Gamepad2,
  Camera,
  Headphones,
  Zap
} from 'lucide-react';
import { useHabits } from '@/hooks/useAgentData';
import { Habit, HabitEntry } from '@/services/agentDataService';
import { toast } from 'sonner';

// Category options with Lucide icons
const HABIT_CATEGORIES = [
  { value: 'Health', label: 'Health', icon: Heart },
  { value: 'Fitness', label: 'Fitness', icon: Dumbbell },
  { value: 'Nutrition', label: 'Nutrition', icon: Utensils },
  { value: 'Sleep', label: 'Sleep', icon: Moon },
  { value: 'Learning', label: 'Learning', icon: BookOpen },
  { value: 'Mindfulness', label: 'Mindfulness', icon: Brain },
  { value: 'Work', label: 'Work', icon: Briefcase },
  { value: 'Social', label: 'Social', icon: Users },
  { value: 'Creative', label: 'Creative', icon: Palette },
  { value: 'Music', label: 'Music', icon: Music },
  { value: 'Hydration', label: 'Hydration', icon: Droplets },
  { value: 'Technology', label: 'Technology', icon: Smartphone },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Transportation', label: 'Transportation', icon: Car },
  { value: 'Entertainment', label: 'Entertainment', icon: Gamepad2 },
  { value: 'Photography', label: 'Photography', icon: Camera },
  { value: 'Audio', label: 'Audio', icon: Headphones },
  { value: 'Energy', label: 'Energy', icon: Zap },
  { value: 'Other', label: 'Other', icon: Target }
];

// Icon mapping for habit icons
const HABIT_ICONS = {
  Target,
  Heart,
  Dumbbell,
  BookOpen,
  Brain,
  Droplets,
  Clock,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  Utensils,
  Moon,
  Briefcase,
  Users,
  Palette,
  Music,
  Coffee,
  Smartphone,
  Home,
  Car,
  Gamepad2,
  Camera,
  Headphones,
  Zap
};

const Habits: React.FC = () => {
  // Use Supabase integration
  const { habits, habitEntries, loading, error, createHabit, updateHabit, deleteHabit, toggleHabitEntry, isUsingLocalFallback } = useHabits();

  // Helper function to render habit icons
  const renderHabitIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent = HABIT_ICONS[iconName as keyof typeof HABIT_ICONS] || Target;
    return <IconComponent className={className} />;
  };

  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [viewPeriod, setViewPeriod] = useState<'week' | 'month'>('week');
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Health',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    target: 1,
    color: 'bg-green-500',
    icon: 'Heart'
  });

  // Data now comes from Supabase via useHabits hook

  // Helper function to get habit entry for a specific date
  const getHabitEntry = (habitId: string, date: string) => {
    return habitEntries.find(entry =>
      entry.habitId === habitId &&
      entry.entryDate.toISOString().split('T')[0] === date
    );
  };



  // Get dates for a specific habit based on its frequency
  const getDatesForHabit = (habit: Habit) => {
    const today = new Date();
    const dates = [];

    if (habit.frequency === 'daily') {
      // Show daily tracking
      const numDays = viewPeriod === 'week' ? 7 : 30;
      for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (habit.frequency === 'weekly') {
      // Show weekly tracking (last 8 weeks)
      for (let i = 7; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - (i * 7));
        // Get the start of the week (Monday)
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        date.setDate(diff);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (habit.frequency === 'monthly') {
      // Show monthly tracking (last 6 months)
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        date.setDate(1); // First day of the month
        dates.push(date.toISOString().split('T')[0]);
      }
    }

    return dates;
  };



  // Calculate habit statistics
  const calculateHabitStats = (habit: Habit) => {
    const habitDates = getDatesForHabit(habit);
    const habitEntriesForHabit = habitEntries.filter(entry => entry.habitId === habit.id);
    const recentEntries = habitEntriesForHabit.filter(entry =>
      habitDates.includes(entry.entryDate.toISOString().split('T')[0])
    );

    const completed = recentEntries.filter(entry => entry.completed).length;
    const total = habitDates.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedDates = [...habitDates].reverse();

    for (const date of sortedDates) {
      const entry = habitEntriesForHabit.find(e => e.entryDate.toISOString().split('T')[0] === date);
      if (entry && entry.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;

    const sortedEntries = habitEntriesForHabit.sort((a, b) =>
      a.entryDate.getTime() - b.entryDate.getTime()
    );

    for (const entry of sortedEntries) {
      if (entry.completed) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { completed, total, completionRate, currentStreak, bestStreak };
  };

  // Habit creation handler
  const handleCreateHabit = async () => {
    if (!newHabit.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    try {
      const habitData = {
        name: newHabit.name,
        description: newHabit.description,
        category: newHabit.category,
        frequency: newHabit.frequency,
        target: newHabit.target,
        color: newHabit.color,
        icon: newHabit.icon
      };

      const createdHabit = await createHabit(habitData);
      if (createdHabit) {
        setNewHabit({
          name: '',
          description: '',
          category: 'Health',
          frequency: 'daily',
          target: 1,
          color: 'bg-green-500',
          icon: 'Heart'
        });
        setShowNewHabit(false);
        toast.success('Habit created successfully');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  // Habit editing handler
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency,
      target: habit.target,
      color: habit.color,
      icon: habit.icon
    });
    setShowNewHabit(true);
  };

  // Habit update handler
  const handleUpdateHabit = async () => {
    if (!editingHabit || !newHabit.name.trim()) return;

    try {
      const updates = {
        name: newHabit.name,
        description: newHabit.description,
        category: newHabit.category,
        frequency: newHabit.frequency,
        target: newHabit.target,
        color: newHabit.color,
        icon: newHabit.icon
      };

      const success = await updateHabit(editingHabit.id, updates);
      if (success) {
        setEditingHabit(null);
        setNewHabit({
          name: '',
          description: '',
          category: 'Health',
          frequency: 'daily',
          target: 1,
          color: 'bg-green-500',
          icon: 'Heart'
        });
        setShowNewHabit(false);
        toast.success('Habit updated successfully');
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  // Habit deletion handler
  const handleDeleteHabit = async (habitId: string) => {
    try {
      const success = await deleteHabit(habitId);
      if (success) {
        toast.success('Habit deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  // Toggle habit completion for a specific date
  const handleToggleHabitCompletion = async (habitId: string, date: string) => {
    try {
      // Convert string date to Date object
      const dateObj = new Date(date + 'T00:00:00.000Z');

      const success = await toggleHabitEntry(habitId, dateObj);
      if (success) {
        toast.success('Habit updated');
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      toast.error('Failed to update habit');
    }
  };

  // Get overall statistics
  const overallStats = useMemo(() => {
    const totalHabits = habits.length;
    const todayDate = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit =>
      habitEntries.some(entry =>
        entry.habitId === habit.id &&
        entry.entryDate.toISOString().split('T')[0] === todayDate &&
        entry.completed
      )
    ).length;

    const avgCompletionRate = habits.length > 0
      ? Math.round(habits.reduce((sum, habit) =>
          sum + calculateHabitStats(habit).completionRate, 0) / habits.length)
      : 0;

    const totalStreaks = habits.reduce((sum, habit) =>
      sum + calculateHabitStats(habit).currentStreak, 0);

    return { totalHabits, completedToday, avgCompletionRate, totalStreaks };
  }, [habits, habitEntries]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isDateInCurrentWeek = (date: Date) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  };

  const isDateInCurrentMonth = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Connection Status */}
      {isUsingLocalFallback && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Using local storage - habits won't sync across devices</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Habits</h2>
          <div className="flex items-center space-x-2">
            {/* View Period Toggle */}
            <div className="flex bg-secondary rounded-lg p-1">
              {(['week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setViewPeriod(period)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                    viewPeriod === period
                      ? 'bg-primary text-primary-foreground'
                      : 'text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewHabit(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Habit</span>
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Habits</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{overallStats.totalHabits}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {overallStats.completedToday}/{overallStats.totalHabits}
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Avg Rate</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{overallStats.avgCompletionRate}%</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Total Streaks</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{overallStats.totalStreaks}</p>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="space-y-6">
        {habits.map((habit) => {
          const stats = calculateHabitStats(habit);
          
          return (
            <div key={habit.id} className="bg-card border border-border rounded-lg p-6">
              {/* Habit Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${habit.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {renderHabitIcon(habit.icon, "w-5 h-5")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-4 text-sm mr-2">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-foreground font-medium">{stats.currentStreak}</span>
                      <span className="text-muted-foreground">day streak</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-foreground font-medium">{stats.completionRate}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditHabit(habit)}
                    className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Habit Calendar */}
              <div className="space-y-2">
                {(() => {
                  const habitDates = getDatesForHabit(habit);

                  if (habit.frequency === 'daily') {
                    return (
                      <>
                        {/* Date Headers for Daily */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {habitDates.slice(-7).map((date) => (
                            <div key={date} className="text-center">
                              <div className="text-xs text-muted-foreground">{getDayOfWeek(date)}</div>
                              <div className="text-sm font-medium text-foreground">{formatDate(date).split(' ')[1]}</div>
                            </div>
                          ))}
                        </div>

                        {/* Completion Grid for Daily */}
                        <div className="grid grid-cols-7 gap-2">
                          {habitDates.slice(-7).map((date) => {
                            const entry = getHabitEntry(habit.id, date);
                            const isCompleted = entry?.completed || false;
                            const isToday = date === new Date().toISOString().split('T')[0];

                            return (
                              <button
                                key={date}
                                onClick={() => handleToggleHabitCompletion(habit.id, date)}
                                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                                  isCompleted
                                    ? `${habit.color} border-transparent text-white`
                                    : isToday
                                      ? 'border-primary bg-primary/10'
                                      : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 mx-auto" />
                                ) : (
                                  <Circle className="w-5 h-5 mx-auto text-muted-foreground" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  } else if (habit.frequency === 'weekly') {
                    return (
                      <>
                        <div className="text-sm text-muted-foreground mb-2">Weekly tracking (each cell = 1 week)</div>
                        <div className="grid grid-cols-8 gap-2">
                          {habitDates.map((date) => {
                            const entry = getHabitEntry(habit.id, date);
                            const isCompleted = entry?.completed || false;
                            const weekStart = new Date(date);
                            const isCurrentWeek = isDateInCurrentWeek(weekStart);

                            return (
                              <button
                                key={date}
                                onClick={() => handleToggleHabitCompletion(habit.id, date)}
                                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                                  isCompleted
                                    ? `${habit.color} border-transparent text-white`
                                    : isCurrentWeek
                                      ? 'border-primary bg-primary/10'
                                      : 'border-border hover:border-primary/50'
                                }`}
                                title={`Week of ${formatDate(date)}`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 mx-auto" />
                                ) : (
                                  <Circle className="w-4 h-4 mx-auto text-muted-foreground" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div className="text-sm text-muted-foreground mb-2">Monthly tracking (each cell = 1 month)</div>
                        <div className="grid grid-cols-6 gap-2">
                          {habitDates.map((date) => {
                            const entry = getHabitEntry(habit.id, date);
                            const isCompleted = entry?.completed || false;
                            const monthDate = new Date(date);
                            const isCurrentMonth = isDateInCurrentMonth(monthDate);

                            return (
                              <button
                                key={date}
                                onClick={() => handleToggleHabitCompletion(habit.id, date)}
                                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                                  isCompleted
                                    ? `${habit.color} border-transparent text-white`
                                    : isCurrentMonth
                                      ? 'border-primary bg-primary/10'
                                      : 'border-border hover:border-primary/50'
                                }`}
                                title={monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 mx-auto" />
                                ) : (
                                  <Circle className="w-4 h-4 mx-auto text-muted-foreground" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  }
                })()}
              </div>

              {/* Habit Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="text-foreground font-medium">{stats.completed}/{stats.total}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">Best streak:</span>
                    <span className="text-foreground font-medium">{stats.bestStreak} days</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  habit.category === 'Health' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  habit.category === 'Fitness' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                  habit.category === 'Learning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                  habit.category === 'Mindfulness' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                  habit.category === 'Work' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                  habit.category === 'Social' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' :
                  habit.category === 'Creative' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' :
                  'bg-secondary text-secondary-foreground'
                }`}>
                  {habit.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {habits.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-4">Start building positive habits to improve your daily routine</p>
          <button
            onClick={() => setShowNewHabit(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create your first habit
          </button>
        </div>
      )}

      {/* Habit Creation Modal */}
      {showNewHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button
                onClick={() => {
                  setShowNewHabit(false);
                  setEditingHabit(null);
                  setNewHabit({
                    name: '',
                    description: '',
                    category: 'Health',
                    frequency: 'daily',
                    target: 1,
                    color: 'bg-green-500',
                    icon: 'Heart'
                  });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Enter habit name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {HABIT_CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value as 'daily' | 'weekly' | 'monthly'})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
                <div className="grid grid-cols-6 gap-2 p-3 bg-input rounded-lg border border-border">
                  {Object.entries(HABIT_ICONS).map(([iconName, IconComponent]) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setNewHabit({...newHabit, icon: iconName})}
                      className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                        newHabit.icon === iconName
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      title={iconName}
                    >
                      <IconComponent className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNewHabit(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingHabit ? handleUpdateHabit : handleCreateHabit}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingHabit ? 'Update Habit' : 'Create Habit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
