import { useState, useRef, useEffect, useMemo } from "react";

const SITES = [
  { id: "saramin", name: "사람인", color: "#2B6CB0", icon: "💼" },
  { id: "jobkorea", name: "잡코리아", color: "#E53E3E", icon: "🏢" },
  { id: "albamon", name: "알바몬", color: "#DD6B20", icon: "⏰" },
  { id: "incruit", name: "인크루트", color: "#38A169", icon: "📋" },
  { id: "wanted", name: "원티드", color: "#805AD5", icon: "🚀" },
  { id: "catch", name: "캐치", color: "#D69E2E", icon: "🎯" },
  { id: "linkareer", name: "링커리어", color: "#319795", icon: "🔗" },
  { id: "jobplanet", name: "잡플래닛", color: "#B83280", icon: "🌍" },
];

const REGIONS = [
  "전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주",
  "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

const JOB_TYPES = ["전체", "정규직", "계약직", "인턴", "아르바이트", "프리랜서", "파견직", "위촉직"];

const SALARY_MARKS = [0, 2400, 3000, 4000, 5000, 6000, 8000, 10000];

const EXPERIENCE_LEVELS = [
  { label: "전체", query: "" },
  { label: "신입", query: "신입" },
  { label: "1~3년", query: "경력 1~3년" },
  { label: "3~5년", query: "경력 3~5년" },
  { label: "5~10년", query: "경력 5~10년" },
  { label: "10년 이상", query: "경력 10년 이상" },
  { label: "경력무관", query: "경력무관" },
];

const EDUCATION_LEVELS = [
  { label: "전체", query: "" },
  { label: "학력무관", query: "학력무관" },
  { label: "고졸", query: "고졸" },
  { label: "초대졸", query: "초대졸 전문대졸" },
  { label: "대졸", query: "대졸 4년제" },
  { label: "석사", query: "석사" },
  { label: "박사", query: "박사" },
];

const INDUSTRIES = [
  { label: "전체", query: "" },
  { label: "IT/SW개발", query: "IT 소프트웨어 개발" },
  { label: "마케팅/광고", query: "마케팅 광고 홍보" },
  { label: "디자인", query: "디자인 UI UX 그래픽" },
  { label: "영업/판매", query: "영업 판매" },
  { label: "경영/사무", query: "경영 사무 행정" },
  { label: "생산/제조", query: "생산 제조 품질" },
  { label: "연구개발(R&D)", query: "연구개발 R&D" },
  { label: "교육", query: "교육 강사" },
  { label: "의료/보건", query: "의료 보건 간호" },
  { label: "금융/회계", query: "금융 회계 재무" },
  { label: "미디어/콘텐츠", query: "미디어 콘텐츠 영상 방송" },
  { label: "물류/유통", query: "물류 유통 배송" },
  { label: "서비스/외식", query: "서비스 외식 요리" },
  { label: "건설/토목", query: "건설 토목 건축" },
];

const SORT_OPTIONS = [
  { label: "관련도순", value: "relevance" },
  { label: "최신순", value: "recent" },
  { label: "연봉 높은순", value: "salary_desc" },
  { label: "마감임박순", value: "deadline" },
];

function parseJobs(text) {
  const jobs = [];
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) return parsed.filter(j => j.title && j.company);
    }
  } catch {}
  const blocks = text.split(/\n(?=\d+[\.\)]\s|#{1,3}\s|\*\*)/);
  for (const block of blocks) {
    const titleMatch = block.match(/(?:제목|title|공고)[:\s]*(.+)/i) || block.match(/\*\*(.+?)\*\*/) || block.match(/^\d+[\.\)]\s*(.+)/m);
    const companyMatch = block.match(/(?:회사|company|기업)[:\s]*(.+)/i);
    const siteMatch = block.match(/(?:사이트|site|출처|source)[:\s]*(.+)/i);
    const locationMatch = block.match(/(?:지역|location|위치|근무지)[:\s]*(.+)/i);
    const salaryMatch = block.match(/(?:급여|salary|연봉|월급)[:\s]*(.+)/i);
    const typeMatch = block.match(/(?:고용형태|type|유형|근무형태)[:\s]*(.+)/i);
    const urlMatch = block.match(/(?:링크|url|link|URL)[:\s]*(https?:\/\/\S+)/i);
    const deadlineMatch = block.match(/(?:마감|deadline|기한)[:\s]*(.+)/i);
    const expMatch = block.match(/(?:경력|experience)[:\s]*(.+)/i);
    const eduMatch = block.match(/(?:학력|education)[:\s]*(.+)/i);
    const industryMatch = block.match(/(?:업종|산업|industry)[:\s]*(.+)/i);
    if (titleMatch) {
      jobs.push({
        title: titleMatch[1].replace(/\*\*/g, "").trim(),
        company: companyMatch ? companyMatch[1].trim() : "미확인",
        site: siteMatch ? siteMatch[1].trim() : "",
        location: locationMatch ? locationMatch[1].trim() : "",
        salary: salaryMatch ? salaryMatch[1].trim() : "",
        type: typeMatch ? typeMatch[1].trim() : "",
        url: urlMatch ? urlMatch[1].trim() : "",
        deadline: deadlineMatch ? deadlineMatch[1].trim() : "",
        experience: expMatch ? expMatch[1].trim() : "",
        education: eduMatch ? eduMatch[1].trim() : "",
        industry: industryMatch ? industryMatch[1].trim() : "",
      });
    }
  }
  return jobs;
}

const labelStyle = {
  fontSize: "11px", fontWeight: 700, color: "#64748B",
  textTransform: "uppercase", letterSpacing: "0.08em",
  marginBottom: "6px", display: "block",
};
const selectStyle = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  border: "1px solid #1E293B", background: "#1E293B",
  color: "#F1F5F9", fontSize: "13px", outline: "none",
  cursor: "pointer", appearance: "none",
  fontFamily: "'Pretendard','Noto Sans KR',sans-serif",
};

function StyledSelect({ label, icon, value, onChange, options, valueKey }) {
  return (
    <div style={{ flex: 1, minWidth: "150px" }}>
      <label style={labelStyle}>{icon} {label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        {options.map((o, i) => (
          <option key={i} value={valueKey === "value" ? o.value : o.label}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Tag({ icon, text, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: color ? color + "15" : "#1E293B",
      color: color || "#94A3B8",
      padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
    }}>
      {icon} {text}
    </span>
  );
}

function JobCard({ job, index }) {
  const site = SITES.find(s => job.site?.includes(s.name) || job.site?.toLowerCase().includes(s.id));
  const accent = site?.color || "#6366F1";
  return (
    <div
      style={{
        background: "#151C2C", borderRadius: "16px", overflow: "hidden",
        border: "1px solid #1E293B", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: `fadeSlideUp 0.5s ease ${index * 0.04}s both`,
        cursor: job.url ? "pointer" : "default",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${accent}22`; e.currentTarget.style.borderColor = accent + "44"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "#1E293B"; }}
      onClick={() => job.url && window.open(job.url, "_blank")}
    >
      <div style={{ borderTop: `3px solid ${accent}` }} />
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#F1F5F9", margin: 0, lineHeight: 1.45 }}>{job.title}</h3>
            <p style={{ fontSize: "13.5px", color: accent, margin: "5px 0 0", fontWeight: 600 }}>{job.company}</p>
          </div>
          {site && (
            <span style={{ background: accent + "15", color: accent, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
              {site.icon} {site.name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
          {job.salary && <Tag icon="💰" text={job.salary} color="#22C55E" />}
          {job.type && <Tag icon="📄" text={job.type} />}
          {job.location && <Tag icon="📍" text={job.location} />}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
          {job.experience && <Tag icon="⭐" text={job.experience} color="#F59E0B" />}
          {job.education && <Tag icon="🎓" text={job.education} color="#8B5CF6" />}
          {job.industry && <Tag icon="🏭" text={job.industry} />}
          {job.deadline && <Tag icon="📅" text={job.deadline} color="#EF4444" />}
        </div>
        {job.url && (
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "11px", color: "#64748B" }}>🔗</span>
            <span style={{ fontSize: "11px", color: accent, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
              {job.url.replace(/https?:\/\//, "").split("/")[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SiteFilter({ selected, onToggle }) {
  const allSelected = selected.length === SITES.length;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <button onClick={() => onToggle(allSelected ? "__none__" : "__all__")}
        style={{
          padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
          border: `2px solid ${allSelected ? "#6366F1" : "#1E293B"}`,
          background: allSelected ? "#6366F115" : "transparent",
          color: allSelected ? "#6366F1" : "#64748B",
          fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
          fontFamily: "'Pretendard','Noto Sans KR',sans-serif",
        }}
      >{allSelected ? "✓ 전체" : "전체 선택"}</button>
      {SITES.map(site => {
        const active = selected.includes(site.id);
        return (
          <button key={site.id} onClick={() => onToggle(site.id)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "5px 12px", borderRadius: "20px",
              border: active ? `2px solid ${site.color}` : "2px solid #1E293B",
              background: active ? site.color + "18" : "transparent",
              color: active ? site.color : "#64748B",
              fontSize: "12px", fontWeight: active ? 700 : 500,
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'Pretendard','Noto Sans KR',sans-serif",
            }}
          >{site.icon} {site.name}</button>
        );
      })}
    </div>
  );
}

function ActiveFilters({ filters, onClear, onClearAll }) {
  if (filters.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "16px", animation: "fadeSlideUp 0.3s ease" }}>
      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>적용된 필터:</span>
      {filters.map((f, i) => (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "#6366F115", color: "#818CF8", padding: "4px 12px",
          borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "1px solid #6366F133",
        }}>
          {f.icon} {f.label}
          <span onClick={(e) => { e.stopPropagation(); onClear(f.key); }}
            style={{ cursor: "pointer", opacity: 0.6, fontSize: "14px", lineHeight: 1 }}>×</span>
        </span>
      ))}
      <button onClick={onClearAll} style={{ background: "transparent", border: "none", color: "#EF4444", fontSize: "12px", cursor: "pointer", fontWeight: 600, padding: "4px 8px" }}>
        전체 초기화
      </button>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function JobAggregator() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("전체");
  const [jobType, setJobType] = useState("전체");
  const [salaryIdx, setSalaryIdx] = useState(0);
  const [experience, setExperience] = useState("전체");
  const [education, setEducation] = useState("전체");
  const [industry, setIndustry] = useState("전체");
  const [selectedSites, setSelectedSites] = useState(SITES.map(s => s.id));
  const [sortBy, setSortBy] = useState("relevance");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [resultFilter, setResultFilter] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const salaryMin = SALARY_MARKS[salaryIdx] || 0;
  const salaryLabel = salaryMin === 0 ? "전체" : salaryMin >= 10000 ? "1억원 이상" : `${salaryMin.toLocaleString()}만원 이상`;

  const toggleSite = (id) => {
    if (id === "__all__") setSelectedSites(SITES.map(s => s.id));
    else if (id === "__none__") setSelectedSites([]);
    else setSelectedSites(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const clearFilter = (key) => {
    const map = { region: () => setRegion("전체"), jobType: () => setJobType("전체"), salary: () => setSalaryIdx(0), experience: () => setExperience("전체"), education: () => setEducation("전체"), industry: () => setIndustry("전체") };
    map[key]?.();
  };
  const clearAll = () => { setRegion("전체"); setJobType("전체"); setSalaryIdx(0); setExperience("전체"); setEducation("전체"); setIndustry("전체"); setSelectedSites(SITES.map(s => s.id)); };

  const activeFilters = useMemo(() => {
    const f = [];
    if (region !== "전체") f.push({ key: "region", label: region, icon: "📍" });
    if (jobType !== "전체") f.push({ key: "jobType", label: jobType, icon: "📄" });
    if (salaryMin > 0) f.push({ key: "salary", label: salaryLabel, icon: "💰" });
    if (experience !== "전체") f.push({ key: "experience", label: experience, icon: "⭐" });
    if (education !== "전체") f.push({ key: "education", label: education, icon: "🎓" });
    if (industry !== "전체") f.push({ key: "industry", label: industry, icon: "🏭" });
    return f;
  }, [region, jobType, salaryMin, salaryLabel, experience, education, industry]);

  const displayJobs = useMemo(() => {
    let list = [...jobs];
    if (resultFilter.trim()) {
      const q = resultFilter.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) || (j.industry || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "salary_desc") {
      list.sort((a, b) => {
        const ext = (s) => { const m = (s || "").match(/(\d[\d,]*)/); return m ? parseInt(m[1].replace(/,/g, "")) : 0; };
        return ext(b.salary) - ext(a.salary);
      });
    } else if (sortBy === "deadline") {
      list.sort((a, b) => (a.deadline || "z").localeCompare(b.deadline || "z"));
    }
    return list;
  }, [jobs, resultFilter, sortBy]);

  const searchJobs = async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(""); setJobs([]); setSearched(true); setResultFilter("");

    const siteNames = selectedSites.map(id => SITES.find(s => s.id === id)?.name).filter(Boolean).join(", ");
    const salaryQ = salaryMin > 0 ? (salaryMin >= 10000 ? "연봉 1억원 이상" : `연봉 ${salaryMin.toLocaleString()}만원 이상`) : "";
    const expQ = EXPERIENCE_LEVELS.find(e => e.label === experience)?.query || "";
    const eduQ = EDUCATION_LEVELS.find(e => e.label === education)?.query || "";
    const indQ = INDUSTRIES.find(i => i.label === industry)?.query || "";

    const conditions = [
      region !== "전체" && `지역: ${region}`,
      jobType !== "전체" && `고용형태: ${jobType}`,
      salaryQ && salaryQ,
      expQ && `경력: ${expQ}`,
      eduQ && `학력: ${eduQ}`,
      indQ && `업종/직종: ${indQ}`,
    ].filter(Boolean).join("\n");

    const sortMap = { recent: "최신 공고 우선", salary_desc: "연봉 높은 순서", deadline: "마감일 임박 순서", relevance: "관련도 순서" };

    const prompt = `한국 취업 사이트에서 "${keyword}" 관련 채용 공고를 검색해주세요.
검색 대상 사이트: ${siteNames}
${conditions}
정렬: ${sortMap[sortBy]}

반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.
최대 15개의 실제 채용 공고를 찾아서 반환하세요. 각 필드에 가능한 많은 정보를 포함하세요.

[
  {
    "title": "공고 제목",
    "company": "회사명",
    "site": "출처 사이트명 (사람인/잡코리아/알바몬 등)",
    "location": "근무지역",
    "salary": "급여 정보 (연봉 또는 월급 또는 시급)",
    "type": "고용형태 (정규직/계약직/인턴/아르바이트 등)",
    "experience": "경력 요건 (신입/경력 N년 등)",
    "education": "학력 요건",
    "industry": "업종/직종 분류",
    "url": "공고 URL",
    "deadline": "마감일"
  }
]`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 4000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) throw new Error(`API 오류: ${response.status}`);
      const data = await response.json();
      let allText = "";
      for (const block of data.content) { if (block.type === "text") allText += block.text + "\n"; }
      const parsed = parseJobs(allText);
      if (parsed.length > 0) setJobs(parsed);
      else setError("검색 결과를 파싱할 수 없습니다. 다른 키워드로 시도해보세요.");
    } catch (err) {
      console.error(err);
      setError(`검색 중 오류가 발생했습니다: ${err.message}`);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") searchJobs(); };
  const filterCount = activeFilters.length + (selectedSites.length < SITES.length ? 1 : 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", fontFamily: "'Pretendard','Noto Sans KR',sans-serif", color: "#F1F5F9" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        * { box-sizing:border-box; }
        input,select,button { font-family:'Pretendard','Noto Sans KR',sans-serif; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#334155; border-radius:3px; }
        select option { background:#1E293B; color:#F1F5F9; }
        input[type=range] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
          background: linear-gradient(to right, #6366F1 0%, #6366F1 ${(salaryIdx / (SALARY_MARKS.length - 1)) * 100}%, #1E293B ${(salaryIdx / (SALARY_MARKS.length - 1)) * 100}%, #1E293B 100%);
          border-radius: 3px; outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px;
          background: #6366F1; border-radius: 50%; border: 3px solid #0B0F1A;
          box-shadow: 0 0 8px #6366F166; cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px; background: #6366F1;
          border-radius: 50%; border: 3px solid #0B0F1A; cursor: pointer;
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "44px 24px 36px", background: "linear-gradient(180deg,#131B2E 0%,#0B0F1A 100%)" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center,black 30%,transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center,black 30%,transparent 70%)",
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{
              fontSize: "34px", fontWeight: 900, margin: 0,
              background: "linear-gradient(135deg,#818CF8,#6366F1,#A78BFA)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}>취업공고 통합검색</h1>
            <p style={{ color: "#64748B", fontSize: "14px", marginTop: "8px" }}>
              사람인 · 잡코리아 · 알바몬 · 인크루트 · 원티드 · 캐치 · 링커리어 · 잡플래닛
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ display: "flex", gap: "8px", background: "#1E293B", borderRadius: "16px", padding: "5px", border: "1px solid #1E293B", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 12px", gap: "10px" }}>
              <span style={{ fontSize: "18px", opacity: 0.5 }}>🔍</span>
              <input ref={inputRef} type="text" value={keyword}
                onChange={e => setKeyword(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="직무, 회사명, 키워드 검색..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F1F5F9", fontSize: "15px", fontWeight: 500, padding: "12px 0" }}
              />
            </div>
            <button onClick={searchJobs} disabled={loading || !keyword.trim()}
              style={{
                padding: "12px 28px", borderRadius: "12px", border: "none",
                background: loading ? "#4F46E5" : "linear-gradient(135deg,#6366F1,#4F46E5)",
                color: "#fff", fontSize: "15px", fontWeight: 700,
                cursor: loading ? "wait" : "pointer", opacity: !keyword.trim() ? 0.5 : 1,
                whiteSpace: "nowrap", transition: "all 0.2s",
              }}
            >{loading ? "검색중..." : "검색"}</button>
          </div>

          {/* Filter Toggle */}
          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <button onClick={() => setShowFilters(!showFilters)}
              style={{
                background: filterCount > 0 ? "#6366F115" : "transparent",
                border: filterCount > 0 ? "1px solid #6366F133" : "none",
                color: filterCount > 0 ? "#818CF8" : "#64748B",
                fontSize: "13px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "20px", transition: "all 0.2s",
              }}
            >
              <span style={{ transform: showFilters ? "rotate(180deg)" : "", transition: "transform 0.3s", display: "inline-block" }}>▼</span>
              상세 필터 {showFilters ? "접기" : "펼치기"}
              {filterCount > 0 && (
                <span style={{
                  background: "#6366F1", color: "#fff", borderRadius: "50%",
                  width: "20px", height: "20px", display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 800, marginLeft: "2px",
                }}>{filterCount}</span>
              )}
            </button>
          </div>

          {/* ─── FILTERS PANEL ─── */}
          {showFilters && (
            <div style={{ marginTop: "14px", background: "#111827", borderRadius: "16px", padding: "24px", border: "1px solid #1E293B", animation: "fadeSlideUp 0.3s ease" }}>
              {/* Sites */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>🌐 검색 사이트</label>
                <SiteFilter selected={selectedSites} onToggle={toggleSite} />
              </div>

              <div style={{ height: "1px", background: "#1E293B", margin: "4px 0 20px" }} />

              {/* Salary Slider */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>💰 연봉 범위</label>
                <div style={{ padding: "4px 4px 0" }}>
                  <input type="range" min={0} max={SALARY_MARKS.length - 1} value={salaryIdx}
                    onChange={e => setSalaryIdx(parseInt(e.target.value))} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ fontSize: "11px", color: "#475569" }}>전체</span>
                    <span style={{
                      fontSize: "14px", fontWeight: 700,
                      color: salaryMin > 0 ? "#818CF8" : "#64748B",
                      background: salaryMin > 0 ? "#6366F115" : "transparent",
                      padding: "2px 10px", borderRadius: "12px",
                    }}>{salaryLabel}</span>
                    <span style={{ fontSize: "11px", color: "#475569" }}>1억+</span>
                  </div>
                </div>
              </div>

              <div style={{ height: "1px", background: "#1E293B", margin: "4px 0 20px" }} />

              {/* Row 1: Region, Job Type, Experience */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
                <StyledSelect label="지역" icon="📍" value={region} onChange={setRegion} options={REGIONS.map(r => ({ label: r }))} />
                <StyledSelect label="고용형태" icon="📄" value={jobType} onChange={setJobType} options={JOB_TYPES.map(t => ({ label: t }))} />
                <StyledSelect label="경력" icon="⭐" value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} />
              </div>

              {/* Row 2: Education, Industry, Sort */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <StyledSelect label="학력" icon="🎓" value={education} onChange={setEducation} options={EDUCATION_LEVELS} />
                <StyledSelect label="업종/직종" icon="🏭" value={industry} onChange={setIndustry} options={INDUSTRIES} />
                <StyledSelect label="정렬 기준" icon="↕️" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} valueKey="value" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "24px" }}>
        <ActiveFilters filters={activeFilters} onClear={clearFilter} onClearAll={clearAll} />

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
              {["💼", "🔍", "📋"].map((e, i) => (
                <span key={i} style={{ fontSize: "32px", animation: `float 1.5s ease ${i * 0.3}s infinite`, display: "inline-block" }}>{e}</span>
              ))}
            </div>
            <p style={{ color: "#94A3B8", fontSize: "15px", fontWeight: 500 }}>
              {selectedSites.length}개 사이트에서 공고를 수집하고 있습니다...
            </p>
            <div style={{ width: "200px", height: "3px", background: "#1E293B", borderRadius: "2px", margin: "16px auto 0", overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg,transparent,#6366F1,transparent)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite linear" }} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ background: "#1C1117", border: "1px solid #5B2333", borderRadius: "12px", padding: "20px", textAlign: "center", color: "#F87171", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {jobs.length > 0 && !loading && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
              <p style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                🎯 <span style={{ color: "#6366F1" }}>{displayJobs.length}</span>개의 공고
                {displayJobs.length !== jobs.length && <span style={{ color: "#64748B" }}> (전체 {jobs.length}개 중)</span>}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", opacity: 0.5 }}>🔎</span>
                <input type="text" value={resultFilter} onChange={e => setResultFilter(e.target.value)}
                  placeholder="결과 내 검색..."
                  style={{
                    background: "#1E293B", border: "1px solid #2D3748", borderRadius: "10px",
                    padding: "7px 14px", color: "#F1F5F9", fontSize: "13px", outline: "none",
                    width: "180px", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366F1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#2D3748"}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))", gap: "14px" }}>
              {displayJobs.map((job, i) => <JobCard key={i} job={job} index={i} />)}
            </div>

            {displayJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748B", fontSize: "14px" }}>
                결과 내 검색에 일치하는 공고가 없습니다.
              </div>
            )}
          </>
        )}

        {/* Initial */}
        {!loading && !error && jobs.length === 0 && !searched && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px", opacity: 0.6 }}>🔍</div>
            <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
              검색어를 입력하면<br />여러 취업 사이트의 공고를<br />한번에 모아서 보여드립니다
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginTop: "28px" }}>
              {["프론트엔드 개발자", "데이터 분석", "마케팅", "디자이너", "영상편집", "AI 엔지니어", "백엔드 개발", "회계"].map(tag => (
                <button key={tag} onClick={() => setKeyword(tag)}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", border: "1px solid #1E293B",
                    background: "#111827", color: "#94A3B8", fontSize: "13px",
                    cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#818CF8"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.color = "#94A3B8"; }}
                >{tag}</button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && !error && jobs.length === 0 && searched && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😥</div>
            <p style={{ color: "#94A3B8", fontSize: "15px" }}>검색 결과가 없습니다. 다른 키워드로 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "32px", color: "#64748B", fontSize: "12px", borderTop: "1px solid #1E293B", marginTop: "40px" }}>
        AI 웹 검색 기반 취업공고 통합검색 · 실시간 검색 결과는 각 사이트의 최신 공고와 다를 수 있습니다
      </div>
    </div>
  );
}
