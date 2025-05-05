// Task data types and mock data
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export const initialTasks: Task[] = [
  { id: '1', title: 'Complete project proposal', completed: false, dueDate: new Date(2025, 4, 10) },
  { id: '2', title: 'Review quarterly budget', completed: false, dueDate: new Date(2025, 4, 15) },
  { id: '3', title: 'Schedule team meeting', completed: true, dueDate: new Date(2025, 4, 3) },
  { id: '4', title: 'Research new productivity tools', completed: false },
  { id: '5', title: 'Update personal website', completed: false },
];

// Financial data types and mock data
export interface FinancialGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  targetDate?: Date;
  color: string;
}

export const initialGoals: FinancialGoal[] = [
  { 
    id: '1', 
    title: 'Emergency Fund', 
    target: 10000, 
    current: 6500, 
    targetDate: new Date(2025, 8, 1),
    color: '#174E4F'
  },
  { 
    id: '2', 
    title: 'Vacation Savings', 
    target: 3000, 
    current: 1200, 
    targetDate: new Date(2025, 6, 1),
    color: '#2A7576'
  },
  { 
    id: '3', 
    title: 'New Laptop', 
    target: 2000, 
    current: 800, 
    targetDate: new Date(2025, 5, 15),
    color: '#3D9B9C' 
  },
];

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: Date;
}

export const expenseCategories = [
  { name: 'Housing', color: '#174E4F' },
  { name: 'Food', color: '#2A7576' },
  { name: 'Transportation', color: '#3D9B9C' },
  { name: 'Entertainment', color: '#50C2C3' },
  { name: 'Utilities', color: '#79D2D3' },
  { name: 'Other', color: '#A3E3E3' },
];

export const initialExpenses: Expense[] = [
  { id: '1', category: 'Housing', amount: 1200, date: new Date(2025, 4, 1) },
  { id: '2', category: 'Food', amount: 350, date: new Date(2025, 4, 5) },
  { id: '3', category: 'Transportation', amount: 120, date: new Date(2025, 4, 10) },
  { id: '4', category: 'Entertainment', amount: 80, date: new Date(2025, 4, 15) },
  { id: '5', category: 'Utilities', amount: 180, date: new Date(2025, 4, 18) },
  { id: '6', category: 'Other', amount: 90, date: new Date(2025, 4, 22) },
];

export interface Payment {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  recurring: boolean;
  category: string;
  paid: boolean;
}

export const initialPayments: Payment[] = [
  { 
    id: '1', 
    title: 'Rent', 
    amount: 1200, 
    dueDate: new Date(2025, 5, 1), 
    recurring: true, 
    category: 'Housing',
    paid: false
  },
  { 
    id: '2', 
    title: 'Internet Bill', 
    amount: 65, 
    dueDate: new Date(2025, 4, 15), 
    recurring: true, 
    category: 'Utilities',
    paid: false
  },
  { 
    id: '3', 
    title: 'Phone Bill', 
    amount: 85, 
    dueDate: new Date(2025, 4, 20), 
    recurring: true, 
    category: 'Utilities',
    paid: false
  },
  { 
    id: '4', 
    title: 'Gym Membership', 
    amount: 50, 
    dueDate: new Date(2025, 5, 5), 
    recurring: true, 
    category: 'Other',
    paid: true
  },
];

// Helper functions
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getProgressColor(percentage: number): string {
  if (percentage < 25) return '#F87171';
  if (percentage < 50) return '#FBBF24';
  if (percentage < 75) return '#34D399';
  return '#10B981';
}
