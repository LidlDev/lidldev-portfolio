import React, { useState } from 'react';
import { CalendarCheck, ListTodo, PieChart, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-6 h-6" /> },
    { id: 'goals', label: 'Financial Goals', icon: <PieChart className="w-6 h-6" /> },
    { id: 'spending', label: 'Spending', icon: <Wallet className="w-6 h-6" /> },
    { id: 'payments', label: 'Payments', icon: <CalendarCheck className="w-6 h-6" /> }
  ];

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <aside
        className={`
          hidden md:flex flex-col bg-primary shadow-lg
          h-[calc(100vh-4rem)] transition-all duration-300 mt-16
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-end p-4 border-b border-primary/70">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-primary/80 text-white transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex flex-col space-y-3 p-3 flex-grow">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} space-x-3 p-3 rounded-xl transition-all ${
                activePage === item.id
                  ? 'bg-primary/80 text-white shadow-md'
                  : 'text-white/80 hover:bg-primary/70 hover:text-white'
              }`}
            >
              <div className={`${collapsed ? 'bg-primary/70 p-2 rounded-lg' : ''}`}>
                {item.icon}
              </div>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-primary/70 text-center text-white/80 text-sm">
          {!collapsed && <span className="font-medium">Agent Dashboard</span>}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
