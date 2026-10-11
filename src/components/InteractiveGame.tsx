/**
 * Section: اللعبة التفاعلية الختامية
 * «مدير مسابقة الرمح»
 * 6 authentic referee/management situational challenges with scoring,
 * instant feedback, and celebratory confetti upon completion.
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, CheckCircle, XCircle, RefreshCw, 
  Award, Sparkles, ArrowLeft, ArrowRight, ShieldAlert, Flag
} from 'lucide-react';
import { gameScenarios } from '../data/lessonData';
import { toArabicNumerals } from '../utils/arabicNumerals';
import { sound } from '../utils/soundEffects';

interface InteractiveGameProps {
  onComplete: () => void;
}

export const InteractiveGame: React.FC<InteractiveGameProps> = ({ onComplete }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const scenario = gameScenarios[currentScenarioIndex];
  const isAnswered = selectedAnswers[scenario.id] !== undefined;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return; // already answered

    const isCorrect = scenario.options[index].isCorrect;
    setSelectedAnswers(prev => ({ ...prev, [scenario.id]: index }));
    setShowFeedback(true);

    if (isCorrect) {
      setScore(prev => prev + 10);
      sound.playSuccessChime();
    } else {
      sound.playFoulBuzzer();
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentScenarioIndex < gameScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
      sound.playSuccessChime();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback safe
      }
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowFeedback(false);
    setCurrentScenarioIndex(0);
    setScore(0);
    setGameFinished(false);
  };

  const totalMaxScore = gameScenarios.length * 10;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-sky-50/60 to-emerald-50/40 border-b border-sky-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>لعبة اتخاذ القرارات التحكيمية والإدارية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
            «مدير مسابقة الرمح»
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
            أنت الآن رئيس الحكام ومدير المسابقة، واجه المواقف الميدانية واتخذ القرار الصحيح وفق قواعد الكتاب.
          </p>
        </div>

        {/* Score & Progress Tracker Bar */}
        <div className="flex items-center justify-between p-4 bg-white border-2 border-sky-100 rounded-2xl mb-6 shadow-xs">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-slate-600 font-bold">نقاط الإدارة:</span>
            <strong className="text-sm font-black text-amber-700 arabic-num">
              {toArabicNumerals(score)} / {toArabicNumerals(totalMaxScore)} نقطة
            </strong>
          </div>

          <div className="text-xs text-slate-600 arabic-num font-bold">
            الموقف {toArabicNumerals(currentScenarioIndex + 1)} من {toArabicNumerals(gameScenarios.length)}
          </div>
        </div>

        {!gameFinished ? (
          /* Active Scenario Card */
          <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-900/5">
            {/* Situation description */}
            <div className="mb-6">
              <span className="text-xs font-black text-emerald-700 block mb-1 arabic-num">
                الموقف رقم ({toArabicNumerals(scenario.id)}):
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-3">
                {scenario.title}
              </h3>
              <div className="p-4 bg-sky-50 border-2 border-sky-100 rounded-2xl text-slate-800 text-xs sm:text-sm leading-relaxed mb-4 font-semibold">
                <span className="font-black text-amber-800 block mb-1">الموقف الميداني:</span>
                {scenario.situation}
              </div>
              <p className="text-sm font-black text-slate-900">
                {scenario.question}
              </p>
            </div>

            {/* Options list */}
            <div className="space-y-3 mb-6">
              {scenario.options.map((opt, idx) => {
                const userSelected = selectedAnswers[scenario.id] === idx;
                const isCorrect = opt.isCorrect;
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-white';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                  } else if (userSelected && !isCorrect) {
                    btnStyle = 'bg-red-50 border-red-500 text-red-950 font-bold';
                  } else {
                    btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-right p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all flex items-start gap-3.5 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {opt.label}
                    </span>
                    <span className="leading-relaxed flex-1">{opt.text}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && userSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Rule Reference */}
            {isAnswered && (
              <div className="mb-6 p-4 rounded-2xl border-2 bg-sky-50 border-sky-200 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  {scenario.options[selectedAnswers[scenario.id]].isCorrect ? (
                    <span className="text-emerald-800 font-black flex items-center gap-1.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      إجابة صحيحة وموقف تحكيمي سليم! (+١٠ نقاط)
                    </span>
                  ) : (
                    <span className="text-red-800 font-black flex items-center gap-1.5 text-sm">
                      <XCircle className="w-4 h-4 text-red-600" />
                      حاول مرة أخرى لتتذكر القاعدة بدقة!
                    </span>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed mb-2 font-medium">
                  {scenario.explanation}
                </p>
                <span className="text-[11px] text-slate-500 block border-t border-sky-200 pt-2 font-bold">
                  المرجع في الكتاب المدرسي: <strong className="text-slate-800">{scenario.ruleReference}</strong>
                </span>
              </div>
            )}

            {/* Next Scenario Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
                >
                  <span>
                    {currentScenarioIndex < gameScenarios.length - 1 ? 'الموقف التالي' : 'عرض النتيجة النهائية'}
                  </span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Game Completed Victory Screen */
          <div className="bg-white border-2 border-sky-100 rounded-3xl p-8 text-center shadow-xl shadow-sky-900/5">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-md shadow-amber-500/20">
              <Trophy className="w-10 h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              ممتاز! لقد أصبحت مديرًا ناجحًا لمسابقة رمي الرمح.
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed font-medium">
              أظهرت فهماً عميقاً لقواعد المسابقة، وإجراءات السلامة، وحالات المحاولة الصحيحة والفاشلة وطريقة القياس الدقيقة.
            </p>

            <div className="inline-block p-5 bg-sky-50 border-2 border-sky-100 rounded-2xl mb-8 min-w-56 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block mb-1">النتيجة الإجمالية المحققة:</span>
              <span className="text-3xl font-black text-emerald-700 arabic-num">
                {toArabicNumerals(score)} / {toArabicNumerals(totalMaxScore)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة اللعبة</span>
              </button>

              <button
                onClick={onComplete}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
              >
                <span>الانتقال إلى التقويم الختامي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
