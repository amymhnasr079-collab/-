/**
 * Section: التعلم القبلي (Prior Learning)
 * Interactive pre-assessment with 5 interactive questions, text response option,
 * and encouraging pedagogical feedback.
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { priorLearningQuestions } from '../data/lessonData';
import { toArabicNumerals } from '../utils/arabicNumerals';
import { sound } from '../utils/soundEffects';

interface PriorLearningProps {
  onComplete: () => void;
}

export const PriorLearning: React.FC<PriorLearningProps> = ({ onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<'multiple' | 'written'>('multiple');

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    sound.playSuccessChime();
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === priorLearningQuestions.length;

  return (
    <section className="py-12 sm:py-16 bg-sky-50/70 border-b border-sky-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>استكشاف الخبرات السابقة للطلاب</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            التعلم القبلي
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
            أجب عن الأسئلة التالية لتنشيط معلوماتك السابقة حول مسابقة رمي الرمح وكيفية إدارتها.
          </p>

          {/* Mode Selector */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab('multiple')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'multiple'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              اختيار من متعدد
            </button>
            <button
              onClick={() => setActiveTab('written')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'written'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              كتابة إجابة حرة
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-5 mb-8">
          {priorLearningQuestions.map((q) => {
            const hasAnswered = selectedAnswers[q.id] !== undefined;
            const writtenVal = writtenAnswers[q.id] || '';

            return (
              <div
                key={q.id}
                className="bg-white border-2 border-sky-100 rounded-2xl p-5 sm:p-6 shadow-md shadow-sky-900/5 transition-all"
              >
                {/* Question title */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0 arabic-num shadow-xs">
                    {toArabicNumerals(q.id)}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                {activeTab === 'multiple' ? (
                  /* Multiple choices */
                  <div className="space-y-2.5">
                    {q.options.map((opt, idx) => {
                      const isSelected = selectedAnswers[q.id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(q.id, idx)}
                          className={`w-full text-right p-3.5 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-white'
                          }`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-600'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Written input */
                  <div>
                    <textarea
                      value={writtenVal}
                      onChange={(e) =>
                        setWrittenAnswers({ ...writtenAnswers, [q.id]: e.target.value })
                      }
                      rows={2}
                      placeholder="اكتب إجابتك أو ملاحظتك هنا بأسلوبك الخاص..."
                      className="w-full bg-slate-50 border-2 border-sky-100 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {writtenVal.trim().length > 3 && (
                      <p className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-bold">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        إجابة رائعة وتفكير تحليلي ممتاز!
                      </p>
                    )}
                  </div>
                )}

                {/* Pedagogical Feedback */}
                {hasAnswered && activeTab === 'multiple' && (
                  <div className="mt-4 pt-3.5 border-t border-sky-100 flex items-start gap-2.5 text-xs text-emerald-900 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-emerald-800 block mb-0.5">تغذية راجعة محفزة:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button & Completion */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border-2 border-sky-100 rounded-2xl shadow-sm">
          <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-right font-medium">
            تمت الإجابة على{' '}
            <strong className="text-emerald-700 font-extrabold arabic-num">
              {toArabicNumerals(answeredCount)}
            </strong>{' '}
            من أصل{' '}
            <strong className="text-slate-900 font-bold arabic-num">
              {toArabicNumerals(priorLearningQuestions.length)}
            </strong>{' '}
            أسئلة
          </div>

          <button
            onClick={onComplete}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <span>الانتقال إلى التمهيد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
