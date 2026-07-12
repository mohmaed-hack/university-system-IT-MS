'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Star,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_NUMBER = '967782136907'
const CONTACT_EMAIL = 'mohmaedsaeedalli2021@gmail.com'

type MessageType = 'استفسار' | 'اقتراح' | 'شكوى' | 'شكر' | 'أخرى'

const messageTypes: MessageType[] = ['استفسار', 'اقتراح', 'شكوى', 'شكر', 'أخرى']

export function SuggestionsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'استفسار' as MessageType,
    message: '',
    rating: 0,
  })
  const [hoveredStar, setHoveredStar] = useState(0)

  const buildWhatsAppMessage = () => {
    const lines = [
      `الاسم: ${form.name}`,
      `البريد: ${form.email}`,
      form.phone ? `الجوال: ${form.phone}` : null,
      `نوع الرسالة: ${form.type}`,
      `التقييم: ${'⭐'.repeat(form.rating)} (${form.rating}/5)`,
      ``,
      `الرسالة:`,
      form.message,
    ].filter(Boolean)
    return encodeURIComponent(lines.join('\n'))
  }

  const buildEmailSubject = () => {
    return encodeURIComponent(`[${form.type}] من ${form.name} - بوابة الجامعة`)
  }

  const buildEmailBody = () => {
    const lines = [
      `الاسم الكامل: ${form.name}`,
      `البريد الإلكتروني: ${form.email}`,
      form.phone ? `رقم الجوال: ${form.phone}` : null,
      `نوع الرسالة: ${form.type}`,
      `التقييم: ${'⭐'.repeat(form.rating)} (${form.rating}/5 نجوم)`,
      ``,
      `الرسالة:`,
      form.message,
      ``,
      `---`,
      `أُرسلت من بوابة الجامعة`,
    ].filter(Boolean)
    return encodeURIComponent(lines.join('\n'))
  }

  const handleWhatsAppSend = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`
    window.open(url, '_blank')
  }

  const handleEmailSend = () => {
    const subject = buildEmailSubject()
    const body = buildEmailBody()
    const url = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    window.location.href = url
  }

  const isFormValid = form.name.trim() && form.email.trim() && form.message.trim()

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="size-5 text-gold" />
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">الاستفسار والتواصل</h2>
          <Sparkles className="size-5 text-gold" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Contact & Inquiry
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gold/5 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5" />
              الاسم الكامل
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="أدخل اسمك الكامل..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/80
                text-sm text-foreground placeholder:text-muted-foreground/50
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                hover:border-primary/30 transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/80
                text-sm text-foreground placeholder:text-muted-foreground/50 font-mono
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                hover:border-primary/30 transition-all duration-200 text-left"
            />
          </div>

          {/* Phone (optional) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Phone className="size-3.5" />
              رقم الجوال
              <span className="text-muted-foreground/60 font-normal">(اختياري)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+967 7XX XXX XXX"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/80
                text-sm text-foreground placeholder:text-muted-foreground/50 font-mono
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                hover:border-primary/30 transition-all duration-200 text-left"
            />
          </div>

          {/* Message Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="size-3.5" />
              نوع الرسالة
            </label>
            <div className="flex flex-wrap gap-2">
              {messageTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, type })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30',
                    form.type === type
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground">
              تقييم تجربتك
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform duration-150 hover:scale-110 focus:outline-none"
                  aria-label={`${star} نجوم`}
                >
                  <Star
                    className={cn(
                      'size-7 transition-colors duration-150',
                      (hoveredStar >= star || form.rating >= star)
                        ? 'text-gold fill-gold'
                        : 'text-muted-foreground/30'
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              {form.rating > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mr-2 text-sm font-bold text-gold"
                >
                  {form.rating}/5
                </motion.span>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">
              الرسالة
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="اكتب رسالتك هنا..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/80
                text-sm text-foreground placeholder:text-muted-foreground/50
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                hover:border-primary/30 transition-all duration-200 resize-none"
            />
          </div>

          {/* Send Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleWhatsAppSend}
              disabled={!isFormValid}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/30',
                isFormValid
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-sm'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="size-4" />
              إرسال عبر واتساب
            </button>

            <button
              onClick={handleEmailSend}
              disabled={!isFormValid}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
                isFormValid
                  ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-sm'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Mail className="size-4" />
              إرسال عبر البريد
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-xs text-muted-foreground/60 leading-relaxed"
      >
        سيتم الرد على رسالتك في أقرب وقت ممكن
      </motion.p>
    </div>
  )
}
