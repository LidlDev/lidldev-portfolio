import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import EnvDebug from './EnvDebug';
import { X } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<AuthView>('login');
  const [showDebug, setShowDebug] = useState(false);

  if (!isOpen) return null;

  const handleToggleForm = () => {
    setView(view === 'login' ? 'signup' : 'login');
  };

  const handleForgotPassword = () => {
    setView('forgotPassword');
  };

  const handleBackToLogin = () => {
    setView('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="relative w-full max-w-md mx-4 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Debug button - only for development */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute top-4 left-4 text-xs text-gray-500 hover:text-gray-700 z-10"
        >
          Debug
        </button>

        {showDebug && <EnvDebug />}

        {view === 'login' && (
          <LoginForm
            onToggleForm={handleToggleForm}
            onForgotPassword={handleForgotPassword}
          />
        )}

        {view === 'signup' && (
          <SignupForm onToggleForm={handleToggleForm} />
        )}

        {view === 'forgotPassword' && (
          <ForgotPasswordForm onBack={handleBackToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
