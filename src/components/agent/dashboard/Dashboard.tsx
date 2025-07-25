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
import { motion } from 'framer-motion';
import { CardSkeleton, ListSkeleton, LoadingOverlay, Spinner } from '@/components/animations';

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
      <div className="h-full overflow-y-auto pb-4">
        {/* Header skeleton */}
        <div className="mb-4 sm:mb-6 space-y-2">
          <div className="h-6 sm:h-8 bg-muted animate-pulse rounded w-48"></div>
          <div className="h-4 sm:h-5 bg-muted animate-pulse rounded w-80"></div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} className="h-24 sm:h-28" />
          ))}
        </div>

        {/* Recent activity skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-6 bg-muted animate-pulse rounded w-32 mb-4"></div>
          <ListSkeleton items={3} />
        </div>

        {/* Quick actions skeleton */}
        <div>
          <div className="h-6 bg-muted animate-pulse rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      <motion.div
        className="mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1 sm:mb-2">Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your productivity overview.</p>
      </motion.div>

      {/* Stats Grid - Mobile optimized */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        {/* Tasks Progress */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <motion.div
            className="bg-card border border-border rounded-lg p-3 sm:p-4"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Tasks</span>
            </div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-bold text-foreground">{stats.tasks.completed}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">/ {stats.tasks.total}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          </motion.div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <motion.div
            className="bg-card border border-border rounded-lg p-3 sm:p-4"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Deadlines</span>
            </div>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="space-y-2">
            <span className="text-xl sm:text-2xl font-bold text-foreground">{stats.tasks.dueSoon}</span>
            <p className="text-xs text-muted-foreground">Tasks due soon</p>
          </div>
          </motion.div>
        </motion.div>

        {/* Financial Goals */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <motion.div
            className="bg-card border border-border rounded-lg p-3 sm:p-4"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Goals</span>
            </div>
            <span className="text-xs text-muted-foreground">Progress</span>
          </div>
          <div className="space-y-2">
            <span className="text-xl sm:text-2xl font-bold text-foreground">{stats.goals.avgProgress}%</span>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.goals.avgProgress}%` }}
              ></div>
            </div>
          </div>
          </motion.div>
        </motion.div>

        {/* Monthly Spending */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <motion.div
            className="bg-card border border-border rounded-lg p-3 sm:p-4"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Spending</span>
            </div>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
          <div className="space-y-2">
            <span className="text-xl sm:text-2xl font-bold text-foreground">{formatCurrency(stats.monthlySpending)}</span>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.monthlySpending / stats.monthlyBudget) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.monthlyBudget - stats.monthlySpending)} remaining</p>
          </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Recent Activity - Mobile optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Tasks */}
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Tasks</h3>
            <button
              onClick={() => onNavigate?.('tasks')}
              className="flex items-center space-x-1 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`}>
                  {task.completed && <CheckCircle2 className="w-2 h-2 sm:w-3 sm:h-3 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Upcoming Payments</h3>
            <button
              onClick={() => onNavigate?.('payments')}
              className="flex items-center space-x-1 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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

      {/* Quick Actions - Mobile optimized */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
                className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:bg-accent/50 transition-colors text-center group"
              >
                <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-xs sm:text-sm font-medium text-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Summary - Mobile optimized */}
      <div className="mt-6 sm:mt-8 bg-card border border-border rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{stats.tasks.completed}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-500 mb-1">{stats.notes.total}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Notes Created</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-500 mb-1">{stats.habits.completedToday}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Habits Tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
