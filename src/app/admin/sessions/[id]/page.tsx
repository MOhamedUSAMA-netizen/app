import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Video, FileText, HelpCircle, ArrowRight, Save } from 'lucide-react';
import Link from 'next/link';
import QuizBuilder from '@/components/QuizBuilder';
import { updateSessionContentAction } from '@/lib/actions';

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      quiz: {
        include: { questions: true }
      }
    }
  });

  if (!session) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/sessions" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl font-bold">{session.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Media Section */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Video className="ml-2 h-5 w-5 text-blue-500" />
              محتوى الفيديو والملفات
            </h3>

            <form action={updateSessionContentAction.bind(null, id)} className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">محتوى الفيديو</label>
                  <input
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-500 hover:file:bg-blue-600/30 mb-2"
                  />
                  <input
                    name="videoUrl"
                    defaultValue={session.videoUrl || ''}
                    placeholder="أو رابط فيديو خارجي"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="videoName"
                    defaultValue={session.videoName || ''}
                    placeholder="اسم الفيديو"
                    className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">ملف PDF</label>
                  <input
                    type="file"
                    name="pdfFile"
                    accept=".pdf"
                    className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600/20 file:text-red-500 hover:file:bg-red-600/30 mb-2"
                  />
                  <input
                    name="pdfUrl"
                    defaultValue={session.pdfUrl || ''}
                    placeholder="أو رابط ملف خارجي"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="pdfName"
                    defaultValue={session.pdfName || ''}
                    placeholder="اسم الملف"
                    className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold flex items-center justify-center transition-colors"
              >
                <Save className="ml-2 h-5 w-5" />
                حفظ التغييرات
              </button>
            </form>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <HelpCircle className="ml-2 h-5 w-5 text-green-500" />
              إدارة الاختبار (Quiz)
            </h3>

            <QuizBuilder sessionId={id} initialQuiz={session.quiz} />
          </div>
        </div>
      </div>
    </div>
  );
}
