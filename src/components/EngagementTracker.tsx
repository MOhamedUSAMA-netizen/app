'use client';

import { useEffect, useRef } from 'react';
import { trackEngagementAction } from '@/lib/actions';

export default function EngagementTracker({ sessionId, studentId }: { sessionId: string, studentId: string }) {
  const lastTracked = useRef<number>(0);

  useEffect(() => {
    lastTracked.current = Date.now();

    const interval = setInterval(async () => {
      const now = Date.now();
      // Track every 30 seconds
      if (now - lastTracked.current >= 30000) {
        await trackEngagementAction(sessionId, studentId, 30);
        lastTracked.current = now;
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionId, studentId]);

  return null; // Invisible component
}
