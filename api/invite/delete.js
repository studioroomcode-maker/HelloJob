import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

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

  const { code } = req.body
  if (!code) return res.status(400).json({ error: '코드를 지정해주세요.' })

  const { error: deleteErr } = await supabase
    .from('invite_codes')
    .delete()
    .eq('code', code)

  if (deleteErr) return res.status(500).json({ error: '삭제에 실패했습니다.' })

  return res.status(200).json({ success: true })
}
