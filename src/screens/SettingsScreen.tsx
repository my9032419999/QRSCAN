import React, { useState } from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  Monitor, 
  Vibrate, 
  Volume2, 
  Copy, 
  Flashlight, 
  Repeat, 
  ShieldCheck, 
  FileText, 
  Star, 
  Share2, 
  Info, 
  Trash2, 
  Check, 
  X,
  Heart,
  ChevronRight,
  UploadCloud,
  Download,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Translations, Language } from '../utils/translations';
import { CurrencyType, ProPricingPlan, PRO_PLANS } from '../utils/billing';
import quickQrLogo from '../assets/quickqr-logo.png';

interface SettingsScreenProps {
  t: Translations;
  currentLang: Language;
  onSetLang: (lang: Language) => void;
  theme: 'light' | 'dark' | 'system';
  onSetTheme: (theme: 'light' | 'dark' | 'system') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  autoCopy: boolean;
  onToggleAutoCopy: () => void;
  continuousMode: boolean;
  onToggleContinuous: () => void;
  defaultFlashlight: boolean;
  onToggleDefaultFlashlight: () => void;
  onClearAllData: () => void;
  isPro: boolean;
  onTogglePro: () => void;
  onOpenProModal: () => void;
  currentCurrency?: CurrencyType;
  onSelectCurrency?: (currency: CurrencyType) => void;
  plan?: ProPricingPlan;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  t,
  currentLang,
  onSetLang,
  theme,
  onSetTheme,
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  autoCopy,
  onToggleAutoCopy,
  continuousMode,
  onToggleContinuous,
  defaultFlashlight,
  onToggleDefaultFlashlight,
  onClearAllData,
  isPro,
  onTogglePro,
  onOpenProModal,
  currentCurrency = 'INR',
  onSelectCurrency = () => {},
  plan = PRO_PLANS.INR
}) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | 'rate' | 'playstore' | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QuickQR – QR & Barcode Scanner',
        text: 'Download QuickQR: Scan Fast. Create Easy. Offline-first Android QR & barcode scanner designed by Jagadeesh.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-28">
      {/* Membership & Google Play Billing Section */}
      <div className="bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-[#131E32] dark:via-[#131E32] dark:to-slate-900 rounded-2xl p-4 border border-blue-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{t.currentPlan}</span>
          </h3>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isPro
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}>
            {isPro ? t.proBadge : t.normalBadge}
          </span>
        </div>

        {/* Plan Details Card */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {isPro ? t.proActivated : t.normalModeActive}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isPro
                ? 'All Google AdMob ads removed · Unlimited features active'
                : `${plan.formattedMonthly}${plan.perMonthSuffix} (${plan.targetRegion}) · Auto-renews monthly`}
            </p>
          </div>
          {!isPro && (
            <button
              onClick={onOpenProModal}
              className="px-3 py-2 bg-gradient-to-r from-[#0877ED] to-[#00B8D9] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition flex-shrink-0"
            >
              Get Pro ({plan.formattedMonthly}/mo)
            </button>
          )}
        </div>

        {/* Currency & Geolocation Selector */}
        <div className="flex items-center justify-between py-1 text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Payment Currency:</span>
            <span className="text-[10px] text-slate-400 ml-1">Auto-applied symbol ({plan.symbol})</span>
          </div>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
            {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyType[]).map((c) => (
              <button
                key={c}
                onClick={() => onSelectCurrency(c)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded transition ${
                  currentCurrency === c
                    ? 'bg-[#0877ED] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {PRO_PLANS[c].symbol} {c}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Testing Toggle: Switch between Pro Mode & Normal Mode */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.toggleProModeForTesting}
            </p>
            <p className="text-[10px] text-slate-400">
              Instant test switch between Ad-Free Pro and Ad-Supported Normal
            </p>
          </div>
          <button
            onClick={onTogglePro}
            aria-label="Toggle Pro Mode"
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              isPro ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              isPro ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* General Section */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Preferences
        </h3>

        {/* Language Selection */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.languageSetting}</p>
              <p className="text-xs text-slate-400">English / తెలుగు</p>
            </div>
          </div>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
            <button
              onClick={() => onSetLang('en')}
              className={`px-3 py-1 text-xs font-bold rounded ${
                currentLang === 'en' ? 'bg-[#0877ED] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSetLang('te')}
              className={`px-3 py-1 text-xs font-bold rounded ${
                currentLang === 'te' ? 'bg-[#0877ED] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.themeSetting}</p>
              <p className="text-xs text-slate-400 capitalize">{theme}</p>
            </div>
          </div>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
            <button
              onClick={() => onSetTheme('light')}
              title="Light"
              className={`p-1.5 rounded ${theme === 'light' ? 'bg-[#0877ED] text-white' : 'text-slate-400'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetTheme('dark')}
              title="Dark"
              className={`p-1.5 rounded ${theme === 'dark' ? 'bg-[#0877ED] text-white' : 'text-slate-400'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetTheme('system')}
              title="System"
              className={`p-1.5 rounded ${theme === 'system' ? 'bg-[#0877ED] text-white' : 'text-slate-400'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scanner Settings Section */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Scanner Options
        </h3>

        {/* Vibration */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              <Vibrate className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.scannerVibration}</p>
              <p className="text-xs text-slate-400">Haptic feedback on scan</p>
            </div>
          </div>
          <button
            onClick={onToggleVibration}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              vibrationEnabled ? 'bg-[#0877ED]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Audio Beep */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.scannerBeep}</p>
              <p className="text-xs text-slate-400">Sound chime on detection</p>
            </div>
          </div>
          <button
            onClick={onToggleSound}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              soundEnabled ? 'bg-[#0877ED]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              soundEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Auto-copy result */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.autoCopyResult}</p>
              <p className="text-xs text-slate-400">Copies text immediately</p>
            </div>
          </div>
          <button
            onClick={onToggleAutoCopy}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              autoCopy ? 'bg-[#0877ED]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              autoCopy ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Continuous mode */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.continuousScanSetting}</p>
              <p className="text-xs text-slate-400">Keep camera active</p>
            </div>
          </div>
          <button
            onClick={onToggleContinuous}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              continuousMode ? 'bg-[#0877ED]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              continuousMode ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Start with flashlight */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center">
              <Flashlight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{t.defaultFlashlight}</p>
              <p className="text-xs text-slate-400">Auto-torch in low light</p>
            </div>
          </div>
          <button
            onClick={onToggleDefaultFlashlight}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              defaultFlashlight ? 'bg-[#0877ED]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              defaultFlashlight ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Data Management & Privacy */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Data & Privacy
        </h3>

        <button
          onClick={() => setActiveModal('privacy')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-4 h-4 text-[#0877ED]" />
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{t.privacyPolicy}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveModal('terms')}
          className="w-full flex items-center justify-between py-2 text-left border-t border-slate-100 dark:border-slate-800/80"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-4 h-4 text-[#0877ED]" />
            <span className="text-sm font-semibold text-slate-800 dark:text-white">{t.termsConditions}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveModal('playstore')}
          className="w-full flex items-center justify-between py-2.5 text-left border-t border-slate-100 dark:border-slate-800/80"
        >
          <div className="flex items-center space-x-3">
            <UploadCloud className="w-4 h-4 text-[#0877ED]" />
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">Google Play Console Publishing</span>
              <p className="text-[11px] text-slate-400">Guide, store assets & Android Studio source (.zip)</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center justify-between py-2 text-left border-t border-slate-100 dark:border-slate-800/80 text-red-500"
        >
          <div className="flex items-center space-x-3">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-semibold">{t.settings_clear_data || 'Clear All Saved Data'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* About & Developer Credit Section */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#0877ED] flex-shrink-0">
            <img
              src={quickQrLogo}
              alt="QuickQR"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t.appName}
            </h4>
            <p className="text-xs text-slate-500">Version 1.0.1 (Build 2)</p>
            <p className="text-xs font-semibold text-[#0877ED] mt-0.5 flex items-center space-x-1">
              <span>{t.developerCredit}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveModal('rate')}
            className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center space-x-1.5 transition"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{t.rateApp}</span>
          </button>

          <button
            onClick={handleShareApp}
            className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center space-x-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-[#0877ED]" />
            <span>{t.shareApp}</span>
          </button>
        </div>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131E32] rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Clear All Local Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will delete your scan history and all saved QR codes. Settings will be reset to default.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Privacy, Terms, Rate */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131E32] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeModal === 'privacy' && t.privacyPolicy}
                {activeModal === 'terms' && t.termsConditions}
                {activeModal === 'rate' && t.rateApp}
                {activeModal === 'playstore' && 'Google Play Console Publishing Guide'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeModal === 'playstore' && (
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3.5 leading-relaxed">
                <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-1">
                  <p className="font-bold text-[#0877ED] flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Package: com.jagadeesh.quickqr (v1.0.1)</span>
                  </p>
                  <p className="text-[11px] text-blue-900/80 dark:text-blue-200">
                    Target SDK 34 (Android 14/15 ready), CameraX hardware autofocus & zero tracking.
                  </p>
                </div>

                {/* Download Required Play Store Assets */}
                <div className="space-y-2">
                  <p className="font-bold text-slate-800 dark:text-white text-xs">
                    1. Required Store Listing Assets (Ready to Upload):
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <a
                      href="/playstore-icon-512.png"
                      download="playstore-icon-512.png"
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-between hover:bg-slate-100 transition border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center space-x-2">
                        <img src="/playstore-icon-512.png" alt="icon" className="w-6 h-6 rounded" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white text-[11px]">App Icon (512x512 PNG)</p>
                          <p className="text-[10px] text-slate-400">Google Play 32-bit Alpha standard</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-[#0877ED]" />
                    </a>

                    <a
                      href="/playstore-feature-graphic-1024x500.png"
                      download="playstore-feature-graphic-1024x500.png"
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-between hover:bg-slate-100 transition border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-[11px]">Feature Graphic (1024x500 PNG)</p>
                        <p className="text-[10px] text-slate-400">Mandatory store promotional banner</p>
                      </div>
                      <Download className="w-4 h-4 text-[#0877ED]" />
                    </a>

                    <a
                      href="/QuickQR-Android-Project.zip"
                      download="QuickQR-Android-Project.zip"
                      className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl flex items-center justify-between hover:opacity-95 transition border border-blue-200 dark:border-blue-900"
                    >
                      <div>
                        <p className="font-bold text-[#0877ED] dark:text-blue-300 text-[11px]">Android Studio Project (.zip)</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Complete source code to generate .aab bundle</p>
                      </div>
                      <Download className="w-4 h-4 text-[#0877ED]" />
                    </a>
                  </div>
                </div>

                {/* 5-Step Play Console Publishing Instructions */}
                <div className="space-y-2">
                  <p className="font-bold text-slate-800 dark:text-white text-xs">
                    2. Google Play Console Submission Steps:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <li>
                      Go to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-[#0877ED] font-semibold underline inline-flex items-center space-x-0.5"><span>play.google.com/console</span><ExternalLink className="w-3 h-3 inline ml-0.5" /></a> and sign in.
                    </li>
                    <li>
                      Click <b>Create app</b>: App name = <code>QuickQR</code>, Type = <b>App</b>, Price = <b>Free</b>.
                    </li>
                    <li>
                      Under <b>Main store listing</b>, upload the <code>512x512 icon</code>, <code>1024x500 graphic</code>, and 2 phone screenshots.
                    </li>
                    <li>
                      In <b>App content</b>, complete Data Safety (Camera used for on-device barcode scanning, zero tracking/sharing), Privacy Policy, and Ads declaration.
                    </li>
                    <li>
                      In Android Studio, open the unzipped project and select <b>Build &gt; Generate Signed Bundle / APK &gt; Android App Bundle (.aab)</b>, then upload the <code>.aab</code> in <b>Production Release</b> and click <b>Start roll-out to Production</b>!
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
                <p className="font-bold text-slate-800 dark:text-white">Offline-First &amp; Zero Tracking</p>
                <p>QuickQR does not require user registration or logins. All scanned QR codes and barcodes are processed purely on your device using on-device Google ML Kit and CameraX.</p>
                <p>Your scan history and generated QR codes are stored locally in SQLite / Room Database and are never uploaded to any remote server.</p>
                <p><strong>Camera Usage:</strong> Camera access is used exclusively in real-time RAM to detect barcodes while the app is active. No frames are captured, recorded, or transmitted.</p>
                <p><strong>AdMob:</strong> Google Mobile Ads SDK uses device advertising identifiers in adherence with Google Play Developer policies.</p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
                <p>QuickQR is provided free for personal and professional productivity. You are responsible for inspecting external URLs and barcode actions before visiting untrusted links.</p>
                <p>QuickQR does not guarantee product prices or external web server contents.</p>
              </div>
            )}

            {activeModal === 'rate' && (
              <div className="text-center py-4 space-y-3">
                <div className="flex justify-center space-x-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-8 h-8 fill-amber-400 cursor-pointer" />
                  ))}
                </div>
                <p className="text-xs text-slate-500">Thank you for supporting QuickQR! Designed with care by Jagadeesh.</p>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-[#0877ED] text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
