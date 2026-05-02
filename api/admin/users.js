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

  // API 사용량 집계
  const { data: usage } = await supabase
    .from('api_usage')
    .select('user_id, provider, input_tokens, output_tokens, cost_usd, created_at')

  const usageMap = {}
  usage?.forEach(u => {
    const key = u.user_id
    if (!key) return
    if (!usageMap[key]) {
      usageMap[key] = {
        calls: 0, input_tokens: 0, output_tokens: 0, cost_usd: 0,
        claude_calls: 0, gemini_calls: 0,
        last_used_at: null,
      }
    }
    const m = usageMap[key]
    m.calls += 1
    m.input_tokens += u.input_tokens || 0
    m.output_tokens += u.output_tokens || 0
    m.cost_usd += Number(u.cost_usd) || 0
    if (u.provider === 'claude') m.claude_calls += 1
    if (u.provider === 'gemini') m.gemini_calls += 1
    if (!m.last_used_at || u.created_at > m.last_used_at) m.last_used_at = u.created_at
  })

  const users = (authUsers?.users || []).map(u => {
    const profile = profileMap[u.id] || {}
    const usg = usageMap[u.id] || {
      calls: 0, input_tokens: 0, output_tokens: 0, cost_usd: 0,
      claude_calls: 0, gemini_calls: 0, last_used_at: null,
    }
    return {
      id: u.id,
      email: u.email,
      provider: u.app_metadata?.provider || u.identities?.[0]?.provider || 'unknown',
      activated: profile.activated ?? false,
      invite_code: profile.invite_code || null,
      joined_at: u.created_at,
      usage: {
        calls: usg.calls,
        claude_calls: usg.claude_calls,
        gemini_calls: usg.gemini_calls,
        input_tokens: usg.input_tokens,
        output_tokens: usg.output_tokens,
        total_tokens: usg.input_tokens + usg.output_tokens,
        cost_usd: Number(usg.cost_usd.toFixed(6)),
        last_used_at: usg.last_used_at,
      },
    }
  }).sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at))

  return res.status(200).json({ users })
}
