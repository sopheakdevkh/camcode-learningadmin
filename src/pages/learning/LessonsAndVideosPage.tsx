import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Eye, Film, GripVertical, Paperclip, Play, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AdminLesson, AdminVideo, VideoProcessingStatus } from '@/types';

/* ==================== SCREEN 03: LESSON MANAGEMENT ==================== */
export const LessonsPage: React.FC = () => {
  const { t } = useI18n();
  const { courses, lessons, setLessons, videos, can, logAudit } = useAdmin();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? 'course-1');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<AdminLesson | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const [sectionTitle, setSectionTitle] = useState('Module 1: Foundations');
  const [titleEn, setTitleEn] = useState('');
  const [type, setType] = useState<'video' | 'text' | 'quiz'>('video');
  const [durationMinutes, setDurationMinutes] = useState('15');
  const [isPreview, setIsPreview] = useState(false);
  const [requiredCompletion, setRequiredCompletion] = useState(true);
  const [availabilityRule, setAvailabilityRule] = useState<'immediate' | 'sequential' | 'scheduled'>('sequential');
  const [videoId, setVideoId] = useState(videos[0]?.id ?? '');
  const [attachmentName, setAttachmentName] = useState('');

  const courseLessons = lessons
    .filter((l) => l.courseId === selectedCourseId)
    .sort((a, b) => a.sectionOrder - b.sectionOrder || a.lessonOrder - b.lessonOrder);

  const moveLesson = (id: string, dir: -1 | 1) => {
    const idx = courseLessons.findIndex((l) => l.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= courseLessons.length) return;
    const a = courseLessons[idx];
    const b = courseLessons[swapIdx];
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === a.id) return { ...l, lessonOrder: b.lessonOrder, sectionOrder: b.sectionOrder };
        if (l.id === b.id) return { ...l, lessonOrder: a.lessonOrder, sectionOrder: a.sectionOrder };
        return l;
      }),
    );
    logAudit('lessons', 'Reordered lessons', `Swapped "${a.title.en}" and "${b.title.en}"`);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const a = courseLessons.find((l) => l.id === dragId);
    const b = courseLessons.find((l) => l.id === targetId);
    if (!a || !b) return;
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === a.id) return { ...l, lessonOrder: b.lessonOrder, sectionOrder: b.sectionOrder };
        if (l.id === b.id) return { ...l, lessonOrder: a.lessonOrder, sectionOrder: a.sectionOrder };
        return l;
      }),
    );
    setDragId(null);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminLesson = {
      id: `les-${Date.now()}`,
      courseId: selectedCourseId,
      sectionTitle: { en: sectionTitle },
      sectionOrder: 1,
      lessonOrder: courseLessons.length + 1,
      title: { en: titleEn },
      type,
      durationMinutes: Number(durationMinutes) || 10,
      isPreview,
      requiredCompletion,
      availabilityRule,
      published: true,
      videoId: type === 'video' ? videoId : undefined,
      attachmentName: attachmentName || undefined,
    };
    setLessons((prev) => [...prev, created]);
    logAudit('lessons', `Added lesson "${titleEn}"`, `Course ID: ${selectedCourseId}`);
    setModalOpen(false);
    setTitleEn('');
    setAttachmentName('');
  };

  return (
    <PermissionGuard module="lessons" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.lessons.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.lessons.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dropdown
              size="sm"
              className="max-w-xs"
              value={selectedCourseId}
              onChange={setSelectedCourseId}
              options={courses.map((c) => ({ value: c.id, label: c.title.en }))}
            />
            {can('lessons', 'create') && (
              <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Add Lesson
              </Button>
            )}
          </div>
        </div>

        <div className="card-note divide-y divide-[#ded8ca]">
          {courseLessons.length === 0 ? (
            <div className="p-10 text-center text-[#6e6a62] text-[14px]">
              No lessons created for this course yet.
            </div>
          ) : (
            courseLessons.map((les, idx) => (
              <div
                key={les.id}
                draggable={can('lessons', 'edit')}
                onDragStart={() => setDragId(les.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(les.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#efebe1]/70"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <GripVertical className="h-4.5 w-4.5 text-[#6e6a62] mt-1 cursor-grab shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase text-[#6e6a62]">
                      {les.sectionTitle.en} · #{idx + 1}
                    </p>
                    <p className="text-[14px] font-semibold text-[#141312]">{les.title.en}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[12px] text-[#6e6a62]">
                      <Badge tone="neutral">{les.type}</Badge>
                      <span>{les.durationMinutes} min</span>
                      <span>Rule: {les.availabilityRule}</span>
                      {les.isPreview && <Badge tone="info">Free Preview</Badge>}
                      {les.requiredCompletion && <Badge tone="primary">Required</Badge>}
                      {les.attachmentName && (
                        <span className="inline-flex items-center gap-1 text-[#1c5b48]">
                          <Paperclip className="h-3 w-3" />
                          {les.attachmentName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewLesson(les)}
                    className="p-1.5 rounded hover:bg-[#e5dfd2] text-[#4c4842] cursor-pointer"
                    title="Preview lesson"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {can('lessons', 'edit') && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveLesson(les.id, -1)}
                        className="p-1.5 rounded hover:bg-[#e5dfd2] text-[#4c4842] cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLesson(les.id, 1)}
                        className="p-1.5 rounded hover:bg-[#e5dfd2] text-[#4c4842] cursor-pointer"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLessons((prev) =>
                            prev.map((x) => (x.id === les.id ? { ...x, published: !x.published } : x)),
                          )
                        }
                        className={`px-2.5 py-1 rounded text-[11.5px] font-semibold cursor-pointer ${
                          les.published ? 'bg-[#e4ede7] text-[#15463a]' : 'bg-[#e5dfd2] text-[#4c4842]'
                        }`}
                      >
                        {les.published ? 'Published' : 'Unpublished'}
                      </button>
                    </>
                  )}
                  {can('lessons', 'delete') && (
                    <button
                      type="button"
                      onClick={() => setLessons((prev) => prev.filter((x) => x.id !== les.id))}
                      className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#a5331f] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Lesson">
          <form onSubmit={handleCreateLesson} className="space-y-3.5">
            <Input label="Section Title" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} required />
            <Input label="Lesson Title (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Lesson Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'video' | 'text' | 'quiz')}
                  className="w-full h-9 px-2.5 rounded-[10px] border border-[#ded8ca] text-[13px]"
                >
                  <option value="video">Video Lesson</option>
                  <option value="text">Text / Reading</option>
                  <option value="quiz">Quiz Check</option>
                </select>
              </div>
              <Input label="Duration (min)" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Availability Rule</label>
                <select
                  value={availabilityRule}
                  onChange={(e) => setAvailabilityRule(e.target.value as 'immediate' | 'sequential' | 'scheduled')}
                  className="w-full h-9 px-2.5 rounded-[10px] border border-[#ded8ca] text-[13px]"
                >
                  <option value="immediate">Immediate</option>
                  <option value="sequential">Sequential Unlock</option>
                  <option value="scheduled">Scheduled Drip</option>
                </select>
              </div>
            </div>
            {type === 'video' && (
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Assign Video Asset</label>
                <select
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[10px] border border-[#ded8ca] text-[13px]"
                >
                  {videos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title.en} ({v.provider})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Input
              label="Attachment Resource Filename (PDF/XLSX)"
              placeholder="e.g., Lesson-Workbook.pdf"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
            />
            <div className="flex flex-wrap gap-4 pt-1 text-[13px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} />
                Free preview lesson
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={requiredCompletion} onChange={(e) => setRequiredCompletion(e.target.checked)} />
                Required for course completion
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Lesson</Button>
            </div>
          </form>
        </Modal>

        <Modal open={Boolean(previewLesson)} onClose={() => setPreviewLesson(null)} title="Lesson Preview">
          {previewLesson && (
            <div className="space-y-3 text-[13.5px]">
              <Badge tone="primary">{previewLesson.type}</Badge>
              <h3 className="text-[18px] font-bold">{previewLesson.title.en}</h3>
              <p className="text-[#6e6a62]">Section: {previewLesson.sectionTitle.en} · {previewLesson.durationMinutes} min</p>
              {previewLesson.attachmentName && <p>Attachment: {previewLesson.attachmentName}</p>}
            </div>
          )}
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 04: VIDEO LIBRARY MANAGEMENT ==================== */
const videoStatusTone: Record<VideoProcessingStatus, 'info' | 'warning' | 'success' | 'danger' | 'neutral'> = {
  uploading: 'info',
  processing: 'warning',
  ready: 'success',
  failed: 'danger',
  archived: 'neutral',
};

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readVideoDurationMinutes(objectUrl: string): Promise<number | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const minutes = Number.isFinite(video.duration) && video.duration > 0 ? Math.max(1, Math.round(video.duration / 60)) : null;
      resolve(minutes);
    };
    video.onerror = () => resolve(null);
    video.src = objectUrl;
  });
}

export const VideosAdminPage: React.FC = () => {
  const { t } = useI18n();
  const { videos, setVideos, categories, courses, can, logAudit } = useAdmin();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<VideoProcessingStatus | 'all'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<AdminVideo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminVideo | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [provider, setProvider] = useState<'Cloudflare Stream' | 'Mux'>('Cloudflare Stream');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 'cat-1');
  const [durationMinutes, setDurationMinutes] = useState('15');
  const [accessRule, setAccessRule] = useState<'free' | 'basic' | 'premium'>('basic');
  const [subtitlesEn, setSubtitlesEn] = useState(true);
  const [subtitlesKm, setSubtitlesKm] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | undefined>(undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetUploadForm = (revokePreview = true) => {
    if (revokePreview && videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setTitleEn('');
    setTitleKm('');
    setDurationMinutes('15');
    setSelectedFile(null);
    setVideoPreviewUrl(undefined);
    setUploadError(null);
    setIsDragging(false);
  };

  const handleCloseUploadModal = () => {
    resetUploadForm(true);
    setUploadOpen(false);
  };

  const handleVideoFileSelect = async (file: File) => {
    setUploadError(null);
    const isVideoMime = file.type.startsWith('video/');
    const isVideoExt = /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name);
    if (!isVideoMime && !isVideoExt) {
      setUploadError('Please select a supported video file (MP4, WebM, MOV, or MKV).');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setUploadError('Video file exceeds the 500MB upload limit.');
      return;
    }

    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setVideoPreviewUrl(previewUrl);

    if (!titleEn.trim()) {
      const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
      if (cleanName) setTitleEn(cleanName);
    }

    const detectedMinutes = await readVideoDurationMinutes(previewUrl);
    if (detectedMinutes !== null) {
      setDurationMinutes(String(detectedMinutes));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      void handleVideoFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleVideoFileSelect(file);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminVideo = {
      id: `vid-${Date.now()}`,
      title: { en: titleEn, km: titleKm },
      provider,
      providerAssetId: `${provider === 'Mux' ? 'mux' : 'cf-stream'}-${Math.random().toString(36).slice(2, 8)}`,
      categoryId,
      durationMinutes: Number(durationMinutes) || 10,
      subtitlesEn,
      subtitlesKm,
      accessRule,
      processingStatus: selectedFile ? 'ready' : 'processing',
      assignedCourseIds: [],
      featured: false,
      viewsCount: 0,
      uploadedAt: new Date().toISOString().slice(0, 10),
      fileName: selectedFile?.name,
      fileSizeBytes: selectedFile?.size,
      videoPreviewUrl,
    };
    setVideos((prev) => [created, ...prev]);
    logAudit(
      'videos',
      `Uploaded video "${titleEn}"`,
      selectedFile
        ? `${selectedFile.name} (${formatFileSize(selectedFile.size)}) · Provider: ${provider}`
        : `Provider: ${provider} (${created.providerAssetId})`,
    );
    resetUploadForm(false);
    setUploadOpen(false);
  };

  const filtered = statusFilter === 'all' ? videos : videos.filter((v) => v.processingStatus === statusFilter);

  return (
    <PermissionGuard module="videos" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.videos.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.videos.subtitle}
            </p>
          </div>
          {can('videos', 'create') && (
            <Button
              size="sm"
              onClick={() => {
                resetUploadForm(true);
                setUploadOpen(true);
              }}
              leftIcon={<UploadCloud className="h-4 w-4" />}
            >
              Upload Video
            </Button>
          )}
        </div>

        <DataTable
          data={filtered}
          keyExtractor={(v) => v.id}
          searchPlaceholder="Search videos or provider asset ID..."
          searchFilter={(v, q) =>
            v.title.en.toLowerCase().includes(q) ||
            v.providerAssetId.toLowerCase().includes(q) ||
            (v.fileName?.toLowerCase().includes(q) ?? false)
          }
          toolbarExtra={
            <Dropdown<VideoProcessingStatus | 'all'>
              size="sm"
              align="end"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Processing States' },
                { value: 'uploading', label: 'Uploading' },
                { value: 'processing', label: 'Processing' },
                { value: 'ready', label: 'Ready' },
                { value: 'failed', label: 'Failed' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          }
          columns={[
            {
              key: 'title',
              header: 'Video Asset',
              render: (v) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-12 rounded bg-gray-900 text-white flex items-center justify-center shrink-0 overflow-hidden">
                    {v.videoPreviewUrl ? (
                      <Play className="h-4 w-4 fill-white" />
                    ) : (
                      <Film className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#141312]">{v.title.en}</p>
                    <p className="text-[11px] font-mono-tech text-[#6e6a62]">
                      {v.provider} · {v.providerAssetId}
                      {v.fileName ? ` · ${v.fileName}` : ''}
                      {v.fileSizeBytes ? ` (${formatFileSize(v.fileSizeBytes)})` : ''}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: 'subtitles',
              header: 'Subtitles',
              render: (v) => (
                <div className="flex gap-1">
                  <Badge tone={v.subtitlesEn ? 'success' : 'neutral'}>EN</Badge>
                  <Badge tone={v.subtitlesKm ? 'success' : 'warning'}>KM</Badge>
                </div>
              ),
            },
            {
              key: 'access',
              header: 'Access Rule',
              render: (v) => <Badge tone="primary">{v.accessRule}</Badge>,
            },
            {
              key: 'courses',
              header: 'Assigned Courses',
              render: (v) =>
                v.assignedCourseIds.length > 0
                  ? v.assignedCourseIds
                      .map((id) => courses.find((c) => c.id === id)?.title.en.split(' ')[0])
                      .join(', ')
                  : 'Standalone',
            },
            {
              key: 'status',
              header: 'Status',
              render: (v) => <Badge tone={videoStatusTone[v.processingStatus]}>{v.processingStatus}</Badge>,
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (v) => (
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewVideo(v)}
                    title="Preview video"
                    className="p-1.5 rounded hover:bg-[#e5dfd2] text-[#1c5b48] cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {can('videos', 'edit') && v.processingStatus === 'processing' && (
                    <button
                      type="button"
                      onClick={() =>
                        setVideos((prev) =>
                          prev.map((x) => (x.id === v.id ? { ...x, processingStatus: 'ready' } : x)),
                        )
                      }
                      className="px-2 py-1 rounded bg-[#e4ede7] text-[#15463a] text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Mark Ready
                    </button>
                  )}
                  {can('videos', 'delete') && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(v)}
                      className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#a5331f] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />

        <Modal open={uploadOpen} onClose={handleCloseUploadModal} title="Upload Video to Stream Provider">
          <form onSubmit={handleUpload} className="space-y-3.5">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="Select video file"
            />

            {!selectedFile ? (
              <div
                onClick={() => videoInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#1c5b48] bg-[#e4ede7]'
                    : 'border-[#c2baa8] bg-[#f6f3ec] hover:border-[#1c5b48] hover:bg-[#e4ede7]/40'
                }`}
              >
                <UploadCloud className="h-8 w-8 text-[#1c5b48] mx-auto mb-2" />
                <p className="text-[13.5px] font-semibold text-[#141312]">
                  Drop video file here or click to browse
                </p>
                <p className="text-[11.5px] text-[#6e6a62] mt-0.5">
                  MP4, WebM, MOV or MKV · Max 500MB · Duration detected automatically
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#ded8ca] bg-[#f6f3ec] p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-[#e4ede7] text-[#1c5b48] flex items-center justify-center shrink-0">
                      <Film className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#141312] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11.5px] text-[#6e6a62]">
                        {formatFileSize(selectedFile.size)} · {durationMinutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      Replace
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                        setSelectedFile(null);
                        setVideoPreviewUrl(undefined);
                      }}
                      title="Remove selected video"
                      className="p-1.5 rounded-xl text-[#6e6a62] hover:bg-[#FEE2E2] hover:text-[#a5331f] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {videoPreviewUrl && (
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-full max-h-48 rounded-xl bg-black object-contain"
                  />
                )}
              </div>
            )}

            {uploadError && (
              <p className="text-[12.5px] text-[#a5331f] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-3 py-2">
                {uploadError}
              </p>
            )}

            <Input label="Video Title (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            <Input label="Video Title (KM)" value={titleKm} onChange={(e) => setTitleKm(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Streaming Host</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'Cloudflare Stream' | 'Mux')}
                  className="w-full h-9 px-2.5 rounded-[10px] border border-[#ded8ca] text-[13px]"
                >
                  <option value="Cloudflare Stream">Cloudflare Stream</option>
                  <option value="Mux">Mux Video</option>
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[10px] border border-[#ded8ca] text-[13px]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Access Permission</label>
                <select
                  value={accessRule}
                  onChange={(e) => setAccessRule(e.target.value as 'free' | 'basic' | 'premium')}
                  className="w-full h-9 px-2.5 rounded-[10px] border border-[#ded8ca] text-[13px]"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic Plan</option>
                  <option value="premium">Premium Plan</option>
                </select>
              </div>
            </div>
            <Input label="Duration (Minutes)" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
            <div className="flex gap-4 text-[13px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={subtitlesEn} onChange={(e) => setSubtitlesEn(e.target.checked)} />
                English Subtitles (.vtt)
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={subtitlesKm} onChange={(e) => setSubtitlesKm(e.target.checked)} />
                Khmer Subtitles (.vtt)
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleCloseUploadModal}>Cancel</Button>
              <Button type="submit">{selectedFile ? 'Save & Publish Video' : 'Start Stream Upload'}</Button>
            </div>
          </form>
        </Modal>

        <Modal open={Boolean(previewVideo)} onClose={() => setPreviewVideo(null)} title={previewVideo?.title.en ?? 'Video Preview'}>
          {previewVideo && (
            <div className="space-y-3 text-[13px]">
              {previewVideo.videoPreviewUrl ? (
                <video
                  src={previewVideo.videoPreviewUrl}
                  controls
                  autoPlay
                  className="w-full max-h-72 rounded-xl bg-black"
                />
              ) : (
                <div className="rounded-xl bg-[#141312] text-white p-8 text-center space-y-2">
                  <Film className="h-8 w-8 mx-auto text-[#7FB59C]" />
                  <p className="font-semibold">{previewVideo.provider} · {previewVideo.providerAssetId}</p>
                  <p className="text-[12px] text-[#6e6a62]">Hosted stream asset preview ({previewVideo.durationMinutes} min)</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#6e6a62]">
                <Badge tone={videoStatusTone[previewVideo.processingStatus]}>{previewVideo.processingStatus}</Badge>
                <Badge tone="primary">{previewVideo.accessRule}</Badge>
                <span>{previewVideo.durationMinutes} min</span>
                {previewVideo.fileName && <span>· {previewVideo.fileName}</span>}
                {previewVideo.fileSizeBytes && <span>({formatFileSize(previewVideo.fileSizeBytes)})</span>}
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Video Asset"
          description={`Remove "${deleteTarget?.title.en}" from ${deleteTarget?.provider}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              if (deleteTarget.videoPreviewUrl) {
                URL.revokeObjectURL(deleteTarget.videoPreviewUrl);
              }
              setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
              logAudit('videos', `Deleted video "${deleteTarget.title.en}"`, deleteTarget.providerAssetId);
              setDeleteTarget(null);
            }
          }}
        />
      </div>
    </PermissionGuard>
  );
};

