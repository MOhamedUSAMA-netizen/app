'use client';

import { useState } from 'react';
import { addMediaAction, deleteMediaAction } from '@/lib/actions';
import { Video, FileText, Plus, Trash2, Link as LinkIcon, Upload } from 'lucide-react';

export default function MediaManager({ sessionId, initialMedia }: { sessionId: string, initialMedia: any[] }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('VIDEO');

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addMediaAction(sessionId, formData);
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6">
      {/* List of existing media */}
      <div className="space-y-3">
        {initialMedia.map((m) => (
          <div key={m.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${m.type === 'VIDEO' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}`}>
                {m.type === 'VIDEO' ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div>
                 <div className="text-sm font-bold">{m.name}</div>
                 <div className="text-[10px] text-zinc-500 truncate max-w-[200px]">{m.url}</div>
              </div>
            </div>
            <button
              onClick={() => deleteMediaAction(m.id, sessionId)}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Form to add new media */}
      <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
        <h4 className="font-bold text-zinc-300">إضافة فيديو أو ملف جديد</h4>

        <div className="flex gap-2">
           <button
             type="button"
             onClick={() => setType('VIDEO')}
             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'VIDEO' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
           >فيديو</button>
           <button
             type="button"
             onClick={() => setType('PDF')}
             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'PDF' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
           >PDF</button>
        </div>

        <input type="hidden" name="type" value={type} />

        <div className="space-y-4">
           <div>
              <label className="block text-xs text-zinc-500 mb-1">اسم المرفق</label>
              <input name="name" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" placeholder="مثلاً: شرح الجزء الأول" />
           </div>

           <div className="p-4 bg-zinc-800/50 border border-zinc-700 border-dashed rounded-lg space-y-4 text-center">
              <div>
                 <label className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-all">
                    <Upload className="h-4 w-4" />
                    اختيار ملف من الجهاز
                    <input type="file" name="file" className="hidden" accept={type === 'VIDEO' ? 'video/*' : '.pdf'} />
                 </label>
                 <p className="text-[10px] text-zinc-500 mt-2">أو ضع رابطاً مباشراً بالأسفل</p>
              </div>
              <input name="url" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" placeholder="رابط خارجي (اختياري)" />
           </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'جاري الرفع...' : <><Plus className="h-5 w-5" /> إضافة المرفق</>}
        </button>
      </form>
    </div>
  );
}
