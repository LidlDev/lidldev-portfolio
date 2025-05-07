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
      <div className="p-3 rounded-lg mb-2 bg-white/60 animate-scale-in">
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium mb-1">Task</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Due Date (Optional)</label>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="px-3 py-2 bg-white/30 rounded-lg w-full border-none focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 text-xs bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
      className={`flex items-center justify-between p-3 rounded-lg mb-2 transition-all duration-300
        ${task.completed ? 'bg-primary/10 text-primary/60' : 'bg-white/40 hover:bg-white/50'}`}
    >
      <div className="flex items-center">
        <button
          onClick={() => onComplete(task.id)}
          className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-colors
            ${task.completed ? 'bg-primary text-white' : 'border-2 border-primary'}`}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex flex-col">
          <span className={`text-sm transition-all ${task.completed ? 'line-through opacity-70' : ''}`}>{task.title}</span>
          {task.dueDate && (
            <span className="text-xs text-primary/70">{formatDate(task.dueDate)}</span>
          )}
        </div>
      </div>

      <div className="flex space-x-1">
        {onEdit && !task.completed && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-primary/70 hover:text-primary transition-colors"
            title="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-primary/70 hover:text-primary transition-colors"
          title="Delete task"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
