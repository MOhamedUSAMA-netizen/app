import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import QuizPlayer from '@/components/QuizPlayer';

export default async function StudentQuizPage({ params }: { params: Promise<{ id: string }> }) {
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
          questions: true,
          submissions: {
            where: { studentId },
          }
        }
      }
    }
  });

  if (!item || !item.quiz) notFound();

  const access = item.accesses[0];
  let isLocked = access ? access.isLocked : true;
  if (access?.expiresAt && new Date() > access.expiresAt) {
    isLocked = true;
  }

  if (isLocked || item.quiz.submissions.length > 0) {
    redirect(`/sessions/${id}`);
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12" dir="rtl">
       <QuizPlayer quiz={item.quiz} studentId={studentId} sessionId={id} />
    </div>
  );
}
