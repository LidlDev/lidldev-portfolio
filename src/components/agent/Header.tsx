import React from 'react';
import { CalendarCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const today = new Date();

  return (
    <header className="px-4 md:px-6 py-4 bg-indigo-600 shadow-md z-10 text-white flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:text-white/80 transition-colors bg-indigo-700 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm md:text-base">Back to Portfolio</span>
        </Link>
        <div className="hidden md:block h-6 w-px bg-white/20 mx-1"></div>
        <h1 className="text-lg md:text-xl font-semibold">Agent Dashboard</h1>
      </div>
      <div className="flex items-center">
        <div className="flex items-center space-x-2 text-white/90 bg-indigo-700/50 px-3 py-1.5 rounded-lg">
          <CalendarCheck className="h-4 w-4" />
          <span className="text-sm">
            {today.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
