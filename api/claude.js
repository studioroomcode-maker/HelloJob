export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, useWebSearch } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY || "";

  if (!apiKey) {
    return res.status(400).json({
      error: "서버에 API 키가 설정되지 않았습니다. Vercel 환경변수 ANTHROPIC_API_KEY를 설정해주세요.",
    });
  }

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  };
  if (useWebSearch) headers["anthropic-beta"] = "web-search-2025-03-05";

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: useWebSearch ? 4000 : 4000,
    system: "You are a job search API. Respond ONLY with a valid JSON array. No explanations, no markdown, no text outside the JSON array. Start with [ and end with ]. CRITICAL: The 'url' field must be the direct URL to the specific job posting detail page (e.g. https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=12345). Never use a site's main/home URL. If you cannot find the exact posting URL, construct the most specific search URL possible.",
    messages: [{ role: "user", content: prompt }],
  };
  if (useWebSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
