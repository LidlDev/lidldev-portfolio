import React from 'react';
import { CalendarCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 bg-primary/90 backdrop-blur-md rounded-b-2xl text-white flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2 hover:text-white/80 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Portfolio</span>
        </Link>
        <div className="h-6 w-px bg-white/20"></div>
        <h1 className="text-xl font-semibold">Agent Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-white/80">
          <CalendarCheck className="h-5 w-5" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
