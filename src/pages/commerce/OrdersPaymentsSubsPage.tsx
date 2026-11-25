import React, { useState } from 'react';
import { CheckCircle2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Dropdown } from '@/components/ui/Dropdown';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { exportRowsToCsv, PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminOrder, AdminSubscription, OrderStatus } from '@/types';

const orderTone: Record<OrderStatus, 'warning' | 'success' | 'danger' | 'neutral' | 'info'> = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  cancelled: 'neutral',
  refunded: 'info',
};

/* ==================== SCREEN 15: ORDERS MANAGEMENT ==================== */
export const OrdersPage: React.FC = () => {
  const { t } = useI18n();
  const { orders, setOrders, can, logAudit } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <PermissionGuard module="orders" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.orders.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.orders.subtitle}</p>
          </div>
          {can('orders', 'export') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportRowsToCsv(
                  'orders.csv',
                  ['Order', 'Customer', 'Item', 'Amount', 'Method', 'Status', 'Date'],
                  filtered.map((o) => [o.orderNumber, o.memberName, o.itemName, o.amount, o.paymentMethod, o.status, o.orderDate]),
                )
              }
            >
              Export CSV
            </Button>
          )}
        </div>

        <DataTable
          data={filtered}
          keyExtractor={(o) => o.id}
          searchPlaceholder="Search order #, customer, or item..."
          searchFilter={(o, q) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.memberName.toLowerCase().includes(q) ||
            o.itemName.toLowerCase().includes(q)
          }
          toolbarExtra={
            <Dropdown<OrderStatus | 'all'>
              size="sm"
              align="end"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'paid', label: 'Paid' },
                { value: 'failed', label: 'Failed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'refunded', label: 'Refunded' },
              ]}
            />
          }
          columns={[
            { key: 'num', header: 'Order #', render: (o) => <span className="font-mono-custom font-semibold">{o.orderNumber}</span> },
            { key: 'cust', header: 'Customer', render: (o) => o.memberName },
            { key: 'item', header: 'Course / Plan', render: (o) => o.itemName },
            { key: 'amount', header: 'Amount', render: (o) => <span className="font-semibold">${o.amount.toFixed(2)}</span> },
            { key: 'method', header: 'Method', render: (o) => o.paymentMethod },
            { key: 'status', header: 'Status', render: (o) => <Badge tone={orderTone[o.status]}>{o.status}</Badge> },
            { key: 'date', header: 'Date', render: (o) => o.orderDate },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (o) => (
                <button type="button" onClick={() => setDetailOrder(o)} className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#2563EB] cursor-pointer">
                  <Eye className="h-4 w-4" />
                </button>
              ),
            },
          ]}
        />

        <Modal open={Boolean(detailOrder)} onClose={() => setDetailOrder(null)} title={`Order ${detailOrder?.orderNumber ?? ''}`}>
          {detailOrder && (
            <div className="space-y-3 text-[13.5px]">
              <p><strong>Customer:</strong> {detailOrder.memberName}</p>
              <p><strong>Item:</strong> {detailOrder.itemName} ({detailOrder.itemType})</p>
              <p><strong>Amount:</strong> ${detailOrder.amount.toFixed(2)} via {detailOrder.paymentMethod}</p>
              <p><strong>Status:</strong> {detailOrder.status} · Refund: {detailOrder.refundStatus}</p>
              {can('orders', 'edit') && detailOrder.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => {
                    setOrders((prev) => prev.map((x) => (x.id === detailOrder.id ? { ...x, status: 'paid' } : x)));
                    logAudit('orders', `Marked order ${detailOrder.orderNumber} as paid`, 'Manual verification');
                    setDetailOrder(null);
                  }}
                >
                  Mark Paid
                </Button>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 16: PAYMENT MANAGEMENT ==================== */
export const PaymentsPage: React.FC = () => {
  const { t } = useI18n();
  const { payments, setPayments, can, logAudit } = useAdmin();

  return (
    <PermissionGuard module="payments" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.payments.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.payments.subtitle}
            </p>
          </div>
          {can('payments', 'export') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportRowsToCsv(
                  'payments.csv',
                  ['Transaction ID', 'Order', 'Provider', 'Amount', 'Status', 'Reconciled'],
                  payments.map((p) => [p.transactionId, p.orderNumber, p.provider, p.amount, p.status, String(p.reconciled)]),
                )
              }
            >
              Export Ledger
            </Button>
          )}
        </div>

        <DataTable
          data={payments}
          keyExtractor={(p) => p.id}
          searchPlaceholder="Search transaction ID or order #..."
          searchFilter={(p, q) => p.transactionId.toLowerCase().includes(q) || p.orderNumber.toLowerCase().includes(q)}
          columns={[
            { key: 'txn', header: 'Transaction ID', render: (p) => <span className="font-mono-custom">{p.transactionId}</span> },
            { key: 'order', header: 'Order #', render: (p) => p.orderNumber },
            { key: 'provider', header: 'Provider', render: (p) => <Badge tone="primary">{p.provider}</Badge> },
            { key: 'amount', header: 'Amount', render: (p) => `$${p.amount.toFixed(2)} ${p.currency}` },
            {
              key: 'status',
              header: 'Status',
              render: (p) => <Badge tone={p.status === 'settled' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}>{p.status}</Badge>,
            },
            {
              key: 'reconciled',
              header: 'Reconciliation',
              render: (p) => (
                <Badge tone={p.reconciled ? 'success' : 'warning'}>{p.reconciled ? 'Reconciled' : 'Pending'}</Badge>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (p) =>
                can('payments', 'approve') && !p.reconciled ? (
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    onClick={() => {
                      setPayments((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, status: 'settled', reconciled: true } : x)),
                      );
                      logAudit('payments', `Reconciled payment ${p.transactionId}`, `${p.provider} $${p.amount}`);
                    }}
                  >
                    Reconcile
                  </Button>
                ) : null,
            },
          ]}
        />
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 17: SUBSCRIPTION MANAGEMENT ==================== */
export const SubscriptionsPage: React.FC = () => {
  const { t } = useI18n();
  const { subscriptions, setSubscriptions, can, logAudit } = useAdmin();
  const [cancelTarget, setCancelTarget] = useState<AdminSubscription | null>(null);

  return (
    <PermissionGuard module="subscriptions" action="view">
      <div className="space-y-5">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.subscriptions.title}</h1>
          <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.subscriptions.subtitle}</p>
        </div>

        <DataTable
          data={subscriptions}
          keyExtractor={(s) => s.id}
          searchPlaceholder="Search member or plan..."
          searchFilter={(s, q) => s.memberName.toLowerCase().includes(q) || s.planName.toLowerCase().includes(q)}
          columns={[
            { key: 'member', header: 'Member', render: (s) => <span className="font-semibold">{s.memberName}</span> },
            { key: 'plan', header: 'Plan', render: (s) => s.planName },
            { key: 'start', header: 'Start Date', render: (s) => s.startDate },
            { key: 'renewal', header: 'Next Renewal', render: (s) => s.renewalDate },
            { key: 'mrr', header: 'MRR', render: (s) => `$${s.mrr.toFixed(2)}` },
            {
              key: 'status',
              header: 'Status',
              render: (s) => (
                <Badge tone={s.status === 'active' ? 'success' : s.status === 'trial' ? 'info' : 'danger'}>
                  {s.status.replace('_', ' ')}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (s) =>
                can('subscriptions', 'edit') && s.status === 'active' ? (
                  <Button size="sm" variant="outline" onClick={() => setCancelTarget(s)}>
                    Cancel
                  </Button>
                ) : null,
            },
          ]}
        />

        <ConfirmDialog
          open={Boolean(cancelTarget)}
          title="Cancel Member Subscription"
          description={`Cancel ${cancelTarget?.memberName}'s ${cancelTarget?.planName} subscription at period end?`}
          confirmLabel="Cancel Subscription"
          onCancel={() => setCancelTarget(null)}
          onConfirm={() => {
            if (cancelTarget) {
              setSubscriptions((prev) =>
                prev.map((x) => (x.id === cancelTarget.id ? { ...x, status: 'cancelled', mrr: 0 } : x)),
              );
              logAudit('subscriptions', `Cancelled subscription for ${cancelTarget.memberName}`, cancelTarget.planName);
              setCancelTarget(null);
            }
          }}
        />
      </div>
    </PermissionGuard>
  );
};

