import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions';

function AdminNavLink({ href, icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center px-6 py-4 text-zinc-400 hover:bg-blue-600/10 hover:text-blue-500 rounded-2xl transition-all duration-300 group"
    >
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="font-bold">{label}</span>
    </Link>
  );
}

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
      <aside className="w-72 glass border-l border-zinc-800 hidden md:block relative z-50">
        <div className="p-8">
          <h1 className="text-2xl font-black text-blue-500 flex items-center gap-3">
            لوحة المعلم
            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-md">PRO</span>
          </h1>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          <AdminNavLink href="/admin" icon={<LayoutDashboard className="ml-3 h-5 w-5" />} label="الرئيسية" />
          <AdminNavLink href="/admin/sessions" icon={<BookOpen className="ml-3 h-5 w-5" />} label="المحاضرات" />
          <AdminNavLink href="/admin/students" icon={<Users className="ml-3 h-5 w-5" />} label="الطلاب" />
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
