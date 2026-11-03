import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Download, 
  Star, 
  ExternalLink, 
  QrCode, 
  Barcode as BarcodeIcon, 
  Share2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { ScanHistoryRecord, exportScanHistoryToCsv } from '../utils/csvExporter';
import { AdMobBannerSim } from '../components/AdMobBannerSim';
import { ParsedBarcodeResult, parseBarcodeContent } from '../utils/barcodeParser';

interface HistoryScreenProps {
  t: Translations;
  history: ScanHistoryRecord[];
  onSelectRecord: (record: ParsedBarcodeResult) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onClearAllHistory: () => void;
  isPro?: boolean;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  t,
  history,
  onSelectRecord,
  onToggleFavorite,
  onDeleteRecord,
  onClearAllHistory,
  isPro = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'qr' | 'barcode' | 'favorites'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showClearModal, setShowClearModal] = useState(false);

  // Filtered & Sorted items
  const filteredItems = history
    .filter((item) => {
      // Search match
      const term = searchTerm.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(term) || item.rawContent.toLowerCase().includes(term);
      if (!matchesSearch) return false;

      // Type filter
      if (filterType === 'favorites') return item.isFavorite;
      if (filterType === 'qr') return item.format === 'QR_CODE';
      if (filterType === 'barcode') return item.format !== 'QR_CODE';
      return true;
    })
    .sort((a, b) => {
      return sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
    });

  // Export CSV download
  const handleExportCsv = () => {
    if (history.length === 0) return;
    const csvContent = exportScanHistoryToCsv(history);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QuickQR_Scan_History_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchHistoryPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131E32] text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0877ED]"
        />
      </div>

      {/* Filter and Sort Chips */}
      <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex space-x-1.5 flex-shrink-0">
          {(['all', 'qr', 'barcode', 'favorites'] as const).map((filter) => {
            const labels = {
              all: t.filterAll,
              qr: t.filterQr,
              barcode: t.filterBarcode,
              favorites: t.filterFavorites
            };
            const isSelected = filterType === filter;
            return (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-[#0877ED] text-white shadow-xs'
                    : 'bg-white dark:bg-[#131E32] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#131E32] border border-slate-200 dark:border-slate-800 flex-shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-[#0877ED]" />
          <span>{sortOrder === 'newest' ? t.sortNewest : t.sortOldest}</span>
        </button>
      </div>

      {/* Action Header for CSV and Clear */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>{filteredItems.length} records</span>
        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCsv}
                className="flex items-center space-x-1 font-semibold text-[#0877ED] hover:underline"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{t.exportCsv}</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setShowClearModal(true)}
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                {t.clearHistory}
              </button>
            </>
          )}
        </div>
      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-[#131E32] rounded-2xl p-8 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.noHistoryFound}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Scanned codes are safely saved to your device automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const isQr = item.format === 'QR_CODE';
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#131E32] rounded-xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-start justify-between space-x-3 hover:border-blue-200 transition group"
              >
                {/* Clickable Area to inspect result */}
                <div
                  onClick={() => onSelectRecord(parseBarcodeContent(item.rawContent, item.format))}
                  className="flex items-start space-x-3 flex-1 cursor-pointer overflow-hidden"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isQr ? 'bg-[#0877ED]/10 text-[#0877ED]' : 'bg-[#00B8D9]/10 text-[#00B8D9]'
                  }`}>
                    {isQr ? <QrCode className="w-5 h-5" /> : <BarcodeIcon className="w-5 h-5" />}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.format}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                      {item.rawContent}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition"
                    aria-label="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => onDeleteRecord(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition"
                    aria-label="Delete Scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131E32] rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.clearHistoryConfirmTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.clearHistoryConfirmText}
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  onClearAllHistory();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                {t.confirmClear}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AdMob Adaptive Banner (Hidden in Pro mode) */}
      <AdMobBannerSim t={t} slotName="History Adaptive Banner" isPro={isPro} />
    </div>
  );
};
