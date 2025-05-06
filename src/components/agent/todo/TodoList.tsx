import React from 'react';
import TodoItem from '@/components/agent/todo/TodoItem';
import AddTodo from '@/components/agent/todo/AddTodo';
import { Task, initialTasks } from '@/utils/agentData';
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

  const {
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

  const handleAddTask = async (title: string, dueDate?: Date) => {
    if (!user) {
      // If not logged in, show a message or prompt to log in
      return;
    }

    await addItem({
      title,
      completed: false,
      due_date: dueDate ? dueDate.toISOString() : null
    });
  };

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateItem(id, { completed: !task.completed });
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteItem(id);
  };

  // Convert database tasks to UI tasks
  const convertToUITask = (dbTask: DatabaseTask): Task => ({
    id: dbTask.id,
    title: dbTask.title,
    completed: dbTask.completed,
    dueDate: dbTask.due_date ? new Date(dbTask.due_date) : undefined
  });

  // Split tasks into active and completed
  const uiTasks = tasks.map(convertToUITask);
  const activeTasks = uiTasks.filter(task => !task.completed);
  const completedTasks = uiTasks.filter(task => task.completed);

  if (loading) {
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
