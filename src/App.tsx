/**
 * Standalone 3D Interactive Video Simulation App:
 * «تنظيم وإدارة مسابقة رمي الرمح»
 * التربية الرياضية المدرسية – منهج سلطنة عُمان – الصف الحادي عشر
 * إعداد الأستاذة: سالمة الحكماني
 */

import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { Interactive3DVideo } from './components/Interactive3DVideo';
import { SafetyGuidelinesModal } from './components/SafetyGuidelinesModal';
import { sound } from './utils/soundEffects';
import { toArabicNumerals } from './utils/arabicNumerals';
import { 
  ShieldAlert, Ruler, CheckCircle2, XCircle, 
  Sparkles, Layers, Flag, Award, Compass, Eye
} from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50/80 to-emerald-50/60 text-slate-800 flex flex-col font-['Tajawal',sans-serif] relative overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">
      {/* Decorative Cartoon Clouds and Stadium Field Motif Watermarks */}
      <div className="fixed inset-0 pointer-events-none opacity-25 z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-36 bg-white/70 rounded-full blur-2xl" />
        <div className="absolute top-96 left-10 w-96 h-48 bg-sky-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-40 bg-emerald-100/60 rounded-full blur-2xl" />
      </div>

      {/* Top Bar Navigation */}
      <HeaderNav
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
      />

      {/* Main Standalone Content */}
      <main className="flex-1 relative z-10 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header Introduction Banner */}
          <section className="mb-8 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-sky-100 shadow-xl shadow-sky-900/5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold mb-3">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                    سلطنة عُمان · وزارة التربية والتعليم
                  </span>
                  <span className="bg-sky-100 text-sky-800 font-extrabold px-3 py-1 rounded-xl border border-sky-200">
                    الصف الحادي عشر
                  </span>
                  <span className="bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>إعداد الأستاذة: سالمة الحكماني</span>
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                  محاكاة الفيديو ثلاثي الأبعاد: تنظيم وإدارة مسابقة رمي الرمح
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  استكشف محاكاة تفاعلية ثلاثية الأبعاد (3D) لمجريات مسابقة رمي الرمح وفق كتاب التربية الرياضية المدرسي والقانون الدولي لألعاب القوى:
                  حركة المتسابق في طريق الاقتراب، مراقبة خط القوس، إشارات الرايتين البيضاء والحمراء، وقياس الرمية بدقة من علامة الأثر إلى الحافة الداخلية للقوس.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setSafetyModalOpen(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-white" />
                  دليل السلامة والأمان
                </button>
              </div>
            </div>

            {/* Quick Stadium Specifications Highlight Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-sky-100 text-xs">
              <div className="bg-sky-50/90 p-3 rounded-2xl border border-sky-100">
                <span className="block text-sky-800 font-bold mb-0.5">طريق الاقتراب (الجري)</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  عرض {toArabicNumerals('4')} أمتار × ≥ {toArabicNumerals('30')} م
                </strong>
                <span className="text-[10px] text-slate-500 block">خطان جانبيان بعرض {toArabicNumerals('5')} سم</span>
              </div>

              <div className="bg-emerald-50/90 p-3 rounded-2xl border border-emerald-100">
                <span className="block text-emerald-800 font-bold mb-0.5">قوس الرمي</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  نصف قطر {toArabicNumerals('8')} أمتار
                </strong>
                <span className="text-[10px] text-slate-500 block">لوحة بيضاء عرض {toArabicNumerals('7')} سم وامتداد {toArabicNumerals('75')} سم</span>
              </div>

              <div className="bg-amber-50/90 p-3 rounded-2xl border border-amber-100">
                <span className="block text-amber-800 font-bold mb-0.5">زاوية مقطع الرمي</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  {toArabicNumerals('29')} درجة
                </strong>
                <span className="text-[10px] text-slate-500 block">تلتقي عند مركز دائرة القوس (٨م)</span>
              </div>

              <div className="bg-rose-50/90 p-3 rounded-2xl border border-rose-100">
                <span className="block text-rose-800 font-bold mb-0.5">رايات تحديد القطاع</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  ارتفاع {toArabicNumerals('60')} سم
                </strong>
                <span className="text-[10px] text-slate-500 block">راية بأبعاد {toArabicNumerals('18')} × {toArabicNumerals('10')} سم</span>
              </div>
            </div>
          </section>

          {/* Standalone Interactive 3D Video Studio */}
          <section className="mb-10">
            <Interactive3DVideo />
          </section>

          {/* Authoritative Educational Reference Cards Underneath the Simulation */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            {/* Card 1: Measurement Method */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border-2 border-sky-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    طريقة القياس المعتمدة (البندان ٦ و ٨)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                  وفق نص الكتاب المدرسي: تقاس المسافة من أقرب علامة (أثر) أحدثه سن الرمح إلى الحافة الداخلية لقوس الرمي، ممتداً في خط مستقيم نحو مركز نصف قطر قوس الرمي (٨م).
                </p>
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 font-bold space-y-1">
                  <div>• صفر الشريط يوضع عند مكان سقوط الرمح بدقة.</div>
                  <div>• قراءة النتيجة تكون عند الحافة الداخلية لقوس الرمي.</div>
                </div>
              </div>
            </div>

            {/* Card 2: Referee Flags & Decisions */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border-2 border-sky-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                    <Flag className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    قرارات الحكم والرايات (بيضاء وحمراء)
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-emerald-900 font-bold leading-snug">
                      الراية البيضاء: محاولة صحيحة تتبعها إشارة القياس وتسجيل المسافة.
                    </span>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="text-rose-900 font-bold leading-snug">
                      الراية الحمراء: محاولة فاشلة (لمس القوس، سقوط خارج المقطع، هبوط مسطح، أو مغادرة مبكرة).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Javelin Legal Specifications */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border-2 border-sky-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    مواصفات الرمح المقررة (الشكل رقم ١)
                  </h3>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                  <li className="flex justify-between border-b border-slate-100 pb-1">
                    <span>طول رمح الرجال:</span>
                    <strong className="text-slate-900 arabic-num font-black">لا يقل عن {toArabicNumerals('260')} سم</strong>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1">
                    <span>وزن رمح الرجال:</span>
                    <strong className="text-slate-900 arabic-num font-black">لا يقل عن {toArabicNumerals('800')} جرام</strong>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1">
                    <span>طول رمح السيدات:</span>
                    <strong className="text-slate-900 arabic-num font-black">لا يقل عن {toArabicNumerals('220')} سم</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>وزن رمح السيدات:</span>
                    <strong className="text-slate-900 arabic-num font-black">لا يقل عن {toArabicNumerals('600')} جرام</strong>
                  </li>
                </ul>
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* Safety Modal */}
      <SafetyGuidelinesModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />

      {/* Cheerful School Footer */}
      <footer className="bg-white/95 backdrop-blur-md border-t border-sky-200 py-6 px-4 text-center text-xs text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-slate-900">التربية الرياضية المدرسية</span>
            <span aria-hidden="true" className="text-sky-400">·</span>
            <span className="text-emerald-700 font-bold">منهج سلطنة عُمان</span>
            <span aria-hidden="true" className="text-sky-400">·</span>
            <span className="text-sky-800 font-extrabold bg-sky-100 px-2 py-0.5 rounded-md">الصف الحادي عشر</span>
            <span aria-hidden="true" className="text-sky-400">·</span>
            <span className="text-amber-900 font-black bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
              إعداد الأستاذة: سالمة الحكماني
            </span>
          </div>
          <div className="text-slate-500 font-medium">
            محاكاة ثلاثية الأبعاد تفاعلية وفق الكتاب المدرسي والقانون الدولي لألعاب القوى
          </div>
        </div>
      </footer>
    </div>
  );
}
