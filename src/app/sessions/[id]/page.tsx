import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Play, FileText, GraduationCap } from 'lucide-react';
import EngagementTracker from '@/components/EngagementTracker';

export default async function StudentSessionDetail({ params }: { params: { id: string } }) {
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
      quiz: {
        include: {
          submissions: {
            where: { studentId },
          }
        }
      }
    }
  });

  if (!item) notFound();

  const access = item.accesses[0];
  const isLocked = access ? access.isLocked : true;

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
            <Link href="/" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowRight className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">{item.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EngagementTracker sessionId={item.id} studentId={studentId} />
        {/* Main Content (Video) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster="/video-placeholder.jpg"
              >
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                <Play className="h-16 w-16" />
                <p>لا يوجد فيديو متاح لهذه المحاضرة حالياً.</p>
              </div>
            )}
          </div>

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
             {item.pdfUrl ? (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
                       <FileText className="h-5 w-5" />
                     </div>
                     <span className="font-medium text-sm">{item.pdfName || 'مذكرة المحاضرة'}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 -rotate-135 group-hover:translate-x-1 transition-transform" />
                </a>
             ) : (
                <p className="text-zinc-500 text-sm text-center">لا توجد ملفات PDF متاحة.</p>
             )}
          </div>

          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <GraduationCap className="h-5 w-5 text-green-500" />
               الاختبار التقييمي
             </h3>

             {isCompleted ? (
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                   <p className="text-green-500 font-bold mb-2">تم حل الاختبار بنجاح!</p>
                   <div className="text-3xl font-bold text-white mb-1">{score} / {total}</div>
                   <p className="text-xs text-zinc-500">تم حل الاختبار في {item.quiz?.submissions[0].createdAt.toLocaleDateString('ar-EG')}</p>
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
