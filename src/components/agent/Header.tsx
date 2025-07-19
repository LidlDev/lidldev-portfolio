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
    <header className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-primary text-primary-foreground shadow-md z-10 flex items-center justify-between animate-fade-in border-b border-border">
      {/* Left section - simplified for mobile */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 min-w-0 flex-1">
        <Link
          to="/"
          className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity bg-primary-foreground/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex-shrink-0"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm md:text-base hidden xs:inline">Back to Portfolio</span>
          <span className="text-xs sm:text-sm md:text-base xs:hidden">Back</span>
        </Link>
        <div className="hidden sm:block h-4 md:h-6 w-px bg-primary-foreground/20 mx-1"></div>
        <h1 className="text-sm sm:text-lg md:text-xl font-semibold truncate">
          <span className="hidden sm:inline">Agent Dashboard</span>
          <span className="sm:hidden">Agent</span>
        </h1>
      </div>

      {/* Right section - responsive layout */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
        {/* Theme toggle - always visible */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
        </button>

        {/* Date - hidden on very small screens */}
        <div className="hidden sm:flex items-center space-x-2 text-primary-foreground/90 bg-primary-foreground/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
          <CalendarCheck className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">
            <span className="hidden md:inline">
              {today.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="md:hidden">
              {today.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </span>
        </div>

        {/* Auth section - responsive */}
        {user ? (
          <UserProfile />
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center space-x-1 sm:space-x-2 bg-primary-foreground text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium hidden xs:inline">Sign In</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
