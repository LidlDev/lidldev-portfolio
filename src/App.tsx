import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePerformance } from "./hooks/usePerformance";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Agent from "./pages/Agent";
import ProjectDetail from "./pages/ProjectDetail";
import SpikePrivacyPolicy from "./pages/SpikePrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { preloadResource } = usePerformance();

  // Preload critical resources
  React.useEffect(() => {
    // Preload fonts
    preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', 'style');
    preloadResource('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap', 'style');

    // Preload critical images
    preloadResource('https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80', 'image');
  }, [preloadResource]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/agent" element={
          <AuthProvider>
            <AuthGuard>
              <Agent />
            </AuthGuard>
          </AuthProvider>
        } />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/spike/privacy-policy" element={<SpikePrivacyPolicy />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
