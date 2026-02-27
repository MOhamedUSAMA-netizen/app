'use client';

import { useEffect, useState } from 'react';

export default function VideoWatermark({ studentName, studentEmail }: { studentName: string, studentEmail: string }) {
  const [position, setPosition] = useState({ top: '10%', left: '10%' });

  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 80) + 10;
      const left = Math.floor(Math.random() * 80) + 10;
      setPosition({ top: `${top}%`, left: `${left}%` });
    }, 10000); // Move every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-40 text-white/20 text-[10px] md:text-xs font-mono transition-all duration-1000 select-none whitespace-nowrap"
      style={{ top: position.top, left: position.left, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
    >
      {studentName} ({studentEmail})
    </div>
  );
}
