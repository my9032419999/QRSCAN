import React, { useState, useEffect, useRef, useId } from 'react';
import QRCode from 'qrcode';
import { 
  Globe, 
  Type, 
  Wifi, 
  Phone, 
  MessageSquare, 
  Mail, 
  UserPlus, 
  MapPin, 
  Calendar, 
  Download, 
  Share2, 
  Copy, 
  Bookmark, 
  Check, 
  Palette,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { AdMobBannerSim } from '../components/AdMobBannerSim';
import quickQrLogo from '../assets/quickqr-logo.png';

export interface SavedQrItem {
  id: string;
  title: string;
  content: string;
  type: string;
  fgColor: string;
  bgColor: string;
  ecc: 'L' | 'M' | 'Q' | 'H';
  hasLogo: boolean;
  createdAt: number;
  isFavorite: boolean;
}

interface GeneratorScreenProps {
  t: Translations;
  onSaveToMyQr: (item: SavedQrItem) => void;
  isPro?: boolean;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({ t, onSaveToMyQr, isPro = false }) => {
  const [selectedType, setSelectedType] = useState<
    'url' | 'text' | 'wifi' | 'phone' | 'sms' | 'email' | 'contact' | 'geo' | 'event'
  >('url');

  // Form states
  const [urlVal, setUrlVal] = useState('https://quickqr.app');
  const [textVal, setTextVal] = useState('');
  
  // Wi-Fi form
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Phone & SMS
  const [phoneVal, setPhoneVal] = useState('');
  const [smsNumber, setSmsNumber] = useState('');
  const [smsMsg, setSmsMsg] = useState('');

  // Email
  const [emailTo, setEmailTo] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Contact
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');

  // Geo
  const [geoLat, setGeoLat] = useState('17.3850');
  const [geoLng, setGeoLng] = useState('78.4867');

  // Event
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLoc, setEventLoc] = useState('');

  // Customization
  const [fgColor, setFgColor] = useState('#0877ED');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [includeLogo, setIncludeLogo] = useState(false);

  // Feedback states
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate formatted raw string based on selected form
  const getEncodedString = (): { raw: string; title: string } => {
    switch (selectedType) {
      case 'url': {
        const full = urlVal.startsWith('http') ? urlVal : `https://${urlVal}`;
        return { raw: full, title: urlVal || 'Website Link' };
      }
      case 'text':
        return { raw: textVal || 'QuickQR', title: textVal.slice(0, 24) || 'Plain Text' };
      case 'wifi': {
        const raw = `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};H:${wifiHidden};;`;
        return { raw, title: `Wi-Fi: ${wifiSsid || 'Network'}` };
      }
      case 'phone':
        return { raw: `TEL:${phoneVal}`, title: `Phone: ${phoneVal || 'Number'}` };
      case 'sms':
        return { raw: `SMSTO:${smsNumber}:${smsMsg}`, title: `SMS to ${smsNumber || 'Number'}` };
      case 'email':
        return { 
          raw: `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`, 
          title: `Email: ${emailTo || 'Recipient'}` 
        };
      case 'contact': {
        const raw = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nORG:${contactOrg}\nEND:VCARD`;
        return { raw, title: contactName ? `Contact: ${contactName}` : 'Contact Card' };
      }
      case 'geo':
        return { raw: `geo:${geoLat},${geoLng}`, title: `Location (${geoLat}, ${geoLng})` };
      case 'event': {
        const raw = `BEGIN:VEVENT\nSUMMARY:${eventTitle}\nLOCATION:${eventLoc}\nEND:VEVENT`;
        return { raw, title: eventTitle || 'Calendar Event' };
      }
    }
  };

  // Render QR Code onto canvas
  useEffect(() => {
    const { raw } = getEncodedString();
    if (!raw) return;

    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, raw, {
      width: 600,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor === 'transparent' ? '#00000000' : bgColor
      },
      errorCorrectionLevel: ecc
    }, (err) => {
      if (!err) {
        if (includeLogo) {
          // Draw center logo safely
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const logo = new Image();
            logo.src = quickQrLogo;
            logo.onload = () => {
              const size = canvas.width * 0.22;
              const x = (canvas.width - size) / 2;
              const y = (canvas.height - size) / 2;
              
              // Rounded white protective boundary behind logo
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, (size / 2) + 6, 0, Math.PI * 2);
              ctx.fill();

              // Draw logo
              ctx.save();
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(logo, x, y, size, size);
              ctx.restore();

              setQrDataUrl(canvas.toDataURL('image/png'));
            };
            return;
          }
        }
        setQrDataUrl(canvas.toDataURL('image/png'));
      }
    });
  }, [
    selectedType, urlVal, textVal, wifiSsid, wifiPass, wifiEnc, wifiHidden,
    phoneVal, smsNumber, smsMsg, emailTo, emailSub, emailBody,
    contactName, contactPhone, contactEmail, contactOrg, geoLat, geoLng,
    eventTitle, eventLoc, fgColor, bgColor, ecc, includeLogo
  ]);

  // Download high-res PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const { title } = getEncodedString();
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QuickQR_${title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.click();
  };

  // Copy raw content
  const handleCopyContent = () => {
    const { raw } = getEncodedString();
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share
  const handleShare = async () => {
    const { raw, title } = getEncodedString();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QuickQR: ${title}`,
          text: raw
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyContent();
    }
  };

  // Save to My QR Codes
  const handleSaveToMyQr = () => {
    const { raw, title } = getEncodedString();
    const item: SavedQrItem = {
      id: `qr-${Date.now()}`,
      title,
      content: raw,
      type: selectedType,
      fgColor,
      bgColor,
      ecc,
      hasLogo: includeLogo,
      createdAt: Date.now(),
      isFavorite: false
    };
    onSaveToMyQr(item);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const typeTabs = [
    { id: 'url', label: t.typeUrl, icon: Globe },
    { id: 'text', label: t.typeText, icon: Type },
    { id: 'wifi', label: t.typeWifi, icon: Wifi },
    { id: 'phone', label: t.typePhone, icon: Phone },
    { id: 'sms', label: t.typeSms, icon: MessageSquare },
    { id: 'email', label: t.typeEmail, icon: Mail },
    { id: 'contact', label: t.typeContact, icon: UserPlus },
    { id: 'geo', label: t.typeLocation, icon: MapPin },
    { id: 'event', label: t.typeEvent, icon: Calendar },
  ];

  const colorPalette = [
    { label: 'Brand Blue', value: '#0877ED' },
    { label: 'Deep Black', value: '#0B111E' },
    { label: 'Cyan Accent', value: '#00B8D9' },
    { label: 'Emerald Green', value: '#10B981' },
    { label: 'Royal Violet', value: '#8B5CF6' },
    { label: 'Crimson Red', value: '#EF4444' },
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* Type Selector Horizontal Carousel */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {t.selectType}
        </h3>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as typeof selectedType)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#0877ED] text-white shadow-md shadow-[#0877ED]/20'
                    : 'bg-white dark:bg-[#131E32] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Input Card */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        {selectedType === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.typeUrl}
            </label>
            <input
              type="url"
              value={urlVal}
              onChange={(e) => setUrlVal(e.target.value)}
              placeholder={t.urlPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0877ED]"
            />
          </div>
        )}

        {selectedType === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.typeText}
            </label>
            <textarea
              rows={3}
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              placeholder={t.textPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0877ED]"
            />
          </div>
        )}

        {selectedType === 'wifi' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.ssidLabel}
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="e.g. Home_Network"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.wifiPasswordLabel}
              </label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Wi-Fi Password"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
            <div className="flex space-x-2">
              {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                <button
                  key={enc}
                  type="button"
                  onClick={() => setWifiEnc(enc)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                    wifiEnc === enc ? 'bg-[#0877ED] text-white border-[#0877ED]' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {enc === 'nopass' ? 'None' : enc}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedType === 'phone' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.phoneNumberLabel}
            </label>
            <input
              type="tel"
              value={phoneVal}
              onChange={(e) => setPhoneVal(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
            />
          </div>
        )}

        {selectedType === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.phoneNumberLabel}
              </label>
              <input
                type="tel"
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.smsMessageLabel}
              </label>
              <textarea
                rows={2}
                value={smsMsg}
                onChange={(e) => setSmsMsg(e.target.value)}
                placeholder="Pre-filled message..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
          </div>
        )}

        {selectedType === 'email' && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.emailToLabel}
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="hello@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.emailSubjectLabel}
              </label>
              <input
                type="text"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                placeholder="Meeting Discussion"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
          </div>
        )}

        {selectedType === 'contact' && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.contactNameLabel}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Jagadeesh"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0877ED]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>
          </div>
        )}

        {selectedType === 'geo' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.latitudeLabel}
              </label>
              <input
                type="text"
                value={geoLat}
                onChange={(e) => setGeoLat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.longitudeLabel}
              </label>
              <input
                type="text"
                value={geoLng}
                onChange={(e) => setGeoLng(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>
          </div>
        )}

        {selectedType === 'event' && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.eventTitleLabel}
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Product Launch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.eventLocationLabel}
              </label>
              <input
                type="text"
                value={eventLoc}
                onChange={(e) => setEventLoc(e.target.value)}
                placeholder="Hyderabad / Remote"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* QR Customization Card */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
            <Palette className="w-4 h-4 text-[#0877ED]" />
            <span>{t.customizeQr}</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Offline Engine</span>
        </div>

        {/* Foreground Color Presets */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t.foregroundColor}
          </label>
          <div className="flex items-center space-x-2">
            {colorPalette.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFgColor(c.value)}
                aria-label={c.label}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  fgColor === c.value ? 'scale-110 border-slate-900 dark:border-white shadow' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        {/* Error Correction & Logo Toggles */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {t.errorCorrection}
            </label>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEcc(level)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded ${
                    ecc === level ? 'bg-[#0877ED] text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Logo in Center
            </label>
            <button
              type="button"
              onClick={() => {
                setIncludeLogo(!includeLogo);
                if (!includeLogo) setEcc('H'); // Auto set high error correction for safe logo rendering
              }}
              className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                includeLogo
                  ? 'bg-[#0877ED]/15 text-[#0877ED] border-[#0877ED]'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              {includeLogo ? '✓ QuickQR Logo' : '+ Add Logo'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview & Export Container */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {t.preview}
        </h4>

        {/* The Generated QR Image */}
        <div className="inline-block p-4 rounded-2xl bg-white shadow-inner border border-slate-100 dark:border-slate-800">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Generated QR Code"
              className="w-48 h-48 object-contain mx-auto"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
              Generating...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={handleDownloadPng}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0877ED] to-[#00B8D9] hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-[#0877ED]/25 transition"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadPng}</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleSaveToMyQr}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                savedSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved!' : 'Save QR'}</span>
            </button>

            <button
              onClick={handleCopyContent}
              className="py-2.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.share}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Policy compliant test banner (hidden in Pro mode) */}
      <AdMobBannerSim t={t} slotName="QR Generator Adaptive Banner" isPro={isPro} />
    </div>
  );
};
