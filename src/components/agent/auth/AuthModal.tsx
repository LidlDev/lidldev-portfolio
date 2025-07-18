import React, { useState, useEffect, useRef } from 'react';
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
  const previousAuthState = useRef<{ isOpen: boolean; user: any }>({ isOpen, user });
  const hasShownSuccess = useRef<boolean>(false);

  // Check if user is logged in
  useEffect(() => {
    // Only show success animation when:
    // 1. The modal is open
    // 2. The user just signed in (user changed from null to non-null)
    // 3. We haven't shown the success animation for this session yet
    const userJustSignedIn = !previousAuthState.current.user && user && isOpen;

    if (userJustSignedIn && !hasShownSuccess.current) {
      console.log('User just signed in, showing success animation');
      setSuccessMessage('You have successfully signed in!');
      setView('success');
      hasShownSuccess.current = true;

      // Close the modal after a short delay
      const timer = setTimeout(() => {
        onClose();
        // Reset the success flag when the modal closes
        hasShownSuccess.current = false;
      }, 1500);

      return () => clearTimeout(timer);
    }

    // Update previous state for next comparison
    previousAuthState.current = { isOpen, user };
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="relative w-full max-w-md animate-scale-in mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 bg-background/80 rounded-full p-1"
        >
          <X className="h-5 w-5" />
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
