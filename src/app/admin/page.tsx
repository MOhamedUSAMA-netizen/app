import { prisma } from '@/lib/prisma';
import { Users, BookOpen, GraduationCap, PlayCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } });
  const sessionCount = await prisma.session.count();
  const submissionCount = await prisma.submission.count();
  const totalEngagement = await prisma.videoEngagement.aggregate({
    _sum: { watched: true }
  });
  const totalMinutes = Math.round((totalEngagement._sum.watched || 0) / 60);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">نظرة عامة</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الطلاب" value={studentCount} icon={<Users className="h-6 w-6" />} color="bg-blue-500" />
        <StatCard title="المحاضرات" value={sessionCount} icon={<BookOpen className="h-6 w-6" />} color="bg-purple-500" />
        <StatCard title="الاختبارات المكتملة" value={submissionCount} icon={<GraduationCap className="h-6 w-6" />} color="bg-green-500" />
        <StatCard title="تفاعل الفيديوهات" value={`${totalMinutes} د`} icon={<PlayCircle className="h-6 w-6" />} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-4">المحاضرات (إدارة الأكواد)</h3>
          <div className="space-y-3">
             {/* Shortcut to session codes */}
             {await prisma.session.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).then(sessions => sessions.map(s => (
                <Link
                  key={s.id}
                  href={`/admin/sessions/${s.id}`}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                   <span className="font-medium">{s.title}</span>
                   <span className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                      إدارة الأكواد
                      <ArrowRight className="h-3 w-3 -rotate-180" />
                   </span>
                </Link>
             )))}
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-4">أحدث الطلاب المسجلين</h3>
          <div className="space-y-4">
             {/* Simple list of recent students */}
             <p className="text-zinc-500 text-sm">سيظهر هنا قائمة بالطلاب الذين سجلوا مؤخراً.</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-4">آخر النشاطات</h3>
          <div className="space-y-4">
             <p className="text-zinc-500 text-sm">سيظهر هنا آخر الاختبارات التي قام الطلاب بحلها.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
