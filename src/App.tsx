import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminShell } from '@/components/layout/AdminShell';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { I18nProvider } from '@/i18n/I18nContext';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AnalyticsReportsPage } from '@/pages/analytics/AnalyticsReportsPage';
import {
  InvoicesPage,
  MembershipPlansPage,
  CouponsPage,
  RefundsPage,
} from '@/pages/commerce/PlansCouponsInvoicesPage';
import {
  OrdersPage,
  PaymentsPage,
  SubscriptionsPage,
} from '@/pages/commerce/OrdersPaymentsSubsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import {
  AnnouncementsPage,
  NotificationsAdminPage,
  ReviewsPage,
  SupportTicketsPage,
} from '@/pages/engagement/EngagementSupportPages';
import {
  AssessmentsAdminPage,
  CertificateTemplatesPage,
  CertificationsAdminPage,
  QuestionBankPage,
} from '@/pages/learning/AssessmentsAndCertsPage';
import {
  CategoriesPage,
  InstructorsPage,
  LearningPathsAdminPage,
} from '@/pages/learning/CategoriesInstructorsPathsPage';
import { CoursesPage } from '@/pages/learning/CoursesPage';
import { LessonsPage, VideosAdminPage } from '@/pages/learning/LessonsAndVideosPage';
import {
  HomepageContentPage,
  SeoManagementPage,
  TranslationsPage,
} from '@/pages/marketing/MarketingPages';
import {
  AuditLogsPage,
  IntegrationsPage,
  MaintenancePage,
  RbacPreviewPage,
  SystemSettingsPage,
} from '@/pages/system/SystemAdminPages';
import {
  AdministratorsPage,
  MemberActivityPage,
  MembersPage,
  RolesPermissionsPage,
} from '@/pages/users/UserManagementPages';

const AdminRoutes: React.FC = () => {
  const { currentAdmin } = useAdmin();

  if (!currentAdmin) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<AdminShell />}>
        {/* Overview */}
        <Route path="/" element={<DashboardPage />} />

        {/* Learning Management */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/videos" element={<VideosAdminPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/learning-paths" element={<LearningPathsAdminPage />} />
        <Route path="/certifications" element={<CertificationsAdminPage />} />
        <Route path="/assessments" element={<AssessmentsAdminPage />} />
        <Route path="/question-bank" element={<QuestionBankPage />} />
        <Route path="/certificate-templates" element={<CertificateTemplatesPage />} />

        {/* User Management */}
        <Route path="/members" element={<MembersPage />} />
        <Route path="/administrators" element={<AdministratorsPage />} />
        <Route path="/roles" element={<RolesPermissionsPage />} />
        <Route path="/member-activity" element={<MemberActivityPage />} />

        {/* Commerce & Finance */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/plans" element={<MembershipPlansPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/refunds" element={<RefundsPage />} />

        {/* Engagement & Support */}
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/notifications" element={<NotificationsAdminPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/support" element={<SupportTicketsPage />} />

        {/* Marketing & Website */}
        <Route path="/marketing/homepage" element={<HomepageContentPage section="homepage" />} />
        <Route path="/marketing/featured-courses" element={<HomepageContentPage section="featured_courses" />} />
        <Route path="/marketing/featured-videos" element={<HomepageContentPage section="featured_videos" />} />
        <Route path="/marketing/banners" element={<HomepageContentPage section="banners" />} />
        <Route path="/marketing/testimonials" element={<HomepageContentPage section="testimonials" />} />
        <Route path="/marketing/seo" element={<SeoManagementPage />} />
        <Route path="/marketing/translations" element={<TranslationsPage />} />

        {/* Analytics & Reports */}
        <Route path="/analytics" element={<AnalyticsReportsPage tab="platform" />} />
        <Route path="/analytics/learning" element={<AnalyticsReportsPage tab="learning" />} />
        <Route path="/analytics/courses" element={<AnalyticsReportsPage tab="courses" />} />
        <Route path="/analytics/members" element={<AnalyticsReportsPage tab="members" />} />
        <Route path="/analytics/revenue" element={<AnalyticsReportsPage tab="revenue" />} />
        <Route path="/analytics/subscriptions" element={<AnalyticsReportsPage tab="subscriptions" />} />

        {/* System Administration */}
        <Route path="/system/audit-logs" element={<AuditLogsPage mode="audit" />} />
        <Route path="/system/activity-logs" element={<AuditLogsPage mode="activity" />} />
        <Route path="/system/settings" element={<SystemSettingsPage />} />
        <Route path="/system/integrations" element={<IntegrationsPage />} />
        <Route path="/system/maintenance" element={<MaintenancePage />} />
        <Route path="/system/rbac-preview" element={<RbacPreviewPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export function App() {
  return (
    <I18nProvider>
      <AdminProvider>
        <BrowserRouter>
          <AdminRoutes />
        </BrowserRouter>
      </AdminProvider>
    </I18nProvider>
  );
}

export default App;

