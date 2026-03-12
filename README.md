# ScoreLite — Resultados LaLiga (React + Proxy serverless)

ScoreLite es una SPA en React que muestra **partidos por jornada** y **clasificación** de LaLiga usando `football-data.org` (código de competición `PD`).

## Requisitos

- Node.js instalado
- Token de `football-data.org`

## Variables de entorno

El proxy serverless usa esta variable:

- `FOOTBALL_DATA_TOKEN`: token para el header `X-Auth-Token`

En local puedes crear `.env.local` (no lo subas a git) basado en `.env.example`.

## Ejecutar en local

### Front (solo UI)

Esto levanta Vite, pero **no ejecuta** las funciones serverless:

```bash
npm run dev
```

### Front + Proxy (recomendado)

Usa Vercel Dev para ejecutar `api/` localmente:

```bash
npm run dev:vercel
```

Después abre la URL que muestre el comando (Vercel Dev suele levantar el proyecto completo).

## Despliegue (Vercel)

1. Importa el repo en Vercel.
2. Configura `FOOTBALL_DATA_TOKEN` en **Project Settings → Environment Variables**.
3. Deploy.

Las rutas del proxy quedan disponibles bajo:

- `/api/football-data/competitions/PD`
- `/api/football-data/competitions/PD/matches?matchday=1`
- `/api/football-data/competitions/PD/standings`

