import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Agent from "./pages/Agent";
import ProjectDetail from "./pages/ProjectDetail";
import SpikePrivacyPolicy from "./pages/SpikePrivacyPolicy";
import SpikeTermsOfService from "./pages/SpikeTermsOfService";
import Support from "./pages/Support";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import PWAInstallPrompt, { PWAStatusIndicator } from "./components/PWAInstallPrompt";
import PerformanceMonitor from "./components/PerformanceMonitor";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="lidldev-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
              <Route path="/spike/terms-of-service" element={<SpikeTermsOfService />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAInstallPrompt />
            {/* <PWAStatusIndicator /> - Hidden for now */}
            <PerformanceMonitor />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
