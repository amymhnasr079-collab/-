/**
 * Section: التمهيد (Lesson Orientation)
 * Teacher dialogue, problem situation on the athletic field,
 * and key pillars needed for competition success.
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square, Sparkles, UserCheck, Shield } from 'lucide-react';
import { orientationOptions } from '../data/lessonData';
import { sound } from '../utils/soundEffects';

interface LessonOrientationProps {
  onComplete: () => void;
}

export const LessonOrientation: React.FC<LessonOrientationProps> = ({ onComplete }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    sound.playSuccessChime();
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    sound.playSuccessChime();
    setSelectedItems(orientationOptions.map(o => o.id));
  };

  const isAllSelected = selectedItems.length === orientationOptions.length;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-sky-50/50 to-white border-b border-sky-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Tag */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-xs">
            التهيئة الحافزة والتمهيد
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            في ملعب ألعاب القوى
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            الاستعداد العملي لإقامة المسابقة مع معلم التربية الرياضية وزملائك الطلاب
          </p>
        </div>

        {/* Cartoon Stadium Field Illustration Banner */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-sky-200 shadow-md mb-8">
          <img
            src="/src/assets/images/cartoon_students_javelin_1791221326683.jpg"
            alt="المعلم والطلاب في ملعب رمي الرمح"
            referrerPolicy="no-referrer"
            className="w-full h-48 sm:h-64 object-cover object-center filter saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-4 left-4 flex items-center justify-between text-white text-xs font-bold">
            <span className="bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-xl">
              الميدان المدرسي لرمي الرمح
            </span>
            <span className="bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-xl hidden sm:inline-block">
              التعلم القائم على المحاكاة الرياضية
            </span>
          </div>
        </div>

        {/* Teacher Dialogue Card */}
        <div className="bg-gradient-to-br from-emerald-50 via-sky-50 to-white border-2 border-sky-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-md shadow-sky-900/5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Teacher Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            {/* Teacher Speech Quote */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-black text-emerald-800">
                  الأستاذة سالمة الحكماني – معلمة التربية الرياضية المشرفة:
                </span>
                <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                  الصف الحادي عشر
                </span>
              </div>
              <blockquote className="text-base sm:text-lg text-slate-900 font-bold leading-relaxed mb-3">
                «اليوم سنصبح فريقًا مسؤولًا عن تنظيم وإدارة مسابقة رمي الرمح. هل نستطيع تنظيم المسابقة بطريقة صحيحة وآمنة وعادلة؟»
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                لكي تنجح المسابقة وتخرج بأفضل صورة، نحتاج إلى توزيع المهام والالتزام الدقيق بقوانين ألعاب القوى الدولية المدرسية.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Question Card */}
        <div className="bg-sky-50/60 border-2 border-sky-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              ماذا نحتاج حتى تنجح المسابقة وتكون عادلة وآمنة؟
            </h3>
            <button
              onClick={handleSelectAll}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
            >
              تحديد كل الركائز
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-5 font-medium">
            اختر الركائز الأساسية التي ترى أنها ضرورية لإدارة مسابقة رمي الرمح بنجاح:
          </p>

          <div className="space-y-3">
            {orientationOptions.map((item) => {
              const isChecked = selectedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`w-full text-right p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <span className="mt-0.5 shrink-0 text-emerald-600">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 fill-emerald-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold block mb-0.5 text-slate-900">{item.text}</span>
                    {isChecked && (
                      <span className="text-xs text-emerald-700 block mt-1 leading-relaxed font-medium">
                        ✓ {item.explanation}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {isAllSelected && (
            <div className="mt-6 p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 font-semibold shadow-xs">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>أحسنت صنعاً!</strong> هذه العناصر الخمسة مجتمعة هي جوهر حصتنا اليوم لضمان مسابقة نموذجية وعادلة.
              </span>
            </div>
          )}
        </div>

        {/* CTA to Next Section */}
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
          >
            <span>الانتقال إلى محور الدرس</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
