import type { ReactNode } from 'react'

type TableProps = {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-auto rounded-2xl border border-white/10 bg-white/5">
      <table className={`w-full min-w-[720px] border-collapse ${className ?? ''}`}>{children}</table>
    </div>
  )
}

