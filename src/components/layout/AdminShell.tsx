import React, { useMemo, useState } from 'react';
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
  GraduationCap,
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

export const AdminShell: React.FC = () => {
  const { t, locale, toggleLocale } = useI18n();
  const {
    currentAdmin,
    currentRole,
    roles,
    courses,
    members,
    orders,
    auditLogs,
    can,
    switchDemoRole,
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
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
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
                  `flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} gap-2.5 py-2 rounded-[10px] text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border-l-3 border-[#2563EB]'
                      : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#1D4ED8]'
                  }`
                }
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </span>
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10.5px] font-bold leading-none">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-transparent text-[#1F2937]">
      <div className="bg-environment" />
      <div className="grid-floor" />

      {/* White Sidebar consistent with CamcodeLearn */}
      <aside
        className={`no-print hidden lg:flex flex-col sticky top-0 h-screen shrink-0 bg-white/90 backdrop-blur-xl text-[#1F2937] border-r border-[#E5E7EB] transition-all duration-200 z-30 ${
          collapsed ? 'w-[76px]' : 'w-[258px]'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-[#1F2937] leading-tight truncate">{t.brand.name}</p>
                <p className="text-[11px] text-[#2563EB] font-medium leading-tight">{t.brand.console}</p>
              </div>
            )}
          </Link>
        </div>

        {renderSidebarContent(collapsed)}

        {!collapsed && (
          <div className="p-3 border-t border-[#E5E7EB] text-[11px] text-[#6B7280] flex items-center justify-between bg-[#F9FAFB]">
            <span>Port 3002 · API :4000</span>
            <span className="inline-flex items-center gap-1 text-[#16A34A] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              {t.pages.dashboard.liveLabel}
            </span>
          </div>
        )}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-[#111827]/45 backdrop-blur-[2px] flex"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-[264px] h-full bg-white text-[#1F2937] border-r border-[#E5E7EB] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E7EB]">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="h-8 w-8 rounded-[9px] bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <span className="font-bold text-[15px] text-[#1F2937]">{t.brand.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-md text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderSidebarContent(false, () => setMobileOpen(false))}
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="no-print sticky top-0 z-20 h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-[#4B5563] hover:bg-[#F3F4F6] cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:inline-flex p-2 rounded-md text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <PanelLeftOpen className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
            </button>
            <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280] min-w-0">
              <span className="hidden sm:inline truncate">{breadcrumb.group}</span>
              <span className="hidden sm:inline text-[#D1D5DB]">/</span>
              <span className="font-semibold text-[14.5px] text-[#1F2937] truncate">{breadcrumb.label}</span>
            </div>
          </div>

          {/* Right Utility Cluster: Search + EN/KM + Help + Bell + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input (clean icon on right like reference) */}
            <div className="relative hidden md:block w-60 lg:w-72">
              <div className="flex items-center h-9 px-3 rounded-[9px] border border-[#E5E7EB] bg-[#F9FAFB] focus-within:bg-white focus-within:border-[#2563EB] transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.common.searchPlaceholder}
                  className="w-full bg-transparent text-[13px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none pr-2"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Search className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                )}
              </div>

              {searchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-10 bg-white border border-[#E5E7EB] rounded-[10px] shadow-xl p-1.5 z-40">
                  {searchHits.length === 0 ? (
                    <p className="p-3 text-[12.5px] text-[#6B7280] text-center">{t.common.empty}</p>
                  ) : (
                    searchHits.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => {
                          navigate(h.to);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-[6px] hover:bg-[#F3F4F6] flex items-center justify-between gap-2 text-[13px] cursor-pointer"
                      >
                        <span className="font-medium text-[#1F2937] truncate">{h.label}</span>
                        <span className="text-[11px] text-[#2563EB] shrink-0">{h.kind}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleLocale}
              className="h-8 px-2.5 rounded-[8px] text-[12px] font-semibold text-[#4B5563] hover:text-[#2563EB] hover:bg-[#F3F4F6] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#2563EB]" />
              {locale === 'en' ? 'EN' : 'KM'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/system/audit-logs')}
              title={t.common.helpDocs}
              className="h-8 w-8 rounded-[8px] text-[#4B5563] hover:text-[#2563EB] hover:bg-[#F3F4F6] inline-flex items-center justify-center cursor-pointer transition-colors"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                }}
                className="relative h-8 w-8 rounded-[8px] text-[#4B5563] hover:text-[#2563EB] hover:bg-[#F3F4F6] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white border border-[#E5E7EB] rounded-[10px] shadow-xl z-40 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#E5E7EB] font-semibold text-[13px] flex justify-between">
                    <span>Recent Platform Events</span>
                    <Link to="/system/audit-logs" onClick={() => setNotifOpen(false)} className="text-[#2563EB] text-[12px]">
                      Audit Logs
                    </Link>
                  </div>
                  <div className="divide-y divide-[#E5E7EB] max-h-72 overflow-y-auto">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="px-4 py-2.5 text-[12px]">
                        <p className="font-medium text-[#1F2937]">{log.action}</p>
                        <p className="text-[#6B7280] mt-0.5">
                          {log.actorName} · {log.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile & RBAC Switcher (clean avatar + name + role + chevron) */}
            <div className="relative pl-1">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((p) => !p);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 py-1 px-1.5 rounded-[10px] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                <span className="h-8 w-8 rounded-full bg-[#2563EB] text-white text-[11.5px] font-bold flex items-center justify-center shrink-0">
                  {currentAdmin?.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('') ?? 'AD'}
                </span>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[13px] font-semibold text-[#1F2937]">{currentAdmin?.name}</p>
                  <p className="text-[10.5px] text-[#2563EB] font-medium">{currentRole?.name}</p>
                </div>
                <ChevronDown className="hidden sm:inline h-4 w-4 text-[#6B7280]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-10 w-68 bg-white border border-[#E5E7EB] rounded-[10px] shadow-xl p-2 z-40">
                  <div className="px-3 py-2 border-b border-[#E5E7EB]">
                    <p className="text-[13px] font-semibold text-[#1F2937]">{currentAdmin?.name}</p>
                    <p className="text-[11.5px] text-[#6B7280]">{currentAdmin?.email}</p>
                  </div>

                  <div className="px-3 py-2 border-b border-[#E5E7EB]">
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5">
                      {t.common.switchRole}
                    </p>
                    <div className="space-y-1">
                      {roles.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            switchDemoRole(r.id);
                            setProfileOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12px] font-medium flex items-center justify-between cursor-pointer ${
                            currentRole?.id === r.id
                              ? 'bg-[#EFF6FF] text-[#2563EB]'
                              : 'text-[#374151] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          <span>{r.name}</span>
                          {currentRole?.id === r.id && <span className="text-[10px]">Active</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logoutAdmin();
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-md text-left text-[12.5px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
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

