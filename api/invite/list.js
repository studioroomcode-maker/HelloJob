import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '인증이 필요합니다.' })

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user || user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: '관리자 권한이 없습니다.' })
  }

  const { data: codes, error: listErr } = await supabase
    .from('invite_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (listErr) return res.status(500).json({ error: '목록 조회에 실패했습니다.' })

  // Enrich with user emails
  const usedIds = codes.filter(c => c.used_by).map(c => c.used_by)
  const emailMap = {}

  if (usedIds.length > 0) {
    const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    users?.users?.forEach(u => {
      if (usedIds.includes(u.id)) emailMap[u.id] = u.email
    })
  }

  const enriched = codes.map(c => ({
    ...c,
    used_by_email: c.used_by ? emailMap[c.used_by] || null : null,
  }))

  return res.status(200).json({ codes: enriched })
}
