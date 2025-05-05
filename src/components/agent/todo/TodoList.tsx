import React, { useState } from 'react';
import TodoItem from '@/components/agent/todo/TodoItem';
import AddTodo from '@/components/agent/todo/AddTodo';
import { Task, initialTasks, generateId } from '@/utils/agentData';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (title: string, dueDate?: Date) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      dueDate
    };
    
    setTasks([newTask, ...tasks]);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Split tasks into active and completed
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Tasks</h2>
        <AddTodo onAddTask={handleAddTask} />
        
        <div className="space-y-1">
          {activeTasks.length === 0 ? (
            <p className="text-center text-primary/50 py-4">No tasks yet. Add a task to get started!</p>
          ) : (
            activeTasks.map(task => (
              <TodoItem
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>
      
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-primary/70 mb-2">Completed</h3>
          <div className="space-y-1 opacity-70">
            {completedTasks.map(task => (
              <TodoItem
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
