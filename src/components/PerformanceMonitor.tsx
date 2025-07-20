import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Wifi, Battery, Monitor } from 'lucide-react';
import { GlassCard } from './ui/GlassmorphismComponents';
import {
  getMemoryUsage,
  getNetworkInfo,
  getBatteryInfo
} from '../utils/performance';
import { performanceMonitor } from '../utils/pwa';

interface PerformanceData {
  memory?: MemoryInfo;
  network?: any;
  battery?: any;
  metrics: Record<string, number>;
  fps: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    metrics: {},
    fps: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updatePerformanceData = async () => {
      const memory = getMemoryUsage();
      const network = getNetworkInfo();
      const battery = await getBatteryInfo();
      const metrics = performanceMonitor.getMetrics();

      setPerformanceData(prev => ({
        ...prev,
        memory,
        network,
        battery,
        metrics
      }));
    };

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setPerformanceData(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    // Update performance data every 2 seconds
    const interval = setInterval(updatePerformanceData, 2000);
    
    // Start FPS monitoring
    measureFPS();
    
    // Initial data load
    updatePerformanceData();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionQuality = (effectiveType: string) => {
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return { color: 'text-red-500', label: 'Poor' };
      case '3g':
        return { color: 'text-yellow-500', label: 'Fair' };
      case '4g':
        return { color: 'text-green-500', label: 'Good' };
      default:
        return { color: 'text-blue-500', label: 'Unknown' };
    }
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        className="p-2 bg-primary text-white rounded-full shadow-lg"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Activity className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bottom-12 left-0 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <GlassCard variant="strong" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Performance Monitor</h3>
                <span className="text-xs text-muted-foreground">Dev Mode</span>
              </div>

              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm">FPS</span>
                </div>
                <span className={`text-sm font-mono ${getFPSColor(performanceData.fps)}`}>
                  {performanceData.fps}
                </span>
              </div>

              {/* Memory Usage */}
              {performanceData.memory && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-primary" />
                    <span className="text-sm">Memory</span>
                  </div>
                  <div className="text-xs space-y-1 ml-6">
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span className="font-mono">
                        {formatBytes(performanceData.memory.usedJSHeapSize)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-mono">
                        {formatBytes(performanceData.memory.totalJSHeapSize)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Limit:</span>
                      <span className="font-mono">
                        {formatBytes(performanceData.memory.jsHeapSizeLimit)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Network */}
              {performanceData.network && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-primary" />
                    <span className="text-sm">Network</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getConnectionQuality(performanceData.network.effectiveType).color}`}>
                      {getConnectionQuality(performanceData.network.effectiveType).label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {performanceData.network.effectiveType?.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}

              {/* Battery */}
              {performanceData.battery && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-primary" />
                    <span className="text-sm">Battery</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${
                      performanceData.battery.level > 0.5 
                        ? 'text-green-500' 
                        : performanceData.battery.level > 0.2 
                        ? 'text-yellow-500' 
                        : 'text-red-500'
                    }`}>
                      {Math.round(performanceData.battery.level * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {performanceData.battery.charging ? 'Charging' : 'Discharging'}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {Object.keys(performanceData.metrics).length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Metrics</span>
                  <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                    {Object.entries(performanceData.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="truncate">{key}:</span>
                        <span className="font-mono ml-2">
                          {typeof value === 'number' ? `${value.toFixed(2)}ms` : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Tips */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-muted-foreground space-y-1">
                  {performanceData.fps < 30 && (
                    <div className="text-red-400">⚠ Low FPS detected</div>
                  )}
                  {performanceData.memory && 
                   performanceData.memory.usedJSHeapSize / performanceData.memory.jsHeapSizeLimit > 0.8 && (
                    <div className="text-yellow-400">⚠ High memory usage</div>
                  )}
                  {performanceData.network?.effectiveType === 'slow-2g' && (
                    <div className="text-red-400">⚠ Slow connection</div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerformanceMonitor;
