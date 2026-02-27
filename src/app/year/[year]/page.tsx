import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Lock, Unlock, PlayCircle, FileText, GraduationCap, ChevronLeft, ArrowRight, Clock } from 'lucide-react';

export default async function StudentYearSessionsPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  if (!['1', '2', '3'].includes(year)) notFound();

  const session = await getSession();
  if (!session) redirect('/login');

  const studentId = session.user.id;
  const sessions = await prisma.session.findMany({
    where: { level: year },
    orderBy: { order: 'asc' },
    include: {
      accesses: {
        where: { studentId },
      },
      quiz: {
        include: {
          submissions: {
            where: { studentId },
          }
        }
      }
    },
  });

  const yearNames: { [key: string]: string } = {
    '1': 'الصف الأول الثانوي',
    '2': 'الصف الثاني الثانوي',
    '3': 'الصف الثالث الثانوي'
  };

  return (
    <div className="min-h-screen text-white px-4 py-12 md:px-16" dir="rtl">
      <header className="flex items-center gap-6 mb-16">
        <Link href="/" className="p-3 glass rounded-2xl hover:bg-blue-600/20 transition-all hover:scale-110">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold">{yearNames[year]}</h1>
          <p className="text-zinc-500 mt-2">تصفح المحاضرات المتاحة لك في هذا العام</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sessions.map((item, index) => {
          const access = item.accesses[0];
          let isLocked = access ? access.isLocked : true;
          if (access?.expiresAt && new Date() > access.expiresAt) {
            isLocked = true;
          }
          const isCompleted = (item.quiz?.submissions?.length ?? 0) > 0;

          return (
            <div
              key={item.id}
              className={`relative rounded-[2rem] border transition-all duration-500 ${
                isLocked
                ? 'bg-zinc-900/50 border-zinc-800/50 grayscale opacity-70'
                : 'glass-card border-zinc-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    المحاضرة {index + 1}
                  </span>
                  {isLocked ? (
                    <div className="p-2 bg-zinc-800 rounded-lg text-zinc-500">
                      <Lock className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                      <Unlock className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                {access?.expiresAt && !isLocked && (
                  <div className="flex items-center gap-1 text-[10px] text-yellow-500 mb-2 font-bold">
                    <Clock className="h-3 w-3" />
                    <span>ينتهي في: {access.expiresAt.toLocaleString('ar-EG')}</span>
                  </div>
                )}
                <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{item.description}</p>

                {isLocked ? (
                  <button className="w-full py-4 rounded-2xl bg-zinc-800/50 text-zinc-500 font-bold cursor-not-allowed border border-zinc-800">
                    المحاضرة مغلقة
                  </button>
                ) : (
                  <Link
                    href={`/sessions/${item.id}`}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center transition-all duration-300 group shadow-lg shadow-blue-600/20"
                  >
                    دخول المحاضرة
                    <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                )}

                {isCompleted && (
                  <div className="absolute -top-2 -left-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-zinc-800">
          <p className="text-zinc-500">لا توجد محاضرات متاحة في هذه السنة حالياً.</p>
        </div>
      )}
    </div>
  );
}
