'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useApp, type Exam } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface ManageExamsModalProps {
  semester: 1 | 2
  onClose: () => void
}

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground',
  'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
  'transition-all duration-200',
)

const selectClass = cn(inputClass, 'cursor-pointer')

export function ManageExamsModal({ semester, onClose }: ManageExamsModalProps) {
  const { data, updateExams, isSaving } = useApp()
  const [exams, setExams] = useState<Exam[]>(
    data.exams.filter(e => e.semester === semester)
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleAdd = () => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      subjectAr: '',
      subjectEn: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 ص',
      type: 'نهائي',
      room: '',
      instructor: '',
      syllabus: '',
      syllabusUrl: '',
      notes: '',
      semester,
    }
    setExams([...exams, newExam])
  }

  const handleUpdate = (id: string, updates: Partial<Exam>) => {
    setExams(exams.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const handleDelete = (id: string) => {
    setExams(exams.filter(e => e.id !== id))
  }

  const handleSave = async () => {
    // Merge with exams from other semester
    const otherSemesterExams = data.exams.filter(e => e.semester !== semester)
    updateExams([...exams, ...otherSemesterExams])
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold">
          إدارة اختبارات الترم {semester}
        </DialogTitle>

        <div className="space-y-6 py-4">
          {/* Exams List */}
          <AnimatePresence mode="popLayout">
            {exams.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-3 text-center"
              >
                <p className="text-muted-foreground text-sm">لا توجد اختبارات بعد</p>
                <button
                  onClick={handleAdd}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  إضافة اختبار
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {exams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card border border-border rounded-lg p-4 space-y-3"
                  >
                    {editingId === exam.id ? (
                      <ExamForm
                        exam={exam}
                        subjects={[...data.semester1, ...data.semester2]}
                        instructors={data.instructors}
                        onSave={(updates) => {
                          handleUpdate(exam.id, updates)
                          setEditingId(null)
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <ExamDisplay
                        exam={exam}
                        onEdit={() => setEditingId(exam.id)}
                        onDelete={() => handleDelete(exam.id)}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Add New Exam Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className="w-full py-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  إضافة اختبار جديد
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-600 font-medium">تم الحفظ بنجاح!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save Button */}
          {exams.length > 0 && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ExamDisplayProps {
  exam: Exam
  onEdit: () => void
  onDelete: () => void
}

function ExamDisplay({ exam, onEdit, onDelete }: ExamDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{exam.subjectAr}</h4>
          <p className="text-sm text-muted-foreground">{exam.subjectEn}</p>
          <div className="flex gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
            <span>📅 {exam.date}</span>
            <span>⏰ {exam.time}</span>
            <span>📝 {exam.type}</span>
            <span>📍 {exam.room}</span>
            {exam.instructor && <span>👨‍🏫 {exam.instructor}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="تعديل"
          >
            <Pencil className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
            title="حذف"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ExamFormProps {
  exam: Exam
  subjects: any[]
  instructors: any[]
  onSave: (updates: Partial<Exam>) => void
  onCancel: () => void
}

function ExamForm({
  exam,
  subjects,
  instructors,
  onSave,
  onCancel,
}: ExamFormProps) {
  const [form, setForm] = useState({
    subjectAr: exam.subjectAr,
    subjectEn: exam.subjectEn,
    date: exam.date,
    time: exam.time,
    type: exam.type,
    room: exam.room,
    instructor: exam.instructor,
    syllabus: exam.syllabus || '',
    syllabusUrl: exam.syllabusUrl || '',
    notes: exam.notes || '',
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">المادة (عربي)</label>
          <input
            type="text"
            value={form.subjectAr}
            onChange={(e) => setForm({ ...form, subjectAr: e.target.value })}
            placeholder="اسم المادة بالعربية"
            className={inputClass}
            list="subjects-ar"
          />
          <datalist id="subjects-ar">
            {subjects.map(s => (
              <option key={s.id} value={s.nameAr} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">المادة (English)</label>
          <input
            type="text"
            value={form.subjectEn}
            onChange={(e) => setForm({ ...form, subjectEn: e.target.value })}
            placeholder="Course name in English"
            className={cn(inputClass, 'text-left')}
            dir="ltr"
            list="subjects-en"
          />
          <datalist id="subjects-en">
            {subjects.map(s => (
              <option key={s.id} value={s.nameEn} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">التاريخ</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">الوقت</label>
          <input
            type="text"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            placeholder="10:00 ص"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">نوع الاختبار</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={selectClass}
          >
            <option>نهائي</option>
            <option>نصفي</option>
            <option>نظري</option>
            <option>عملي</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">القاعة</label>
          <input
            type="text"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            placeholder="مثال: Hall 7"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">المحاضر</label>
          <input
            type="text"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            placeholder="اسم المحاضر"
            className={inputClass}
            list="instructors-list"
          />
          <datalist id="instructors-list">
            {instructors.map(i => (
              <option key={i.id} value={i.nameAr} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">المقرر المطلوب</label>
        <input
          type="text"
          value={form.syllabus}
          onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
          placeholder="الفصول المطلوبة أو الأجزاء"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">رابط تحميل المقرر</label>
        <input
          type="url"
          value={form.syllabusUrl}
          onChange={(e) => setForm({ ...form, syllabusUrl: e.target.value })}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">ملاحظات</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="أية ملاحظات إضافية"
          className={cn(inputClass, 'resize-none')}
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"
        >
          حفظ
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground font-medium text-sm hover:bg-muted/80"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}
