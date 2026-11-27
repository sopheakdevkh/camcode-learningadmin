import React, { useState } from 'react';
import { Bell, CheckCircle2, Eye, EyeOff, Megaphone, MessageSquare, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminAnnouncement, AdminSupportTicket } from '@/types';

/* ==================== SCREEN 21: ANNOUNCEMENTS & NOTIFICATIONS ==================== */
export const AnnouncementsPage: React.FC = () => {
  const { t } = useI18n();
  const { announcements, setAnnouncements, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [msgEn, setMsgEn] = useState('');
  const [audience, setAudience] = useState<AdminAnnouncement['audience']>('all');
  const [channel, setChannel] = useState<AdminAnnouncement['channel']>('both');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncements((prev) => [
      {
        id: `ann-${Date.now()}`,
        title: { en: titleEn },
        message: { en: msgEn },
        audience,
        channel,
        scheduledFor: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'sent',
      },
      ...prev,
    ]);
    logAudit('announcements', `Sent announcement "${titleEn}"`, `Audience: ${audience}, Channel: ${channel}`);
    setModalOpen(false);
    setTitleEn('');
    setMsgEn('');
  };

  return (
    <PermissionGuard module="announcements" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.announcements.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.announcements.subtitle}</p>
          </div>
          {can('announcements', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Megaphone className="h-4 w-4" />}>
              Send Announcement
            </Button>
          )}
        </div>

        <DataTable
          data={announcements}
          keyExtractor={(a) => a.id}
          searchPlaceholder="Search announcements..."
          searchFilter={(a, q) => a.title.en.toLowerCase().includes(q)}
          columns={[
            {
              key: 'title',
              header: 'Announcement',
              render: (a) => (
                <div>
                  <p className="font-semibold">{a.title.en}</p>
                  <p className="text-[12px] text-[#6e6a62]">{a.message.en}</p>
                </div>
              ),
            },
            { key: 'audience', header: 'Target Audience', render: (a) => <Badge tone="primary">{a.audience.replace('_', ' ')}</Badge> },
            { key: 'channel', header: 'Channel', render: (a) => a.channel },
            { key: 'sched', header: 'Timestamp', render: (a) => a.scheduledFor },
            { key: 'status', header: 'Status', render: (a) => <Badge tone={a.status === 'sent' ? 'success' : 'info'}>{a.status}</Badge> },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Broadcast Announcement">
          <form onSubmit={handleSend} className="space-y-3.5">
            <Input label="Headline (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            <div>
              <label className="block text-[12.5px] font-medium mb-1">Message Body</label>
              <textarea rows={3} value={msgEn} onChange={(e) => setMsgEn(e.target.value)} required className="w-full rounded-xl border border-[#ded8ca] p-2.5 text-[13px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Target Group</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value as AdminAnnouncement['audience'])} className="w-full h-9 px-2 rounded-xl border border-[#ded8ca] text-[13px]">
                  <option value="all">All Users</option>
                  <option value="free_members">Free Members</option>
                  <option value="paid_members">Paid Subscribers</option>
                  <option value="course_enrolled">Enrolled Students</option>
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Delivery Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value as AdminAnnouncement['channel'])} className="w-full h-9 px-2 rounded-xl border border-[#ded8ca] text-[13px]">
                  <option value="both">In-App + Email</option>
                  <option value="in_app">In-App Only</option>
                  <option value="email">Email Only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" leftIcon={<Send className="h-3.5 w-3.5" />}>Send Now</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

export const NotificationsAdminPage: React.FC = () => {
  const { t } = useI18n();
  return (
  <PermissionGuard module="notifications" action="view">
    <div className="space-y-4">
      <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.notifications.title}</h1>
      <div className="card-note p-5 flex items-center gap-3 text-[13.5px] text-[#4c4842]">
        <Bell className="h-5 w-5 text-[#1c5b48]" />
        <span>{t.pages.notifications.subtitle}</span>
      </div>
    </div>
  </PermissionGuard>
  );
};

/* ==================== SCREEN 22: REVIEWS & FEEDBACK ==================== */
export const ReviewsPage: React.FC = () => {
  const { t } = useI18n();
  const { reviews, setReviews, can, logAudit } = useAdmin();
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  return (
    <PermissionGuard module="reviews" action="view">
      <div className="space-y-5">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.reviews.title}</h1>
          <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.reviews.subtitle}</p>
        </div>

        <DataTable
          data={reviews}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search course or learner..."
          searchFilter={(r, q) => r.courseTitle.toLowerCase().includes(q) || r.memberName.toLowerCase().includes(q)}
          columns={[
            { key: 'course', header: 'Course', render: (r) => <span className="font-semibold">{r.courseTitle}</span> },
            { key: 'member', header: 'Learner', render: (r) => r.memberName },
            { key: 'rating', header: 'Rating', render: (r) => `${r.rating} ★` },
            {
              key: 'comment',
              header: 'Feedback',
              render: (r) => (
                <div className="max-w-md">
                  <p>{r.comment}</p>
                  {r.reply && <p className="text-[12px] text-[#1c5b48] mt-1">Reply: {r.reply}</p>}
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => (
                <Badge tone={r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}>
                  {r.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (r) =>
                can('reviews', 'edit') ? (
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      title="Approve"
                      onClick={() => {
                        setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'approved' } : x)));
                        logAudit('reviews', `Approved review by ${r.memberName}`, r.courseTitle);
                      }}
                      className="p-1.5 rounded hover:bg-[#e4ede7] text-[#1c5b48] cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Hide"
                      onClick={() =>
                        setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'hidden' } : x)))
                      }
                      className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#a5331f] cursor-pointer"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Reply"
                      onClick={() => {
                        setReplyTargetId(r.id);
                        setReplyText(r.reply ?? '');
                      }}
                      className="p-1.5 rounded hover:bg-[#e4ede7] text-[#1c5b48] cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                ) : null,
            },
          ]}
        />

        <Modal open={Boolean(replyTargetId)} onClose={() => setReplyTargetId(null)} title="Reply to Learner Review" maxWidthClass="max-w-md">
          <div className="space-y-3">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write official academy response..."
              className="w-full rounded-xl border border-[#ded8ca] p-2.5 text-[13px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyTargetId(null)}>Cancel</Button>
              <Button
                onClick={() => {
                  setReviews((prev) =>
                    prev.map((x) => (x.id === replyTargetId ? { ...x, reply: replyText, status: 'approved' } : x)),
                  );
                  setReplyTargetId(null);
                }}
              >
                Post Reply
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 23: SUPPORT TICKETS ==================== */
export const SupportTicketsPage: React.FC = () => {
  const { t } = useI18n();
  const { tickets, setTickets, can, logAudit } = useAdmin();
  const [activeTicket, setActiveTicket] = useState<AdminSupportTicket | null>(null);
  const [replyBody, setReplyBody] = useState('');

  const sendReply = () => {
    if (!activeTicket || !replyBody.trim()) return;
    const msg = { sender: 'Support Agent', body: replyBody.trim(), at: 'Just now' };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, status: 'waiting_user', updatedAt: 'Just now', messages: [...t.messages, msg] }
          : t,
      ),
    );
    setActiveTicket((prev) => (prev ? { ...prev, messages: [...prev.messages, msg] } : null));
    logAudit('support', `Replied to ticket ${activeTicket.ticketCode}`, replyBody.trim());
    setReplyBody('');
  };

  return (
    <PermissionGuard module="support" action="view">
      <div className="space-y-5">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.support.title}</h1>
          <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.support.subtitle}</p>
        </div>

        <DataTable
          data={tickets}
          keyExtractor={(t) => t.id}
          searchPlaceholder="Search ticket #, subject, or member..."
          searchFilter={(t, q) =>
            t.ticketCode.toLowerCase().includes(q) ||
            t.subject.toLowerCase().includes(q) ||
            t.memberName.toLowerCase().includes(q)
          }
          columns={[
            { key: 'code', header: 'Ticket', render: (t) => <span className="font-mono-tech font-semibold">{t.ticketCode}</span> },
            { key: 'subject', header: 'Subject', render: (t) => <span className="font-medium">{t.subject}</span> },
            { key: 'member', header: 'Member', render: (t) => t.memberName },
            {
              key: 'priority',
              header: 'Priority',
              render: (t) => (
                <Badge tone={t.priority === 'high' || t.priority === 'urgent' ? 'danger' : 'warning'}>{t.priority}</Badge>
              ),
            },
            { key: 'agent', header: 'Assigned Agent', render: (t) => t.assignedAgent },
            {
              key: 'status',
              header: 'Status',
              render: (t) => (
                <Badge tone={t.status === 'resolved' || t.status === 'closed' ? 'success' : 'primary'}>
                  {t.status.replace('_', ' ')}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (t) => (
                <button type="button" onClick={() => setActiveTicket(t)} className="p-1.5 rounded hover:bg-[#e5dfd2] text-[#1c5b48] cursor-pointer">
                  <Eye className="h-4 w-4" />
                </button>
              ),
            },
          ]}
        />

        <Modal open={Boolean(activeTicket)} onClose={() => setActiveTicket(null)} title={`Ticket ${activeTicket?.ticketCode ?? ''}`} maxWidthClass="max-w-2xl">
          {activeTicket && (
            <div className="space-y-4 text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#ded8ca]">
                <div>
                  <h3 className="text-[16px] font-bold">{activeTicket.subject}</h3>
                  <p className="text-[#6e6a62]">{activeTicket.memberName} ({activeTicket.memberEmail})</p>
                </div>
                {can('support', 'edit') && (
                  <select
                    value={activeTicket.status}
                    onChange={(e) => {
                      const next = e.target.value as AdminSupportTicket['status'];
                      setTickets((prev) => prev.map((x) => (x.id === activeTicket.id ? { ...x, status: next } : x)));
                      setActiveTicket((prev) => (prev ? { ...prev, status: next } : null));
                    }}
                    className="h-8 px-2.5 rounded-md border border-[#ded8ca]"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_user">Waiting for User</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeTicket.messages.map((m, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#f6f3ec] border border-[#ded8ca]">
                    <p className="font-semibold text-[12px] text-[#1c5b48]">{m.sender} · {m.at}</p>
                    <p className="mt-0.5 text-[#141312]">{m.body}</p>
                  </div>
                ))}
              </div>

              {can('support', 'edit') && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write response to member..."
                    className="flex-1 h-9 px-3 rounded-xl border border-[#ded8ca]"
                  />
                  <Button size="sm" onClick={sendReply}>Send Reply</Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PermissionGuard>
  );
};

