import React from 'react';
import { Task } from '@/utils/agentData';
import { Check, Trash } from 'lucide-react';
import { formatDate } from '@/utils/agentData';

interface TodoItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onComplete, onDelete }) => {
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
      
      <button 
        onClick={() => onDelete(task.id)}
        className="p-1 text-primary/70 hover:text-primary transition-colors"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TodoItem;
