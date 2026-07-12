'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  BookOpen,
  Users,
  Calendar,
  Layers,
  Clock,
  Home,
  Menu,
  X,
  Settings,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ManageSubjectsModal } from './manage-subjects-modal'
import { ManageLecturesModal } from './manage-lectures-modal'
import { ManageTimetableModal } from './manage-timetable-modal'
import { ManageExamsModal } from './manage-exams-modal'
import { cn } from '@/lib/utils'

type AdminPage = 'home' | 'subjects' | 'instructors' | 'timetable' | 'exams' | 'home-content'

interface AdminPanelProps {
  onLogout: () => void
}

const menuItems = [
  { id: 'home' as const, label: 'الصفحة الرئيسية', icon: Home, color: 'text-blue-500' },
  { id: 'subjects' as const, label: 'إدارة المواد', icon: BookOpen, color: 'text-purple-500' },
  { id: 'instructors' as const, label: 'إدارة الدكاترة', icon: Users, color: 'text-rose-500' },
  { id: 'timetable' as const, label: 'الجدول الدراسي', icon: Clock, color: 'text-cyan-500' },
  { id: 'exams' as const, label: 'اختبارات السنة', icon: Calendar, color: 'text-emerald-500' },
  { id: 'home-content' as const, label: 'محتوى الصفحة الرئيسية', icon: Settings, color: 'text-orange-500' },
]

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const { logoutAdmin, data } = useApp()
  const [currentPage, setCurrentPage] = useState<AdminPage>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [manageSubjectSemester, setManageSubjectSemester] = useState<1 | 2 | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [selectedLectureType, setSelectedLectureType] = useState<'theory' | 'practical' | null>(null)
  const [manageExamSemester, setManageExamSemester] = useState<1 | 2 | null>(null)
  const [showTimetable, setShowTimetable] = useState(false)

  const handleLogout = async () => {
    await logoutAdmin()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.div
        animate={{ marginLeft: sidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed inset-y-0 right-0 z-50 w-64 bg-card border-l border-border md:relative md:translate-x-0"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">لوحة التحكم</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id)
                setSidebarOpen(false)
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                currentPage === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className={cn('w-5 h-5', currentPage === item.id ? 'text-current' : item.color)} />
              <span className="font-medium text-sm">{item.label}</span>
              {currentPage === item.id && <ChevronRight className="w-4 h-4 mr-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all duration-200 font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </motion.div>

      {/* Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">لوحة التحكم الإدارية</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && (
              <AdminHomePage key="home" />
            )}
            {currentPage === 'subjects' && (
              <AdminSubjectsPage
                key="subjects"
                onManageSubject={(semester) => setManageSubjectSemester(semester)}
              />
            )}
            {currentPage === 'instructors' && (
              <AdminInstructorsPage key="instructors" />
            )}
            {currentPage === 'timetable' && (
              <AdminTimetablePage
                key="timetable"
                onManage={() => setShowTimetable(true)}
              />
            )}
            {currentPage === 'exams' && (
              <AdminExamsPage
                key="exams"
                onManageExams={(semester) => setManageExamSemester(semester)}
              />
            )}
            {currentPage === 'home-content' && (
              <AdminHomeContentPage key="home-content" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      {manageSubjectSemester && (
        <ManageSubjectsModal
          semester={manageSubjectSemester}
          onClose={() => setManageSubjectSemester(null)}
        />
      )}
      {manageExamSemester && (
        <ManageExamsModal
          semester={manageExamSemester}
          onClose={() => setManageExamSemester(null)}
        />
      )}
      {showTimetable && (
        <ManageTimetableModal onClose={() => setShowTimetable(false)} />
      )}
    </div>
  )
}

// ── Page Components ──

function AdminHomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-foreground mb-2">مرحباً بك</h2>
        <p className="text-muted-foreground">لوحة التحكم الإدارية الشاملة للموقع الأكاديمي</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn('p-3 rounded-lg', `${item.color} bg-opacity-10`)}>
                <item.icon className={cn('w-6 h-6', item.color)} />
              </div>
            </div>
            <h3 className="font-bold text-foreground mb-1">{item.label}</h3>
            <p className="text-sm text-muted-foreground">اضغط للدخول إلى {item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface AdminSubjectsPageProps {
  onManageSubject: (semester: 1 | 2) => void
}

function AdminSubjectsPage({ onManageSubject }: AdminSubjectsPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">إدارة المواد الدراسية</h2>
        <p className="text-muted-foreground">أضف، عدّل، أو احذف المواد الدراسية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((sem) => (
          <motion.button
            key={sem}
            whileHover={{ scale: 1.02 }}
            onClick={() => onManageSubject(sem as 1 | 2)}
            className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">الترم {sem}</h3>
            <p className="text-muted-foreground text-sm mb-4">إدارة مواد الترم {sem}</p>
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              إدارة المواد <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function AdminInstructorsPage() {
  const { data } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">إدارة أعضاء هيئة التدريس</h2>
        <p className="text-muted-foreground">عدد الدكاترة: {data.instructors.length}</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <p className="text-sm text-muted-foreground mb-3">
          يمكنك إدارة الدكاترة من خلال قسم "أعضاء هيئة التدريس" في لوحة التحكم الرئيسية
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.instructors.map((inst) => (
            <div key={inst.id} className="bg-card border border-border rounded-lg p-3">
              <p className="font-semibold text-foreground text-sm">{inst.nameAr}</p>
              <p className="text-xs text-muted-foreground">{inst.degree}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

interface AdminTimetablePageProps {
  onManage: () => void
}

function AdminTimetablePage({ onManage }: AdminTimetablePageProps) {
  const { data } = useApp()
  const totalLectures = data.timetable.reduce((sum, day) => sum + day.lectures.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">الجدول الدراسي</h2>
        <p className="text-muted-foreground">إجمالي المحاضرات: {totalLectures}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={onManage}
        className="w-full bg-primary text-primary-foreground rounded-xl p-6 hover:opacity-90 transition-all duration-200 font-bold text-lg"
      >
        إدارة الجدول الدراسي
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.timetable.slice(0, 3).map((day) => (
          <div key={day.id} className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-bold text-foreground mb-2">{day.day}</h4>
            {day.isHoliday ? (
              <p className="text-sm text-muted-foreground">إجازة</p>
            ) : (
              <p className="text-sm text-muted-foreground">{day.lectures.length} محاضرة</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

interface AdminExamsPageProps {
  onManageExams: (semester: 1 | 2) => void
}

function AdminExamsPage({ onManageExams }: AdminExamsPageProps) {
  const { data } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">اختبارات السنة</h2>
        <p className="text-muted-foreground">إجمالي الاختبارات: {data.exams.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((sem) => {
          const semesterExams = data.exams.filter(e => e.semester === sem)
          return (
            <motion.button
              key={sem}
              whileHover={{ scale: 1.02 }}
              onClick={() => onManageExams(sem as 1 | 2)}
              className="bg-card border border-border rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-foreground mb-1">الترم {sem}</h3>
              <p className="text-sm text-muted-foreground mb-4">{semesterExams.length} اختبار</p>
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                إدارة الاختبارات <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

function AdminHomeContentPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-foreground mb-1">محتوى الصفحة الرئيسية</h2>
        <p className="text-muted-foreground">عدّل محتوى البطل والإعلانات والإخبار</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          يمكنك تحرير محتوى الصفحة الرئيسية من خلال زر "تحرير" في الصفحة الرئيسية للطلاب
        </p>
      </div>
    </motion.div>
  )
}
