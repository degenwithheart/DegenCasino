import React from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  startTiming(label: string) {
    this.metrics.set(label, performance.now());
  }
  
  endTiming(label: string): number {
    const start = this.metrics.get(label);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  measureComponentRender(componentName: string) {
    return {
      start: () => this.startTiming(`${componentName}-render`),
      end: () => this.endTiming(`${componentName}-render`)
    };
  }
  
  // Measure Core Web Vitals
  measureWebVitals() {
    // Largest Contentful Paint
    if ('getLCP' in window) {
      (window as any).getLCP((metric: any) => {
        console.log('📊 LCP:', metric.value);
      });
    }
    
    // First Input Delay
    if ('getFID' in window) {
      (window as any).getFID((metric: any) => {
        console.log('📊 FID:', metric.value);
      });
    }
    
    // Cumulative Layout Shift
    if ('getCLS' in window) {
      (window as any).getCLS((metric: any) => {
        console.log('📊 CLS:', metric.value);
      });
    }
  }
  
  // Monitor bundle sizes
  reportBundleInfo() {
    const chunks = performance.getEntriesByType('navigation');
    console.log('📦 Bundle info:', chunks);
  }
}

export const perfMonitor = new PerformanceMonitor();

// React component performance wrapper
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  name: string
) {
  return function PerformanceWrapper(props: T) {
    const monitor = perfMonitor.measureComponentRender(name);
    
    React.useEffect(() => {
      monitor.start();
      return () => {
        monitor.end();
      };
    });
    
    return React.createElement(Component, props);
  };
}

// Detect performance issues
export function detectPerformanceIssues() {
  const memory = (performance as any).memory;
  if (memory) {
    const used = memory.usedJSHeapSize / 1048576; // MB
    const total = memory.totalJSHeapSize / 1048576; // MB
    
    if (used / total > 0.9) {
      console.warn('⚠️ High memory usage detected:', { used, total });
    }
  }
  
  // Check for slow frames
  let lastFrameTime = performance.now();
  function checkFrameTime() {
    const now = performance.now();
    const frameDuration = now - lastFrameTime;
    
    if (frameDuration > 16.67) { // Slower than 60fps
      console.warn('🐌 Slow frame detected:', frameDuration + 'ms');
    }
    
    lastFrameTime = now;
    requestAnimationFrame(checkFrameTime);
  }
  requestAnimationFrame(checkFrameTime);
}
