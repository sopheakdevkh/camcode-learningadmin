export type Locale = 'en' | 'km';

export interface LocalizedText {
  en: string;
  km?: string;
}

/* ==================== RBAC & Security ==================== */
export type AdminModule =
  | 'dashboard'
  | 'courses'
  | 'lessons'
  | 'videos'
  | 'categories'
  | 'instructors'
  | 'paths'
  | 'certifications'
  | 'assessments'
  | 'question_bank'
  | 'templates'
  | 'members'
  | 'administrators'
  | 'roles'
  | 'member_activity'
  | 'orders'
  | 'payments'
  | 'subscriptions'
  | 'plans'
  | 'coupons'
  | 'invoices'
  | 'refunds'
  | 'announcements'
  | 'notifications'
  | 'reviews'
  | 'support'
  | 'marketing'
  | 'seo'
  | 'translations'
  | 'analytics'
  | 'audit_logs'
  | 'settings'
  | 'integrations'
  | 'maintenance';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export type RolePermissionMatrix = Record<AdminModule, Record<PermissionAction, boolean>>;

export interface AdminRole {
  id: string;
  name: string;
  slug: 'super_admin' | 'administrator' | 'content_manager' | 'instructor' | 'finance_manager' | 'support_agent' | string;
  description: string;
  dataScope: 'global' | 'assigned_only' | 'support_scoped';
  isSystem: boolean;
  permissions: RolePermissionMatrix;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  ipAddress: string;
  activeSessions: number;
  assignedCourseIds?: string[];
}

/* ==================== Learning Management ==================== */
export type CourseStatus = 'draft' | 'in_review' | 'published' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type AccessType = 'free' | 'paid' | 'subscription' | 'paid_or_subscription';

export interface AdminCourse {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  instructorId: string;
  difficulty: DifficultyLevel;
  durationHours: number;
  accessType: AccessType;
  price: number;
  includedPlans: ('basic' | 'premium')[];
  status: CourseStatus;
  enrollmentsCount: number;
  completionRate: number;
  rating: number;
  featured: boolean;
  objectives: string[];
  requirements: string[];
  seoTitle: string;
  seoDescription: string;
  lastUpdated: string;
}

export interface AdminLesson {
  id: string;
  courseId: string;
  sectionTitle: LocalizedText;
  sectionOrder: number;
  lessonOrder: number;
  title: LocalizedText;
  type: 'video' | 'text' | 'quiz';
  durationMinutes: number;
  isPreview: boolean;
  requiredCompletion: boolean;
  availabilityRule: 'immediate' | 'sequential' | 'scheduled';
  published: boolean;
  videoId?: string;
  attachmentName?: string;
}

export type VideoProcessingStatus = 'uploading' | 'processing' | 'ready' | 'failed' | 'archived';

export interface AdminVideo {
  id: string;
  title: LocalizedText;
  provider: 'Cloudflare Stream' | 'Mux';
  providerAssetId: string;
  categoryId: string;
  durationMinutes: number;
  subtitlesEn: boolean;
  subtitlesKm: boolean;
  accessRule: 'free' | 'basic' | 'premium';
  processingStatus: VideoProcessingStatus;
  assignedCourseIds: string[];
  featured: boolean;
  viewsCount: number;
  uploadedAt: string;
  fileName?: string;
  fileSizeBytes?: number;
  videoPreviewUrl?: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  parentId: string | null;
  icon: string;
  displayOrder: number;
  active: boolean;
  courseCount: number;
}

export interface AdminInstructor {
  id: string;
  name: string;
  email: string;
  expertise: string;
  bio: LocalizedText;
  status: 'active' | 'inactive';
  assignedCoursesCount: number;
  totalStudents: number;
  avgRating: number;
  avatarColor: string;
  avatarUrl?: string;
}

export interface AdminLearningPath {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  stepItems: { type: 'course' | 'video'; itemId: string; label: string }[];
  prerequisiteLabel: string;
  estimatedHours: number;
  accessType: 'free' | 'basic' | 'premium';
  objectives: string[];
  published: boolean;
  featured: boolean;
  enrolledCount: number;
}

export interface AdminCertification {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  requiredCourseIds: string[];
  requiredAssessmentIds: string[];
  passingScore: number;
  validityMonths: number; // 0 = lifetime
  templateId: string;
  published: boolean;
  issuedCount: number;
}

export interface QuestionBankItem {
  id: string;
  categoryId: string;
  difficulty: DifficultyLevel;
  type: 'multiple_choice' | 'true_false';
  question: LocalizedText;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface AdminAssessment {
  id: string;
  title: LocalizedText;
  courseId?: string;
  categoryId: string;
  questionIds: string[];
  timeLimitMinutes: number;
  passingScore: number;
  attemptLimit: number;
  randomizeQuestions: boolean;
  showResultsImmediately: boolean;
  published: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  accentColor: string;
  logoText: string;
  signatoryName: string;
  signatoryTitle: string;
  includeVerificationQr: boolean;
  pdfPaperSize: 'A4' | 'Letter';
  fields: ('studentName' | 'courseName' | 'issueDate' | 'certificateId' | 'verificationUrl')[];
  active: boolean;
}

/* ==================== User & Commerce ==================== */
export interface AdminMember {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  membership: 'free' | 'basic' | 'premium';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  certificatesCount: number;
  totalSpent: number;
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  memberId: string;
  memberName: string;
  itemName: string;
  itemType: 'course' | 'subscription';
  amount: number;
  paymentMethod: 'KHQR' | 'Visa/MasterCard' | 'ABA Pay' | 'Bank Transfer';
  status: OrderStatus;
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected';
  orderDate: string;
}

export interface AdminPayment {
  id: string;
  transactionId: string;
  orderNumber: string;
  memberName: string;
  provider: 'KHQR' | 'Stripe' | 'ABA PayWay';
  amount: number;
  currency: 'USD';
  status: 'settled' | 'pending' | 'failed' | 'refunded';
  reconciled: boolean;
  paidAt: string;
}

export interface AdminSubscription {
  id: string;
  memberId: string;
  memberName: string;
  planId: string;
  planName: string;
  startDate: string;
  renewalDate: string;
  expirationDate: string;
  status: 'active' | 'trial' | 'past_due' | 'expired' | 'cancelled';
  mrr: number;
}

export interface AdminMembershipPlan {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  monthlyPrice: number;
  yearlyPrice: number;
  trialDays: number;
  courseAccessRule: string;
  videoAccessRule: string;
  benefits: string[];
  displayOrder: number;
  published: boolean;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit: number;
  minPurchase: number;
  eligibleScope: 'all' | 'courses' | 'subscriptions';
  status: 'active' | 'expired';
}

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  memberName: string;
  amount: number;
  issuedAt: string;
  status: 'paid' | 'refunded';
}

export interface AdminRefundRequest {
  id: string;
  orderNumber: string;
  memberName: string;
  amount: number;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

/* ==================== Engagement, Marketing & System ==================== */
export interface AdminAnnouncement {
  id: string;
  title: LocalizedText;
  message: LocalizedText;
  audience: 'all' | 'free_members' | 'paid_members' | 'course_enrolled';
  channel: 'in_app' | 'email' | 'both';
  scheduledFor: string;
  status: 'sent' | 'scheduled' | 'draft';
}

export interface AdminReview {
  id: string;
  courseTitle: string;
  memberName: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'hidden';
  reply?: string;
  createdAt: string;
}

export interface AdminSupportTicket {
  id: string;
  ticketCode: string;
  memberName: string;
  memberEmail: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent: string;
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  updatedAt: string;
  internalNotes: string;
  messages: { sender: string; body: string; at: string }[];
}

export interface HomepageConfig {
  heroHeadline: LocalizedText;
  heroSubheadline: LocalizedText;
  primaryCtaLabel: LocalizedText;
  bannerText: LocalizedText;
  bannerActive: boolean;
  publishedStatus: 'published' | 'scheduled';
}

export interface AdminTestimonial {
  id: string;
  authorName: string;
  role: string;
  quote: LocalizedText;
  rating: number;
  published: boolean;
}

export interface AuditLogRecord {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: AdminModule;
  timestamp: string;
  ipAddress: string;
  result: 'success' | 'denied';
  details: string;
}

export interface SystemSettingsState {
  platformName: string;
  defaultLanguage: Locale;
  supportedLanguages: Locale[];
  currency: 'USD' | 'KHR';
  timezone: string;
  emailSenderName: string;
  emailReplyTo: string;
  videoProvider: 'Cloudflare Stream' | 'Mux';
  khqrEnabled: boolean;
  stripeEnabled: boolean;
  sessionTimeoutMinutes: number;
  enforceMfaForAdmins: boolean;
  maintenanceMode: boolean;
}

