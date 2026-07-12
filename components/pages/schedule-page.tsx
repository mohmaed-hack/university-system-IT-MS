'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  User,
  MapPin,
  FileText,
  ChevronDown,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp, type Exam } from '@/lib/app-context'
import { cn } from '@/lib/utils'

type Tab = 1 | 2

export function SchedulePage() {
  const { data, isAdmin, updateExams, isSaving } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const examsThisSemester = data.exams.filter((e) => e.semester === activeTab)

  const handleDelete = (id: string) => {
    updateExams(data.exams.filter((e) => e.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-foreground">اختبارات السنة 2026-2027م</h2>
        <p className="text-muted-foreground text-sm">Exams Schedule — Academic Year 2026-2027</p>
      </div>

      {/* Header with tabs and add button */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-2">
          {([1, 2] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
              )}
            >
              {tab === 1 ? 'الترم الأول' : 'الترم الثاني'}
            </button>
          ))}
        </div>

        {/* Add button (admin only) */}
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-primary text-primary-foreground font-bold text-sm
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Plus className="size-4" />
            إضافة اختبار
          </button>
        )}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {examsThisSemester.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center py-24 gap-5 text-center"
          >
            <div className="flex items-center justify-center size-20 rounded-2xl bg-muted/60">
              <ClipboardList
                className="size-10 text-muted-foreground/40"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xl font-black text-foreground">لا يوجد حالياً</p>
              <p className="text-sm text-muted-foreground">
                {activeTab === 1
                  ? 'لم يتم نشر جدول اختبارات الترم الأول بعد'
                  : 'لم يتم نشر جدول اختبارات الترم الثاني بعد'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
          >
            {examsThisSemester.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors text-right"
                >
                  <ChevronDown
                    className={cn(
                      'size-5 text-muted-foreground transition-transform',
                      expandedId === exam.id && 'rotate-180'
                    )}
                  />
                  <div className="flex-1 text-right flex flex-col gap-1">
                    <h3 className="font-bold text-foreground">{exam.subjectAr}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {exam.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {exam.time}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedId === exam.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border px-4 py-4 bg-muted/20 space-y-3 text-sm"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex gap-2">
                          <BookOpen className="size-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">نوع الاختبار</span>
                            <span className="font-semibold text-foreground">{exam.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <MapPin className="size-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">القاعة</span>
                            <span className="font-semibold text-foreground">{exam.room}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <User className="size-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">الدكتور</span>
                            <span className="font-semibold text-foreground">{exam.instructor}</span>
                          </div>
                        </div>
                        {exam.syllabus && (
                          <div className="flex gap-2">
                            <FileText className="size-4 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">المقرر</span>
                              <span className="font-semibold text-foreground">{exam.syllabus}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {exam.syllabusUrl && (
                        <button
                          onClick={() => window.open(exam.syllabusUrl, '_blank')}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                            bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold"
                        >
                          <FileText className="size-4" />
                          تحميل المقرر
                        </button>
                      )}

                      {exam.notes && (
                        <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
                          <AlertCircle className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-900 dark:text-amber-200">{exam.notes}</p>
                        </div>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => setDeletingId(exam.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                            bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors text-xs font-bold"
                        >
                          <Trash2 className="size-4" />
                          حذف
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Exam Modal */}
      {showAddModal && (
        <AddExamModal
          semester={activeTab}
          onAdd={(exam) => {
            updateExams([...data.exams, exam])
            setShowAddModal(false)
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <Dialog open={true} onOpenChange={(o) => { if (!o) setDeletingId(null) }}>
          <DialogContent className="max-w-sm w-full p-6 rounded-2xl">
            <DialogTitle className="sr-only">تأكيد الحذف</DialogTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center size-12 rounded-full bg-red-500/10">
                <AlertCircle className="size-6 text-red-500" />
              </div>
              <div className="flex flex-col gap-2 text-center">
                <h3 className="font-bold text-foreground">حذف الاختبار؟</h3>
                <p className="text-sm text-muted-foreground">لا يمكن التراجع عن هذا الإجراء</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-semibold"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold"
                >
                  حذف
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// ── Add Exam Modal ─────────────────────────────────────────
function AddExamModal({
  semester,
  onAdd,
  onClose,
}: {
  semester: number
  onAdd: (exam: Exam) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    subjectAr: '',
    subjectEn: '',
    date: '',
    time: '',
    type: 'نهائي',
    room: '',
    instructor: '',
    syllabus: '',
    syllabusUrl: '',
    notes: '',
  })

  const handleSubmit = () => {
    if (!formData.subjectAr || !formData.date || !formData.time || !formData.type || !formData.room || !formData.instructor) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      subjectAr: formData.subjectAr,
      subjectEn: formData.subjectEn || undefined,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      room: formData.room,
      instructor: formData.instructor,
      syllabus: formData.syllabus || undefined,
      syllabusUrl: formData.syllabusUrl || undefined,
      notes: formData.notes || undefined,
      semester: semester as 1 | 2,
    }

    onAdd(newExam)
  }

  const inputs = [
    { label: 'اسم المادة *', key: 'subjectAr', type: 'text', placeholder: 'مثال: هندسة البرمجيات' },
    { label: 'Subject Name (EN)', key: 'subjectEn', type: 'text', placeholder: 'Optional' },
    { label: 'تاريخ الاختبار *', key: 'date', type: 'date' },
    { label: 'وقت الاختبار *', key: 'time', type: 'time' },
    { label: 'نوع الاختبار *', key: 'type', type: 'select', options: ['نهائي', 'نصفي', 'عملي', 'نظري'] },
    { label: 'القاعة *', key: 'room', type: 'text', placeholder: 'مثال: Hall 7' },
    { label: 'اسم الدكتور *', key: 'instructor', type: 'text', placeholder: 'د. محمد' },
    { label: 'المقرر أو الجزء المطلوب', key: 'syllabus', type: 'text', placeholder: 'مثال: Chapters 1-5' },
    { label: 'رابط تحميل المقرر', key: 'syllabusUrl', type: 'url', placeholder: 'https://...' },
    { label: 'ملاحظات', key: 'notes', type: 'textarea', placeholder: 'ملاحظات إضافية...' },
  ]

  return (
    <Dialog open={true} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg w-full p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-black text-foreground">إضافة اختبار جديد</DialogTitle>

        <div className="flex flex-col gap-4 pt-4">
          {inputs.map((input) => (
            <div key={input.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">{input.label}</label>
              {input.type === 'select' ? (
                <select
                  value={formData[input.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {input.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : input.type === 'textarea' ? (
                <textarea
                  value={formData[input.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                  placeholder={input.placeholder}
                  className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24"
                />
              ) : (
                <input
                  type={input.type}
                  value={formData[input.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                  placeholder={input.placeholder}
                  className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-bold"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors font-bold"
          >
            إضافة
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
