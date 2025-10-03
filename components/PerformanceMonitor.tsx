'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when performance is poor
    const showMonitor = process.env.NODE_ENV === 'development' || 
                       (typeof window !== 'undefined' && window.location.search.includes('perf=true'));

    if (!showMonitor) return;

    setIsVisible(true);

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime } as PerformanceMetrics));
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime } as PerformanceMetrics));
        }
        
        if (entry.entryType === 'layout-shift') {
          const cls = (entry as any).value;
          setMetrics(prev => ({ ...prev, cls } as PerformanceMetrics));
        }
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });

    // Measure page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      setMetrics(prev => ({ ...prev, loadTime } as PerformanceMetrics));
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isVisible || !metrics) return null;

  const getPerformanceColor = (value: number, type: 'fcp' | 'lcp' | 'cls') => {
    if (type === 'cls') {
      return value <= 0.1 ? '#10b981' : value <= 0.25 ? '#f59e0b' : '#ef4444';
    }
    // For FCP and LCP (in milliseconds)
    const threshold = type === 'fcp' ? 1800 : 2500;
    return value <= threshold ? '#10b981' : value <= threshold * 1.5 ? '#f59e0b' : '#ef4444';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace',
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Performance Monitor</div>
      {metrics.loadTime && (
        <div>Load Time: <span style={{ color: '#10b981' }}>{metrics.loadTime.toFixed(0)}ms</span></div>
      )}
      {metrics.fcp && (
        <div>FCP: <span style={{ color: getPerformanceColor(metrics.fcp, 'fcp') }}>{metrics.fcp.toFixed(0)}ms</span></div>
      )}
      {metrics.lcp && (
        <div>LCP: <span style={{ color: getPerformanceColor(metrics.lcp, 'lcp') }}>{metrics.lcp.toFixed(0)}ms</span></div>
      )}
      {metrics.cls !== undefined && (
        <div>CLS: <span style={{ color: getPerformanceColor(metrics.cls, 'cls') }}>{metrics.cls.toFixed(3)}</span></div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
