import React, { useState } from 'react';
import { 
  Copy, 
  Share2, 
  Star, 
  ExternalLink, 
  Phone, 
  Mail, 
  MessageSquare, 
  Wifi, 
  MapPin, 
  UserPlus, 
  Search, 
  Check, 
  AlertTriangle,
  Calendar,
  Eye,
  EyeOff,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';
import { ParsedBarcodeResult } from '../utils/barcodeParser';
import { Translations } from '../utils/translations';

interface ResultScreenProps {
  result: ParsedBarcodeResult;
  t: Translations;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRescan: () => void;
  onDelete?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  t,
  isFavorite,
  onToggleFavorite,
  onRescan
}) => {
  const [copied, setCopied] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [showUrlSafetyModal, setShowUrlSafetyModal] = useState(false);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share helper
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.title,
          text: result.raw
        });
      } catch {
        // Share cancelled
      }
    } else {
      handleCopy(result.raw);
    }
  };

  // Safe URL open with confirmation
  const handleOpenUrl = () => {
    window.open(result.raw, '_blank', 'noopener,noreferrer');
    setShowUrlSafetyModal(false);
  };

  // Export vCard as .vcf download
  const handleDownloadVcard = () => {
    const vcardBlob = new Blob([result.raw], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(vcardBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.contact?.name || 'contact'}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#0877ED]/5 rounded-bl-full pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0877ED]/10 text-[#0877ED] dark:bg-[#0877ED]/20">
              <Sparkles className="w-3 h-3" />
              <span>{result.format.replace('_', ' ')}</span>
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {result.title}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={onToggleFavorite}
            aria-label={t.action_favorite || 'Favorite'}
            className={`p-2.5 rounded-full transition ${
              isFavorite
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
            }`}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Content Box */}
        <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800 text-sm font-mono text-slate-800 dark:text-slate-200 break-all select-all">
          {result.displayValue}
        </div>

        {/* Unsafe URL Banner */}
        {result.type === 'url' && result.isPotentiallyUnsafeUrl && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-start space-x-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t.unsafeUrlWarning}</p>
              <p className="text-[11px] mt-0.5">This URL uses an IP address or unusual domain structure. Do not enter passwords or personal data.</p>
            </div>
          </div>
        )}
      </div>

      {/* Contextual Action Buttons */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Available Actions
        </h3>

        {/* URL Action */}
        {result.type === 'url' && (
          <button
            onClick={() => setShowUrlSafetyModal(true)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0877ED] to-[#00B8D9] hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-[#0877ED]/20 transition"
          >
            <ExternalLink className="w-5 h-5" />
            <span>{t.openWebsite}</span>
          </button>
        )}

        {/* Wi-Fi Action */}
        {result.type === 'wifi' && result.wifi && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/50 dark:bg-slate-800/80 rounded-xl border border-blue-100 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">SSID:</span>
                <span className="font-bold text-slate-800 dark:text-white">{result.wifi.ssid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security:</span>
                <span className="font-semibold text-[#0877ED]">{result.wifi.encryption}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Password:</span>
                <div className="flex items-center space-x-1.5 font-mono">
                  <span>{showWifiPassword ? result.wifi.password || '(None)' : '••••••••'}</span>
                  <button
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showWifiPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {result.wifi.password && (
              <button
                onClick={() => handleCopy(result.wifi?.password || '')}
                className="w-full py-3 px-4 bg-[#0877ED] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition"
              >
                <Wifi className="w-4 h-4" />
                <span>{t.copyPassword}</span>
              </button>
            )}
          </div>
        )}

        {/* Contact vCard Action */}
        {result.type === 'contact' && result.contact && (
          <button
            onClick={handleDownloadVcard}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0877ED] to-[#00B8D9] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t.addToContacts}</span>
          </button>
        )}

        {/* Phone Action */}
        {result.type === 'phone' && (
          <a
            href={`tel:${result.phone}`}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
          >
            <Phone className="w-5 h-5" />
            <span>{t.callPhone}</span>
          </a>
        )}

        {/* SMS Action */}
        {result.type === 'sms' && (
          <a
            href={`sms:${result.sms?.number}?body=${encodeURIComponent(result.sms?.message || '')}`}
            className="w-full py-3.5 px-4 bg-[#0877ED] hover:bg-[#0766ce] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{t.sendSms}</span>
          </a>
        )}

        {/* Email Action */}
        {result.type === 'email' && (
          <a
            href={`mailto:${result.email?.to}?subject=${encodeURIComponent(result.email?.subject || '')}&body=${encodeURIComponent(result.email?.body || '')}`}
            className="w-full py-3.5 px-4 bg-[#0877ED] hover:bg-[#0766ce] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
          >
            <Mail className="w-5 h-5" />
            <span>{t.sendEmail}</span>
          </a>
        )}

        {/* Map Location Action */}
        {result.type === 'geo' && result.geo && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${result.geo.latitude},${result.geo.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{t.openMaps}</span>
          </a>
        )}

        {/* Product Barcode Action (Search online without fake data) */}
        {result.type === 'product' && (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(result.displayValue)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#0877ED] hover:bg-[#0766ce] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
          >
            <Search className="w-5 h-5" />
            <span>{t.productSearch}</span>
          </a>
        )}

        {/* Copy & Share Action Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleCopy(result.raw)}
            className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl flex items-center justify-center space-x-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs">{copied ? t.copiedToClipboard : t.copyText}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">{t.share}</span>
          </button>
        </div>

        {/* Scan Again Button */}
        <button
          onClick={onRescan}
          className="w-full py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition mt-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-xs">{t.rescan}</span>
        </button>
      </div>

      {/* URL Safety Confirmation Modal */}
      {showUrlSafetyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131E32] rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0877ED] flex items-center justify-center mx-auto">
              <ExternalLink className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.proceedWithCaution}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You are about to visit an external website:
              </p>
              <p className="text-xs font-mono font-semibold text-[#0877ED] mt-2 bg-blue-50 dark:bg-slate-900 p-2 rounded-lg break-all">
                {result.raw}
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowUrlSafetyModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleOpenUrl}
                className="flex-1 py-2.5 bg-[#0877ED] hover:bg-[#0766ce] text-white font-bold rounded-xl text-xs shadow-md"
              >
                {t.openWebsite}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
