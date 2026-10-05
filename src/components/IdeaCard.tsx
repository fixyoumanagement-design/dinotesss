import React from 'react';
import { Sparkles, Calendar, ArrowRight, Trash2, Pin, CheckCircle2 } from 'lucide-react';
import { Idea } from '../types';
import { HankoStamp } from './HankoStamp';

interface IdeaCardProps {
  idea: Idea;
  onOpen: (idea: Idea) => void;
  onAnalyze: (idea: Idea) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onSchedule: (idea: Idea, e: React.MouseEvent) => void;
}

const THEME_STYLES: Record<string, { bg: string; border: string; washi: string }> = {
  cream: { bg: 'bg-[#FCFBF8]', border: 'border-[#EAE7DC]', washi: 'bg-[#EFECE1]' },
  sage: { bg: 'bg-[#F7F9F5]', border: 'border-[#DFE5D9]', washi: 'bg-[#E3EAD9]' },
  peach: { bg: 'bg-[#FCF7F5]', border: 'border-[#EFE1DB]', washi: 'bg-[#F7DDD4]' },
  sky: { bg: 'bg-[#F6F8FB]', border: 'border-[#DDE4EE]', washi: 'bg-[#DCE5F2]' },
  lavender: { bg: 'bg-[#F9F7FB]', border: 'border-[#E5DFEE]', washi: 'bg-[#ECE5F4]' },
};

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onOpen,
  onAnalyze,
  onDelete,
  onTogglePin,
  onSchedule,
}) => {
  const theme = THEME_STYLES[idea.colorTheme] || THEME_STYLES.cream;

  // Format relative or date string
  const formattedDate = new Date(idea.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div
      onClick={() => onOpen(idea)}
      className={`group relative text-left p-5 rounded-xl border ${theme.bg} ${theme.border} hover:border-[#BBB6A8] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]`}
    >
      {/* Subtle Washi Tape effect at top center */}
      <div
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 ${theme.washi} washi-tape opacity-80`}
      />

      <div>
        {/* Top bar inside card: category & pin */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs text-[#7A8079]">
          <div className="flex items-center gap-1.5">
            <span>{idea.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
            {idea.decisions?.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#4F6352] font-medium font-mono tabular-nums">
                  {idea.decisions.length} keputusan
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => onTogglePin(idea.id, e)}
              className={`p-1 rounded hover:bg-black/5 transition-colors ${
                idea.pinned ? 'text-[#C04A3E]' : 'text-[#A0A49E] hover:text-[#50544E]'
              }`}
              title={idea.pinned ? 'Lepas pin' : 'Sematkan ide'}
            >
              <Pin className={`w-3.5 h-3.5 ${idea.pinned ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Primary Title */}
        <h3 className="text-base font-semibold text-[#252826] leading-snug tracking-tight mb-2 group-hover:text-[#3B4D3E] transition-colors">
          {idea.title || 'Ide tanpa judul...'}
        </h3>

        {/* Problem statement if filled */}
        {idea.problem && (
          <div className="mb-3 p-2.5 bg-black/[0.02] border-l-2 border-[#8E9B87] rounded-r text-xs text-[#525750] leading-relaxed">
            <span className="font-medium text-[#383C36] block mb-0.5">Problem:</span>
            <p className="line-clamp-2 italic">"{idea.problem}"</p>
          </div>
        )}

        {/* Excerpt of notes */}
        {idea.notes && (
          <p className="text-xs text-[#6B716A] line-clamp-3 leading-relaxed mb-3">
            {idea.notes}
          </p>
        )}

        {/* Tags unboxed */}
        {idea.tags?.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-[#7A8079] mb-4">
            {idea.tags.map((tag, idx) => (
              <span key={idx}>
                #{tag}
                {idx < idea.tags.length - 1 ? ' ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer bar: Stamp & quick actions */}
      <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-2 mt-auto">
        <HankoStamp status={idea.status} size="sm" />

        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze(idea);
            }}
            className="p-1.5 text-[#5C645A] hover:text-[#232724] hover:bg-black/5 rounded-md transition-colors"
            title="Analisis dengan Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => onSchedule(idea, e)}
            className="p-1.5 text-[#5C645A] hover:text-[#232724] hover:bg-black/5 rounded-md transition-colors"
            title="Jadwalkan review di Google Calendar"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => onDelete(idea.id, e)}
            className="p-1.5 text-[#A2A69E] hover:text-[#B84236] hover:bg-red-50 rounded-md transition-colors"
            title="Hapus ide"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
