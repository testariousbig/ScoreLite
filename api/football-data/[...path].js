const BASE_URL = 'https://api.football-data.org/v4'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const token = process.env.FOOTBALL_DATA_TOKEN
  if (!token) {
    res.status(500).json({
      error: 'Missing env var FOOTBALL_DATA_TOKEN',
      hint: 'Configura FOOTBALL_DATA_TOKEN en tu proyecto de Vercel.',
    })
    return
  }

  const pathParts = Array.isArray(req.query?.path)
    ? req.query.path
    : typeof req.query?.path === 'string'
      ? [req.query.path]
      : []

  const upstreamPath = `/${pathParts.join('/')}`
  const upstreamUrl = new URL(`${BASE_URL}${upstreamPath}`)

  for (const [k, v] of Object.entries(req.query ?? {})) {
    if (k === 'path') continue
    if (Array.isArray(v)) {
      for (const item of v) upstreamUrl.searchParams.append(k, item)
    } else if (typeof v === 'string') {
      upstreamUrl.searchParams.set(k, v)
    }
  }

  try {
    const upstreamRes = await fetch(upstreamUrl.toString(), {
      headers: {
        'X-Auth-Token': token,
      },
    })

    const text = await upstreamRes.text()

    res.status(upstreamRes.status)
    res.setHeader(
      'Content-Type',
      upstreamRes.headers.get('content-type') ?? 'application/json; charset=utf-8',
    )
    res.send(text)
  } catch (err) {
    res.status(502).json({ error: 'Upstream request failed' })
  }
}

