import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminModule, PermissionAction } from '@/types';

export const PermissionGuard: React.FC<{
  module: AdminModule;
  action?: PermissionAction;
  children: React.ReactNode;
}> = ({ module, action = 'view', children }) => {
  const { can, currentRole } = useAdmin();
  const { t } = useI18n();

  if (!can(module, action)) {
    return (
      <div className="card-note p-10 text-center max-w-lg mx-auto my-8 space-y-3">
        <div className="mx-auto h-12 w-12 rounded-full bg-[#FEF2F2] text-[#a5331f] flex items-center justify-center border border-[#FECACA]">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="font-serif-display text-[22px] font-normal text-[#141312]">
          {t.common.noPermission}
        </h2>
        <p className="text-[13.5px] text-[#6e6a62]">{t.common.noPermissionDesc}</p>
        <p className="text-[12px] font-mono-tech text-[#6e6a62]">
          Role: {currentRole?.name ?? 'None'} · Required: {module}:{action}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export function exportRowsToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

