'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function DarkModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          'size-10 rounded-full bg-muted animate-pulse',
          className,
        )}
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative flex items-center justify-center size-11 rounded-full',
        'transition-all duration-500 cursor-pointer',
        'bg-card border border-border shadow-sm',
        'hover:scale-110 hover:shadow-md',
        isDark
          ? 'hover:border-yellow-400/50 hover:bg-yellow-400/10'
          : 'hover:border-primary/30 hover:bg-primary/5',
        className,
      )}
      aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
    >
      <span
        className={cn(
          'absolute transition-all duration-500',
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50',
        )}
      >
        <Moon className="size-5 text-yellow-400" />
      </span>
      <span
        className={cn(
          'absolute transition-all duration-500',
          !isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
        )}
      >
        <Sun className="size-5 text-primary" />
      </span>
    </button>
  )
}
