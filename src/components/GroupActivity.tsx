/**
 * Section: نشاط جماعي (Group Activity)
 * «نحن فريق تنظيم المسابقة»
 * Role distribution (الحكم، المتسابق، مسؤول القياس، مسجل النتائج، منظم المشاركين، مسؤول السلامة)
 * and step-by-step interactive workflow simulation of mini competition management.
 */

import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Shield, ArrowLeft, ArrowRight,
  Sparkles, RefreshCw, ClipboardCheck, AlertCircle
} from 'lucide-react';
import { organizationRoles } from '../data/lessonData';
import { toArabicNumerals } from '../utils/arabicNumerals';
import { sound } from '../utils/soundEffects';

interface WorkflowStep {
  id: number;
  title: string;
  responsibleRole: string;
  actionText: string;
  checklist: string[];
}

export const GroupActivity: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('referee');
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: 'ترتيب المشاركين وإجراء القرعة',
      responsibleRole: 'مسؤول تنظيم المشاركين والنداء',
      actionText: 'سحب أرقام القرعة للطلاب وتدوين الأسماء في كشف ترتيب المحاولات الرسمي.',
      checklist: ['توزيع أرقام الصدر', 'إجراء القرعة بشفافية', 'تسليم الكشف لمسجل النتائج']
    },
    {
      id: 2,
      title: 'تحديد دور كل طالب وتوزيع الأدوار',
      responsibleRole: 'فريق العمل بالكامل بإشراف المعلم',
      actionText: 'توزيع المهام الستة على أعضاء المجموعة وتبادل الأدوار ليعيش كل طالب تجربة الإدارة.',
      checklist: ['تحديد الحكم العام', 'تحديد مسؤولي القياس والسلامة', 'تعيين مسجل النتائج']
    },
    {
      id: 3,
      title: 'تجهيز وتفقد منطقة الرمي',
      responsibleRole: 'مسؤول السلامة والمنظمون',
      actionText: 'فحص طريق الاقتراب (عرض ٤ أمتار) والتأكد من وضوح خط قوس الرمي الأبيض والأعلام الجانبية.',
      checklist: ['طريق الاقتراب سليم ونظيف', 'القوس الأبيض ثابت', 'رايات المقطع مثبتة بارتفاع ٦٠ سم']
    },
    {
      id: 4,
      title: 'التأكد التام من اشتراطات السلامة',
      responsibleRole: 'مسؤول السلامة ومعلم الرياضة',
      actionText: 'إخلاء قطاع الهبوط تماماً من أي شخص ووقوف الطلاب خلف شريط الأمان المحدد.',
      checklist: ['قطاع الهبوط خالٍ ١٠٠٪', 'الطلاب في المنطقة الآمنة', 'إشارة الأمان الخضراء جاهزة']
    },
    {
      id: 5,
      title: 'النداء وتنفيذ المحاولة',
      responsibleRole: 'المتسابق بإذن من الحكم العام',
      actionText: 'النداء على المتسابق، والبدء في المحاولة دون تأخير بعد إشارة الحكم والانطلاق في طريق الجري.',
      checklist: ['إعطاء إشارة البدء', 'الرمي من خلف القوس', 'بقاء المتسابق بالمنطقة حتى سقوط الرمح']
    },
    {
      id: 6,
      title: 'تحديد صحة المحاولة ورفع الراية',
      responsibleRole: 'رئيس الحكام (الحكم العام)',
      actionText: 'فحص ملامسة القوس وسقوط الرمح داخل زاوية ٢٩ درجة وإحداث أثر بالسن، ورفع الراية البيضاء أو الحمراء.',
      checklist: ['فحص قوس الرمي', 'فحص زاوية المقطع', 'رفع الراية البيضاء أو الحمراء']
    },
    {
      id: 7,
      title: 'قياس مسافة الرمية بشريط القياس',
      responsibleRole: 'مسؤول القياس',
      actionText: 'وضع صفر الشريط عند أقرب علامة أحدثها الرمح ومده لمركز نصف قطر القوس وقراءة المسافة عند الحافة الداخلية.',
      checklist: ['صفر الشريط عند الأثر', 'امتداد نحو مركز القوس (٨م)', 'قراءة المسافة عند القوس']
    },
    {
      id: 8,
      title: 'تسجيل النتيجة في الاستمارة',
      responsibleRole: 'مسؤول تسجيل النتائج',
      actionText: 'تدوين المسافة بدقة بالأرقام العربية الشرقية (أو تدوين ف للمحاولة الفاشلة) وإعلانها بصوت واضح.',
      checklist: ['التدوين بالأرقام الشرقية', 'تسجيل المحاولات الفاشلة بحرف ف', 'إبلاغ المتسابق بالنتيجة']
    },
    {
      id: 9,
      title: 'تحديد أفضل نتيجة وإعلان الفائزين',
      responsibleRole: 'فريق التحكيم المشترك',
      actionText: 'مقارنة محاولات كل طالب واختيار أطول رمية صحيحة، وترتيب الثلاثة الأوائل وتكريمهم بروح رياضية.',
      checklist: ['فرز أفضل رمية لكل طالب', 'ترتيب المراكز الثلاثة الأولى', 'تحية الروح الرياضية']
    }
  ];

  const handleCompleteStep = (stepId: number) => {
    sound.playSuccessChime();
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (stepId < workflowSteps.length) {
      setCurrentWorkflowStep(stepId + 1);
    }
  };

  const currentRoleData = organizationRoles.find(r => r.id === selectedRole) || organizationRoles[0];
  const currentStep = workflowSteps.find(s => s.id === currentWorkflowStep) || workflowSteps[0];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-sky-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-xs">
            نشاط تطبيقي تعاوني
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
            «نحن فريق تنظيم المسابقة»
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
            توزيع الأدوار الستة وإدارة مسابقة رمي رمح مصغرة بالفصل وفق خطوات عملية محاكية
          </p>
        </div>

        {/* Part 1: Interactive Roles Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              أولاً: بطاقات الأدوار الستة في فريق المسابقة (اختر دورك):
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              يتبادل الطلاب الأدوار دورياً
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
            {organizationRoles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    sound.playSuccessChime();
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-white'
                  }`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-emerald-700 mb-2 arabic-num shadow-xs">
                    {toArabicNumerals(role.badgeNumber)}
                  </span>
                  <span className="text-xs font-black leading-tight line-clamp-2 text-slate-900">
                    {role.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Role Detailed Card */}
          <div className="bg-sky-50/60 border-2 border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-sky-200 mb-4">
              <div>
                <span className="text-xs font-black text-emerald-700 block mb-1 arabic-num">
                  الدور رقم ({toArabicNumerals(currentRoleData.badgeNumber)}):
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {currentRoleData.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-xs font-bold text-amber-800 shadow-xs">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>أولوية السلامة: {currentRoleData.safetyFocus}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-5 rounded-2xl border-2 border-sky-100 shadow-xs">
                <strong className="text-slate-900 block mb-2 font-black flex items-center gap-1.5 text-sm">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  المهام والمسؤوليات الأساسية:
                </strong>
                <ul className="space-y-2 text-slate-700 pr-4 list-disc marker:text-emerald-500 font-medium">
                  {currentRoleData.duties.map((duty, idx) => (
                    <li key={idx} className="leading-relaxed">{duty}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-sky-100 shadow-xs">
                <strong className="text-slate-900 block mb-2 font-black flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  التجهيزات والأدوات المطلوبة لهذا الدور:
                </strong>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentRoleData.equipmentNeeded.map((eq, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs font-bold"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                  يجب تدريب الطلاب على تسلم وتسليم هذه الأدوات بحرص وتفقدها قبل بدء المنافسة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Step-by-Step Simulation Workflow */}
        <div className="bg-sky-50/50 border-2 border-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                ثانياً: محاكاة مراحل إدارة المسابقة خطوة بخطوة (٩ خطوات)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                نفّذ الخطوة الحالية واضغط على إتمام الخطوة للانتقال للمرحلة التالية
              </p>
            </div>

            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300 arabic-num shadow-xs">
              تم إنجاز {toArabicNumerals(completedSteps.length)} من {toArabicNumerals(workflowSteps.length)} خطوات
            </span>
          </div>

          {/* Steps Timeline Horizontal Tracker */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
            {workflowSteps.map((step) => {
              const isDone = completedSteps.includes(step.id);
              const isCurrent = currentWorkflowStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentWorkflowStep(step.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] arabic-num font-black">
                    {isDone ? '✓' : toArabicNumerals(step.id)}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Panel */}
          <div className="bg-white border-2 border-sky-100 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-black text-emerald-700 arabic-num">
                الخطوة رقم ({toArabicNumerals(currentStep.id)}): {currentStep.title}
              </span>
              <span className="text-xs text-sky-800 font-bold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                المسؤول: {currentStep.responsibleRole}
              </span>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed mb-4 font-bold">
              {currentStep.actionText}
            </p>

            <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 mb-4">
              <strong className="text-xs font-black text-slate-900 block mb-2">
                قائمة التحقق الميداني:
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 font-medium">
                {currentStep.checklist.map((chk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleCompleteStep(currentStep.id)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إتمام الخطوة والتالي</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
