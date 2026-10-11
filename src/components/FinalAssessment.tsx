/**
 * Section: التقويم الختامي (Final Assessment)
 * 5 authoritative questions covering competition organization,
 * rules, foul detection, measurement method, and safety.
 */

import React, { useState } from 'react';
import { 
  CheckSquare, Award, ArrowLeft, RefreshCw, 
  HelpCircle, CheckCircle, XCircle, FileSpreadsheet
} from 'lucide-react';
import { finalAssessmentQuestions } from '../data/lessonData';
import { toArabicNumerals } from '../utils/arabicNumerals';
import { sound } from '../utils/soundEffects';

interface FinalAssessmentProps {
  onComplete: () => void;
}

export const FinalAssessment: React.FC<FinalAssessmentProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    sound.playSuccessChime();
  };

  const calculateScore = (): number => {
    let score = 0;
    finalAssessmentQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const isAllAnswered = Object.keys(answers).length === finalAssessmentQuestions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    const finalScore = calculateScore();
    if (finalScore >= 4) {
      sound.playSuccessChime();
    } else {
      sound.playWhistle();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const finalScore = calculateScore();

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-sky-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>التقويم والتحصيل الختامي</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            التقويم الختامي للدرس
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
            أجب عن الأسئلة الخمسة التالية لقياس مدى استيعابك لقواعد تنظيم وإدارة مسابقة رمي الرمح.
          </p>
        </div>

        {/* Questions Cards */}
        <div className="space-y-6 mb-8">
          {finalAssessmentQuestions.map((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = submitted && userAnswer === q.correctAnswer;
            const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correctAnswer;

            return (
              <div
                key={q.id}
                className="bg-sky-50/40 border-2 border-sky-100 rounded-3xl p-6 sm:p-7 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 arabic-num shadow-xs">
                    {toArabicNumerals(q.id)}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-2.5 mb-4">
                  {q.options?.map((opt, idx) => {
                    const isSelected = userAnswer === idx;
                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-sky-300';

                    if (submitted) {
                      if (idx === q.correctAnswer) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected && idx !== q.correctAnswer) {
                        btnStyle = 'bg-red-50 border-red-500 text-red-950 font-bold';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, idx)}
                        className={`w-full text-right p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${btnStyle}`}
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

                {/* Feedback upon submission */}
                {submitted && (
                  <div className="pt-3.5 border-t border-sky-100 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      {isCorrect ? (
                        <span className="text-emerald-800 font-black flex items-center gap-1.5 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          إجابة صحيحة وممتازة!
                        </span>
                      ) : (
                        <span className="text-red-800 font-black flex items-center gap-1.5 text-sm">
                          <XCircle className="w-4 h-4 text-red-600" />
                          إجابة غير دقيقة. راجع الشرح أدناه:
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-sky-100 mt-2 font-medium">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action / Result Bar */}
        <div className="p-6 bg-sky-50 border-2 border-sky-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          {!submitted ? (
            <>
              <span className="text-xs sm:text-sm text-slate-600 font-bold arabic-num">
                أجبت عن {toArabicNumerals(Object.keys(answers).length)} من {toArabicNumerals(finalAssessmentQuestions.length)} أسئلة
              </span>

              <button
                onClick={handleSubmit}
                disabled={!isAllAnswered}
                className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30"
              >
                اعتماد وتسليم الإجابات
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block">درجتك النهائية في التقويم:</span>
                  <strong className="text-lg font-black text-slate-900 arabic-num">
                    {toArabicNumerals(finalScore)} من {toArabicNumerals(finalAssessmentQuestions.length)} درجات ({toArabicNumerals(Math.round((finalScore / finalAssessmentQuestions.length) * 100))}٪)
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>

                <button
                  onClick={onComplete}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
                >
                  <span>الانتقال لختام الدرس</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
