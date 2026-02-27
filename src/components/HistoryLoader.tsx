'use client';

import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function HistoryLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Compass className="h-24 w-24 text-blue-500/20" strokeWidth={1} />
        <motion.div
          animate={{ rotate: [0, 90, 45, 180, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
           <div className="h-12 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
        </motion.div>
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-bold tracking-widest text-blue-500 mb-2">جاري استكشاف المحتوى</h2>
        <div className="flex gap-1 justify-center">
           {[0, 1, 2].map((i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
               className="h-1.5 w-1.5 rounded-full bg-blue-500"
             />
           ))}
        </div>
      </div>
    </div>
  );
}
