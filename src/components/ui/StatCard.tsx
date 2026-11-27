import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
  iconBgClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  deltaPositive = true,
  icon,
  iconBgClass = 'bg-[#e4ede7] text-[#1c5b48] border border-[#c5d6cb]/70',
}) => (
  <div className="card-tile group p-4 sm:p-5 flex items-start justify-between gap-3">
    <div className="flex items-center gap-3.5 min-w-0">
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${iconBgClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12.5px] font-medium text-[#6e6a62] truncate">{label}</p>
        <p className="font-serif-display text-[26px] font-normal tracking-[-0.02em] text-[#141312] mt-0.5 leading-none">
          {value}
        </p>
      </div>
    </div>
    {delta && (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-mono-tech font-medium shrink-0 border ${
          deltaPositive
            ? 'bg-[#e4ede7] text-[#1c5b48] border-[#c5d6cb]'
            : 'bg-[#FEF2F2] text-[#a5331f] border-[#FECACA]'
        }`}
      >
        {delta}
      </span>
    )}
  </div>
);
