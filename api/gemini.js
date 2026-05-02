import { getUserFromAuth, logUsage } from './_lib/usage.js'

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    return res.status(400).json({
      error: "서버에 API 키가 설정되지 않았습니다. Vercel 환경변수 GEMINI_API_KEY를 설정해주세요.",
    });
  }

  const model = "gemini-2.0-flash";

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "You are a job search API. Respond ONLY with a valid JSON array. No explanations, no markdown, no text outside the JSON array. Start with [ and end with ]." }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 4000 },
        }),
      }
    );
    const data = await upstream.json();

    if (upstream.ok && data?.usageMetadata) {
      const user = await getUserFromAuth(req);
      if (user) {
        await logUsage({
          userId: user.id,
          provider: 'gemini',
          model,
          inputTokens: data.usageMetadata.promptTokenCount || 0,
          outputTokens: data.usageMetadata.candidatesTokenCount || 0,
          webSearch: false,
          source: 'server',
        });
      }
    }

    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
