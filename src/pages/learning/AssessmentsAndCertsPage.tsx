import React, { useState } from 'react';
import { Award, ClipboardCheck, Database, Eye, LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { exportRowsToCsv, PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';
import type { CertificateTemplate, DifficultyLevel } from '@/types';

/* ==================== SCREEN 08: CERTIFICATION MANAGEMENT ==================== */
export const CertificationsAdminPage: React.FC = () => {
  const { t } = useI18n();
  const { certifications, setCertifications, courses, templates, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [passingScore, setPassingScore] = useState('75');
  const [validityMonths, setValidityMonths] = useState('24');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCertifications((prev) => [
      {
        id: `cert-def-${Date.now()}`,
        title: { en: titleEn },
        description: { en: descEn },
        requiredCourseIds: courses[0] ? [courses[0].id] : [],
        requiredAssessmentIds: [],
        passingScore: Number(passingScore) || 75,
        validityMonths: Number(validityMonths) || 0,
        templateId: templates[0]?.id ?? 'tpl-1',
        published: true,
        issuedCount: 0,
      },
      ...prev,
    ]);
    logAudit('certifications', `Created certification "${titleEn}"`, `Passing score: ${passingScore}%`);
    setModalOpen(false);
    setTitleEn('');
    setDescEn('');
  };

  return (
    <PermissionGuard module="certifications" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.certifications.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.certifications.subtitle}</p>
          </div>
          {can('certifications', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Create Certification
            </Button>
          )}
        </div>

        <DataTable
          data={certifications}
          keyExtractor={(c) => c.id}
          searchPlaceholder="Search certifications..."
          searchFilter={(c, q) => c.title.en.toLowerCase().includes(q)}
          columns={[
            {
              key: 'title',
              header: 'Certification',
              render: (c) => (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#8a5008]" />
                  <div>
                    <p className="font-semibold">{c.title.en}</p>
                    <p className="text-[11.5px] text-[#6e6a62]">{c.description.en}</p>
                  </div>
                </div>
              ),
            },
            { key: 'passing', header: 'Passing Score', render: (c) => `${c.passingScore}%` },
            {
              key: 'validity',
              header: 'Validity',
              render: (c) => (c.validityMonths === 0 ? 'Lifetime' : `${c.validityMonths} months`),
            },
            { key: 'issued', header: 'Issued Count', render: (c) => c.issuedCount.toLocaleString() },
            {
              key: 'status',
              header: 'Status',
              render: (c) => <Badge tone={c.published ? 'success' : 'neutral'}>{c.published ? 'Published' : 'Draft'}</Badge>,
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (c) =>
                can('certifications', 'edit') ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCertifications((prev) =>
                        prev.map((x) => (x.id === c.id ? { ...x, published: !x.published } : x)),
                      )
                    }
                  >
                    {c.published ? 'Unpublish' : 'Publish'}
                  </Button>
                ) : null,
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Certification">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Certification Title" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            <Input label="Description" value={descEn} onChange={(e) => setDescEn(e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Passing Score (%)" type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} />
              <Input label="Validity (Months, 0 = Lifetime)" type="number" value={validityMonths} onChange={(e) => setValidityMonths(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 09: ASSESSMENT & QUIZ MANAGEMENT ==================== */
export const AssessmentsAdminPage: React.FC = () => {
  const { t } = useI18n();
  const { assessments, setAssessments, categories, questions, can, logAudit } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [timeLimit, setTimeLimit] = useState('20');
  const [passingScore, setPassingScore] = useState('75');
  const [attemptLimit, setAttemptLimit] = useState('3');
  const [randomize, setRandomize] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAssessments((prev) => [
      {
        id: `assess-${Date.now()}`,
        title: { en: titleEn },
        categoryId: categories[0]?.id ?? 'cat-1',
        questionIds: questions.slice(0, 2).map((q) => q.id),
        timeLimitMinutes: Number(timeLimit) || 15,
        passingScore: Number(passingScore) || 75,
        attemptLimit: Number(attemptLimit) || 3,
        randomizeQuestions: randomize,
        showResultsImmediately: true,
        published: true,
      },
      ...prev,
    ]);
    logAudit('assessments', `Created assessment "${titleEn}"`, `Pass: ${passingScore}%, Limit: ${attemptLimit}`);
    setModalOpen(false);
    setTitleEn('');
  };

  return (
    <PermissionGuard module="assessments" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.assessments.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.assessments.subtitle}</p>
          </div>
          {can('assessments', 'create') && (
            <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<ClipboardCheck className="h-4 w-4" />}>
              Create Assessment
            </Button>
          )}
        </div>

        <DataTable
          data={assessments}
          keyExtractor={(a) => a.id}
          searchPlaceholder="Search assessments..."
          searchFilter={(a, q) => a.title.en.toLowerCase().includes(q)}
          columns={[
            { key: 'title', header: 'Assessment', render: (a) => <span className="font-semibold">{a.title.en}</span> },
            { key: 'questions', header: 'Questions', render: (a) => a.questionIds.length },
            { key: 'time', header: 'Time Limit', render: (a) => `${a.timeLimitMinutes} min` },
            { key: 'pass', header: 'Passing Score', render: (a) => `${a.passingScore}%` },
            { key: 'attempts', header: 'Attempts', render: (a) => `${a.attemptLimit} max` },
            {
              key: 'random',
              header: 'Randomize',
              render: (a) => <Badge tone={a.randomizeQuestions ? 'info' : 'neutral'}>{a.randomizeQuestions ? 'Yes' : 'Fixed'}</Badge>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (a) => <Badge tone={a.published ? 'success' : 'neutral'}>{a.published ? 'Published' : 'Draft'}</Badge>,
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assessment">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Assessment Title" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Time Limit (min)" type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
              <Input label="Passing Score (%)" type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} />
              <Input label="Attempt Limit" type="number" value={attemptLimit} onChange={(e) => setAttemptLimit(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={randomize} onChange={(e) => setRandomize(e.target.checked)} />
              Randomize question order per attempt
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 10: QUESTION BANK ==================== */
export const QuestionBankPage: React.FC = () => {
  const { t } = useI18n();
  const { questions, setQuestions, categories, can, logAudit } = useAdmin();
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [qType, setQType] = useState<'multiple_choice' | 'true_false'>('multiple_choice');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [points, setPoints] = useState('10');

  const filtered = difficultyFilter === 'all' ? questions : questions.filter((q) => q.difficulty === difficultyFilter);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestions((prev) => [
      {
        id: `q-${Date.now()}`,
        categoryId: categories[0]?.id ?? 'cat-1',
        difficulty,
        type: qType,
        question: { en: questionText },
        options: qType === 'true_false' ? ['True', 'False'] : ['Option A (Correct)', 'Option B', 'Option C'],
        correctIndex: 0,
        points: Number(points) || 10,
      },
      ...prev,
    ]);
    logAudit('question_bank', 'Added question to Question Bank', questionText);
    setModalOpen(false);
    setQuestionText('');
  };

  return (
    <PermissionGuard module="question_bank" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.questionBank.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.questionBank.subtitle}</p>
          </div>
          <div className="flex gap-2">
            {can('question_bank', 'export') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  exportRowsToCsv(
                    'question-bank.csv',
                    ['ID', 'Type', 'Difficulty', 'Points', 'Question'],
                    filtered.map((q) => [q.id, q.type, q.difficulty, q.points, q.question.en]),
                  )
                }
              >
                Export Questions
              </Button>
            )}
            {can('question_bank', 'create') && (
              <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<Database className="h-4 w-4" />}>
                Add Question
              </Button>
            )}
          </div>
        </div>

        <DataTable
          data={filtered}
          keyExtractor={(q) => q.id}
          searchPlaceholder="Search question text..."
          searchFilter={(q, text) => q.question.en.toLowerCase().includes(text)}
          toolbarExtra={
            <Dropdown<DifficultyLevel | 'all'>
              size="sm"
              align="end"
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          }
          columns={[
            { key: 'question', header: 'Question', render: (q) => <span className="font-medium">{q.question.en}</span> },
            { key: 'type', header: 'Type', render: (q) => <Badge tone="neutral">{q.type.replace('_', ' ')}</Badge> },
            { key: 'diff', header: 'Difficulty', render: (q) => <Badge tone="primary">{q.difficulty}</Badge> },
            { key: 'points', header: 'Points', render: (q) => `${q.points} pts` },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (q) =>
                can('question_bank', 'delete') ? (
                  <button
                    type="button"
                    onClick={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                    className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#a5331f] cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null,
            },
          ]}
        />

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Question to Bank">
          <form onSubmit={handleAdd} className="space-y-3.5">
            <Input label="Question Prompt" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Type</label>
                <select value={qType} onChange={(e) => setQType(e.target.value as 'multiple_choice' | 'true_false')} className="w-full h-9 px-2 rounded-[10px] border border-[#ded8ca] text-[13px]">
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-medium mb-1">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)} className="w-full h-9 px-2 rounded-[10px] border border-[#ded8ca] text-[13px]">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <Input label="Points" type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Question</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 11: CERTIFICATE TEMPLATES ==================== */
export const CertificateTemplatesPage: React.FC = () => {
  const { t } = useI18n();
  const { templates, setTemplates, can, logAudit } = useAdmin();
  const [previewTpl, setPreviewTpl] = useState<CertificateTemplate | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [signatoryName, setSignatoryName] = useState('Sopheak Khoeun');
  const [signatoryTitle, setSignatoryTitle] = useState('Academic Director');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setTemplates((prev) => [
      ...prev,
      {
        id: `tpl-${Date.now()}`,
        name,
        accentColor: '#1c5b48',
        logoText: 'Camcode Academy',
        signatoryName,
        signatoryTitle,
        includeVerificationQr: true,
        pdfPaperSize: 'A4',
        fields: ['studentName', 'courseName', 'issueDate', 'certificateId', 'verificationUrl'],
        active: true,
      },
    ]);
    logAudit('templates', `Created certificate template "${name}"`, `Signatory: ${signatoryName}`);
    setCreateOpen(false);
    setName('');
  };

  return (
    <PermissionGuard module="templates" action="view">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif-display text-[28px] sm:text-[34px] font-normal text-[#141312] tracking-[-0.02em] leading-[1.15]">{t.pages.templates.title}</h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.templates.subtitle}
            </p>
          </div>
          {can('templates', 'create') && (
            <Button size="sm" onClick={() => setCreateOpen(true)} leftIcon={<LayoutTemplate className="h-4 w-4" />}>
              New Template
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {templates.map((tpl) => (
            <div key={tpl.id} className="card-note p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-[#141312]">{tpl.name}</h2>
                  <p className="text-[12.5px] text-[#6e6a62]">
                    {tpl.signatoryName} · {tpl.signatoryTitle} · {tpl.pdfPaperSize} PDF
                  </p>
                </div>
                <Badge tone={tpl.active ? 'success' : 'neutral'}>{tpl.active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tpl.fields.map((f) => (
                  <Badge key={f} tone="primary">{f}</Badge>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={() => setPreviewTpl(tpl)} leftIcon={<Eye className="h-4 w-4" />}>
                Preview Certificate Layout
              </Button>
            </div>
          ))}
        </div>

        <Modal open={Boolean(previewTpl)} onClose={() => setPreviewTpl(null)} title="Certificate Template Preview" maxWidthClass="max-w-2xl">
          {previewTpl && (
            <div className="border-4 border-double border-[#1c5b48]/40 rounded-2xl p-8 text-center space-y-4 bg-[#f6f3ec]">
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#1c5b48]">{previewTpl.logoText}</p>
              <h3 className="text-[24px] font-extrabold text-[#141312]">Alex Sovann</h3>
              <p className="text-[13.5px] text-[#4c4842]">has completed <strong>Complete Digital Marketing Course</strong></p>
              <div className="pt-4 border-t border-[#ded8ca] flex justify-between text-[12px] text-[#6e6a62]">
                <span>{previewTpl.signatoryName} — {previewTpl.signatoryTitle}</span>
                <span className="font-mono-tech">ID: CCL-2026-8492 · verify.camcodelearn.edu</span>
              </div>
            </div>
          )}
        </Modal>

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Certificate Template">
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Signatory Name" value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} required />
            <Input label="Signatory Title" value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} required />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create Template</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
};

