import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Play, FileText, GraduationCap } from 'lucide-react';
import EngagementTracker from '@/components/EngagementTracker';
import VideoWatermark from '@/components/VideoWatermark';

export default async function StudentSessionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect('/login');

  const studentId = session.user.id;
  const item = await prisma.session.findUnique({
    where: { id },
    include: {
      accesses: {
        where: { studentId },
      },
      media: {
        orderBy: { order: 'asc' }
      },
      quiz: {
        include: {
          questions: true,
          submissions: {
            where: { studentId },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  if (!item) notFound();

  const access = item.accesses[0];
  let isLocked = access ? access.isLocked : true;
  if (access?.expiresAt && new Date() > access.expiresAt) {
    isLocked = true;
  }

  if (isLocked) {
    redirect('/');
  }

  const isCompleted = (item.quiz?.submissions?.length ?? 0) > 0;
  const score = isCompleted ? item.quiz?.submissions[0].score : null;
  const total = isCompleted ? item.quiz?.submissions[0].total : null;

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 p-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowRight className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">{item.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EngagementTracker sessionId={item.id} studentId={studentId} />
        {/* Main Content (Videos) */}
        <div className="lg:col-span-2 space-y-8">
          {item.media.filter(m => m.type === 'VIDEO').map((video) => (
             <div key={video.id} className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                   <Play className="h-5 w-5 text-blue-500" />
                   {video.name}
                </h3>
                <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group flex items-center justify-center">
                  <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
                    <VideoWatermark studentName={session.user.name} studentEmail={session.user.email} />
                  </div>
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full object-contain relative z-10"
                    controlsList="nodownload"
                  >
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>
                </div>
             </div>
          ))}

          {item.media.filter(m => m.type === 'VIDEO').length === 0 && (
             <div className="aspect-video bg-zinc-900 rounded-2xl flex flex-col items-center justify-center text-zinc-600 gap-4 border border-zinc-800 border-dashed">
                <Play className="h-16 w-16" />
                <p>لا توجد فيديوهات متاحة حالياً.</p>
             </div>
          )}

          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">عن المحاضرة</h2>
            <p className="text-zinc-400 leading-relaxed">
              {item.description || 'لا يوجد وصف متاح.'}
            </p>
          </div>
        </div>

        {/* Sidebar (PDF & Quiz) */}
        <div className="space-y-6">
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <FileText className="h-5 w-5 text-red-500" />
               المرفقات التعليمية
             </h3>
             <div className="space-y-3">
               {item.media.filter(m => m.type === 'PDF').map((pdf) => (
                  <a
                    key={pdf.id}
                    href={pdf.url}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
                         <FileText className="h-5 w-5" />
                       </div>
                       <span className="font-medium text-xs truncate max-w-[150px]">{pdf.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 -rotate-135 group-hover:translate-x-1 transition-transform" />
                  </a>
               ))}
               {item.media.filter(m => m.type === 'PDF').length === 0 && (
                  <p className="text-zinc-500 text-sm text-center">لا توجد ملفات PDF متاحة.</p>
               )}
             </div>
          </div>

          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <GraduationCap className="h-5 w-5 text-green-500" />
               الاختبار التقييمي
             </h3>

             {isCompleted ? (
                <div className="space-y-4">
                   <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <p className="text-green-500 font-bold mb-2">تم حل الاختبار!</p>
                      <div className="text-3xl font-bold text-white mb-1">{score} / {total}</div>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-zinc-800">
                      <h4 className="text-sm font-bold text-zinc-400">مراجعة الإجابات:</h4>
                      {item.quiz?.questions.map((q, idx) => {
                         const studentAnswer = JSON.parse(item.quiz?.submissions[0].answers || '[]')[idx];
                         const isCorrect = studentAnswer === q.correctAnswer;
                         const options = JSON.parse(q.options);
                         const slotLabels = ['أ', 'ب', 'ج', 'د'];

                         return (
                            <div key={q.id} className="p-3 bg-zinc-800/50 rounded-lg text-xs space-y-2 border-r-2 border-zinc-700">
                               <p className="font-bold">{idx + 1}. {q.text}</p>
                               <div className="flex flex-col gap-1">
                                  <div className={`p-2 rounded ${isCorrect ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                     إجابتك ({slotLabels[studentAnswer]}): {options[studentAnswer]}
                                  </div>
                                  {!isCorrect && (
                                     <div className="p-2 rounded bg-blue-500/10 text-blue-500">
                                        الإجابة الصحيحة ({slotLabels[q.correctAnswer]}): {options[q.correctAnswer]}
                                     </div>
                                  )}
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>
             ) : item.quiz ? (
                <Link
                  href={`/sessions/${item.id}/quiz`}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center transition-colors"
                >
                  بدء الاختبار الآن
                </Link>
             ) : (
                <p className="text-zinc-500 text-sm text-center">لا يوجد اختبار لهذه المحاضرة بعد.</p>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
