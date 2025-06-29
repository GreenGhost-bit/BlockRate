// hooks/use-performance-monitor.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  transactionSpeed: number;
  userInteractions: number;
  errorCount: number;
  memoryUsage: number;
  networkLatency: number;
}

interface TransactionMetric {
  id: string;
  type: 'review' | 'reward' | 'governance';
  startTime: number;
  endTime: number;
  duration: number;
  status: 'success' | 'failed' | 'pending';
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'input' | 'navigation';
  timestamp: number;
  element: string;
  duration?: number;
}

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  context?: Record<string, any>;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    transactionSpeed: 0,
    userInteractions: 0,
    errorCount: 0,
    memoryUsage: 0,
    networkLatency: 0
  });

  const [transactions, setTransactions] = useState<TransactionMetric[]>([]);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  
  const startTimeRef = useRef<number>(Date.now());
  const interactionCountRef = useRef<number>(0);

  const measurePageLoad = useCallback(() => {
    if (typeof window !== 'undefined') {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
      }
    }
  }, []);

  const startTransaction = useCallback((type: TransactionMetric['type'], id: string) => {
    const transaction: TransactionMetric = {
      id,
      type,
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
      status: 'pending'
    };
    setTransactions(prev => [...prev, transaction]);
    return id;
  }, []);

  const endTransaction = useCallback((id: string, status: 'success' | 'failed') => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === id) {
        const endTime = Date.now();
        const duration = endTime - tx.startTime;
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          transactionSpeed: (prevMetrics.transactionSpeed + duration) / 2
        }));
        return { ...tx, endTime, duration, status };
      }
      return tx;
    }));
  }, []);

  const trackInteraction = useCallback((type: UserInteraction['type'], element: string, duration?: number) => {
    const interaction: UserInteraction = {
      type,
      timestamp: Date.now(),
      element,
      duration
    };
    
    setInteractions(prev => [...prev.slice(-99), interaction]);
    interactionCountRef.current += 1;
    setMetrics(prev => ({ ...prev, userInteractions: interactionCountRef.current }));
  }, []);

  const logError = useCallback((message: string, level: 'error' | 'warning' | 'info' = 'error', context?: Record<string, any>) => {
    const error: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      timestamp: Date.now(),
      level,
      context
    };

    setErrors(prev => [...prev.slice(-49), error]);
    
    if (level === 'error') {
      setMetrics(prev => ({ ...prev, errorCount: prev.errorCount + 1 }));
    }
  }, []);

  const measureNetworkLatency = useCallback(async (url: string = '/api/health') => {
    try {
      const start = Date.now();
      await fetch(url, { method: 'HEAD' });
      const latency = Date.now() - start;
      setMetrics(prev => ({ ...prev, networkLatency: latency }));
      return latency;
    } catch (error) {
      logError(`Network latency measurement failed: ${error}`, 'warning');
      return null;
    }
  }, [logError]);

  const getMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
      return usedMB;
    }
    return null;
  }, []);

  const getAverageTransactionTime = useCallback((type?: TransactionMetric['type']) => {
    const completedTransactions = transactions.filter(tx => 
      tx.status !== 'pending' && (!type || tx.type === type)
    );
    
    if (completedTransactions.length === 0) return 0;
    
    const totalTime = completedTransactions.reduce((sum, tx) => sum + tx.duration, 0);
    return totalTime / completedTransactions.length;
  }, [transactions]);

  const getSuccessRate = useCallback((type?: TransactionMetric['type']) => {
    const relevantTransactions = transactions.filter(tx => 
      tx.status !== 'pending' && (!type || tx.type === type)
    );
    
    if (relevantTransactions.length === 0) return 100;
    
    const successfulTransactions = relevantTransactions.filter(tx => tx.status === 'success');
    return (successfulTransactions.length / relevantTransactions.length) * 100;
  }, [transactions]);

  const getRecentInteractions = useCallback((minutes: number = 5) => {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return interactions.filter(interaction => interaction.timestamp > cutoff);
  }, [interactions]);

  const exportMetrics = useCallback(() => {
    return {
      metrics,
      transactions,
      interactions: interactions.slice(-100),
      errors: errors.slice(-50),
      timestamp: Date.now(),
      sessionDuration: Date.now() - startTimeRef.current
    };
  }, [metrics, transactions, interactions, errors]);

  const clearMetrics = useCallback(() => {
    setTransactions([]);
    setInteractions([]);
    setErrors([]);
    interactionCountRef.current = 0;
    setMetrics({
      pageLoadTime: 0,
      transactionSpeed: 0,
      userInteractions: 0,
      errorCount: 0,
      memoryUsage: 0,
      networkLatency: 0
    });
  }, []);

  useEffect(() => {
    measurePageLoad();
    
    const handleError = (event: ErrorEvent) => {
      logError(event.message, 'error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError(`Unhandled promise rejection: ${event.reason}`, 'error');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    const memoryInterval = setInterval(getMemoryUsage, 30000);
    const networkInterval = setInterval(() => measureNetworkLatency(), 60000);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(memoryInterval);
      clearInterval(networkInterval);
    };
  }, [measurePageLoad, logError, getMemoryUsage, measureNetworkLatency]);

  return {
    metrics,
    transactions,
    interactions,
    errors,
    startTransaction,
    endTransaction,
    trackInteraction,
    logError,
    measureNetworkLatency,
    getMemoryUsage,
    getAverageTransactionTime,
    getSuccessRate,
    getRecentInteractions,
    exportMetrics,
    clearMetrics
  };
}