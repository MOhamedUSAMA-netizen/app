import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { User, Lock, Unlock, GraduationCap, History } from 'lucide-react';
import { revalidatePath } from 'next/cache';

async function toggleAccess(studentId: string, sessionId: string, currentlyLocked: boolean) {
  'use server';
  await prisma.studentAccess.upsert({
    where: {
      studentId_sessionId: { studentId, sessionId },
    },
    update: {
      isLocked: !currentlyLocked,
    },
    create: {
      studentId,
      sessionId,
      isLocked: !currentlyLocked,
    },
  });
  revalidatePath(`/admin/students/${studentId}`);
}

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      submissions: {
        include: { quiz: { include: { session: true } } },
        orderBy: { createdAt: 'desc' }
      },
      accesses: true,
      engagements: true,
    }
  });

  if (!student) notFound();

  const sessions = await prisma.session.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-6 items-center">
        <div className="h-24 w-24 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center">
          <User className="h-12 w-12" />
        </div>
        <div className="text-center md:text-right flex-1">
          <h2 className="text-3xl font-bold">{student.name}</h2>
          <p className="text-zinc-500">{student.email}</p>
        </div>
        <div className="flex gap-4">
           <div className="text-center bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 min-w-[120px]">
              <div className="text-2xl font-bold">
                 {Math.round(student.engagements.reduce((acc, e) => acc + e.watched, 0) / 60)}
              </div>
              <div className="text-xs text-zinc-500">دقيقة مشاهدة</div>
           </div>
           <div className="text-center bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 min-w-[120px]">
              <div className="text-2xl font-bold">{student.submissions.length}</div>
              <div className="text-xs text-zinc-500">اختبار منجز</div>
           </div>
           <div className="text-center bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 min-w-[120px]">
              <div className="text-2xl font-bold">
                 {student.submissions.length > 0
                   ? Math.round(student.submissions.reduce((acc, s) => acc + (s.score/s.total), 0) / student.submissions.length * 100)
                   : 0}%
              </div>
              <div className="text-xs text-zinc-500">متوسط الدرجات</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Access Control */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            التحكم في الوصول للمحاضرات
          </h3>
          <div className="space-y-3">
            {sessions.map((session) => {
              const access = student.accesses.find(a => a.sessionId === session.id);
              const isLocked = access ? access.isLocked : true; // Default to locked

              return (
                <div key={session.id} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                  <span className="font-medium">{session.title}</span>
                  <form action={toggleAccess.bind(null, student.id, session.id, isLocked)}>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        isLocked
                        ? 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                        : 'bg-green-600/20 text-green-500 hover:bg-green-600/30'
                      }`}
                    >
                      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      {isLocked ? 'مغلق' : 'مفتوح'}
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-green-500" />
            نتائج الاختبارات
          </h3>
          <div className="space-y-4">
            {student.submissions.map((sub) => (
              <div key={sub.id} className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                <div className="flex justify-between items-start mb-2">
                   <div className="font-bold">{sub.quiz.session.title}</div>
                   <div className="text-sm font-mono text-blue-500">{sub.score} / {sub.total}</div>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                   <div
                    className={`h-full ${sub.score/sub.total > 0.5 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${(sub.score/sub.total)*100}%` }}
                   ></div>
                </div>
                <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
                   <History className="h-3 w-3" />
                   {sub.createdAt.toLocaleString('ar-EG')}
                </div>
              </div>
            ))}
            {student.submissions.length === 0 && (
              <p className="text-center text-zinc-500 py-10">لا توجد نتائج اختبارات لهذا الطالب بعد.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
