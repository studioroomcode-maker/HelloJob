import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { code, token } = req.body

  if (!code || !/^[A-Z0-9]{2,20}$/.test(code)) {
    return res.status(400).json({ error: '유효하지 않은 코드 형식입니다.' })
  }
  if (!token) return res.status(401).json({ error: '인증이 필요합니다.' })

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Verify JWT and get user
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
  if (authErr || !user) return res.status(401).json({ error: '인증이 만료되었습니다. 다시 로그인해주세요.' })

  // Already activated?
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('activated')
    .eq('id', user.id)
    .single()

  if (profile?.activated) return res.status(200).json({ success: true })

  // Check invite code
  const { data: invite, error: inviteErr } = await supabase
    .from('invite_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (inviteErr || !invite) return res.status(400).json({ error: '존재하지 않는 초대 코드입니다.' })
  if (invite.used) return res.status(400).json({ error: '이미 사용된 초대 코드입니다.' })

  const now = new Date().toISOString()

  // Mark code as used
  await supabase
    .from('invite_codes')
    .update({ used: true, used_by: user.id, used_at: now })
    .eq('code', code)

  // Activate user profile
  await supabase
    .from('user_profiles')
    .upsert({ id: user.id, activated: true, invite_code: code })

  return res.status(200).json({ success: true })
}
