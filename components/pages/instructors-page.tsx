'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp, type Instructor } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const EMPTY_FORM: Omit<Instructor, 'id'> = {
  nameAr: '',
  nameEn: '',
  degree: 'دكتور',
  email: '',
  phone: '',
  office: '',
  image: '',
}

export function InstructorsPage() {
  const { data, isAdmin, updateInstructors, isSaving } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)
  const [deletingInstructor, setDeletingInstructor] = useState<Instructor | null>(null)

  const instructors = data.instructors

  const handleAdd = (form: Omit<Instructor, 'id'>) => {
    const newInstructor: Instructor = { ...form, id: `ins-${Date.now()}` }
    updateInstructors([...instructors, newInstructor])
    setShowAddModal(false)
  }

  const handleUpdate = (updated: Instructor) => {
    updateInstructors(instructors.map((i) => (i.id === updated.id ? updated : i)))
    setEditingInstructor(null)
  }

  const handleDelete = (instructor: Instructor) => {
    updateInstructors(instructors.filter((i) => i.id !== instructor.id))
    setDeletingInstructor(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-foreground">أعضاء هيئة التدريس</h2>
          <p className="text-muted-foreground text-sm">Faculty Members</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-primary text-primary-foreground font-bold text-sm
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Plus className="size-4" />
            إضافة دكتور
          </button>
        )}
      </div>

      {/* List */}
      {instructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="flex items-center justify-center size-20 rounded-2xl bg-muted/60">
            <Users className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <p className="text-xl font-black text-foreground">لا يوجد أعضاء بعد</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {instructors.map((instructor) => (
              <motion.div
                key={instructor.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4
                  hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  {instructor.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={instructor.image || '/placeholder-user.jpg'}
                      alt={instructor.nameAr}
                      className="size-14 rounded-xl object-cover border border-border"
                    />
                  ) : (
                    <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10 shrink-0">
                      <GraduationCap className="size-7 text-primary" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">{instructor.nameAr}</h3>
                    {instructor.nameEn && (
                      <p className="text-xs text-muted-foreground truncate" dir="ltr">{instructor.nameEn}</p>
                    )}
                    {instructor.degree && (
                      <span className="mt-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/10 text-gold border border-gold/20">
                        {instructor.degree}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                {(instructor.email || instructor.phone || instructor.office) && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    {instructor.email && (
                      <span className="flex items-center gap-2">
                        <Mail className="size-3.5 text-primary/70 shrink-0" />
                        <span className="truncate" dir="ltr">{instructor.email}</span>
                      </span>
                    )}
                    {instructor.phone && (
                      <span className="flex items-center gap-2">
                        <Phone className="size-3.5 text-primary/70 shrink-0" />
                        <span dir="ltr">{instructor.phone}</span>
                      </span>
                    )}
                    {instructor.office && (
                      <span className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-primary/70 shrink-0" />
                        {instructor.office}
                      </span>
                    )}
                  </div>
                )}

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex gap-2 pt-3 border-t border-border/50 mt-auto">
                    <button
                      onClick={() => setEditingInstructor(instructor)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                        bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                    >
                      <Pencil className="size-3.5" />
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeletingInstructor(instructor)}
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
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <InstructorFormModal
          title="إضافة دكتور جديد"
          initial={EMPTY_FORM}
          onSubmit={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingInstructor && (
        <InstructorFormModal
          title="تعديل بيانات الدكتور"
          initial={editingInstructor}
          onSubmit={(form) => handleUpdate({ ...editingInstructor, ...form })}
          onClose={() => setEditingInstructor(null)}
        />
      )}

      {/* Delete confirmation */}
      {deletingInstructor && (
        <Dialog open={true} onOpenChange={(o) => { if (!o) setDeletingInstructor(null) }}>
          <DialogContent className="max-w-sm w-full p-6 rounded-2xl">
            <DialogTitle className="sr-only">تأكيد الحذف</DialogTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center size-12 rounded-full bg-destructive/10">
                <AlertCircle className="size-6 text-destructive" />
              </div>
              <div className="flex flex-col gap-2 text-center">
                <h3 className="font-bold text-foreground">
                  {'حذف '}
                  {deletingInstructor.nameAr}
                  {'؟'}
                </h3>
                <p className="text-sm text-muted-foreground">لا يمكن التراجع عن هذا الإجراء</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeletingInstructor(null)}
                  className="flex-1 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-semibold text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDelete(deletingInstructor)}
                  className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity font-semibold text-sm"
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

// ── Add / Edit form modal ──────────────────────────────────
function InstructorFormModal({
  title,
  initial,
  onSubmit,
  onClose,
}: {
  title: string
  initial: Omit<Instructor, 'id'> & { id?: string }
  onSubmit: (form: Omit<Instructor, 'id'>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    nameAr: initial.nameAr || '',
    nameEn: initial.nameEn || '',
    degree: initial.degree || 'دكتور',
    email: initial.email || '',
    phone: initial.phone || '',
    office: initial.office || '',
    image: initial.image || '',
  })
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    if (!form.nameAr.trim()) {
      setError(true)
      return
    }
    onSubmit({
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim() || undefined,
      degree: form.degree || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      office: form.office.trim() || undefined,
      image: form.image.trim() || undefined,
    })
  }

  const inputClass = cn(
    'px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground',
    'focus:outline-none focus:ring-2 focus:ring-primary/30',
  )

  return (
    <Dialog open={true} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-md w-full p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-black text-foreground">{title}</DialogTitle>

        <div className="flex flex-col gap-3 pt-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">الاسم بالعربية *</label>
            <input
              className={cn(inputClass, error && !form.nameAr.trim() && 'border-destructive')}
              value={form.nameAr}
              onChange={(e) => { setForm((f) => ({ ...f, nameAr: e.target.value })); setError(false) }}
              placeholder="د. اسم الدكتور"
            />
            {error && !form.nameAr.trim() && (
              <span className="text-xs text-destructive font-medium">الاسم بالعربية مطلوب</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">الاسم بالإنجليزية</label>
            <input
              dir="ltr"
              className={inputClass}
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              placeholder="Dr. Name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">الدرجة العلمية</label>
            <select
              className={inputClass}
              value={form.degree}
              onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
            >
              <option value="أستاذ دكتور">أستاذ دكتور</option>
              <option value="دكتور">دكتور</option>
              <option value="أستاذ مساعد">أستاذ مساعد</option>
              <option value="أستاذ">أستاذ</option>
              <option value="معيد">معيد</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">البريد الإلكتروني</label>
              <input
                dir="ltr"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@uni.edu"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">رقم الهاتف</label>
              <input
                dir="ltr"
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="77xxxxxxx"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">المكتب</label>
            <input
              className={inputClass}
              value={form.office}
              onChange={(e) => setForm((f) => ({ ...f, office: e.target.value }))}
              placeholder="مثال: مبنى A - الدور الثاني"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">رابط الصورة الشخصية</label>
            <input
              dir="ltr"
              className={cn(inputClass, 'font-mono')}
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://... أو /images/..."
            />
          </div>

          <div className="flex gap-2 pt-2">
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
