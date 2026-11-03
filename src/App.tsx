import React, { useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { TopAppBar } from './components/TopAppBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { ResultScreen } from './screens/ResultScreen';
import { GeneratorScreen, SavedQrItem } from './screens/GeneratorScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { MyQrCodesScreen } from './screens/MyQrCodesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AndroidProjectScreen } from './screens/AndroidProjectScreen';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { getTranslations, Language } from './utils/translations';
import { ParsedBarcodeResult, parseBarcodeContent } from './utils/barcodeParser';
import { ScanHistoryRecord } from './utils/csvExporter';
import { CurrencyType, detectUserRegionAndCurrency, PRO_PLANS } from './utils/billing';

// Initial starter seed data so the user has immediate data to test
const SEED_HISTORY: ScanHistoryRecord[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 3600000 * 2,
    rawContent: 'https://github.com/google/material-design-icons',
    format: 'QR_CODE',
    type: 'url',
    title: 'Website Link',
    isFavorite: true
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 3600000 * 5,
    rawContent: 'WIFI:S:Office_5G;T:WPA;P:FastQuickQR2026;H:false;;',
    format: 'QR_CODE',
    type: 'wifi',
    title: 'Wi-Fi Network: Office_5G',
    isFavorite: false
  },
  {
    id: 'seed-3',
    timestamp: Date.now() - 3600000 * 12,
    rawContent: '8901030383792',
    format: 'EAN_13',
    type: 'product',
    title: 'EAN 13 Product Code',
    isFavorite: true
  }
];

const SEED_SAVED_QR: SavedQrItem[] = [
  {
    id: 'saved-1',
    title: 'My Portfolio Link',
    content: 'https://jagadeesh.dev',
    type: 'url',
    fgColor: '#0877ED',
    bgColor: '#FFFFFF',
    ecc: 'H',
    hasLogo: true,
    createdAt: Date.now() - 86400000,
    isFavorite: true
  },
  {
    id: 'saved-2',
    title: 'Home Wi-Fi Network',
    content: 'WIFI:S:Jagadeesh_Home;T:WPA;P:Welcome2026;H:false;;',
    type: 'wifi',
    fgColor: '#00B8D9',
    bgColor: '#FFFFFF',
    ecc: 'M',
    hasLogo: false,
    createdAt: Date.now() - 86400000 * 2,
    isFavorite: false
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeResult, setActiveResult] = useState<ParsedBarcodeResult | null>(null);

  // User Settings State
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('quickqr_lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoCopy, setAutoCopy] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [defaultFlashlight, setDefaultFlashlight] = useState(false);

  // Pro Mode (Ad-Free Monthly Subscription)
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('quickqr_is_pro') === 'true';
  });
  const [showProModal, setShowProModal] = useState<boolean>(false);

  // Auto-Detected Currency State (e.g., INR for India, USD for Global)
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    const saved = localStorage.getItem('quickqr_currency') as CurrencyType;
    if (saved && PRO_PLANS[saved]) return saved;
    return detectUserRegionAndCurrency().currency;
  });

  const currentPlan = PRO_PLANS[currency] || PRO_PLANS.INR;

  // History & Saved QRs
  const [history, setHistory] = useState<ScanHistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem('quickqr_history');
      return stored ? JSON.parse(stored) : SEED_HISTORY;
    } catch {
      return SEED_HISTORY;
    }
  });

  const [savedCodes, setSavedCodes] = useState<SavedQrItem[]>(() => {
    try {
      const stored = localStorage.getItem('quickqr_saved');
      return stored ? JSON.parse(stored) : SEED_SAVED_QR;
    } catch {
      return SEED_SAVED_QR;
    }
  });

  const t = getTranslations(currentLang);

  // Sync Lang
  const handleToggleLang = () => {
    const next = currentLang === 'en' ? 'te' : 'en';
    setCurrentLang(next);
    localStorage.setItem('quickqr_lang', next);
  };

  // Sync History
  useEffect(() => {
    try {
      localStorage.setItem('quickqr_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Sync Saved QRs
  useEffect(() => {
    try {
      localStorage.setItem('quickqr_saved', JSON.stringify(savedCodes));
    } catch {
      // ignore
    }
  }, [savedCodes]);

  // Sync Pro state
  useEffect(() => {
    localStorage.setItem('quickqr_is_pro', String(isPro));
  }, [isPro]);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Handle Scan Result
  const handleScanResult = (result: ParsedBarcodeResult) => {
    const newRecord: ScanHistoryRecord = {
      id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      rawContent: result.raw,
      format: result.format,
      type: result.type,
      title: result.title,
      isFavorite: false
    };

    setHistory((prev) => [newRecord, ...prev.filter(p => p.rawContent !== result.raw)]);

    if (autoCopy) {
      navigator.clipboard.writeText(result.raw);
    }

    setActiveResult(result);
  };

  // Handle Gallery Pick scan
  const handleScanGalleryFile = async (file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        try {
          const reader = new BrowserMultiFormatReader();
          const decoded = await reader.decodeFromImageElement(img);
          if (decoded) {
            const format = decoded.getBarcodeFormat() ? decoded.getBarcodeFormat().toString() : 'QR_CODE';
            const parsed = parseBarcodeContent(decoded.getText(), format);
            handleScanResult(parsed);
          } else {
            alert('No barcode or QR code detected in this image.');
          }
        } catch {
          alert('Could not decode barcode from this image. Please ensure code is clear and visible.');
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      };
    } catch (err) {
      console.error(err);
    }
  };

  // History Actions
  const handleToggleFavoriteHistory = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  // Saved QR Actions
  const handleSaveToMyQr = (item: SavedQrItem) => {
    setSavedCodes((prev) => [item, ...prev]);
  };

  const handleDeleteSavedCode = (id: string) => {
    setSavedCodes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleFavoriteSaved = (id: string) => {
    setSavedCodes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleRenameSavedCode = (id: string, newTitle: string) => {
    setSavedCodes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  // Check if currently active result is favorite
  const isCurrentResultFavorite = activeResult
    ? history.find((h) => h.rawContent === activeResult.raw)?.isFavorite || false
    : false;

  const toggleCurrentResultFavorite = () => {
    if (!activeResult) return;
    const match = history.find((h) => h.rawContent === activeResult.raw);
    if (match) {
      handleToggleFavoriteHistory(match.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#0B111E] text-slate-800 dark:text-slate-100 transition-colors flex flex-col items-center">
      {/* Device Shell Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-[#0B111E] shadow-2xl relative flex flex-col border-x border-slate-200/60 dark:border-slate-800/80">
        
        {/* Top App Bar */}
        <TopAppBar
          t={t}
          currentLang={currentLang}
          onToggleLang={handleToggleLang}
          onOpenSettings={() => {
            setActiveResult(null);
            setCurrentTab('settings');
          }}
          onOpenAndroidProject={() => {
            setActiveResult(null);
            setCurrentTab('android');
          }}
          isPro={isPro}
          onOpenProModal={() => setShowProModal(true)}
          formattedMonthlyPrice={currentPlan.formattedMonthly}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeResult ? (
            <ResultScreen
              result={activeResult}
              t={t}
              isFavorite={isCurrentResultFavorite}
              onToggleFavorite={toggleCurrentResultFavorite}
              onRescan={() => {
                setActiveResult(null);
                setCurrentTab('scan');
              }}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  t={t}
                  recentScans={history}
                  onNavigateToScan={(mode) => setCurrentTab('scan')}
                  onNavigateToCreate={() => setCurrentTab('create')}
                  onNavigateToHistory={() => setCurrentTab('history')}
                  onNavigateToSaved={() => setCurrentTab('saved')}
                  onNavigateToAndroidProject={() => setCurrentTab('android')}
                  onSelectScanRecord={(rec) => setActiveResult(rec)}
                  onScanGalleryFile={handleScanGalleryFile}
                  isPro={isPro}
                  onOpenProModal={() => setShowProModal(true)}
                  plan={currentPlan}
                />
              )}

              {currentTab === 'scan' && (
                <ScannerScreen
                  t={t}
                  onScanResult={handleScanResult}
                  soundEnabled={soundEnabled}
                  vibrationEnabled={vibrationEnabled}
                  continuousMode={continuousMode}
                  defaultFlashlight={defaultFlashlight}
                  onToggleSound={() => setSoundEnabled(!soundEnabled)}
                  onToggleVibration={() => setVibrationEnabled(!vibrationEnabled)}
                  onToggleContinuous={() => setContinuousMode(!continuousMode)}
                />
              )}

              {currentTab === 'create' && (
                <GeneratorScreen
                  t={t}
                  onSaveToMyQr={handleSaveToMyQr}
                  isPro={isPro}
                />
              )}

              {currentTab === 'history' && (
                <HistoryScreen
                  t={t}
                  history={history}
                  onSelectRecord={(rec) => setActiveResult(rec)}
                  onToggleFavorite={handleToggleFavoriteHistory}
                  onDeleteRecord={handleDeleteHistoryRecord}
                  onClearAllHistory={handleClearAllHistory}
                  isPro={isPro}
                />
              )}

              {currentTab === 'saved' && (
                <MyQrCodesScreen
                  t={t}
                  savedCodes={savedCodes}
                  onDeleteCode={handleDeleteSavedCode}
                  onToggleFavorite={handleToggleFavoriteSaved}
                  onRenameCode={handleRenameSavedCode}
                  onSelectToEdit={(item) => {
                    setCurrentTab('create');
                  }}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsScreen
                  t={t}
                  currentLang={currentLang}
                  onSetLang={(lang) => {
                    setCurrentLang(lang);
                    localStorage.setItem('quickqr_lang', lang);
                  }}
                  theme={theme}
                  onSetTheme={setTheme}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => setSoundEnabled(!soundEnabled)}
                  vibrationEnabled={vibrationEnabled}
                  onToggleVibration={() => setVibrationEnabled(!vibrationEnabled)}
                  autoCopy={autoCopy}
                  onToggleAutoCopy={() => setAutoCopy(!autoCopy)}
                  continuousMode={continuousMode}
                  onToggleContinuous={() => setContinuousMode(!continuousMode)}
                  defaultFlashlight={defaultFlashlight}
                  onToggleDefaultFlashlight={() => setDefaultFlashlight(!defaultFlashlight)}
                  onClearAllData={() => {
                    setHistory([]);
                    setSavedCodes([]);
                    localStorage.clear();
                  }}
                  isPro={isPro}
                  onTogglePro={() => setIsPro(!isPro)}
                  onOpenProModal={() => setShowProModal(true)}
                  currentCurrency={currency}
                  onSelectCurrency={(cur) => {
                    setCurrency(cur);
                    localStorage.setItem('quickqr_currency', cur);
                  }}
                  plan={currentPlan}
                />
              )}

              {currentTab === 'android' && (
                <AndroidProjectScreen t={t} />
              )}
            </>
          )}
        </main>

        {/* Google Play Pro Upgrade & Billing Modal */}
        <ProUpgradeModal
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
          isPro={isPro}
          onUpgradeSuccess={() => setIsPro(true)}
          onRestorePurchases={() => setIsPro(true)}
          currentCurrency={currency}
          onSelectCurrency={(cur) => {
            setCurrency(cur);
            localStorage.setItem('quickqr_currency', cur);
          }}
          t={t}
        />

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => {
            setActiveResult(null);
            setCurrentTab(tab);
          }}
          t={t}
        />
      </div>
    </div>
  );
}
