'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ToastTone = 'success' | 'neutral' | 'warning'

type ToastState = {
  id: number
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    if (!toast) return

    const timeout = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const value = useMemo<ToastContextValue>(() => {
    return {
      showToast: (message, tone = 'success') => {
        setToast({ id: Date.now(), message, tone })
      },
    }
  }, [])

  const toneClass =
    toast?.tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : toast?.tone === 'neutral'
        ? 'border-slate-200 bg-white text-slate-900'
        : 'border-emerald-200 bg-emerald-50 text-emerald-900'

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg ${toneClass}`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}

export function ToastHost() {
  return null
}