import { useState, useEffect } from 'react';
import { processPendingFeedbacks, getPendingFeedbacksCount } from '@/services/feedbackService';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Connection restored');
      setIsOnline(true);
      // Process pending feedbacks when coming back online
      processPendingFeedbacks().then(() => {
        setPendingCount(getPendingFeedbacksCount());
      });
    };

    const handleOffline = () => {
      console.log('Connection lost');
      setIsOnline(false);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending feedbacks on mount
    setPendingCount(getPendingFeedbacksCount());

    // Process pending feedbacks if online
    if (isOnline) {
      processPendingFeedbacks().then(() => {
        setPendingCount(getPendingFeedbacksCount());
      });
    }

    // Set up periodic check for pending feedbacks
    const interval = setInterval(() => {
      if (isOnline) {
        processPendingFeedbacks().then(() => {
          setPendingCount(getPendingFeedbacksCount());
        });
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  return {
    isOnline,
    pendingCount,
    refreshPendingCount: () => setPendingCount(getPendingFeedbacksCount())
  };
};
