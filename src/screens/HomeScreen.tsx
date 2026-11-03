import React, { useRef } from 'react';
import { 
  Scan, 
  Barcode as BarcodeIcon, 
  PlusCircle, 
  Image as ImageIcon, 
  History, 
  Sparkles, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { ScanHistoryRecord } from '../utils/csvExporter';
import { AdMobBannerSim } from '../components/AdMobBannerSim';
import { ParsedBarcodeResult, parseBarcodeContent } from '../utils/barcodeParser';
import { CurrencyType, ProPricingPlan, PRO_PLANS } from '../utils/billing';
import quickQrBanner from '../assets/quickqr-banner.png';

interface HomeScreenProps {
  t: Translations;
  recentScans: ScanHistoryRecord[];
  onNavigateToScan: (mode?: 'qr' | 'barcode') => void;
  onNavigateToCreate: () => void;
  onNavigateToHistory: () => void;
  onNavigateToSaved: () => void;
  onNavigateToAndroidProject: () => void;
  onSelectScanRecord: (record: ParsedBarcodeResult) => void;
  onScanGalleryFile: (file: File) => void;
  isPro: boolean;
  onOpenProModal: () => void;
  plan?: ProPricingPlan;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  t,
  recentScans,
  onNavigateToScan,
  onNavigateToCreate,
  onNavigateToHistory,
  onNavigateToSaved,
  onNavigateToAndroidProject,
  onSelectScanRecord,
  onScanGalleryFile,
  isPro,
  onOpenProModal,
  plan = PRO_PLANS.INR
}) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuickQR – QR & Barcode Scanner',
          text: 'QuickQR: Scan Fast. Create Easy. Designed by Jagadeesh.',
          url: window.location.href,
        });
      } catch {
        // user dismissed share sheet
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('QuickQR link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-28">
      {/* Hidden Gallery Input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onScanGalleryFile(file);
        }}
        className="hidden"
      />

      {/* Hero Primary Scan Action Card - Replaced with New Banner Artwork */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-[#0877ED]/25 group select-none border border-blue-500/10 bg-[#0877ED] min-h-[160px]">
        {/* Banner Graphic Image */}
        <img
          src={quickQrBanner}
          alt="QuickQR – QR & Barcode Scanner: Scan Fast. Create Easy."
          className="w-full h-auto object-cover block"
        />

        {/* Interactive Hotspot 1: Scan Circle Button */}
        <button
          onClick={() => onNavigateToScan('qr')}
          title="Scan QR Code"
          aria-label="Scan QR Code"
          className="absolute left-[9.5%] bottom-[23%] w-[12%] aspect-square rounded-full cursor-pointer hover:bg-white/20 active:scale-90 transition-all focus:outline-hidden"
        />

        {/* Interactive Hotspot 2: Barcode Circle Button */}
        <button
          onClick={() => onNavigateToScan('barcode')}
          title="Scan Barcode"
          aria-label="Scan Barcode"
          className="absolute left-[20%] bottom-[23%] w-[12%] aspect-square rounded-full cursor-pointer hover:bg-white/20 active:scale-90 transition-all focus:outline-hidden"
        />

        {/* Interactive Hotspot 3: Create Circle Button */}
        <button
          onClick={onNavigateToCreate}
          title="Generate QR Code"
          aria-label="Generate QR Code"
          className="absolute left-[30.5%] bottom-[23%] w-[12%] aspect-square rounded-full cursor-pointer hover:bg-white/20 active:scale-90 transition-all focus:outline-hidden"
        />

        {/* Interactive Hotspot 4: Share Circle Button */}
        <button
          onClick={handleShareApp}
          title="Share App"
          aria-label="Share QuickQR App"
          className="absolute left-[41%] bottom-[23%] w-[12%] aspect-square rounded-full cursor-pointer hover:bg-white/20 active:scale-90 transition-all focus:outline-hidden"
        />

        {/* Interactive Hotspot 5: Primary "Scan QR Code >" Pill Button */}
        <button
          onClick={() => onNavigateToScan('qr')}
          title="Scan QR Code"
          aria-label="Scan QR Code"
          className="absolute left-[8%] right-[8%] bottom-[5%] h-[16%] rounded-full cursor-pointer hover:bg-black/5 active:scale-[0.98] transition-all focus:outline-hidden"
        />
      </div>

      {/* Main Action Grid (Barcode, Create, Gallery) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Scan Barcode */}
        <button
          onClick={() => onNavigateToScan('barcode')}
          className="bg-white dark:bg-[#131E32] rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 transition text-left flex flex-col justify-between h-28 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0877ED]/10 text-[#0877ED] flex items-center justify-center group-hover:scale-105 transition-transform">
            <BarcodeIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {t.scanBarcode}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">EAN, UPC, 128</p>
          </div>
        </button>

        {/* Generate QR */}
        <button
          onClick={onNavigateToCreate}
          className="bg-white dark:bg-[#131E32] rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 transition text-left flex flex-col justify-between h-28 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#00B8D9]/10 text-[#00B8D9] flex items-center justify-center group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {t.generateQrCode}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">9 types, colors</p>
          </div>
        </button>

        {/* Scan from Gallery */}
        <button
          onClick={() => galleryInputRef.current?.click()}
          className="bg-white dark:bg-[#131E32] rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 transition text-left flex flex-col justify-between h-28 group"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {t.scanFromGallery}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Pick image</p>
          </div>
        </button>
      </div>

      {/* Recently Scanned Codes Horizontal Section */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
            <History className="w-3.5 h-3.5 text-[#0877ED]" />
            <span>{t.recentScans}</span>
          </h3>

          {recentScans.length > 0 && (
            <button
              onClick={onNavigateToHistory}
              className="text-xs font-semibold text-[#0877ED] flex items-center space-x-0.5 hover:underline"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="py-5 text-center text-xs text-slate-400">
            {t.noRecentScans}
          </div>
        ) : (
          <div className="flex space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
            {recentScans.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectScanRecord(parseBarcodeContent(item.rawContent, item.format))}
                className="w-40 flex-shrink-0 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold uppercase text-[#0877ED] bg-[#0877ED]/10 px-1.5 py-0.5 rounded">
                    {item.format.slice(0, 6)}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  {item.rawContent}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Pro Membership Banner */}
      {!isPro ? (
        <div 
          onClick={onOpenProModal}
          className="cursor-pointer bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-[#00B8D9]/10 hover:from-amber-500/15 border border-amber-300/60 dark:border-amber-500/30 rounded-2xl p-4 shadow-sm transition flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  QuickQR Pro
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">
                  100% AD-FREE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {plan.formattedMonthly}{plan.perMonthSuffix} ({plan.targetRegion}) · Cancel anytime
              </p>
            </div>
          </div>

          <button className="px-3 py-1.5 bg-[#0877ED] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0766ce] transition flex-shrink-0">
            {plan.formattedMonthly}/mo
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>QuickQR Pro Active · 100% Ad-Free</span>
          </div>
          <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full font-bold">
            PRO LICENSE
          </span>
        </div>
      )}

      {/* AdMob Adaptive Banner (Hidden in Pro mode) */}
      <AdMobBannerSim t={t} slotName="Home Screen Adaptive Banner" isPro={isPro} />

      {/* Developer Credit Footer */}
      <div className="text-center py-2 text-xs text-slate-400">
        <p className="font-semibold text-slate-500 dark:text-slate-400">
          {t.developerCredit}
        </p>
      </div>
    </div>
  );
};
