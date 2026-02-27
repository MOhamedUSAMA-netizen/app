import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Folder, ChevronLeft, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions';
import RedeemCodeForm from '@/components/RedeemCodeForm';

export default async function StudentHome() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role === 'TEACHER') {
    redirect('/admin');
  }

  const studentId = session.user.id;

  const years = [
    { id: '1', name: 'الصف الأول الثانوي', desc: 'محاضرات ومذكرات السنة الأولى' },
    { id: '2', name: 'الصف الثاني الثانوي', desc: 'محاضرات ومذكرات السنة الثانية' },
    { id: '3', name: 'الصف الثالث الثانوي', desc: 'محاضرات ومذكرات السنة الثالثة' },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-12" dir="rtl">
      <header className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl font-bold">مرحباً، {session.user.name} 👋</h1>
          <p className="text-zinc-500 mt-2">اختر السنة الدراسية للوصول إلى المحاضرات</p>
        </div>
        <form action={logoutAction}>
          <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
            <LogOut className="h-6 w-6" />
          </button>
        </form>
      </header>

      <RedeemCodeForm studentId={studentId} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {years.map((year) => (
          <Link
            key={year.id}
            href={`/year/${year.id}`}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="mb-6 inline-flex p-4 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
              <Folder className="h-10 w-10" fill="currentColor" fillOpacity={0.2} />
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{year.name}</h3>
            <p className="text-zinc-500 text-sm mb-8">{year.desc}</p>

            <div className="flex items-center text-zinc-400 font-bold group-hover:text-white transition-colors">
              دخول
              <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
