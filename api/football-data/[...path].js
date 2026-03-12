const BASE_URL = 'https://api.football-data.org/v4'

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
  res.setHeader('Access-Control-Max-Age', '86400')
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const token = process.env.FOOTBALL_DATA_TOKEN
  if (!token) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(
      JSON.stringify({
        error: 'Missing env var FOOTBALL_DATA_TOKEN',
        hint: 'Configura FOOTBALL_DATA_TOKEN en tu proveedor (Vercel/Netlify).',
      }),
    )
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
    const upstreamRes = await fetch(upstreamUrl, {
      headers: {
        'X-Auth-Token': token,
      },
    })

    const text = await upstreamRes.text()

    res.statusCode = upstreamRes.status
    res.setHeader(
      'Content-Type',
      upstreamRes.headers.get('content-type') ?? 'application/json; charset=utf-8',
    )
    res.end(text)
  } catch (err) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: 'Upstream request failed' }))
  }
}

