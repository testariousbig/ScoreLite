import { NavLink, Route, Routes } from 'react-router-dom'
import { MatchesPage } from './pages/MatchesPage'
import { StandingsPage } from './pages/StandingsPage'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-400 via-sky-400 to-indigo-500 text-slate-950 shadow-lg shadow-emerald-500/40">
              <span className="text-sm font-black tracking-tight">SL</span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">ScoreLite</div>
              <div className="text-sm text-slate-300">LaLiga (Primera División)</div>
            </div>
          </div>

          <nav className="flex gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5',
                ].join(' ')
              }
            >
              Partidos
            </NavLink>
            <NavLink
              to="/clasificacion"
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5',
                ].join(' ')
              }
            >
              Clasificación
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<MatchesPage />} />
          <Route path="/clasificacion" element={<StandingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
