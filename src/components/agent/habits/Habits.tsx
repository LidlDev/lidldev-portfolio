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
  MoreHorizontal
} from 'lucide-react';

interface HabitEntry {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number; // target per frequency period
  color: string;
  icon: string;
  entries: HabitEntry[];
  createdAt: Date;
}

const Habits: React.FC = () => {
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
    icon: 'Target'
  });

  // Mock habits data
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Exercise',
      description: '30 minutes of physical activity',
      category: 'Health',
      frequency: 'daily',
      target: 1,
      color: 'bg-green-500',
      icon: 'Dumbbell',
      createdAt: new Date(2024, 10, 1),
      entries: [
        { date: '2024-12-18', completed: true },
        { date: '2024-12-17', completed: true },
        { date: '2024-12-16', completed: false },
        { date: '2024-12-15', completed: true },
        { date: '2024-12-14', completed: true },
        { date: '2024-12-13', completed: true },
        { date: '2024-12-12', completed: false }
      ]
    },
    {
      id: '2',
      name: 'Read Books',
      description: 'Read for at least 30 minutes',
      category: 'Learning',
      frequency: 'daily',
      target: 1,
      color: 'bg-blue-500',
      icon: 'BookOpen',
      createdAt: new Date(2024, 10, 5),
      entries: [
        { date: '2024-12-18', completed: true },
        { date: '2024-12-17', completed: true },
        { date: '2024-12-16', completed: true },
        { date: '2024-12-15', completed: false },
        { date: '2024-12-14', completed: true },
        { date: '2024-12-13', completed: true },
        { date: '2024-12-12', completed: true }
      ]
    },
    {
      id: '3',
      name: 'Meditation',
      description: '10 minutes of mindfulness',
      category: 'Wellness',
      frequency: 'daily',
      target: 1,
      color: 'bg-purple-500',
      icon: 'Brain',
      createdAt: new Date(2024, 10, 10),
      entries: [
        { date: '2024-12-18', completed: false },
        { date: '2024-12-17', completed: true },
        { date: '2024-12-16', completed: true },
        { date: '2024-12-15', completed: true },
        { date: '2024-12-14', completed: false },
        { date: '2024-12-13', completed: true },
        { date: '2024-12-12', completed: true }
      ]
    },
    {
      id: '4',
      name: 'Drink Water',
      description: '8 glasses of water daily',
      category: 'Health',
      frequency: 'daily',
      target: 8,
      color: 'bg-cyan-500',
      icon: 'Droplets',
      createdAt: new Date(2024, 10, 15),
      entries: [
        { date: '2024-12-18', completed: true },
        { date: '2024-12-17', completed: true },
        { date: '2024-12-16', completed: false },
        { date: '2024-12-15', completed: true },
        { date: '2024-12-14', completed: true },
        { date: '2024-12-13', completed: false },
        { date: '2024-12-12', completed: true }
      ]
    }
  ]);

  // Get dates for the current view period
  const getDatesForPeriod = () => {
    const today = new Date();
    const dates = [];
    
    if (viewPeriod === 'week') {
      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else {
      // Get last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const dates = getDatesForPeriod();

  // Calculate habit statistics
  const calculateHabitStats = (habit: Habit) => {
    const recentEntries = habit.entries.filter(entry => 
      dates.includes(entry.date)
    );
    
    const completed = recentEntries.filter(entry => entry.completed).length;
    const total = dates.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedDates = [...dates].reverse();
    
    for (const date of sortedDates) {
      const entry = habit.entries.find(e => e.date === date);
      if (entry && entry.completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    
    for (const entry of habit.entries.sort((a, b) => a.date.localeCompare(b.date))) {
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
  const handleCreateHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: `habit_${Date.now()}`,
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category,
      frequency: newHabit.frequency,
      target: newHabit.target,
      color: newHabit.color,
      icon: newHabit.icon,
      entries: []
    };

    setHabits(prev => [...prev, habit]);
    setNewHabit({
      name: '',
      description: '',
      category: 'Health',
      frequency: 'daily',
      target: 1,
      color: 'bg-green-500',
      icon: 'Target'
    });
    setShowNewHabit(false);
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
  const handleUpdateHabit = () => {
    if (!editingHabit || !newHabit.name.trim()) return;

    const updatedHabit: Habit = {
      ...editingHabit,
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category,
      frequency: newHabit.frequency,
      target: newHabit.target,
      color: newHabit.color,
      icon: newHabit.icon
    };

    setHabits(prev => prev.map(h => h.id === editingHabit.id ? updatedHabit : h));
    setEditingHabit(null);
    setNewHabit({
      name: '',
      description: '',
      category: 'Health',
      frequency: 'daily',
      target: 1,
      color: 'bg-green-500',
      icon: 'Target'
    });
    setShowNewHabit(false);
  };

  // Habit deletion handler
  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const existingEntry = habit.entries.find(e => e.date === date);
      
      if (existingEntry) {
        return {
          ...habit,
          entries: habit.entries.map(entry =>
            entry.date === date ? { ...entry, completed: !entry.completed } : entry
          )
        };
      } else {
        return {
          ...habit,
          entries: [...habit.entries, { date, completed: true }]
        };
      }
    }));
  };

  // Get overall statistics
  const overallStats = useMemo(() => {
    const totalHabits = habits.length;
    const todayDate = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => 
      habit.entries.some(entry => entry.date === todayDate && entry.completed)
    ).length;
    
    const avgCompletionRate = habits.length > 0 
      ? Math.round(habits.reduce((sum, habit) => 
          sum + calculateHabitStats(habit).completionRate, 0) / habits.length)
      : 0;
    
    const totalStreaks = habits.reduce((sum, habit) => 
      sum + calculateHabitStats(habit).currentStreak, 0);
    
    return { totalHabits, completedToday, avgCompletionRate, totalStreaks };
  }, [habits, dates]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="h-full overflow-y-auto pb-4">
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
                    {(() => {
                      const IconComponent = {
                        'Dumbbell': Dumbbell,
                        'BookOpen': BookOpen,
                        'Brain': Brain,
                        'Droplets': Droplets
                      }[habit.icon] || Target;
                      return <IconComponent className="w-5 h-5" />;
                    })()}
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
                {/* Date Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dates.slice(-7).map((date) => (
                    <div key={date} className="text-center">
                      <div className="text-xs text-muted-foreground">{getDayOfWeek(date)}</div>
                      <div className="text-sm font-medium text-foreground">{formatDate(date).split(' ')[1]}</div>
                    </div>
                  ))}
                </div>

                {/* Completion Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {dates.slice(-7).map((date) => {
                    const entry = habit.entries.find(e => e.date === date);
                    const isCompleted = entry?.completed || false;
                    const isToday = date === new Date().toISOString().split('T')[0];
                    
                    return (
                      <button
                        key={date}
                        onClick={() => toggleHabitCompletion(habit.id, date)}
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

                {/* Extended view for month */}
                {viewPeriod === 'month' && (
                  <div className="mt-4">
                    <div className="grid grid-cols-10 gap-1">
                      {dates.slice(0, -7).map((date) => {
                        const entry = habit.entries.find(e => e.date === date);
                        const isCompleted = entry?.completed || false;
                        
                        return (
                          <button
                            key={date}
                            onClick={() => toggleHabitCompletion(habit.id, date)}
                            className={`aspect-square rounded border transition-all hover:scale-105 ${
                              isCompleted
                                ? `${habit.color} border-transparent`
                                : 'border-border hover:border-primary/50'
                            }`}
                            title={formatDate(date)}
                          >
                            {isCompleted && <div className="w-1 h-1 bg-white rounded-full mx-auto"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  habit.category === 'Learning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                  habit.category === 'Wellness' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
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
                    icon: 'Target'
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
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value as any})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
                <select
                  value={newHabit.icon}
                  onChange={(e) => setNewHabit({...newHabit, icon: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="Dumbbell">💪 Exercise</option>
                  <option value="BookOpen">📚 Reading</option>
                  <option value="Brain">🧘 Meditation</option>
                  <option value="Droplets">💧 Hydration</option>
                  <option value="Target">🎯 Goal</option>
                </select>
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
