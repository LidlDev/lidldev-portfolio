import { useEffect } from 'react';
import { setupAuthFocusListener } from '@/utils/authPopupListener';

/**
 * Component that initializes auth-related listeners when the app loads
 * This component doesn't render anything visible
 */
const AuthInitializer: React.FC = () => {
  useEffect(() => {
    // Set up the auth focus listener
    setupAuthFocusListener();
    
    // Clean up function (not strictly necessary for this case)
    return () => {
      // Any cleanup if needed
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default AuthInitializer;
