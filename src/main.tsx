import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { init as initEmailJS } from '@emailjs/browser';

// Initialize EmailJS with your public key from environment variables
// This ensures the key is not hardcoded in the source code
initEmailJS(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');

createRoot(document.getElementById("root")!).render(<App />);
