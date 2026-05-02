import { createClient } from '@supabase/supabase-js'

// USD per 1M tokens (Anthropic / Google 공식 가격 기준 — 변경 시 여기만 수정)
const PRICING = {
  'claude-sonnet-4-6': { input: 3.00,  output: 15.00 },
  'claude-sonnet-4-5': { input: 3.00,  output: 15.00 },
  'claude-opus-4-7':   { input: 15.00, output: 75.00 },
  'claude-haiku-4-5':  { input: 1.00,  output: 5.00  },
  'gemini-2.0-flash':  { input: 0.10,  output: 0.40  },
  'gemini-2.5-flash':  { input: 0.30,  output: 2.50  },
}

export function calcCostUsd(model, inputTokens = 0, outputTokens = 0) {
  const p = PRICING[model] || { input: 0, output: 0 }
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000
}

let _admin = null
function adminClient() {
  if (_admin) return _admin
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  _admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return _admin
}

// Bearer 토큰에서 user 추출 (없거나 무효면 null 반환 — 호출자는 익명으로 진행)
export async function getUserFromAuth(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const sb = adminClient()
  if (!sb) return null
  const { data, error } = await sb.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

// 사용량 기록 — 실패해도 throw 하지 않음 (메인 API 흐름에 영향 X)
export async function logUsage({ userId, provider, model, inputTokens, outputTokens, webSearch, source }) {
  if (!userId) return
  const sb = adminClient()
  if (!sb) return
  const cost = calcCostUsd(model, inputTokens, outputTokens)
  try {
    await sb.from('api_usage').insert({
      user_id: userId,
      provider,
      model: model || null,
      input_tokens: inputTokens || 0,
      output_tokens: outputTokens || 0,
      cost_usd: cost,
      web_search: !!webSearch,
      source: source || 'server',
    })
  } catch (e) {
    console.error('[api_usage] insert failed:', e?.message)
  }
}
