'use client';

import Link from 'next/link';
import { LogIn, UserPlus, LayoutDashboard, LogOut, BookOpen } from 'lucide-react';
import { logoutAction } from '@/lib/actions';

export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="fixed top-0 w-full z-[100] glass border-b border-white/5 py-4 px-6 md:px-16 flex justify-between items-center backdrop-blur-xl">
      <Link href="/" className="text-2xl font-black tracking-tighter text-blue-500">منصة التاريخ</Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link
              href={session.user.role === 'TEACHER' ? '/admin' : '/dashboard'}
              className="px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4 text-blue-500" />
              لوحة التحكم
            </Link>
            <form action={logoutAction}>
               <button className="px-5 py-2.5 rounded-xl text-zinc-500 hover:text-red-500 transition-all">
                  <LogOut className="h-5 w-5" />
               </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/5 transition-all flex items-center gap-2 text-zinc-300">
               <LogIn className="h-4 w-4" />
               تسجيل الدخول
            </Link>
            <Link href="/register" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
               <UserPlus className="h-4 w-4" />
               إنشاء حساب
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
