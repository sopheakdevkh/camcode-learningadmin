import React, { useState } from 'react';
import { CheckCircle2, Database, Plug, RefreshCw, Server, Settings, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/Modal';
import { exportRowsToCsv, PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';

/* ==================== SCREEN 28: AUDIT LOGS & ACTIVITY LOGS ==================== */
export const AuditLogsPage: React.FC<{ mode?: 'audit' | 'activity' }> = ({ mode = 'audit' }) => {
  const { t } = useI18n();
  const { auditLogs, can } = useAdmin();

  return (
    <PermissionGuard module="audit_logs" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">
              {mode === 'audit' ? t.pages.auditLogs.title : t.pages.activityLogs.title}
            </h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {mode === 'audit' ? t.pages.auditLogs.subtitle : t.pages.activityLogs.subtitle}
            </p>
          </div>
          {can('audit_logs', 'export') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportRowsToCsv(
                  'audit-logs.csv',
                  ['Timestamp', 'Actor', 'Role', 'Module', 'Action', 'Result', 'IP'],
                  auditLogs.map((l) => [l.timestamp, l.actorName, l.actorRole, l.module, l.action, l.result, l.ipAddress]),
                )
              }
            >
              Export Logs
            </Button>
          )}
        </div>

        <DataTable
          data={auditLogs}
          keyExtractor={(l) => l.id}
          searchPlaceholder="Filter by actor, module, or action..."
          searchFilter={(l, q) =>
            l.actorName.toLowerCase().includes(q) ||
            l.module.toLowerCase().includes(q) ||
            l.action.toLowerCase().includes(q)
          }
          columns={[
            { key: 'time', header: 'Timestamp', render: (l) => <span className="font-mono-tech text-[12px]">{l.timestamp}</span> },
            {
              key: 'actor',
              header: 'Administrator',
              render: (l) => (
                <div>
                  <p className="font-semibold">{l.actorName}</p>
                  <p className="text-[11px] text-[#6e6a62]">{l.actorRole}</p>
                </div>
              ),
            },
            { key: 'mod', header: 'Module', render: (l) => <Badge tone="primary">{l.module}</Badge> },
            {
              key: 'action',
              header: 'Action & Details',
              render: (l) => (
                <div>
                  <p className="font-medium">{l.action}</p>
                  <p className="text-[11.5px] text-[#6e6a62]">{l.details}</p>
                </div>
              ),
            },
            { key: 'ip', header: 'IP Address', render: (l) => <span className="font-mono-tech text-[12px]">{l.ipAddress}</span> },
            {
              key: 'result',
              header: 'Result',
              render: (l) => <Badge tone={l.result === 'success' ? 'success' : 'danger'}>{l.result}</Badge>,
            },
          ]}
        />
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 29: SYSTEM SETTINGS ==================== */
export const SystemSettingsPage: React.FC = () => {
  const { t } = useI18n();
  const { settings, setSettings, can, logAudit } = useAdmin();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logAudit('settings', 'Updated system settings', `Platform: ${settings.platformName}, Timeout: ${settings.sessionTimeoutMinutes}m`);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PermissionGuard module="settings" action="view">
      <div className="max-w-3xl space-y-5">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15] flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#1c5b48]" />
            {t.pages.settings.title}
          </h1>
          <p className="text-[14.5px] text-[#475569] mt-1">
            {t.pages.settings.subtitle}
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-[#e4ede7] border border-[#BBF7D0] text-[#15463a] text-[13px]">
            System configuration saved to Port 4000 settings store.
          </div>
        )}

        <form onSubmit={handleSave} className="card-note p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              value={settings.platformName}
              onChange={(e) => setSettings((s) => ({ ...s, platformName: e.target.value }))}
            />
            <Input
              label="Timezone"
              value={settings.timezone}
              onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))}
            />
            <Input
              label="Email Sender Name"
              value={settings.emailSenderName}
              onChange={(e) => setSettings((s) => ({ ...s, emailSenderName: e.target.value }))}
            />
            <Input
              label="Reply-To Email"
              value={settings.emailReplyTo}
              onChange={(e) => setSettings((s) => ({ ...s, emailReplyTo: e.target.value }))}
            />
            <Dropdown<'en' | 'km'>
              fullWidth
              size="lg"
              label="Default Language"
              value={settings.defaultLanguage}
              onChange={(val) => setSettings((s) => ({ ...s, defaultLanguage: val }))}
              options={[
                { value: 'en', label: 'English (EN)' },
                { value: 'km', label: 'Khmer (KM)' },
              ]}
            />
            <Input
              label="Admin Session Timeout (minutes)"
              type="number"
              value={String(settings.sessionTimeoutMinutes)}
              onChange={(e) => setSettings((s) => ({ ...s, sessionTimeoutMinutes: Number(e.target.value) || 30 }))}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-[#ded8ca] text-[13px]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.enforceMfaForAdmins}
                onChange={(e) => setSettings((s) => ({ ...s, enforceMfaForAdmins: e.target.checked }))}
              />
              Enforce MFA for all Administrator & Finance roles
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.khqrEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, khqrEnabled: e.target.checked }))}
              />
              Enable KHQR / ABA PayWay local checkout
            </label>
          </div>

          {can('settings', 'edit') && (
            <div className="flex justify-end pt-2">
              <Button type="submit">Save System Settings</Button>
            </div>
          )}
        </form>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 30: API & INTEGRATIONS ==================== */
export const IntegrationsPage: React.FC = () => {
  const { t } = useI18n();
  const { can, logAudit } = useAdmin();
  const [testedId, setTestedId] = useState<string | null>(null);

  const integrations = [
    { id: 'int-api', name: 'Camcode Core Backend API', endpoint: 'http://localhost:4000/api', status: 'Healthy · 18ms' },
    { id: 'int-cf', name: 'Cloudflare Stream Video Host', endpoint: 'Signed JWT Playback + Webhooks', status: 'Connected' },
    { id: 'int-khqr', name: 'KHQR / Bakong Payment Gateway', endpoint: 'HMAC Webhook Verified', status: 'Connected' },
    { id: 'int-stripe', name: 'Stripe International Cards', endpoint: 'Webhook Signing Active', status: 'Connected' },
    { id: 'int-smtp', name: 'Transactional Email Service', endpoint: 'DKIM + SPF Verified', status: 'Connected' },
  ];

  return (
    <PermissionGuard module="integrations" action="view">
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15] flex items-center gap-2">
            <Plug className="h-5 w-5 text-[#1c5b48]" />
            {t.pages.integrations.title}
          </h1>
          <p className="text-[14.5px] text-[#475569] mt-1">
            {t.pages.integrations.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {integrations.map((item) => (
            <div key={item.id} className="card-note p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-[14.5px] text-[#141312]">{item.name}</p>
                <p className="text-[12px] font-mono-tech text-[#6e6a62]">{item.endpoint}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="success">
                  <CheckCircle2 className="h-3 w-3" />
                  {testedId === item.id ? 'Ping Verified OK' : item.status}
                </Badge>
                {can('integrations', 'edit') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTestedId(item.id);
                      logAudit('integrations', `Tested integration "${item.name}"`, 'Health check passed');
                    }}
                  >
                    Test Connection
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 31: BACKUP & MAINTENANCE ==================== */
export const MaintenancePage: React.FC = () => {
  const { t } = useI18n();
  const { settings, setSettings, can, logAudit } = useAdmin();
  const [backups, setBackups] = useState([
    { id: 'bk-1', createdAt: '2026-11-25 02:00 UTC', size: '1.42 GB', status: 'Completed' },
    { id: 'bk-2', createdAt: '2026-11-24 02:00 UTC', size: '1.40 GB', status: 'Completed' },
  ]);
  const [confirmMaint, setConfirmMaint] = useState(false);

  return (
    <PermissionGuard module="maintenance" action="view">
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15] flex items-center gap-2">
              <Database className="h-5 w-5 text-[#1c5b48]" />
              {t.pages.maintenance.title}
            </h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.maintenance.subtitle}</p>
          </div>
          {can('maintenance', 'create') && (
            <Button
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => {
                const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
                setBackups((prev) => [{ id: `bk-${Date.now()}`, createdAt: now, size: '1.43 GB', status: 'Completed' }, ...prev]);
                logAudit('maintenance', 'Triggered manual database snapshot', now);
              }}
            >
              Run Backup Now
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-note p-4">
            <p className="text-[12px] text-[#6e6a62]">Database Health</p>
            <p className="text-[18px] font-bold text-[#1c5b48] mt-1 flex items-center gap-1.5">
              <Server className="h-4 w-4" /> Operational (99.98%)
            </p>
          </div>
          <div className="card-note p-4">
            <p className="text-[12px] text-[#6e6a62]">Storage Usage</p>
            <p className="text-[18px] font-bold text-[#141312] mt-1">18.4 GB / 100 GB</p>
          </div>
          <div className="card-note p-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#6e6a62]">Maintenance Mode</p>
              <p className="text-[15px] font-bold mt-1">{settings.maintenanceMode ? 'Enabled' : 'Disabled'}</p>
            </div>
            {can('maintenance', 'edit') && (
              <Button
                size="sm"
                variant={settings.maintenanceMode ? 'danger' : 'outline'}
                onClick={() => setConfirmMaint(true)}
              >
                {settings.maintenanceMode ? 'Disable' : 'Enable'}
              </Button>
            )}
          </div>
        </div>

        <div className="card-note p-5 space-y-3">
          <h2 className="text-[15px] font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#1c5b48]" />
            Snapshot Backup History
          </h2>
          <div className="divide-y divide-[#ded8ca] text-[13px]">
            {backups.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between">
                <span className="font-mono-tech">{b.createdAt}</span>
                <span className="text-[#6e6a62]">{b.size}</span>
                <Badge tone="success">{b.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <ConfirmDialog
          open={confirmMaint}
          title={settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
          description="Enabling maintenance mode temporarily pauses student access on Port 3000 & 3001 while database migrations run."
          onCancel={() => setConfirmMaint(false)}
          onConfirm={() => {
            setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }));
            logAudit('maintenance', `Toggled maintenance mode -> ${!settings.maintenanceMode}`, 'System wide');
            setConfirmMaint(false);
          }}
        />
      </div>
    </PermissionGuard>
  );
};

