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
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useApp, type Subject, type Instructor } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface ManageSubjectsModalProps {
  semester: 1 | 2
  onClose: () => void
}

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground',
  'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
  'transition-all duration-200',
)

const selectClass = cn(inputClass, 'cursor-pointer')

export function ManageSubjectsModal({ semester, onClose }: ManageSubjectsModalProps) {
  const { data, updateSemester1, updateSemester2, isSaving } = useApp()
  const [subjects, setSubjects] = useState<Subject[]>(
    semester === 1 ? [...data.semester1] : [...data.semester2]
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleAdd = () => {
    const newSubject: Subject = {
      id: `s${semester}-${Date.now()}`,
      nameEn: '',
      nameAr: '',
      image: '/images/subjects/placeholder.png',
      side: semester === 1 ? 'نظري + عملي' : 'نظري فقط',
      code: '',
      hours: 3,
      prerequisites: '',
    }
    setSubjects([...subjects, newSubject])
  }

  const handleUpdate = (id: string, updates: Partial<Subject>) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const handleDelete = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  const handleSave = async () => {
    if (semester === 1) {
      updateSemester1(subjects)
    } else {
      updateSemester2(subjects)
    }
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
          إدارة مواد الترم {semester}
        </DialogTitle>

        <div className="space-y-6 py-4">
          {/* Subjects List */}
          <AnimatePresence mode="popLayout">
            {subjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-3 text-center"
              >
                <p className="text-muted-foreground text-sm">لا توجد مواد بعد</p>
                <button
                  onClick={handleAdd}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  إضافة مادة
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card border border-border rounded-lg p-4 space-y-3"
                  >
                    {editingId === subject.id ? (
                      <SubjectForm
                        subject={subject}
                        semester={semester}
                        instructors={data.instructors}
                        onSave={(updates) => {
                          handleUpdate(subject.id, updates)
                          setEditingId(null)
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <SubjectDisplay
                        subject={subject}
                        onEdit={() => setEditingId(subject.id)}
                        onDelete={() => handleDelete(subject.id)}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Add New Subject Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className="w-full py-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  إضافة مادة جديدة
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
          {subjects.length > 0 && (
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

interface SubjectDisplayProps {
  subject: Subject
  onEdit: () => void
  onDelete: () => void
}

function SubjectDisplay({ subject, onEdit, onDelete }: SubjectDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{subject.nameAr}</h4>
          <p className="text-sm text-muted-foreground">{subject.nameEn}</p>
          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
            {subject.code && <span>📌 {subject.code}</span>}
            {subject.hours && <span>⏱️ {subject.hours} ساعات</span>}
            <span>📂 {subject.side}</span>
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

interface SubjectFormProps {
  subject: Subject
  semester: 1 | 2
  instructors: Instructor[]
  onSave: (updates: Partial<Subject>) => void
  onCancel: () => void
}

function SubjectForm({
  subject,
  semester,
  instructors,
  onSave,
  onCancel,
}: SubjectFormProps) {
  const [form, setForm] = useState({
    nameAr: subject.nameAr,
    nameEn: subject.nameEn,
    image: subject.image,
    code: subject.code || '',
    hours: subject.hours || 3,
    prerequisites: subject.prerequisites || '',
    side: subject.side,
    instructorTheory: subject.instructorTheory || { nameAr: '' },
    instructorPractical: subject.instructorPractical || { nameAr: '' },
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">الاسم بالعربية</label>
          <input
            type="text"
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            placeholder="أدخل الاسم بالعربية"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">الاسم بالإنجليزية</label>
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            placeholder="Enter name in English"
            className={inputClass}
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">الكود</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="مثال: IT-401"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">عدد الساعات</label>
          <input
            type="number"
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: parseInt(e.target.value) || 3 })}
            className={inputClass}
            min="1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">النوع</label>
          <select
            value={form.side}
            onChange={(e) => setForm({ ...form, side: e.target.value as any })}
            className={selectClass}
          >
            <option>نظري فقط</option>
            <option>نظري + عملي</option>
            <option>قريباً</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">رابط الصورة</label>
        <input
          type="url"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="/images/subjects/..."
          className={inputClass}
        />
      </div>

      {form.side !== 'قريباً' && (
        <>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">المحاضر النظري</label>
            <input
              type="text"
              value={form.instructorTheory.nameAr}
              onChange={(e) => setForm({
                ...form,
                instructorTheory: { ...form.instructorTheory, nameAr: e.target.value }
              })}
              placeholder="أدخل اسم المحاضر"
              className={inputClass}
              list="instructors"
            />
          </div>

          {form.side === 'نظري + عملي' && (
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">المحاضر العملي</label>
              <input
                type="text"
                value={form.instructorPractical.nameAr}
                onChange={(e) => setForm({
                  ...form,
                  instructorPractical: { ...form.instructorPractical, nameAr: e.target.value }
                })}
                placeholder="أدخل اسم المحاضر"
                className={inputClass}
                list="instructors"
              />
            </div>
          )}

          <datalist id="instructors">
            {instructors.map(ins => (
              <option key={ins.id} value={ins.nameAr} />
            ))}
          </datalist>
        </>
      )}

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">المتطلبات السابقة</label>
        <input
          type="text"
          value={form.prerequisites}
          onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
          placeholder="مثال: IT-301, IT-302"
          className={inputClass}
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
