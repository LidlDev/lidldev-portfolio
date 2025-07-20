import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { pwaManager, isPWAInstalled, canInstallPWA } from '../utils/pwa';
import { GlassCard, GlassButton } from './ui/GlassmorphismComponents';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);



  useEffect(() => {
    // Check initial state
    const installed = isPWAInstalled();
    const canInstallApp = canInstallPWA();
    setIsInstalled(installed);
    setCanInstall(canInstallApp);

    // Listen for PWA events
    const handleInstallable = () => {
      setCanInstall(true);
      setShowPrompt(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShowPrompt(false);
    };

    window.addEventListener('pwa:installable', handleInstallable);
    window.addEventListener('pwa:installed', handleInstalled);

    // Auto-show prompt after delay if not installed
    const timer = setTimeout(() => {
      if (!isInstalled && canInstall) {
        setShowPrompt(true);
      }
    }, 10000); // Show after 10 seconds



    return () => {
      window.removeEventListener('pwa:installable', handleInstallable);
      window.removeEventListener('pwa:installed', handleInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled, canInstall]);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const success = await pwaManager.showInstallPrompt();

      if (success) {
        setShowPrompt(false);
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('PWA install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or can't install
  if (isInstalled || !canInstall) {
    return null;
  }

  // Don't show if dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }



  return (
    <>






      <AnimatePresence>
        {showPrompt && (
        <motion.div
          className="fixed bottom-4 right-4 z-[9999] max-w-sm"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <GlassCard variant="strong" className="p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="p-2 bg-primary/20 rounded-full"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Download className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">Install App</h3>
                  <p className="text-xs text-muted-foreground">Get the full experience</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Install LidlDev Portfolio for faster access, offline browsing, and a native app experience.
            </p>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <GlassButton
                variant="colored"
                size="sm"
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 flex items-center justify-center"
              >
                {isInstalling ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    <span>Install</span>
                  </div>
                )}
              </GlassButton>
              <GlassButton
                variant="subtle"
                size="sm"
                onClick={handleDismiss}
                className="flex items-center justify-center"
              >
                <span>Later</span>
              </GlassButton>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

// PWA Status Indicator (for development/debugging)
export const PWAStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState({
    isInstalled: false,
    canInstall: false,
    isServiceWorkerSupported: false,
    isRegistered: false
  });

  useEffect(() => {
    const updateStatus = () => {
      setStatus(pwaManager.getInstallationStatus());
    };

    updateStatus();
    
    // Update status when PWA events occur
    window.addEventListener('pwa:installable', updateStatus);
    window.addEventListener('pwa:installed', updateStatus);

    return () => {
      window.removeEventListener('pwa:installable', updateStatus);
      window.removeEventListener('pwa:installed', updateStatus);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <motion.div
      className="fixed top-4 left-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <GlassCard variant="subtle" className="p-2 text-xs">
        <div className="space-y-1">
          <div className={`flex items-center space-x-2 ${status.isInstalled ? 'text-green-500' : 'text-muted-foreground'}`}>
            <div className={`w-2 h-2 rounded-full ${status.isInstalled ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>Installed</span>
          </div>
          <div className={`flex items-center space-x-2 ${status.canInstall ? 'text-blue-500' : 'text-muted-foreground'}`}>
            <div className={`w-2 h-2 rounded-full ${status.canInstall ? 'bg-blue-500' : 'bg-gray-400'}`} />
            <span>Can Install</span>
          </div>
          <div className={`flex items-center space-x-2 ${status.isServiceWorkerSupported ? 'text-green-500' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${status.isServiceWorkerSupported ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>SW Support</span>
          </div>
          <div className={`flex items-center space-x-2 ${status.isRegistered ? 'text-green-500' : 'text-yellow-500'}`}>
            <div className={`w-2 h-2 rounded-full ${status.isRegistered ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>SW Registered</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default PWAInstallPrompt;
