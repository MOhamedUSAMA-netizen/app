import Link from 'next/link';
import { Folder, ChevronLeft } from 'lucide-react';

export default async function AdminSessionsPage() {
  const years = [
    { id: '1', name: 'الصف الأول الثانوي', desc: 'إدارة محاضرات السنة الأولى' },
    { id: '2', name: 'الصف الثاني الثانوي', desc: 'إدارة محاضرات السنة الثانية' },
    { id: '3', name: 'الصف الثالث الثانوي', desc: 'إدارة محاضرات السنة الثالثة' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">إدارة المحاضرات</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {years.map((year) => (
          <Link
            key={year.id}
            href={`/admin/sessions/year/${year.id}`}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="mb-6 inline-flex p-4 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
              <Folder className="h-10 w-10" fill="currentColor" fillOpacity={0.2} />
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{year.name}</h3>
            <p className="text-zinc-500 text-sm mb-8">{year.desc}</p>

            <div className="flex items-center text-zinc-400 font-bold group-hover:text-white transition-colors">
              فتح المجلد
              <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
