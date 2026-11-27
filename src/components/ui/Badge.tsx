import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const toneMap: Record<BadgeTone, string> = {
  neutral: 'bg-[#e5dfd2] text-[#4c4842] border-[#ded8ca]',
  primary: 'bg-[#e4ede7] text-[#1c5b48] border-[#c5d6cb]',
  success: 'bg-[#e4ede7] text-[#15463a] border-[#c5d6cb]',
  warning: 'bg-[#FDF3DC] text-[#8a5008] border-[#EBD2A0]',
  danger: 'bg-[#FEF2F2] text-[#a5331f] border-[#FECACA]',
  info: 'bg-[#EDF3F7] text-[#1E4B6E] border-[#C8DBE6]',
};

export const Badge: React.FC<{
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}> = ({ tone = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11.5px] font-medium whitespace-nowrap ${toneMap[tone]} ${className}`}
  >
    {children}
  </span>
);
