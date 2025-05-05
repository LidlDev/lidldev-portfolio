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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-md rounded-t-xl shadow-lg z-10">
      <div className="flex justify-around items-center p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              activePage === item.id 
                ? 'text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
