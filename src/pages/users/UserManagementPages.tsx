import React, { useState } from 'react';
import { Eye, KeyRound, Plus, Shield, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { exportRowsToCsv, PermissionGuard } from '@/components/ui/PermissionGuard';
import { ALL_ACTIONS, ALL_MODULES } from '@/data/rbacPresets';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminMember, AdminModule, AdminRole, PermissionAction } from '@/types';

/* ==================== SCREEN 12: MEMBER MANAGEMENT ==================== */
export const MembersPage: React.FC = () => {
  const { t } = useI18n();
  const { members, setMembers, orders, can, logAudit } = useAdmin();
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminMember | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [membership, setMembership] = useState<'free' | 'basic' | 'premium'>('free');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminMember = {
      id: `mem-${Date.now()}`,
      name,
      email,
      registeredAt: new Date().toISOString().slice(0, 10),
      membership,
      status: 'active',
      lastLogin: 'Never',
      enrolledCoursesCount: 0,
      completedCoursesCount: 0,
      certificatesCount: 0,
      totalSpent: 0,
    };
    setMembers((prev) => [created, ...prev]);
    logAudit('members', `Created member "${name}"`, `Email: ${email}`);
    setCreateOpen(false);
    setName('');
    setEmail('');
  };

  const toggleStatus = (m: AdminMember, next: AdminMember['status']) => {
    setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: next } : x)));
    logAudit('members', `Changed member "${m.name}" status to ${next}`, `Member ID: ${m.id}`);
  };

  return (
    <PermissionGuard module="members" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.members.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.members.subtitle}
            </p>
          </div>
          <div className="flex gap-2">
            {can('members', 'export') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportRowsToCsv(
                    'members.csv',
                    ['ID', 'Name', 'Email', 'Membership', 'Status', 'Registered'],
                    members.map((m) => [m.id, m.name, m.email, m.membership, m.status, m.registeredAt]),
                  )
                }
              >
                Export CSV
              </Button>
            )}
            {can('members', 'create') && (
              <Button size="sm" onClick={() => setCreateOpen(true)} leftIcon={<UserPlus className="h-4 w-4" />}>
                Add Member
              </Button>
            )}
          </div>
        </div>

        <DataTable
          data={members}
          keyExtractor={(m) => m.id}
          searchPlaceholder="Search members by name, email, or ID..."
          searchFilter={(m, q) =>
            m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
          }
          columns={[
            { key: 'id', header: 'Member ID', render: (m) => <span className="font-mono-tech text-[12px]">{m.id}</span> },
            {
              key: 'name',
              header: 'Name & Email',
              render: (m) => (
                <div>
                  <p className="font-semibold text-[#141312]">{m.name}</p>
                  <p className="text-[11.5px] text-[#6e6a62]">{m.email}</p>
                </div>
              ),
            },
            { key: 'reg', header: 'Registered', render: (m) => m.registeredAt },
            { key: 'plan', header: 'Membership', render: (m) => <Badge tone="primary">{m.membership}</Badge> },
            {
              key: 'status',
              header: 'Status',
              render: (m) => (
                <Badge tone={m.status === 'active' ? 'success' : m.status === 'suspended' ? 'danger' : 'neutral'}>
                  {m.status}
                </Badge>
              ),
            },
            { key: 'login', header: 'Last Login', render: (m) => <span className="text-[#6e6a62]">{m.lastLogin}</span> },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (m) => (
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMember(m)}
                    className="p-1.5 rounded hover:bg-[#e5dfd2] text-[#1c5b48] cursor-pointer"
                    title="View Member Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {can('members', 'edit') && (
                    <button
                      type="button"
                      onClick={() => toggleStatus(m, m.status === 'active' ? 'suspended' : 'active')}
                      className="px-2 py-1 rounded text-[11px] font-semibold border border-[#ded8ca] hover:bg-[#f6f3ec] cursor-pointer"
                    >
                      {m.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />

        <Modal open={Boolean(selectedMember)} onClose={() => setSelectedMember(null)} title="Member Profile & History" maxWidthClass="max-w-2xl">
          {selectedMember && (
            <div className="space-y-4 text-[13px]">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#f6f3ec] border border-[#ded8ca]">
                <div>
                  <h3 className="font-serif-display text-[20px] font-normal text-[#141312] tracking-[-0.015em]">{selectedMember.name}</h3>
                  <p className="text-[#6e6a62]">{selectedMember.email}</p>
                </div>
                <Badge tone="primary">{selectedMember.membership} plan</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-[#ded8ca]">
                  <p className="text-[11px] text-[#6e6a62]">Enrolled</p>
                  <p className="text-[18px] font-bold">{selectedMember.enrolledCoursesCount}</p>
                </div>
                <div className="p-3 rounded-lg border border-[#ded8ca]">
                  <p className="text-[11px] text-[#6e6a62]">Completed</p>
                  <p className="text-[18px] font-bold">{selectedMember.completedCoursesCount}</p>
                </div>
                <div className="p-3 rounded-lg border border-[#ded8ca]">
                  <p className="text-[11px] text-[#6e6a62]">Certificates</p>
                  <p className="text-[18px] font-bold">{selectedMember.certificatesCount}</p>
                </div>
                <div className="p-3 rounded-lg border border-[#ded8ca]">
                  <p className="text-[11px] text-[#6e6a62]">Total Spent</p>
                  <p className="text-[18px] font-bold">${selectedMember.totalSpent}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Recent Orders</p>
                {orders.filter((o) => o.memberId === selectedMember.id).length === 0 ? (
                  <p className="text-[#6e6a62]">No orders recorded.</p>
                ) : (
                  orders
                    .filter((o) => o.memberId === selectedMember.id)
                    .map((o) => (
                      <div key={o.id} className="flex justify-between py-2 border-b border-[#ded8ca]">
                        <span>{o.orderNumber} · {o.itemName}</span>
                        <span className="font-semibold">${o.amount} ({o.status})</span>
                      </div>
                    ))
                )}
              </div>
              {can('members', 'edit') && (
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => setResetTarget(selectedMember)}>
                    Send Secure Password Reset Email
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>

        <ConfirmDialog
          open={Boolean(resetTarget)}
          danger={false}
          title="Trigger Secure Password Reset"
          description={`Send a time-limited password reset link to ${resetTarget?.email}?`}
          confirmLabel="Send Reset Email"
          onCancel={() => setResetTarget(null)}
          onConfirm={() => {
            if (resetTarget) {
              logAudit('members', `Sent password reset to ${resetTarget.email}`, 'Secure token workflow');
              setResetTarget(null);
            }
          }}
        />

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Member Account">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>
              <label className="block text-[12.5px] font-medium mb-1">Initial Membership</label>
              <select value={membership} onChange={(e) => setMembership(e.target.value as 'free' | 'basic' | 'premium')} className="w-full h-9 px-2.5 rounded-xl border border-[#ded8ca] text-[13px]">
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create Member</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 13: ADMINISTRATOR MANAGEMENT ==================== */
export const AdministratorsPage: React.FC = () => {
  const { t } = useI18n();
  const { admins, setAdmins, roles, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(roles[1]?.id ?? 'role-admin');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAdmins((prev) => [
      ...prev,
      {
        id: `adm-${Date.now()}`,
        name,
        email,
        roleId,
        status: 'active',
        lastLogin: 'Never',
        ipAddress: '—',
        activeSessions: 0,
      },
    ]);
    logAudit('administrators', `Created administrator "${name}"`, `Role ID: ${roleId}`);
    setModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <PermissionGuard module="administrators" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.administrators.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.administrators.subtitle}</p>
          </div>
          {can('administrators', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<KeyRound className="h-4 w-4" />}>
              Add Administrator
            </Button>
          )}
        </div>

        <DataTable
          data={admins}
          keyExtractor={(a) => a.id}
          searchPlaceholder="Search administrators..."
          searchFilter={(a, q) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)}
          columns={[
            {
              key: 'name',
              header: 'Administrator',
              render: (a) => (
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-[11.5px] text-[#6e6a62]">{a.email}</p>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'Assigned Role',
              render: (a) => <Badge tone="primary">{roles.find((r) => r.id === a.roleId)?.name ?? a.roleId}</Badge>,
            },
            { key: 'login', header: 'Last Login / IP', render: (a) => `${a.lastLogin} (${a.ipAddress})` },
            { key: 'sessions', header: 'Active Sessions', render: (a) => a.activeSessions },
            {
              key: 'status',
              header: 'Status',
              render: (a) => <Badge tone={a.status === 'active' ? 'success' : 'neutral'}>{a.status}</Badge>,
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (a) =>
                can('administrators', 'edit') ? (
                  <div className="inline-flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAdmins((prev) => prev.map((x) => (x.id === a.id ? { ...x, activeSessions: 0 } : x)));
                        logAudit('administrators', `Revoked sessions for ${a.name}`, 'Cleared HttpOnly refresh sessions');
                      }}
                    >
                      Revoke Sessions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setAdmins((prev) =>
                          prev.map((x) =>
                            x.id === a.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x,
                          ),
                        )
                      }
                    >
                      {a.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                ) : null,
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Administrator">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Admin Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>
              <label className="block text-[12.5px] font-medium mb-1">Role</label>
              <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full h-9 px-2.5 rounded-xl border border-[#ded8ca] text-[13px]">
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Administrator</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 14: ROLES & PERMISSIONS MATRIX ==================== */
export const RolesPermissionsPage: React.FC = () => {
  const { t } = useI18n();
  const { roles, setRoles, can, logAudit } = useAdmin();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? 'role-super-admin');
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0];

  const togglePerm = (module: AdminModule, action: PermissionAction) => {
    if (!can('roles', 'edit') || !selectedRole) return;
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [module]: {
                  ...r.permissions[module],
                  [action]: !r.permissions[module]?.[action],
                },
              },
            }
          : r,
      ),
    );
    logAudit('roles', `Toggled ${module}:${action} on "${selectedRole.name}"`, 'RBAC Matrix updated');
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    const templatePerms = JSON.parse(JSON.stringify(roles[roles.length - 1].permissions)) as AdminRole['permissions'];
    const created: AdminRole = {
      id: `role-${Date.now()}`,
      name: newRoleName,
      slug: newRoleName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      description: newRoleDesc,
      dataScope: 'global',
      isSystem: false,
      permissions: templatePerms,
    };
    setRoles((prev) => [...prev, created]);
    setSelectedRoleId(created.id);
    logAudit('roles', `Created custom role "${newRoleName}"`, newRoleDesc);
    setCreateOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  return (
    <PermissionGuard module="roles" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.roles.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.roles.subtitle}
            </p>
          </div>
          {can('roles', 'create') && (
            <Button size="sm" onClick={() => setCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Create Role
            </Button>
          )}
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRoleId(r.id)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 cursor-pointer border ${
                r.id === selectedRole?.id
                  ? 'bg-[#1c5b48] text-white border-[#1c5b48]'
                  : 'bg-[#efebe1] text-[#4c4842] border-[#ded8ca] hover:bg-[#f6f3ec]'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              {r.name}
            </button>
          ))}
        </div>

        {selectedRole && (
          <div className="card-note overflow-hidden">
            <div className="p-4 border-b border-[#ded8ca] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f6f3ec]">
              <div>
                <h2 className="text-[15px] font-bold text-[#141312]">{selectedRole.name}</h2>
                <p className="text-[12.5px] text-[#6e6a62]">{selectedRole.description}</p>
              </div>
              <Badge tone="info">Data Scope: {selectedRole.dataScope}</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#ded8ca] text-[11.5px] uppercase text-[#6e6a62] bg-[#f6f3ec]">
                    <th className="py-2.5 px-4">Module</th>
                    {ALL_ACTIONS.map((act) => (
                      <th key={act} className="py-2.5 px-3 text-center capitalize">{act}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ded8ca]">
                  {ALL_MODULES.map((mod) => (
                    <tr key={mod} className="hover:bg-[#f6f3ec]">
                      <td className="py-2.5 px-4 font-medium capitalize text-[#141312]">
                        {mod.replace(/_/g, ' ')}
                      </td>
                      {ALL_ACTIONS.map((act) => {
                        const checked = Boolean(selectedRole.permissions[mod]?.[act]);
                        return (
                          <td key={act} className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={!can('roles', 'edit')}
                              onChange={() => togglePerm(mod, act)}
                              className="h-4 w-4 accent-[#1c5b48] cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Custom Admin Role">
          <form onSubmit={handleCreateRole} className="space-y-3.5">
            <Input label="Role Name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} required />
            <Input label="Description" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} required />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create Role</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

export const MemberActivityPage: React.FC = () => {
  const { t } = useI18n();
  const { members } = useAdmin();
  return (
    <PermissionGuard module="member_activity" action="view">
      <div className="space-y-5">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.memberActivity.title}</h1>
          <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.memberActivity.subtitle}</p>
        </div>
        <DataTable
          data={members}
          keyExtractor={(m) => m.id}
          searchPlaceholder="Filter member activity..."
          searchFilter={(m, q) => m.name.toLowerCase().includes(q)}
          columns={[
            { key: 'name', header: 'Member', render: (m) => <span className="font-semibold">{m.name}</span> },
            { key: 'lastLogin', header: 'Last Active', render: (m) => m.lastLogin },
            { key: 'enrolled', header: 'Courses Enrolled', render: (m) => m.enrolledCoursesCount },
            { key: 'completed', header: 'Courses Completed', render: (m) => m.completedCoursesCount },
            { key: 'certs', header: 'Certificates', render: (m) => m.certificatesCount },
          ]}
        />
      </div>
    </PermissionGuard>
  );
};

