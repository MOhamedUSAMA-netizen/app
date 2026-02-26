import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Lock, Unlock, PlayCircle, FileText, GraduationCap, ChevronLeft, LogOut, Clock } from 'lucide-react';
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
  const sessions = await prisma.session.findMany({
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

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-12" dir="rtl">
      <header className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl font-bold">مرحباً، {session.user.name} 👋</h1>
          <p className="text-zinc-500 mt-2">استكمل رحلتك التعليمية في الدراسات الاجتماعية</p>
        </div>
        <form action={logoutAction}>
          <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
            <LogOut className="h-6 w-6" />
          </button>
        </form>
      </header>

      <RedeemCodeForm studentId={studentId} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((item, index) => {
          const access = item.accesses[0];
          // Check for expiration
          let isLocked = access ? access.isLocked : true;
          if (access?.expiresAt && new Date() > access.expiresAt) {
            isLocked = true;
          }
          const isCompleted = (item.quiz?.submissions?.length ?? 0) > 0;

          return (
            <div
              key={item.id}
              className={`relative rounded-2xl border transition-all duration-300 ${
                isLocked
                ? 'bg-zinc-900/50 border-zinc-800 grayscale opacity-80'
                : 'bg-zinc-900 border-zinc-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10'
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

                <div className="flex items-center gap-4 mb-8 text-zinc-400">
                   <div className="flex items-center gap-1 text-xs">
                      <PlayCircle className="h-4 w-4" />
                      <span>فيديو</span>
                   </div>
                   <div className="flex items-center gap-1 text-xs">
                      <FileText className="h-4 w-4" />
                      <span>PDF</span>
                   </div>
                   <div className="flex items-center gap-1 text-xs">
                      <GraduationCap className="h-4 w-4" />
                      <span>اختبار</span>
                   </div>
                </div>

                {isLocked ? (
                  <button className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 font-bold cursor-not-allowed">
                    مغلق حالياً
                  </button>
                ) : (
                  <Link
                    href={`/sessions/${item.id}`}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center transition-colors group"
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
          <p className="text-zinc-500">لا توجد محاضرات متاحة لك حالياً. سيقوم المعلم بإضافتها قريباً.</p>
        </div>
      )}
    </div>
  );
}
