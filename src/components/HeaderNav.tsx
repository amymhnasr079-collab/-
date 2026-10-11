/**
 * Top Bar component for the standalone 3D Simulation app:
 * [Zone 1: Brand title wordmark] - [Zone 2: Curriculum & Teacher Badges] - [Zone 3: Sound & Safety actions]
 */

import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Box } from 'lucide-react';

interface HeaderNavProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSafetyModal: () => void;
  onResetSimulation?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenSafetyModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
              <Box className="w-5 h-5 text-white" />
            </span>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 block leading-tight">
                محاكاة رمي الرمح 3D
              </span>
              <span className="text-[10px] text-slate-500 font-bold block sm:hidden">
                الصف الحادي عشر · أ. سالمة الحكماني
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Curriculum, Grade & Teacher Credentials */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl border border-emerald-200">
            سلطنة عُمان · التربية الرياضية
          </span>
          <span className="bg-sky-100 text-sky-800 font-extrabold px-3 py-1 rounded-xl border border-sky-200">
            الصف الحادي عشر
          </span>
          <span className="bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>إعداد الأستاذة: سالمة الحكماني</span>
          </span>
        </div>

        {/* Zone 3: Safety & Sound Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors whitespace-nowrap shadow-xs"
            title="دليل السلامة والأمان"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>قواعد السلامة</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

