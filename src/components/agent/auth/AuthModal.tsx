import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import AuthSuccess from './AuthSuccess';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'success';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<AuthView>('login');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  // Check if user is logged in
  useEffect(() => {
    if (user && isOpen) {
      setSuccessMessage('You have successfully signed in!');
      setView('success');

      // Close the modal after a short delay
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose]);

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

  const handleSuccessComplete = () => {
    onClose();
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

        {view === 'success' && (
          <AuthSuccess
            message={successMessage}
            onComplete={handleSuccessComplete}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
