'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { saveQuizAction } from '@/lib/actions';

interface Question {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizBuilder({ sessionId, initialQuiz }: { sessionId: string, initialQuiz: any }) {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options),
      correctAnswer: q.correctAnswer
    })) || []
  );
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const slotLabels = ['أ', 'ب', 'ج', 'د'];
  const handleSave = async () => {
    setLoading(true);
    try {
      await saveQuizAction(sessionId, questions);
      alert('تم حفظ الاختبار بنجاح');
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 space-y-4">
          <div className="flex justify-between items-start">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">سؤال {qIndex + 1}</span>
            <button onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <input
            placeholder="نص السؤال"
            value={q.text}
            onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <button
                  onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className={`flex-shrink-0 font-bold ${q.correctAnswer === oIndex ? 'text-green-500' : 'text-zinc-500'}`}
                >
                  <span className={`h-8 w-8 flex items-center justify-center rounded-full border ${q.correctAnswer === oIndex ? 'bg-green-500/10 border-green-500' : 'bg-zinc-800 border-zinc-700'}`}>
                    {slotLabels[oIndex] || (oIndex + 1)}
                  </span>
                </button>
                <input
                  placeholder={`الاختيار ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full border-2 border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 py-4 rounded-lg flex items-center justify-center transition-all"
      >
        <Plus className="ml-2 h-5 w-5" />
        إضافة سؤال جديد
      </button>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
      >
        {loading ? 'جاري الحفظ...' : 'حفظ الاختبار بالكامل'}
      </button>
    </div>
  );
}
