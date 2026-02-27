'use client';

import { useEffect, useState, useRef } from 'react';

export default function VideoWatermark({ studentName, studentEmail }: { studentName: string, studentEmail: string }) {
  const [position, setPosition] = useState({ top: '10%', left: '10%' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 80) + 10;
      const left = Math.floor(Math.random() * 80) + 10;
      setPosition({ top: `${top}%`, left: `${left}%` });
    }, 10000);

    // This ensures that even if parent goes full screen via standard browser methods,
    // we try to stay visible if the parent is the one we are in.
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-[9999] text-red-600/40 text-[12px] md:text-sm font-bold transition-all duration-1000 select-none whitespace-nowrap"
      style={{ top: position.top, left: position.left, textShadow: '0 0 1px rgba(0,0,0,0.5)' }}
    >
      {studentName} ({studentEmail})
    </div>
  );
}
