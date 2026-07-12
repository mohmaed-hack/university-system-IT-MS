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
import { useApp, type TimetableDay, type TimetableLecture } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface ManageTimetableModalProps {
  onClose: () => void
}

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground',
  'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
  'transition-all duration-200',
)

const selectClass = cn(inputClass, 'cursor-pointer')

export function ManageTimetableModal({ onClose }: ManageTimetableModalProps) {
  const { data, updateTimetable, isSaving } = useApp()
  const [timetable, setTimetable] = useState<TimetableDay[]>([...data.timetable])
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleAddLecture = (dayId: string) => {
    setTimetable(timetable.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          lectures: [
            ...day.lectures,
            {
              id: `ttl-${Date.now()}`,
              time: '8:00 - 11:00',
              nameEn: '',
              nameAr: '',
              type: 'نظري' as const,
              instructor: '',
              room: '',
            }
          ]
        }
      }
      return day
    }))
  }

  const handleUpdateLecture = (dayId: string, lectureId: string, updates: Partial<TimetableLecture>) => {
    setTimetable(timetable.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          lectures: day.lectures.map(l => l.id === lectureId ? { ...l, ...updates } : l)
        }
      }
      return day
    }))
  }

  const handleDeleteLecture = (dayId: string, lectureId: string) => {
    setTimetable(timetable.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          lectures: day.lectures.filter(l => l.id !== lectureId)
        }
      }
      return day
    }))
  }

  const handleToggleHoliday = (dayId: string) => {
    setTimetable(timetable.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          isHoliday: !day.isHoliday,
          lectures: !day.isHoliday ? [] : day.lectures
        }
      }
      return day
    }))
  }

  const handleSave = async () => {
    updateTimetable(timetable)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-bold">
          إدارة الجدول الدراسي الأسبوعي
        </DialogTitle>

        <div className="space-y-6 py-4">
          {/* Timetable Days */}
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {timetable.map((day) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card border border-border rounded-lg p-4 space-y-3"
                >
                  <DayHeader
                    day={day}
                    onToggleHoliday={() => handleToggleHoliday(day.id)}
                  />

                  {!day.isHoliday && (
                    <>
                      {/* Lectures List */}
                      <div className="space-y-2 ml-4">
                        {day.lectures.map((lecture, idx) => (
                          <motion.div
                            key={lecture.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                          >
                            {editingLectureId === lecture.id ? (
                              <LectureForm
                                lecture={lecture}
                                onSave={(updates) => {
                                  handleUpdateLecture(day.id, lecture.id, updates)
                                  setEditingLectureId(null)
                                }}
                                onCancel={() => setEditingLectureId(null)}
                              />
                            ) : (
                              <LectureDisplay
                                lecture={lecture}
                                index={idx}
                                onEdit={() => setEditingLectureId(lecture.id)}
                                onDelete={() => handleDeleteLecture(day.id, lecture.id)}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Add Lecture Button */}
                      <button
                        onClick={() => handleAddLecture(day.id)}
                        className="ml-4 text-sm flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
                      >
                        <Plus className="w-3 h-3" />
                        إضافة محاضرة
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
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
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DayHeaderProps {
  day: TimetableDay
  onToggleHoliday: () => void
}

function DayHeader({ day, onToggleHoliday }: DayHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-foreground">{day.day}</h4>
        <p className="text-xs text-muted-foreground">{day.dayEn}</p>
      </div>
      <button
        onClick={onToggleHoliday}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          day.isHoliday
            ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30'
            : 'bg-green-500/10 text-green-600 border border-green-500/30'
        )}
      >
        {day.isHoliday ? '🚫 إجازة' : '✅ يوم دراسي'}
      </button>
    </div>
  )
}

interface LectureDisplayProps {
  lecture: TimetableLecture
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
    <div className="flex items-start justify-between gap-2 p-3 bg-muted/30 rounded-lg">
      <div className="flex-1 text-sm">
        <p className="font-medium text-foreground">{lecture.nameAr}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{lecture.nameEn}</p>
        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
          <span>⏰ {lecture.time}</span>
          <span>📍 {lecture.room}</span>
          <span>👨‍🏫 {lecture.instructor}</span>
          <span className={cn(
            'px-1.5 py-0.5 rounded',
            lecture.type === 'نظري'
              ? 'bg-blue-500/10 text-blue-600'
              : 'bg-purple-500/10 text-purple-600'
          )}>
            {lecture.type}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded">
          <Pencil className="w-3.5 h-3.5 text-foreground" />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 rounded">
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>
    </div>
  )
}

interface LectureFormProps {
  lecture: TimetableLecture
  onSave: (updates: Partial<TimetableLecture>) => void
  onCancel: () => void
}

function LectureForm({ lecture, onSave, onCancel }: LectureFormProps) {
  const [form, setForm] = useState({
    time: lecture.time,
    nameAr: lecture.nameAr,
    nameEn: lecture.nameEn,
    type: lecture.type,
    instructor: lecture.instructor,
    room: lecture.room,
  })

  const inputClass = cn(
    'px-2 py-1.5 rounded text-xs border border-border bg-background text-foreground',
    'focus:outline-none focus:ring-2 focus:ring-primary/30',
  )

  return (
    <div className="p-3 bg-muted/20 rounded-lg space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="الاسم بالعربية"
          value={form.nameAr}
          onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Name in English"
          value={form.nameEn}
          onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
          className={cn(inputClass, 'text-left')}
          dir="ltr"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="الوقت: 8:00 - 11:00"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className={inputClass}
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as any })}
          className={cn(inputClass, 'cursor-pointer')}
        >
          <option>نظري</option>
          <option>عملي</option>
        </select>
        <input
          type="text"
          placeholder="المحاضر"
          value={form.instructor}
          onChange={(e) => setForm({ ...form, instructor: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="القاعة/المختبر"
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          className={cn(inputClass, 'flex-1')}
        />
        <button
          onClick={() => onSave(form)}
          className="px-2 py-1.5 rounded text-xs bg-primary text-primary-foreground font-medium hover:opacity-90"
        >
          حفظ
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1.5 rounded text-xs bg-muted text-muted-foreground hover:bg-muted/80"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}
