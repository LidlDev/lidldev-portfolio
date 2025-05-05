import React, { useState, useEffect } from 'react';
import '../components/agent/agent.css';

// We'll import the components from Frosted Focus Flow
// These will be copied over in subsequent steps
import Header from '@/components/agent/Header';
import Sidebar from '@/components/agent/Sidebar';
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

          <main className="flex-1 p-6 overflow-hidden">
            <div className="glass-card p-6 h-full overflow-hidden">
              {renderActivePage()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Agent;
