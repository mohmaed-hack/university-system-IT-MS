'use client'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold text-foreground text-center">
          جميع الحقوق محفوظة © الدفعة الثالثة عشر 2026-2027م
        </p>
        <p className="text-xs text-muted-foreground text-center">
          جامعة الناصر | كلية الهندسة وتقنية المعلومات
        </p>
      </div>
    </footer>
  )
}