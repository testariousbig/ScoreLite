const BASE_URL = 'https://api.football-data.org/v4/competitions/PD/matches'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const token = process.env.FOOTBALL_DATA_TOKEN
  if (!token) {
    res.status(500).json({ error: 'Missing env var FOOTBALL_DATA_TOKEN' })
    return
  }

  const url = new URL(BASE_URL)
  for (const [k, v] of Object.entries(req.query ?? {})) {
    if (Array.isArray(v)) {
      for (const item of v) url.searchParams.append(k, item)
    } else if (typeof v === 'string') {
      url.searchParams.set(k, v)
    }
  }

  try {
    const upstreamRes = await fetch(url.toString(), {
      headers: { 'X-Auth-Token': token },
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

