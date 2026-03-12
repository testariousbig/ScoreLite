export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'

  return (
    <span
      className={`inline-block rounded-full border-2 border-slate-500 border-t-transparent animate-spin ${sizeClasses}`}
      role="status"
      aria-label="Cargando"
    />
  )
}

