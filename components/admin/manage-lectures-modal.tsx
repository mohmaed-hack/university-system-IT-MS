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
  X,
  AlertCircle,
  CheckCircle2,
  GripVertical,
} from 'lucide-react'
import { useApp, type SubjectMaterial, type Lecture } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface ManageLecturesModalProps {
  subject: SubjectMaterial
  onClose: () => void
  lectureType: 'theory' | 'practical'
}

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground',
  'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
  'transition-all duration-200',
)

export function ManageLecturesModal({
  subject,
  onClose,
  lectureType,
}: ManageLecturesModalProps) {
  const { data, updateSubjectMaterials, isSaving } = useApp()
  const [lectures, setLectures] = useState<Lecture[]>(
    lectureType === 'theory' ? [...subject.lecturesTheory] : [...subject.lecturesPractical]
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleAdd = () => {
    const newLecture: Lecture = {
      id: `lec-${Date.now()}`,
      number: lectures.length + 1,
      title: '',
      date: new Date().toISOString().split('T')[0],
      downloadUrl: '',
      videoUrl: '',
      type: lectureType,
    }
    setLectures([...lectures, newLecture])
  }

  const handleUpdate = (id: string, updates: Partial<Lecture>) => {
    setLectures(lectures.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const handleDelete = (id: string) => {
    setLectures(lectures.filter(l => l.id !== id))
  }

  const handleSave = async () => {
    const updated = {
      ...subject,
      [lectureType === 'theory' ? 'lecturesTheory' : 'lecturesPractical']: lectures,
    }

    const materials = data.subjectMaterials.map(m =>
      m.id === subject.id ? updated : m
    )

    updateSubjectMaterials(materials)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  const typeLabel = lectureType === 'theory' ? 'محاضرات نظرية' : 'محاضرات عملية'

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold">
          إدارة {typeLabel} - {subject.nameAr}
        </DialogTitle>

        <div className="space-y-6 py-4">
          {/* Lectures List */}
          <AnimatePresence mode="popLayout">
            {lectures.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-3 text-center"
              >
                <p className="text-muted-foreground text-sm">لا توجد محاضرات بعد</p>
                <button
                  onClick={handleAdd}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  إضافة محاضرة
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {lectures.map((lecture, index) => (
                  <motion.div
                    key={lecture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card border border-border rounded-lg p-4 space-y-3"
                  >
                    {editingId === lecture.id ? (
                      <LectureForm
                        lecture={lecture}
                        onSave={(updates) => {
                          handleUpdate(lecture.id, updates)
                          setEditingId(null)
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <LectureDisplay
                        lecture={lecture}
                        index={index}
                        onEdit={() => setEditingId(lecture.id)}
                        onDelete={() => handleDelete(lecture.id)}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Add New Lecture Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className="w-full py-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  إضافة محاضرة جديدة
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
          {lectures.length > 0 && (
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

interface LectureDisplayProps {
  lecture: Lecture
  index: number
  onEdit: () => void
  onDelete: () => void
}

function LectureDisplay({
  lecture,
  index,
  onEdit,
  onDelete,
}: LectureDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">المحاضرة {index + 1}: {lecture.title || 'بدون عنوان'}</h4>
          <p className="text-sm text-muted-foreground mt-1">التاريخ: {lecture.date}</p>
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
      {lecture.downloadUrl && (
        <p className="text-xs text-muted-foreground truncate">
          📎 ملف: <span className="text-blue-500 underline cursor-pointer">{lecture.downloadUrl}</span>
        </p>
      )}
      {lecture.videoUrl && (
        <p className="text-xs text-muted-foreground truncate">
          🎬 فيديو: <span className="text-blue-500 underline cursor-pointer">{lecture.videoUrl}</span>
        </p>
      )}
    </div>
  )
}

interface LectureFormProps {
  lecture: Lecture
  onSave: (updates: Partial<Lecture>) => void
  onCancel: () => void
}

function LectureForm({ lecture, onSave, onCancel }: LectureFormProps) {
  const [form, setForm] = useState({
    number: lecture.number,
    title: lecture.title,
    date: lecture.date,
    downloadUrl: lecture.downloadUrl || '',
    videoUrl: lecture.videoUrl || '',
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">رقم المحاضرة</label>
          <input
            type="number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: parseInt(e.target.value) || 0 })}
            className={inputClass}
            min="1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">التاريخ</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">عنوان المحاضرة</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="أدخل عنوان المحاضرة"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">رابط الملف (PDF/Docs)</label>
        <input
          type="url"
          value={form.downloadUrl}
          onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
          placeholder="https://example.com/file.pdf"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-foreground block mb-1">رابط الفيديو</label>
        <input
          type="url"
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
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
