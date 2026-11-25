import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  INITIAL_ADMINS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSESSMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CATEGORIES,
  INITIAL_CERTIFICATIONS,
  INITIAL_COUPONS,
  INITIAL_COURSES,
  INITIAL_HOMEPAGE,
  INITIAL_INSTRUCTORS,
  INITIAL_INVOICES,
  INITIAL_LESSONS,
  INITIAL_MEMBERS,
  INITIAL_ORDERS,
  INITIAL_PATHS,
  INITIAL_PAYMENTS,
  INITIAL_PLANS,
  INITIAL_QUESTIONS,
  INITIAL_REFUNDS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TEMPLATES,
  INITIAL_TESTIMONIALS,
  INITIAL_TICKETS,
  INITIAL_VIDEOS,
} from '@/data/mockAdminData';
import { INITIAL_ROLES } from '@/data/rbacPresets';
import type {
  AdminAnnouncement,
  AdminAssessment,
  AdminCategory,
  AdminCertification,
  AdminCoupon,
  AdminCourse,
  AdminInstructor,
  AdminInvoice,
  AdminLearningPath,
  AdminLesson,
  AdminMember,
  AdminMembershipPlan,
  AdminModule,
  AdminOrder,
  AdminPayment,
  AdminRefundRequest,
  AdminReview,
  AdminRole,
  AdminSubscription,
  AdminSupportTicket,
  AdminTestimonial,
  AdminUser,
  AdminVideo,
  AuditLogRecord,
  CertificateTemplate,
  HomepageConfig,
  PermissionAction,
  QuestionBankItem,
  SystemSettingsState,
} from '@/types';

interface AdminContextValue {
  // In-memory session (never stored in localStorage)
  currentAdmin: AdminUser | null;
  currentRole: AdminRole | null;
  roles: AdminRole[];
  admins: AdminUser[];
  courses: AdminCourse[];
  lessons: AdminLesson[];
  videos: AdminVideo[];
  categories: AdminCategory[];
  instructors: AdminInstructor[];
  paths: AdminLearningPath[];
  certifications: AdminCertification[];
  assessments: AdminAssessment[];
  questions: QuestionBankItem[];
  templates: CertificateTemplate[];
  members: AdminMember[];
  orders: AdminOrder[];
  payments: AdminPayment[];
  subscriptions: AdminSubscription[];
  plans: AdminMembershipPlan[];
  coupons: AdminCoupon[];
  invoices: AdminInvoice[];
  refunds: AdminRefundRequest[];
  announcements: AdminAnnouncement[];
  reviews: AdminReview[];
  tickets: AdminSupportTicket[];
  homepage: HomepageConfig;
  testimonials: AdminTestimonial[];
  auditLogs: AuditLogRecord[];
  settings: SystemSettingsState;

  // Auth & RBAC
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  switchDemoRole: (roleId: string) => void;
  can: (module: AdminModule, action?: PermissionAction) => boolean;
  logAudit: (module: AdminModule, action: string, details: string, result?: 'success' | 'denied') => void;

  // State setters with audit trails
  setCourses: React.Dispatch<React.SetStateAction<AdminCourse[]>>;
  setLessons: React.Dispatch<React.SetStateAction<AdminLesson[]>>;
  setVideos: React.Dispatch<React.SetStateAction<AdminVideo[]>>;
  setCategories: React.Dispatch<React.SetStateAction<AdminCategory[]>>;
  setInstructors: React.Dispatch<React.SetStateAction<AdminInstructor[]>>;
  setPaths: React.Dispatch<React.SetStateAction<AdminLearningPath[]>>;
  setCertifications: React.Dispatch<React.SetStateAction<AdminCertification[]>>;
  setAssessments: React.Dispatch<React.SetStateAction<AdminAssessment[]>>;
  setQuestions: React.Dispatch<React.SetStateAction<QuestionBankItem[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<CertificateTemplate[]>>;
  setMembers: React.Dispatch<React.SetStateAction<AdminMember[]>>;
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  setRoles: React.Dispatch<React.SetStateAction<AdminRole[]>>;
  setOrders: React.Dispatch<React.SetStateAction<AdminOrder[]>>;
  setPayments: React.Dispatch<React.SetStateAction<AdminPayment[]>>;
  setSubscriptions: React.Dispatch<React.SetStateAction<AdminSubscription[]>>;
  setPlans: React.Dispatch<React.SetStateAction<AdminMembershipPlan[]>>;
  setCoupons: React.Dispatch<React.SetStateAction<AdminCoupon[]>>;
  setRefunds: React.Dispatch<React.SetStateAction<AdminRefundRequest[]>>;
  setAnnouncements: React.Dispatch<React.SetStateAction<AdminAnnouncement[]>>;
  setReviews: React.Dispatch<React.SetStateAction<AdminReview[]>>;
  setTickets: React.Dispatch<React.SetStateAction<AdminSupportTicket[]>>;
  setHomepage: React.Dispatch<React.SetStateAction<HomepageConfig>>;
  setTestimonials: React.Dispatch<React.SetStateAction<AdminTestimonial[]>>;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettingsState>>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<AdminRole[]>(INITIAL_ROLES);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>('adm-1');

  const [courses, setCourses] = useState<AdminCourse[]>(INITIAL_COURSES);
  const [lessons, setLessons] = useState<AdminLesson[]>(INITIAL_LESSONS);
  const [videos, setVideos] = useState<AdminVideo[]>(INITIAL_VIDEOS);
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_CATEGORIES);
  const [instructors, setInstructors] = useState<AdminInstructor[]>(INITIAL_INSTRUCTORS);
  const [paths, setPaths] = useState<AdminLearningPath[]>(INITIAL_PATHS);
  const [certifications, setCertifications] = useState<AdminCertification[]>(INITIAL_CERTIFICATIONS);
  const [assessments, setAssessments] = useState<AdminAssessment[]>(INITIAL_ASSESSMENTS);
  const [questions, setQuestions] = useState<QuestionBankItem[]>(INITIAL_QUESTIONS);
  const [templates, setTemplates] = useState<CertificateTemplate[]>(INITIAL_TEMPLATES);
  const [members, setMembers] = useState<AdminMember[]>(INITIAL_MEMBERS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [payments, setPayments] = useState<AdminPayment[]>(INITIAL_PAYMENTS);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState<AdminMembershipPlan[]>(INITIAL_PLANS);
  const [coupons, setCoupons] = useState<AdminCoupon[]>(INITIAL_COUPONS);
  const [invoices] = useState<AdminInvoice[]>(INITIAL_INVOICES);
  const [refunds, setRefunds] = useState<AdminRefundRequest[]>(INITIAL_REFUNDS);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [tickets, setTickets] = useState<AdminSupportTicket[]>(INITIAL_TICKETS);
  const [homepage, setHomepage] = useState<HomepageConfig>(INITIAL_HOMEPAGE);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(INITIAL_TESTIMONIALS);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [settings, setSettings] = useState<SystemSettingsState>(INITIAL_SETTINGS);

  const currentAdmin = useMemo(
    () => admins.find((a) => a.id === currentAdminId) ?? null,
    [admins, currentAdminId],
  );

  const currentRole = useMemo(
    () => (currentAdmin ? roles.find((r) => r.id === currentAdmin.roleId) ?? null : null),
    [currentAdmin, roles],
  );

  const logAudit = (
    module: AdminModule,
    action: string,
    details: string,
    result: 'success' | 'denied' = 'success',
  ) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actorName: currentAdmin?.name ?? 'System',
        actorRole: currentRole?.name ?? 'Unknown',
        action,
        module,
        timestamp: now,
        ipAddress: currentAdmin?.ipAddress ?? '127.0.0.1',
        result,
        details,
      },
      ...prev,
    ]);
  };

  const can = (module: AdminModule, action: PermissionAction = 'view'): boolean => {
    if (!currentRole || !currentAdmin || currentAdmin.status !== 'active') return false;
    return Boolean(currentRole.permissions[module]?.[action]);
  };

  const loginAdmin = (email: string, password: string): boolean => {
    if (!email.trim() || password.length < 6) return false;
    const matched = admins.find((a) => a.email.toLowerCase() === email.trim().toLowerCase()) ?? admins[0];
    if (!matched || matched.status !== 'active') return false;
    setCurrentAdminId(matched.id);
    return true;
  };

  const logoutAdmin = () => {
    logAudit('administrators', 'Admin signed out', 'Ended active console session');
    setCurrentAdminId(null);
  };

  const switchDemoRole = (roleId: string) => {
    const targetAdmin = admins.find((a) => a.roleId === roleId);
    if (targetAdmin) {
      setCurrentAdminId(targetAdmin.id);
    } else if (currentAdmin) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === currentAdmin.id ? { ...a, roleId } : a)),
      );
    }
  };

  const value: AdminContextValue = {
    currentAdmin,
    currentRole,
    roles,
    admins,
    courses,
    lessons,
    videos,
    categories,
    instructors,
    paths,
    certifications,
    assessments,
    questions,
    templates,
    members,
    orders,
    payments,
    subscriptions,
    plans,
    coupons,
    invoices,
    refunds,
    announcements,
    reviews,
    tickets,
    homepage,
    testimonials,
    auditLogs,
    settings,
    loginAdmin,
    logoutAdmin,
    switchDemoRole,
    can,
    logAudit,
    setCourses,
    setLessons,
    setVideos,
    setCategories,
    setInstructors,
    setPaths,
    setCertifications,
    setAssessments,
    setQuestions,
    setTemplates,
    setMembers,
    setAdmins,
    setRoles,
    setOrders,
    setPayments,
    setSubscriptions,
    setPlans,
    setCoupons,
    setRefunds,
    setAnnouncements,
    setReviews,
    setTickets,
    setHomepage,
    setTestimonials,
    setSettings,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

