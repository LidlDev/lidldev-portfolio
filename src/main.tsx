import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx loading...");

try {
  // Initialize EmailJS with your public key from environment variables
  import('@emailjs/browser').then(({ init: initEmailJS }) => {
    initEmailJS(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');
    console.log("EmailJS initialized");
  }).catch(error => {
    console.warn("EmailJS initialization failed:", error);
  });
} catch (error) {
  console.warn("EmailJS import failed:", error);
}

console.log("Creating React root...");
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
console.log("React app rendered");
