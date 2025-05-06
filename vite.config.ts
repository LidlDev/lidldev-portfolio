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
    base: '/', // This works with custom domain
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
  };
});
