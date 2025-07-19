import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TasksService,
  HabitsService,
  NotesService,
  FinancialGoalsService,
  ProjectsService,
  CalendarService,
  EnhancedTask,
  Habit,
  HabitEntry,
  Note,
  FinancialGoal,
  Project,
  ProjectTask,
  CalendarEvent
} from '@/services/agentDataService';
import { useSupabaseData } from '@/hooks/useSupabaseData';

// =============================================
// TASKS HOOK
// =============================================

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<EnhancedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const loadTasks = async () => {
    if (!user) {
      // Load from localStorage for anonymous users
      console.log('No user signed in, loading from localStorage');
      const localTasks = localStorage.getItem('anonymous_tasks');
      if (localTasks) {
        try {
          const parsed = JSON.parse(localTasks);
          setTasks(parsed.map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          })));
        } catch (parseErr) {
          console.error('Error parsing anonymous tasks:', parseErr);
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
      setUseLocalFallback(true);
      setError('Demo mode - tasks will not persist after refresh');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading tasks for user:', user.id);
      const data = await TasksService.getTasks(user);
      console.log('Loaded tasks:', data);
      setTasks(data);
      setError(null);
      setUseLocalFallback(false);
    } catch (err) {
      console.error('Error loading tasks, falling back to local storage:', err);
      setError('Using local storage (Supabase unavailable)');
      setUseLocalFallback(true);

      // Load from localStorage as fallback
      const localTasks = localStorage.getItem(`tasks_${user.id}`);
      if (localTasks) {
        try {
          const parsed = JSON.parse(localTasks);
          setTasks(parsed.map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          })));
        } catch (parseErr) {
          console.error('Error parsing local tasks:', parseErr);
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Partial<EnhancedTask>) => {
    console.log('Creating task:', task, 'User:', user ? 'signed in' : 'anonymous');

    if (!user) {
      // Create task for anonymous user
      const newTask: EnhancedTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: task.title || '',
        completed: task.completed || false,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        project: task.project,
        tags: task.tags,
        estimatedTime: task.estimatedTime,
        actualTime: task.actualTime,
        parentTaskId: task.parentTaskId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Created anonymous task:', newTask);

      setTasks(prev => {
        const updated = [newTask, ...prev];
        // Save to localStorage for anonymous users
        localStorage.setItem('anonymous_tasks', JSON.stringify(updated));
        console.log('Updated anonymous tasks count:', updated.length);
        return updated;
      });

      return newTask;
    }

    try {
      console.log('Creating task:', task);

      let newTask: EnhancedTask;

      if (useLocalFallback) {
        // Create task locally
        newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: task.title || '',
          completed: task.completed || false,
          dueDate: task.dueDate,
          priority: task.priority,
          category: task.category,
          project: task.project,
          tags: task.tags,
          estimatedTime: task.estimatedTime,
          actualTime: task.actualTime,
          parentTaskId: task.parentTaskId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('Created local task:', newTask);
      } else {
        // Try to create via Supabase
        const supabaseTask = await TasksService.createTask(user, task);
        if (!supabaseTask) {
          throw new Error('Failed to create task via Supabase');
        }
        newTask = supabaseTask;
        console.log('Task created via Supabase:', newTask);
      }

      setTasks(prev => {
        console.log('Updating tasks list, previous count:', prev.length);
        const updated = [newTask, ...prev];
        console.log('New tasks count:', updated.length);

        // Save to localStorage as backup
        if (user) {
          localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updated));
        }

        return updated;
      });

      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);

      // Fallback to local creation
      if (!useLocalFallback) {
        console.log('Falling back to local task creation');
        setUseLocalFallback(true);
        setError('Using local storage (Supabase unavailable)');
        return await createTask(task); // Retry with local fallback
      }

      setError('Failed to create task');
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<EnhancedTask>) => {
    if (!user) {
      // Update task for anonymous user
      const existingTask = tasks.find(t => t.id === taskId);
      if (existingTask) {
        const updatedTask = {
          ...existingTask,
          ...updates,
          updatedAt: new Date()
        };

        setTasks(prev => {
          const updated = prev.map(task =>
            task.id === taskId ? updatedTask : task
          );
          localStorage.setItem('anonymous_tasks', JSON.stringify(updated));
          return updated;
        });

        return updatedTask;
      }
      return null;
    }

    try {
      let updatedTask: EnhancedTask | null = null;

      if (useLocalFallback) {
        // Update locally
        const existingTask = tasks.find(t => t.id === taskId);
        if (existingTask) {
          updatedTask = {
            ...existingTask,
            ...updates,
            updatedAt: new Date()
          };
        }
      } else {
        // Try to update via Supabase
        updatedTask = await TasksService.updateTask(user, taskId, updates);
      }

      if (updatedTask) {
        setTasks(prev => {
          const updated = prev.map(task =>
            task.id === taskId ? updatedTask! : task
          );

          // Save to localStorage as backup
          localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updated));

          return updated;
        });
      }
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      return null;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) {
      // Delete task for anonymous user
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== taskId);
        localStorage.setItem('anonymous_tasks', JSON.stringify(updated));
        return updated;
      });
      return true;
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Delete locally
        success = true;
      } else {
        // Try to delete via Supabase
        success = await TasksService.deleteTask(user, taskId);
      }

      if (success) {
        setTasks(prev => {
          const updated = prev.filter(task => task.id !== taskId);

          // Save to localStorage as backup
          localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updated));

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      return false;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: loadTasks,
    isUsingLocalFallback: useLocalFallback
  };
};

// =============================================
// HABITS HOOK
// =============================================

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitEntries, setHabitEntries] = useState<Record<string, HabitEntry[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = async () => {
    if (!user) {
      setHabits([]);
      setHabitEntries({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const habitsData = await HabitsService.getHabits(user);
      setHabits(habitsData);

      // Load entries for each habit
      const entriesData: Record<string, HabitEntry[]> = {};
      for (const habit of habitsData) {
        const entries = await HabitsService.getHabitEntries(user, habit.id);
        entriesData[habit.id] = entries;
      }
      setHabitEntries(entriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habit: Partial<Habit>) => {
    if (!user) return null;

    try {
      const newHabit = await HabitsService.createHabit(user, habit);
      if (newHabit) {
        setHabits(prev => [newHabit, ...prev]);
        setHabitEntries(prev => ({ ...prev, [newHabit.id]: [] }));
      }
      return newHabit;
    } catch (err) {
      setError('Failed to create habit');
      console.error('Error creating habit:', err);
      return null;
    }
  };

  const toggleHabitEntry = async (habitId: string, date: Date) => {
    if (!user) return false;

    try {
      const success = await HabitsService.toggleHabitEntry(user, habitId, date);
      if (success) {
        // Reload entries for this habit
        const entries = await HabitsService.getHabitEntries(user, habitId);
        setHabitEntries(prev => ({ ...prev, [habitId]: entries }));
      }
      return success;
    } catch (err) {
      setError('Failed to toggle habit entry');
      console.error('Error toggling habit entry:', err);
      return false;
    }
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  return {
    habits,
    habitEntries,
    loading,
    error,
    createHabit,
    toggleHabitEntry,
    refetch: loadHabits
  };
};

// =============================================
// NOTES HOOK
// =============================================

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await NotesService.getNotes(user);
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (note: Partial<Note>) => {
    if (!user) return null;

    try {
      const newNote = await NotesService.createNote(user, note);
      if (newNote) {
        setNotes(prev => [newNote, ...prev]);
      }
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
      return null;
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    if (!user) return null;

    try {
      const updatedNote = await NotesService.updateNote(user, noteId, updates);
      if (updatedNote) {
        setNotes(prev => prev.map(note => 
          note.id === noteId ? updatedNote : note
        ));
      }
      return updatedNote;
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      return null;
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return false;

    try {
      const success = await NotesService.deleteNote(user, noteId);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
      return success;
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
      return false;
    }
  };

  const togglePin = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return false;

    return await updateNote(noteId, { isPinned: !note.isPinned });
  };

  const toggleArchive = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return false;

    return await updateNote(noteId, { isArchived: !note.isArchived });
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    refetch: loadNotes
  };
};

// =============================================
// FINANCIAL GOALS HOOK
// =============================================

export const useFinancialGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await FinancialGoalsService.getGoals(user);
      setGoals(data);
      setError(null);
    } catch (err) {
      setError('Failed to load financial goals');
      console.error('Error loading financial goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Partial<FinancialGoal>) => {
    if (!user) return null;

    try {
      const newGoal = await FinancialGoalsService.createGoal(user, goal);
      if (newGoal) {
        setGoals(prev => [newGoal, ...prev]);
      }
      return newGoal;
    } catch (err) {
      setError('Failed to create financial goal');
      console.error('Error creating financial goal:', err);
      return null;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<FinancialGoal>) => {
    if (!user) return null;

    try {
      const updatedGoal = await FinancialGoalsService.updateGoal(user, goalId, updates);
      if (updatedGoal) {
        setGoals(prev => prev.map(goal => 
          goal.id === goalId ? updatedGoal : goal
        ));
      }
      return updatedGoal;
    } catch (err) {
      setError('Failed to update financial goal');
      console.error('Error updating financial goal:', err);
      return null;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return false;

    try {
      const success = await FinancialGoalsService.deleteGoal(user, goalId);
      if (success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
      }
      return success;
    } catch (err) {
      setError('Failed to delete financial goal');
      console.error('Error deleting financial goal:', err);
      return false;
    }
  };

  useEffect(() => {
    loadGoals();
  }, [user]);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: loadGoals
  };
};

// =============================================
// COMBINED DASHBOARD DATA HOOK
// =============================================

export const useDashboardData = () => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { habits, habitEntries, loading: habitsLoading } = useHabits();
  const { notes, loading: notesLoading } = useNotes();
  const { goals, loading: goalsLoading } = useFinancialGoals();

  // Get expenses data directly using useSupabaseData
  const {
    data: expenses = [],
    loading: expensesLoading
  } = useSupabaseData<{
    id: string;
    category: string;
    amount: number;
    date: string;
    user_id: string;
    created_at: string;
  }>({
    table: 'expenses',
    initialData: [],
    orderBy: { column: 'date', ascending: false }
  });

  const loading = tasksLoading || habitsLoading || notesLoading || goalsLoading || expensesLoading;

  // Calculate monthly spending (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  const monthlySpending = Math.round(monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0) * 100) / 100;
  const monthlyBudget = 5000; // This could be made dynamic later

  // Calculate dashboard statistics
  const stats = {
    tasks: {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      overdue: tasks.filter(t => 
        !t.completed && t.dueDate && t.dueDate < new Date()
      ).length,
      dueSoon: tasks.filter(t => 
        !t.completed && t.dueDate && 
        t.dueDate > new Date() && 
        t.dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      ).length
    },
    habits: {
      total: habits.length,
      completedToday: habits.filter(habit => {
        const today = new Date().toISOString().split('T')[0];
        const entries = habitEntries[habit.id] || [];
        return entries.some(entry => 
          entry.entryDate.toISOString().split('T')[0] === today && entry.completed
        );
      }).length
    },
    notes: {
      total: notes.filter(n => !n.isArchived).length,
      pinned: notes.filter(n => n.isPinned && !n.isArchived).length,
      archived: notes.filter(n => n.isArchived).length
    },
    goals: {
      total: goals.length,
      avgProgress: goals.length > 0
        ? Math.round(goals.reduce((sum, goal) => {
            // Ensure we don't divide by zero and handle invalid values
            if (goal.target > 0 && typeof goal.current === 'number' && typeof goal.target === 'number') {
              return sum + (goal.current / goal.target * 100);
            }
            return sum;
          }, 0) / goals.length)
        : 0
    },
    monthlySpending,
    monthlyBudget
  };

  return {
    tasks,
    habits,
    habitEntries,
    notes,
    goals,
    stats,
    loading
  };
};

// =============================================
// PROJECTS HOOK
// =============================================

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const loadProjects = async () => {
    if (!user) {
      // Load from localStorage for anonymous users
      console.log('No user signed in, loading from localStorage');
      const localProjects = localStorage.getItem('anonymous_projects');
      const localTasks = localStorage.getItem('anonymous_project_tasks');

      if (localProjects) {
        try {
          const parsed = JSON.parse(localProjects);
          setProjects(parsed.map((project: any) => ({
            ...project,
            startDate: project.startDate ? new Date(project.startDate) : undefined,
            endDate: project.endDate ? new Date(project.endDate) : undefined,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt)
          })));
        } catch (parseErr) {
          console.error('Error parsing anonymous projects:', parseErr);
          setProjects([]);
        }
      } else {
        setProjects([]);
      }

      if (localTasks) {
        try {
          const parsed = JSON.parse(localTasks);
          setProjectTasks(parsed.map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          })));
        } catch (parseErr) {
          console.error('Error parsing anonymous project tasks:', parseErr);
          setProjectTasks([]);
        }
      } else {
        setProjectTasks([]);
      }

      setUseLocalFallback(true);
      setError('Demo mode - projects will not persist after refresh');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load projects
      const projectsData = await ProjectsService.getProjects(user);
      console.log('Loaded projects from Supabase:', projectsData);
      setProjects(projectsData);

      // Load all project tasks
      const allTasks: ProjectTask[] = [];
      for (const project of projectsData) {
        const tasks = await ProjectsService.getProjectTasks(user, project.id);
        allTasks.push(...tasks);
      }
      console.log('Loaded project tasks from Supabase:', allTasks);
      setProjectTasks(allTasks);

      setUseLocalFallback(false);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects from server');
      setUseLocalFallback(true);

      // Fall back to localStorage
      const localProjects = localStorage.getItem(`projects_${user.id}`);
      const localTasks = localStorage.getItem(`project_tasks_${user.id}`);

      if (localProjects) {
        try {
          const parsed = JSON.parse(localProjects);
          setProjects(parsed);
        } catch (parseErr) {
          setProjects([]);
        }
      }

      if (localTasks) {
        try {
          const parsed = JSON.parse(localTasks);
          setProjectTasks(parsed);
        } catch (parseErr) {
          setProjectTasks([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Partial<Project>): Promise<Project | null> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
      setError('Demo mode - projects will not persist after refresh');
    }

    try {
      let newProject: Project;

      if (useLocalFallback) {
        // Create project locally
        newProject = {
          id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: project.name || '',
          description: project.description,
          status: project.status || 'planning',
          progress: project.progress || 0,
          startDate: project.startDate,
          endDate: project.endDate,
          team: project.team || [],
          color: project.color || '#3B82F6',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('Created local project:', newProject);
      } else {
        // Try to create via Supabase
        const supabaseProject = await ProjectsService.createProject(user, project);
        if (!supabaseProject) {
          throw new Error('Failed to create project via Supabase');
        }
        newProject = supabaseProject;
        console.log('Project created via Supabase:', newProject);
      }

      setProjects(prev => {
        const updated = [newProject, ...prev];

        // Save to localStorage as backup
        if (user) {
          localStorage.setItem(`projects_${user.id}`, JSON.stringify(updated));
        } else {
          localStorage.setItem('anonymous_projects', JSON.stringify(updated));
        }

        return updated;
      });

      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);

      // Fallback to local creation
      if (!useLocalFallback) {
        console.log('Falling back to local project creation');
        setUseLocalFallback(true);
        setError('Using local storage (Supabase unavailable)');
        return await createProject(project); // Retry with local fallback
      }

      setError('Failed to create project');
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<boolean> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
      setError('Demo mode - changes will not persist after refresh');
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Update locally
        success = true;
      } else {
        // Try to update via Supabase
        const updatedProject = await ProjectsService.updateProject(user, projectId, updates);
        success = !!updatedProject;
      }

      if (success) {
        setProjects(prev => {
          const updated = prev.map(project =>
            project.id === projectId
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          );

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`projects_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_projects', JSON.stringify(updated));
          }

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
      return false;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Delete locally
        success = true;
      } else {
        // Try to delete via Supabase
        success = await ProjectsService.deleteProject(user, projectId);
      }

      if (success) {
        setProjects(prev => {
          const updated = prev.filter(project => project.id !== projectId);

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`projects_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_projects', JSON.stringify(updated));
          }

          return updated;
        });

        // Also remove associated tasks
        setProjectTasks(prev => {
          const updated = prev.filter(task => task.projectId !== projectId);

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`project_tasks_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_project_tasks', JSON.stringify(updated));
          }

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
      return false;
    }
  };

  const createProjectTask = async (task: Partial<ProjectTask>): Promise<ProjectTask | null> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
      setError('Demo mode - tasks will not persist after refresh');
    }

    try {
      let newTask: ProjectTask;

      if (useLocalFallback) {
        // Create task locally
        newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          projectId: task.projectId || '',
          title: task.title || '',
          description: task.description,
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          assignee: task.assignee,
          dueDate: task.dueDate,
          tags: task.tags || [],
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('Created local project task:', newTask);
      } else {
        // Try to create via Supabase
        const supabaseTask = await ProjectsService.createProjectTask(user, task);
        if (!supabaseTask) {
          throw new Error('Failed to create project task via Supabase');
        }
        newTask = supabaseTask;
        console.log('Project task created via Supabase:', newTask);
      }

      setProjectTasks(prev => {
        const updated = [newTask, ...prev];

        // Save to localStorage as backup
        if (user) {
          localStorage.setItem(`project_tasks_${user.id}`, JSON.stringify(updated));
        } else {
          localStorage.setItem('anonymous_project_tasks', JSON.stringify(updated));
        }

        return updated;
      });

      return newTask;
    } catch (err) {
      console.error('Error creating project task:', err);

      // Fallback to local creation
      if (!useLocalFallback) {
        console.log('Falling back to local project task creation');
        setUseLocalFallback(true);
        setError('Using local storage (Supabase unavailable)');
        return await createProjectTask(task); // Retry with local fallback
      }

      setError('Failed to create project task');
      return null;
    }
  };

  const updateProjectTask = async (taskId: string, updates: Partial<ProjectTask>): Promise<boolean> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
      setError('Demo mode - changes will not persist after refresh');
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Update locally
        success = true;
      } else {
        // Try to update via Supabase
        const updatedTask = await ProjectsService.updateProjectTask(user, taskId, updates);
        success = !!updatedTask;
      }

      if (success) {
        setProjectTasks(prev => {
          const updated = prev.map(task =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          );

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`project_tasks_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_project_tasks', JSON.stringify(updated));
          }

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to update project task');
      console.error('Error updating project task:', err);
      return false;
    }
  };

  const deleteProjectTask = async (taskId: string): Promise<boolean> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Delete locally
        success = true;
      } else {
        // Try to delete via Supabase
        success = await ProjectsService.deleteProjectTask(user, taskId);
      }

      if (success) {
        setProjectTasks(prev => {
          const updated = prev.filter(task => task.id !== taskId);

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`project_tasks_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_project_tasks', JSON.stringify(updated));
          }

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to delete project task');
      console.error('Error deleting project task:', err);
      return false;
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  return {
    projects,
    projectTasks,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    createProjectTask,
    updateProjectTask,
    deleteProjectTask,
    refetch: loadProjects,
    isUsingLocalFallback: useLocalFallback
  };
};

// =============================================
// CALENDAR HOOK
// =============================================

export const useCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const loadEvents = async () => {
    if (!user) {
      // Load from localStorage for anonymous users
      console.log('No user signed in, loading from localStorage');
      const localEvents = localStorage.getItem('anonymous_calendar_events');

      if (localEvents) {
        try {
          const parsed = JSON.parse(localEvents);
          setEvents(parsed.map((event: any) => ({
            ...event,
            date: new Date(event.date),
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt)
          })));
        } catch (parseErr) {
          console.error('Error parsing anonymous calendar events:', parseErr);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }

      setUseLocalFallback(true);
      setError('Demo mode - events will not persist after refresh');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const eventsData = await CalendarService.getEvents(user);
      console.log('Loaded calendar events from Supabase:', eventsData);
      setEvents(eventsData);

      setUseLocalFallback(false);
    } catch (err) {
      console.error('Error loading calendar events:', err);
      setError('Failed to load events from server');
      setUseLocalFallback(true);

      // Fall back to localStorage
      const localEvents = localStorage.getItem(`calendar_events_${user.id}`);

      if (localEvents) {
        try {
          const parsed = JSON.parse(localEvents);
          setEvents(parsed);
        } catch (parseErr) {
          setEvents([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
      setError('Demo mode - events will not persist after refresh');
    }

    try {
      let newEvent: CalendarEvent;

      if (useLocalFallback) {
        // Create event locally
        newEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: event.title || '',
          description: event.description,
          date: event.date || new Date(),
          startTime: event.startTime,
          endTime: event.endTime,
          type: event.type || 'event',
          priority: event.priority || 'medium',
          location: event.location,
          attendees: event.attendees || [],
          completed: event.completed || false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('Created local calendar event:', newEvent);
      } else {
        // Try to create via Supabase
        const supabaseEvent = await CalendarService.createEvent(user, event);
        if (!supabaseEvent) {
          throw new Error('Failed to create calendar event via Supabase');
        }
        newEvent = supabaseEvent;
        console.log('Calendar event created via Supabase:', newEvent);
      }

      setEvents(prev => {
        const updated = [newEvent, ...prev].sort((a, b) => a.date.getTime() - b.date.getTime());

        // Save to localStorage as backup
        if (user) {
          localStorage.setItem(`calendar_events_${user.id}`, JSON.stringify(updated));
        } else {
          localStorage.setItem('anonymous_calendar_events', JSON.stringify(updated));
        }

        return updated;
      });

      return newEvent;
    } catch (err) {
      console.error('Error creating calendar event:', err);

      // Fallback to local creation
      if (!useLocalFallback) {
        console.log('Falling back to local calendar event creation');
        setUseLocalFallback(true);
        setError('Using local storage (Supabase unavailable)');
        return await createEvent(event); // Retry with local fallback
      }

      setError('Failed to create calendar event');
      return null;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>): Promise<boolean> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
      setError('Demo mode - changes will not persist after refresh');
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Update locally
        success = true;
      } else {
        // Try to update via Supabase
        const updatedEvent = await CalendarService.updateEvent(user, eventId, updates);
        success = !!updatedEvent;
      }

      if (success) {
        setEvents(prev => {
          const updated = prev.map(event =>
            event.id === eventId
              ? { ...event, ...updates, updatedAt: new Date() }
              : event
          ).sort((a, b) => a.date.getTime() - b.date.getTime());

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`calendar_events_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_calendar_events', JSON.stringify(updated));
          }

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to update calendar event');
      console.error('Error updating calendar event:', err);
      return false;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!user && !useLocalFallback) {
      setUseLocalFallback(true);
    }

    try {
      let success = false;

      if (useLocalFallback) {
        // Delete locally
        success = true;
      } else {
        // Try to delete via Supabase
        success = await CalendarService.deleteEvent(user, eventId);
      }

      if (success) {
        setEvents(prev => {
          const updated = prev.filter(event => event.id !== eventId);

          // Save to localStorage as backup
          if (user) {
            localStorage.setItem(`calendar_events_${user.id}`, JSON.stringify(updated));
          } else {
            localStorage.setItem('anonymous_calendar_events', JSON.stringify(updated));
          }

          return updated;
        });
      }
      return success;
    } catch (err) {
      setError('Failed to delete calendar event');
      console.error('Error deleting calendar event:', err);
      return false;
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: loadEvents,
    isUsingLocalFallback: useLocalFallback
  };
};
