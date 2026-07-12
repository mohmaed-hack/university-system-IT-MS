'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────
export interface SubjectInstructor {
  nameAr: string
  nameEn?: string
}

export interface Subject {
  id: string
  nameEn: string
  nameAr: string
  image: string
  side: 'نظري فقط' | 'نظري + عملي' | 'قريباً'
  instructorTheory?: SubjectInstructor
  instructorPractical?: SubjectInstructor
  /** Course code, e.g. IT-401 */
  code?: string
  /** Credit hours */
  hours?: number
  /** Prerequisite courses (free text) */
  prerequisites?: string
}

/** A faculty member (doctor / teaching assistant) managed by the admin. */
export interface Instructor {
  id: string
  nameAr: string
  nameEn?: string
  /** Academic degree, e.g. أستاذ دكتور / دكتور / أستاذ */
  degree?: string
  email?: string
  phone?: string
  office?: string
  /** Path or URL to a profile image */
  image?: string
}

/** A news / announcement item shown on the home page. */
export interface Announcement {
  id: string
  title: string
  body?: string
  date: string
  /** Optional external link */
  link?: string
  type: 'إعلان' | 'خبر'
}

/** Editable home page content. */
export interface HomeContent {
  heroTagline: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  announcements: Announcement[]
}

/** Global site settings managed by the admin. */
export interface SiteSettings {
  /** URL to download the full weekly timetable file */
  timetableDownloadUrl?: string
}

export interface DaySchedule {
  id: string
  day: string
  dayAr: string
  subject: string
  subjectAr: string
  time: string
  room: string
  instructor: string
  instructorAr: string
}

export interface Suggestion {
  id: string
  name: string
  message: string
  type: 'suggestion' | 'opinion'
  date: string
  reply?: string
}

/**
 * A lecture inside a subject.
 */
export interface Lecture {
  id: string
  number: number
  title: string
  date: string
  downloadUrl: string
  videoUrl?: string
  type: 'theory' | 'practical'
}

export interface SubjectMaterial {
  id: string
  nameEn: string
  nameAr: string
  /** Path relative to /public, e.g. /images/subjects/software-engineering.png */
  image: string
  semester: 1 | 2
  /** URL to download the course book/textbook */
  bookUrl?: string
  /** Theoretical lectures */
  lecturesTheory: Lecture[]
  /** Practical lectures */
  lecturesPractical: Lecture[]
}

/**
 * A year exam entry (managed by the admin on the "اختبارات السنة" page).
 */
export interface Exam {
  id: string
  /** Subject name (Arabic) */
  subjectAr: string
  /** Subject name (English, optional) */
  subjectEn?: string
  /** Exam date (yyyy-mm-dd) */
  date: string
  /** Exam time, e.g. "10:00 ص" */
  time: string
  /** Exam type, e.g. نظري / عملي / نصفي / نهائي */
  type: string
  /** Room / hall */
  room: string
  /** Instructor name */
  instructor: string
  /** Required syllabus / part */
  syllabus?: string
  /** URL to download the syllabus */
  syllabusUrl?: string
  /** Extra notes */
  notes?: string
  /** Which semester this exam belongs to */
  semester: 1 | 2
}

/** A single lecture entry inside the weekly timetable. */
export interface TimetableLecture {
  id: string
  time: string
  nameEn: string
  nameAr: string
  type: 'نظري' | 'عملي'
  instructor: string
  room: string
}

/** A day inside the weekly timetable. */
export interface TimetableDay {
  id: string
  /** Arabic day name */
  day: string
  /** English day name */
  dayEn: string
  /** Whether the day is a holiday */
  isHoliday?: boolean
  lectures: TimetableLecture[]
}

export interface AppData {
  semester1: Subject[]
  semester2: Subject[]
  schedule: DaySchedule[]
  subjectMaterials: SubjectMaterial[]
  suggestions: Suggestion[]
  /** Year exams (managed by admin). */
  exams: Exam[]
  /** Weekly lecture timetable (managed by admin). */
  timetable: TimetableDay[]
  /** Faculty members (managed by admin). */
  instructors: Instructor[]
  /** Editable home page content (managed by admin). */
  homeContent: HomeContent
  /** Global site settings (managed by admin). */
  settings: SiteSettings
}

// ── Default Data ──────────────────────────────────────────
const DEFAULT_LECTURE_URL =
  'https://drive.google.com/file/d/14Ed0rrA4vsoao5RMe01qbOTN7mypoTX9/view?usp=drivesdk'

const defaultData: AppData = {
  // ── Semester 1 subjects (Study Plan) ──
  semester1: [
    {
      id: 's1-1',
      nameEn: 'Software Engineering',
      nameAr: 'هندسة البرمجيات',
      image: '/images/subjects/software-engineering.png',
      side: 'نظري فقط' as const,
      instructorTheory: { nameAr: 'د. محمد الخولاني' },
    },
    {
      id: 's1-2',
      nameEn: 'IT Projects Management',
      nameAr: 'إدارة مشاريع تقنية المعلومات',
      image: '/images/subjects/it-project-management.png',
      side: 'نظري + عملي' as const,
      instructorTheory: { nameAr: 'د. حسن الجرادي' },
      instructorPractical: { nameAr: 'أ. دلال' },
    },
    {
      id: 's1-3',
      nameEn: 'Business Intelligence',
      nameAr: 'ذكاء الأعمال',
      image: '/images/subjects/business-intelligence.png',
      side: 'نظري فقط' as const,
      instructorTheory: { nameAr: 'د. قيس النزيلي' },
    },
    {
      id: 's1-4',
      nameEn: 'Developing Database Applications (MySQL)',
      nameAr: 'تطوير تطبيقات قواعد البيانات',
      image: '/images/subjects/developing-database-applications.png',
      side: 'نظري + عملي' as const,
      instructorTheory: { nameAr: 'أ. أسماء' },
      instructorPractical: { nameAr: 'أ. أسماء' },
    },
    {
      id: 's1-5',
      nameEn: 'Information Technology Management',
      nameAr: 'إدارة تقنية المعلومات',
      image: '/images/subjects/it-management.png',
      side: 'نظري فقط' as const,
      instructorTheory: { nameAr: 'أ. زايد' },
    },
    {
      id: 's1-6',
      nameEn: 'Cloud Computing and Web Services',
      nameAr: 'الحوسبة السحابية وخدمات الويب',
      image: '/images/subjects/cloud-computing.png',
      side: 'نظري + عملي' as const,
      instructorTheory: { nameAr: 'د. محمد' },
      instructorPractical: { nameAr: 'أ. مريم' },
    },
  ],

  // ── Semester 2 subjects (Study Plan) ──
  semester2: [
    {
      id: 's2-1',
      nameEn: 'Open Source Concepts & Programming',
      nameAr: 'مفاهيم البرمجة مفتوحة المصدر',
      image: '/images/subjects/open-source.png',
      side: 'قريباً' as const,
    },
    {
      id: 's2-2',
      nameEn: 'Research Methods',
      nameAr: 'مناهج البحث العلمي',
      image: '/images/subjects/research-methods.png',
      side: 'قريباً' as const,
    },
    {
      id: 's2-3',
      nameEn: 'Industrial Training',
      nameAr: 'التدريب الميداني',
      image: '/images/subjects/industrial-training.png',
      side: 'قريباً' as const,
    },
    {
      id: 's2-4',
      nameEn: 'Human Computer Interaction',
      nameAr: 'تفاعل الإنسان والحاسب',
      image: '/images/subjects/human-computer-interaction.png',
      side: 'قريباً' as const,
    },
    {
      id: 's2-5',
      nameEn: 'Enterprise Application Development',
      nameAr: 'تطوير تطبيقات المؤسسات',
      image: '/images/subjects/enterprise-app-development.png',
      side: 'قريباً' as const,
    },
  ],

  // ── Schedule (kept empty — exams page starts empty) ──
  schedule: [],

  // ── Subject Materials (Semester 1 only, Semester 2 = coming soon) ──
  subjectMaterials: [
    {
      id: 'sm-s1-1',
      nameEn: 'Software Engineering',
      nameAr: 'هندسة البرمجيات',
      image: '/images/subjects/software-engineering.png',
      semester: 1,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1n88RA2lhpaGQa5Qz-1V3249RLXWJRAuq',
      lecturesTheory: [],
      lecturesPractical: [],
    },
    {
      id: 'sm-s1-2',
      nameEn: 'IT Projects Management',
      nameAr: 'إدارة مشاريع تقنية المعلومات',
      image: '/images/subjects/it-project-management.png',
      semester: 1,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1lm511qj_0etV2AqKlySElVQeclZ5Ps6R',
      lecturesTheory: [],
      lecturesPractical: [],
    },
    {
      id: 'sm-s1-3',
      nameEn: 'Business Intelligence',
      nameAr: 'ذكاء الأعمال',
      image: '/images/subjects/business-intelligence.png',
      semester: 1,
      bookUrl: undefined,
      lecturesTheory: [],
      lecturesPractical: [],
    },
    {
      id: 'sm-s1-4',
      nameEn: 'Developing Database Applications (MySQL)',
      nameAr: 'تطوير تطبيقات قواعد البيانات',
      image: '/images/subjects/developing-database-applications.png',
      semester: 1,
      bookUrl: 'https://drive.google.com/uc?export=download&id=1JMiWhTTtB5FhnVI5reIlSAakRsyPbhv8',
      lecturesTheory: [],
      lecturesPractical: [],
    },
    {
      id: 'sm-s1-5',
      nameEn: 'Information Technology Management',
      nameAr: 'إدارة تقنية المعلومات',
      image: '/images/subjects/it-management.png',
      semester: 1,
      bookUrl: undefined,
      lecturesTheory: [],
      lecturesPractical: [],
    },
    {
      id: 'sm-s1-6',
      nameEn: 'Cloud Computing and Web Services',
      nameAr: 'الحوسبة السحابية وخدمات الويب',
      image: '/images/subjects/cloud-computing.png',
      semester: 1,
      bookUrl: undefined,
      lecturesTheory: [],
      lecturesPractical: [],
    },
  ],

  suggestions: [],

  // ── Year exams (start empty; managed by admin) ──
  exams: [],

  // ── Weekly timetable (Semester 1) ──
  timetable: [
    {
      id: 'tt-sat',
      day: 'السبت',
      dayEn: 'Saturday',
      lectures: [
        { id: 'ttl-1', time: '8:00 - 11:00', nameEn: 'Software Engineering', nameAr: 'هندسة البرمجيات', type: 'نظري', instructor: 'د. محمد الخولاني', room: 'Hall 7' },
        { id: 'ttl-2', time: '11:00 - 2:00', nameEn: 'Information Technology Management', nameAr: 'إدارة تقنية المعلومات', type: 'نظري', instructor: 'أ. زايد', room: 'Hall 7' },
      ],
    },
    { id: 'tt-sun', day: 'الأحد', dayEn: 'Sunday', isHoliday: true, lectures: [] },
    { id: 'tt-mon', day: 'الاثنين', dayEn: 'Monday', isHoliday: true, lectures: [] },
    {
      id: 'tt-tue',
      day: 'الثلاثاء',
      dayEn: 'Tuesday',
      lectures: [
        { id: 'ttl-3', time: '8:00 - 11:00', nameEn: 'Developing Database Applications (MySQL)', nameAr: 'تطوير تطبيقات قواعد البيانات', type: 'عملي', instructor: 'أ. أسماء', room: 'Lab 3 GB' },
        { id: 'ttl-4', time: '11:00 - 2:00', nameEn: 'Developing Database Applications (MySQL)', nameAr: 'تطوير تطبيقات قواعد البيانات', type: 'عملي', instructor: 'أ. أسماء', room: 'Lab 3 GA' },
      ],
    },
    {
      id: 'tt-wed',
      day: 'الأربعاء',
      dayEn: 'Wednesday',
      lectures: [
        { id: 'ttl-5', time: '11:00 - 2:00', nameEn: 'Business Intelligence', nameAr: 'ذكاء الأعمال', type: 'نظري', instructor: 'د. قيس النزيلي', room: 'Hall 7' },
        { id: 'ttl-6', time: '2:00 - 4:00', nameEn: 'Cloud Computing and Web Services', nameAr: 'الحوسبة السحابية وخدمات الويب', type: 'نظري', instructor: 'د. محمد', room: 'Hall 7' },
      ],
    },
    {
      id: 'tt-thu',
      day: 'الخميس',
      dayEn: 'Thursday',
      lectures: [
        { id: 'ttl-7', time: '8:00 - 10:00', nameEn: 'IT Projects Management', nameAr: 'إدارة مشاريع تقنية المعلومات', type: 'نظري', instructor: 'د. حسن الجرادي', room: 'Hall 2' },
        { id: 'ttl-8', time: '10:00 - 12:00', nameEn: 'Cloud Computing and Web Services', nameAr: 'الحوسبة السحابية وخدمات الويب', type: 'عملي', instructor: 'أ. مريم', room: 'Lab 6 GB' },
        { id: 'ttl-9', time: '12:00 - 2:00', nameEn: 'IT Projects Management', nameAr: 'إدارة مشاريع تقنية المعلومات', type: 'عملي', instructor: 'أ. دلال', room: 'Lab 4 GB' },
        { id: 'ttl-10', time: '10:00 - 12:00', nameEn: 'IT Projects Management', nameAr: 'إدارة مشاريع تقنية المعلومات', type: 'عملي', instructor: 'أ. دلال', room: 'Lab 4 GA' },
        { id: 'ttl-11', time: '10:00 - 12:00', nameEn: 'Cloud Computing and Web Services', nameAr: 'الحوسبة السحابية وخدمات الويب', type: 'عملي', instructor: 'أ. مريم', room: 'Lab 6 GA' },
      ],
    },
  ],

  // ── Faculty members (managed by admin) ──
  instructors: [
    { id: 'ins-1', nameAr: 'د. محمد الخولاني', degree: 'دكتور' },
    { id: 'ins-2', nameAr: 'د. حسن الجرادي', degree: 'دكتور' },
    { id: 'ins-3', nameAr: 'د. قيس النزيلي', degree: 'دكتور' },
    { id: 'ins-4', nameAr: 'د. محمد', degree: 'دكتور' },
    { id: 'ins-5', nameAr: 'أ. أسماء', degree: 'أستاذ' },
    { id: 'ins-6', nameAr: 'أ. زايد', degree: 'أستاذ' },
    { id: 'ins-7', nameAr: 'أ. مريم', degree: 'أستاذ' },
    { id: 'ins-8', nameAr: 'أ. دلال', degree: 'أستاذ' },
  ],

  // ── Home page content (managed by admin) ──
  homeContent: {
    heroTagline: 'العام الأكاديمي ٢٠٢٦ - ٢٠٢٧م',
    heroTitle: 'كل ما تحتاجه',
    heroSubtitle: 'في مكان واحد',
    heroDescription: 'استعرض الخطط الدراسية، الجداول، المواد، وشارك آراءك — كل شيء بين يديك',
    announcements: [],
  },

  // ── Site settings (managed by admin) ──
  settings: {
    timetableDownloadUrl: 'https://drive.google.com/uc?export=download&id=1MENlkQ4AIT4Fh2cnducy99rP8k1ddvRG',
  },
}

// ── Context ───────────────────────────────────────────────
interface AppContextType {
  data: AppData
  isAdmin: boolean
  /** True while the initial data load is in progress. */
  isLoading: boolean
  /** True while a change is being committed to GitHub. */
  isSaving: boolean
  setIsAdmin: (v: boolean) => void
  /** Verifies the password on the server; returns true on success. */
  loginAdmin: (password: string) => Promise<boolean>
  /** Ends the admin session on the server. */
  logoutAdmin: () => Promise<void>
  updateSemester1: (subjects: Subject[]) => void
  updateSemester2: (subjects: Subject[]) => void
  updateSchedule: (schedule: DaySchedule[]) => void
  updateSubjectMaterials: (materials: SubjectMaterial[]) => void
  updateExams: (exams: Exam[]) => void
  updateTimetable: (timetable: TimetableDay[]) => void
  updateInstructors: (instructors: Instructor[]) => void
  updateHomeContent: (content: HomeContent) => void
  updateSettings: (settings: SiteSettings) => void
  addSuggestion: (s: Omit<Suggestion, 'id' | 'date'>) => void
  addReply: (id: string, reply: string) => void
  deleteSuggestion: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData)
  const [isAdmin, setIsAdminState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load the canonical data (from GitHub via the API) and restore session.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [dataRes, sessionRes] = await Promise.all([
          fetch('/api/data', { cache: 'no-store' }),
          fetch('/api/admin/session', { cache: 'no-store' }),
        ])
        if (!cancelled && dataRes.ok) {
          const json = await dataRes.json()
          if (json?.data) {
            const loaded = json.data as Partial<AppData>
            // Merge with defaults so older data missing new fields stays valid.
            setData({
              ...defaultData,
              ...loaded,
              exams: loaded.exams ?? [],
              timetable: loaded.timetable ?? defaultData.timetable,
              instructors: loaded.instructors ?? defaultData.instructors,
              homeContent: {
                ...defaultData.homeContent,
                ...(loaded.homeContent ?? {}),
                announcements: loaded.homeContent?.announcements ?? [],
              },
              settings: { ...defaultData.settings, ...(loaded.settings ?? {}) },
            })
          }
        }
        if (!cancelled && sessionRes.ok) {
          const json = await sessionRes.json()
          setIsAdminState(Boolean(json?.isAdmin))
        }
      } catch {
        // Keep default data if the request fails.
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  /**
   * Optimistically updates local state, then commits the full data set
   * to GitHub through the API. On failure the previous state is restored.
   */
  const save = (next: AppData, message?: string) => {
    const previous = data
    setData(next)
    setIsSaving(true)
    ;(async () => {
      try {
        const res = await fetch('/api/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: next, message }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.log('[v0] Failed to save data:', err?.error)
          setData(previous)
        }
      } catch (e) {
        console.log('[v0] Error saving data:', e)
        setData(previous)
      } finally {
        setIsSaving(false)
      }
    })()
  }

  const setIsAdmin = (v: boolean) => setIsAdminState(v)

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setIsAdminState(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logoutAdmin = async (): Promise<void> => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {}
    setIsAdminState(false)
  }

  return (
    <AppContext.Provider
      value={{
        data,
        isAdmin,
        isLoading,
        isSaving,
        setIsAdmin,
        loginAdmin,
        logoutAdmin,
        updateSemester1: (s) => save({ ...data, semester1: s }, 'chore(data): update semester 1 subjects'),
        updateSemester2: (s) => save({ ...data, semester2: s }, 'chore(data): update semester 2 subjects'),
        updateSchedule: (s) => save({ ...data, schedule: s }, 'chore(data): update schedule'),
        updateSubjectMaterials: (m) => save({ ...data, subjectMaterials: m }, 'chore(data): update subject materials'),
        updateExams: (e) => save({ ...data, exams: e }, 'chore(data): update year exams'),
        updateTimetable: (t) => save({ ...data, timetable: t }, 'chore(data): update timetable'),
        updateInstructors: (i) => save({ ...data, instructors: i }, 'chore(data): update instructors'),
        updateHomeContent: (c) => save({ ...data, homeContent: c }, 'chore(data): update home content'),
        updateSettings: (s) => save({ ...data, settings: s }, 'chore(data): update site settings'),
        addSuggestion: (s) => {
          const newS: Suggestion = {
            ...s,
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
          }
          save({ ...data, suggestions: [...data.suggestions, newS] }, 'chore(data): add suggestion')
        },
        addReply: (id, reply) => {
          save(
            {
              ...data,
              suggestions: data.suggestions.map((s) =>
                s.id === id ? { ...s, reply } : s,
              ),
            },
            'chore(data): reply to suggestion',
          )
        },
        deleteSuggestion: (id) => {
          save(
            {
              ...data,
              suggestions: data.suggestions.filter((s) => s.id !== id),
            },
            'chore(data): delete suggestion',
          )
        },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
