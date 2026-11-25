import type { AdminModule, AdminRole, PermissionAction, RolePermissionMatrix } from '@/types';

export const ALL_MODULES: AdminModule[] = [
  'dashboard',
  'courses',
  'lessons',
  'videos',
  'categories',
  'instructors',
  'paths',
  'certifications',
  'assessments',
  'question_bank',
  'templates',
  'members',
  'administrators',
  'roles',
  'member_activity',
  'orders',
  'payments',
  'subscriptions',
  'plans',
  'coupons',
  'invoices',
  'refunds',
  'announcements',
  'notifications',
  'reviews',
  'support',
  'marketing',
  'seo',
  'translations',
  'analytics',
  'audit_logs',
  'settings',
  'integrations',
  'maintenance',
];

export const ALL_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'approve', 'export'];

function buildMatrix(
  override: Partial<Record<AdminModule, Partial<Record<PermissionAction, boolean>>>>,
  defaultAll = false,
): RolePermissionMatrix {
  const matrix = {} as RolePermissionMatrix;
  for (const mod of ALL_MODULES) {
    matrix[mod] = {
      view: defaultAll,
      create: defaultAll,
      edit: defaultAll,
      delete: defaultAll,
      approve: defaultAll,
      export: defaultAll,
      ...(override[mod] ?? {}),
    };
  }
  return matrix;
}

const fullAccess = { view: true, create: true, edit: true, delete: true, approve: true, export: true };
const readExport = { view: true, export: true };
const manageNoDelete = { view: true, create: true, edit: true, approve: true, export: true };

export const INITIAL_ROLES: AdminRole[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    slug: 'super_admin',
    description: 'Full system access including administrators, RBAC matrix, system settings, and maintenance.',
    dataScope: 'global',
    isSystem: true,
    permissions: buildMatrix({}, true),
  },
  {
    id: 'role-admin',
    name: 'Administrator',
    slug: 'administrator',
    description: 'Manage day-to-day platform operations, learning catalog, members, and analytics.',
    dataScope: 'global',
    isSystem: true,
    permissions: buildMatrix(
      {
        roles: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        administrators: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        settings: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        integrations: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        maintenance: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      },
      true,
    ),
  },
  {
    id: 'role-content',
    name: 'Content Manager',
    slug: 'content_manager',
    description: 'Manage courses, lessons, videos, categories, instructors, paths, assessments, and translations.',
    dataScope: 'global',
    isSystem: true,
    permissions: buildMatrix({
      dashboard: { view: true },
      courses: fullAccess,
      lessons: fullAccess,
      videos: fullAccess,
      categories: fullAccess,
      instructors: manageNoDelete,
      paths: fullAccess,
      certifications: fullAccess,
      assessments: fullAccess,
      question_bank: fullAccess,
      templates: manageNoDelete,
      reviews: { view: true, edit: true, approve: true },
      marketing: manageNoDelete,
      seo: manageNoDelete,
      translations: manageNoDelete,
      analytics: readExport,
    }),
  },
  {
    id: 'role-instructor',
    name: 'Instructor',
    slug: 'instructor',
    description: 'Manage assigned courses, author lessons/quizzes, and review learner progress for assigned courses.',
    dataScope: 'assigned_only',
    isSystem: true,
    permissions: buildMatrix({
      dashboard: { view: true },
      courses: { view: true, create: true, edit: true },
      lessons: { view: true, create: true, edit: true },
      videos: { view: true, create: true, edit: true },
      assessments: { view: true, create: true, edit: true },
      question_bank: { view: true, create: true, edit: true },
      reviews: { view: true, edit: true },
      analytics: { view: true },
    }),
  },
  {
    id: 'role-finance',
    name: 'Finance Manager',
    slug: 'finance_manager',
    description: 'Manage orders, payments, subscriptions, membership plans, coupons, invoices, and refunds.',
    dataScope: 'global',
    isSystem: true,
    permissions: buildMatrix({
      dashboard: { view: true },
      orders: fullAccess,
      payments: { view: true, edit: true, approve: true, export: true },
      subscriptions: manageNoDelete,
      plans: fullAccess,
      coupons: fullAccess,
      invoices: readExport,
      refunds: { view: true, edit: true, approve: true, export: true },
      members: readExport,
      analytics: readExport,
      audit_logs: readExport,
    }),
  },
  {
    id: 'role-support',
    name: 'Support Agent',
    slug: 'support_agent',
    description: 'View member profiles and assist with support tickets, enrollments, and account inquiries.',
    dataScope: 'support_scoped',
    isSystem: true,
    permissions: buildMatrix({
      dashboard: { view: true },
      members: { view: true, edit: true },
      member_activity: { view: true },
      orders: { view: true },
      subscriptions: { view: true },
      refunds: { view: true, create: true },
      announcements: { view: true },
      notifications: { view: true, create: true },
      reviews: { view: true, edit: true },
      support: fullAccess,
    }),
  },
];

