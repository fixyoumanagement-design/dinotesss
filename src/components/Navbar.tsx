import React from 'react';
import { Plus, BookOpen, Layers, History, Sparkles, Home } from 'lucide-react';
import { DiniNeko } from './DiniNeko';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: 'landing' | 'write' | 'board' | 'logs';
  onSelectTab: (tab: 'landing' | 'write' | 'board' | 'logs') => void;
  onNewIdea: () => void;
  onOpenWorkspace: () => void;
  user: User | null;
  ideaCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onNewIdea,
  onOpenWorkspace,
  user,
  ideaCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F4]/90 backdrop-blur-md border-b border-[#ECEAE3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with mascot */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <DiniNeko size="sm" mood="calm" />
          </div>
          <button
            onClick={() => onSelectTab('landing')}
            className="text-left group focus:outline-none"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-[#232724] group-hover:text-[#4A5D4E] transition-colors">
                dinicatet
              </span>
              <span className="text-[11px] text-[#8C9089] font-serif hidden sm:inline">
                ディニカテ · ruang ide
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('landing')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'landing'
                ? 'text-[#232724] bg-[#EEECE4]'
                : 'text-[#6C716B] hover:text-[#232724] hover:bg-[#F3F1E9]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('board')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'board'
                ? 'text-[#232724] bg-[#EEECE4]'
                : 'text-[#6C716B] hover:text-[#232724] hover:bg-[#F3F1E9]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Papan Ide</span>
            <span className="text-[10px] text-[#8C9089] font-mono tabular-nums">
              ({ideaCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('write')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'write'
                ? 'text-[#232724] bg-[#EEECE4]'
                : 'text-[#6C716B] hover:text-[#232724] hover:bg-[#F3F1E9]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Meja Tulis</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('logs')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'logs'
                ? 'text-[#232724] bg-[#EEECE4]'
                : 'text-[#6C716B] hover:text-[#232724] hover:bg-[#F3F1E9]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Log</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Workspace & New Idea) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="px-3 py-1.5 text-xs font-medium text-[#49504A] bg-[#F1EFE8] border border-[#DDD9CE] hover:bg-[#E8E5DD] hover:border-[#CCC7BA] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Google Sheets, Calendar, Slides"
          >
            <span className="w-2 h-2 rounded-full bg-[#4E885B]" />
            <span className="hidden sm:inline">Google Workspace</span>
            <span className="sm:hidden">Workspace</span>
          </button>

          <button
            type="button"
            onClick={onNewIdea}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#2A2E2B] hover:bg-[#1E211F] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Ide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
