import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  variant?: 'default' | 'live' | 'finished' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-transparent'

  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-slate-800/80 text-slate-100 border-slate-700/80',
    live: 'bg-red-500/15 text-red-300 border-red-500/40',
    finished: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
    muted: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
  }

  return <span className={`${base} ${variants[variant]} ${className ?? ''}`}>{children}</span>
}

