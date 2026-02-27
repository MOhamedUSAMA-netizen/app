'use client';

import { motion } from 'framer-motion';
import { Folder, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function FolderCard({ id, name, desc, href }: { id: string, name: string, desc: string, href: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link href={href}>
        <div className="relative glass-card rounded-[2rem] p-8 overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-blue-500/50 group">
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors" />

          <div className="mb-8 relative">
            <div className="h-16 w-20 bg-blue-600/20 rounded-xl relative overflow-hidden flex items-center justify-center">
               <Folder className="h-10 w-10 text-blue-500" fill="currentColor" fillOpacity={0.1} />
               {/* 3D Tab effect */}
               <div className="absolute top-0 left-2 right-2 h-1 bg-blue-500/50 rounded-full" />
            </div>
            {/* Dynamic level badge */}
            <div className="absolute top-0 left-0 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {id}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{name}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-10 flex-grow">{desc}</p>

          <div className="flex items-center justify-between mt-auto">
             <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-blue-500 transition-colors">فتح الأرشيف</span>
             <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 group-hover:-translate-x-2">
                <ChevronLeft className="h-5 w-5 text-white" />
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
