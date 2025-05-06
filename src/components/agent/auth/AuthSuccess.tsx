import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface AuthSuccessProps {
  message: string;
  onComplete: () => void;
}

const AuthSuccess: React.FC<AuthSuccessProps> = ({ message, onComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger the completion callback after the animation finishes
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      onComplete();
    }, 1500); // Animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
      <div className="animate-bounce-in">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      </div>
      <h2 className="text-xl font-bold text-primary mb-2 animate-fade-in">Success!</h2>
      <p className="text-center text-gray-700 animate-fade-in">{message}</p>
    </div>
  );
};

export default AuthSuccess;
