'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLoginPageProps {
  onLoginSuccess: () => void
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          onLoginSuccess()
        }, 800)
      } else {
        const data = await res.json()
        setError(data.error || 'كلمة المرور غير صحيحة')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4"
            >
              <Lock className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h1 className="text-3xl font-black text-foreground mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm">Admin Control Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                كلمة المرور الإدارية
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border bg-background text-foreground',
                    'placeholder:text-muted-foreground/50 focus:outline-none',
                    'transition-all duration-200',
                    error
                      ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                      : 'border-border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50',
                    isLoading && 'opacity-50 cursor-not-allowed',
                  )}
                  autoFocus
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-600">تم تسجيل الدخول بنجاح!</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className={cn(
                'w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200',
                'flex items-center justify-center gap-2',
                isLoading || !password
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30 active:scale-95',
              )}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  دخول لوحة التحكم
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            متاح فقط لأعضاء الإدارة
          </p>
        </div>
      </motion.div>
    </div>
  )
}
