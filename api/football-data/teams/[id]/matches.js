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

  const { id } = req.query
  if (!id) {
    res.status(400).json({ error: 'Missing team id' })
    return
  }

  try {
    // Construir la URL con query parameters
    const BASE_URL = `https://api.football-data.org/v4/teams/${id}/matches`
    const url = new URL(BASE_URL)
    
    // Añadir query parameters si existen
    if (req.query.dateFrom) url.searchParams.set('dateFrom', req.query.dateFrom)
    if (req.query.dateTo) url.searchParams.set('dateTo', req.query.dateTo)
    if (req.query.limit) url.searchParams.set('limit', req.query.limit)

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
    console.error('Error in teams/[id]/matches handler:', err)
    res.status(502).json({ error: 'Upstream request failed' })
  }
}
