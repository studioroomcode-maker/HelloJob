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

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
  if (authErr || !user || user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: '관리자 권한이 없습니다.' })
  }

  // 전체 유저 목록
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 })

  // 유저 프로필 (활성화 여부 + 사용한 초대코드)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, activated, invite_code, created_at')

  const profileMap = {}
  profiles?.forEach(p => { profileMap[p.id] = p })

  const users = (authUsers?.users || []).map(u => {
    const profile = profileMap[u.id] || {}
    return {
      id: u.id,
      email: u.email,
      provider: u.app_metadata?.provider || u.identities?.[0]?.provider || 'unknown',
      activated: profile.activated ?? false,
      invite_code: profile.invite_code || null,
      joined_at: u.created_at,
    }
  }).sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at))

  return res.status(200).json({ users })
}
