import React, { useState } from 'react';
import { CalendarCheck, ListTodo, PieChart, Wallet } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'goals', label: 'Financial Goals', icon: <PieChart className="w-5 h-5" /> },
    { id: 'spending', label: 'Spending', icon: <Wallet className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CalendarCheck className="w-5 h-5" /> }
  ];

  return (
    <aside className={`bg-primary/85 backdrop-blur-md rounded-r-2xl p-4 flex flex-col h-[calc(100vh-5rem)] transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <button 
        onClick={() => setCollapsed(!collapsed)} 
        className="self-end p-2 rounded-full hover:bg-white/10 text-white mb-6"
      >
        {collapsed ? '→' : '←'}
      </button>
      
      <nav className="flex flex-col space-y-2 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activePage === item.id 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-white/10 text-center text-white/80 text-sm">
        {!collapsed && <span>Agent Dashboard</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
