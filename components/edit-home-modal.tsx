'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Megaphone,
  Newspaper,
  Link2,
  CheckCircle2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useApp,
  type HomeContent,
  type Announcement,
  type SiteSettings,
} from '@/lib/app-context'
import { cn } from '@/lib/utils'

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground',
  'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
  'transition-all duration-200',
)

function today(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Admin-only modal to edit the home page content: hero texts, the weekly
 * timetable download link, and the list of announcements / news items.
 * Saving commits through the existing app-context save mechanism.
 */
export function EditHomeModal({ onClose }: { onClose: () => void }) {
  const { data, updateHomeContent, updateSettings, isSaving } = useApp()

  const [form, setForm] = useState<HomeContent>({
    heroTagline: data.homeContent.heroTagline,
    heroTitle: data.homeContent.heroTitle,
    heroSubtitle: data.homeContent.heroSubtitle,
    heroDescription: data.homeContent.heroDescription,
    announcements: [...data.homeContent.announcements],
  })
  const [timetableUrl, setTimetableUrl] = useState<string>(
    data.settings.timetableDownloadUrl || '',
  )
  const [saved, setSaved] = useState(false)

  const setField = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const addAnnouncement = (type: Announcement['type']) => {
    const item: Announcement = {
      id: `ann-${Date.now()}`,
      title: '',
      body: '',
      date: today(),
      link: '',
      type,
    }
    setField('announcements', [item, ...form.announcements])
  }

  const updateAnnouncement = (id: string, patch: Partial<Announcement>) =>
    setField(
      'announcements',
      form.announcements.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    )

  const removeAnnouncement = (id: string) =>
    setField('announcements', form.announcements.filter((a) => a.id !== id))

  const handleSave = () => {
    // Clean up empty announcements (no title and no body).
    const cleaned: HomeContent = {
      ...form,
      heroTagline: form.heroTagline.trim(),
      heroTitle: form.heroTitle.trim(),
      heroSubtitle: form.heroSubtitle.trim(),
      heroDescription: form.heroDescription.trim(),
      announcements: form.announcements
        .filter((a) => a.title.trim() || (a.body || '').trim())
        .map((a) => ({
          ...a,
          title: a.title.trim(),
          body: (a.body || '').trim() || undefined,
          link: (a.link || '').trim() || undefined,
        })),
    }
    const nextSettings: SiteSettings = {
      ...data.settings,
      timetableDownloadUrl: timetableUrl.trim() || undefined,
    }
    updateHomeContent(cleaned)
    updateSettings(nextSettings)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 900)
  }

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg w-full p-0 rounded-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0">
        {/* Header */}
        <div className="flex flex-col gap-1 p-5 border-b border-border bg-gradient-to-br from-primary/10 to-transparent">
          <DialogTitle className="text-lg font-black text-foreground">تعديل الصفحة الرئيسية</DialogTitle>
          <p className="text-xs text-muted-foreground">
            التحكم في العناوين والنصوص والإعلانات والأخبار والروابط
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-5 overflow-y-auto">
          {/* Hero fields */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">القسم الرئيسي (Hero)</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">النص العلوي (العام الأكاديمي)</label>
              <input
                className={inputClass}
                value={form.heroTagline}
                onChange={(e) => setField('heroTagline', e.target.value)}
                placeholder="العام الأكاديمي ٢٠٢٦ - ٢٠٢٧م"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">العنوان الرئيسي</label>
                <input
                  className={inputClass}
                  value={form.heroTitle}
                  onChange={(e) => setField('heroTitle', e.target.value)}
                  placeholder="كل ما تحتاجه"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">العنوان الفرعي</label>
                <input
                  className={inputClass}
                  value={form.heroSubtitle}
                  onChange={(e) => setField('heroSubtitle', e.target.value)}
                  placeholder="في مكان واحد"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">الوصف</label>
              <textarea
                rows={3}
                className={cn(inputClass, 'resize-none')}
                value={form.heroDescription}
                onChange={(e) => setField('heroDescription', e.target.value)}
                placeholder="استعرض الخطط الدراسية، الجداول، المواد..."
              />
            </div>
          </section>

          {/* Timetable download link */}
          <section className="flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Link2 className="size-4 text-primary" />
              رابط تحميل جدول المحاضرات
            </h3>
            <input
              dir="ltr"
              className={cn(inputClass, 'font-mono text-left')}
              value={timetableUrl}
              onChange={(e) => setTimetableUrl(e.target.value)}
              placeholder="https://..."
            />
          </section>

          {/* Announcements / news */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">الإعلانات والأخبار</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => addAnnouncement('إعلان')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary
                    text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  <Megaphone className="size-3.5" />
                  إعلان
                </button>
                <button
                  onClick={() => addAnnouncement('خبر')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 text-gold
                    text-xs font-bold hover:bg-gold/20 transition-colors"
                >
                  <Newspaper className="size-3.5" />
                  خبر
                </button>
              </div>
            </div>

            {form.announcements.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4 rounded-lg border border-dashed border-border">
                لا توجد إعلانات أو أخبار — أضف واحداً بالأزرار أعلاه
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {form.announcements.map((a) => (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold',
                            a.type === 'إعلان'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-gold/10 text-gold',
                          )}
                        >
                          {a.type === 'إعلان' ? <Megaphone className="size-3" /> : <Newspaper className="size-3" />}
                          {a.type}
                        </span>
                        <button
                          onClick={() => removeAnnouncement(a.id)}
                          className="flex items-center justify-center size-7 rounded-lg bg-destructive/10 text-destructive
                            hover:bg-destructive/20 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <input
                        className={inputClass}
                        value={a.title}
                        onChange={(e) => updateAnnouncement(a.id, { title: e.target.value })}
                        placeholder="العنوان"
                      />
                      <textarea
                        rows={2}
                        className={cn(inputClass, 'resize-none')}
                        value={a.body || ''}
                        onChange={(e) => updateAnnouncement(a.id, { body: e.target.value })}
                        placeholder="التفاصيل (اختياري)"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="date"
                          className={inputClass}
                          value={a.date}
                          onChange={(e) => updateAnnouncement(a.id, { date: e.target.value })}
                        />
                        <input
                          dir="ltr"
                          className={cn(inputClass, 'font-mono text-left')}
                          value={a.link || ''}
                          onChange={(e) => updateAnnouncement(a.id, { link: e.target.value })}
                          placeholder="رابط (اختياري)"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-border">
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-emerald-500 text-sm font-semibold"
              >
                <CheckCircle2 className="size-4" />
                تم الحفظ
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-medium text-sm
              hover:bg-muted/50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || saved}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
