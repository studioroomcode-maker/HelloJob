import { getUserFromAuth, logUsage } from '../_lib/usage.js'

// 브라우저에서 직접 Anthropic/Gemini를 호출한 경우, 사후 사용량 보고용 엔드포인트
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: "인증이 필요합니다." })

  const { provider, model, inputTokens, outputTokens, webSearch } = req.body || {}
  if (!provider || (provider !== 'claude' && provider !== 'gemini')) {
    return res.status(400).json({ error: "provider가 올바르지 않습니다." })
  }

  await logUsage({
    userId: user.id,
    provider,
    model,
    inputTokens: Number(inputTokens) || 0,
    outputTokens: Number(outputTokens) || 0,
    webSearch: !!webSearch,
    source: 'browser',
  })

  return res.status(200).json({ ok: true })
}
