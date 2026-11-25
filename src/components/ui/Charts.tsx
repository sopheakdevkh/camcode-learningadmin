import React, { useMemo, useState } from 'react';

interface SeriesPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export const BarChartCard: React.FC<{
  title: string;
  subtitle?: string;
  data: SeriesPoint[];
  valuePrefix?: string;
  color?: string;
}> = ({ title, subtitle, data, valuePrefix = '', color = '#2563EB' }) => {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 space-y-4">
      <div>
        <h3 className="text-[15px] font-semibold text-[#1F2937]">{title}</h3>
        {subtitle && <p className="text-[12px] text-[#6B7280]">{subtitle}</p>}
      </div>
      <div
        className="grid gap-2 sm:gap-3 items-end h-44 pt-4"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
      >
        {data.map((pt) => {
          const pct = Math.max(8, Math.round((pt.value / max) * 100));
          return (
            <div key={pt.label} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[11px] font-mono-custom text-[#6B7280]">
                {valuePrefix}
                {pt.value.toLocaleString()}
              </span>
              <div
                className="w-full max-w-[36px] rounded-t-[6px] transition-all"
                style={{ height: `${pct}%`, backgroundColor: color }}
              />
              <span className="text-[11.5px] font-medium text-[#4B5563]">{pt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HorizontalBreakdownCard: React.FC<{
  title: string;
  subtitle?: string;
  items: { label: string; value: number; displayValue: string; color?: string }[];
}> = ({ title, subtitle, items }) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 space-y-4">
      <div>
        <h3 className="text-[15px] font-semibold text-[#1F2937]">{title}</h3>
        {subtitle && <p className="text-[12px] text-[#6B7280]">{subtitle}</p>}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[12.5px]">
              <span className="font-medium text-[#1F2937] truncate pr-2">{item.label}</span>
              <span className="font-mono-custom font-semibold text-[#4B5563] shrink-0">
                {item.displayValue}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(4, Math.round((item.value / max) * 100))}%`,
                  backgroundColor: item.color ?? '#2563EB',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AreaTrendChart: React.FC<{
  title: string;
  subtitle?: string;
  seriesByRange: Record<'daily' | 'weekly' | 'monthly', SeriesPoint[]>;
  valuePrefix?: string;
  accentColor?: string;
  headerRightExtra?: React.ReactNode;
  rangeLabels?: Record<'daily' | 'weekly' | 'monthly', string>;
}> = ({
  title,
  subtitle,
  seriesByRange,
  valuePrefix = '',
  accentColor = '#2563EB',
  headerRightExtra,
  rangeLabels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
}) => {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const data = seriesByRange[range];

  const { linePath, areaPath, points, maxVal } = useMemo(() => {
    const w = 640;
    const h = 190;
    const padX = 24;
    const padY = 18;
    const maxV = Math.max(10, ...data.map((d) => d.value));

    const coords = data.map((d, i) => {
      const x = padX + (i * (w - padX * 2)) / Math.max(1, data.length - 1);
      const y = h - padY - (d.value / maxV) * (h - padY * 2);
      return { x, y, ...d };
    });

    if (coords.length === 0) {
      return { linePath: '', areaPath: '', points: [], maxVal: maxV };
    }

    let dLine = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      dLine += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const dArea = `${dLine} L ${last.x} ${h - padY} L ${first.x} ${h - padY} Z`;

    return { linePath: dLine, areaPath: dArea, points: coords, maxVal: maxV };
  }, [data]);

  const gradId = React.useId();

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1F2937]">{title}</h3>
          {subtitle && <p className="text-[12px] text-[#6B7280]">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {headerRightExtra}
          <div className="inline-flex rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-0.5">
            {(['daily', 'weekly', 'monthly'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium capitalize cursor-pointer ${
                  range === r
                    ? 'bg-white text-[#1F2937] font-semibold shadow-2xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                {rangeLabels[r]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <svg viewBox="0 0 640 215" className="w-full h-52 overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = 172 - ratio * 154;
          return (
            <g key={ratio}>
              <line x1="24" y1={y} x2="616" y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
              <text x="0" y={y + 4} fontSize="10.5" fill="#9CA3AF" className="font-mono-custom">
                {valuePrefix}
                {Math.round(maxVal * ratio).toLocaleString()}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />

        {points.map((pt) => (
          <g key={pt.label}>
            <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke={accentColor} strokeWidth="2.2" />
            <title>{`${pt.label}: ${valuePrefix}${pt.value.toLocaleString()}`}</title>
            <text x={pt.x} y="204" textAnchor="middle" fontSize="11" fill="#6B7280">
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const DonutDistributionCard: React.FC<{
  title: string;
  items: { label: string; sublabel: string; value: number; color: string }[];
  centerValue: string;
  centerLabel: string;
}> = ({ title, items, centerValue, centerLabel }) => {
  const total = Math.max(1, items.reduce((s, i) => s + i.value, 0));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between gap-4">
      <h3 className="text-[16px] font-semibold text-[#1F2937]">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
        <div className="space-y-3 w-full sm:w-auto flex-1">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1F2937] truncate">{item.label}</p>
                <p className="text-[11.5px] text-[#6B7280]">{item.sublabel}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-36 w-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
            <circle cx="66" cy="66" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="16" />
            {items.map((item) => {
              const segLen = (item.value / total) * circumference;
              const offset = -cumulative;
              cumulative += segLen;
              return (
                <circle
                  key={item.label}
                  cx="66"
                  cy="66"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="16"
                  strokeDasharray={`${Math.max(0, segLen - 3)} ${circumference}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[19px] font-bold text-[#1F2937] leading-none">{centerValue}</span>
            <span className="text-[10.5px] text-[#6B7280] mt-1">{centerLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
