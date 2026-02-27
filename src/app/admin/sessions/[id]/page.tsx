import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Video, FileText, HelpCircle, ArrowRight, Save, Key } from 'lucide-react';
import Link from 'next/link';
import QuizBuilder from '@/components/QuizBuilder';
import AccessCodeManager from '@/components/AccessCodeManager';
import MediaManager from '@/components/MediaManager';
import { addMediaAction, deleteMediaAction } from '@/lib/actions';

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      quiz: {
        include: { questions: true }
      },
      media: {
        orderBy: { order: 'asc' }
      },
      accessCodes: {
        include: { usedBy: true },
        orderBy: { createdAt: 'desc' }
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
              محتوى المحاضرة (فيديوهات وملفات)
            </h3>

            <MediaManager sessionId={id} initialMedia={session.media} />
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

          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Key className="ml-2 h-5 w-5 text-yellow-500" />
              أكواد الوصول (Access Codes)
            </h3>

            <AccessCodeManager sessionId={id} initialCodes={session.accessCodes} />
          </div>
        </div>
      </div>
    </div>
  );
}
