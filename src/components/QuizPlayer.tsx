'use client';

import { useState } from 'react';
import { submitQuizAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuizPlayer({ quiz, studentId, sessionId }: { quiz: any, studentId: string, sessionId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const questions = quiz.questions.map((q: any) => ({
    ...q,
    options: JSON.parse(q.options)
  }));

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      alert('يرجى الإجابة على جميع الأسئلة قبل التسليم');
      return;
    }

    setLoading(true);
    try {
      let score = 0;
      questions.forEach((q: any, i: number) => {
        if (answers[i] === q.correctAnswer) {
          score++;
        }
      });

      await submitQuizAction(quiz.id, studentId, score, questions.length);
      setSubmitted(true);
      setTimeout(() => {
        router.push(`/sessions/${sessionId}`);
        router.refresh();
      }, 3000);
    } catch (err) {
      alert('حدث خطأ أثناء إرسال الإجابات');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-20">
         <div className="inline-flex p-4 rounded-full bg-green-500/20 text-green-500 mb-4">
            <CheckCircle2 className="h-16 w-16" />
         </div>
         <h2 className="text-3xl font-bold">تم إرسال إجاباتك بنجاح!</h2>
         <p className="text-zinc-400 text-lg">سيتم توجيهك إلى صفحة المحاضرة لمشاهدة نتيجتك...</p>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress */}
      <div className="space-y-2">
         <div className="flex justify-between text-sm text-zinc-500">
            <span>سؤال {currentQuestion + 1} من {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
         </div>
         <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
         </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
         <h2 className="text-2xl font-bold mb-8 leading-tight">{q.text}</h2>

         <div className="space-y-4">
            {q.options.map((option: string, i: number) => (
               <button
                 key={i}
                 onClick={() => handleSelect(i)}
                 className={`w-full text-right p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                   answers[currentQuestion] === i
                   ? 'bg-blue-600/10 border-blue-600 text-white'
                   : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                 }`}
               >
                 <span className="text-lg">{option}</span>
                 {answers[currentQuestion] === i && <CheckCircle2 className="h-6 w-6 text-blue-500" />}
               </button>
            ))}
         </div>
      </div>

      <div className="flex justify-between items-center">
         <button
           onClick={handlePrev}
           disabled={currentQuestion === 0}
           className="px-8 py-3 rounded-xl bg-zinc-800 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
         >
           السابق
         </button>

         {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg shadow-green-600/20"
            >
              {loading ? 'جاري الإرسال...' : 'إنهاء الاختبار'}
            </button>
         ) : (
            <button
              onClick={handleNext}
              className="px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              التالي
            </button>
         )}
      </div>

      <div className="flex items-center gap-2 text-zinc-500 text-sm justify-center">
         <AlertCircle className="h-4 w-4" />
         <span>لا يمكنك تعديل إجاباتك بعد الضغط على &quot;إنهاء الاختبار&quot;</span>
      </div>
    </div>
  );
}
