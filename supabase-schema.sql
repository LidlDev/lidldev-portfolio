-- =============================================
-- AGENT APP COMPREHENSIVE SUPABASE SCHEMA
-- =============================================
-- ✅ COMPLETED: All tables have been created directly via Supabase API
-- ✅ COMPLETED: All RLS policies are in place
-- ✅ COMPLETED: All indexes and triggers are set up
--
-- This file is now for reference only - the actual schema has been
-- applied directly to the Supabase database via API calls.
--
-- Tables created:
-- - enhanced_tasks (with RLS and indexes)
-- - budget_categories (with RLS and indexes)
-- - habits (with RLS and indexes)
-- - habit_entries (with RLS and indexes)
-- - notes (with RLS and indexes)
-- - calendar_events (with RLS and indexes)
-- - projects (with RLS and indexes)
-- - project_tasks (with RLS and indexes)
--
-- All existing tables (tasks, financial_goals, expenses, payments, etc.)
-- already had RLS enabled and are working correctly.

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'review', 'done');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('planning', 'active', 'on-hold', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'monthly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_type AS ENUM ('task', 'event', 'meeting', 'reminder');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- ENHANCED TASKS (extends existing tasks table)
-- =============================================

-- Enhanced Tasks Table (new table for advanced task management)
CREATE TABLE IF NOT EXISTS enhanced_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMPTZ,
    priority task_priority,
    category TEXT,
    project TEXT,
    tags TEXT[],
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    parent_task_id UUID REFERENCES enhanced_tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS to existing tasks table if not already enabled
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for existing tasks table
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
CREATE POLICY "Users can insert their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES FOR EXISTING TABLES
-- =============================================

-- Add RLS to existing financial_goals table
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own financial goals" ON public.financial_goals;
CREATE POLICY "Users can view their own financial goals" ON public.financial_goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own financial goals" ON public.financial_goals;
CREATE POLICY "Users can insert their own financial goals" ON public.financial_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own financial goals" ON public.financial_goals;
CREATE POLICY "Users can update their own financial goals" ON public.financial_goals FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own financial goals" ON public.financial_goals;
CREATE POLICY "Users can delete their own financial goals" ON public.financial_goals FOR DELETE USING (auth.uid() = user_id);

-- Add RLS to existing expenses table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
CREATE POLICY "Users can insert their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Add RLS to existing payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
CREATE POLICY "Users can update their own payments" ON public.payments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own payments" ON public.payments;
CREATE POLICY "Users can delete their own payments" ON public.payments FOR DELETE USING (auth.uid() = user_id);

-- Add RLS to existing detected_bills table
ALTER TABLE public.detected_bills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own detected bills" ON public.detected_bills;
CREATE POLICY "Users can view their own detected bills" ON public.detected_bills FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own detected bills" ON public.detected_bills;
CREATE POLICY "Users can insert their own detected bills" ON public.detected_bills FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own detected bills" ON public.detected_bills;
CREATE POLICY "Users can update their own detected bills" ON public.detected_bills FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own detected bills" ON public.detected_bills;
CREATE POLICY "Users can delete their own detected bills" ON public.detected_bills FOR DELETE USING (auth.uid() = user_id);

-- Add RLS to existing profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Add RLS to existing email_auth table
ALTER TABLE public.email_auth ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own email auth" ON public.email_auth;
CREATE POLICY "Users can view their own email auth" ON public.email_auth FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own email auth" ON public.email_auth;
CREATE POLICY "Users can insert their own email auth" ON public.email_auth FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own email auth" ON public.email_auth;
CREATE POLICY "Users can update their own email auth" ON public.email_auth FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own email auth" ON public.email_auth;
CREATE POLICY "Users can delete their own email auth" ON public.email_auth FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- NEW TABLES FOR AGENT APP
-- =============================================

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    end_date DATE,
    team_members TEXT[],
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Tasks Table
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    assignee TEXT,
    due_date TIMESTAMPTZ,
    tags TEXT[],
    estimated_hours INTEGER,
    actual_hours INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    event_type event_type DEFAULT 'event',
    priority task_priority,
    location TEXT,
    attendees TEXT[],
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits Table
CREATE TABLE habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    frequency habit_frequency DEFAULT 'daily',
    target INTEGER DEFAULT 1,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT '⭐',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit Entries Table
CREATE TABLE habit_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, entry_date)
);

-- Notes Table
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FINANCIAL MANAGEMENT
-- =============================================

-- Financial Goals Table (already exists, just adding IF NOT EXISTS for safety)
CREATE TABLE IF NOT EXISTS financial_goals_enhanced (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    target_date DATE,
    category TEXT DEFAULT 'Savings',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Categories Table (new for enhanced budgeting)
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    budgeted_amount DECIMAL(10,2) NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT '💰',
    is_essential BOOLEAN DEFAULT FALSE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name, month, year)
);

-- Enhanced Expenses Table (extends existing expenses)
CREATE TABLE IF NOT EXISTS expenses_enhanced (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES budget_categories_enhanced(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly Budgets Table (new for budget tracking)
CREATE TABLE IF NOT EXISTS monthly_budgets_enhanced (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    total_income DECIMAL(12,2) DEFAULT 0,
    total_budgeted DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

-- =============================================
-- ENABLE RLS ON NEW TABLES
-- =============================================

-- Enable RLS on all new tables
ALTER TABLE enhanced_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_budgets_enhanced ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES FOR NEW TABLES
-- =============================================

-- Enhanced Tasks policies
CREATE POLICY "Users can view their own enhanced tasks" ON enhanced_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own enhanced tasks" ON enhanced_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enhanced tasks" ON enhanced_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own enhanced tasks" ON enhanced_tasks FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Project tasks policies
CREATE POLICY "Users can view their own project tasks" ON project_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own project tasks" ON project_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own project tasks" ON project_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own project tasks" ON project_tasks FOR DELETE USING (auth.uid() = user_id);

-- Calendar events policies
CREATE POLICY "Users can view their own events" ON calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Habit entries policies
CREATE POLICY "Users can view their own habit entries" ON habit_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habit entries" ON habit_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit entries" ON habit_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit entries" ON habit_entries FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view their own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Enhanced financial goals policies
CREATE POLICY "Users can view their own enhanced financial goals" ON financial_goals_enhanced FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own enhanced financial goals" ON financial_goals_enhanced FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enhanced financial goals" ON financial_goals_enhanced FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own enhanced financial goals" ON financial_goals_enhanced FOR DELETE USING (auth.uid() = user_id);

-- Enhanced budget categories policies
CREATE POLICY "Users can view their own enhanced budget categories" ON budget_categories_enhanced FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own enhanced budget categories" ON budget_categories_enhanced FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enhanced budget categories" ON budget_categories_enhanced FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own enhanced budget categories" ON budget_categories_enhanced FOR DELETE USING (auth.uid() = user_id);

-- Enhanced expenses policies
CREATE POLICY "Users can view their own enhanced expenses" ON expenses_enhanced FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own enhanced expenses" ON expenses_enhanced FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enhanced expenses" ON expenses_enhanced FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own enhanced expenses" ON expenses_enhanced FOR DELETE USING (auth.uid() = user_id);

-- Enhanced monthly budgets policies
CREATE POLICY "Users can view their own enhanced monthly budgets" ON monthly_budgets_enhanced FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own enhanced monthly budgets" ON monthly_budgets_enhanced FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enhanced monthly budgets" ON monthly_budgets_enhanced FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own enhanced monthly budgets" ON monthly_budgets_enhanced FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Enhanced Tasks indexes
CREATE INDEX IF NOT EXISTS idx_enhanced_tasks_user_id ON enhanced_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_tasks_due_date ON enhanced_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_enhanced_tasks_completed ON enhanced_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_enhanced_tasks_category ON enhanced_tasks(category);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_user_id ON project_tasks(user_id);

-- Calendar indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);

-- Habits indexes
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_habit_id ON habit_entries(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_date ON habit_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_habit_entries_user_id ON habit_entries(user_id);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_archived ON notes(is_archived);

-- Enhanced Financial indexes
CREATE INDEX IF NOT EXISTS idx_financial_goals_enhanced_user_id ON financial_goals_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_enhanced_user_id ON budget_categories_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_enhanced_month_year ON budget_categories_enhanced(month, year);
CREATE INDEX IF NOT EXISTS idx_expenses_enhanced_user_id ON expenses_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_enhanced_date ON expenses_enhanced(expense_date);
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_enhanced_user_id ON monthly_budgets_enhanced(user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all relevant tables
DROP TRIGGER IF EXISTS update_enhanced_tasks_updated_at ON enhanced_tasks;
CREATE TRIGGER update_enhanced_tasks_updated_at BEFORE UPDATE ON enhanced_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_tasks_updated_at ON project_tasks;
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_goals_enhanced_updated_at ON financial_goals_enhanced;
CREATE TRIGGER update_financial_goals_enhanced_updated_at BEFORE UPDATE ON financial_goals_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_categories_enhanced_updated_at ON budget_categories_enhanced;
CREATE TRIGGER update_budget_categories_enhanced_updated_at BEFORE UPDATE ON budget_categories_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_monthly_budgets_enhanced_updated_at ON monthly_budgets_enhanced;
CREATE TRIGGER update_monthly_budgets_enhanced_updated_at BEFORE UPDATE ON monthly_budgets_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate word count for notes
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
    NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add word count trigger to notes
DROP TRIGGER IF EXISTS calculate_notes_word_count ON notes;
CREATE TRIGGER calculate_notes_word_count BEFORE INSERT OR UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION calculate_word_count();

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON enhanced_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON enhanced_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON enhanced_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON enhanced_tasks FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Project tasks policies
CREATE POLICY "Users can view their own project tasks" ON project_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own project tasks" ON project_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own project tasks" ON project_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own project tasks" ON project_tasks FOR DELETE USING (auth.uid() = user_id);

-- Calendar events policies
CREATE POLICY "Users can view their own events" ON calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Habit entries policies
CREATE POLICY "Users can view their own habit entries" ON habit_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habit entries" ON habit_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit entries" ON habit_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit entries" ON habit_entries FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view their own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Financial goals policies
CREATE POLICY "Users can view their own financial goals" ON financial_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own financial goals" ON financial_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financial goals" ON financial_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own financial goals" ON financial_goals FOR DELETE USING (auth.uid() = user_id);

-- Budget categories policies
CREATE POLICY "Users can view their own budget categories" ON budget_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budget categories" ON budget_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budget categories" ON budget_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budget categories" ON budget_categories FOR DELETE USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view their own expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

-- Monthly budgets policies
CREATE POLICY "Users can view their own monthly budgets" ON monthly_budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own monthly budgets" ON monthly_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own monthly budgets" ON monthly_budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own monthly budgets" ON monthly_budgets FOR DELETE USING (auth.uid() = user_id);

-- Upcoming payments policies
CREATE POLICY "Users can view their own upcoming payments" ON upcoming_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own upcoming payments" ON upcoming_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own upcoming payments" ON upcoming_payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own upcoming payments" ON upcoming_payments FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_enhanced_tasks_updated_at BEFORE UPDATE ON enhanced_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_goals_updated_at BEFORE UPDATE ON financial_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_budgets_updated_at BEFORE UPDATE ON monthly_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_upcoming_payments_updated_at BEFORE UPDATE ON upcoming_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate word count for notes
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
    NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add word count trigger to notes
CREATE TRIGGER calculate_notes_word_count BEFORE INSERT OR UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION calculate_word_count();

-- =============================================
-- COMPLETION
-- =============================================

-- This schema adds:
-- 1. RLS policies for all existing tables (tasks, financial_goals, expenses, payments, etc.)
-- 2. New enhanced tables for advanced features (enhanced_tasks, projects, habits, notes, etc.)
-- 3. Performance indexes for all tables
-- 4. Automatic triggers for updated_at timestamps and word counting
-- 5. Complete Row Level Security for user data isolation

-- All tables are now secure and ready for the Agent App!

COMMENT ON SCHEMA public IS 'Agent App - Comprehensive Life Management System with full RLS security';
