export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, useWebSearch, userApiKey } = req.body;
  const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY || "";

  if (!apiKey) {
    return res.status(400).json({
      error: "API 키가 없습니다. 프로필 설정에서 Claude API 키를 입력하거나, Vercel 환경변수 ANTHROPIC_API_KEY를 설정해주세요.",
    });
  }

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  };
  if (useWebSearch) headers["anthropic-beta"] = "web-search-2025-03-05";

  const body = {
    model: useWebSearch ? "claude-3-5-sonnet-20241022" : "claude-sonnet-4-6",
    max_tokens: useWebSearch ? 4000 : 2000,
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
