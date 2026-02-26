import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { User, Search, Eye } from 'lucide-react';

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    include: {
      submissions: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">إدارة الطلاب</h2>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <Search className="h-5 w-5 text-zinc-500" />
          <input
            placeholder="البحث عن طالب..."
            className="bg-transparent border-none outline-none text-white w-full"
          />
        </div>

        <table className="w-full text-right">
          <thead>
            <tr className="bg-zinc-800/30 text-zinc-400 text-sm">
              <th className="px-6 py-4 font-medium">الطالب</th>
              <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
              <th className="px-6 py-4 font-medium">الاختبارات المنجزة</th>
              <th className="px-6 py-4 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold">{student.name}</div>
                      <div className="text-zinc-500 text-sm">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">
                  {student.createdAt.toLocaleDateString('ar-EG')}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                    {student.submissions.length} اختبارات
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/students/${student.id}`}
                    className="text-blue-500 hover:text-blue-400 flex items-center gap-1 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    التفاصيل والتحكم
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            لا يوجد طلاب مسجلين حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
