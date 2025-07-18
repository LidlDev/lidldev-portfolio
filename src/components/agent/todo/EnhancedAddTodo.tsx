import React, { useState } from 'react';
import { Plus, Calendar, Flag, FolderOpen, Clock, X, Mail, Users, Dumbbell, BookOpen, AlertCircle, Minus } from 'lucide-react';

interface EnhancedAddTodoProps {
  onAddTask: (
    title: string,
    dueDate?: Date,
    priority?: 'low' | 'medium' | 'high',
    category?: string,
    estimatedTime?: number
  ) => void;
  categories?: string[];
}

const EnhancedAddTodo: React.FC<EnhancedAddTodoProps> = ({ onAddTask, categories = ['Personal', 'Work', 'Health', 'Learning', 'Finance', 'Home'] }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [category, setCategory] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<number | ''>('');
  const [showAdvanced, setShowAdvanced] = useState(false);


  const priorities = [
    { value: 'high', label: 'High Priority', color: 'text-red-500', icon: AlertCircle },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-500', icon: Minus },
    { value: 'low', label: 'Low Priority', color: 'text-green-500', icon: Clock }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAddTask(
        title.trim(),
        dueDate ? new Date(dueDate) : undefined,
        priority || undefined,
        category || undefined,
        typeof estimatedTime === 'number' ? estimatedTime : undefined
      );
      
      // Reset form
      setTitle('');
      setDueDate('');
      setPriority('');
      setCategory('');
      setEstimatedTime('');
      setShowAdvanced(false);
    }
  };

  const handleQuickAdd = (quickTitle: string, quickPriority?: 'low' | 'medium' | 'high') => {
    onAddTask(quickTitle, undefined, quickPriority);
  };

  return (
    <div className="mb-6">
      {/* Quick Add Buttons */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Quick Add</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAdd('Review emails', 'medium')}
            className="flex items-center px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            <Mail className="w-3 h-3 mr-1" />
            Review emails
          </button>
          <button
            onClick={() => handleQuickAdd('Daily standup', 'high')}
            className="flex items-center px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            <Users className="w-3 h-3 mr-1" />
            Daily standup
          </button>
          <button
            onClick={() => handleQuickAdd('Exercise', 'medium')}
            className="flex items-center px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            <Dumbbell className="w-3 h-3 mr-1" />
            Exercise
          </button>
          <button
            onClick={() => handleQuickAdd('Read for 30 minutes', 'low')}
            className="flex items-center px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Read for 30 minutes
          </button>
        </div>
      </div>

      {/* Main Add Task Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4">
        <div className="space-y-4">
          {/* Task Title */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="px-4 py-3 bg-input text-foreground rounded-lg w-full border border-border focus:ring-2 focus:ring-ring focus:outline-none text-lg"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-4 py-3 rounded-lg transition-colors ${
                showAdvanced 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Plus className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="px-3 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>

                {/* Estimated Time */}
                <div>
                  <label className="flex items-center text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value ? Number(e.target.value) : '')}
                    placeholder="30"
                    min="1"
                    className="px-3 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="flex items-center text-sm font-medium text-foreground mb-2">
                    <Flag className="w-4 h-4 mr-2" />
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                    className="px-3 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  >
                    <option value="">No Priority</option>
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center text-sm font-medium text-foreground mb-2">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  >
                    <option value="">No Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Priority Buttons */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Quick Priority</label>
                <div className="flex space-x-2">
                  {priorities.map(p => {
                    const IconComponent = p.icon;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          priority === p.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 mr-1 ${p.color}`} />
                        {p.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Category Buttons */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Quick Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        category === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {priority && (
                <span className="flex items-center">
                  <Flag className="w-3 h-3 mr-1" />
                  {priorities.find(p => p.value === priority)?.label}
                </span>
              )}
              {category && (
                <span className="flex items-center">
                  <FolderOpen className="w-3 h-3 mr-1" />
                  {category}
                </span>
              )}
              {estimatedTime && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {estimatedTime}m
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              {showAdvanced && (
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setDueDate('');
                    setPriority('');
                    setCategory('');
                    setEstimatedTime('');
                  }}
                  className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Task Templates */}
      {showAdvanced && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-foreground mb-2">Task Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => {
                setTitle('Weekly team meeting');
                setPriority('high');
                setCategory('Work');
                setEstimatedTime(60);
              }}
              className="p-3 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors text-left"
            >
              <div className="font-medium text-foreground">Weekly Team Meeting</div>
              <div className="text-sm text-muted-foreground">High priority • Work • 60 min</div>
            </button>
            <button
              onClick={() => {
                setTitle('Morning workout');
                setPriority('medium');
                setCategory('Health');
                setEstimatedTime(45);
              }}
              className="p-3 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors text-left"
            >
              <div className="font-medium text-foreground">Morning Workout</div>
              <div className="text-sm text-muted-foreground">Medium priority • Health • 45 min</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAddTodo;
