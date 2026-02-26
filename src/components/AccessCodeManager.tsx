'use client';

import { useState } from 'react';
import { generateAccessCodesAction, deleteAccessCodeAction } from '@/lib/actions';
import { Key, Plus, Trash2, CheckCircle2, User } from 'lucide-react';

export default function AccessCodeManager({ sessionId, initialCodes }: { sessionId: string, initialCodes: any[] }) {
  const [count, setCount] = useState(10);
  const [duration, setDuration] = useState(24); // Hours
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await generateAccessCodesAction(sessionId, count, duration);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h4 className="font-bold flex items-center gap-2">
           <Key className="h-5 w-5 text-yellow-500" />
           توليد أكواد جديدة (Batch Generate)
        </h4>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs text-zinc-500 mb-1">عدد الأكواد</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              />
           </div>
           <div>
              <label className="block text-xs text-zinc-500 mb-1">المدة (بالساعات)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
              />
           </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-500 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'جاري التوليد...' : 'توليد الأكواد'}
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
         {initialCodes.map((c) => (
            <div key={c.id} className="p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg flex justify-between items-center group">
               <div>
                  <div className="font-mono font-bold text-sm tracking-widest text-yellow-500">{c.code}</div>
                  <div className="text-[10px] text-zinc-500">المدة: {c.durationHrs} ساعة</div>
               </div>

               <div className="flex items-center gap-3">
                  {c.isUsed ? (
                    <div className="flex items-center gap-1 text-[10px] text-green-500">
                       <CheckCircle2 className="h-3 w-3" />
                       <span>{c.usedBy?.name}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => deleteAccessCodeAction(c.id, sessionId)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       <Trash2 className="h-4 w-4" />
                    </button>
                  )}
               </div>
            </div>
         ))}
         {initialCodes.length === 0 && (
            <p className="text-center text-zinc-500 text-xs py-10">لا توجد أكواد مولدة لهذه المحاضرة.</p>
         )}
      </div>
    </div>
  );
}
