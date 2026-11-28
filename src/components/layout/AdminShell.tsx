import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Database,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Film,
  FolderTree,
  Globe,
  HelpCircle,
  Image,
  KeyRound,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  ListChecks,
  LogOut,
  Map,
  Megaphone,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plug,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminModule } from '@/types';

interface SidebarItem {
  to: string;
  label: string;
  module: AdminModule;
  icon: React.ReactNode;
  badge?: number;
}

const BrandMark: React.FC<{ small?: boolean }> = ({ small = false }) => (
  <span
    className={`inline-flex ${
      small ? 'h-8 w-8' : 'h-9 w-9'
    } items-center justify-center rounded-xl bg-[#1c5b48] text-white border border-white/15 shadow-2xs shrink-0`}
  >
    <svg width={small ? 15 : 17} height={small ? 15 : 17} viewBox="0 0 16 16" fill="none">
      <path
        d="M3 5.5H13M3 10.5C5.2 8.9 6.8 12.1 9 10.5C10.5 9.4 11.7 9.6 13 10.5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const AdminShell: React.FC = () => {
  const { t, locale, toggleLocale } = useI18n();
  const {
    currentAdmin,
    currentRole,
    courses,
    members,
    orders,
    auditLogs,
    can,
    logoutAdmin,
  } = useAdmin();

  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navGroups: { title: string; items: SidebarItem[] }[] = useMemo(
    () => [
      {
        title: t.groups.overview,
        items: [{ to: '/', label: t.nav.dashboard, module: 'dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> }],
      },
      {
        title: t.groups.learning,
        items: [
          { to: '/courses', label: t.nav.courses, module: 'courses', icon: <BookOpen className="h-4.5 w-4.5" />, badge: courses.length },
          { to: '/lessons', label: t.nav.lessons, module: 'lessons', icon: <ListChecks className="h-4.5 w-4.5" /> },
          { to: '/videos', label: t.nav.videos, module: 'videos', icon: <Film className="h-4.5 w-4.5" /> },
          { to: '/categories', label: t.nav.categories, module: 'categories', icon: <FolderTree className="h-4.5 w-4.5" /> },
          { to: '/instructors', label: t.nav.instructors, module: 'instructors', icon: <UserCheck className="h-4.5 w-4.5" /> },
          { to: '/learning-paths', label: t.nav.paths, module: 'paths', icon: <Map className="h-4.5 w-4.5" /> },
          { to: '/certifications', label: t.nav.certifications, module: 'certifications', icon: <Award className="h-4.5 w-4.5" /> },
          { to: '/assessments', label: t.nav.assessments, module: 'assessments', icon: <ClipboardCheck className="h-4.5 w-4.5" /> },
          { to: '/question-bank', label: t.nav.questionBank, module: 'question_bank', icon: <Database className="h-4.5 w-4.5" /> },
          { to: '/certificate-templates', label: t.nav.templates, module: 'templates', icon: <LayoutTemplate className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.groups.users,
        items: [
          { to: '/members', label: t.nav.members, module: 'members', icon: <Users className="h-4.5 w-4.5" /> },
          { to: '/administrators', label: t.nav.administrators, module: 'administrators', icon: <KeyRound className="h-4.5 w-4.5" /> },
          { to: '/roles', label: t.nav.roles, module: 'roles', icon: <Shield className="h-4.5 w-4.5" /> },
          { to: '/member-activity', label: t.nav.memberActivity, module: 'member_activity', icon: <Activity className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.groups.commerce,
        items: [
          { to: '/orders', label: t.nav.orders, module: 'orders', icon: <Receipt className="h-4.5 w-4.5" /> },
          { to: '/payments', label: t.nav.payments, module: 'payments', icon: <CreditCard className="h-4.5 w-4.5" /> },
          { to: '/subscriptions', label: t.nav.subscriptions, module: 'subscriptions', icon: <RefreshCw className="h-4.5 w-4.5" /> },
          { to: '/plans', label: t.nav.plans, module: 'plans', icon: <Sparkles className="h-4.5 w-4.5" /> },
          { to: '/coupons', label: t.nav.coupons, module: 'coupons', icon: <Percent className="h-4.5 w-4.5" /> },
          { to: '/invoices', label: t.nav.invoices, module: 'invoices', icon: <FileText className="h-4.5 w-4.5" /> },
          { to: '/refunds', label: t.nav.refunds, module: 'refunds', icon: <DollarSign className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.groups.engagement,
        items: [
          { to: '/announcements', label: t.nav.announcements, module: 'announcements', icon: <Megaphone className="h-4.5 w-4.5" /> },
          { to: '/notifications', label: t.nav.notifications, module: 'notifications', icon: <Bell className="h-4.5 w-4.5" /> },
          { to: '/reviews', label: t.nav.reviews, module: 'reviews', icon: <Star className="h-4.5 w-4.5" /> },
          { to: '/support', label: t.nav.support, module: 'support', icon: <LifeBuoy className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.groups.marketing,
        items: [
          { to: '/marketing/homepage', label: t.nav.homepage, module: 'marketing', icon: <LayoutTemplate className="h-4.5 w-4.5" /> },
          { to: '/marketing/featured-courses', label: t.nav.featuredCourses, module: 'marketing', icon: <CheckCircle2 className="h-4.5 w-4.5" /> },
          { to: '/marketing/featured-videos', label: t.nav.featuredVideos, module: 'marketing', icon: <Film className="h-4.5 w-4.5" /> },
          { to: '/marketing/banners', label: t.nav.banners, module: 'marketing', icon: <Image className="h-4.5 w-4.5" /> },
          { to: '/marketing/testimonials', label: t.nav.testimonials, module: 'marketing', icon: <MessageSquare className="h-4.5 w-4.5" /> },
          { to: '/marketing/seo', label: t.nav.seo, module: 'seo', icon: <Tag className="h-4.5 w-4.5" /> },
          { to: '/marketing/translations', label: t.nav.translations, module: 'translations', icon: <Languages className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.groups.analytics,
        items: [
          { to: '/analytics', label: t.nav.platformAnalytics, module: 'analytics', icon: <BarChart3 className="h-4.5 w-4.5" /> },
          { to: '/analytics/learning', label: t.nav.learningAnalytics, module: 'analytics', icon: <TrendingUp className="h-4.5 w-4.5" /> },
          { to: '/analytics/courses', label: t.nav.coursePerformance, module: 'analytics', icon: <BookOpen className="h-4.5 w-4.5" /> },
          { to: '/analytics/members', label: t.nav.memberReports, module: 'analytics', icon: <Users className="h-4.5 w-4.5" /> },
          { to: '/analytics/revenue', label: t.nav.revenueReports, module: 'analytics', icon: <DollarSign className="h-4.5 w-4.5" /> },
          { to: '/analytics/subscriptions', label: t.nav.subscriptionReports, module: 'analytics', icon: <FileSpreadsheet className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.groups.system,
        items: [
          { to: '/system/audit-logs', label: t.nav.auditLogs, module: 'audit_logs', icon: <ShieldAlert className="h-4.5 w-4.5" /> },
          { to: '/system/activity-logs', label: t.nav.activityLogs, module: 'audit_logs', icon: <Activity className="h-4.5 w-4.5" /> },
          { to: '/system/settings', label: t.nav.settings, module: 'settings', icon: <Settings className="h-4.5 w-4.5" /> },
          { to: '/system/integrations', label: t.nav.integrations, module: 'integrations', icon: <Plug className="h-4.5 w-4.5" /> },
          { to: '/system/maintenance', label: t.nav.maintenance, module: 'maintenance', icon: <Database className="h-4.5 w-4.5" /> },
          { to: '/system/rbac-preview', label: t.nav.rbacPreview, module: 'roles', icon: <Shield className="h-4.5 w-4.5" /> },
        ],
      },
    ],
    [t],
  );

  // Permission-filtered sidebar groups
  const visibleGroups = useMemo(
    () =>
      navGroups
        .map((g) => ({
          ...g,
          items: g.items.filter((item) => can(item.module, 'view')),
        }))
        .filter((g) => g.items.length > 0),
    [navGroups, can],
  );

  const breadcrumb = useMemo(() => {
    const flat = navGroups.flatMap((g) => g.items.map((i) => ({ group: g.title, ...i })));
    const match = flat.find((i) => i.to === location.pathname);
    return match ?? { group: t.groups.overview, label: t.nav.dashboard };
  }, [navGroups, location.pathname, t]);

  const searchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const hits: { label: string; kind: string; to: string }[] = [];
    visibleGroups.forEach((g) =>
      g.items.forEach((i) => {
        if (i.label.toLowerCase().includes(q)) hits.push({ label: i.label, kind: g.title, to: i.to });
      }),
    );
    courses.forEach((c) => {
      if (c.title.en.toLowerCase().includes(q)) hits.push({ label: c.title.en, kind: 'Course', to: '/courses' });
    });
    members.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) {
        hits.push({ label: `${m.name} (${m.email})`, kind: 'Member', to: '/members' });
      }
    });
    orders.forEach((o) => {
      if (o.orderNumber.toLowerCase().includes(q)) hits.push({ label: o.orderNumber, kind: 'Order', to: '/orders' });
    });
    return hits.slice(0, 8);
  }, [searchQuery, visibleGroups, courses, members, orders]);

  const renderSidebarContent = (isCollapsed: boolean, onClickItem?: () => void) => (
    <div className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4 space-y-5">
      {visibleGroups.map((group) => (
        <div key={group.title}>
          {!isCollapsed && (
            <p className="px-3 mb-1.5 font-mono-tech text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#A3ACA6]">
              {group.title}
            </p>
          )}
          <nav className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClickItem}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} gap-2.5 py-2 rounded-xl text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#f6f3ec] text-[#141312] font-semibold shadow-2xs'
                      : 'text-[#D5D1C8] hover:bg-white/10 hover:text-[#f6f3ec]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0">{item.icon}</span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono-tech text-[10.5px] font-semibold leading-none ${
                          isActive
                            ? 'bg-[#1c5b48] text-white'
                            : 'bg-white/15 text-[#f6f3ec]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex bg-transparent text-[#141312]">
      <div className="bg-environment" />
      <div className="grid-floor" />

      {/* Ink Sidebar */}
      <aside
        className={`no-print hidden lg:flex flex-col sticky top-0 h-screen shrink-0 sidebar-accent text-[#f6f3ec] border-r border-white/10 transition-all duration-200 z-30 ${
          collapsed ? 'w-[76px]' : 'w-[258px]'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <BrandMark />
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-serif-display text-[17px] font-normal tracking-[-0.015em] text-[#f6f3ec] leading-tight truncate">
                  {t.brand.name}
                </p>
                <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.12em] text-[#7CD4B5] font-medium leading-tight">
                  {t.brand.console}
                </p>
              </div>
            )}
          </Link>
        </div>

        {renderSidebarContent(collapsed)}

        {!collapsed && (
          <div className="p-3 border-t border-white/10 text-[11px] font-mono-tech text-[#A3ACA6] flex items-center justify-between bg-white/[0.03]">
            <span>Port 3002 · API :4000</span>
            <span className="inline-flex items-center gap-1.5 text-[#7CD4B5] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CD4B5]" />
              {t.pages.dashboard.liveLabel}
            </span>
          </div>
        )}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`fixed inset-0 bg-[#141312]/45 backdrop-blur-xs transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`relative z-10 w-[280px] max-w-[85vw] h-full sidebar-accent text-[#f6f3ec] border-r border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5"
            >
              <BrandMark small />
              <span className="font-serif-display text-[17px] text-[#f6f3ec]">
                {t.brand.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 rounded-full border border-white/15 bg-white/10 text-[#D5D1C8] hover:bg-white/20 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {renderSidebarContent(false, () => setMobileOpen(false))}
        </div>
      </div>

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="no-print sticky top-0 z-20 h-16 px-4 sm:px-6 bg-[#f6f3ec]/85 backdrop-blur-xl border-b border-[#ded8ca] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-9 w-9 rounded-full border border-[#ded8ca] bg-[#efebe1] text-[#4c4842] hover:bg-[#e5dfd2] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:inline-flex h-9 w-9 rounded-full border border-[#ded8ca] bg-[#efebe1] text-[#6e6a62] hover:text-[#141312] hover:bg-[#e5dfd2] items-center justify-center cursor-pointer transition-colors"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-1.5 text-[13px] text-[#6e6a62] min-w-0">
              <span className="hidden sm:inline font-mono-tech text-[11px] uppercase tracking-[0.1em] truncate">
                {breadcrumb.group}
              </span>
              <span className="hidden sm:inline text-[#c2baa8]">/</span>
              <span className="font-semibold text-[14.5px] text-[#141312] truncate">
                {breadcrumb.label}
              </span>
            </div>
          </div>

          {/* Right Utility Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative hidden md:block w-60 lg:w-72">
              <div className="flex items-center h-9 px-3.5 rounded-[10px] border border-[#ded8ca] bg-[#efebe1] focus-within:border-[#1c5b48] focus-within:ring-2 focus-within:ring-[#1c5b48]/15 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.common.searchPlaceholder}
                  className="w-full bg-transparent text-[13px] text-[#141312] placeholder:text-[#6e6a62] outline-none pr-2"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#6e6a62] hover:text-[#141312] cursor-pointer shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Search className="h-4 w-4 text-[#6e6a62] shrink-0" />
                )}
              </div>

              {searchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-11 bg-[#f6f3ec] border border-[#ded8ca] rounded-2xl shadow-[0_18px_40px_-14px_rgba(23,28,25,0.16)] p-1.5 z-40">
                  {searchHits.length === 0 ? (
                    <p className="p-3 text-[12.5px] text-[#6e6a62] text-center">{t.common.empty}</p>
                  ) : (
                    searchHits.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => {
                          navigate(h.to);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#e5dfd2]/75 flex items-center justify-between gap-2 text-[13px] cursor-pointer transition-colors"
                      >
                        <span className="font-medium text-[#141312] truncate">{h.label}</span>
                        <span className="font-mono-tech text-[10.5px] text-[#1c5b48] shrink-0">
                          {h.kind}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleLocale}
              className="h-9 px-3 rounded-full border border-[#ded8ca] bg-[#efebe1] text-[12px] font-semibold text-[#4c4842] hover:text-[#1c5b48] hover:bg-[#e5dfd2] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#1c5b48]" />
              {locale === 'en' ? 'EN' : 'KM'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/system/audit-logs')}
              title={t.common.helpDocs}
              className="h-9 w-9 rounded-full border border-[#ded8ca] bg-[#efebe1] text-[#4c4842] hover:text-[#1c5b48] hover:bg-[#e5dfd2] inline-flex items-center justify-center cursor-pointer transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                }}
                className="relative h-9 w-9 rounded-full border border-[#ded8ca] bg-[#efebe1] text-[#4c4842] hover:text-[#1c5b48] hover:bg-[#e5dfd2] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#a5331f] ring-2 ring-[#efebe1]" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-[#f6f3ec] border border-[#ded8ca] rounded-2xl shadow-[0_18px_40px_-14px_rgba(23,28,25,0.16)] z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#ded8ca] font-semibold text-[13px] flex justify-between bg-[#efebe1]/50">
                    <span className="text-[#141312]">Recent Platform Events</span>
                    <Link
                      to="/system/audit-logs"
                      onClick={() => setNotifOpen(false)}
                      className="text-[#1c5b48] text-[12px] hover:underline"
                    >
                      Audit Logs
                    </Link>
                  </div>
                  <div className="divide-y divide-[#ded8ca]/75 max-h-72 overflow-y-auto">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="px-4 py-2.5 text-[12px]">
                        <p className="font-medium text-[#141312]">{log.action}</p>
                        <p className="text-[#6e6a62] mt-0.5">
                          {log.actorName} · {log.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile & RBAC Switcher */}
            <div className="relative pl-0.5">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((p) => !p);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-full border border-[#ded8ca] bg-[#efebe1] hover:bg-[#e5dfd2] transition-colors cursor-pointer"
              >
                <span className="h-7 w-7 rounded-full bg-[#1c5b48] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                  {currentAdmin?.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('') ?? 'AD'}
                </span>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[12.5px] font-semibold text-[#141312]">{currentAdmin?.name}</p>
                  <p className="text-[10.5px] text-[#1c5b48] font-medium">{currentRole?.name}</p>
                </div>
                <ChevronDown className="hidden sm:inline h-3.5 w-3.5 text-[#6e6a62]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-68 bg-[#f6f3ec] border border-[#ded8ca] rounded-2xl shadow-[0_18px_40px_-14px_rgba(23,28,25,0.16)] p-2 z-40">
                  <div className="px-3 py-2 border-b border-[#ded8ca]">
                    <p className="text-[13px] font-semibold text-[#141312]">{currentAdmin?.name}</p>
                    <p className="text-[11.5px] text-[#6e6a62]">{currentAdmin?.email}</p>
                    {currentRole && (
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e4ede7] text-[#1c5b48] text-[10.5px] font-semibold">
                          {currentRole.name}
                        </span>
                        <span className="font-mono-tech text-[10px] uppercase text-[#6e6a62]">
                          {currentRole.dataScope}
                        </span>
                      </div>
                    )}
                  </div>

                  {(() => {
                    const systemGroup = visibleGroups.find((g) => g.title === t.groups.system);
                    if (!systemGroup || systemGroup.items.length === 0) return null;
                    return (
                      <div className="px-2 py-2 border-b border-[#ded8ca]">
                        <p className="px-1.5 font-mono-tech text-[10px] font-medium uppercase tracking-[0.12em] text-[#6e6a62] mb-1.5">
                          {t.groups.system}
                        </p>
                        <div className="space-y-0.5">
                          {systemGroup.items.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setProfileOpen(false)}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                                location.pathname === item.to
                                  ? 'bg-[#e4ede7] text-[#1c5b48] font-semibold'
                                  : 'text-[#4c4842] hover:bg-[#e5dfd2]/70 hover:text-[#141312]'
                              }`}
                            >
                              <span className="shrink-0">{item.icon}</span>
                              <span className="truncate">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logoutAdmin();
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-left text-[12.5px] font-medium text-[#a5331f] hover:bg-[#FEF2F2] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.common.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

