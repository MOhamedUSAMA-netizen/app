import Link from 'next/link';
import { MessageCircle, BookOpen, GraduationCap, Clock } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/auth';

export default async function LandingPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen text-white bg-black selection:bg-blue-600/30" dir="rtl">
      <Navbar session={session} />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
         <div className="max-w-6xl mx-auto text-center space-y-8">
            <FadeIn>
               <span className="px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-500 text-xs font-black uppercase tracking-widest border border-blue-600/20">
                  مرحباً بكم في منصة التفوق
               </span>
            </FadeIn>

            <FadeIn delay={0.2}>
               <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
                  تعلم التاريخ <br />
                  <span className="text-blue-500 italic">بأسلوب عصري وممتع</span>
               </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
               <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl leading-relaxed">
                  أفضل الدورات التعليمية للمرحلة الثانوية بأسلوب مبسط وشرح وافي، نعدك بالوصول إلى الدرجة النهائية بإذن الله.
               </p>
            </FadeIn>

            <FadeIn delay={0.4}>
               <div className="flex flex-col md:flex-row justify-center gap-4 pt-6">
                  <Link href="/register" className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black text-lg transition-all shadow-2xl shadow-blue-600/20 scale-100 hover:scale-105 active:scale-95">
                     سجل الآن مجاناً
                  </Link>
                  <a href="https://wa.me/201152562799" target="_blank" className="px-10 py-4 rounded-2xl glass hover:bg-white/10 font-black text-lg transition-all flex items-center justify-center gap-3">
                     <MessageCircle className="h-6 w-6 text-green-500" />
                     تواصل معنا واتساب
                  </a>
               </div>
            </FadeIn>
         </div>

         {/* Background Orbs */}
         <div className="absolute top-0 left-0 w-full h-full -z-50 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[100px]" />
         </div>
      </section>

      {/* Grade Folders Section */}
      <section className="py-24 px-6 bg-zinc-950/50">
         <div className="max-w-7xl mx-auto space-y-16 text-center">
            <FadeIn>
               <h2 className="text-4xl font-black text-white">السنوات الدراسية</h2>
               <p className="text-zinc-500 mt-4">اختر صفك الدراسي لتبدأ رحلة النجاح</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <LandingGradeCard title="الصف الأول الثانوي" year="1" />
               <LandingGradeCard title="الصف الثاني الثانوي" year="2" />
               <LandingGradeCard title="الصف الثالث الثانوي" year="3" />
            </div>
         </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
               icon={<BookOpen className="h-8 w-8 text-blue-500" />}
               title="شرح شامل ومبسط"
               desc="نقدم لك المعلومة بأبسط الطرق الممكنة مع تغطية كاملة للمنهج"
            />
            <FeatureCard
               icon={<GraduationCap className="h-8 w-8 text-purple-500" />}
               title="اختبارات دورية"
               desc="قيم مستواك بعد كل محاضرة من خلال نظام اختباراتنا التفاعلي"
            />
            <FeatureCard
               icon={<Clock className="h-8 w-8 text-orange-500" />}
               title="متابعة مستمرة"
               desc="نحن معك خطوة بخطوة حتى تصل إلى القمة"
            />
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 text-center text-zinc-600 text-sm">
         <p>© 2025 جميع الحقوق محفوظة - منصة التاريخ للمرحلة الثانوية</p>
         <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">عن المنصة</a>
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="https://wa.me/201152562799" className="hover:text-green-500 transition-colors">الدعم الفني</a>
         </div>
      </footer>

      {/* Sticky WhatsApp */}
      <a
         href="https://wa.me/201152562799"
         target="_blank"
         className="fixed bottom-8 left-8 z-[200] h-16 w-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-90 transition-all group"
      >
         <MessageCircle className="h-8 w-8 text-white" />
         <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            هل لديك استفسار؟
         </span>
      </a>
    </div>
  );
}

function LandingGradeCard({ title, year }: any) {
   return (
      <div className="glass-card p-10 rounded-[3rem] border-white/5 hover:border-blue-500/50 transition-all duration-500 group">
         <div className="h-20 w-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <BookOpen className="h-10 w-10 text-blue-500" />
         </div>
         <h3 className="text-2xl font-black mb-4">{title}</h3>
         <Link href="/login" className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-blue-600 transition-all font-bold block">
            دخول المرحلة
         </Link>
      </div>
   );
}

function FeatureCard({ icon, title, desc }: any) {
   return (
      <div className="space-y-6 text-center md:text-right">
         <div className="inline-flex p-4 glass rounded-2xl mb-2">{icon}</div>
         <h4 className="text-xl font-bold">{title}</h4>
         <p className="text-zinc-500 leading-relaxed">{desc}</p>
      </div>
   );
}
