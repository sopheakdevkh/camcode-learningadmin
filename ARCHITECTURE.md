# Camcode Admin Dashboard — System Architecture & Screen Specifications (Port 3002)

## 1. Platform Topology

| Application | Port | Responsibility |
| --- | ---: | --- |
| Public Website | `3000` | Public marketing, discovery, and checkout |
| User Application | `3001` | Student learning workspace, progress, certificates |
| **Admin Dashboard** | **`3002`** | **Platform operations, content, finance, RBAC, analytics** |
| Backend API | `4000` | Business logic, PostgreSQL/ORM, webhook verification, RBAC enforcement |

## 2. Admin Sitemap & Navigation Structure

- **Overview**: `/` (Screen 01: Dashboard)
- **Learning Management**:
  - `/courses` (Screen 02: Courses)
  - `/lessons` (Screen 03: Lessons)
  - `/videos` (Screen 04: Video Library)
  - `/categories` (Screen 05: Categories)
  - `/instructors` (Screen 06: Instructors)
  - `/learning-paths` (Screen 07: Learning Paths)
  - `/certifications` (Screen 08: Certifications)
  - `/assessments` (Screen 09: Assessments & Quizzes)
  - `/question-bank` (Screen 10: Question Bank)
  - `/certificate-templates` (Screen 11: Certificate Templates)
- **User Management**:
  - `/members` (Screen 12: Members)
  - `/administrators` (Screen 13: Administrators)
  - `/roles` (Screen 14: Roles & Permissions)
  - `/member-activity` (Member Activity)
- **Commerce & Finance**:
  - `/orders` (Screen 15: Orders)
  - `/payments` (Screen 16: Payments)
  - `/subscriptions` (Screen 17: Subscriptions)
  - `/plans` (Screen 18: Membership Plans)
  - `/coupons` (Screen 19: Coupons & Promotions)
  - `/invoices` & `/refunds` (Screen 20: Invoices & Refunds)
- **Engagement & Support**:
  - `/announcements` & `/notifications` (Screen 21)
  - `/reviews` (Screen 22)
  - `/support` (Screen 23)
- **Marketing & Website**:
  - `/marketing/homepage`, `/marketing/featured-courses`, `/marketing/featured-videos`, `/marketing/banners`, `/marketing/testimonials` (Screen 24)
  - `/marketing/seo` (Screen 25)
  - `/marketing/translations` (Screen 26)
- **Analytics & Reports**:
  - `/analytics`, `/analytics/learning`, `/analytics/courses`, `/analytics/members`, `/analytics/revenue`, `/analytics/subscriptions` (Screen 27)
- **System Administration**:
  - `/system/audit-logs`, `/system/activity-logs` (Screen 28)
  - `/system/settings` (Screen 29)
  - `/system/integrations` (Screen 30)
  - `/system/maintenance` (Screen 31)

## 3. Configurable RBAC Matrix

Permissions are evaluated per `(module, action)` where actions are `view | create | edit | delete | approve | export`. Frontend hiding via `can(module, action)` and `<PermissionGuard>` is strictly paired with server-side middleware verification on Port 4000 (`/api/admin/*`).

| Role | Scope | Core Access |
| --- | --- | --- |
| Super Admin | Global | Full access to all 34 modules including Roles, Admins, Settings, Maintenance |
| Administrator | Global | Learning, Users, Commerce, Support, Marketing, Analytics (read-only system config) |
| Content Manager | Global | Courses, Lessons, Videos, Categories, Instructors, Paths, Certifications, Assessments, SEO, Translations |
| Instructor | Assigned Courses | Create/edit assigned courses, lessons, videos, quizzes; view course analytics & reviews |
| Finance Manager | Global | Orders, Payments, Subscriptions, Plans, Coupons, Invoices, Refunds, Financial Reports, Audit Logs |
| Support Agent | Support Scoped | Members (view/edit), Orders/Subscriptions (view), Refund requests (create), Support Tickets, Announcements |

## 4. Core Operational Workflows

1. **Course Publishing Workflow**: Draft -> In Review -> Published -> Archived. Every status transition writes an audit event.
2. **Video Ingestion Workflow**: Admin initiates direct upload to Cloudflare Stream / Mux (`uploading` -> `processing` -> `ready`), attaches EN/KM `.vtt` subtitles, sets tier rule (`free | basic | premium`), and links video IDs to lessons.
3. **Purchase & Payment Reconciliation**: Port 3000/3001 creates pending orders; Port 4000 verifies KHQR / ABA PayWay / Stripe HMAC webhooks before transitioning order to `paid` and granting access; Finance Manager reconciles ledger and processes refund approvals.
4. **Assessment & Certification Workflow**: Question Bank items compose Assessments with time limits and pass thresholds; passing triggers Certificate generation using an active Certificate Template with unique verification code.

## 5. Security Controls & Backend API Contracts (Port 4000)

- **Authentication**: HttpOnly `SameSite=Lax` session cookies (`credentials: 'include'` in `src/services/apiClient.ts`); zero auth tokens stored in `localStorage`.
- **Auditability**: Every create/edit/delete/approve mutation appends an immutable record (`actor`, `role`, `module`, `action`, `timestamp`, `ipAddress`, `result`, `details`).
- **Key API Endpoints**:
  - `POST /api/admin/auth/login`, `POST /api/admin/auth/logout`, `GET /api/admin/auth/me`
  - `GET/POST/PATCH/DELETE /api/admin/courses`, `/lessons`, `/videos`, `/categories`, `/instructors`, `/paths`
  - `GET/POST/PATCH /api/admin/members`, `/administrators`, `/roles`
  - `GET/POST/PATCH /api/admin/orders`, `/payments`, `/subscriptions`, `/plans`, `/coupons`, `/refunds`
  - `GET /api/admin/analytics/*`, `GET /api/admin/audit-logs`, `PATCH /api/admin/settings`

