# CamcodeLearn Admin Dashboard (Port 3002)

Bilingual (**English + Khmer**) SaaS administration console for the **CamcodeLearn** platform, running on **Port 3002** (`camcode-learningadmin`) and designed to communicate with the Backend API on **Port 4000**.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Runs at **http://localhost:3002**.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server on port `3002` |
| `npm run typecheck` | Run TypeScript strict type checking (`tsc --noEmit`) |
| `npm run build` | Type-check and build production bundle to `dist/` |
| `npm run preview` | Preview production build locally on port `3002` |

## Key Capabilities

- **Configurable RBAC & Role Switcher**: Supports **Super Admin**, **Administrator**, **Content Manager**, **Instructor**, **Finance Manager**, and **Support Agent** with an editable module/action Permission Matrix (`/roles`). Use the top-right profile menu to preview role-based sidebar filtering and action guards live.
- **Security Posture**: Auth sessions are kept in memory / HttpOnly cookies (`credentials: 'include'`) — never stored in `localStorage`. Destructive actions require confirmation dialogs and record entries in **Audit Logs** (`/system/audit-logs`).
- **All 31 Admin Screens Implemented**: Covering Overview, Learning Management, User Management, Commerce & Finance, Engagement & Support, Marketing & Website, Analytics & Reports, and System Administration.
- **Documentation**: See [ARCHITECTURE.md](./ARCHITECTURE.md) for the complete sitemap, Screen 01–31 specifications, RBAC matrix, workflows, Port 4000 API contracts, and security architecture.

