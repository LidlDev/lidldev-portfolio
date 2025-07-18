import React from "react";

// Simple diagnostic App to isolate the issue
const App = () => {
  console.log("App component rendering...");

  try {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>
            Harry Liddle - Full Stack Developer
          </h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Portfolio is loading... If you see this, React is working!
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: '#e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#475569'
          }}>
            Debug: App component loaded successfully
          </div>
        </div>
      </div>
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
