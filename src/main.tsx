import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { init as initEmailJS } from '@emailjs/browser';

// Initialize EmailJS with your public key
// Replace 'your_public_key' with your actual EmailJS public key
initEmailJS('your_public_key');

createRoot(document.getElementById("root")!).render(<App />);
