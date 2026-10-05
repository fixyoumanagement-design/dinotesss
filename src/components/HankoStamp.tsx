import React from 'react';
import { IdeaStatus } from '../types';

interface HankoStampProps {
  status: IdeaStatus;
  size?: 'sm' | 'md';
}

const STAMP_CONFIG: Record<IdeaStatus, { kanji: string; romaji: string; label: string }> = {
  draft: { kanji: '草', romaji: 'SOU', label: 'Draf Mentah' },
  analyzing: { kanji: '考', romaji: 'KOU', label: 'Dianalisis' },
  validated: { kanji: '済', romaji: 'SUMI', label: 'Tervalidasi' },
  paused: { kanji: '休', romaji: 'KYU', label: 'Dijeda' },
  done: { kanji: '決', romaji: 'KETSU', label: 'Selesai' },
};

export const HankoStamp: React.FC<HankoStampProps> = ({ status, size = 'sm' }) => {
  const config = STAMP_CONFIG[status] || STAMP_CONFIG.draft;
  const isSm = size === 'sm';

  return (
    <div
      className={`hanko-seal inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#B84236] text-[#B84236] bg-[#FFF8F7]/60 rounded select-none ${
        isSm ? 'text-[11px]' : 'text-xs'
      }`}
      title={`Status: ${config.label}`}
    >
      <span className="font-serif font-bold leading-none">{config.kanji}</span>
      <span className="text-[10px] tracking-wider uppercase font-medium">
        {config.label}
      </span>
    </div>
  );
};
