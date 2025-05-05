import React, { useState, useEffect } from 'react';
import { CalendarCheck, ListTodo, PieChart, Wallet, Menu, X } from 'lucide-react';

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
    { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'goals', label: 'Financial Goals', icon: <PieChart className="w-5 h-5" /> },
    { id: 'spending', label: 'Spending', icon: <Wallet className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CalendarCheck className="w-5 h-5" /> }
  ];

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden fixed top-20 left-4 z-20 p-2 rounded-full bg-primary text-white shadow-lg"
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
          hidden md:flex flex-col bg-primary/85 backdrop-blur-md rounded-r-2xl p-4
          h-[calc(100vh-5rem)] transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
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

      {/* Mobile sidebar - slide in from left */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-primary/95 backdrop-blur-md p-4 flex flex-col h-full animate-slide-in-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-semibold">Agent Dashboard</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-2 flex-grow">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activePage === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
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
