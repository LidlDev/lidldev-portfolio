import React, { useState } from 'react';
import TodoItem from '@/components/agent/todo/TodoItem';
import AddTodo from '@/components/agent/todo/AddTodo';
import { Task, initialTasks, generateId } from '@/utils/agentData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface DatabaseTask {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  user_id: string;
  created_at: string;
}

const TodoList: React.FC = () => {
  const { user } = useAuth();
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);

  // Try to use Supabase data if available, otherwise fall back to local state
  let useLocalData = true;

  try {
    var {
      data: tasks,
      loading,
      addItem,
      updateItem,
      deleteItem
    } = useSupabaseData<DatabaseTask>({
      table: 'tasks',
      initialData: initialTasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        user_id: 'anonymous',
        created_at: new Date().toISOString()
      })),
      orderBy: { column: 'created_at', ascending: false }
    });

    useLocalData = false;
  } catch (error) {
    console.error('Error using Supabase data:', error);
    // Fall back to local state
  }

  // Local handlers (used when Supabase is not available)
  const handleAddTaskLocal = (title: string, dueDate?: Date) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      dueDate
    };

    setLocalTasks([newTask, ...localTasks]);
  };

  const handleCompleteTaskLocal = (id: string) => {
    setLocalTasks(
      localTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTaskLocal = (id: string) => {
    setLocalTasks(localTasks.filter(task => task.id !== id));
  };

  // Supabase handlers
  const handleAddTaskSupabase = async (title: string, dueDate?: Date) => {
    if (!user) {
      // If not logged in, fall back to local state
      handleAddTaskLocal(title, dueDate);
      return;
    }

    try {
      await addItem({
        title,
        completed: false,
        due_date: dueDate ? dueDate.toISOString() : null
      });
    } catch (error) {
      console.error('Error adding task to Supabase:', error);
      // Fall back to local state
      handleAddTaskLocal(title, dueDate);
    }
  };

  const handleCompleteTaskSupabase = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateItem(id, { completed: !task.completed });
      }
    } catch (error) {
      console.error('Error completing task in Supabase:', error);
      // Fall back to local state
      handleCompleteTaskLocal(id);
    }
  };

  const handleDeleteTaskSupabase = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Error deleting task from Supabase:', error);
      // Fall back to local state
      handleDeleteTaskLocal(id);
    }
  };

  // Use the appropriate handlers based on whether we're using local data or Supabase
  const handleAddTask = useLocalData ? handleAddTaskLocal : handleAddTaskSupabase;
  const handleCompleteTask = useLocalData ? handleCompleteTaskLocal : handleCompleteTaskSupabase;
  const handleDeleteTask = useLocalData ? handleDeleteTaskLocal : handleDeleteTaskSupabase;

  // Convert database tasks to UI tasks if using Supabase
  const convertToUITask = (dbTask: DatabaseTask): Task => ({
    id: dbTask.id,
    title: dbTask.title,
    completed: dbTask.completed,
    dueDate: dbTask.due_date ? new Date(dbTask.due_date) : undefined
  });

  // Use the appropriate tasks based on whether we're using local data or Supabase
  const uiTasks = useLocalData ? localTasks : tasks.map(convertToUITask);
  const activeTasks = uiTasks.filter(task => !task.completed);
  const completedTasks = uiTasks.filter(task => task.completed);

  if (!useLocalData && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-primary">Loading tasks...</span>
      </div>
    );
  }

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
