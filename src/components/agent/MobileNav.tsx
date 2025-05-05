import React from 'react';
import { CalendarCheck, ListTodo, PieChart, Wallet } from 'lucide-react';

interface MobileNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals', icon: <PieChart className="w-5 h-5" /> },
    { id: 'spending', label: 'Spending', icon: <Wallet className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CalendarCheck className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary shadow-lg z-10">
      <div className="flex justify-around items-center py-3 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative ${
              activePage === item.id
                ? 'text-primary bg-white shadow-md border-t-2 border-accent tab-active-glow animate-pulse-subtle'
                : 'text-white/90 hover:text-white hover:bg-primary/70'
            }`}
          >
            <div className="relative">
              <div className={`transition-transform duration-200 ${activePage === item.id ? 'scale-125' : ''}`}>
                {item.icon}
              </div>
              {activePage === item.id && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
              )}
            </div>
            <span className={`text-xs mt-1 font-medium ${activePage === item.id ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <div className="h-1 bg-primary/80"></div>
    </div>
  );
};

export default MobileNav;
