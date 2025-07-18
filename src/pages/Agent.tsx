import React, { useState, useEffect } from 'react';
import '../components/agent/agent.css';

// Import components
import SEO from '@/components/SEO';
import Header from '@/components/agent/Header';
import Sidebar from '@/components/agent/Sidebar';
import MobileNav from '@/components/agent/MobileNav';
import TodoList from '@/components/agent/todo/TodoList';
import FinancialGoals from '@/components/agent/finance/FinancialGoals';
import SpendingTracker from '@/components/agent/finance/SpendingTracker';
import UpcomingPayments from '@/components/agent/finance/UpcomingPayments';

// Import auth redirect utility
import { useAuthRedirect } from '@/utils/authRedirect';

const Agent = () => {
  const [activePage, setActivePage] = useState('tasks');

  // Use the auth redirect hook to handle OAuth redirects
  useAuthRedirect();

  // Set document title when component mounts
  useEffect(() => {
    document.title = 'Agent | LidlDev Portfolio';

    // Restore original title when component unmounts
    return () => {
      document.title = 'Portfolio';
    };
  }, []);

  const renderActivePage = () => {
    switch (activePage) {
      case 'tasks':
        return <TodoList />;
      case 'goals':
        return <FinancialGoals />;
      case 'spending':
        return <SpendingTracker />;
      case 'payments':
        return <UpcomingPayments />;
      default:
        return <TodoList />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
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

      <div className="flex flex-1 pt-16 w-full">
        {/* Sidebar - hidden on mobile */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Main content area */}
        <main className="flex-1 p-2 md:p-6 overflow-auto pb-24 md:pb-6 w-full">
          <div className="bg-white p-3 md:p-6 h-full rounded-xl shadow-lg">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default Agent;
