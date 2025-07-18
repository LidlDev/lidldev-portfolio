import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface EnhancedTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  project?: string;
  tags?: string[];
  estimatedTime?: number;
  actualTime?: number;
  parentTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  progress: number;
  startDate: Date;
  endDate?: Date;
  teamMembers: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: Date;
  startTime?: string;
  endTime?: string;
  eventType: 'task' | 'event' | 'meeting' | 'reminder';
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  attendees?: string[];
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  entryDate: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetedAmount: number;
  color: string;
  icon: string;
  isEssential: boolean;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  categoryId?: string;
  amount: number;
  description?: string;
  expenseDate: Date;
  createdAt: Date;
}

// =============================================
// TASKS SERVICE
// =============================================

export class TasksService {
  static async getTasks(user: User): Promise<EnhancedTask[]> {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('enhanced_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data.map(this.mapDatabaseTaskToTask);
  }

  static async createTask(user: User, task: Partial<EnhancedTask>): Promise<EnhancedTask | null> {
    if (!user) {
      console.log('TasksService: No user provided');
      return null;
    }

    console.log('TasksService: Creating task for user:', user.id, 'Task:', task);

    const taskData = {
      user_id: user.id,
      title: task.title,
      description: task.description,
      completed: task.completed || false,
      due_date: task.dueDate?.toISOString(),
      priority: task.priority,
      category: task.category,
      project: task.project,
      tags: task.tags,
      estimated_time: task.estimatedTime,
      actual_time: task.actualTime,
      parent_task_id: task.parentTaskId
    };

    console.log('TasksService: Inserting data:', taskData);

    const { data, error } = await supabase
      .from('enhanced_tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      console.error('TasksService: Error creating task:', error);
      return null;
    }

    console.log('TasksService: Task created successfully:', data);
    return this.mapDatabaseTaskToTask(data);
  }

  static async updateTask(user: User, taskId: string, updates: Partial<EnhancedTask>): Promise<EnhancedTask | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from('enhanced_tasks')
      .update({
        title: updates.title,
        description: updates.description,
        completed: updates.completed,
        due_date: updates.dueDate?.toISOString(),
        priority: updates.priority,
        category: updates.category,
        project: updates.project,
        tags: updates.tags,
        estimated_time: updates.estimatedTime,
        actual_time: updates.actualTime
      })
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }

    return this.mapDatabaseTaskToTask(data);
  }

  static async deleteTask(user: User, taskId: string): Promise<boolean> {
    if (!user) return false;

    const { error } = await supabase
      .from('enhanced_tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  }

  private static mapDatabaseTaskToTask(dbTask: any): EnhancedTask {
    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description,
      completed: dbTask.completed,
      dueDate: dbTask.due_date ? new Date(dbTask.due_date) : undefined,
      priority: dbTask.priority,
      category: dbTask.category,
      project: dbTask.project,
      tags: dbTask.tags || [],
      estimatedTime: dbTask.estimated_time,
      actualTime: dbTask.actual_time,
      parentTaskId: dbTask.parent_task_id,
      createdAt: new Date(dbTask.created_at),
      updatedAt: new Date(dbTask.updated_at)
    };
  }
}

// =============================================
// HABITS SERVICE
// =============================================

export class HabitsService {
  static async getHabits(user: User): Promise<Habit[]> {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching habits:', error);
      return [];
    }

    return data.map(this.mapDatabaseHabitToHabit);
  }

  static async getHabitEntries(user: User, habitId: string): Promise<HabitEntry[]> {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('habit_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('habit_id', habitId)
      .order('entry_date', { ascending: false });

    if (error) {
      console.error('Error fetching habit entries:', error);
      return [];
    }

    return data.map(this.mapDatabaseEntryToEntry);
  }

  static async createHabit(user: User, habit: Partial<Habit>): Promise<Habit | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency || 'daily',
        target: habit.target || 1,
        color: habit.color || '#3B82F6',
        icon: habit.icon || '⭐'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit:', error);
      return null;
    }

    return this.mapDatabaseHabitToHabit(data);
  }

  static async toggleHabitEntry(user: User, habitId: string, date: Date): Promise<boolean> {
    if (!user) return false;

    const dateStr = date.toISOString().split('T')[0];
    
    // Check if entry exists
    const { data: existingEntry } = await supabase
      .from('habit_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('habit_id', habitId)
      .eq('entry_date', dateStr)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { error } = await supabase
        .from('habit_entries')
        .update({ completed: !existingEntry.completed })
        .eq('id', existingEntry.id);

      if (error) {
        console.error('Error updating habit entry:', error);
        return false;
      }
    } else {
      // Create new entry
      const { error } = await supabase
        .from('habit_entries')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          entry_date: dateStr,
          completed: true
        });

      if (error) {
        console.error('Error creating habit entry:', error);
        return false;
      }
    }

    return true;
  }

  private static mapDatabaseHabitToHabit(dbHabit: any): Habit {
    return {
      id: dbHabit.id,
      name: dbHabit.name,
      description: dbHabit.description,
      category: dbHabit.category,
      frequency: dbHabit.frequency,
      target: dbHabit.target,
      color: dbHabit.color,
      icon: dbHabit.icon,
      createdAt: new Date(dbHabit.created_at),
      updatedAt: new Date(dbHabit.updated_at)
    };
  }

  private static mapDatabaseEntryToEntry(dbEntry: any): HabitEntry {
    return {
      id: dbEntry.id,
      habitId: dbEntry.habit_id,
      entryDate: new Date(dbEntry.entry_date),
      completed: dbEntry.completed,
      notes: dbEntry.notes,
      createdAt: new Date(dbEntry.created_at)
    };
  }
}

// =============================================
// NOTES SERVICE
// =============================================

export class NotesService {
  static async getNotes(user: User): Promise<Note[]> {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return data.map(this.mapDatabaseNoteToNote);
  }

  static async createNote(user: User, note: Partial<Note>): Promise<Note | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: note.title,
        content: note.content,
        category: note.category || 'General',
        tags: note.tags || [],
        is_pinned: note.isPinned || false,
        is_archived: note.isArchived || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return null;
    }

    return this.mapDatabaseNoteToNote(data);
  }

  static async updateNote(user: User, noteId: string, updates: Partial<Note>): Promise<Note | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from('notes')
      .update({
        title: updates.title,
        content: updates.content,
        category: updates.category,
        tags: updates.tags,
        is_pinned: updates.isPinned,
        is_archived: updates.isArchived
      })
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return null;
    }

    return this.mapDatabaseNoteToNote(data);
  }

  static async deleteNote(user: User, noteId: string): Promise<boolean> {
    if (!user) return false;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting note:', error);
      return false;
    }

    return true;
  }

  private static mapDatabaseNoteToNote(dbNote: any): Note {
    return {
      id: dbNote.id,
      title: dbNote.title,
      content: dbNote.content,
      category: dbNote.category,
      tags: dbNote.tags || [],
      isPinned: dbNote.is_pinned,
      isArchived: dbNote.is_archived,
      wordCount: dbNote.word_count,
      createdAt: new Date(dbNote.created_at),
      updatedAt: new Date(dbNote.updated_at)
    };
  }
}

// =============================================
// FINANCIAL GOALS SERVICE
// =============================================

export class FinancialGoalsService {
  static async getGoals(user: User): Promise<FinancialGoal[]> {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching financial goals:', error);
      return [];
    }

    return data.map(this.mapDatabaseGoalToGoal);
  }

  static async createGoal(user: User, goal: Partial<FinancialGoal>): Promise<FinancialGoal | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from('financial_goals')
      .insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount || 0,
        target_date: goal.targetDate?.toISOString().split('T')[0],
        category: goal.category || 'Savings'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial goal:', error);
      return null;
    }

    return this.mapDatabaseGoalToGoal(data);
  }

  static async updateGoal(user: User, goalId: string, updates: Partial<FinancialGoal>): Promise<FinancialGoal | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from('financial_goals')
      .update({
        title: updates.title,
        description: updates.description,
        target_amount: updates.targetAmount,
        current_amount: updates.currentAmount,
        target_date: updates.targetDate?.toISOString().split('T')[0],
        category: updates.category
      })
      .eq('id', goalId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial goal:', error);
      return null;
    }

    return this.mapDatabaseGoalToGoal(data);
  }

  static async deleteGoal(user: User, goalId: string): Promise<boolean> {
    if (!user) return false;

    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting financial goal:', error);
      return false;
    }

    return true;
  }

  private static mapDatabaseGoalToGoal(dbGoal: any): FinancialGoal {
    return {
      id: dbGoal.id,
      title: dbGoal.title,
      description: dbGoal.description,
      targetAmount: parseFloat(dbGoal.target_amount),
      currentAmount: parseFloat(dbGoal.current_amount),
      targetDate: dbGoal.target_date ? new Date(dbGoal.target_date) : undefined,
      category: dbGoal.category,
      createdAt: new Date(dbGoal.created_at),
      updatedAt: new Date(dbGoal.updated_at)
    };
  }
}
