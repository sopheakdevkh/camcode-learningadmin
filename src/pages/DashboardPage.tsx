import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Award,
  BookOpen,
  Clock,
  CreditCard,
  DollarSign,
  Film,
  Plus,
  RefreshCw,
  UserPlus,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  AreaTrendChart,
  DonutDistributionCard,
  HorizontalBreakdownCard,
} from '@/components/ui/Charts';
import { StatCard } from '@/components/ui/StatCard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';

export const DashboardPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { currentAdmin, courses, members, orders, subscriptions, categories, auditLogs, can } =
    useAdmin();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [chartTab, setChartTab] = useState<'revenue' | 'enrollments' | 'members' | 'subscriptions'>(
    'revenue',
  );

  const multiplier = dateRange === '7d' ? 0.25 : dateRange === '30d' ? 1 : dateRange === '90d' ? 2.8 : 7.5;

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const publishedCourses = courses.filter((c) => c.status === 'published').length;
  const totalEnrollments = courses.reduce((s, c) => s + c.enrollmentsCount, 0);
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;
  const paidRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((s, o) => s + o.amount, 0);
  const pendingPayments = orders.filter((o) => o.status === 'pending').length;

  const areaSeries = useMemo(() => {
    if (chartTab === 'revenue') {
      return {
        daily: [
          { label: 'Mon', value: Math.round(820 * multiplier) },
          { label: 'Tue', value: Math.round(1150 * multiplier) },
          { label: 'Wed', value: Math.round(980 * multiplier) },
          { label: 'Thu', value: Math.round(1420 * multiplier) },
          { label: 'Fri', value: Math.round(1610 * multiplier) },
          { label: 'Sat', value: Math.round(1290 * multiplier) },
          { label: 'Sun', value: Math.round(1370 * multiplier) },
        ],
        weekly: [
          { label: 'Wk 1', value: Math.round(5200 * multiplier) },
          { label: 'Wk 2', value: Math.round(6100 * multiplier) },
          { label: 'Wk 3', value: Math.round(5850 * multiplier) },
          { label: 'Wk 4', value: Math.round(7400 * multiplier) },
          { label: 'Wk 5', value: Math.round(8150 * multiplier) },
          { label: 'Wk 6', value: Math.round(8640 * multiplier) },
        ],
        monthly: [
          { label: 'Jun', value: Math.round(4200 * multiplier) },
          { label: 'Jul', value: Math.round(5100 * multiplier) },
          { label: 'Aug', value: Math.round(4850 * multiplier) },
          { label: 'Sep', value: Math.round(6400 * multiplier) },
          { label: 'Oct', value: Math.round(7250 * multiplier) },
          { label: 'Nov', value: Math.round(8640 * multiplier) },
        ],
      };
    }
    if (chartTab === 'enrollments') {
      return {
        daily: [
          { label: 'Mon', value: Math.round(42 * multiplier) },
          { label: 'Tue', value: Math.round(68 * multiplier) },
          { label: 'Wed', value: Math.round(54 * multiplier) },
          { label: 'Thu', value: Math.round(79 * multiplier) },
          { label: 'Fri', value: Math.round(92 * multiplier) },
          { label: 'Sat', value: Math.round(65 * multiplier) },
          { label: 'Sun', value: Math.round(71 * multiplier) },
        ],
        weekly: [
          { label: 'Wk 1', value: Math.round(280 * multiplier) },
          { label: 'Wk 2', value: Math.round(340 * multiplier) },
          { label: 'Wk 3', value: Math.round(390 * multiplier) },
          { label: 'Wk 4', value: Math.round(440 * multiplier) },
          { label: 'Wk 5', value: Math.round(485 * multiplier) },
          { label: 'Wk 6', value: Math.round(530 * multiplier) },
        ],
        monthly: [
          { label: 'Jun', value: Math.round(620 * multiplier) },
          { label: 'Jul', value: Math.round(780 * multiplier) },
          { label: 'Aug', value: Math.round(890 * multiplier) },
          { label: 'Sep', value: Math.round(1120 * multiplier) },
          { label: 'Oct', value: Math.round(1340 * multiplier) },
          { label: 'Nov', value: Math.round(1580 * multiplier) },
        ],
      };
    }
    if (chartTab === 'members') {
      return {
        daily: [
          { label: 'Mon', value: 18 },
          { label: 'Tue', value: 24 },
          { label: 'Wed', value: 19 },
          { label: 'Thu', value: 31 },
          { label: 'Fri', value: 28 },
          { label: 'Sat', value: 22 },
          { label: 'Sun', value: 26 },
        ],
        weekly: [
          { label: 'Wk 1', value: 92 },
          { label: 'Wk 2', value: 114 },
          { label: 'Wk 3', value: 108 },
          { label: 'Wk 4', value: 132 },
          { label: 'Wk 5', value: 145 },
          { label: 'Wk 6', value: 168 },
        ],
        monthly: [
          { label: 'Jun', value: Math.round(180 * multiplier) },
          { label: 'Jul', value: Math.round(240 * multiplier) },
          { label: 'Aug', value: Math.round(295 * multiplier) },
          { label: 'Sep', value: Math.round(350 * multiplier) },
          { label: 'Oct', value: Math.round(420 * multiplier) },
          { label: 'Nov', value: Math.round(510 * multiplier) },
        ],
      };
    }
    return {
      daily: [
        { label: 'Mon', value: 8 },
        { label: 'Tue', value: 11 },
        { label: 'Wed', value: 9 },
        { label: 'Thu', value: 14 },
        { label: 'Fri', value: 15 },
        { label: 'Sat', value: 10 },
        { label: 'Sun', value: 12 },
      ],
      weekly: [
        { label: 'Wk 1', value: 44 },
        { label: 'Wk 2', value: 52 },
        { label: 'Wk 3', value: 49 },
        { label: 'Wk 4', value: 61 },
        { label: 'Wk 5', value: 68 },
        { label: 'Wk 6', value: 74 },
      ],
      monthly: [
        { label: 'Jun', value: Math.round(95 * multiplier) },
        { label: 'Jul', value: Math.round(118 * multiplier) },
        { label: 'Aug', value: Math.round(145 * multiplier) },
        { label: 'Sep', value: Math.round(176 * multiplier) },
        { label: 'Oct', value: Math.round(210 * multiplier) },
        { label: 'Nov', value: Math.round(248 * multiplier) },
      ],
    };
  }, [chartTab, multiplier]);

  const categoryDistribution = [
    {
      label: categories[0] ? pickText(categories[0].name) : 'Digital Marketing',
      sublabel: `${categories[0]?.courseCount ?? 18} ${t.pages.dashboard.coursesUnit}`,
      value: 34,
      color: '#2563EB',
    },
    {
      label: categories[1] ? pickText(categories[1].name) : 'Software Development',
      sublabel: `${categories[1]?.courseCount ?? 24} ${t.pages.dashboard.coursesUnit}`,
      value: 38,
      color: '#0891B2',
    },
    {
      label: categories[3] ? pickText(categories[3].name) : 'Business & Data AI',
      sublabel: `${(categories[3]?.courseCount ?? 21) + (categories[4]?.courseCount ?? 14)} ${t.pages.dashboard.coursesUnit}`,
      value: 28,
      color: '#16A34A',
    },
  ];

  const topCompletionCourses = [...courses]
    .filter((c) => c.completionRate > 0)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 4)
    .map((c) => ({
      label: pickText(c.title),
      value: c.completionRate,
      displayValue: `${c.completionRate}% ${t.pages.dashboard.completionLabel}`,
      color: '#16A34A',
    }));

  const firstName = currentAdmin?.name.split(' ')[0] ?? 'Admin';

  return (
    <div className="space-y-6">
      {/* Greeting Header + Date Filter + Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
            {t.pages.dashboardGreeting} {firstName}!
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            {t.pages.dashboardSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-[8px] border border-[#E5E7EB] bg-white p-0.5">
            {(['7d', '30d', '90d', 'ytd'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1 rounded-[6px] text-[12px] font-semibold uppercase cursor-pointer ${
                  dateRange === r ? 'bg-[#2563EB] text-white' : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {can('courses', 'create') && (
            <Link to="/courses">
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                {t.pages.dashboard.createCourse}
              </Button>
            </Link>
          )}
          {can('videos', 'create') && (
            <Link to="/videos">
              <Button size="sm" variant="outline" leftIcon={<Film className="h-3.5 w-3.5" />}>
                {t.pages.dashboard.addVideo}
              </Button>
            </Link>
          )}
          {can('members', 'create') && (
            <Link to="/members">
              <Button size="sm" variant="outline" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
                {t.pages.dashboard.addMember}
              </Button>
            </Link>
          )}
          {can('plans', 'create') && (
            <Link to="/plans">
              <Button size="sm" variant="outline" leftIcon={<CreditCard className="h-3.5 w-3.5" />}>
                {t.pages.dashboard.createPlan}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Primary 4 KPI Cards (matching clean reference layout) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={t.pages.dashboard.totalRevenue}
          value={`$${(36400 + paidRevenue).toLocaleString()}`}
          delta="+21.3%"
          iconBgClass="bg-[#EFF6FF] text-[#2563EB]"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label={t.pages.dashboard.totalMembers}
          value={(1480 + members.length).toLocaleString()}
          delta="+14.2%"
          iconBgClass="bg-[#F0FDF4] text-[#16A34A]"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label={t.pages.dashboard.totalEnrollments}
          value={totalEnrollments.toLocaleString()}
          delta="+18.6%"
          iconBgClass="bg-[#ECFEFF] text-[#0891B2]"
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          label={t.pages.dashboard.activeSubscriptions}
          value={(245 + activeSubs).toLocaleString()}
          delta="+9.4%"
          iconBgClass="bg-[#FFFBEB] text-[#D97706]"
          icon={<RefreshCw className="h-5 w-5" />}
        />
      </section>

      {/* Secondary 4 KPI Strip (completing all 8 required platform KPIs cleanly) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t.pages.dashboard.activeMembers}
          value={(1120 + activeMembers).toLocaleString()}
          delta={`76% ${t.pages.dashboard.activePct}`}
          iconBgClass="bg-[#F0FDF4] text-[#16A34A]"
          icon={<Activity className="h-4.5 w-4.5" />}
        />
        <StatCard
          label={t.pages.dashboard.totalCourses}
          value={courses.length}
          delta={`${publishedCourses} ${t.pages.dashboard.liveLabel}`}
          iconBgClass="bg-[#EFF6FF] text-[#2563EB]"
          icon={<BookOpen className="h-4.5 w-4.5" />}
        />
        <StatCard
          label={t.pages.dashboard.publishedCourses}
          value={publishedCourses}
          delta={t.pages.dashboard.catalogReady}
          iconBgClass="bg-[#ECFEFF] text-[#0891B2]"
          icon={<Award className="h-4.5 w-4.5" />}
        />
        <StatCard
          label={t.pages.dashboard.pendingPayments}
          value={pendingPayments}
          delta={pendingPayments > 0 ? t.pages.dashboard.needsReview : t.pages.dashboard.allClear}
          deltaPositive={pendingPayments === 0}
          iconBgClass="bg-[#FEF2F2] text-[#DC2626]"
          icon={<Clock className="h-4.5 w-4.5" />}
        />
      </section>

      {/* Row 2: 8-col Smooth Area Chart + 4-col Active Courses List */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8">
          <AreaTrendChart
            title={
              chartTab === 'revenue'
                ? t.pages.dashboard.revenueOverview
                : chartTab === 'enrollments'
                  ? t.pages.dashboard.enrollmentTrends
                  : chartTab === 'members'
                    ? t.pages.dashboard.memberGrowth
                    : t.pages.dashboard.subscriptionGrowth
            }
            subtitle={t.pages.dashboard.analyticsSubtitle}
            seriesByRange={areaSeries}
            valuePrefix={chartTab === 'revenue' ? '$' : ''}
            accentColor="#2563EB"
            rangeLabels={{
              daily: t.pages.dashboard.daily,
              weekly: t.pages.dashboard.weekly,
              monthly: t.pages.dashboard.monthly,
            }}
            headerRightExtra={
              <div className="inline-flex rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-0.5 text-[11.5px]">
                {(['revenue', 'enrollments', 'members', 'subscriptions'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setChartTab(tab)}
                    className={`px-2 py-1 rounded-[6px] cursor-pointer ${
                      chartTab === tab
                        ? 'bg-[#2563EB] text-white font-semibold'
                        : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}
                  >
                    {tab === 'revenue'
                      ? t.pages.dashboard.revenueTab
                      : tab === 'enrollments'
                        ? t.pages.dashboard.enrollmentsTab
                        : tab === 'members'
                          ? t.pages.dashboard.membersTab
                          : t.pages.dashboard.subscriptionsTab}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        <div className="xl:col-span-4 bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#1F2937]">
                {t.pages.dashboard.popularCourses}
              </h2>
              <Link to="/courses" className="text-[12.5px] font-semibold text-[#2563EB] hover:underline">
                {t.pages.dashboard.seeAll}
              </Link>
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {[...courses]
                .sort((a, b) => b.enrollmentsCount - a.enrollmentsCount)
                .slice(0, 4)
                .map((c) => (
                  <Link
                    key={c.id}
                    to="/courses"
                    className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-[9px] bg-[#EFF6FF] text-[#2563EB] font-bold text-[11px] flex items-center justify-center shrink-0">
                        {c.durationHours}H
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#1F2937] group-hover:text-[#2563EB] truncate">
                          {pickText(c.title)}
                        </p>
                        <p className="text-[11.5px] text-[#6B7280]">
                          {c.completionRate}% {t.pages.dashboard.completionLabel} ·{' '}
                          {c.price === 0 ? t.pages.dashboard.freeLabel : `$${c.price}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11.5px] font-mono-custom text-[#6B7280] shrink-0">
                      {c.enrollmentsCount.toLocaleString()}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: 5-col Category Distribution Donut + 7-col Latest Orders & Members */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-5 flex flex-col">
          <DonutDistributionCard
            title={t.pages.dashboard.catalogDistribution}
            items={categoryDistribution}
            centerValue={String(courses.length)}
            centerLabel={t.pages.dashboard.totalCourses}
          />
        </div>

        <div className="xl:col-span-7 bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              {t.pages.dashboard.latestOrders}
            </h2>
            <Link to="/orders" className="text-[12.5px] font-semibold text-[#2563EB] hover:underline">
              {t.pages.dashboard.seeAll}
            </Link>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-9 w-9 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[12px] font-bold flex items-center justify-center shrink-0">
                    {ord.memberName
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-[#1F2937] truncate">
                      {ord.memberName}
                    </p>
                    <p className="text-[12px] text-[#6B7280] truncate">{ord.itemName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono-custom text-[12.5px] font-semibold text-[#1F2937]">
                    ${ord.amount.toFixed(2)}
                  </span>
                  <Badge
                    tone={
                      ord.status === 'paid'
                        ? 'success'
                        : ord.status === 'pending'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    {ord.status}
                  </Badge>
                  <Link to="/orders">
                    <Button size="sm" variant="outline">
                      {t.pages.dashboard.viewBtn}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Row 4: Top Performing Courses + Recent Platform Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <HorizontalBreakdownCard
            title={t.pages.dashboard.topPerforming}
            subtitle={t.pages.dashboard.topPerformingSub}
            items={topCompletionCourses}
          />
        </div>

        <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm rounded-[14px] border border-[#E5E7EB] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#1F2937]">
              {t.pages.dashboard.recentActivity}
            </h2>
            <Link to="/system/audit-logs" className="text-[12.5px] font-medium text-[#2563EB] hover:underline">
              {t.pages.dashboard.auditLogsLink}
            </Link>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12.5px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Badge tone="primary">{log.module}</Badge>
                  <span className="text-[#1F2937] truncate">{log.action}</span>
                </div>
                <span className="text-[#6B7280] shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
