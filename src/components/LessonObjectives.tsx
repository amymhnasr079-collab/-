/**
 * Section: أهداف الدرس (Lesson Objectives)
 * Sourced according to the pedagogical standards of the Sultanate of Oman curriculum.
 */

import React from 'react';
import { Target, CheckCircle2, ShieldCheck, Scale, Award } from 'lucide-react';
import { toArabicNumerals } from '../utils/arabicNumerals';

export const LessonObjectives: React.FC = () => {
  const objectives = [
    {
      num: '١',
      title: 'الهدف المعرفي',
      desc: 'أن يتعرف الطالب على القواعد العامة المنظمة لمسابقة رمي الرمح وفق القانون الدولي لألعاب القوى للهواة.',
      icon: <Target className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      num: '٢',
      title: 'الهدف الإجرائي والتنظيمي',
      desc: 'أن يوضح الطالب إجراءات سحب القرعة وتحديد عدد المحاولات بحسب أعداد المتسابقين وطريقة تسجيل النتائج في الاستمارة الرسمية.',
      icon: <Scale className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50 border-sky-200'
    },
    {
      num: '٣',
      title: 'الهدف التحكيمي والتقييمي',
      desc: 'أن يميز الطالب بين المحاولات الصحيحة والمحاولات الفاشلة ويوضح الاستخدام السليم للرايتين البيضاء والحمراء وكيفية قياس المسافة بدقة.',
      icon: <Award className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200'
    },
    {
      num: '٤',
      title: 'الهدف السلوكي والأمان',
      desc: 'أن يلتزم الطالب باشتراطات السلامة الميدانية في منطقة الرمي والهبوط، ويعزز روح العمل الجماعي والعدالة الرياضية.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 sm:p-8 my-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            أهداف الحصة التعليمية
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            المخرجات التعليمية المستهدفة للصف الحادي عشر – إعداد الأستاذة: سالمة الحكماني
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.map((obj, i) => (
          <div
            key={i}
            className={`border-2 rounded-2xl p-4 flex items-start gap-3.5 transition-all shadow-xs ${obj.bg}`}
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0">
              {obj.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-slate-900 arabic-num">
                  هدف رقم ({toArabicNumerals(obj.num)}):
                </span>
                <span className="text-xs font-bold text-slate-800">{obj.title}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {obj.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
