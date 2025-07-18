import React from 'react';
import { CalendarCheck, ListTodo, PieChart, Wallet, BarChart3, Calendar, FolderKanban } from 'lucide-react';

interface MobileNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'budget', label: 'Budget', icon: <PieChart className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card text-card-foreground shadow-lg z-10 border-t border-border">
      <div className="flex justify-around items-center py-3 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative ${
              activePage === item.id
                ? 'text-primary bg-primary/10 shadow-md border-t-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <div className="relative">
              <div className={`transition-transform duration-200 ${activePage === item.id ? 'scale-125' : ''}`}>
                {item.icon}
              </div>
              {activePage === item.id && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </div>
            <span className={`text-xs mt-1 font-medium ${activePage === item.id ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
