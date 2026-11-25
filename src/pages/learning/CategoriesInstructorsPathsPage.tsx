import React, { useRef, useState } from 'react';
import { ArrowRight, Camera, Edit, FolderTree, Map, Plus, Trash2, Upload, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminCategory, AdminInstructor, AdminLearningPath } from '@/types';

/* ==================== SCREEN 05: CATEGORY MANAGEMENT ==================== */
export const CategoriesPage: React.FC = () => {
  const { t } = useI18n();
  const { categories, setCategories, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  const [nameEn, setNameEn] = useState('');
  const [nameKm, setNameKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [parentId, setParentId] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [active, setActive] = useState(true);

  const openModal = (cat?: AdminCategory) => {
    if (cat) {
      setEditing(cat);
      setNameEn(cat.name.en);
      setNameKm(cat.name.km ?? '');
      setDescEn(cat.description.en);
      setParentId(cat.parentId ?? '');
      setDisplayOrder(String(cat.displayOrder));
      setActive(cat.active);
    } else {
      setEditing(null);
      setNameEn('');
      setNameKm('');
      setDescEn('');
      setParentId('');
      setDisplayOrder(String(categories.length + 1));
      setActive(true);
    }
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                slug,
                name: { en: nameEn, km: nameKm },
                description: { en: descEn },
                parentId: parentId || null,
                displayOrder: Number(displayOrder) || 1,
                active,
              }
            : c,
        ),
      );
      logAudit('categories', `Updated category "${nameEn}"`, `Order: ${displayOrder}`);
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          slug,
          name: { en: nameEn, km: nameKm },
          description: { en: descEn },
          parentId: parentId || null,
          icon: 'FolderTree',
          displayOrder: Number(displayOrder) || 1,
          active,
          courseCount: 0,
        },
      ]);
      logAudit('categories', `Created category "${nameEn}"`, slug);
    }
    setModalOpen(false);
  };

  return (
    <PermissionGuard module="categories" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.categories.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.categories.subtitle}
            </p>
          </div>
          {can('categories', 'create') && (
            <Button size="sm" onClick={() => openModal()} leftIcon={<Plus className="h-4 w-4" />}>
              Add Category
            </Button>
          )}
        </div>

        <DataTable
          data={[...categories].sort((a, b) => a.displayOrder - b.displayOrder)}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Search categories..."
          searchFilter={(c, q) => c.name.en.toLowerCase().includes(q) || (c.name.km ?? '').includes(q)}
          columns={[
            {
              key: 'order',
              header: 'Order',
              render: (c) => <span className="font-mono-custom">{c.displayOrder}</span>,
            },
            {
              key: 'name',
              header: 'Category (EN / KM)',
              render: (c) => (
                <div className="flex items-center gap-2">
                  <FolderTree className="h-4 w-4 text-[#2563EB]" />
                  <div>
                    <p className="font-semibold text-[#1F2937]">{c.name.en}</p>
                    <p className="text-[11.5px] text-[#6B7280]">{c.name.km || 'Missing KM'}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'parent',
              header: 'Parent Category',
              render: (c) => categories.find((p) => p.id === c.parentId)?.name.en ?? 'Root',
            },
            {
              key: 'courses',
              header: 'Courses',
              render: (c) => c.courseCount,
            },
            {
              key: 'status',
              header: 'Status',
              render: (c) => <Badge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Active' : 'Inactive'}</Badge>,
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (c) => (
                <div className="inline-flex gap-1">
                  {can('categories', 'edit') && (
                    <button type="button" onClick={() => openModal(c)} className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#2563EB] cursor-pointer">
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {can('categories', 'delete') && (
                    <button type="button" onClick={() => setDeleteTarget(c)} className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#DC2626] cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Create Category'}>
          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
              <Input label="Name (KM)" value={nameKm} onChange={(e) => setNameKm(e.target.value)} />
            </div>
            <Input label="Description (EN)" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Parent Category</label>
                <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]">
                  <option value="">None (Top Level)</option>
                  {categories.filter((c) => c.id !== editing?.id).map((c) => (
                    <option key={c.id} value={c.id}>{c.name.en}</option>
                  ))}
                </select>
              </div>
              <Input label="Display Order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              Active and visible on catalog
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Category</Button>
            </div>
          </form>
        </Modal>

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Category"
          description={`Delete category "${deleteTarget?.name.en}"?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
              setDeleteTarget(null);
            }
          }}
        />
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 06: INSTRUCTOR MANAGEMENT ==================== */
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_OUTPUT_SIZE = 256;

async function processInstructorAvatar(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = objectUrl;
    });

    const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
    const sx = Math.max(0, ((img.naturalWidth || img.width) - side) / 2);
    const sy = Math.max(0, ((img.naturalHeight || img.height) - side) / 2);

    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
    return canvas.toDataURL('image/webp', 0.86);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const InstructorsPage: React.FC = () => {
  const { t } = useI18n();
  const { instructors, setInstructors, can, logAudit } = useAdmin();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminInstructor | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [expertise, setExpertise] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const openModal = (inst?: AdminInstructor) => {
    setAvatarError(null);
    if (inst) {
      setEditing(inst);
      setName(inst.name);
      setEmail(inst.email);
      setExpertise(inst.expertise);
      setBioEn(inst.bio.en);
      setAvatarUrl(inst.avatarUrl);
    } else {
      setEditing(null);
      setName('');
      setEmail('');
      setExpertise('');
      setBioEn('');
      setAvatarUrl(undefined);
    }
    setModalOpen(true);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError(null);
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (JPG, PNG, WebP, or GIF).');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Avatar image must be 5MB or smaller.');
      return;
    }

    try {
      const processedUrl = await processInstructorAvatar(file);
      setAvatarUrl(processedUrl);
    } catch {
      setAvatarError('Could not process the selected image. Please try another file.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setInstructors((prev) =>
        prev.map((i) =>
          i.id === editing.id
            ? { ...i, name, email, expertise, bio: { ...i.bio, en: bioEn }, avatarUrl }
            : i,
        ),
      );
      logAudit('instructors', `Updated instructor "${name}"`, expertise);
    } else {
      setInstructors((prev) => [
        ...prev,
        {
          id: `inst-${Date.now()}`,
          name,
          email,
          expertise,
          bio: { en: bioEn },
          status: 'active',
          assignedCoursesCount: 0,
          totalStudents: 0,
          avgRating: 5.0,
          avatarColor: '#2563EB',
          avatarUrl,
        },
      ]);
      logAudit('instructors', `Added instructor "${name}"`, email);
    }
    setModalOpen(false);
  };

  const previewInitials = (name || 'IN')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <PermissionGuard module="instructors" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.instructors.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.instructors.subtitle}</p>
          </div>
          {can('instructors', 'create') && (
            <Button size="sm" onClick={() => openModal()} leftIcon={<UserCheck className="h-4 w-4" />}>
              Add Instructor
            </Button>
          )}
        </div>

        <DataTable
          data={instructors}
          keyExtractor={(i) => i.id}
          searchPlaceholder="Search instructors..."
          searchFilter={(i, q) => i.name.toLowerCase().includes(q) || i.expertise.toLowerCase().includes(q)}
          columns={[
            {
              key: 'name',
              header: 'Instructor',
              render: (i) => (
                <div className="flex items-center gap-3">
                  {i.avatarUrl ? (
                    <img
                      src={i.avatarUrl}
                      alt={i.name}
                      className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#E5E7EB]"
                    />
                  ) : (
                    <span
                      className="h-8 w-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: i.avatarColor }}
                    >
                      {i.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-[#1F2937]">{i.name}</p>
                    <p className="text-[11.5px] text-[#6B7280]">{i.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'expertise', header: 'Expertise', render: (i) => i.expertise },
            { key: 'courses', header: 'Assigned Courses', render: (i) => i.assignedCoursesCount },
            { key: 'students', header: 'Learners', render: (i) => i.totalStudents.toLocaleString() },
            { key: 'rating', header: 'Avg Rating', render: (i) => `${i.avgRating.toFixed(1)} ★` },
            {
              key: 'status',
              header: 'Status',
              render: (i) => <Badge tone={i.status === 'active' ? 'success' : 'neutral'}>{i.status}</Badge>,
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (i) =>
                can('instructors', 'edit') ? (
                  <button type="button" onClick={() => openModal(i)} className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#2563EB] cursor-pointer">
                    <Edit className="h-4 w-4" />
                  </button>
                ) : null,
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Instructor' : 'Create Instructor'}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3.5">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                  aria-label="Upload instructor avatar"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  title={avatarUrl ? 'Change avatar' : 'Upload avatar'}
                  className="relative group h-14 w-14 rounded-full overflow-hidden text-white text-[16px] font-bold flex items-center justify-center shrink-0 cursor-pointer border border-[#E5E7EB]"
                  style={!avatarUrl ? { backgroundColor: editing?.avatarColor ?? '#2563EB' } : undefined}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name || 'Instructor'} className="h-full w-full object-cover" />
                  ) : (
                    <span>{previewInitials}</span>
                  )}
                  <span className="absolute inset-0 bg-[#111827]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-4.5 w-4.5 text-white" />
                  </span>
                </button>
                <div>
                  <p className="text-[13px] font-semibold text-[#1F2937]">Instructor Avatar</p>
                  <p className="text-[11.5px] text-[#6B7280]">JPG, PNG or WebP · Max 5MB</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => avatarInputRef.current?.click()}
                  leftIcon={<Upload className="h-3.5 w-3.5" />}
                >
                  {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAvatarError(null);
                      setAvatarUrl(undefined);
                    }}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {avatarError && (
              <p className="text-[12.5px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] px-3 py-2">
                {avatarError}
              </p>
            )}

            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} required />
            <div>
              <label className="block text-[12.5px] font-medium mb-1">Biography</label>
              <textarea rows={3} value={bioEn} onChange={(e) => setBioEn(e.target.value)} className="w-full rounded-[8px] border border-[#E5E7EB] p-2.5 text-[13px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Instructor</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 07: LEARNING PATH MANAGEMENT ==================== */
export const LearningPathsAdminPage: React.FC = () => {
  const { t } = useI18n();
  const { paths, setPaths, courses, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [prereq, setPrereq] = useState('None');
  const [hours, setHours] = useState('18');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? 'course-1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === selectedCourseId);
    const created: AdminLearningPath = {
      id: `path-${Date.now()}`,
      slug: titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: { en: titleEn },
      description: { en: descEn },
      stepItems: course ? [{ type: 'course', itemId: course.id, label: course.title.en }] : [],
      prerequisiteLabel: prereq,
      estimatedHours: Number(hours) || 12,
      accessType: 'premium',
      objectives: ['Complete structured roadmap milestones'],
      published: false,
      featured: false,
      enrolledCount: 0,
    };
    setPaths((prev) => [created, ...prev]);
    logAudit('paths', `Created learning path "${titleEn}"`, `${hours}h roadmap`);
    setModalOpen(false);
    setTitleEn('');
    setDescEn('');
  };

  return (
    <PermissionGuard module="paths" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.paths.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.paths.subtitle}
            </p>
          </div>
          {can('paths', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Create Learning Path
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {paths.map((p) => (
            <div key={p.id} className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={p.published ? 'success' : 'neutral'}>{p.published ? 'Published' : 'Draft'}</Badge>
                    <Badge tone="primary">{p.accessType}</Badge>
                    <span className="text-[12px] text-[#6B7280]">{p.estimatedHours}h · {p.enrolledCount} enrolled</span>
                  </div>
                  <h2 className="text-[17px] font-bold text-[#1F2937] flex items-center gap-2">
                    <Map className="h-4.5 w-4.5 text-[#2563EB]" />
                    {p.title.en}
                  </h2>
                </div>
                {can('paths', 'edit') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setPaths((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)))
                    }
                  >
                    {p.published ? 'Unpublish' : 'Publish'}
                  </Button>
                )}
              </div>

              <p className="text-[13px] text-[#4B5563]">{p.description.en}</p>
              <p className="text-[12px] text-[#6B7280]">Prerequisites: {p.prerequisiteLabel}</p>

              {/* Visual Roadmap Steps */}
              <div className="p-3.5 rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                <p className="text-[11px] font-semibold uppercase text-[#6B7280]">Structured Roadmap</p>
                <div className="flex flex-wrap items-center gap-2">
                  {p.stepItems.map((step, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] text-[12px] font-medium text-[#1F2937]">
                        {i + 1}. {step.label}
                      </span>
                      {i < p.stepItems.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[#9CA3AF]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Learning Path">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Path Title (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            <Input label="Description" value={descEn} onChange={(e) => setDescEn(e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Prerequisites" value={prereq} onChange={(e) => setPrereq(e.target.value)} />
              <Input label="Estimated Hours" type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
            <div>
              <label className="block text-[12.5px] font-medium mb-1">Initial Course Step</label>
              <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full h-9 px-2.5 rounded-[8px] border border-[#E5E7EB] text-[13px]">
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title.en}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create Path</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

