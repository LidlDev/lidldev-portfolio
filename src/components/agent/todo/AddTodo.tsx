import React, { useState } from 'react';
import { generateId } from '@/utils/agentData';

interface AddTodoProps {
  onAddTask: (title: string, dueDate?: Date) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAddTask(
        title.trim(), 
        dueDate ? new Date(dueDate) : undefined
      );
      setTitle('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="glass p-3 rounded-lg flex flex-col space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="px-3 py-2 bg-white/30 rounded-lg border-none focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-primary/50"
        />
        
        <div className="flex space-x-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-grow px-3 py-2 bg-white/30 rounded-lg border-none focus:ring-1 focus:ring-primary focus:outline-none text-primary/70 text-sm"
          />
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTodo;
