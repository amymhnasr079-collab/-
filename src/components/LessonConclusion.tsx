/**
 * Section: ختام الدرس (Lesson Conclusion)
 * Teacher closing message, reflective completion prompts ("اليوم تعلمت أن...", "أستطيع الآن أن..."),
 * and the golden equation: «التنظيم + السلامة + العدالة = مسابقة ناجحة».
 */

import React, { useState } from 'react';
import { UserCheck, Sparkles, CheckCircle2, HeartHandshake, ShieldCheck, Scale } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface LessonConclusionProps {
  onRestartLesson: () => void;
}

export const LessonConclusion: React.FC<LessonConclusionProps> = ({ onRestartLesson }) => {
  const [learnedSentence, setLearnedSentence] = useState<string>('إدارة مسابقة رمي الرمح تتطلب ترتيب القرعة، والتحكيم بالرايتين البيضاء والحمراء، وقياس المسافة من أثر الرمح لقوس الرمي بدقة.');
  const [canDoSentence, setCanDoSentence] = useState<string>('تنظيم مسابقة مدرسية لرمي الرمح مع زملائي وتطبيق قواعد السلامة وتحديد الفائز بنزاهة وعدالة.');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveReflection = () => {
    setIsSaved(true);
    sound.playSuccessChime();
  };

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-sky-50/50 to-emerald-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-xs">
            غلق الحصة والتلخيص
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
            ختام الدرس والتأمل الذاتي
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
            تلخيص القيم الرياضية والإدارية المكتسبة من الحصة
          </p>
        </div>

        {/* Teacher Final Address Card */}
        <div className="bg-gradient-to-br from-emerald-50 via-sky-50 to-white border-2 border-sky-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-sky-900/5 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="flex-1 text-center sm:text-right">
              <span className="text-xs font-black text-emerald-800 block mb-1">
                كلمة الأستاذة سالمة الحكماني (معلمة التربية الرياضية) الختامية:
              </span>
              <blockquote className="text-base sm:text-xl text-slate-900 font-bold leading-relaxed mb-3">
                «تعلمنا اليوم أن نجاح مسابقة رمي الرمح لا يعتمد على الرمي فقط، بل يحتاج إلى تنظيم وإدارة صحيحة، وقياس دقيق، والتزام بقواعد السلامة والروح الرياضية.»
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                شكراً لجهودكم المتميزة كفريق عمل واحد في إدارة وتنظيم مسابقة الرمح المدرسية بكفاءة واقتدار.
              </p>
            </div>
          </div>
        </div>

        {/* Student Completion & Reflection Prompts */}
        <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
          <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            نشاط التأمل الذاتي: أكمل الجمل التالية
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-black text-emerald-800 mb-1.5">
                اليوم تعلمت أن:
              </label>
              <textarea
                value={learnedSentence}
                onChange={(e) => setLearnedSentence(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border-2 border-sky-100 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-sky-800 mb-1.5">
                أستطيع الآن أن:
              </label>
              <textarea
                value={canDoSentence}
                onChange={(e) => setCanDoSentence(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border-2 border-sky-100 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveReflection}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaved ? 'تم حفظ تأملاتك بنجاح ✓' : 'حفظ التأمل الذاتي'}</span>
            </button>
          </div>
        </div>

        {/* The Golden Equation Banner with Cartoon Stadium Backdrop */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-300 shadow-xl shadow-emerald-950/5 mb-8">
          <img
            src="/src/assets/images/cartoon_stadium_javelin_1791221032988.jpg"
            alt="ملعب رمي الرمح"
            referrerPolicy="no-referrer"
            className="w-full h-40 sm:h-48 object-cover object-center filter saturate-125 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-800/70 to-sky-900/40 backdrop-blur-[1px]" />
          
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center text-white">
            <span className="text-xs text-emerald-200 block mb-2 font-black">
              المعادلة الذهبية لإدارة مسابقات ألعاب القوى المدرسية:
            </span>
            <div className="text-xl sm:text-3xl font-black tracking-wide py-2">
              <span className="text-emerald-300">التنظيم</span>
              {' '}+{' '}
              <span className="text-amber-300">السلامة</span>
              {' '}+{' '}
              <span className="text-sky-300">العدالة</span>
              {' '}={' '}
              <span className="text-emerald-950 bg-white px-3 py-1 rounded-xl shadow-md border border-emerald-200 inline-block mt-1 sm:mt-0">
                مسابقة ناجحة
              </span>
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={onRestartLesson}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-sky-200 text-xs font-bold rounded-2xl transition-all shadow-xs"
          >
            العودة إلى بداية الحصة التعليمية
          </button>
        </div>
      </div>
    </section>
  );
};
