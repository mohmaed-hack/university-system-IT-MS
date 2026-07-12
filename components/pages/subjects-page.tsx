'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Book,
  FlaskConical,
  ChevronRight,
  X,
  BookMarked,
  Play,
  FileText,
  Calendar,
  Plus,
  User,
  Video,
  Sparkles,
  ExternalLink,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp, type SubjectMaterial, type Lecture, type Subject } from '@/lib/app-context'
import { cn } from '@/lib/utils'

type Tab = 1 | 2
type LectureType = 'theory' | 'practical'

// ── Arabic ordinal helper ──────────────────────────────────
const ARABIC_ORDINALS = [
  '',
  'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة',
  'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة',
  'الحادية عشرة', 'الثانية عشرة', 'الثالثة عشرة', 'الرابعة عشرة', 'الخامسة عشرة',
  'السادسة عشرة', 'السابعة عشرة', 'الثامنة عشرة', 'التاسعة عشرة', 'العشرون',
  'الحادية والعشرون', 'الثانية والعشرون', 'الثالثة والعشرون', 'الرابعة والعشرون', 'الخامسة والعشرون',
  'السادسة والعشرون', 'السابعة والعشرون', 'الثامنة والعشرون', 'التاسعة والعشرون', 'الثلاثون',
]

/** Returns a label like "المحاضرة الأولى" for a given lecture number. */
function lectureOrdinalAr(n: number): string {
  const ordinal = ARABIC_ORDINALS[n] ?? `رقم ${n}`
  return `المحاضرة ${ordinal}`
}

// ── Main Subjects Page ─────────────────────────────────────
export function SubjectsPage() {
  const { data } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>(1)
  const [selectedSubject, setSelectedSubject] = useState<SubjectMaterial | null>(null)

  const semester1Materials = data.subjectMaterials.filter((s) => s.semester === 1)

  // Get corresponding study plan subject for instructor info
  const getStudyPlanSubject = (material: SubjectMaterial): Subject | undefined => {
    const allSubjects = [...data.semester1, ...data.semester2]
    return allSubjects.find(s => s.nameEn === material.nameEn || s.id === material.id.replace('sm-', ''))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-foreground">المواد الدراسية والمحاضرات</h2>
        <p className="text-muted-foreground text-sm">Course Materials — Academic Year 2026-2027</p>
      </div>

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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 1 ? (
          <motion.div
            key="sem1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {semester1Materials.map((subject, i) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                studyPlanSubject={getStudyPlanSubject(subject)}
                index={i}
                onClick={() => setSelectedSubject(subject)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="sem2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div className="flex items-center justify-center size-20 rounded-2xl bg-muted/60">
              <BookMarked className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-black text-foreground">
                قريباً...
              </p>
              <p className="text-sm text-muted-foreground">
                سيتم إضافة محاضرات الترم الثاني قريباً
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <SubjectDetailModal
          subject={selectedSubject}
          studyPlanSubject={getStudyPlanSubject(selectedSubject)}
          onClose={() => setSelectedSubject(null)}
        />
      )}
    </div>
  )
}

// ── Subject Card ───────────────────────────────────────────
function SubjectCard({
  subject,
  studyPlanSubject,
  index,
  onClick,
}: {
  subject: SubjectMaterial
  studyPlanSubject?: Subject
  index: number
  onClick: () => void
}) {
  const hasPractical = studyPlanSubject?.side === 'نظري + عملي'

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      onClick={onClick}
      className="group relative text-start bg-card border border-border rounded-2xl overflow-hidden
        hover:border-primary/40 hover:shadow-xl transition-all duration-300 focus:outline-none
        focus:ring-2 focus:ring-primary/30"
    >
      {/* Image with gradient overlay */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-primary/5 to-muted overflow-hidden">
        <Image
          src={subject.image}
          alt={subject.nameEn}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Side badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm',
            hasPractical
              ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
              : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
          )}>
            {hasPractical ? 'نظري + عملي' : 'نظري فقط'}
          </span>
        </div>

        {/* Sparkle decoration */}
        <Sparkles className="absolute bottom-3 left-3 size-5 text-white/30" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-1" dir="ltr">
          {subject.nameEn}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{subject.nameAr}</p>

        {/* Click hint */}
        <div className="flex items-center gap-1.5 text-[10px] text-primary/70 font-semibold mt-2
          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>انقر لعرض التفاصيل</span>
          <ChevronRight className="size-3" />
        </div>
      </div>
    </motion.button>
  )
}

// ── Subject Detail Modal ───────────────────────────────────
function SubjectDetailModal({
  subject,
  studyPlanSubject,
  onClose,
}: {
  subject: SubjectMaterial
  studyPlanSubject?: Subject
  onClose: () => void
}) {
  const { isAdmin, data, updateSubjectMaterials } = useApp()
  const [showLectures, setShowLectures] = useState(false)
  const [lectureType, setLectureType] = useState<LectureType>('theory')
  const [showAddLecture, setShowAddLecture] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)

  const hasPractical = studyPlanSubject?.side === 'نظري + عملي'
  const isTheoryOnly = !hasPractical

  // Always read the latest version from context so edits/deletes reflect live.
  const currentSubject = data.subjectMaterials.find((m) => m.id === subject.id) ?? subject
  const lectures = lectureType === 'theory' ? currentSubject.lecturesTheory : currentSubject.lecturesPractical

  const handleAddLecture = (lecture: Omit<Lecture, 'id'>) => {
    const newLecture: Lecture = {
      ...lecture,
      id: `l-${Date.now()}`,
    }

    const updatedMaterials = data.subjectMaterials.map((m) => {
      if (m.id === subject.id) {
        if (lectureType === 'theory') {
          return { ...m, lecturesTheory: [...m.lecturesTheory, newLecture] }
        } else {
          return { ...m, lecturesPractical: [...m.lecturesPractical, newLecture] }
        }
      }
      return m
    })

    updateSubjectMaterials(updatedMaterials)
    setShowAddLecture(false)
  }

  const handleUpdateLecture = (updated: Lecture) => {
    const key = updated.type === 'theory' ? 'lecturesTheory' : 'lecturesPractical'
    const updatedMaterials = data.subjectMaterials.map((m) => {
      if (m.id !== subject.id) return m
      return {
        ...m,
        [key]: m[key].map((l) => (l.id === updated.id ? updated : l)),
      }
    })
    updateSubjectMaterials(updatedMaterials)
  }

  const handleDeleteLecture = (lecture: Lecture) => {
    const key = lecture.type === 'theory' ? 'lecturesTheory' : 'lecturesPractical'
    const updatedMaterials = data.subjectMaterials.map((m) => {
      if (m.id !== subject.id) return m
      return {
        ...m,
        [key]: m[key].filter((l) => l.id !== lecture.id),
      }
    })
    updateSubjectMaterials(updatedMaterials)
  }

  return (
    <>
      <Dialog open={!showLectures && !showAddLecture && !showBookModal} onOpenChange={(o) => { if (!o) onClose() }}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl gap-0">
          <DialogTitle className="sr-only">{subject.nameEn}</DialogTitle>

          {/* Header image */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-primary/10 to-muted overflow-hidden">
            <Image
              src={subject.image}
              alt={subject.nameEn}
              fill
              className="object-cover"
              sizes="448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 flex items-center justify-center size-8 rounded-full
                bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
            >
              <X className="size-4" />
            </button>

            {/* Subject name overlay */}
            <div className="absolute bottom-3 right-3 left-3">
              <h3 className="text-lg font-black text-white" dir="ltr">{subject.nameEn}</h3>
              <p className="text-xs text-white/80">{subject.nameAr}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-4">
            {/* Side info */}
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                hasPractical ? 'bg-emerald-500/10 border border-emerald-400/20' : 'bg-blue-500/10 border border-blue-400/20'
              )}>
                {hasPractical ? (
                  <FlaskConical className="size-4 text-emerald-500" />
                ) : (
                  <Book className="size-4 text-blue-500" />
                )}
                <span className={cn(
                  'text-xs font-bold',
                  hasPractical ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                )}>
                  {studyPlanSubject?.side || 'نظري فقط'}
                </span>
              </div>

              {/* Instructor */}
              {studyPlanSubject?.instructorTheory && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="size-3.5" />
                  <span>{studyPlanSubject.instructorTheory.nameAr}</span>
                </div>
              )}
            </div>

            {/* Book button */}
            <button
              onClick={() => {
               if (subject.bookUrl) {
                window.open(subject.bookUrl, "_blank");
                } else {
                setShowBookModal(true);
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 active:scale-[0.98] transition-all duration-200"
               >
               <Book className="size-4" />
               تحميل الكتاب
            </button>
            
            {/* Lectures section */}
            <div className="flex flex-col gap-3">
              {isTheoryOnly ? (
                <button
                  onClick={() => setShowLectures(true)}
                  className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl
                    bg-primary text-primary-foreground font-bold text-sm
                    hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="size-4" />
                    المحاضرات النظرية
                  </span>
                  <ChevronRight className="size-4" />
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setLectureType('theory'); setShowLectures(true) }}
                    className="flex items-center justify-between w-full px-5 py-3 rounded-xl
                      bg-blue-500/10 border border-blue-400/20 hover:bg-blue-500/20
                      transition-all duration-200 text-right"
                  >
                    <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      <FileText className="size-4 text-blue-500" />
                      المحاضرات النظرية
                    </span>
                    <ChevronRight className="size-4 text-blue-500" />
                  </button>

                  <button
                    onClick={() => { setLectureType('practical'); setShowLectures(true) }}
                    className="flex items-center justify-between w-full px-5 py-3 rounded-xl
                      bg-emerald-500/10 border border-emerald-400/20 hover:bg-emerald-500/20
                      transition-all duration-200 text-right"
                  >
                    <span className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      <FlaskConical className="size-4 text-emerald-500" />
                      المحاضرات العملية
                    </span>
                    <ChevronRight className="size-4 text-emerald-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lectures Page */}
      <LecturesPage
        subject={currentSubject}
        type={lectureType}
        lectures={lectures}
        isOpen={showLectures}
        onClose={() => setShowLectures(false)}
        isAdmin={isAdmin}
        onAddLecture={isAdmin ? () => setShowAddLecture(true) : undefined}
        onUpdateLecture={isAdmin ? handleUpdateLecture : undefined}
        onDeleteLecture={isAdmin ? handleDeleteLecture : undefined}
      />

      {/* Add Lecture Modal */}
      {showAddLecture && (
        <AddLectureModal
          type={lectureType}
          onAdd={handleAddLecture}
          onClose={() => setShowAddLecture(false)}
        />
      )}

      {/* Book Not Available Modal */}
      <Dialog open={showBookModal} onOpenChange={setShowBookModal}>
        <DialogContent className="max-w-sm w-full p-6 rounded-2xl">
          <DialogTitle className="sr-only">الكتاب غير متوفر</DialogTitle>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-amber-500/10">
              <Book className="size-8 text-amber-500" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-foreground">لم يتوفر الكتاب بعد</p>
              <p className="text-sm text-muted-foreground">قريباً</p>
            </div>
            <button
              onClick={() => setShowBookModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 transition-opacity"
            >
              حسناً
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Lectures Page ───────────────────────────────────────────
function LecturesPage({
  subject,
  type,
  lectures,
  isOpen,
  onClose,
  isAdmin,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture,
}: {
  subject: SubjectMaterial
  type: LectureType
  lectures: Lecture[]
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
  onAddLecture?: () => void
  onUpdateLecture?: (lecture: Lecture) => void
  onDeleteLecture?: (lecture: Lecture) => void
}) {
  const isTheory = type === 'theory'

  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [deletingLecture, setDeletingLecture] = useState<Lecture | null>(null)

  return (
    <>
      <Dialog open={isOpen && !selectedLecture && !editingLecture && !deletingLecture} onOpenChange={(o) => { if (!o) onClose() }}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl gap-0">
          <DialogTitle className="sr-only">
            {isTheory ? 'المحاضرات النظرية' : 'المحاضرات العملية'}
          </DialogTitle>

          {/* Header */}
          <div className={cn(
            'flex flex-col gap-4 p-5 border-b',
            isTheory
              ? 'bg-gradient-to-br from-blue-500/10 to-transparent'
              : 'bg-gradient-to-br from-emerald-500/10 to-transparent'
          )}>
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground
                  hover:text-foreground transition-colors"
              >
                <ChevronRight className="size-4" />
                رجوع
              </button>
              {onAddLecture && (
                <button
                  onClick={onAddLecture}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary
                    text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  <Plus className="size-3.5" />
                  إضافة
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black text-foreground">
                {isTheory ? 'المحاضرات النظرية' : 'المحاضرات العملية'}
              </h2>
              <p className="text-sm text-muted-foreground" dir="ltr">{subject.nameEn}</p>
            </div>
          </div>

          {/* Lectures list */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {lectures.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="flex items-center justify-center size-14 rounded-xl bg-muted/60">
                  <FileText className="size-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  لا توجد محاضرات متاحة حالياً
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {lectures.map((lecture, idx) => (
                  <motion.div
                    key={lecture.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group rounded-xl bg-card border border-border overflow-hidden
                      hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <button
                      onClick={() => setSelectedLecture(lecture)}
                      className="flex items-center gap-4 p-4 w-full text-right focus:outline-none"
                    >
                      <div className={cn(
                        'flex items-center justify-center size-10 rounded-xl font-black text-sm shrink-0',
                        isTheory
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      )}>
                        {lecture.number || idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-muted-foreground/80">
                          {lectureOrdinalAr(lecture.number || idx + 1)}
                        </p>
                        <p className="font-semibold text-foreground text-sm truncate">{lecture.title}</p>
                        {lecture.date && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {lecture.date}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                    </button>

                    {/* Admin actions */}
                    {isAdmin && (
                      <div className="flex gap-2 px-4 pb-3 pt-0">
                        <button
                          onClick={() => setEditingLecture(lecture)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                            bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                        >
                          <Pencil className="size-3.5" />
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeletingLecture(lecture)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                            bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                          حذف
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lecture Detail Modal */}
      {selectedLecture && (
        <LectureDetailModal
          lecture={selectedLecture}
          type={type}
          onClose={() => setSelectedLecture(null)}
        />
      )}

      {/* Edit Lecture Modal (admin) */}
      {editingLecture && onUpdateLecture && (
        <EditLectureModal
          lecture={editingLecture}
          type={type}
          onSave={(updated) => { onUpdateLecture(updated); setEditingLecture(null) }}
          onClose={() => setEditingLecture(null)}
        />
      )}

      {/* Delete Confirmation (admin) */}
      {deletingLecture && onDeleteLecture && (
        <DeleteLectureModal
          lecture={deletingLecture}
          onConfirm={() => { onDeleteLecture(deletingLecture); setDeletingLecture(null) }}
          onClose={() => setDeletingLecture(null)}
        />
      )}
    </>
  )
}

// ── Lecture Detail Modal ───────────────────────────────────
function LectureDetailModal({
  lecture,
  type,
  onClose,
}: {
  lecture: Lecture
  type: LectureType
  onClose: () => void
}) {
  const isTheory = type === 'theory'
  const [showVideoMessage, setShowVideoMessage] = useState(false)

  const lectureNumber = lectureOrdinalAr(lecture.number)

  return (
    <>
      <Dialog open={!showVideoMessage} onOpenChange={(o) => { if (!o) onClose() }}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden rounded-2xl gap-0">
          <DialogTitle className="sr-only">تفاصيل المحاضرة</DialogTitle>

          {/* Header with close button */}
          <div className={cn(
            'flex items-center justify-between p-6 border-b',
            isTheory
              ? 'bg-gradient-to-br from-blue-500/10 to-transparent'
              : 'bg-gradient-to-br from-emerald-500/10 to-transparent'
          )}>
            <h2 className="text-2xl font-black text-foreground">تفاصيل المحاضرة</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center size-8 rounded-full
                hover:bg-muted transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col gap-6 max-h-[calc(90vh-100px)] overflow-y-auto">
            {/* Lecture Number */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-primary/70 uppercase tracking-wide">رقم المحاضرة</span>
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex items-center justify-center size-14 rounded-xl font-black text-lg',
                  isTheory
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                )}>
                  {lecture.number}
                </div>
                <p className="text-2xl font-bold text-foreground">{lectureNumber}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Lecture Title */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">عنوان المحاضرة</span>
              <p className="text-xl font-bold text-foreground break-words">{lecture.title}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Lecture Date */}
            {lecture.date && (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">التاريخ</span>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Calendar className="size-5 text-primary flex-shrink-0" />
                    <p className="font-semibold text-foreground">{lecture.date}</p>
                  </div>
                </div>
                <div className="h-px bg-border" />
              </>
            )}

            {/* File Download */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ملف المحاضرة</span>
              <a
                href={lecture.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl
                  bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors
                  group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20">
                    <FileText className="size-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-foreground text-sm">ملف المحاضرة</p>
                    <p className="text-xs text-muted-foreground">اضغط للتحميل</p>
                  </div>
                </div>
                <Download className="size-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Video */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">الفيديو</span>
              <button
                onClick={() => {
                  if (isTheory) {
                    setShowVideoMessage(true)
                  } else if (lecture.videoUrl) {
                    window.open(lecture.videoUrl, '_blank')
                  }
                }}
                className="flex items-center justify-between p-4 rounded-xl
                  bg-red-500/10 border border-red-400/20 hover:bg-red-500/20 transition-colors
                  group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-red-500/20">
                    <Video className="size-5 text-red-500" />
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <p className="font-semibold text-foreground text-sm">
                      {lecture.videoUrl ? 'مشاهدة الفيديو' : 'لا يوجد تسجيل'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lecture.videoUrl ? 'اضغط لمشاهدة التسجيل' : 'لم يتم توفير تسجيل'}
                    </p>
                  </div>
                </div>
                {lecture.videoUrl && (
                  <Play className="size-5 text-red-500 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* No Video Message for Theory */}
      <Dialog open={showVideoMessage} onOpenChange={setShowVideoMessage}>
        <DialogContent className="max-w-sm w-full p-6 rounded-2xl">
          <DialogTitle className="sr-only">لا يوجد فيديو</DialogTitle>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-muted/60">
              <Video className="size-8 text-muted-foreground/60" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-foreground">عذراً، لا يوجد تسجيل للمحاضرات النظرية</p>
            </div>
            <button
              onClick={() => setShowVideoMessage(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 transition-opacity"
            >
              حسناً
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Add Lecture Modal ──────────────────────────────────────
function AddLectureModal({
  type,
  onAdd,
  onClose,
}: {
  type: LectureType
  onAdd: (lecture: Omit<Lecture, 'id'>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    number: 1,
    title: '',
    date: new Date().toISOString().split('T')[0],
    downloadUrl: '',
    videoUrl: '',
  })

  const handleSubmit = () => {
    if (!form.title || !form.downloadUrl) return

    onAdd({
      number: form.number,
      title: form.title,
      date: form.date,
      downloadUrl: form.downloadUrl,
      videoUrl: type === 'practical' && form.videoUrl ? form.videoUrl : undefined,
      type,
    })
  }

  return (
    <Dialog open={true} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm w-full p-5 rounded-2xl">
        <DialogTitle className="text-lg font-bold text-foreground mb-4">
          إضافة محاضرة {type === 'theory' ? 'نظرية' : 'عملية'}
        </DialogTitle>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold text-muted-foreground">الرقم</label>
              <input
                type="number"
                min="1"
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.number}
                onChange={(e) => setForm(f => ({ ...f, number: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="flex flex-col gap-1 flex-[2]">
              <label className="text-xs font-semibold text-muted-foreground">التاريخ</label>
              <input
                type="date"
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">العنوان</label>
            <input
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="المحاضرة الأولى"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">رابط الملف</label>
            <input
              dir="ltr"
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono
                focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.downloadUrl}
              onChange={(e) => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
              placeholder="https://drive.google.com/..."
            />
          </div>

          {type === 'practical' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">رابط الفيديو</label>
              <input
                dir="ltr"
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono
                  focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.videoUrl}
                onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/..."
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 transition-opacity"
            >
              حفظ
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-medium text-sm
                hover:bg-muted/50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Lecture Modal ─────────────────────────────────────
function EditLectureModal({
  lecture,
  type,
  onSave,
  onClose,
}: {
  lecture: Lecture
  type: LectureType
  onSave: (lecture: Lecture) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    number: lecture.number,
    title: lecture.title,
    date: lecture.date,
    downloadUrl: lecture.downloadUrl,
    videoUrl: lecture.videoUrl || '',
  })

  const handleSubmit = () => {
    if (!form.title || !form.downloadUrl) return
    onSave({
      ...lecture,
      number: form.number,
      title: form.title,
      date: form.date,
      downloadUrl: form.downloadUrl,
      videoUrl: type === 'practical' && form.videoUrl ? form.videoUrl : undefined,
    })
  }

  return (
    <Dialog open={true} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm w-full p-5 rounded-2xl">
        <DialogTitle className="text-lg font-bold text-foreground mb-4">
          تعديل محاضرة {type === 'theory' ? 'نظرية' : 'عملية'}
        </DialogTitle>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold text-muted-foreground">الرقم</label>
              <input
                type="number"
                min="1"
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.number}
                onChange={(e) => setForm(f => ({ ...f, number: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="flex flex-col gap-1 flex-[2]">
              <label className="text-xs font-semibold text-muted-foreground">التاريخ</label>
              <input
                type="date"
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">العنوان</label>
            <input
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">رابط الملف</label>
            <input
              dir="ltr"
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono
                focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.downloadUrl}
              onChange={(e) => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
            />
          </div>

          {type === 'practical' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">رابط الفيديو</label>
              <input
                dir="ltr"
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono
                  focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.videoUrl}
                onChange={(e) => setForm(f => ({ ...f, videoUrl: e.target.value }))}
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 transition-opacity"
            >
              حفظ
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-medium text-sm
                hover:bg-muted/50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete Lecture Modal ───────────────────────────────────
function DeleteLectureModal({
  lecture,
  onConfirm,
  onClose,
}: {
  lecture: Lecture
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm w-full p-6 rounded-2xl">
        <DialogTitle className="sr-only">تأكيد الحذف</DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center size-12 rounded-full bg-red-500/10">
            <AlertCircle className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <h3 className="font-bold text-foreground">حذف المحاضرة؟</h3>
            <p className="text-sm text-muted-foreground">{lecture.title}</p>
            <p className="text-xs text-muted-foreground">لا يمكن التراجع عن هذا الإجراء</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-semibold text-sm"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold text-sm"
            >
              حذف
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
