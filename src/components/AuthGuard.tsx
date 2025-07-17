import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading authentication...</p>
    </div>
  </div>
}) => {
  const { loading } = useAuth();

  if (loading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthGuard;
