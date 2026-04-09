export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.SARAMIN_API_KEY || "";
  if (!apiKey) {
    return res.status(400).json({ error: "SARAMIN_API_KEY 환경변수가 설정되지 않았습니다." });
  }

  const params = req.method === "POST" ? req.body : req.query;
  const { keywords, loc_cd, job_type, edu_lv, exp_min, exp_max, sort, count = 10, start = 0 } = params;

  const url = new URL("https://oapi.saramin.co.kr/job-search");
  url.searchParams.set("access-key", apiKey);
  url.searchParams.set("count", count);
  url.searchParams.set("start", start);
  if (keywords)  url.searchParams.set("keywords", keywords);
  if (loc_cd)    url.searchParams.set("loc_cd", loc_cd);
  if (job_type)  url.searchParams.set("job_type", job_type);
  if (edu_lv)    url.searchParams.set("edu_lv", edu_lv);
  if (exp_min != null && exp_min !== "") url.searchParams.set("exp_min", exp_min);
  if (exp_max != null && exp_max !== "") url.searchParams.set("exp_max", exp_max);
  if (sort)      url.searchParams.set("sort", sort);

  try {
    const upstream = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
