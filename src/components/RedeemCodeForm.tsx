'use client';

import { useState } from 'react';
import { redeemCodeAction } from '@/lib/actions';
import { Key } from 'lucide-react';

export default function RedeemCodeForm({ studentId }: { studentId: string }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setError('');

    const res = await redeemCodeAction(studentId, code);
    if (res?.error) {
      setError(res.error);
    } else {
      setCode('');
    }
    setLoading(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mb-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
         <Key className="h-5 w-5 text-yellow-500" />
         تفعيل محاضرة جديدة بالكود
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-4">
         <input
           placeholder="أدخل الكود هنا (مثال: HIST-XXX-XX-12)"
           value={code}
           onChange={(e) => setCode(e.target.value)}
           className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono tracking-widest uppercase"
         />
         <button
           type="submit"
           disabled={loading}
           className="bg-yellow-600 hover:bg-yellow-500 px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-yellow-600/20"
         >
           {loading ? 'جاري التفعيل...' : 'تفعيل'}
         </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
