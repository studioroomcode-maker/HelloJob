import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

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

  const { code: customCode } = req.body

  // 코드 형식 검증: 2~20자, 영문+숫자만
  if (!customCode || customCode.trim().length < 2) {
    return res.status(400).json({ error: '코드를 입력해주세요.' })
  }
  if (!/^[A-Z0-9]{2,20}$/.test(customCode.trim().toUpperCase())) {
    return res.status(400).json({ error: '영문 대문자와 숫자만 사용 가능합니다. (2~20자)' })
  }

  const newCode = customCode.trim().toUpperCase()

  const { error: insertErr } = await supabase
    .from('invite_codes')
    .insert({ code: newCode })

  if (insertErr) {
    if (insertErr.code === '23505') {
      return res.status(400).json({ error: '이미 존재하는 코드입니다.' })
    }
    return res.status(500).json({ error: '코드 생성에 실패했습니다.' })
  }

  return res.status(200).json({ code: newCode })
}
