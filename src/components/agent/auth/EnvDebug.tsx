import React from 'react';

const EnvDebug: React.FC = () => {
  // Check if we're using hardcoded credentials
  const usingHardcodedCredentials = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded mb-4">
      <h3 className="font-bold text-red-800 mb-2">Environment Variables Debug</h3>
      <p className="text-sm text-red-700">
        VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Not defined'}
      </p>
      <p className="text-sm text-red-700">
        VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Defined (hidden for security)' : 'Not defined'}
      </p>

      {usingHardcodedCredentials && (
        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm font-bold text-yellow-800">⚠️ WARNING: Using hardcoded credentials</p>
          <p className="text-xs text-yellow-800">
            The application is currently using hardcoded Supabase credentials. This is insecure and should be removed in production.
            Please set up proper environment variables in a .env file.
          </p>
        </div>
      )}

      <p className="text-sm mt-2">
        Note: This component is for debugging only and should be removed in production.
      </p>
    </div>
  );
};

export default EnvDebug;
