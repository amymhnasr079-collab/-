/**
 * Comprehensive Safety Guidelines Modal
 * «أولوية السلامة والأمان في مسابقات رمي الرمح المدرسية»
 */

import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react';
import { toArabicNumerals } from '../utils/arabicNumerals';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyGuidelinesModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      num: 1,
      title: 'إخلاء قطاع الهبوط والرمي تماماً',
      desc: 'يمنع منعاً باتاً تواجد أي طالب أو شخص داخل قطاع الرمي أو منطقة الهبوط أثناء الاستعداد أو التنفيذ.'
    },
    {
      num: 2,
      title: 'الانتظار خلف خط الأمان المحدد',
      desc: 'يقف جميع الطلاب غير المشاركين خلف حاجز الأمان على جانبي طريق الجري بعيداً عن مسار الرمح بمسافة كافية.'
    },
    {
      num: 3,
      title: 'الإشراف المباشر لمعلم التربية الرياضية',
      desc: 'لا تتم أي رمية أو نشاط إلا تحت الإشراف المباشر والمستمر من معلم المادة وبإشارة صريحة من الحكم.'
    },
    {
      num: 4,
      title: 'طريقة نقل واسترجاع الرمح',
      desc: 'يجب إعادة الرمح مشياً على الأقدام وحمله في وضع رأسي (عمودياً نحو الأرض)، ويحظر قذفه أو رميه للخلف إطلاقاً.'
    },
    {
      num: 5,
      title: 'عدم الاقتراب من الرمح قبل الإذن',
      desc: 'لا يدخل مسؤول القياس أو أي طالب لقطاع الهبوط إلا بعد استقرار الرمح تماماً على الأرض وسماع صافرة الأمان.'
    },
    {
      num: 6,
      title: 'فحص أدوات وأرضية الميدان',
      desc: 'التأكد من جودة سن الرمح المعدني، خلو طريق الاقتراب من الماء أو العوائق، وثبات لوحة القوس المحاذية للأرض.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white border-2 border-sky-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              دليل السلامة والأمان الميداني
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              الاشتراطات الصارمة لسلامة الطلاب في مسابقات رمي الرمح المدرسية
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {rules.map((r) => (
            <div
              key={r.num}
              className="bg-amber-50/50 border-2 border-amber-100 p-4 rounded-2xl flex items-start gap-3.5 shadow-xs"
            >
              <span className="w-7 h-7 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xs shrink-0 arabic-num">
                {toArabicNumerals(r.num)}
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
                  {r.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/30"
          >
            فهمت الإرشادات وألتزم بها
          </button>
        </div>
      </div>
    </div>
  );
};
