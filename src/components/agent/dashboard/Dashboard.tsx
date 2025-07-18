import React from 'react';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useAgentData';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, initialPayments } from '@/utils/agentData';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

interface DatabasePayment {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  recurring: boolean;
  category: string;
  paid: boolean;
  user_id: string;
  created_at: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { tasks, habits, notes, goals, stats, loading } = useDashboardData();

  // Debug goals data
  console.log('Dashboard goals:', goals);
  console.log('Dashboard stats.goals:', stats.goals);
  const { user } = useAuth();

  // Get real payments data
  const {
    data: paymentsData = [],
    loading: paymentsLoading
  } = useSupabaseData<DatabasePayment>({
    table: 'payments',
    initialData: initialPayments.map(payment => ({
      id: payment.id,
      title: payment.title,
      amount: payment.amount,
      due_date: payment.dueDate.toISOString(),
      recurring: payment.recurring,
      category: payment.category,
      paid: payment.paid,
      user_id: 'anonymous',
      created_at: new Date().toISOString()
    })),
    orderBy: { column: 'due_date', ascending: true }
  });

  // Get recent tasks (last 5 incomplete tasks)
  const recentTasks = tasks
    .filter(task => !task.completed)
    .slice(0, 5)
    .map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      dueDate: task.dueDate ?
        task.dueDate.toDateString() === new Date().toDateString() ? 'Today' :
        task.dueDate < new Date() ? 'Overdue' :
        task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'No due date'
    }));



  // Get upcoming payments (unpaid, due within next 90 days for better visibility)
  const upcomingPayments = paymentsData
    .filter(payment => {
      if (payment.paid) return false;
      const dueDate = new Date(payment.due_date);
      const now = new Date();
      // Set time to start of day for fair comparison
      now.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      const ninetyDaysFromNow = new Date(now);
      ninetyDaysFromNow.setDate(now.getDate() + 90);

      return dueDate >= now && dueDate <= ninetyDaysFromNow;
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3)
    .map(payment => {
      const dueDate = new Date(payment.due_date);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let dueDateText = '';
      if (daysUntilDue === 0) {
        dueDateText = 'Today';
      } else if (daysUntilDue === 1) {
        dueDateText = 'Tomorrow';
      } else if (daysUntilDue <= 7) {
        dueDateText = `${daysUntilDue} days`;
      } else {
        dueDateText = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      return {
        id: payment.id,
        title: payment.title,
        amount: payment.amount,
        dueDate: dueDateText
      };
    });

  console.log('Final upcomingPayments:', upcomingPayments);

  const quickActions = [
    { id: 'add-task', label: 'Add Task', icon: 'CheckCircle', color: 'text-primary', action: () => onNavigate?.('tasks') },
    { id: 'log-expense', label: 'Log Expense', icon: 'DollarSign', color: 'text-green-500', action: () => onNavigate?.('spending') },
    { id: 'set-goal', label: 'Set Goal', icon: 'Target', color: 'text-blue-500', action: () => onNavigate?.('budget') },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar', color: 'text-purple-500', action: () => onNavigate?.('calendar') },
    { id: 'add-note', label: 'Add Note', icon: 'FileText', color: 'text-orange-500', action: () => onNavigate?.('notes') },
    { id: 'track-habit', label: 'Track Habit', icon: 'TrendingUp', color: 'text-cyan-500', action: () => onNavigate?.('habits') },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your productivity overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Tasks Progress */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Tasks</span>
            </div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-foreground">{stats.tasks.completed}</span>
              <span className="text-sm text-muted-foreground">/ {stats.tasks.total}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-foreground">Deadlines</span>
            </div>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-bold text-foreground">{stats.tasks.dueSoon}</span>
            <p className="text-xs text-muted-foreground">Tasks due soon</p>
          </div>
        </div>

        {/* Financial Goals */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-foreground">Goals</span>
            </div>
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-bold text-foreground">{stats.goals.avgProgress}%</span>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.goals.avgProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Spending</span>
            </div>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-bold text-foreground">{formatCurrency(stats.monthlySpending)}</span>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.monthlySpending / stats.monthlyBudget) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.monthlyBudget - stats.monthlySpending)} remaining</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Tasks</h3>
            <button
              onClick={() => onNavigate?.('tasks')}
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`}>
                  {task.completed && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Payments</h3>
            <button
              onClick={() => onNavigate?.('payments')}
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{payment.title}</p>
                      <p className="text-xs text-muted-foreground">Due in {payment.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  {paymentsLoading ? 'Loading payments...' : 'No upcoming payments'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {paymentsLoading ? '' : paymentsData.length === 0 ? 'No payments found' : `${paymentsData.length} payments total`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => {
            const IconComponent = {
              CheckCircle: CheckCircle2,
              DollarSign,
              Target,
              Calendar,
              FileText,
              TrendingUp
            }[action.icon] || CheckCircle2;

            return (
              <button
                key={action.id}
                onClick={action.action}
                className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors text-center group"
              >
                <IconComponent className={`w-6 h-6 ${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{stats.tasks.completed}</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">{stats.notes.total}</div>
            <div className="text-sm text-muted-foreground">Notes Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">{stats.habits.completedToday}</div>
            <div className="text-sm text-muted-foreground">Habits Tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
