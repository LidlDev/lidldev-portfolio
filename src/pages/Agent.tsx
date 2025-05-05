import React, { useState, useEffect } from 'react';
import '../components/agent/agent.css';

// Import components
import Header from '@/components/agent/Header';
import Sidebar from '@/components/agent/Sidebar';
import MobileNav from '@/components/agent/MobileNav';
import TodoList from '@/components/agent/todo/TodoList';
import FinancialGoals from '@/components/agent/finance/FinancialGoals';
import SpendingTracker from '@/components/agent/finance/SpendingTracker';
import UpcomingPayments from '@/components/agent/finance/UpcomingPayments';

const Agent = () => {
  const [activePage, setActivePage] = useState('tasks');

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
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />

          <main className="flex-1 p-4 md:p-6 overflow-hidden pb-20 md:pb-6">
            <div className="glass-card p-4 md:p-6 h-full overflow-hidden">
              {renderActivePage()}
            </div>
          </main>
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </>
  );
};

export default Agent;
