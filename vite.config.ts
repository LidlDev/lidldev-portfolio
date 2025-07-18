import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  console.log('Environment variables loaded:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? 'Defined' : 'Not defined',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'Defined' : 'Not defined',
  });

  return {
    base: '/', // Base path for the application
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Make sure Vite properly handles environment variables
    define: {
      'process.env': env,
    },
    build: {
      // Code splitting configuration
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'query-vendor': ['@tanstack/react-query'],
            'supabase-vendor': ['@supabase/supabase-js'],
            // Feature chunks
            'agent': ['src/pages/Agent.tsx', 'src/components/agent/**'],
            'github': ['src/components/GitHubStats.tsx', 'src/components/GitHubContributions.tsx'],
          },
        },
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Enable source maps for production debugging
      sourcemap: mode === 'development',
      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
    // Performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'lucide-react',
      ],
    },
  };
});
