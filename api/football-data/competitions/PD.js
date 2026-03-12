const BASE_URL = 'https://api.football-data.org/v4/competitions/PD'

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

  try {
    const upstreamRes = await fetch(BASE_URL, {
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

