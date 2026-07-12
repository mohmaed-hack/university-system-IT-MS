'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { DarkModeToggle } from './dark-mode-toggle'
import { useApp } from '@/lib/app-context'
import { MainDashboard } from './main-dashboard'

export function WelcomePage() {
  const { setIsAdmin, loginAdmin } = useApp()
  const [view, setView] = useState<'welcome' | 'admin-login' | 'dashboard' | 'admin-dashboard'>('welcome')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAdminLogin = async () => {
    if (loading) return
    setLoading(true)
    const ok = await loginAdmin(password)
    setLoading(false)
    if (ok) {
      setView('admin-dashboard')
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setPassword('')
    }
  }

  const handleStudentEnter = () => {
    setIsAdmin(false)
    setView('dashboard')
  }

  if (view === 'dashboard' || view === 'admin-dashboard') {
    return <MainDashboard />
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 bg-primary translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5 bg-gold translate-x-[-30%] translate-y-[30%]" />
        {/* Decorative dots grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Dark mode toggle */}
      <div className="absolute top-5 left-5 z-20">
        <DarkModeToggle />
      </div>

      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center gap-10 px-6 text-center w-full max-w-2xl"
          >
            {/* University Emblem */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 120 }}
              className="relative"
            >
              <div className="relative flex items-center justify-center size-28 rounded-full bg-primary shadow-2xl animate-float">
                <GraduationCap className="size-14 text-primary-foreground" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-full animate-pulse-ring" />
              </div>
            </motion.div>

            {/* Title & Welcome */}
            <div className="flex flex-col gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p className="text-sm font-semibold tracking-widest text-gold uppercase mb-2">
                  Academic Year 2026 - 2027
                </p>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight text-balance">
                  بوابة الجامعة
                  <span className="block text-shimmer text-3xl sm:text-4xl mt-1">
                    University Portal
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg mx-auto text-balance"
              >
                مرحباً بك في البوابة الأكاديمية — كل ما تحتاجه في مكان واحد، من الخطة الدراسية إلى الجداول والمواد
              </motion.p>
            </div>

            {/* Two choice cards */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 w-full justify-center"
            >
              {/* Student Card */}
              <button
                onClick={handleStudentEnter}
                className="group relative flex flex-col items-center gap-4 p-7 rounded-2xl border border-border bg-card
                  cursor-pointer transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:border-primary/40
                  focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-56"
              >
                {/* Animated border glow */}
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ boxShadow: '0 0 0 2px oklch(0.28 0.09 255 / 0.25), 0 8px 32px oklch(0.28 0.09 255 / 0.15)' }}
                />
                <div className="relative flex items-center justify-center size-16 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                  <GraduationCap className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  {/* Orbit animation */}
                  <span className="absolute inset-0 rounded-xl border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">الطالب</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Student Portal</p>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  تصفح الخطة الدراسية والجداول والمواد
                </p>
                <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  دخول ← Enter
                </span>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => { setView('admin-login'); setError(false); setPassword('') }}
                className="group relative flex flex-col items-center gap-4 p-7 rounded-2xl border border-border bg-card
                  cursor-pointer transition-all duration-400 hover:scale-105 hover:shadow-2xl hover:border-gold/40
                  focus:outline-none focus:ring-2 focus:ring-gold/50 w-full sm:w-56"
              >
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ boxShadow: '0 0 0 2px oklch(0.75 0.12 85 / 0.25), 0 8px 32px oklch(0.75 0.12 85 / 0.15)' }}
                />
                <div className="relative flex items-center justify-center size-16 rounded-xl bg-gold/10 group-hover:bg-gold/15 transition-colors duration-300">
                  <ShieldCheck className="size-8 text-gold transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  <span className="absolute inset-0 rounded-xl border-2 border-gold/20 group-hover:border-gold/50 transition-all duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">المشرف</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  إدارة المحتوى والتعديل والإضافة
                </p>
                <span className="text-xs font-semibold text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  دخول ← Enter
                </span>
              </button>
            </motion.div>

            {/* Bottom label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xs text-muted-foreground"
            >
              العام الدراسي ٢٠٢٦ - ٢٠٢٧م
            </motion.p>
          </motion.div>
        )}

        {view === 'admin-login' && (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-sm px-6"
          >
            <motion.div
              animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-2xl flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center justify-center size-14 rounded-xl bg-gold/10 border border-gold/20">
                  <ShieldCheck className="size-7 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">دخول المشرف</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Admin Login</p>
                </div>
              </div>

              {/* Password input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false) }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="أدخل كلمة المرور..."
                    className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm bg-background
                      focus:outline-none focus:ring-2 transition-all duration-200
                      ${error
                        ? 'border-destructive focus:ring-destructive/30 text-destructive'
                        : 'border-border focus:ring-primary/30 text-foreground'
                      }`}
                    dir="ltr"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-destructive text-xs font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      كلمة المرور غير صحيحة، يرجى المحاولة مجدداً
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAdminLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm
                    hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'جارٍ التحقق...' : 'دخول'}
                </button>
                <button
                  onClick={() => { setView('welcome'); setError(false); setPassword('') }}
                  className="w-full py-3 rounded-xl border border-border text-muted-foreground font-medium text-sm
                    hover:bg-muted/50 active:scale-95 transition-all duration-200"
                >
                  رجوع
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
