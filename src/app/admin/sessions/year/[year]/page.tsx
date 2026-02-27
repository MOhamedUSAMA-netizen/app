import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Trash2, Video, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

async function createSession(year: string, formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  await prisma.session.create({
    data: {
      title,
      description,
      level: year,
      order: 0,
    },
  });
  revalidatePath(`/admin/sessions/year/${year}`);
}

async function deleteSession(year: string, id: string) {
  'use server';
  await prisma.session.delete({
    where: { id },
  });
  revalidatePath(`/admin/sessions/year/${year}`);
}

export default async function AdminYearSessionsPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;

  if (!['1', '2', '3'].includes(year)) notFound();

  const sessions = await prisma.session.findMany({
    where: { level: year },
    orderBy: { createdAt: 'desc' },
    include: {
      quiz: true,
      media: true,
    },
  });

  const yearNames: { [key: string]: string } = {
    '1': 'الصف الأول الثانوي',
    '2': 'الصف الثاني الثانوي',
    '3': 'الصف الثالث الثانوي'
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/sessions" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <ArrowRight className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl font-bold">{yearNames[year]}</h2>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4 text-blue-500">إضافة محاضرة جديدة</h3>
        <form action={createSession.bind(null, year)} className="flex flex-col md:flex-row gap-4">
          <input
            name="title"
            placeholder="عنوان المحاضرة"
            required
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="description"
            placeholder="وصف بسيط (اختياري)"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all group">
            <div className="p-6">
              <h4 className="text-xl font-bold mb-2">{session.title}</h4>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{session.description || 'لا يوجد وصف'}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-2 rounded-lg ${session.media.some(m => m.type === 'VIDEO') ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  <Video className="h-5 w-5" />
                </div>
                <div className={`p-2 rounded-lg ${session.media.some(m => m.type === 'PDF') ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className={`p-2 rounded-lg ${session.quiz ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  <HelpCircle className="h-5 w-5" />
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/sessions/${session.id}`}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-center py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  تعديل المحتوى
                </Link>
                <form action={deleteSession.bind(null, year, session.id)}>
                   <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                     <Trash2 className="h-5 w-5" />
                   </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed">
          <p className="text-zinc-500">لا توجد محاضرات في هذا المجلد بعد.</p>
        </div>
      )}
    </div>
  );
}
