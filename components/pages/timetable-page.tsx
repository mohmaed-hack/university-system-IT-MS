'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Download, BookOpen, User, Clock, MapPin, FlaskConical, FileText, TreePalm as Palmtree, ChevronRight, Library, GraduationCap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────
type LectureType = 'نظري' | 'عملي'

interface Lecture {
  time: string
  nameEn: string
  nameAr: string
  type: LectureType
  instructor: string
  room: string
}

interface DaySchedule {
  day: string
  dayEn: string
  isHoliday?: boolean
  lectures: Lecture[]
}

// ── Data ──────────────────────────────────────────────────
const timetableData: DaySchedule[] = [
  {
    day: 'السبت',
    dayEn: 'Saturday',
    lectures: [
      {
        time: '8:00 - 11:00',
        nameEn: 'Software Engineering',
        nameAr: 'هندسة البرمجيات',
        type: 'نظري',
        instructor: 'د. محمد الخولاني',
        room: 'Hall 7',
      },
      {
        time: '11:00 - 2:00',
        nameEn: 'Information Technology Management',
        nameAr: 'إدارة تقنية المعلومات',
        type: 'نظري',
        instructor: 'أ. زايد',
        room: 'Hall 7',
      },
    ],
  },
  {
    day: 'الأحد',
    dayEn: 'Sunday',
    isHoliday: true,
    lectures: [],
  },
  {
    day: 'الاثنين',
    dayEn: 'Monday',
    isHoliday: true,
    lectures: [],
  },
  {
    day: 'الثلاثاء',
    dayEn: 'Tuesday',
    lectures: [
      {
        time: '8:00 - 11:00',
        nameEn: 'Developing Database Applications (MySQL)',
        nameAr: 'تطوير تطبيقات قواعد البيانات',
        type: 'عملي',
        instructor: 'أ. أسماء',
        room: 'Lab 3 GB',
      },
      {
        time: '11:00 - 2:00',
        nameEn: 'Developing Database Applications (MySQL)',
        nameAr: 'تطوير تطبيقات قواعد البيانات',
        type: 'عملي',
        instructor: 'أ. أسماء',
        room: 'Lab 3 GA',
      },
    ],
  },
  {
    day: 'الأربعاء',
    dayEn: 'Wednesday',
    lectures: [
      {
        time: '11:00 - 2:00',
        nameEn: 'Business Intelligence',
        nameAr: 'ذكاء الأعمال',
        type: 'نظري',
        instructor: 'د. قيس النزيلي',
        room: 'Hall 7',
      },
      {
        time: '2:00 - 4:00',
        nameEn: 'Cloud Computing and Web Services',
        nameAr: 'الحوسبة السحابية وخدمات الويب',
        type: 'نظري',
        instructor: 'د. محمد',
        room: 'Hall 7',
      },
    ],
  },
  {
    day: 'الخميس',
    dayEn: 'Thursday',
    lectures: [
      {
        time: '8:00 - 10:00',
        nameEn: 'IT Projects Management',
        nameAr: 'إدارة مشاريع تقنية المعلومات',
        type: 'نظري',
        instructor: 'د. حسن الجرادي',
        room: 'Hall 2',
      },
      {
        time: '10:00 - 12:00',
        nameEn: 'Cloud Computing and Web Services',
        nameAr: 'الحوسبة السحابية وخدمات الويب',
        type: 'عملي',
        instructor: 'أ. مريم',
        room: 'Lab 6 GB',
      },
      {
        time: '12:00 - 2:00',
        nameEn: 'IT Projects Management',
        nameAr: 'إدارة مشاريع تقنية المعلومات',
        type: 'عملي',
        instructor: 'أ. دلال',
        room: 'Lab 4 GB',
      },
      {
        time: '10:00 - 12:00',
        nameEn: 'IT Projects Management',
        nameAr: 'إدارة مشاريع تقنية المعلومات',
        type: 'عملي',
        instructor: 'أ. دلال',
        room: 'Lab 4 GA',
      },
      {
        time: '10:00 - 12:00',
        nameEn: 'Cloud Computing and Web Services',
        nameAr: 'الحوسبة السحابية وخدمات الويب',
        type: 'عملي',
        instructor: 'أ. مريم',
        room: 'Lab 6 GA',
      },
    ],  },
]

const DOWNLOAD_URL: string | null = 'https://drive.google.com/uc?export=download&id=1MENlkQ4AIT4Fh2cnducy99rP8k1ddvRG'

// ── Stats ─────────────────────────────────────────────────
const stats = {
  totalSubjects: 6,
  studyDays: timetableData.filter(d => !d.isHoliday).length,
  holidayDays: timetableData.filter(d => d.isHoliday).length,
  labSessions: timetableData.reduce(
    (acc, d) => acc + d.lectures.filter(l => l.type === 'عملي').length,
    0
  ),
}

// ── Component ─────────────────────────────────────────────
type FilterType = 'all' | 'theory' | 'practical' | 'holidays'

export function TimetablePage() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>('all')
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  const handleDownload = () => {
    if (DOWNLOAD_URL) {
      window.open(DOWNLOAD_URL, '_blank')
    } else {
      setShowDownloadModal(true)
    }
  }

  const filteredDays = timetableData.map(day => {
    if (filter === 'holidays') {
      return day.isHoliday ? day : { ...day, lectures: [] }
    }
    if (filter === 'theory') {
      return {
        ...day,
        lectures: day.lectures.filter(l => l.type === 'نظري'),
        isHoliday: false,
      }
    }
    if (filter === 'practical') {
      return {
        ...day,
        lectures: day.lectures.filter(l => l.type === 'عملي'),
        isHoliday: false,
      }
    }
    return day
  }).filter(day => !day.isHoliday || filter === 'all' || filter === 'holidays')

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back and download */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            جدول محاضرات الترم الأول
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Semester 1 Timetable</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl
              bg-primary text-primary-foreground font-bold text-xs sm:text-sm
              hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">تحميل الجدول</span>
            <span className="sm:hidden">تحميل</span>
          </button>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border
              text-muted-foreground hover:text-foreground hover:border-primary/40
              transition-colors duration-200 text-sm font-semibold"
          >
            <ChevronRight className="size-4" />
            رجوع
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90
          text-primary-foreground p-6 sm:p-8 shadow-xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-x-1/4 translate-y-1/4" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />

        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center justify-center size-16 sm:size-20 rounded-2xl bg-white/10 backdrop-blur-sm">
            <Calendar className="size-8 sm:size-10 text-white/90" strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h3 className="text-2xl sm:text-3xl font-black mb-1">جدول محاضرات الترم الأول</h3>
            <p className="text-primary-foreground/80 text-sm sm:text-base mb-2">Semester 1 Timetable</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs sm:text-sm">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">المستوى الثالث</span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">Information Technology</span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">جامعة الناصر</span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">2026-2027</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="glass rounded-xl p-4 text-center">
          <div className="flex items-center justify-center size-10 rounded-lg bg-blue-500/10 mx-auto mb-2">
            <BookOpen className="size-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{stats.totalSubjects}</p>
          <p className="text-xs text-muted-foreground">عدد المواد</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10 mx-auto mb-2">
            <Calendar className="size-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{stats.studyDays}</p>
          <p className="text-xs text-muted-foreground">أيام الدراسة</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="flex items-center justify-center size-10 rounded-lg bg-amber-500/10 mx-auto mb-2">
            <Palmtree className="size-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{stats.holidayDays}</p>
          <p className="text-xs text-muted-foreground">أيام الإجازة</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="flex items-center justify-center size-10 rounded-lg bg-purple-500/10 mx-auto mb-2">
            <FlaskConical className="size-5 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{stats.labSessions}</p>
          <p className="text-xs text-muted-foreground">المعامل العملية</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { id: 'all' as const, label: 'الكل', icon: Calendar },
          { id: 'theory' as const, label: 'النظري', icon: FileText },
          { id: 'practical' as const, label: 'العملي', icon: FlaskConical },
          { id: 'holidays' as const, label: 'الإجازات', icon: Palmtree },
        ].map((f) => {
          const Icon = f.icon
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary/30',
                filter === f.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
              )}
            >
              <Icon className="size-4" />
              {f.label}
            </button>
          )
        })}
      </motion.div>

      {/* Days Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredDays.map((day, idx) => (
            <DayCard key={day.day} day={day} index={idx} filter={filter} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Download Modal */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="max-w-sm w-full p-6 rounded-2xl">
          <DialogTitle className="sr-only">الجدول غير متوفر</DialogTitle>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-muted/60">
              <Download className="size-8 text-muted-foreground/60" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-foreground">لم يتم رفع الجدول بعد</p>
              <p className="text-sm text-muted-foreground">قريباً</p>
            </div>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                hover:opacity-90 transition-opacity"
            >
              حسناً
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Day Card ──────────────────────────────────────────────
function DayCard({ day, index, filter }: { day: DaySchedule; index: number; filter: FilterType }) {
  const hasLectures = day.lectures.length > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'rounded-2xl overflow-hidden border',
        day.isHoliday
          ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-400/20'
          : 'bg-card border-border'
      )}
    >
      {/* Day Header */}
      <div className={cn(
        'px-4 py-3 border-b',
        day.isHoliday
          ? 'bg-amber-500/10 border-amber-400/20'
          : 'bg-muted/30 border-border'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {day.isHoliday ? (
              <Palmtree className="size-5 text-amber-500" />
            ) : (
              <Calendar className="size-5 text-primary" />
            )}
            <div>
              <h4 className="font-bold text-foreground">{day.day}</h4>
              <p className="text-xs text-muted-foreground">{day.dayEn}</p>
            </div>
          </div>
          {hasLectures && (
            <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary font-semibold">
              {day.lectures.length} محاضرة
            </span>
          )}
        </div>
      </div>

      {/* Lectures or Holiday */}
      <div className="p-3">
        {day.isHoliday ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="flex items-center justify-center size-12 rounded-xl bg-amber-500/10">
              <Palmtree className="size-6 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-amber-600 dark:text-amber-400">يوم إجازة</p>
              <p className="text-xs text-muted-foreground mt-0.5">Holiday</p>
            </div>
          </div>
        ) : hasLectures ? (
          <div className="flex flex-col gap-2">
            {day.lectures.map((lecture, idx) => (
              <LectureCard key={`${lecture.time}-${idx}`} lecture={lecture} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {filter === 'theory' && 'لا توجد محاضرات نظرية'}
              {filter === 'practical' && 'لا توجد محاضرات عملية'}
              {filter === 'all' && 'لا توجد محاضرات'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Lecture Card ───────────────────────────────────────────
function LectureCard({ lecture }: { lecture: Lecture }) {
  const isTheory = lecture.type === 'نظري'

  return (
    <div className={cn(
      'group p-3 rounded-xl border transition-all duration-200',
      isTheory
        ? 'bg-blue-500/5 border-blue-400/20 hover:border-blue-400/40'
        : 'bg-emerald-500/5 border-emerald-400/20 hover:border-emerald-400/40'
    )}>
      {/* Time Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={cn(
          'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg',
          isTheory
            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        )}>
          <Clock className="size-3" />
          {lecture.time}
        </span>
        <span className={cn(
          'text-[10px] font-black px-2 py-0.5 rounded-full',
          isTheory
            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
            : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        )}>
          {lecture.type}
        </span>
      </div>

      {/* Subject Name */}
      <div className="mb-2">
        <p className="font-bold text-foreground text-sm leading-snug" dir="ltr">{lecture.nameEn}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{lecture.nameAr}</p>
      </div>

      {/* Details */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="size-3" />
          {lecture.instructor}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3" />
          {lecture.room}
        </span>
      </div>

      {/* Icon */}
      <div className={cn(
        'absolute top-2 left-2 opacity-0 group-hover:opacity-20 transition-opacity duration-200',
        isTheory ? 'text-blue-500' : 'text-emerald-500'
      )}>
        {isTheory ? (
          <FileText className="size-5" />
        ) : (
          <FlaskConical className="size-5" />
        )}
      </div>
    </div>
  )
}
