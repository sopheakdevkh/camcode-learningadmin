import React, { useState } from 'react';
import { Check, Percent, Plus, Printer, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminMembershipPlan } from '@/types';

/* ==================== SCREEN 18: MEMBERSHIP PLAN MANAGEMENT ==================== */
export const MembershipPlansPage: React.FC = () => {
  const { t } = useI18n();
  const { plans, setPlans, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('29');
  const [yearlyPrice, setYearlyPrice] = useState('278');
  const [trialDays, setTrialDays] = useState('7');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminMembershipPlan = {
      id: `plan-${Date.now()}`,
      name: { en: nameEn },
      description: { en: descEn },
      monthlyPrice: Number(monthlyPrice) || 0,
      yearlyPrice: Number(yearlyPrice) || 0,
      trialDays: Number(trialDays) || 0,
      courseAccessRule: 'Selected tier courses',
      videoAccessRule: 'Full HD streaming library',
      benefits: ['Full HD video clinics', 'Course certificates'],
      displayOrder: plans.length + 1,
      published: true,
    };
    setPlans((prev) => [...prev, created]);
    logAudit('plans', `Created membership plan "${nameEn}"`, `$${monthlyPrice}/mo`);
    setModalOpen(false);
    setNameEn('');
    setDescEn('');
  };

  return (
    <PermissionGuard module="plans" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.plans.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.plans.subtitle}</p>
          </div>
          {can('plans', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Sparkles className="h-4 w-4" />}>
              Create Plan
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.id} className="card-note p-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-[20px] font-normal text-[#141312] tracking-[-0.015em]">{p.name.en}</h2>
                  <Badge tone={p.published ? 'success' : 'neutral'}>{p.published ? 'Published' : 'Hidden'}</Badge>
                </div>
                <p className="text-[13px] text-[#6e6a62]">{p.description.en}</p>
                <p className="text-[24px] font-extrabold text-[#141312]">
                  ${p.monthlyPrice} <span className="text-[13px] font-normal text-[#6e6a62]">/mo · ${p.yearlyPrice}/yr</span>
                </p>
                <div className="text-[12px] text-[#4c4842] space-y-1 pt-2 border-t border-[#ded8ca]">
                  <p><strong>Trial:</strong> {p.trialDays} days</p>
                  <p><strong>Courses:</strong> {p.courseAccessRule}</p>
                  <p><strong>Videos:</strong> {p.videoAccessRule}</p>
                </div>
              </div>
              {can('plans', 'edit') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)))
                  }
                >
                  {p.published ? 'Unpublish Plan' : 'Publish Plan'}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Membership Plan">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Plan Name" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
            <Input label="Description" value={descEn} onChange={(e) => setDescEn(e.target.value)} required />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Monthly ($)" type="number" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} />
              <Input label="Yearly ($)" type="number" value={yearlyPrice} onChange={(e) => setYearlyPrice(e.target.value)} />
              <Input label="Trial Days" type="number" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Plan</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 19: COUPONS & PROMOTIONS ==================== */
export const CouponsPage: React.FC = () => {
  const { t } = useI18n();
  const { coupons, setCoupons, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('15');
  const [usageLimit, setUsageLimit] = useState('250');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    setCoupons((prev) => [
      {
        id: `cpn-${Date.now()}`,
        code: cleanCode,
        discountType,
        value: Number(value) || 10,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '2026-12-31',
        usageCount: 0,
        usageLimit: Number(usageLimit) || 100,
        minPurchase: 0,
        eligibleScope: 'all',
        status: 'active',
      },
      ...prev,
    ]);
    logAudit('coupons', `Created coupon ${cleanCode}`, `${value}${discountType === 'percent' ? '%' : '$'} off`);
    setModalOpen(false);
    setCode('');
  };

  return (
    <PermissionGuard module="coupons" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.coupons.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.coupons.subtitle}</p>
          </div>
          {can('coupons', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Create Coupon
            </Button>
          )}
        </div>

        <DataTable
          data={coupons}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Search coupon code..."
          searchFilter={(c, q) => c.code.toLowerCase().includes(q)}
          columns={[
            {
              key: 'code',
              header: 'Coupon Code',
              render: (c) => (
                <span className="inline-flex items-center gap-1.5 font-mono-tech font-bold text-[#1c5b48]">
                  <Percent className="h-3.5 w-3.5" />
                  {c.code}
                </span>
              ),
            },
            {
              key: 'discount',
              header: 'Discount',
              render: (c) => (c.discountType === 'percent' ? `${c.value}% OFF` : `$${c.value} OFF`),
            },
            { key: 'scope', header: 'Eligible Scope', render: (c) => <Badge tone="neutral">{c.eligibleScope}</Badge> },
            { key: 'usage', header: 'Usage', render: (c) => `${c.usageCount} / ${c.usageLimit}` },
            { key: 'dates', header: 'Valid Until', render: (c) => c.endDate },
            {
              key: 'status',
              header: 'Status',
              render: (c) => <Badge tone={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</Badge>,
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Promotional Coupon">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Coupon Code" placeholder="e.g., ACADEMY25" value={code} onChange={(e) => setCode(e.target.value)} required />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Type</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')} className="w-full h-9 px-2 rounded-xl border border-[#ded8ca] text-[13px]">
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <Input label="Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
              <Input label="Usage Limit" type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Coupon</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 20: INVOICES & REFUNDS ==================== */
export const InvoicesPage: React.FC = () => {
  const { t } = useI18n();
  const { invoices } = useAdmin();
  return (
    <PermissionGuard module="invoices" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.invoices.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.invoices.subtitle}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
            Print / PDF
          </Button>
        </div>
        <DataTable
          data={invoices}
          keyExtractor={(i) => i.id}
          searchPlaceholder="Search invoice or member..."
          searchFilter={(i, q) => i.invoiceNumber.toLowerCase().includes(q) || i.memberName.toLowerCase().includes(q)}
          columns={[
            { key: 'inv', header: 'Invoice #', render: (i) => <span className="font-mono-tech font-semibold">{i.invoiceNumber}</span> },
            { key: 'ord', header: 'Order #', render: (i) => i.orderNumber },
            { key: 'member', header: 'Member', render: (i) => i.memberName },
            { key: 'amount', header: 'Amount', render: (i) => `$${i.amount.toFixed(2)}` },
            { key: 'date', header: 'Issued', render: (i) => i.issuedAt },
            { key: 'status', header: 'Status', render: (i) => <Badge tone={i.status === 'paid' ? 'success' : 'info'}>{i.status}</Badge> },
          ]}
        />
      </div>
    </PermissionGuard>
  );
};

export const RefundsPage: React.FC = () => {
  const { t } = useI18n();
  const { refunds, setRefunds, can, logAudit } = useAdmin();

  const decide = (id: string, status: 'approved' | 'rejected') => {
    const target = refunds.find((r) => r.id === id);
    setRefunds((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (target) {
      logAudit('refunds', `${status === 'approved' ? 'Approved' : 'Rejected'} refund ${target.orderNumber}`, `$${target.amount}`);
    }
  };

  return (
    <PermissionGuard module="refunds" action="view">
      <div className="space-y-5">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.refunds.title}</h1>
          <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.refunds.subtitle}</p>
        </div>

        <DataTable
          data={refunds}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search order or member..."
          searchFilter={(r, q) => r.orderNumber.toLowerCase().includes(q) || r.memberName.toLowerCase().includes(q)}
          columns={[
            { key: 'ord', header: 'Order #', render: (r) => <span className="font-mono-tech font-semibold">{r.orderNumber}</span> },
            { key: 'member', header: 'Member', render: (r) => r.memberName },
            { key: 'amount', header: 'Amount', render: (r) => `$${r.amount.toFixed(2)}` },
            { key: 'reason', header: 'Reason', render: (r) => r.reason },
            { key: 'date', header: 'Requested', render: (r) => r.requestedAt },
            {
              key: 'status',
              header: 'Status',
              render: (r) => (
                <Badge tone={r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'danger' : 'warning'}>
                  {r.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (r) =>
                can('refunds', 'approve') && r.status === 'pending' ? (
                  <div className="inline-flex gap-1.5">
                    <Button size="sm" variant="success" onClick={() => decide(r.id, 'approved')} leftIcon={<Check className="h-3.5 w-3.5" />}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => decide(r.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                ) : null,
            },
          ]}
        />
      </div>
    </PermissionGuard>
  );
};

