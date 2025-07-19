import React, { useState, useEffect } from 'react';
import '../components/agent/agent.css';

// Import components
import SEO from '@/components/SEO';
import Header from '@/components/agent/Header';
import Sidebar from '@/components/agent/Sidebar';
import MobileNav from '@/components/agent/MobileNav';
import TodoList from '@/components/agent/todo/TodoList';
import EnhancedTodoList from '@/components/agent/todo/EnhancedTodoList';
import SpendingTracker from '@/components/agent/finance/SpendingTracker';
import Dashboard from '@/components/agent/dashboard/Dashboard';
import Calendar from '@/components/agent/calendar/Calendar';
import Projects from '@/components/agent/projects/Projects';
import Habits from '@/components/agent/habits/Habits';
import Notes from '@/components/agent/notes/Notes';
import BudgetTracker from '@/components/agent/finance/BudgetTracker';

// Import auth redirect utility
import { useAuthRedirect } from '@/utils/authRedirect';

const Agent = () => {
  const [activePage, setActivePage] = useState('dashboard');

  // Use the auth redirect hook to handle OAuth redirects
  useAuthRedirect();

  // Set document title when component mounts and handle URL parameters
  useEffect(() => {
    document.title = 'Agent | LidlDev Portfolio';

    // Check for URL parameters to navigate to specific page/tab
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const authRedirect = urlParams.get('auth_redirect');

    if (pageParam && authRedirect === 'true') {
      // Navigate to the specified page after auth redirect
      setActivePage(pageParam);

      // Clean up the URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // Restore original title when component unmounts
    return () => {
      document.title = 'Portfolio';
    };
  }, []);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'tasks':
        return <EnhancedTodoList />;
      case 'calendar':
        return <Calendar />;
      case 'projects':
        return <Projects />;
      case 'habits':
        return <Habits />;
      case 'notes':
        return <Notes />;
      case 'budget':
        return <BudgetTracker />;
      case 'spending':
        return <SpendingTracker />;
      case 'payments':
        return <SpendingTracker initialTab="payments" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <SEO
        title="Agent Dashboard - LidlDev"
        description="Personal productivity dashboard with task management, financial tracking, and goal setting tools. Secure and private workspace for managing your digital life."
        keywords="productivity dashboard, task management, financial tracker, personal finance, goal setting, todo list, expense tracker"
        url="https://www.lidldev.com/agent"
        type="webapp"
      />
      {/* Fixed header at the top */}
      <div className="fixed top-0 left-0 right-0 z-20 w-full">
        <Header />
      </div>

      <div className="flex flex-1 w-full">
        {/* Sidebar - hidden on mobile */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Main content area with proper mobile spacing */}
        <main className="flex-1 w-full overflow-hidden">
          {/* Content wrapper with proper mobile constraints */}
          <div className="h-screen pt-[60px] sm:pt-[68px] md:pt-16 pb-[80px] md:pb-6 px-2 sm:px-4 md:px-6 overflow-auto">
            <div className="bg-card text-card-foreground p-3 sm:p-4 md:p-6 h-full rounded-lg md:rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="h-full overflow-auto">
                {renderActivePage()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default Agent;
