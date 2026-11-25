import React, { useState } from 'react';
import { CheckCircle2, Globe, Languages, LayoutTemplate, Star, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { useAdmin } from '@/context/AdminContext';
import { useI18n } from '@/i18n/I18nContext';

/* ==================== SCREEN 24: HOMEPAGE, FEATURED, BANNERS, TESTIMONIALS ==================== */
export const HomepageContentPage: React.FC<{ section?: 'homepage' | 'featured_courses' | 'featured_videos' | 'banners' | 'testimonials' }> = ({
  section = 'homepage',
}) => {
  const { t } = useI18n();
  const { homepage, setHomepage, courses, setCourses, videos, setVideos, testimonials, setTestimonials, can, logAudit } = useAdmin();
  const [savedNotice, setSavedNotice] = useState(false);

  const saveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    logAudit('marketing', 'Updated homepage hero & banner configuration', `Status: ${homepage.publishedStatus}`);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <PermissionGuard module="marketing" action="view">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
            {t.pages.marketing[section]}
          </h1>
          <p className="text-[14.5px] text-[#475569] mt-1">
            {t.pages.marketing.subtitle}
          </p>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-[8px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[13px] font-medium">
            Marketing configuration saved and synced to Public Web API.
          </div>
        )}

        {(section === 'homepage' || section === 'banners') && (
          <form onSubmit={saveHomepage} className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-4">
            <h2 className="text-[16px] font-semibold flex items-center gap-2">
              <LayoutTemplate className="h-4.5 w-4.5 text-[#2563EB]" />
              Hero & Promotional Banner
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Hero Headline (EN)"
                value={homepage.heroHeadline.en}
                onChange={(e) =>
                  setHomepage((p) => ({ ...p, heroHeadline: { ...p.heroHeadline, en: e.target.value } }))
                }
              />
              <Input
                label="Hero Headline (KM)"
                value={homepage.heroHeadline.km ?? ''}
                onChange={(e) =>
                  setHomepage((p) => ({ ...p, heroHeadline: { ...p.heroHeadline, km: e.target.value } }))
                }
              />
            </div>
            <Input
              label="Promotional Banner Text (EN)"
              value={homepage.bannerText.en}
              onChange={(e) =>
                setHomepage((p) => ({ ...p, bannerText: { ...p.bannerText, en: e.target.value } }))
              }
            />
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={homepage.bannerActive}
                  onChange={(e) => setHomepage((p) => ({ ...p, bannerActive: e.target.checked }))}
                />
                Show top promotional banner on Port 3000
              </label>
              {can('marketing', 'edit') && <Button type="submit">Publish Changes</Button>}
            </div>
          </form>
        )}

        {(section === 'featured_courses' || section === 'homepage') && (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-3">
            <h2 className="text-[16px] font-semibold">Featured Courses on Homepage</h2>
            <div className="divide-y divide-[#E5E7EB]">
              {courses.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between gap-3 text-[13px]">
                  <span className="font-medium text-[#1F2937]">{c.title.en}</span>
                  <Button
                    size="sm"
                    variant={c.featured ? 'primary' : 'outline'}
                    disabled={!can('marketing', 'edit')}
                    onClick={() =>
                      setCourses((prev) => prev.map((x) => (x.id === c.id ? { ...x, featured: !x.featured } : x)))
                    }
                  >
                    {c.featured ? 'Featured ★' : 'Feature'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(section === 'featured_videos' || section === 'homepage') && (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-3">
            <h2 className="text-[16px] font-semibold">Featured Training Videos</h2>
            <div className="divide-y divide-[#E5E7EB]">
              {videos.map((v) => (
                <div key={v.id} className="py-2.5 flex items-center justify-between gap-3 text-[13px]">
                  <span className="font-medium text-[#1F2937]">{v.title.en}</span>
                  <Button
                    size="sm"
                    variant={v.featured ? 'primary' : 'outline'}
                    disabled={!can('marketing', 'edit')}
                    onClick={() =>
                      setVideos((prev) => prev.map((x) => (x.id === v.id ? { ...x, featured: !x.featured } : x)))
                    }
                  >
                    {v.featured ? 'Featured ★' : 'Feature'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(section === 'testimonials' || section === 'homepage') && (
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-3">
            <h2 className="text-[16px] font-semibold flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-[#D97706]" />
              Published Testimonials
            </h2>
            {testimonials.map((tst) => (
              <div key={tst.id} className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between gap-3 text-[13px]">
                <div>
                  <p className="font-semibold">{tst.authorName} · {tst.role}</p>
                  <p className="text-[#4B5563]">"{tst.quote.en}"</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!can('marketing', 'edit')}
                  onClick={() =>
                    setTestimonials((prev) =>
                      prev.map((x) => (x.id === tst.id ? { ...x, published: !x.published } : x)),
                    )
                  }
                >
                  {tst.published ? 'Published' : 'Hidden'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 25: SEO MANAGEMENT ==================== */
export const SeoManagementPage: React.FC = () => {
  const { t } = useI18n();
  const { courses, setCourses, can, logAudit } = useAdmin();
  const [sitemapEnabled, setSitemapEnabled] = useState(true);
  const [robotsIndex, setRobotsIndex] = useState(true);

  return (
    <PermissionGuard module="seo" action="view">
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">{t.pages.seo.title}</h1>
          <p className="text-[14.5px] text-[#475569] mt-1">{t.pages.seo.subtitle}</p>
        </div>

        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[13px]">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={sitemapEnabled} onChange={(e) => setSitemapEnabled(e.target.checked)} />
              Auto-generate /sitemap.xml
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={robotsIndex} onChange={(e) => setRobotsIndex(e.target.checked)} />
              Allow search indexing (index, follow)
            </label>
          </div>
          <Badge tone="success"><Globe className="h-3.5 w-3.5" /> Canonical: https://camcodelearn.edu</Badge>
        </div>

        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[14px] flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-[#2563EB]" />
                  /{c.slug}
                </span>
                {can('seo', 'edit') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => logAudit('seo', `Saved SEO metadata for ${c.slug}`, c.seoTitle)}
                  >
                    Save SEO
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Meta Title"
                  value={c.seoTitle}
                  onChange={(e) =>
                    setCourses((prev) => prev.map((x) => (x.id === c.id ? { ...x, seoTitle: e.target.value } : x)))
                  }
                />
                <Input
                  label="Meta Description"
                  value={c.seoDescription}
                  onChange={(e) =>
                    setCourses((prev) => prev.map((x) => (x.id === c.id ? { ...x, seoDescription: e.target.value } : x)))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PermissionGuard>
  );
};

/* ==================== SCREEN 26: CONTENT TRANSLATION MANAGEMENT (EN/KM) ==================== */
export const TranslationsPage: React.FC = () => {
  const { t } = useI18n();
  const { courses, setCourses, categories, setCategories, can, logAudit } = useAdmin();
  const [filterMissing, setFilterMissing] = useState(false);

  const courseItems = filterMissing ? courses.filter((c) => !c.title.km?.trim()) : courses;

  return (
    <PermissionGuard module="translations" action="view">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <Languages className="h-5 w-5 text-[#2563EB]" />
              {t.pages.translations.title}
            </h1>
            <p className="text-[14.5px] text-[#475569] mt-1">
              {t.pages.translations.subtitle}
            </p>
          </div>
          <label className="flex items-center gap-2 text-[13px] font-medium bg-white px-3 py-2 rounded-[8px] border border-[#E5E7EB] cursor-pointer">
            <input type="checkbox" checked={filterMissing} onChange={(e) => setFilterMissing(e.target.checked)} />
            Show missing Khmer translations only
          </label>
        </div>

        <div className="space-y-3">
          {courseItems.map((c) => {
            const hasKm = Boolean(c.title.km && c.title.km.trim().length > 0);
            return (
              <div key={c.id} className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[14px] text-[#1F2937]">{c.title.en}</span>
                  <Badge tone={hasKm ? 'success' : 'warning'}>
                    {hasKm ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Translated (EN + KM)
                      </>
                    ) : (
                      'Missing Khmer Translation'
                    )}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="English Title (EN)"
                    value={c.title.en}
                    onChange={(e) =>
                      setCourses((prev) =>
                        prev.map((x) => (x.id === c.id ? { ...x, title: { ...x.title, en: e.target.value } } : x)),
                      )
                    }
                  />
                  <Input
                    label="Khmer Title (KM)"
                    placeholder="បញ្ចូលចំណងជើងជាភាសាខ្មែរ..."
                    value={c.title.km ?? ''}
                    onChange={(e) =>
                      setCourses((prev) =>
                        prev.map((x) => (x.id === c.id ? { ...x, title: { ...x.title, km: e.target.value } } : x)),
                      )
                    }
                  />
                </div>
                {can('translations', 'edit') && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => logAudit('translations', `Updated EN/KM translation for "${c.title.en}"`, c.title.km || 'Empty KM')}
                    >
                      Save Translation
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 space-y-3">
            <h2 className="text-[15px] font-semibold">Category Translations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                  <div className="flex justify-between text-[12px]">
                    <span className="font-semibold">{cat.name.en}</span>
                    <Badge tone={cat.name.km ? 'success' : 'warning'}>{cat.name.km ? 'KM Ready' : 'Missing KM'}</Badge>
                  </div>
                  <Input
                    value={cat.name.km ?? ''}
                    onChange={(e) =>
                      setCategories((prev) =>
                        prev.map((x) => (x.id === cat.id ? { ...x, name: { ...x.name, km: e.target.value } } : x)),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};

