import React, { useState, useEffect } from 'react';
import { CalendarCheck, ListTodo, PieChart, Wallet, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-6 h-6" /> },
    { id: 'goals', label: 'Financial Goals', icon: <PieChart className="w-6 h-6" /> },
    { id: 'spending', label: 'Spending', icon: <Wallet className="w-6 h-6" /> },
    { id: 'payments', label: 'Payments', icon: <CalendarCheck className="w-6 h-6" /> }
  ];

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden fixed top-20 left-4 z-20 p-3 rounded-full bg-indigo-700 text-white shadow-lg"
      aria-label="Toggle menu"
    >
      {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  return (
    <>
      <MobileMenuButton />

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden md:flex flex-col bg-indigo-800 shadow-lg
          h-[calc(100vh-4rem)] transition-all duration-300 mt-16
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-end p-4 border-b border-indigo-700">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-indigo-700 text-white transition-colors"
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
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-white/80 hover:bg-indigo-700 hover:text-white'
              }`}
            >
              <div className={`${collapsed ? 'bg-indigo-700 p-2 rounded-lg' : ''}`}>
                {item.icon}
              </div>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-indigo-700 text-center text-white/80 text-sm">
          {!collapsed && <span className="font-medium">Agent Dashboard</span>}
        </div>
      </aside>

      {/* Mobile sidebar - slide in from left */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-indigo-800 p-4 flex flex-col h-full animate-slide-in-left shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-indigo-700 pb-4">
              <h2 className="text-white font-bold text-xl">Agent Dashboard</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-indigo-700 text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-3 flex-grow">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
                    activePage === item.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-white/80 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
