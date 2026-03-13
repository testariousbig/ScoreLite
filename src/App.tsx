import { NavLink, Route, Routes } from 'react-router-dom'
import { MatchesPage } from './pages/MatchesPage'
import { StandingsPage } from './pages/StandingsPage'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo_scorelite.png"
              alt="ScoreLite"
              className="w-60"
            />
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
