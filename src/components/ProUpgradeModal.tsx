import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Download, 
  Ban, 
  CreditCard, 
  RotateCcw,
  CheckCircle2,
  MapPin,
  Compass,
  Calendar
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { CurrencyType, PRO_PLANS, detectUserRegionAndCurrency, DetectedLocationResult } from '../utils/billing';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onUpgradeSuccess: () => void;
  onRestorePurchases: () => void;
  currentCurrency: CurrencyType;
  onSelectCurrency: (currency: CurrencyType) => void;
  t: Translations;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  isPro,
  onUpgradeSuccess,
  onRestorePurchases,
  currentCurrency,
  onSelectCurrency,
  t
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'details' | 'googlePlaySheet' | 'success'>('details');
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocationResult | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Auto-detect location & currency on first load
  useEffect(() => {
    const detected = detectUserRegionAndCurrency();
    setDetectedLocation(detected);
  }, []);

  if (!isOpen) return null;

  const currentPlan = PRO_PLANS[currentCurrency] || PRO_PLANS.INR;

  // Manual or GPS re-detect
  const handleAutoDetectLocation = () => {
    setIsDetectingGps(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // Approximate India bounding box: lat 6 to 37, lng 68 to 97
          if (lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98) {
            onSelectCurrency('INR');
            setDetectedLocation({
              currency: 'INR',
              plan: PRO_PLANS.INR,
              detectedCountry: 'India (via GPS)',
              method: 'gps'
            });
          } else {
            const detected = detectUserRegionAndCurrency();
            onSelectCurrency(detected.currency);
            setDetectedLocation({
              ...detected,
              detectedCountry: `${detected.detectedCountry} (via GPS/TZ)`
            });
          }
        },
        () => {
          // Geolocation denied or unavailable, use timezone
          setIsDetectingGps(false);
          const detected = detectUserRegionAndCurrency();
          onSelectCurrency(detected.currency);
          setDetectedLocation(detected);
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetectingGps(false);
      const detected = detectUserRegionAndCurrency();
      onSelectCurrency(detected.currency);
      setDetectedLocation(detected);
    }
  };

  const handleStartGooglePlayPurchase = () => {
    setPurchaseStep('googlePlaySheet');
  };

  const handleConfirmGooglePlayPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseStep('success');
      onUpgradeSuccess();
    }, 1200);
  };

  const handleRestore = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onRestorePurchases();
      setPurchaseStep('success');
    }, 1000);
  };

  const currencyOptions: CurrencyType[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#131E32] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header Bar */}
        <div className="relative bg-gradient-to-br from-[#0877ED] via-[#0766ce] to-[#00B8D9] p-6 text-white text-center overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/15 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Pro Upgrade Modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Crown badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/10 mb-3 border border-white/30">
            <Crown className="w-8 h-8 text-amber-300 fill-amber-300 drop-shadow" />
          </div>

          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-400/25 border border-amber-300/40 text-amber-200 text-[11px] font-black uppercase tracking-wider mb-2">
            <Calendar className="w-3 h-3 mr-1" />
            MONTHLY SUBSCRIPTION
          </span>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {t.proTitle}
          </h2>
          <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto">
            {t.proSubtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {purchaseStep === 'details' && (
            <>
              {/* Geolocation Auto-Detection Card */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50/50 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl p-3.5 border border-blue-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-bold">
                    <MapPin className="w-4 h-4 text-[#0877ED]" />
                    <span>Auto-Detected Location:</span>
                    <span className="text-[#0877ED] font-extrabold">
                      {detectedLocation ? detectedLocation.detectedCountry : 'Detecting...'}
                    </span>
                  </div>

                  <button
                    onClick={handleAutoDetectLocation}
                    disabled={isDetectingGps}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-white dark:bg-slate-800 text-[#0877ED] border border-blue-200 dark:border-slate-700 rounded-lg text-[10px] font-bold hover:bg-blue-50 transition"
                  >
                    <Compass className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{isDetectingGps ? 'Locating...' : 'Refresh GPS'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Payment currency and symbol ({currentPlan.symbol}) are automatically configured for your country.
                </p>
              </div>

              {/* Regional Pricing Selector Cards (Monthly) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Currency &amp; Plan
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">Billed Monthly</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {currencyOptions.map((curr) => {
                    const plan = PRO_PLANS[curr];
                    const isSelected = currentCurrency === curr;
                    return (
                      <button
                        key={curr}
                        onClick={() => onSelectCurrency(curr)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#0877ED] bg-[#0877ED]/5 dark:bg-[#0877ED]/15 shadow-sm ring-1 ring-[#0877ED]/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                            <span>{plan.flag}</span>
                            <span>{curr}</span>
                          </span>
                          <span className="text-xs font-black text-[#0877ED] bg-[#0877ED]/10 px-2 py-0.5 rounded-md">
                            {plan.formattedMonthly}<span className="text-[9px] font-semibold text-slate-400">{plan.perMonthSuffix}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {plan.targetRegion}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                <p className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#0877ED]" />
                  <span>Pro Monthly Benefits:</span>
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Ban className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">100% Ad-Free Experience</span>
                      <p className="text-[11px] text-slate-500">Completely disables all banner ads, interstitial popups, and AdMob test units.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 text-[#0877ED] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Continuous Batch Scanning</span>
                      <p className="text-[11px] text-slate-500">Scan unlimited barcodes continuously with auto-torch and instant export.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-[#00B8D9] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">High-Resolution 4K &amp; SVG Vector Export</span>
                      <p className="text-[11px] text-slate-500">Generate print-ready crisp QR codes with custom logos in the center.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Monthly Flexibility · Cancel Anytime</span>
                      <p className="text-[11px] text-slate-500">Manage or cancel your subscription easily with 1 tap in Google Play Store settings.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleStartGooglePlayPurchase}
                  className="w-full py-4 px-4 bg-gradient-to-r from-[#0877ED] via-[#0766ce] to-[#00B8D9] hover:opacity-95 active:scale-[0.99] text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-[#0877ED]/25 transition"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>
                    {t.buyWithGooglePlay} ({currentPlan.formattedMonthly}{currentPlan.perMonthSuffix})
                  </span>
                </button>

                <div className="flex items-center justify-between px-2 pt-1">
                  <span className="text-[10px] text-slate-400">
                    Google Play Monthly Subscription
                  </span>
                  <button
                    onClick={handleRestore}
                    className="text-[11px] font-semibold text-[#0877ED] hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.restorePurchases}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Simulated Google Play Billing Sheet */}
          {purchaseStep === 'googlePlaySheet' && (
            <div className="p-2 space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-[#0877ED] flex items-center justify-center text-white text-[10px] font-black">
                      GP
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Google Play Subscription
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#0877ED]">
                      {currentPlan.formattedMonthly}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{currentPlan.perMonthSuffix}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    QuickQR Pro (Monthly Subscription)
                  </h4>
                  <p className="text-[11px] text-slate-500">Developer: Jagadeesh</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Plan: {currentPlan.basePlanId} · SKU: {currentPlan.sku}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Google Play Payment / UPI / Card</span>
                  </div>
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed border border-blue-100 dark:border-slate-800">
                  Recurring billing: {currentPlan.formattedMonthly} per month until canceled. You can cancel anytime in Google Play Store &gt; Payments &amp; subscriptions.
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setPurchaseStep('details')}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGooglePlayPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Subscribing via Google Play...</span>
                  ) : (
                    <span>Subscribe ({currentPlan.formattedMonthly}/mo)</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {purchaseStep === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t.proActivated}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t.purchasedSuccess}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 bg-[#0877ED] text-white font-bold rounded-xl text-xs shadow-md"
              >
                Start Using QuickQR Pro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
