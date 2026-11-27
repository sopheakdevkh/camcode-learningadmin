import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BarChartCard, HorizontalBreakdownCard } from '@/components/ui/Charts';
import { DataTable } from '@/components/ui/DataTable';
import { Dropdown } from '@/components/ui/Dropdown';
import { exportRowsToCsv, PermissionGuard } from '@/components/ui/PermissionGuard';
import { StatCard } from '@/components/ui/StatCard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import { BookOpen, DollarSign, RefreshCw, Users } from 'lucide-react';

export const AnalyticsReportsPage: React.FC<{
  tab?: 'platform' | 'learning' | 'courses' | 'members' | 'revenue' | 'subscriptions';
}> = ({ tab = 'platform' }) => {
  const { t } = useI18n();
  const { courses, members, orders, subscriptions, can } = useAdmin();
  const [dateWindow, setDateWindow] = useState<'30d' | '90d' | '12m'>('90d');

  const totalRev = orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.amount, 0) + 36400;
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length + 245;

  return (
    <PermissionGuard module="analytics" action="view">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">
              {t.pages.analytics[tab]}
            </h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.analytics.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 no-print">
            <Dropdown<'30d' | '90d' | '12m'>
              size="sm"
              value={dateWindow}
              onChange={setDateWindow}
              options={[
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: '12m', label: 'Last 12 months' },
              ]}
            />
            {can('analytics', 'export') && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() =>
                  exportRowsToCsv(
                    `camcode-${tab}-report.csv`,
                    ['Course', 'Enrollments', 'Completion %', 'Rating', 'Price'],
                    courses.map((c) => [c.title.en, c.enrollmentsCount, c.completionRate, c.rating, c.price]),
                  )
                }
              >
                Export CSV
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
              Print PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Gross Revenue" value={`$${totalRev.toLocaleString()}`} delta="+18.4%" icon={<DollarSign className="h-5 w-5" />} />
          <StatCard label="Avg Completion Rate" value="74%" delta="+4.2%" icon={<BookOpen className="h-5 w-5" />} />
          <StatCard label="Active Members" value={(1120 + members.length).toLocaleString()} delta="78% retention" icon={<Users className="h-5 w-5" />} />
          <StatCard label="Active Subscriptions" value={activeSubs} delta="2.1% monthly churn" icon={<RefreshCw className="h-5 w-5" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BarChartCard
            title="Monthly Revenue Breakdown (USD)"
            subtitle="Combined course purchases & subscription renewals"
            valuePrefix="$"
            data={[
              { label: 'Jul', value: 5100 },
              { label: 'Aug', value: 4850 },
              { label: 'Sep', value: 6400 },
              { label: 'Oct', value: 7250 },
              { label: 'Nov', value: 8640 },
            ]}
          />
          <HorizontalBreakdownCard
            title="Course Performance by Completion Rate"
            subtitle="Percentage of enrolled learners finishing all required modules"
            items={courses
              .filter((c) => c.completionRate > 0)
              .map((c) => ({
                label: c.title.en,
                value: c.completionRate,
                displayValue: `${c.completionRate}% (${c.enrollmentsCount.toLocaleString()})`,
                color: '#1c5b48',
              }))}
          />
        </div>

        <DataTable
          data={courses}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Filter course performance..."
          searchFilter={(c, q) => c.title.en.toLowerCase().includes(q)}
          columns={[
            { key: 'title', header: 'Course', render: (c) => <span className="font-semibold">{c.title.en}</span> },
            { key: 'enroll', header: 'Enrollments', render: (c) => c.enrollmentsCount.toLocaleString() },
            { key: 'comp', header: 'Completion Rate', render: (c) => `${c.completionRate}%` },
            { key: 'rating', header: 'Rating', render: (c) => `${c.rating || '—'} ★` },
            { key: 'rev', header: 'Est. Course Revenue', render: (c) => `$${(c.price * Math.round(c.enrollmentsCount * 0.15)).toLocaleString()}` },
          ]}
        />
      </div>
    </PermissionGuard>
  );
};

