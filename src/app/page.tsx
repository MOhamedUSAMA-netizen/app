import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions';
import RedeemCodeForm from '@/components/RedeemCodeForm';
import FolderCard from '@/components/FolderCard';
import FadeIn from '@/components/FadeIn';

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
    <div className="min-h-screen text-white px-4 py-8 md:px-16" dir="rtl">
      <FadeIn>
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">مرحباً، {session.user.name} 👋</h1>
            <p className="text-zinc-500 mt-3 text-lg">مرحباً بك في بوابتك التعليمية لمادة الدراسات الاجتماعية</p>
          </div>
          <form action={logoutAction}>
            <button className="p-3 glass rounded-2xl text-zinc-500 hover:text-red-500 transition-all duration-300 hover:scale-110">
              <LogOut className="h-6 w-6" />
            </button>
          </form>
        </header>
      </FadeIn>

      <FadeIn delay={0.2}>
        <RedeemCodeForm studentId={studentId} />
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
        {years.map((year, idx) => (
          <FolderCard
            key={year.id}
            id={year.id}
            name={year.name}
            desc={year.desc}
            href={`/year/${year.id}`}
          />
        ))}
      </div>

      {/* Subtle decorative background */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[10%] right-[10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
