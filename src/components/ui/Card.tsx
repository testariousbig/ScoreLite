import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className ?? ''}`}>
      {children}
    </div>
  )
}

