import React, { useState } from 'react';
import { Task } from '@/utils/agentData';
import { Check, Trash, Pencil, X } from 'lucide-react';
import { formatDate } from '@/utils/agentData';

interface TodoItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, title: string, dueDate?: Date) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  );

  const handleSaveEdit = () => {
    if (onEdit && editTitle.trim()) {
      onEdit(
        task.id,
        editTitle.trim(),
        editDueDate ? new Date(editDueDate) : undefined
      );
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 rounded-lg mb-2 bg-card/60 border border-border animate-scale-in">
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium mb-1 text-foreground">Task</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-foreground">Due Date (Optional)</label>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="px-3 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg mb-2 transition-all duration-300 border
        ${task.completed ? 'bg-primary/10 text-muted-foreground border-primary/20' : 'bg-card hover:bg-accent/50 border-border'}`}
    >
      <div className="flex items-center">
        <button
          onClick={() => onComplete(task.id)}
          className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-colors
            ${task.completed ? 'bg-primary text-primary-foreground' : 'border-2 border-primary hover:bg-primary/10'}`}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex flex-col">
          <span className={`text-sm transition-all ${task.completed ? 'line-through opacity-70' : 'text-foreground'}`}>{task.title}</span>
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
          )}
        </div>
      </div>

      <div className="flex space-x-1">
        {onEdit && !task.completed && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          title="Delete task"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
