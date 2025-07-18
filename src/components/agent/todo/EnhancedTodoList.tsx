import React, { useState, useMemo } from 'react';
import {
  Plus,
  Filter,
  Search,
  Calendar,
  Flag,
  FolderOpen,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  WifiOff
} from 'lucide-react';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import EnhancedAddTodo from './EnhancedAddTodo';
import { Task, initialTasks, generateId } from '@/utils/agentData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useAgentData';

// Enhanced task interface
interface EnhancedTask extends Task {
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  project?: string;
  tags?: string[];
  subtasks?: EnhancedTask[];
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
}

interface DatabaseTask {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: string | null;
  category: string | null;
  project: string | null;
  tags: string[] | null;
  estimated_time: number | null;
  user_id: string;
  created_at: string;
}

const EnhancedTodoList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [showFilters, setShowFilters] = useState(false);

  // Use real data hook
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isUsingLocalFallback
  } = useTasks();

  // Categories and priorities
  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Finance', 'Home'];
  const priorities = [
    { value: 'high', label: 'High', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { value: 'low', label: 'Low', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' }
  ];

  // Enhanced add task handler
  const handleAddTask = async (
    title: string,
    dueDate?: Date,
    priority?: 'low' | 'medium' | 'high',
    category?: string,
    estimatedTime?: number
  ) => {
    await createTask({
      title,
      dueDate,
      priority,
      category,
      estimatedTime
    });
  };

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filterStatus === 'active' && task.completed) return false;
      if (filterStatus === 'completed' && !task.completed) return false;

      // Priority filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

      // Category filter
      if (filterCategory !== 'all' && task.category !== filterCategory) return false;

      return true;
    });
  }, [tasks, searchTerm, filterPriority, filterCategory, filterStatus]);

  // Task completion handler
  const handleCompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  // Task deletion handler
  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  // Get priority badge
  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const priorityConfig = priorities.find(p => p.value === priority);
    if (!priorityConfig) return null;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.color}`}>
        <Flag className="w-3 h-3 mr-1" />
        {priorityConfig.label}
      </span>
    );
  };

  // Get category badge
  const getCategoryBadge = (category?: string) => {
    if (!category) return null;
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
        <FolderOpen className="w-3 h-3 mr-1" />
        {category}
      </span>
    );
  };

  // Task statistics
  const taskStats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const overdue = tasks.filter(t =>
      !t.completed && t.dueDate && t.dueDate < new Date()
    ).length;
    const dueSoon = tasks.filter(t =>
      !t.completed && t.dueDate &&
      t.dueDate > new Date() &&
      t.dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    ).length;

    return { completed, total, overdue, dueSoon };
  }, [tasks]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading tasks</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Tasks</h2>
            {isUsingLocalFallback && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center space-x-1">
                <WifiOff className="w-3 h-3" />
                <span>Using local storage (offline mode)</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{taskStats.completed}/{taskStats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{taskStats.overdue}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Due Soon</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{taskStats.dueSoon}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Circle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{taskStats.total - taskStats.completed}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  >
                    <option value="all">All Tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Form */}
      <EnhancedAddTodo onAddTask={handleAddTask} categories={categories} />

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || filterPriority !== 'all' || filterCategory !== 'all' 
                ? 'No tasks match your filters' 
                : 'No tasks yet. Add a task to get started!'
              }
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="group">
              <TodoItem
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onEdit={async (id, title, dueDate) => {
                  await updateTask(id, { title, dueDate });
                }}
              />
              {/* Task metadata */}
              <div className="ml-12 mb-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {getPriorityBadge(task.priority)}
                {getCategoryBadge(task.category)}
                {task.estimatedTime && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.estimatedTime}m
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedTodoList;
