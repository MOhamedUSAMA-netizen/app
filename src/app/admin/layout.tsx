import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== 'TEACHER') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-black text-white" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-l border-zinc-800 hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-500">لوحة المعلم</h1>
        </div>
        <nav className="mt-6">
          <Link href="/admin" className="flex items-center px-6 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <LayoutDashboard className="ml-3 h-5 w-5" />
            <span>الرئيسية</span>
          </Link>
          <Link href="/admin/sessions" className="flex items-center px-6 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <BookOpen className="ml-3 h-5 w-5" />
            <span>المحاضرات</span>
          </Link>
          <Link href="/admin/students" className="flex items-center px-6 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <Users className="ml-3 h-5 w-5" />
            <span>الطلاب</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-zinc-800">
          <form action={logoutAction}>
            <button className="flex items-center text-red-500 hover:text-red-400 transition-colors w-full">
              <LogOut className="ml-3 h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Navigation */}
        <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-50">
           <h1 className="text-lg font-bold text-blue-500">لوحة المعلم</h1>
           <div className="flex gap-4">
              <Link href="/admin" className="p-2 text-zinc-400 hover:text-white"><LayoutDashboard className="h-5 w-5" /></Link>
              <Link href="/admin/sessions" className="p-2 text-zinc-400 hover:text-white"><BookOpen className="h-5 w-5" /></Link>
              <Link href="/admin/students" className="p-2 text-zinc-400 hover:text-white"><Users className="h-5 w-5" /></Link>
           </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
