import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { Translations } from '../utils/translations';

interface AdMobBannerSimProps {
  t: Translations;
  slotName?: string;
  isPro?: boolean;
}

export const AdMobBannerSim: React.FC<AdMobBannerSimProps> = ({ t, slotName = 'Adaptive Banner', isPro = false }) => {
  const [showInfo, setShowInfo] = useState(false);

  // In Pro mode, no ads are displayed anywhere in the application
  if (isPro) {
    return null;
  }

  return (
    <div className="w-full my-3 px-2">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-900/60 p-2.5 shadow-sm text-center">
        {/* AdMob Policy Badge */}
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Ad · Test Mode
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Google AdMob (320x50)
            </span>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-0.5"
            aria-label="AdMob Integration Information"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Banner Mock Content */}
        <div className="h-12 flex items-center justify-between px-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center space-x-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#0877ED]/10 text-[#0877ED] flex items-center justify-center font-bold text-xs flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#0877ED]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                AdMob Policy Compliant Placement
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Test Unit: ca-app-pub-3940256099942544/6300978111
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[#0877ED] dark:text-[#00B8D9] px-2 py-1 rounded bg-[#0877ED]/10 dark:bg-[#00B8D9]/10 flex-shrink-0">
            Learn More
          </span>
        </div>

        {showInfo && (
          <div className="mt-2 text-left p-2.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-blue-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1 font-semibold text-slate-800 dark:text-white">
              <span>AdMob Integration Details</span>
              <button onClick={() => setShowInfo(false)}>
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <p className="text-[11px] leading-relaxed">
              In production Android builds, this slot renders native <code className="text-[#0877ED]">AdView</code> with Google Mobile Ads SDK & UMP Consent Dialog. Ads are never shown over active camera viewfinder or essential navigation controls.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
