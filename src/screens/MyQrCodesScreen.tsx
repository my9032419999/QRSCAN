import React, { useState } from 'react';
import QRCode from 'qrcode';
import { 
  Search, 
  Trash2, 
  Download, 
  Share2, 
  Star, 
  QrCode, 
  Edit3, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { SavedQrItem } from './GeneratorScreen';

interface MyQrCodesScreenProps {
  t: Translations;
  savedCodes: SavedQrItem[];
  onDeleteCode: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRenameCode: (id: string, newTitle: string) => void;
  onSelectToEdit: (code: SavedQrItem) => void;
}

export const MyQrCodesScreen: React.FC<MyQrCodesScreenProps> = ({
  t,
  savedCodes,
  onDeleteCode,
  onToggleFavorite,
  onRenameCode,
  onSelectToEdit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<SavedQrItem | null>(null);

  const filtered = savedCodes.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (item: SavedQrItem) => {
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, item.content, {
      width: 600,
      margin: 2,
      color: {
        dark: item.fgColor,
        light: item.bgColor
      },
      errorCorrectionLevel: item.ecc
    }, (err) => {
      if (!err) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `QuickQR_${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        link.click();
      }
    });
  };

  const handleShare = async (item: SavedQrItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(item.content);
      alert('Content copied to clipboard!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
      {/* Search Header */}
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

      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold">
        <span>{filtered.length} Saved QR Codes</span>
      </div>

      {/* Grid of Saved QR Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#131E32] rounded-2xl p-8 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0877ED] flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.noSavedCodes}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-200 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0877ED] bg-[#0877ED]/10 px-2 py-0.5 rounded-md">
                    {item.type}
                  </span>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="text-slate-400 hover:text-amber-500"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Title & Rename input */}
                {editingId === item.id ? (
                  <div className="flex items-center space-x-1 mt-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded bg-slate-50 dark:bg-slate-900"
                    />
                    <button
                      onClick={() => {
                        onRenameCode(item.id, editingTitle);
                        setEditingId(null);
                      }}
                      className="p-1 text-emerald-500"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingTitle(item.title);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-500 font-mono truncate mt-1">
                  {item.content}
                </p>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center space-x-1 text-xs font-semibold text-[#0877ED] hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleShare(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCode(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
