/**
 * Core Lesson Component:
 * «محور الدرس: تنظيم وإدارة مسابقة رمي الرمح»
 * Faithfully implementing all 7 pedagogical stages strictly following the Oman textbook.
 */

import React, { useState } from 'react';
import { 
  FileText, Shuffle, ListOrdered, AlertOctagon, 
  Ruler, Award, Info, CheckCircle2, XCircle, 
  HelpCircle, ArrowLeft, ArrowRight, Dices, Layers, ShieldCheck
} from 'lucide-react';
import { textbookFoulConditions } from '../data/lessonData';
import { toArabicNumerals } from '../utils/arabicNumerals';
import { sound } from '../utils/soundEffects';

interface CompetitorScore {
  id: string;
  name: string;
  bib: string;
  attempt1: number | 'F';
  attempt2: number | 'F';
  attempt3: number | 'F';
  attempt4?: number | 'F';
  attempt5?: number | 'F';
  attempt6?: number | 'F';
}

export const LessonCore: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  // Stage 2: Interactive Draw Lot State
  const initialStudents = [
    'أحمد بن سعيد المعمري',
    'محمد بن خلفان البلوشي',
    'سالم بن حمد الحارثي',
    'حمد بن ناصر العامري',
    'علي بن خالد الرواحي',
    'سيف بن راشد الهنائي',
    'يوسف بن سلطان الشحي',
    'ماجد بن زاهر العبري'
  ];
  const [drawnList, setDrawnList] = useState<string[]>(initialStudents);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleShuffleLot = () => {
    setIsDrawing(true);
    sound.playWhistle();
    setTimeout(() => {
      const shuffled = [...drawnList].sort(() => Math.random() - 0.5);
      setDrawnList(shuffled);
      setIsDrawing(false);
      sound.playSuccessChime();
    }, 700);
  };

  // Stage 3: Participant Count Simulator
  const [participantCount, setParticipantCount] = useState<number>(12);

  // Stage 7: Interactive Scoreboard State
  const [scores, setScores] = useState<CompetitorScore[]>([
    { id: '1', name: 'أحمد بن سعيد المعمري', bib: '١', attempt1: 28.5, attempt2: 'F', attempt3: 31.2, attempt4: 30.8, attempt5: 32.4, attempt6: 31.9 },
    { id: '2', name: 'محمد بن خلفان البلوشي', bib: '٢', attempt1: 29.1, attempt2: 30.5, attempt3: 29.8, attempt4: 'F', attempt5: 31.0, attempt6: 30.7 },
    { id: '3', name: 'سالم بن حمد الحارثي', bib: '٣', attempt1: 'F', attempt2: 27.4, attempt3: 28.9, attempt4: 29.2, attempt5: 28.8, attempt6: 'F' },
    { id: '4', name: 'حمد بن ناصر العامري', bib: '٤', attempt1: 26.8, attempt2: 27.1, attempt3: 'F', attempt4: 26.5, attempt5: 27.9, attempt6: 28.1 }
  ]);

  const calculateBest = (c: CompetitorScore): number => {
    const valid: number[] = [];
    [c.attempt1, c.attempt2, c.attempt3, c.attempt4, c.attempt5, c.attempt6].forEach(val => {
      if (typeof val === 'number') valid.push(val);
    });
    return valid.length > 0 ? Math.max(...valid) : 0;
  };

  const stagesList = [
    { num: 1, title: 'القواعد العامة' },
    { num: 2, title: 'ترتيب المتسابقين بالقرعة' },
    { num: 3, title: 'عدد المحاولات القانونية' },
    { num: 4, title: 'المحاولات الصحيحة والفاشلة' },
    { num: 5, title: 'طريقة القياس الصحيحة' },
    { num: 6, title: 'مواصفات الرمح والملعب' },
    { num: 7, title: 'جدول تسجيل النتائج' }
  ];

  return (
    <section className="py-12 bg-sky-50/40 border-b border-sky-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-xs">
            المحتوى العلمي المعتمد من الكتاب
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
            محور الدرس: تنظيم وإدارة مسابقة رمي الرمح
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
            وفق منهج التربية الرياضية بسلطنة عُمان والقانون الدولي لألعاب القوى للهواة
          </p>
        </div>

        {/* Stages Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-white border-2 border-sky-100 rounded-2xl overflow-x-auto mb-8 shadow-sm">
          {stagesList.map((st) => (
            <button
              key={st.num}
              onClick={() => {
                setActiveStage(st.num);
                sound.playSuccessChime();
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                activeStage === st.num
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black arabic-num">
                {toArabicNumerals(st.num)}
              </span>
              <span>{st.title}</span>
            </button>
          ))}
        </div>

        {/* Stage Content Switcher */}
        <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-900/5">
          {/* ======================================================== */}
          {/* STAGE 1: General Rules */}
          {/* ======================================================== */}
          {activeStage === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة الأولى: القواعد العامة للمسابقة
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    المرجعية الدولية وشروط إقامة المسابقة المدرسية
                  </p>
                </div>
              </div>

              {/* Textbook Quote Card */}
              <div className="bg-emerald-50 border-r-4 border-r-emerald-500 border border-emerald-200 rounded-2xl p-5 mb-6">
                <span className="text-xs font-black text-emerald-800 block mb-1">
                  نص الكتاب المدرسي – خلفية عامة:
                </span>
                <p className="text-sm sm:text-base text-emerald-950 font-bold leading-relaxed">
                  «تنظم مسابقة رمي الرمح في ضوء القواعد العامة المنظمة لها كما وردت في القانون الدولي لألعاب القوى للهواة.»
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-sky-50/80 border-2 border-sky-100 rounded-2xl p-5">
                  <span className="text-xs font-black text-emerald-700 block mb-2 arabic-num">
                    البند رقم (١)
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2">الإعلان عن المسابقة</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    يتم الإعلان الرسمي عن موعد المسابقة وإتاحة الفرصة لجميع الطلاب الممارسين والمهتمين بالاستعداد الجيد.
                  </p>
                </div>

                <div className="bg-sky-50/80 border-2 border-sky-100 rounded-2xl p-5">
                  <span className="text-xs font-black text-sky-700 block mb-2 arabic-num">
                    البند رقم (٢)
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2">تحديد مكان إقامتها</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    يحدد بدقة الملعب المعتمد المجهز بطريق اقتراب قانوني وقطاع هبوط آمن مطابق لمواصفات وزارة التربية والتعليم.
                  </p>
                </div>

                <div className="bg-sky-50/80 border-2 border-sky-100 rounded-2xl p-5">
                  <span className="text-xs font-black text-amber-700 block mb-2 arabic-num">
                    البند رقم (٣)
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2">إعلان الشروط الخاصة</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    توضيح فئة المشاركين، مواصفات الرمح المستعمل، الزي الرياضي، وإجراءات السلامة الفردية والجماعية.
                  </p>
                </div>
              </div>

              {/* Note on conduct */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-800">
                  <strong className="text-amber-900 block mb-1 font-black">تنبيه هام من الكتاب (البند ٥):</strong>
                  «يجب على المتسابق البدء في المحاولة دون تعطيل الأداء بمجرد الإذن له بذلك، وتلغى المحاولة إذا تعمد المتسابق تعطيل الأداء.»
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: Ordering by Lot */}
          {/* ======================================================== */}
          {activeStage === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                  <Shuffle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة الثانية: ترتيب المتسابقين لأخذ المحاولات
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    مبدأ تكافؤ الفرص والعدالة في تحديد أدوار الرمي
                  </p>
                </div>
              </div>

              {/* Textbook Rule */}
              <div className="bg-sky-50 border-r-4 border-r-sky-500 border border-sky-200 rounded-2xl p-5 mb-6">
                <span className="text-xs font-black text-sky-800 block mb-1">
                  نص القاعدة الواردة في الكتاب (البند ١):
                </span>
                <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed">
                  «يتم ترتيب الطلاب (المتسابقين) لأخذ محاولاتهم بالقرعة.»
                </p>
              </div>

              {/* Interactive Lot Drawer Simulation */}
              <div className="bg-sky-50/50 border-2 border-sky-100 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Dices className="w-4 h-4 text-emerald-600" />
                      محاكي إجراء القرعة وسحب أرقام الرمي
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      اضغط على زر السحب لتوليد ترتيب عشوائي عادل للمتسابقين
                    </p>
                  </div>

                  <button
                    onClick={handleShuffleLot}
                    disabled={isDrawing}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-sky-600/20"
                  >
                    <Shuffle className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
                    <span>إجراء سحب القرعة الآن</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {drawnList.map((name, index) => (
                    <div
                      key={name}
                      className="bg-white border-2 border-sky-100 p-3.5 rounded-xl flex items-center gap-3 shadow-xs"
                    >
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 arabic-num">
                        {toArabicNumerals(index + 1)}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: Number of Attempts */}
          {/* ======================================================== */}
          {activeStage === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة الثالثة: عدد المحاولات القانونية
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    تطبيق القاعدة الرسمية وفق أعداد المشاركين في المسابقة
                  </p>
                </div>
              </div>

              {/* Textbook Rules Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Case 1: More than 8 */}
                <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-5 relative overflow-hidden">
                  <span className="text-xs font-black text-amber-800 block mb-1">
                    الحالة الأولى (البند ٢ من الكتاب):
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mb-2">
                    زيادة عدد الطلاب المشتركين عن ثمانية (أكثر من ٨)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed mb-4 font-medium">
                    «في حالة زيادة عدد الطلاب المشتركين (المتسابقين) عن ثمانية طلاب تُعطى لهم ثلاث محاولات، وتُعطى للثمانية الأوائل ثلاث محاولات أخرى.»
                  </p>
                  <div className="bg-white p-3.5 rounded-xl text-xs space-y-1.5 text-slate-700 border border-amber-200 shadow-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold">المحاولات التمهيدية (لكل طالب):</span>
                      <strong className="text-amber-700 font-black arabic-num">
                        {toArabicNumerals(3)} محاولات
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">المحاولات الإضافية (للـ ٨ الأوائل فقط):</span>
                      <strong className="text-emerald-700 font-black arabic-num">
                        {toArabicNumerals(3)} محاولات أخرى
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Case 2: 8 or fewer */}
                <div className="bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-5 relative overflow-hidden">
                  <span className="text-xs font-black text-emerald-800 block mb-1">
                    الحالة الثانية (البند ٣ من الكتاب):
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mb-2">
                    عدد الطلاب المشتركين ثمانية طلاب فأقل (≤ ٨)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed mb-4 font-medium">
                    «في حالة ما إذا كان عدد الطلاب المشتركين (المتسابقين) ثمانية طلاب فأقل تُعطى لكل متسابق ست محاولات.»
                  </p>
                  <div className="bg-white p-3.5 rounded-xl text-xs space-y-1.5 text-slate-700 border border-emerald-200 shadow-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold">المحاولات المباشرة لكل متسابق:</span>
                      <strong className="text-emerald-700 font-black arabic-num">
                        {toArabicNumerals(6)} محاولات مباشرة
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>الاستبعاد التمهيدي:</span>
                      <span>لا يوجد استبعاد (الجميع يكمل ٦ محاولات)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Simulator */}
              <div className="bg-sky-50/60 border-2 border-sky-100 rounded-2xl p-5">
                <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  مختبر تفاعلي لتطبيق قاعدة عدد المحاولات:
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="text-xs text-slate-600 block mb-1 font-bold">
                      حدد عدد الطلاب المشتركين المسجلين في المسابقة:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="2"
                        max="24"
                        value={participantCount}
                        onChange={(e) => setParticipantCount(Number(e.target.value))}
                        className="flex-1 accent-emerald-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-base font-black text-emerald-800 px-3.5 py-1.5 bg-white border-2 border-emerald-200 rounded-xl arabic-num min-w-20 text-center shadow-xs">
                        {toArabicNumerals(participantCount)} طالب
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-sky-100 rounded-2xl text-xs text-slate-800 min-w-72 shadow-xs">
                    <span className="font-black text-emerald-700 block mb-1">
                      النظام القانوني المطبق:
                    </span>
                    {participantCount > 8 ? (
                      <p className="leading-relaxed">
                        أكثر من ٨ طلاب: يُمنح الجميع{' '}
                        <strong className="text-amber-700 font-bold arabic-num">
                          {toArabicNumerals(3)}
                        </strong>{' '}
                        محاولات أولى، ثم يتأهل الثمانية الأوائل فقط لأخذ{' '}
                        <strong className="text-emerald-700 font-bold arabic-num">
                          {toArabicNumerals(3)}
                        </strong>{' '}
                        محاولات نهائية إضافية.
                      </p>
                    ) : (
                      <p className="leading-relaxed">
                        ٨ طلاب فأقل: يُمنح كل طالب من الـ{' '}
                        <strong className="text-emerald-700 font-bold arabic-num">
                          {toArabicNumerals(participantCount)}
                        </strong>{' '}
                        طلاب{' '}
                        <strong className="text-emerald-700 font-bold arabic-num">
                          {toArabicNumerals(6)}
                        </strong>{' '}
                        محاولات كاملة مباشرة.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 4: Foul Conditions & Flags */}
          {/* ======================================================== */}
          {activeStage === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة الرابعة: الحالات التي تعد فيها المحاولة فاشلة
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    البند ٤ والبند ٧ من الإجراءات الواردة في الكتاب المدرسي
                  </p>
                </div>
              </div>

              {/* Flags explanation card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center shadow-xs">
                    <span className="w-4 h-4 bg-white border border-slate-300 rounded-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">الراية البيضاء:</span>
                    <span className="text-xs text-slate-600 font-medium">
                      تُرفع للمحاولة القانونية الصحيحة المعتمدة
                    </span>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shadow-xs">
                    <span className="w-4 h-4 bg-red-600 rounded-sm" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-red-700 block">الراية الحمراء:</span>
                    <span className="text-xs text-slate-600 font-medium">
                      تُرفع للمحاولة الفاشلة وتلغى النتيجة
                    </span>
                  </div>
                </div>
              </div>

              {/* The 4 textbook conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {textbookFoulConditions.map((foul, idx) => (
                  <div
                    key={foul.id}
                    className="bg-white border-2 border-rose-100 rounded-2xl p-5 hover:border-red-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-xs font-black text-red-700 arabic-num">
                        الحالة رقم ({toArabicNumerals(idx + 1)})
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mb-2 leading-relaxed">
                      {foul.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                      {foul.description}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-950 font-bold">
                      <strong className="block mb-0.5 text-red-700">نص الكتاب:</strong>
                      «{foul.bookQuote}»
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 5: Method of Measurement */}
          {/* ======================================================== */}
          {activeStage === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة الخامسة: طريقة قياس مسافة الرمية
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    البند ٦ والبند ٨ من الإجراءات الواردة في الكتاب المدرسي
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-amber-50 border-r-4 border-r-amber-500 border border-amber-200 rounded-2xl p-5">
                  <span className="text-xs font-black text-amber-800 block mb-1">
                    القاعدة الأولى في القياس (البند ٦):
                  </span>
                  <p className="text-sm text-slate-900 font-bold leading-relaxed">
                    «تقاس المسافة من أقرب علامة (أثر) أحدثه الرمح إلى الحافة الداخلية لقوس الرمي، ويجب أن يصل الشريط إلى مركز نصف قطر قوس الرمي.»
                  </p>
                </div>

                <div className="bg-emerald-50 border-r-4 border-r-emerald-500 border border-emerald-200 rounded-2xl p-5">
                  <span className="text-xs font-black text-emerald-800 block mb-1">
                    القاعدة الثانية في القياس (البند ٨):
                  </span>
                  <p className="text-sm text-slate-900 font-bold leading-relaxed">
                    «أثناء عملية القياس يكون الجزء الدال على المسافة من الشريط عند قوس الرمي، ويكون صفر القياس مكان سقوط الرمح.»
                  </p>
                </div>
              </div>

              {/* Visual Measurement Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-sky-50/70 border-2 border-sky-100 rounded-2xl p-4 text-center">
                  <span className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-700 font-black text-xs flex items-center justify-center mx-auto mb-2 arabic-num shadow-xs">
                    {toArabicNumerals(1)}
                  </span>
                  <h5 className="text-xs font-black text-slate-900 mb-1">نقطة الصفر (البداية)</h5>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    يوضع صفر شريط القياس بدقة عند أقرب علامة أحدثها سن الرمح في الأرض.
                  </p>
                </div>

                <div className="bg-sky-50/70 border-2 border-sky-100 rounded-2xl p-4 text-center">
                  <span className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-700 font-black text-xs flex items-center justify-center mx-auto mb-2 arabic-num shadow-xs">
                    {toArabicNumerals(2)}
                  </span>
                  <h5 className="text-xs font-black text-slate-900 mb-1">مسار الشريط</h5>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    يمتد شريط القياس في خط مستقيم مروراً بالحافة الداخلية لقوس الرمي باتجاه مركز الدائرة (نصف قطر ٨م).
                  </p>
                </div>

                <div className="bg-sky-50/70 border-2 border-sky-100 rounded-2xl p-4 text-center">
                  <span className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-700 font-black text-xs flex items-center justify-center mx-auto mb-2 arabic-num shadow-xs">
                    {toArabicNumerals(3)}
                  </span>
                  <h5 className="text-xs font-black text-slate-900 mb-1">قراءة النتيجة</h5>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    تُقرأ المسافة المسجلة عند الحافة الداخلية لقوس الرمي وتُقرب لأقرب سنتيمتر.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 6: Specifications of Javelin and Field */}
          {/* ======================================================== */}
          {activeStage === 6 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة السادسة: مواصفات الرمح ومنطقة الرمي
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    الأبعاد الرسمية المقررة في الكتاب المدرسي والشكلين رقم (١) ورقم (٢)
                  </p>
                </div>
              </div>

              {/* Javelin Specifications Table */}
              <div className="mb-8">
                <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  أولاً: مواصفات الرمح (The Javelin):
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <thead className="bg-slate-100 text-slate-800">
                      <tr className="border-b border-slate-200 font-black">
                        <th className="p-3">عنصر المقارنة والمواصفة</th>
                        <th className="p-3">مسابقة الرجال</th>
                        <th className="p-3">مسابقة السيدات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                      <tr className="bg-white">
                        <td className="p-3 font-bold text-slate-900">الطول الكلي للرمح</td>
                        <td className="p-3 arabic-num font-bold text-emerald-800">لا يقل عن ({toArabicNumerals(260)}) سم</td>
                        <td className="p-3 arabic-num font-bold text-emerald-800">لا يقل عن ({toArabicNumerals(220)}) سم</td>
                      </tr>
                      <tr className="bg-sky-50/40">
                        <td className="p-3 font-bold text-slate-900">الوزن الكلي للرمح</td>
                        <td className="p-3 arabic-num font-bold text-sky-800">لا يقل عن ({toArabicNumerals(800)}) جرام</td>
                        <td className="p-3 arabic-num font-bold text-sky-800">لا يقل عن ({toArabicNumerals(600)}) جرام</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-bold text-slate-900">المسافة من سن الرمح إلى مركز ثقله</td>
                        <td className="p-3 arabic-num">
                          بين ({toArabicNumerals(90)}) سم و ({toArabicNumerals(106)}) سم
                        </td>
                        <td className="p-3 arabic-num">
                          بين ({toArabicNumerals(80)}) سم و ({toArabicNumerals(95)}) سم
                        </td>
                      </tr>
                      <tr className="bg-sky-50/40">
                        <td className="p-3 font-bold text-slate-900">طول القبضة (الحبل المبروم)</td>
                        <td className="p-3 arabic-num font-bold text-purple-800">({toArabicNumerals(16)}) سم</td>
                        <td className="p-3 arabic-num font-bold text-purple-800">({toArabicNumerals(15)}) سم</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-bold text-slate-900">محيط القبضة عند طرفيها</td>
                        <td className="p-3 arabic-num" colSpan={2}>
                          لا يزيد عن محيط الرمح بمقدار ({toArabicNumerals('2.5')}) اثنين ونصف سنتيمتر بدون عقد أو بروز
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Figure 1: Gripping methods */}
              <div className="bg-sky-50/50 border-2 border-sky-100 rounded-2xl p-5 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-emerald-800">
                    الشكل رقم (١) بالكتاب: طرق مسك الرمح الشائعة
                  </h4>
                  <span className="text-[11px] text-slate-500 font-bold">حول حبل القبضة بدون عقد</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <strong className="block text-slate-900 mb-1 font-black">١. المسكة الأمريكية:</strong>
                    <span className="text-slate-600 font-medium">
                      استناد الإبهام والسبابة مباشرة خلف الحافة الخلفية لحبل القبضة.
                    </span>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <strong className="block text-slate-900 mb-1 font-black">٢. المسكة الفنلندية:</strong>
                    <span className="text-slate-600 font-medium">
                      استناد الإبهام والوسطى خلف الحبل مع مد السبابة باستقامة على جسم الرمح.
                    </span>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-sky-100 shadow-xs">
                    <strong className="block text-slate-900 mb-1 font-black">٣. مسكة الشوكة («V»):</strong>
                    <span className="text-slate-600 font-medium">
                      إحكام القبض بوضع الرمح بين إصبعي السبابة والوسطى.
                    </span>
                  </div>
                </div>
              </div>

              {/* Cartoon Illustration Banner of Sector and Field */}
              <div className="mb-6 rounded-2xl overflow-hidden border-2 border-sky-100 shadow-sm">
                <img
                  src="/src/assets/images/cartoon_field_sector_1791221046075.jpg"
                  alt="رسم كرتوني لمقطع رمي الرمح والأعلام والشريط"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 sm:h-64 object-cover object-center"
                />
              </div>

              {/* Runway and Sector Specs (Figure 2) */}
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  ثانياً: طريق الجري (الاقتراب) ومقطع الرمي (الشكل رقم ٢):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100">
                    <span className="text-sky-800 font-bold block mb-1">طريق الجري (الاقتراب):</span>
                    <strong className="text-slate-900 block arabic-num font-black text-sm">
                      عرض ({toArabicNumerals(4)}) أمتار
                    </strong>
                    <span className="text-[11px] text-slate-600 font-medium">
                      خطان بعرض ({toArabicNumerals(5)}) سم، وطول لا يقل عن ({toArabicNumerals(30)}) م
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800 font-bold block mb-1">قوس الرمي:</span>
                    <strong className="text-slate-900 block arabic-num font-black text-sm">
                      نصف قطر ({toArabicNumerals(8)}) أمتار
                    </strong>
                    <span className="text-[11px] text-slate-600 font-medium">
                      لوحة خشبية/معدنية بيضاء عرضها ({toArabicNumerals(7)}) سم وخطين ({toArabicNumerals(75)}) سم
                    </span>
                  </div>

                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
                    <span className="text-amber-800 font-bold block mb-1">زاوية مقطع الرمي:</span>
                    <strong className="text-slate-900 block arabic-num font-black text-sm">
                      ({toArabicNumerals(29)}) درجة
                    </strong>
                    <span className="text-[11px] text-slate-600 font-medium">
                      تلتقي خطوط المقطع عند مركز دائرة القوس (الشكل رقم ٢)
                    </span>
                  </div>

                  <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100">
                    <span className="text-rose-800 font-bold block mb-1">رايات تحديد القطاع:</span>
                    <strong className="text-slate-900 block arabic-num font-black text-sm">
                      ارتفاع ({toArabicNumerals(60)}) سم
                    </strong>
                    <span className="text-[11px] text-slate-600 font-medium">
                      أبعاد الراية ({toArabicNumerals(18)}) سم × ({toArabicNumerals(10)}) سم
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 7: Scoreboard and Results */}
          {/* ======================================================== */}
          {activeStage === 7 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    المرحلة السابعة: جدول تسجيل نتائج المحاولات وتحديد الفائزين
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    استمارة التحكيم الرسمية المعتمدة بالأرقام العربية الشرقية
                  </p>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-right text-xs border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <thead className="bg-slate-100 text-slate-800 font-black">
                    <tr className="border-b border-slate-200">
                      <th className="p-3">رقم الصدر</th>
                      <th className="p-3">اسم المتسابق</th>
                      <th className="p-3">المحاولة ١</th>
                      <th className="p-3">المحاولة ٢</th>
                      <th className="p-3">المحاولة ٣</th>
                      <th className="p-3">المحاولة ٤</th>
                      <th className="p-3">المحاولة ٥</th>
                      <th className="p-3">المحاولة ٦</th>
                      <th className="p-3 bg-emerald-100 text-emerald-900">أفضل نتيجة</th>
                      <th className="p-3">الترتيب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {scores
                      .map(s => ({ ...s, best: calculateBest(s) }))
                      .sort((a, b) => b.best - a.best)
                      .map((competitor, idx) => (
                        <tr key={competitor.id} className="hover:bg-sky-50/50 transition-colors">
                          <td className="p-3 arabic-num font-black text-slate-900">{toArabicNumerals(competitor.bib)}</td>
                          <td className="p-3 font-bold text-slate-900">{competitor.name}</td>
                          <td className="p-3 arabic-num">
                            {competitor.attempt1 === 'F' ? (
                              <span className="text-red-600 font-black">ف</span>
                            ) : (
                              `${toArabicNumerals(competitor.attempt1)} م`
                            )}
                          </td>
                          <td className="p-3 arabic-num">
                            {competitor.attempt2 === 'F' ? (
                              <span className="text-red-600 font-black">ف</span>
                            ) : (
                              `${toArabicNumerals(competitor.attempt2)} م`
                            )}
                          </td>
                          <td className="p-3 arabic-num">
                            {competitor.attempt3 === 'F' ? (
                              <span className="text-red-600 font-black">ف</span>
                            ) : (
                              `${toArabicNumerals(competitor.attempt3)} م`
                            )}
                          </td>
                          <td className="p-3 arabic-num">
                            {competitor.attempt4 === 'F' ? (
                              <span className="text-red-600 font-black">ف</span>
                            ) : (
                              `${toArabicNumerals(competitor.attempt4 || 0)} م`
                            )}
                          </td>
                          <td className="p-3 arabic-num">
                            {competitor.attempt5 === 'F' ? (
                              <span className="text-red-600 font-black">ف</span>
                            ) : (
                              `${toArabicNumerals(competitor.attempt5 || 0)} م`
                            )}
                          </td>
                          <td className="p-3 arabic-num">
                            {competitor.attempt6 === 'F' ? (
                              <span className="text-red-600 font-black">ف</span>
                            ) : (
                              `${toArabicNumerals(competitor.attempt6 || 0)} م`
                            )}
                          </td>
                          <td className="p-3 arabic-num font-black text-emerald-800 bg-emerald-50">
                            {toArabicNumerals(competitor.best.toFixed(2))} م
                          </td>
                          <td className="p-3 font-bold">
                            {idx === 0 && (
                              <span className="text-amber-600 font-black flex items-center gap-1">
                                الأول 🥇
                              </span>
                            )}
                            {idx === 1 && (
                              <span className="text-slate-600 font-black flex items-center gap-1">
                                الثاني 🥈
                              </span>
                            )}
                            {idx === 2 && (
                              <span className="text-amber-800 font-black flex items-center gap-1">
                                الثالث 🥉
                              </span>
                            )}
                            {idx > 2 && (
                              <span className="text-slate-500 arabic-num">
                                المركز {toArabicNumerals(idx + 1)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-sky-50 border-2 border-sky-100 rounded-2xl p-4 text-xs text-slate-700 font-medium">
                <span className="font-black text-slate-900 block mb-1">ملاحظة تحكيمية:</span>
                المحاولات الفاشلة تدون بحرف (ف) باللون الأحمر، وتعتمد أطول مسافة حققها المتسابق في أي محاولة صحيحة لتحديد مركزه النهائي.
              </div>
            </div>
          )}

          {/* Navigation Controls between Stages */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-sky-100">
            <button
              onClick={() => {
                if (activeStage > 1) {
                  setActiveStage(activeStage - 1);
                  sound.playSuccessChime();
                }
              }}
              disabled={activeStage === 1}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>المرحلة السابقة</span>
            </button>

            <span className="text-xs font-bold text-slate-600 arabic-num">
              المرحلة {toArabicNumerals(activeStage)} من {toArabicNumerals(stagesList.length)}
            </span>

            <button
              onClick={() => {
                if (activeStage < stagesList.length) {
                  setActiveStage(activeStage + 1);
                  sound.playSuccessChime();
                }
              }}
              disabled={activeStage === stagesList.length}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
            >
              <span>المرحلة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
