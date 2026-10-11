/**
 * Hero Section for the lesson:
 * «تنظيم وإدارة مسابقة رمي الرمح»
 * «التربية الرياضية – منهج سلطنة عُمان»
 */

import React from 'react';
import { Play, BookOpen, Users, Trophy, Flag, CheckCircle } from 'lucide-react';
import { toArabicNumerals } from '../utils/arabicNumerals';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50/50 border-b border-sky-200">
      {/* Cartoon Athletics Stadium Background Illustration */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/src/assets/images/cartoon_stadium_javelin_1791221032988.jpg"
          alt="ملعب كرتوني لرمي الرمح"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 filter saturate-150 brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-50 via-sky-50/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Content Card (Right side in RTL) */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-sky-100 shadow-xl shadow-sky-900/5">
            {/* Metadata context kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 mb-3">
              <span className="bg-emerald-100/90 text-emerald-800 px-3 py-1 rounded-xl">سلطنة عُمان</span>
              <span aria-hidden="true" className="text-sky-300">·</span>
              <span className="text-slate-600">وزارة التربية والتعليم</span>
              <span aria-hidden="true" className="text-sky-300">·</span>
              <span className="text-slate-600">التربية الرياضية المدرسية</span>
              <span aria-hidden="true" className="text-sky-300">·</span>
              <span className="text-sky-800 font-extrabold bg-sky-100 px-3 py-1 rounded-xl border border-sky-200">الصف الحادي عشر</span>
              <span aria-hidden="true" className="text-sky-300">·</span>
              <span className="text-amber-900 font-black bg-gradient-to-r from-amber-100 to-amber-200 px-3 py-1 rounded-xl border border-amber-300 shadow-xs flex items-center gap-1.5">
                <span>إعداد الأستاذة:</span>
                <span className="text-amber-950 font-black">سالمة الحكماني</span>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2 text-balance">
              تنظيم وإدارة مسابقة رمي الرمح
            </h1>

            {/* Subtitle & Teacher Attribution */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <p className="text-lg sm:text-xl font-extrabold text-sky-800 leading-relaxed flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                التربية الرياضية – منهج سلطنة عُمان (الصف الحادي عشر)
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 mb-7 leading-relaxed font-medium">
              حصة تعليمية رقمية تفاعلية بأسلوب بصري كرتوني ممتع، تشرح القواعد المنظمة لمسابقات الرمي،
              نظام المحاولات، حالات المحاولة الصحيحة والفاشلة، طريقة القياس المعتمدة،
              مع محاكاة ثلاثية الأبعاد 3D ونشاط جماعي ولعبة تفاعلية.
            </p>

            {/* Main Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 mb-8">
              <button
                onClick={() => onNavigate('core')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-md shadow-emerald-600/30 hover:shadow-lg hover:scale-[1.02] flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                ابدأ الدرس
              </button>

              <button
                onClick={() => onNavigate('prior')}
                className="px-4 py-3 bg-white hover:bg-sky-50 text-slate-700 border-2 border-sky-200 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                تعلم قبلي
              </button>

              <button
                onClick={() => onNavigate('core')}
                className="px-4 py-3 bg-white hover:bg-sky-50 text-slate-700 border-2 border-sky-200 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Flag className="w-4 h-4 text-sky-600" />
                الدرس
              </button>

              <button
                onClick={() => onNavigate('activity')}
                className="px-4 py-3 bg-white hover:bg-sky-50 text-slate-700 border-2 border-sky-200 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-amber-600" />
                النشاط الجماعي
              </button>

              <button
                onClick={() => onNavigate('game')}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4 text-white" />
                اللعبة التفاعلية
              </button>

              <button
                onClick={() => onNavigate('conclusion')}
                className="px-4 py-3 bg-white hover:bg-sky-50 text-slate-700 border-2 border-sky-200 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                ختام الدرس
              </button>
            </div>

            {/* Quick Specifications Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-sky-100 text-xs text-slate-600">
              <div className="bg-sky-50/90 p-3 rounded-2xl border border-sky-100">
                <span className="block text-sky-800 font-bold mb-0.5">طريق الاقتراب</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  {toArabicNumerals('4')} أمتار × ≥ {toArabicNumerals('30')} م
                </strong>
              </div>
              <div className="bg-emerald-50/90 p-3 rounded-2xl border border-emerald-100">
                <span className="block text-emerald-800 font-bold mb-0.5">نصف قطر القوس</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  {toArabicNumerals('8')} أمتار (لوحة {toArabicNumerals('7')} سم)
                </strong>
              </div>
              <div className="bg-amber-50/90 p-3 rounded-2xl border border-amber-100">
                <span className="block text-amber-800 font-bold mb-0.5">زاوية مقطع الرمي</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  {toArabicNumerals('29')} درجة
                </strong>
              </div>
              <div className="bg-rose-50/90 p-3 rounded-2xl border border-rose-100">
                <span className="block text-rose-800 font-bold mb-0.5">أعلام قطاع الرمي</span>
                <strong className="text-slate-900 font-black text-sm arabic-num">
                  ارتفاع {toArabicNumerals('60')} سم ({toArabicNumerals('18')}×{toArabicNumerals('10')} سم)
                </strong>
              </div>
            </div>
          </div>

          {/* Left Feature: Prominent Cartoon Stadium Showcase Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-sky-900/10 bg-white">
              <img
                src="/src/assets/images/cartoon_stadium_javelin_1791221032988.jpg"
                alt="صورة كرتونية لملعب رمي الرمح المدرسي"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover object-center filter saturate-125 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Badges on the image */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-black text-emerald-800 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ملعب رمي الرمح المدرسي
              </div>

              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs font-bold">
                <span className="bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                  قوس الرمي (٨م) ومقطع الرمي (٢٩°)
                </span>
                <button
                  onClick={() => onNavigate('video3d')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  محاكاة 3D
                </button>
              </div>
            </div>

            {/* Field Specifications Cartoon Card */}
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl border-2 border-sky-100 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Flag className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-slate-900 mb-0.5">
                  بيئة رمي الرمح وفق المعايير الدولية
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  طريق اقتراب محدد بخطين متوازيين (٥ سم)، ولوحة قوس بيضاء في مستوى الأرض لمنع الإخلال بتوازن اللاعب.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
