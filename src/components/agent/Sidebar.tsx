import React, { useState } from 'react';
import {
  CalendarCheck,
  ListTodo,
  PieChart,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FolderKanban,
  BarChart3,
  FileText,
  Target,
  Clock
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    // Productivity Section
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-6 h-6" />, section: 'productivity' },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-6 h-6" />, section: 'productivity' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-6 h-6" />, section: 'productivity' },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-6 h-6" />, section: 'productivity' },
    { id: 'habits', label: 'Habits', icon: <Target className="w-6 h-6" />, section: 'productivity' },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-6 h-6" />, section: 'productivity' },

    // Finance Section
    { id: 'budget', label: 'Budget & Goals', icon: <PieChart className="w-6 h-6" />, section: 'finance' },
    { id: 'spending', label: 'Spending & Payments', icon: <Wallet className="w-6 h-6" />, section: 'finance' },
  ];

  const sections = [
    { id: 'productivity', label: 'Productivity', items: menuItems.filter(item => item.section === 'productivity') },
    { id: 'finance', label: 'Finance', items: menuItems.filter(item => item.section === 'finance') },
  ];

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <aside
        className={`
          hidden md:flex flex-col bg-sidebar-background text-sidebar-foreground shadow-lg border-r border-sidebar-border
          h-[calc(100vh-4rem)] transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-end p-4 border-b border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex flex-col p-3 flex-grow overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-3">
                  {section.label}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} space-x-3 p-3 rounded-xl transition-all relative w-full ${
                      activePage === item.id
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-md border-l-4 border-primary'
                        : 'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <div className="relative">
                      <div className={`transition-all duration-200 ${
                        collapsed
                          ? `${activePage === item.id ? 'bg-sidebar-primary p-2 rounded-lg text-sidebar-primary-foreground' : 'bg-sidebar-accent p-2 rounded-lg'}`
                          : ''
                      }`}>
                        {item.icon}
                      </div>
                      {activePage === item.id && !collapsed && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    {!collapsed && (
                      <span className={`font-medium ${activePage === item.id ? 'scale-105 transform' : ''}`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-sidebar-border text-center text-sidebar-foreground/80 text-sm">
          {!collapsed && <span className="font-medium">Agent Dashboard</span>}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
