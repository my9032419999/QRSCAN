import React from 'react';
import { Settings, Globe, QrCode } from 'lucide-react';
import { Language, Translations } from '../utils/translations';
import quickQrLogo from '../assets/quickqr-logo.png';

interface TopAppBarProps {
  t: Translations;
  currentLang: Language;
  onToggleLang: () => void;
  onOpenSettings: () => void;
  onOpenAndroidProject?: () => void;
  isPro: boolean;
  onOpenProModal: () => void;
  formattedMonthlyPrice?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  t,
  currentLang,
  onToggleLang,
  onOpenSettings,
  isPro,
  onOpenProModal,
  formattedMonthlyPrice = '₹149'
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B111E]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-gradient-to-tr from-[#0877ED] to-[#00B8D9] flex items-center justify-center flex-shrink-0">
            <QrCode className="w-5 h-5 text-white absolute opacity-80" />
            <img
              src={quickQrLogo}
              alt="QuickQR Logo"
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                {t.shortName}
              </h1>
              {isPro ? (
                <button
                  onClick={onOpenProModal}
                  aria-label="Pro Mode Active"
                  className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs"
                >
                  PRO · AD-FREE
                </button>
              ) : (
                <button
                  onClick={onOpenProModal}
                  aria-label="Upgrade to Pro Mode"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0877ED]/10 text-[#0877ED] hover:bg-[#0877ED]/20 dark:bg-[#0877ED]/20 transition"
                >
                  GET PRO ({formattedMonthlyPrice}/mo)
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            aria-label="Toggle language between English and Telugu"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Globe className="w-3.5 h-3.5 text-[#0877ED]" />
            <span>{currentLang === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
