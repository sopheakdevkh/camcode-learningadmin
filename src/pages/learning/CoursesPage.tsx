import React, { useState } from 'react';
import { Archive, Copy, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { exportRowsToCsv, PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AccessType, AdminCourse, CourseStatus, DifficultyLevel } from '@/types';

const statusTone: Record<CourseStatus, 'neutral' | 'warning' | 'success' | 'danger'> = {
  draft: 'neutral',
  in_review: 'warning',
  published: 'success',
  archived: 'danger',
};

export const CoursesPage: React.FC = () => {
  const { t } = useI18n();
  const { courses, setCourses, categories, instructors, can, logAudit } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [previewCourse, setPreviewCourse] = useState<AdminCourse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCourse | null>(null);

  // Form state
  const [titleEn, setTitleEn] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 'cat-1');
  const [instructorId, setInstructorId] = useState(instructors[0]?.id ?? 'inst-john');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [durationHours, setDurationHours] = useState('8');
  const [accessType, setAccessType] = useState<AccessType>('paid_or_subscription');
  const [price, setPrice] = useState('29');
  const [objectivesText, setObjectivesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [status, setStatus] = useState<CourseStatus>('draft');

  const openCreate = () => {
    setEditing(null);
    setTitleEn('');
    setTitleKm('');
    setDescEn('');
    setCategoryId(categories[0]?.id ?? 'cat-1');
    setInstructorId(instructors[0]?.id ?? 'inst-john');
    setDifficulty('beginner');
    setDurationHours('8');
    setAccessType('paid_or_subscription');
    setPrice('29');
    setObjectivesText('Master core workflows\nComplete capstone exercise');
    setRequirementsText('No prior experience required');
    setSeoTitle('');
    setSeoDesc('');
    setStatus('draft');
    setModalOpen(true);
  };

  const openEdit = (course: AdminCourse) => {
    setEditing(course);
    setTitleEn(course.title.en);
    setTitleKm(course.title.km ?? '');
    setDescEn(course.description.en);
    setCategoryId(course.categoryId);
    setInstructorId(course.instructorId);
    setDifficulty(course.difficulty);
    setDurationHours(String(course.durationHours));
    setAccessType(course.accessType);
    setPrice(String(course.price));
    setObjectivesText(course.objectives.join('\n'));
    setRequirementsText(course.requirements.join('\n'));
    setSeoTitle(course.seoTitle);
    setSeoDesc(course.seoDescription);
    setStatus(course.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const parsedPrice = accessType === 'free' ? 0 : Number(price) || 0;
    const slug = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    if (editing) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                slug: slug || c.slug,
                title: { en: titleEn, km: titleKm },
                description: { ...c.description, en: descEn },
                categoryId,
                instructorId,
                difficulty,
                durationHours: Number(durationHours) || 1,
                accessType,
                price: parsedPrice,
                objectives: objectivesText.split('\n').filter(Boolean),
                requirements: requirementsText.split('\n').filter(Boolean),
                seoTitle: seoTitle || titleEn,
                seoDescription: seoDesc || descEn,
                status,
                lastUpdated: today,
              }
            : c,
        ),
      );
      logAudit('courses', `Updated course "${titleEn}"`, `Status: ${status}, Price: $${parsedPrice}`);
    } else {
      const created: AdminCourse = {
        id: `course-${Date.now()}`,
        slug: slug || `course-${Date.now()}`,
        title: { en: titleEn, km: titleKm },
        description: { en: descEn },
        categoryId,
        instructorId,
        difficulty,
        durationHours: Number(durationHours) || 1,
        accessType,
        price: parsedPrice,
        includedPlans: accessType === 'subscription' || accessType === 'paid_or_subscription' ? ['premium'] : [],
        status,
        enrollmentsCount: 0,
        completionRate: 0,
        rating: 0,
        featured: false,
        objectives: objectivesText.split('\n').filter(Boolean),
        requirements: requirementsText.split('\n').filter(Boolean),
        seoTitle: seoTitle || titleEn,
        seoDescription: seoDesc || descEn,
        lastUpdated: today,
      };
      setCourses((prev) => [created, ...prev]);
      logAudit('courses', `Created course "${titleEn}"`, `Initial status: ${status}`);
    }
    setModalOpen(false);
  };

  const handleDuplicate = (c: AdminCourse) => {
    const copy: AdminCourse = {
      ...c,
      id: `course-${Date.now()}`,
      slug: `${c.slug}-copy`,
      title: { en: `${c.title.en} (Copy)`, km: c.title.km ? `${c.title.km} (ច្បាប់ចម្លង)` : '' },
      status: 'draft',
      enrollmentsCount: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    setCourses((prev) => [copy, ...prev]);
    logAudit('courses', `Duplicated course "${c.title.en}"`, `Created draft ${copy.slug}`);
  };

  const togglePublish = (c: AdminCourse) => {
    const next: CourseStatus = c.status === 'published' ? 'draft' : 'published';
    setCourses((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
    logAudit('courses', `${next === 'published' ? 'Published' : 'Unpublished'} "${c.title.en}"`, `Status -> ${next}`);
  };

  const archiveCourse = (c: AdminCourse) => {
    setCourses((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: 'archived' } : x)));
    logAudit('courses', `Archived course "${c.title.en}"`, 'Moved to archived');
  };

  const filtered = statusFilter === 'all' ? courses : courses.filter((c) => c.status === statusFilter);

  return (
    <PermissionGuard module="courses" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.courses.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.courses.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {can('courses', 'export') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportRowsToCsv(
                    'courses.csv',
                    ['ID', 'Title', 'Status', 'Price', 'Enrollments', 'Updated'],
                    filtered.map((c) => [c.id, c.title.en, c.status, c.price, c.enrollmentsCount, c.lastUpdated]),
                  )
                }
              >
                Export CSV
              </Button>
            )}
            {can('courses', 'create') && (
              <Button size="sm" onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
                Create Course
              </Button>
            )}
          </div>
        </div>

        <DataTable
          data={filtered}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Search courses by title or slug..."
          searchFilter={(c, q) =>
            c.title.en.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
          }
          toolbarExtra={
            <Dropdown<CourseStatus | 'all'>
              size="sm"
              align="end"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'draft', label: 'Draft' },
                { value: 'in_review', label: 'In Review' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          }
          columns={[
            {
              key: 'title',
              header: 'Course',
              render: (c) => (
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="h-10 w-14 rounded-md bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-[#2563EB] shrink-0">
                    {c.durationHours}H
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2937]">{c.title.en}</p>
                    <p className="text-[11.5px] text-[#6B7280] font-mono-custom">/{c.slug}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'category',
              header: 'Category',
              render: (c) => categories.find((cat) => cat.id === c.categoryId)?.name.en ?? '—',
            },
            {
              key: 'instructor',
              header: 'Instructor',
              render: (c) => instructors.find((i) => i.id === c.instructorId)?.name ?? '—',
            },
            {
              key: 'access',
              header: 'Access / Price',
              render: (c) => (
                <div>
                  <span className="font-semibold">{c.price === 0 ? 'Free' : `$${c.price}`}</span>
                  <p className="text-[11px] text-[#6B7280] capitalize">{c.accessType.replace(/_/g, ' ')}</p>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (c) => (
                <Badge tone={statusTone[c.status]}>{c.status.replace('_', ' ')}</Badge>
              ),
            },
            {
              key: 'enrollments',
              header: 'Enrollments',
              render: (c) => <span className="font-mono-custom">{c.enrollmentsCount.toLocaleString()}</span>,
            },
            {
              key: 'updated',
              header: 'Last Updated',
              render: (c) => <span className="text-[#6B7280]">{c.lastUpdated}</span>,
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (c) => (
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    title="Preview"
                    onClick={() => setPreviewCourse(c)}
                    className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {can('courses', 'edit') && (
                    <>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#2563EB] cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Duplicate"
                        onClick={() => handleDuplicate(c)}
                        className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePublish(c)}
                        className="px-2 py-1 rounded text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100 cursor-pointer"
                      >
                        {c.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        title="Archive"
                        onClick={() => archiveCourse(c)}
                        className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#D97706] cursor-pointer"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {can('courses', 'delete') && (
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => setDeleteTarget(c)}
                      className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#DC2626] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />

        {/* Create / Edit Course Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? `Edit Course: ${editing.title.en}` : 'Create New Course'}
          maxWidthClass="max-w-3xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Course Title (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
              <Input label="Course Title (KM)" value={titleKm} onChange={(e) => setTitleKm(e.target.value)} />
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-[#1F2937] mb-1">Description (EN)</label>
              <textarea
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                required
                className="w-full rounded-[8px] border border-[#E5E7EB] p-2.5 text-[13px] outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Instructor</label>
                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]"
                >
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Input label="Duration (Hours)" type="number" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} />
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Access Model</label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value as AccessType)}
                  className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]"
                >
                  <option value="free">Free</option>
                  <option value="paid">One-time Paid</option>
                  <option value="subscription">Subscription Only</option>
                  <option value="paid_or_subscription">Paid or Subscription</option>
                </select>
              </div>
              <Input label="Price (USD)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} disabled={accessType === 'free'} />
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CourseStatus)}
                  className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]"
                >
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Learning Objectives (one per line)</label>
                <textarea
                  rows={3}
                  value={objectivesText}
                  onChange={(e) => setObjectivesText(e.target.value)}
                  className="w-full rounded-[8px] border border-[#E5E7EB] p-2.5 text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  className="w-full rounded-[8px] border border-[#E5E7EB] p-2.5 text-[13px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E5E7EB]">
              <Input label="SEO Meta Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
              <Input label="SEO Meta Description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? 'Save Changes' : 'Create Course'}</Button>
            </div>
          </form>
        </Modal>

        {/* Course Preview Modal */}
        <Modal
          open={Boolean(previewCourse)}
          onClose={() => setPreviewCourse(null)}
          title="Course Preview"
        >
          {previewCourse && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge tone={statusTone[previewCourse.status]}>{previewCourse.status}</Badge>
                <span className="text-[13px] font-semibold text-[#2563EB]">
                  {previewCourse.price === 0 ? 'Free' : `$${previewCourse.price}`}
                </span>
              </div>
              <h2 className="text-[20px] font-bold text-[#1F2937]">{previewCourse.title.en}</h2>
              {previewCourse.title.km && <p className="text-[15px] text-[#4B5563]">{previewCourse.title.km}</p>}
              <p className="text-[13.5px] text-[#4B5563]">{previewCourse.description.en}</p>
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[12.5px] space-y-1">
                <p className="font-semibold">Learning Objectives:</p>
                {previewCourse.objectives.map((o, i) => (
                  <p key={i}>• {o}</p>
                ))}
              </div>
            </div>
          )}
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Course"
          description={`Are you sure you want to permanently delete "${deleteTarget?.title.en}"? This action will be recorded in the audit log.`}
          confirmLabel="Delete Course"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
              logAudit('courses', `Deleted course "${deleteTarget.title.en}"`, `Course ID: ${deleteTarget.id}`);
              setDeleteTarget(null);
            }
          }}
        />
      </div>
    </PermissionGuard>
  );
};

