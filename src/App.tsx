import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./contexts/ThemeContext";

// Simple components to test step by step
const SimpleIndex = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Harry Liddle</h1>
          <p className="text-xl text-muted-foreground mb-8">Full Stack Developer</p>
          <p className="max-w-2xl mx-auto">
            I build beautiful, interactive web applications with modern technologies.
            Turning ideas into exceptional digital experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

const SimpleNotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
    </div>
  </div>
);

const App = () => {
  console.log("App component rendering...");

  try {
    return (
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SimpleIndex />} />
              <Route path="*" element={<SimpleNotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    );
  } catch (error) {
    console.error("Error in App component:", error);
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#fef2f2'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#dc2626' }}>Error Loading Portfolio</h1>
          <p style={{ color: '#7f1d1d' }}>Check console for details</p>
        </div>
      </div>
    );
  }
};

export default App;
