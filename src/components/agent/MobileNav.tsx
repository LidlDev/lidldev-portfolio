import React, { useState } from 'react';
import {
  CalendarCheck,
  ListTodo,
  PieChart,
  Wallet,
  BarChart3,
  Calendar,
  FolderKanban,
  FileText,
  Target,
  Menu,
  X
} from 'lucide-react';

interface MobileNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activePage, setActivePage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Primary navigation items for bottom bar
  const primaryItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" /> },
  ];

  // All navigation items for hamburger menu
  const allMenuItems = [
    // Productivity Section
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, section: 'Productivity' },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" />, section: 'Productivity' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" />, section: 'Productivity' },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" />, section: 'Productivity' },
    { id: 'habits', label: 'Habits', icon: <Target className="w-5 h-5" />, section: 'Productivity' },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-5 h-5" />, section: 'Productivity' },

    // Finance Section
    { id: 'budget', label: 'Budget & Goals', icon: <PieChart className="w-5 h-5" />, section: 'Finance' },
    { id: 'spending', label: 'Spending & Payments', icon: <Wallet className="w-5 h-5" />, section: 'Finance' },
  ];

  const sections = [
    {
      id: 'productivity',
      label: 'Productivity',
      items: allMenuItems.filter(item => item.section === 'Productivity')
    },
    {
      id: 'finance',
      label: 'Finance',
      items: allMenuItems.filter(item => item.section === 'Finance')
    },
  ];

  const handleNavigation = (pageId: string) => {
    setActivePage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card text-card-foreground shadow-xl z-50 transform transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full overflow-y-auto pb-20">
          <nav className="flex-1 p-4">
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all w-full text-left ${
                        activePage === item.id
                          ? 'bg-primary text-primary-foreground font-medium shadow-md'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {activePage === item.id && (
                        <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card text-card-foreground shadow-lg z-30 border-t border-border">
        <div className="flex items-center py-2 px-2">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center p-2 rounded-lg transition-all flex-1"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs mt-1 font-medium text-muted-foreground">Menu</span>
          </button>

          {/* Primary Navigation Items */}
          {primaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative flex-1 ${
                activePage === item.id
                  ? 'text-primary bg-primary/10 shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <div className="relative">
                <div className={`transition-transform duration-200 ${activePage === item.id ? 'scale-110' : ''}`}>
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
    </>
  );
};

export default MobileNav;
