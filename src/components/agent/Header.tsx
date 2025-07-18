import React, { useState } from 'react';
import { CalendarCheck, ArrowLeft, LogIn, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import UserProfile from './auth/UserProfile';
import AuthModal from './auth/AuthModal';

const Header: React.FC = () => {
  const today = new Date();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="px-4 md:px-6 py-4 bg-primary text-primary-foreground shadow-md z-10 flex items-center justify-between animate-fade-in border-b border-border">
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity bg-primary-foreground/10 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm md:text-base">Back to Portfolio</span>
        </Link>
        <div className="hidden md:block h-6 w-px bg-primary-foreground/20 mx-1"></div>
        <h1 className="text-lg md:text-xl font-semibold">Agent Dashboard</h1>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="flex items-center space-x-2 text-primary-foreground/90 bg-primary-foreground/10 px-3 py-1.5 rounded-lg">
          <CalendarCheck className="h-4 w-4" />
          <span className="text-sm">
            {today.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        {user ? (
          <UserProfile />
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center space-x-2 bg-primary-foreground text-primary px-3 py-1.5 rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span className="text-sm font-medium">Sign In</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
