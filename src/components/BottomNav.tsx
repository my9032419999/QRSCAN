import React from 'react';
import { Home, Scan, PlusCircle, History, Settings } from 'lucide-react';
import { Translations } from '../utils/translations';

export type NavTab = 'home' | 'scan' | 'create' | 'history' | 'settings' | 'saved' | 'android';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  t: Translations;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  t
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: t.navHome, icon: Home },
    { id: 'scan' as NavTab, label: t.navScan, icon: Scan, isPrimary: true },
    { id: 'create' as NavTab, label: t.navCreate, icon: PlusCircle },
    { id: 'history' as NavTab, label: t.navHistory, icon: History },
    { id: 'settings' as NavTab, label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0B111E]/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                className="group relative flex flex-col items-center -top-3.5 focus:outline-none"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#0877ED] to-[#00B8D9] text-white shadow-[#0877ED]/40 ring-4 ring-white dark:ring-[#0B111E]'
                      : 'bg-[#0877ED] text-white hover:bg-[#0766ce] shadow-[#0877ED]/30'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-[#0877ED] dark:text-[#00B8D9]' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#0877ED] dark:text-[#00B8D9]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`px-3 py-1 rounded-full transition-all ${
                  isActive ? 'bg-[#0877ED]/12 dark:bg-[#0877ED]/25' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
