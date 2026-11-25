import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

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
  iconBgClass = 'bg-[#EFF6FF] text-[#2563EB]',
}) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-4 sm:p-5 flex items-start justify-between gap-3 shadow-2xs">
    <div className="flex items-center gap-3.5 min-w-0">
      <div className={`h-11 w-11 rounded-full ${iconBgClass} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[22px] font-bold text-[#1F2937] leading-tight">{value}</p>
        <p className="text-[12px] font-medium text-[#6B7280] truncate mt-0.5">{label}</p>
      </div>
    </div>
    {delta && (
      <span
        className={`inline-flex items-center gap-0.5 text-[11.5px] font-semibold shrink-0 ${
          deltaPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'
        }`}
      >
        {deltaPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {delta}
      </span>
    )}
  </div>
);
