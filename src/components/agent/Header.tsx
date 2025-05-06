import React, { useState } from 'react';
import { CalendarCheck, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './auth/UserProfile';
import AuthModal from './auth/AuthModal';

const Header: React.FC = () => {
  const today = new Date();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="px-4 md:px-6 py-4 bg-primary shadow-md z-10 text-white flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:text-white/80 transition-colors bg-primary/80 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm md:text-base">Back to Portfolio</span>
        </Link>
        <div className="hidden md:block h-6 w-px bg-white/20 mx-1"></div>
        <h1 className="text-lg md:text-xl font-semibold">Agent Dashboard</h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-white/90 bg-primary/70 px-3 py-1.5 rounded-lg">
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
            className="flex items-center space-x-2 bg-white text-primary px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
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
