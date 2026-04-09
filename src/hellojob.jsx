import { useState, useRef, useEffect, useMemo } from "react";
import {
  MagnifyingGlass, Briefcase, FilmSlate, MapPin, CurrencyDollar,
  FileText, Star, GraduationCap, Palette, Monitor, Factory,
  CalendarBlank, Globe, Link as PhLink, ArrowsDownUp,
  SlidersHorizontal, X, GameController, VideoCamera,
  Television, SquaresFour, FilmStrip, Swatches, BookOpen,
  CaretDown, WarningCircle, SmileySad, Buildings,
  User, Robot, PencilSimple, Copy, Lightning, ClipboardText,
} from "@phosphor-icons/react";

/* ═══════════════════════════════════════════════════════════ */
/*  DATA — GENERAL MODE                                       */
/* ═══════════════════════════════════════════════════════════ */
const SITES_GENERAL = [
  { id: "saramin",  name: "사람인",  color: "#3B82F6" },
  { id: "jobkorea", name: "잡코리아", color: "#EF4444" },
  { id: "albamon",  name: "알바몬",  color: "#F97316" },
  { id: "incruit",  name: "인크루트", color: "#22C55E" },
  { id: "wanted",   name: "원티드",  color: "#8B5CF6" },
  { id: "catch",    name: "캐치",   color: "#EAB308" },
  { id: "linkareer",name: "링커리어", color: "#14B8A6" },
  { id: "jobplanet",name: "잡플래닛", color: "#EC4899" },
];

const INDUSTRIES_GENERAL = [
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
  { label: "물류/유통", query: "물류 유통 배송" },
  { label: "서비스/외식", query: "서비스 외식 요리" },
  { label: "건설/토목", query: "건설 토목 건축" },
];

/* ═══════════════════════════════════════════════════════════ */
/*  DATA — VISUAL/MEDIA SPECIALIST MODE                       */
/* ═══════════════════════════════════════════════════════════ */
const SITES_VISUAL = [
  { id: "saramin",    name: "사람인",     color: "#F472B6" },
  { id: "jobkorea",   name: "잡코리아",   color: "#FB7185" },
  { id: "wanted",     name: "원티드",     color: "#A855F7" },
  { id: "catch",      name: "캐치",      color: "#FBBF24" },
  { id: "linkareer",  name: "링커리어",   color: "#34D399" },
  { id: "gamejob",    name: "게임잡",    color: "#60A5FA" },
  { id: "animationk", name: "애니메이션K", color: "#F472B6" },
  { id: "cgworld",    name: "CG/VFX 채용", color: "#C084FC" },
];

const VISUAL_CATEGORIES = [
  { id: "all",       label: "전체",     color: "#F472B6" },
  { id: "animation", label: "애니메이션", color: "#F472B6" },
  { id: "film",      label: "영화",     color: "#F59E0B" },
  { id: "broadcast", label: "방송",     color: "#3B82F6" },
  { id: "game",      label: "게임",     color: "#22C55E" },
  { id: "motiongfx", label: "모션그래픽", color: "#A855F7" },
  { id: "webtoon",   label: "웹툰/만화", color: "#60A5FA" },
  { id: "video",     label: "영상제작",  color: "#14B8A6" },
];

const VISUAL_ROLES = {
  all: [{ label: "전체 직무", query: "" }],
  animation: [
    { label: "전체 직무", query: "" },
    { label: "2D 애니메이터", query: "2D 애니메이터 작화" },
    { label: "3D 애니메이터", query: "3D 애니메이터 CGI" },
    { label: "3D 모델러", query: "3D 모델링 모델러" },
    { label: "리깅 아티스트", query: "리깅 rigging" },
    { label: "배경 아티스트", query: "배경 미술 background art" },
    { label: "캐릭터 디자이너", query: "캐릭터 디자인" },
    { label: "콘셉트 아티스트", query: "콘셉트 아트" },
    { label: "스토리보드", query: "스토리보드 콘티" },
    { label: "이펙트(FX)", query: "이펙트 FX VFX" },
    { label: "컴포지터", query: "컴포지팅 합성" },
    { label: "렌더링/라이팅", query: "렌더링 라이팅 lighting" },
    { label: "PD/감독", query: "애니메이션 PD 감독 연출" },
    { label: "성우/더빙", query: "성우 더빙 voice" },
    { label: "TD(테크니컬 디렉터)", query: "TD 테크니컬 디렉터" },
  ],
  film: [
    { label: "전체 직무", query: "" },
    { label: "VFX 아티스트", query: "VFX 시각효과 영화" },
    { label: "컴포지터", query: "컴포지팅 합성 영화" },
    { label: "매트페인터", query: "매트페인팅 matte painting" },
    { label: "DI/컬러리스트", query: "DI 컬러그레이딩 컬러리스트" },
    { label: "편집/에디터", query: "영화 편집 에디터" },
    { label: "촬영감독/촬영기사", query: "촬영감독 촬영기사 시네마토그래퍼" },
    { label: "조명감독", query: "조명감독 조명기사 gaffer" },
    { label: "사운드 디자이너", query: "사운드 디자인 음향" },
    { label: "프로듀서", query: "영화 프로듀서 제작" },
    { label: "미술감독/세트", query: "미술감독 프로덕션 디자인 세트" },
    { label: "CG 슈퍼바이저", query: "CG 슈퍼바이저 supervisor" },
    { label: "스턴트/특수효과", query: "특수효과 SFX 스턴트" },
  ],
  broadcast: [
    { label: "전체 직무", query: "" },
    { label: "영상 PD", query: "방송 PD 연출" },
    { label: "CG 디자이너", query: "방송 CG 그래픽 디자이너" },
    { label: "영상 편집", query: "방송 영상 편집 NLE" },
    { label: "촬영기자/카메라", query: "촬영기자 카메라 감독" },
    { label: "음향/믹싱", query: "방송 음향 믹싱 엔지니어" },
    { label: "조명", query: "방송 조명 기사" },
    { label: "자막/타이틀", query: "자막 타이틀 디자인" },
    { label: "작가/구성", query: "방송 작가 구성작가" },
    { label: "아트디렉터", query: "방송 아트디렉터 미술" },
    { label: "버추얼 프로덕션", query: "버추얼 프로덕션 LED 스테이지" },
    { label: "송출/송신", query: "송출 송신 MCR 엔지니어" },
  ],
  game: [
    { label: "전체 직무", query: "" },
    { label: "캐릭터 모델러", query: "게임 캐릭터 모델링" },
    { label: "배경 모델러", query: "게임 배경 모델링 environment" },
    { label: "캐릭터 애니메이터", query: "게임 캐릭터 애니메이션" },
    { label: "이펙트 아티스트", query: "게임 이펙트 VFX" },
    { label: "UI/UX 디자이너", query: "게임 UI UX 디자인" },
    { label: "컨셉 아티스트", query: "게임 컨셉 아트" },
    { label: "테크니컬 아티스트", query: "게임 TA 테크니컬 아티스트" },
    { label: "시네마틱 디자이너", query: "게임 시네마틱 컷신" },
    { label: "라이팅 아티스트", query: "게임 라이팅 lighting" },
    { label: "리깅 아티스트", query: "게임 리깅" },
    { label: "텍스처 아티스트", query: "텍스처 아티스트 서브스턴스" },
    { label: "아트 디렉터", query: "게임 아트 디렉터" },
  ],
  motiongfx: [
    { label: "전체 직무", query: "" },
    { label: "모션그래픽 디자이너", query: "모션그래픽 디자이너" },
    { label: "타이틀 디자이너", query: "타이틀 시퀀스 디자인" },
    { label: "인포그래픽 영상", query: "인포그래픽 영상 모션" },
    { label: "3D 모션", query: "3D 모션 그래픽 Cinema4D" },
    { label: "제너럴리스트", query: "모션 제너럴리스트" },
    { label: "루킹/렌더링", query: "루킹 렌더링 Octane Redshift" },
    { label: "영상 편집", query: "영상 편집 프리미어 에디터" },
  ],
  webtoon: [
    { label: "전체 직무", query: "" },
    { label: "웹툰 작가", query: "웹툰 작가" },
    { label: "웹툰 어시스턴트", query: "웹툰 어시스턴트 보조" },
    { label: "배경 어시", query: "웹툰 배경 어시스턴트" },
    { label: "채색 담당", query: "웹툰 채색 컬러리스트" },
    { label: "만화 작가", query: "만화 작가 일러스트" },
    { label: "웹소설 삽화", query: "웹소설 삽화 일러스트" },
    { label: "편집/기획", query: "웹툰 편집자 기획 PD" },
  ],
  video: [
    { label: "전체 직무", query: "" },
    { label: "영상 촬영감독", query: "영상 촬영감독 DP" },
    { label: "영상 편집자", query: "영상 편집 에디터 프리미어" },
    { label: "유튜브/콘텐츠 PD", query: "유튜브 콘텐츠 PD 크리에이터" },
    { label: "드론 촬영", query: "드론 촬영 항공영상" },
    { label: "컬러 그레이딩", query: "컬러 그레이딩 다빈치" },
    { label: "사운드/음향", query: "사운드 디자인 음향 녹음" },
    { label: "자막/번역", query: "영상 자막 번역 로컬라이징" },
    { label: "라이브 스트리밍", query: "라이브 방송 스트리밍" },
  ],
};

const TOOLS_SOFTWARE = [
  { label: "전체", query: "" },
  { label: "Maya", query: "Maya" }, { label: "Blender", query: "Blender" },
  { label: "3ds Max", query: "3ds Max" }, { label: "Cinema 4D", query: "Cinema 4D C4D" },
  { label: "Houdini", query: "Houdini" }, { label: "ZBrush", query: "ZBrush" },
  { label: "After Effects", query: "After Effects" }, { label: "Premiere Pro", query: "Premiere Pro" },
  { label: "DaVinci Resolve", query: "DaVinci Resolve" }, { label: "Nuke", query: "Nuke 컴포지팅" },
  { label: "Photoshop", query: "Photoshop" }, { label: "Clip Studio", query: "Clip Studio Paint" },
  { label: "Toon Boom", query: "Toon Boom Harmony" },
  { label: "Unreal Engine", query: "Unreal Engine 언리얼" }, { label: "Unity", query: "Unity 유니티" },
  { label: "Substance", query: "Substance Painter Designer" },
  { label: "Final Cut Pro", query: "Final Cut Pro" },
];

/* ═══ SHARED DATA ═══ */
const REGIONS = [
  "전체","서울","경기","인천","부산","대구","대전","광주",
  "울산","세종","강원","충북","충남","전북","전남","경북","경남","제주","해외/리모트",
];
const JOB_TYPES = ["전체","정규직","계약직","인턴","아르바이트","프리랜서","파견직","프로젝트 단위"];
const SALARY_MARKS = [0,2400,3000,4000,5000,6000,8000,10000];
const EXPERIENCE_LEVELS = [
  {label:"전체",query:""},{label:"신입",query:"신입"},{label:"1~3년",query:"경력 1~3년"},
  {label:"3~5년",query:"경력 3~5년"},{label:"5~10년",query:"경력 5~10년"},
  {label:"10년 이상",query:"경력 10년 이상"},{label:"경력무관",query:"경력무관"},
];
const EDUCATION_LEVELS = [
  {label:"전체",query:""},{label:"학력무관",query:"학력무관"},{label:"고졸",query:"고졸"},
  {label:"전문대졸",query:"전문대졸"},{label:"대졸",query:"대졸 4년제"},{label:"석사 이상",query:"석사 이상"},
];
const SORT_OPTIONS = [
  {label:"관련도순",value:"relevance"},{label:"최신순",value:"recent"},
  {label:"연봉 높은순",value:"salary_desc"},{label:"마감임박순",value:"deadline"},
];

const QUICK_KEYWORDS = {
  general: ["프론트엔드 개발자","데이터 분석","마케팅","디자이너","백엔드 개발","회계","영업","인사"],
  visual: ["2D 애니메이터","3D 모델러","영상 편집","모션그래픽","VFX","웹툰 어시","게임 이펙트","촬영감독","CG 디자이너","시네마틱"],
};

/* ═══ PARSER ═══ */
function parseJobs(text) {
  try {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) { const p = JSON.parse(m[0]); if (Array.isArray(p)) return p.filter(j=>j.title&&j.company); }
  } catch {}
  return [];
}

/* ═══════════════════════════════════════════════════════════ */
/*  AI HELPERS (module-level)                                 */
/* ═══════════════════════════════════════════════════════════ */
async function callClaudeAPI(prompt, useWebSearch = false) {
  let key = "";
  try { key = JSON.parse(localStorage.getItem("hj_profile") || "{}").apiKey || ""; } catch {}

  const headers = { "Content-Type": "application/json" };
  if (key) {
    headers["x-api-key"] = key;
    headers["anthropic-version"] = "2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }
  if (useWebSearch) headers["anthropic-beta"] = "web-search-2025-03-05";

  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: useWebSearch ? 4000 : 2000,
    messages: [{ role: "user", content: prompt }],
  };
  if (useWebSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API 오류: ${res.status}`);
  }

  const data = await res.json();
  let text = "";
  for (const b of data.content) if (b.type === "text") text += b.text;
  return text;
}

function computeMatchScore(job, profile) {
  if (!profile) return null;
  const hasData = profile.skills || profile.expYears || profile.desiredRegion;
  if (!hasData) return null;

  let points = 0, max = 0;

  if (profile.skills) {
    const skills = profile.skills.toLowerCase().split(/[\s,]+/).filter(s => s.length > 1);
    if (skills.length > 0) {
      const jobText = `${job.title} ${job.tools || ""} ${job.role || ""} ${job.industry || ""}`.toLowerCase();
      const matched = skills.filter(s => jobText.includes(s)).length;
      points += Math.round((matched / skills.length) * 40);
      max += 40;
    }
  }

  if (profile.desiredRegion && profile.desiredRegion !== "전체") {
    max += 20;
    if (job.location?.includes(profile.desiredRegion)) points += 20;
    else if (job.location?.includes("리모트") || job.location?.includes("재택")) points += 10;
  }

  if (profile.expYears) {
    const yrs = parseInt(profile.expYears) || 0;
    const exp = job.experience || "";
    max += 20;
    if (!exp || exp.includes("경력무관") || exp.includes("무관")) points += 20;
    else if (exp.includes("신입") && yrs === 0) points += 20;
    else if (exp.includes("신입") && yrs <= 2) points += 12;
    else {
      const nums = (exp.match(/\d+/g) || []).map(Number);
      if (nums.length > 0) {
        const minY = Math.min(...nums);
        const maxY = nums.length >= 2 ? Math.max(...nums) : 99;
        if (yrs >= minY && yrs <= maxY) points += 20;
        else if (yrs >= minY - 1) points += 10;
      }
    }
  }

  if (max === 0) return null;
  return Math.min(100, Math.round((points / max) * 100));
}

/* ═══════════════════════════════════════════════════════════ */
/*  DESIGN SYSTEM                                             */
/* ═══════════════════════════════════════════════════════════ */
const CATEGORY_ICONS = {
  all: SquaresFour,
  animation: FilmSlate,
  film: FilmStrip,
  broadcast: Television,
  game: GameController,
  motiongfx: Swatches,
  webtoon: BookOpen,
  video: VideoCamera,
};

const FILTER_ICON_MAP = {
  region: MapPin,
  jobType: FileText,
  salary: CurrencyDollar,
  experience: Star,
  education: GraduationCap,
  industryG: Factory,
  visualCat: FilmSlate,
  roleV: Palette,
  toolV: Monitor,
};

function getTheme(mode) {
  if (mode === "visual") return {
    bg: "#0D0818",
    surface: "#130A22",
    surfaceAlt: "#1A1030",
    border: "#2A1F3D",
    accent: "#F472B6",
    accentAlt: "#A855F7",
    textP: "#F3E8FF",
    textM: "#6B5B8D",
    inputBg: "#1A1128",
  };
  return {
    bg: "#0A0A0B",
    surface: "#141414",
    surfaceAlt: "#1C1C1C",
    border: "#262626",
    accent: "#10B981",
    accentAlt: "#059669",
    textP: "#FAFAFA",
    textM: "#71717A",
    inputBg: "#1A1A1A",
  };
}

const FF = "'Pretendard','Noto Sans KR',sans-serif";
const FF_DISPLAY = "'Outfit','Pretendard',sans-serif";

/* ═══════════════════════════════════════════════════════════ */
/*  UI COMPONENTS                                             */
/* ═══════════════════════════════════════════════════════════ */

function StyledSelect({ label, Icon, value, onChange, options, valueKey, th }) {
  return (
    <div style={{ flex: 1, minWidth: "148px" }}>
      <label style={{
        fontSize: "10.5px", fontWeight: 700, color: th.textM,
        textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px",
        fontFamily: FF,
      }}>
        {Icon && <Icon size={11} weight="bold" />}
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: "10px",
          border: `1px solid ${th.border}`, background: th.inputBg,
          color: th.textP, fontSize: "13px", outline: "none",
          cursor: "pointer", appearance: "none", fontFamily: FF,
          transition: "border-color 0.2s",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
        onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
      >
        {options.map((o, i) => (
          <option key={i} value={valueKey === "value" ? o.value : o.label}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Tag({ Icon, text, color, th }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: color ? color + "14" : th.surfaceAlt,
      color: color || th.textM,
      padding: "4px 9px", borderRadius: "6px",
      fontSize: "11.5px", fontWeight: 600,
      border: `1px solid ${color ? color + "22" : th.border}`,
      fontFamily: FF,
    }}>
      {Icon && <Icon size={11} weight="bold" />}
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  PROFILE MODAL                                             */
/* ═══════════════════════════════════════════════════════════ */
function ProfileModal({ profile, onSave, onClose, th }) {
  const [form, setForm] = useState({
    name: "", expYears: "", skills: "", desiredSalary: "",
    desiredRegion: "전체", jobTypes: "전체", intro: "", apiKey: "",
    ...profile,
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const fieldStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: `1px solid ${th.border}`, background: th.inputBg,
    color: th.textP, fontSize: "13px", outline: "none",
    fontFamily: FF, boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const labelStyle = {
    fontSize: "10.5px", fontWeight: 700, color: th.textM,
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: "6px", display: "block", fontFamily: FF,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: th.surface, borderRadius: "20px",
          border: `1px solid ${th.border}`, width: "100%", maxWidth: "540px",
          maxHeight: "88vh", overflowY: "auto",
          animation: "slideUp 0.3s ease",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 0", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: th.accent + "20", border: `1px solid ${th.accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={16} color={th.accent} weight="bold" />
            </div>
            <div>
              <div style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: "16px", color: th.textP }}>내 프로필</div>
              <div style={{ fontSize: "11px", color: th.textM, fontFamily: FF }}>매칭 점수 · 자기소개서 자동완성에 활용</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: th.textM, padding: "6px", borderRadius: "8px",
              display: "flex", alignItems: "center",
            }}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 140px" }}>
              <label style={labelStyle}>이름</label>
              <input
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="홍길동"
                style={fieldStyle}
                onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
                onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
              />
            </div>
            <div style={{ flex: "1 1 100px" }}>
              <label style={labelStyle}>경력 (년)</label>
              <input
                value={form.expYears}
                onChange={e => set("expYears", e.target.value)}
                placeholder="0 (신입)"
                style={fieldStyle}
                type="number" min="0" max="40"
                onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
                onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
              />
            </div>
            <div style={{ flex: "1 1 120px" }}>
              <label style={labelStyle}>희망 지역</label>
              <select
                value={form.desiredRegion}
                onChange={e => set("desiredRegion", e.target.value)}
                style={{ ...fieldStyle, appearance: "none", cursor: "pointer" }}
                onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
                onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
              >
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label style={labelStyle}>보유 기술 / 역량 키워드 (쉼표로 구분)</label>
            <input
              value={form.skills}
              onChange={e => set("skills", e.target.value)}
              placeholder="Maya, 3D 모델링, Blender, 게임 그래픽, After Effects..."
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
              onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
            />
            <div style={{ fontSize: "10.5px", color: th.textM, marginTop: "5px", fontFamily: FF }}>
              공고 매칭 점수 계산에 사용됩니다
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 140px" }}>
              <label style={labelStyle}>희망 연봉 (만원)</label>
              <input
                value={form.desiredSalary}
                onChange={e => set("desiredSalary", e.target.value)}
                placeholder="4000"
                style={fieldStyle}
                type="number" min="0"
                onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
                onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
              />
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <label style={labelStyle}>희망 고용형태</label>
              <select
                value={form.jobTypes}
                onChange={e => set("jobTypes", e.target.value)}
                style={{ ...fieldStyle, appearance: "none", cursor: "pointer" }}
                onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
                onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
              >
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Intro */}
          <div>
            <label style={labelStyle}>자기소개 / 강점 (자기소개서 작성에 활용)</label>
            <textarea
              value={form.intro}
              onChange={e => set("intro", e.target.value)}
              placeholder="간략한 자기소개, 보유 경험, 강점 등을 자유롭게 작성하세요. 자기소개서 생성 시 이 내용을 반영합니다."
              rows={4}
              style={{
                ...fieldStyle, resize: "vertical", lineHeight: 1.6,
                minHeight: "90px",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
              onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
            />
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: th.border }} />

          {/* API Key */}
          <div>
            <label style={labelStyle}>Claude API 키 (선택사항)</label>
            <input
              value={form.apiKey}
              onChange={e => set("apiKey", e.target.value)}
              placeholder="sk-ant-api03-..."
              type="password"
              style={fieldStyle}
              onFocus={e => { e.currentTarget.style.borderColor = th.accent; }}
              onBlur={e => { e.currentTarget.style.borderColor = th.border; }}
            />
            <div style={{ fontSize: "10.5px", color: th.textM, marginTop: "5px", fontFamily: FF }}>
              AI 분석 · 자기소개서 생성에 필요합니다. console.anthropic.com에서 발급
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            style={{
              width: "100%", padding: "13px",
              background: saved ? "#10B981" : `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
              border: "none", borderRadius: "12px",
              color: "#fff", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: FF,
              transition: "all 0.3s",
              boxShadow: `0 4px 16px ${th.accent}30`,
            }}
          >
            {saved ? "저장됨!" : "프로필 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  COVER LETTER MODAL                                        */
/* ═══════════════════════════════════════════════════════════ */
function CoverLetterModal({ job, profile, onClose, th }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true); setError(""); setText("");
    const profileLines = [
      profile?.name && `이름: ${profile.name}`,
      profile?.expYears ? `경력: ${profile.expYears}년` : "경력: 신입/미입력",
      profile?.skills && `보유 기술: ${profile.skills}`,
      profile?.desiredRegion && profile.desiredRegion !== "전체" && `희망 지역: ${profile.desiredRegion}`,
      profile?.intro && `자기소개/강점: ${profile.intro}`,
    ].filter(Boolean).join("\n");

    const prompt = `다음 채용공고에 지원하는 한국어 자기소개서 초안을 작성해주세요.

[채용공고]
직무: ${job.title}
회사: ${job.company}
위치: ${job.location || "미기재"}
급여: ${job.salary || "미기재"}
경력 요건: ${job.experience || "미기재"}
고용형태: ${job.type || "미기재"}${job.tools ? `\n필요 기술: ${job.tools}` : ""}${job.role ? `\n세부 직무: ${job.role}` : ""}${job.industry ? `\n업종: ${job.industry}` : ""}

[지원자 프로필]
${profileLines || "프로필 미입력 - 일반적인 지원자로 작성해주세요"}

다음 3가지 항목으로 자기소개서를 작성해주세요. 각 항목은 200~250자 내외로 자연스럽고 진솔하게 작성하세요.

## 1. 지원 동기
(이 회사/직무에 지원하는 이유, 관심을 갖게 된 계기)

## 2. 경력 및 역량
(보유 기술과 경험, 이 직무에 어떻게 기여할 수 있는지)

## 3. 강점 및 포부
(본인의 강점, 입사 후 목표와 성장 방향)`;

    try {
      const result = await callClaudeAPI(prompt);
      setText(result);
    } catch (err) {
      setError("생성 오류: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generate(); }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderText = (raw) => {
    return raw.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <div key={i} style={{
            fontWeight: 800, fontSize: "13px", color: th.accent,
            margin: i === 0 ? "0 0 8px" : "20px 0 8px",
            fontFamily: FF, display: "flex", alignItems: "center", gap: "6px",
          }}>
            <ClipboardText size={13} weight="bold" />
            {line.replace("## ", "")}
          </div>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <div key={i} style={{ fontWeight: 700, color: th.textP, fontFamily: FF, fontSize: "13px", margin: "12px 0 6px" }}>{line.replace(/\*\*/g, "")}</div>;
      }
      if (line.trim() === "") return <div key={i} style={{ height: "6px" }} />;
      return <div key={i} style={{ color: th.textP, fontSize: "13.5px", lineHeight: 1.75, fontFamily: FF }}>{line}</div>;
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.80)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: th.surface, borderRadius: "20px",
          border: `1px solid ${th.border}`, width: "100%", maxWidth: "620px",
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          animation: "slideUp 0.3s ease",
          boxShadow: `0 32px 80px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: "20px 24px", borderBottom: `1px solid ${th.border}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: th.accent + "18", border: `1px solid ${th.accent}28`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <PencilSimple size={17} color={th.accent} weight="bold" />
            </div>
            <div>
              <div style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: "15px", color: th.textP }}>
                AI 자기소개서 초안
              </div>
              <div style={{ fontSize: "11.5px", color: th.textM, fontFamily: FF, marginTop: "2px" }}>
                {job.title} · {job.company}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {text && !loading && (
              <>
                <button
                  onClick={handleCopy}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 12px", borderRadius: "9px",
                    border: `1px solid ${th.border}`,
                    background: copied ? th.accent + "15" : "transparent",
                    color: copied ? th.accent : th.textM,
                    fontSize: "12px", cursor: "pointer", fontFamily: FF, fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  <Copy size={12} weight="bold" />
                  {copied ? "복사됨" : "복사"}
                </button>
                <button
                  onClick={generate}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 12px", borderRadius: "9px",
                    border: `1px solid ${th.accent}30`,
                    background: th.accent + "12",
                    color: th.accent, fontSize: "12px", cursor: "pointer",
                    fontFamily: FF, fontWeight: 700, transition: "all 0.2s",
                  }}
                >
                  <Robot size={12} weight="bold" />
                  재생성
                </button>
              </>
            )}
            <button
              onClick={onClose}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: th.textM, padding: "6px", borderRadius: "8px",
                display: "flex", alignItems: "center",
              }}
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "60px 20px", gap: "16px",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                border: `3px solid ${th.border}`,
                borderTopColor: th.accent,
                animation: "spin 0.8s linear infinite",
              }} />
              <div style={{ color: th.textM, fontSize: "13px", fontFamily: FF }}>
                자기소개서를 작성하고 있습니다...
              </div>
            </div>
          )}
          {error && !loading && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#1C0A0A", border: "1px solid #5B1A1A",
              borderRadius: "10px", padding: "14px 16px",
              color: "#FB7185", fontSize: "13px", fontFamily: FF,
            }}>
              <WarningCircle size={16} color="#EF4444" weight="bold" />
              {error}
              <button
                onClick={generate}
                style={{
                  marginLeft: "auto", background: "transparent",
                  border: "1px solid #5B1A1A", color: "#FB7185",
                  padding: "4px 10px", borderRadius: "6px",
                  fontSize: "11px", cursor: "pointer", fontFamily: FF,
                }}
              >
                재시도
              </button>
            </div>
          )}
          {text && !loading && (
            <div style={{ lineHeight: 1.7 }}>
              {renderText(text)}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {!loading && (
          <div style={{
            padding: "12px 24px", borderTop: `1px solid ${th.border}`,
            color: th.textM, fontSize: "11px", fontFamily: FF, flexShrink: 0,
          }}>
            AI가 생성한 초안입니다. 본인의 실제 경험에 맞게 수정하여 사용하세요.
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  JOB CARD (with AI features)                               */
/* ═══════════════════════════════════════════════════════════ */
function JobCard({ job, index, mode, th, profile, onCoverLetter }) {
  const sites = mode === "visual" ? SITES_VISUAL : SITES_GENERAL;
  const site = sites.find(s => job.site?.includes(s.name) || job.site?.toLowerCase().includes(s.id));
  const accent = site?.color || th.accent;

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const matchScore = computeMatchScore(job, profile);

  const handleAnalyze = async (e) => {
    e.stopPropagation();
    if (analysisText) { setShowAnalysis(prev => !prev); return; }
    setShowAnalysis(true);
    setAnalysisLoading(true);
    setAnalysisError("");
    const prompt = `다음 채용공고를 간략하게 분석해주세요.

채용공고:
- 직무: ${job.title}
- 회사: ${job.company}
- 위치: ${job.location || "미기재"}
- 급여: ${job.salary || "미기재"}
- 경력: ${job.experience || "미기재"}
- 고용형태: ${job.type || "미기재"}${job.role ? `\n- 세부 직무: ${job.role}` : ""}${job.tools ? `\n- 필요 툴: ${job.tools}` : ""}${job.industry ? `\n- 업종: ${job.industry}` : ""}

다음 형식으로 짧고 명확하게 분석해주세요 (각 항목 2~3개 bullet):

**핵심 요구사항**
• ...

**이런 분에게 유리해요**
• ...

**지원 전 체크포인트**
• ...`;
    try {
      const result = await callClaudeAPI(prompt);
      setAnalysisText(result);
    } catch (err) {
      setAnalysisError("분석 오류: " + err.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleCoverLetter = (e) => {
    e.stopPropagation();
    onCoverLetter(job);
  };

  const renderAnalysis = (raw) => {
    return raw.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <div key={i} style={{
            fontWeight: 700, fontSize: "11px", color: accent,
            margin: i === 0 ? "0 0 5px" : "12px 0 5px",
            fontFamily: FF, textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {line.replace(/\*\*/g, "")}
          </div>
        );
      }
      if (line.startsWith("•")) {
        return (
          <div key={i} style={{
            color: th.textP, fontSize: "12px", lineHeight: 1.6,
            fontFamily: FF, paddingLeft: "4px", marginBottom: "3px",
          }}>
            {line}
          </div>
        );
      }
      if (line.trim() === "") return null;
      return (
        <div key={i} style={{ color: th.textM, fontSize: "12px", lineHeight: 1.6, fontFamily: FF }}>
          {line}
        </div>
      );
    });
  };

  const scoreColor = matchScore >= 75 ? "#10B981" : matchScore >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div
      style={{
        background: th.surface,
        borderRadius: "14px",
        border: `1px solid ${th.border}`,
        overflow: "hidden",
        animation: `slideUp 0.4s ease ${index * 0.04}s both`,
        cursor: job.url ? "pointer" : "default",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.25s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 16px 36px ${accent}12`;
        e.currentTarget.style.borderColor = accent + "35";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = th.border;
      }}
      onClick={() => job.url && window.open(job.url, "_blank")}
    >
      <div style={{ padding: "18px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: "14px", fontWeight: 700, color: th.textP,
              margin: "0 0 5px", lineHeight: 1.4, letterSpacing: "-0.01em",
              fontFamily: FF,
            }}>
              {job.title}
            </h3>
            <p style={{
              fontSize: "12.5px", color: accent, margin: 0,
              fontWeight: 600, display: "flex", alignItems: "center", gap: "4px",
              fontFamily: FF,
            }}>
              <Buildings size={12} weight="bold" />
              {job.company}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            {matchScore !== null && (
              <span style={{
                background: scoreColor + "15", color: scoreColor,
                padding: "3px 8px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800,
                border: `1px solid ${scoreColor}25`, fontFamily: FF,
                display: "flex", alignItems: "center", gap: "3px",
              }}>
                <Robot size={9} weight="bold" />
                {matchScore}%
              </span>
            )}
            {site && (
              <span style={{
                background: accent + "15", color: accent,
                padding: "3px 9px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 700,
                whiteSpace: "nowrap",
                border: `1px solid ${accent}25`, fontFamily: FF,
              }}>
                {site.name}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: th.border, marginBottom: "12px" }} />

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {job.salary && <Tag Icon={CurrencyDollar} text={job.salary} color="#10B981" th={th} />}
          {job.location && <Tag Icon={MapPin} text={job.location} th={th} />}
          {job.type && <Tag Icon={FileText} text={job.type} th={th} />}
          {job.experience && <Tag Icon={Star} text={job.experience} color="#F59E0B" th={th} />}
          {job.education && <Tag Icon={GraduationCap} text={job.education} th={th} />}
          {job.role && <Tag Icon={Palette} text={job.role} color="#F472B6" th={th} />}
          {job.tools && <Tag Icon={Monitor} text={job.tools} color="#60A5FA" th={th} />}
          {job.industry && <Tag Icon={Factory} text={job.industry} th={th} />}
          {job.deadline && <Tag Icon={CalendarBlank} text={job.deadline} color="#EF4444" th={th} />}
        </div>

        {/* URL */}
        {job.url && (
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
            <PhLink size={10} color={th.textM} />
            <span style={{
              fontSize: "10.5px", color: th.textM,
              overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", maxWidth: "260px", fontFamily: FF,
            }}>
              {job.url.replace(/https?:\/\//, "").split("/")[0]}
            </span>
          </div>
        )}

        {/* AI Action Buttons */}
        <div style={{
          marginTop: "14px", paddingTop: "12px",
          borderTop: `1px solid ${th.border}`,
          display: "flex", gap: "7px", alignItems: "center",
        }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleAnalyze}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "6px 11px", borderRadius: "8px",
              border: `1px solid ${showAnalysis ? accent + "40" : th.border}`,
              background: showAnalysis ? accent + "12" : "transparent",
              color: showAnalysis ? accent : th.textM,
              fontSize: "11.5px", fontWeight: 600, cursor: "pointer",
              fontFamily: FF, transition: "all 0.2s",
            }}
          >
            <Robot size={11} weight="bold" />
            {analysisLoading ? "분석중..." : analysisText ? (showAnalysis ? "분석 닫기" : "분석 보기") : "AI 분석"}
          </button>
          <button
            onClick={handleCoverLetter}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "6px 11px", borderRadius: "8px",
              border: `1px solid ${th.border}`,
              background: "transparent",
              color: th.textM,
              fontSize: "11.5px", fontWeight: 600, cursor: "pointer",
              fontFamily: FF, transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = th.accent + "40";
              e.currentTarget.style.color = th.accent;
              e.currentTarget.style.background = th.accent + "10";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = th.border;
              e.currentTarget.style.color = th.textM;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <PencilSimple size={11} weight="bold" />
            지원서 작성
          </button>
        </div>

        {/* Analysis Panel */}
        {showAnalysis && (
          <div style={{
            marginTop: "12px", padding: "14px 16px",
            background: th.surfaceAlt, borderRadius: "10px",
            border: `1px solid ${accent}20`,
            animation: "slideUp 0.25s ease",
          }}
            onClick={e => e.stopPropagation()}
          >
            {analysisLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: th.textM, fontSize: "12px", fontFamily: FF }}>
                <div style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  border: `2px solid ${th.border}`, borderTopColor: accent,
                  animation: "spin 0.7s linear infinite", flexShrink: 0,
                }} />
                공고를 분석하고 있습니다...
              </div>
            )}
            {analysisError && (
              <div style={{ color: "#FB7185", fontSize: "12px", fontFamily: FF }}>
                {analysisError}
              </div>
            )}
            {analysisText && !analysisLoading && renderAnalysis(analysisText)}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard({ th }) {
  const sk = {
    background: `linear-gradient(90deg, ${th.border} 25%, ${th.surfaceAlt} 50%, ${th.border} 75%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite linear",
    borderRadius: "6px",
  };
  return (
    <div style={{ background: th.surface, borderRadius: "14px", border: `1px solid ${th.border}`, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...sk, height: "15px", width: "68%", marginBottom: "8px" }} />
          <div style={{ ...sk, height: "12px", width: "38%" }} />
        </div>
        <div style={{ ...sk, height: "24px", width: "58px", borderRadius: "20px", flexShrink: 0 }} />
      </div>
      <div style={{ height: "1px", background: th.border, marginBottom: "12px" }} />
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {[72, 58, 80, 64, 55].map((w, i) => (
          <div key={i} style={{ ...sk, height: "26px", width: `${w}px`, borderRadius: "6px" }} />
        ))}
      </div>
    </div>
  );
}

function SiteFilter({ sites, selected, onToggle, th }) {
  const all = selected.length === sites.length;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
      <button
        onClick={() => onToggle(all ? "__none__" : "__all__")}
        style={{
          padding: "5px 12px", borderRadius: "20px", fontSize: "11px",
          border: `1px solid ${all ? th.accent + "50" : th.border}`,
          background: all ? th.accent + "15" : "transparent",
          color: all ? th.accent : th.textM,
          fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s", fontFamily: FF,
        }}
      >
        전체
      </button>
      {sites.map(s => {
        const active = selected.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "5px 11px", borderRadius: "20px",
              border: `1px solid ${active ? s.color + "50" : th.border}`,
              background: active ? s.color + "15" : "transparent",
              color: active ? s.color : th.textM,
              fontSize: "11px", fontWeight: active ? 700 : 500,
              cursor: "pointer", transition: "all 0.2s", fontFamily: FF,
            }}
          >
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: active ? s.color : th.border,
              flexShrink: 0, transition: "background 0.2s",
            }} />
            {s.name}
          </button>
        );
      })}
    </div>
  );
}

function CategoryTabs({ selected, onChange, th }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {VISUAL_CATEGORIES.map(c => {
        const active = selected === c.id;
        const CatIcon = CATEGORY_ICONS[c.id];
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", borderRadius: "24px",
              border: `1px solid ${active ? c.color + "50" : th.border}`,
              background: active ? c.color + "15" : "transparent",
              color: active ? c.color : th.textM,
              fontSize: "12.5px", fontWeight: active ? 700 : 500,
              cursor: "pointer", transition: "all 0.25s", fontFamily: FF,
            }}
          >
            {CatIcon && <CatIcon size={13} weight={active ? "bold" : "regular"} />}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function ActiveFilters({ filters, onClear, onClearAll, th }) {
  if (!filters.length) return null;
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "7px",
      alignItems: "center", marginBottom: "18px",
      animation: "slideUp 0.3s ease",
    }}>
      <span style={{ fontSize: "10.5px", color: th.textM, fontWeight: 700, fontFamily: FF }}>필터</span>
      {filters.map((f, i) => {
        const Icon = FILTER_ICON_MAP[f.iconKey];
        return (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: th.accent + "14", color: th.accent,
            padding: "3px 10px", borderRadius: "20px",
            fontSize: "11px", fontWeight: 700,
            border: `1px solid ${th.accent}28`, fontFamily: FF,
          }}>
            {Icon && <Icon size={10} weight="bold" />}
            {f.label}
            <span
              onClick={e => { e.stopPropagation(); onClear(f.iconKey); }}
              style={{ cursor: "pointer", opacity: 0.6, display: "flex", alignItems: "center" }}
            >
              <X size={11} weight="bold" />
            </span>
          </span>
        );
      })}
      <button
        onClick={onClearAll}
        style={{
          background: "transparent", border: "none",
          color: "#EF4444", fontSize: "11px",
          cursor: "pointer", fontWeight: 700,
          padding: "3px 6px", fontFamily: FF,
        }}
      >
        초기화
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════ */
export default function UnifiedJobAggregator() {
  const [mode, setMode] = useState("general");

  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("전체");
  const [jobType, setJobType] = useState("전체");
  const [salaryIdx, setSalaryIdx] = useState(0);
  const [experience, setExperience] = useState("전체");
  const [education, setEducation] = useState("전체");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [resultFilter, setResultFilter] = useState("");

  const [industryG, setIndustryG] = useState("전체");
  const [sitesG, setSitesG] = useState(SITES_GENERAL.map(s => s.id));

  const [visualCat, setVisualCat] = useState("all");
  const [roleV, setRoleV] = useState("전체 직무");
  const [toolV, setToolV] = useState("전체");
  const [sitesV, setSitesV] = useState(SITES_VISUAL.map(s => s.id));

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  // ── AI / Profile state ──
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hj_profile") || "{}"); } catch { return {}; }
  });
  const [showProfile, setShowProfile] = useState(false);
  const [nlMode, setNlMode] = useState(false);
  const [nlParsedMsg, setNlParsedMsg] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [coverJob, setCoverJob] = useState(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setRoleV("전체 직무"); }, [visualCat]);

  const salaryMin = SALARY_MARKS[salaryIdx] || 0;
  const salaryLabel = salaryMin === 0 ? "전체" : salaryMin >= 10000 ? "1억원 이상" : `${salaryMin.toLocaleString()}만원 이상`;
  const isV = mode === "visual";
  const th = getTheme(mode);
  const sites = isV ? SITES_VISUAL : SITES_GENERAL;
  const selectedSites = isV ? sitesV : sitesG;

  const saveProfile = (p) => {
    setProfile(p);
    localStorage.setItem("hj_profile", JSON.stringify(p));
  };

  const toggleSite = (id) => {
    const setter = isV ? setSitesV : setSitesG;
    const all = isV ? SITES_VISUAL : SITES_GENERAL;
    if (id === "__all__") setter(all.map(s => s.id));
    else if (id === "__none__") setter([]);
    else setter(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const clearFilter = (key) => {
    const m = {
      region: () => setRegion("전체"), jobType: () => setJobType("전체"),
      salary: () => setSalaryIdx(0), experience: () => setExperience("전체"),
      education: () => setEducation("전체"), industryG: () => setIndustryG("전체"),
      visualCat: () => setVisualCat("all"), roleV: () => setRoleV("전체 직무"),
      toolV: () => setToolV("전체"),
    };
    m[key]?.();
  };

  const clearAll = () => {
    setRegion("전체"); setJobType("전체"); setSalaryIdx(0); setExperience("전체");
    setEducation("전체"); setIndustryG("전체"); setVisualCat("all");
    setRoleV("전체 직무"); setToolV("전체");
    setSitesG(SITES_GENERAL.map(s => s.id));
    setSitesV(SITES_VISUAL.map(s => s.id));
  };

  const activeFilters = useMemo(() => {
    const f = [];
    if (region !== "전체") f.push({ iconKey: "region", label: region });
    if (jobType !== "전체") f.push({ iconKey: "jobType", label: jobType });
    if (salaryMin > 0) f.push({ iconKey: "salary", label: salaryLabel });
    if (experience !== "전체") f.push({ iconKey: "experience", label: experience });
    if (education !== "전체") f.push({ iconKey: "education", label: education });
    if (!isV && industryG !== "전체") f.push({ iconKey: "industryG", label: industryG });
    if (isV && visualCat !== "all") {
      const c = VISUAL_CATEGORIES.find(x => x.id === visualCat);
      f.push({ iconKey: "visualCat", label: c?.label || visualCat });
    }
    if (isV && roleV !== "전체 직무") f.push({ iconKey: "roleV", label: roleV });
    if (isV && toolV !== "전체") f.push({ iconKey: "toolV", label: toolV });
    return f;
  }, [region, jobType, salaryMin, salaryLabel, experience, education, isV, industryG, visualCat, roleV, toolV]);

  const displayJobs = useMemo(() => {
    let list = [...jobs];
    if (resultFilter.trim()) {
      const q = resultFilter.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) || (j.role || "").toLowerCase().includes(q) ||
        (j.tools || "").toLowerCase().includes(q) || (j.industry || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "salary_desc") list.sort((a, b) => {
      const e = s => { const m = (s || "").match(/(\d[\d,]*)/); return m ? parseInt(m[1].replace(/,/g, "")) : 0; };
      return e(b.salary) - e(a.salary);
    });
    else if (sortBy === "deadline") list.sort((a, b) => (a.deadline || "z").localeCompare(b.deadline || "z"));
    return list;
  }, [jobs, resultFilter, sortBy]);

  /* ── NL Query Parser ── */
  const parseNLQuery = async (nlText) => {
    const prompt = `다음 한국어 취업 검색 문장을 분석해서 JSON으로 변환하세요.

입력: "${nlText}"

가능한 필터값:
- keyword: 검색할 주요 키워드/직무 (string)
- region: 전체|서울|경기|인천|부산|대구|대전|광주|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주|해외/리모트
- jobType: 전체|정규직|계약직|인턴|아르바이트|프리랜서|파견직
- experience: 전체|신입|1~3년|3~5년|5~10년|10년 이상|경력무관
- education: 전체|학력무관|고졸|전문대졸|대졸|석사 이상
- toolV: 전체|Maya|Blender|3ds Max|Cinema 4D|Houdini|ZBrush|After Effects|Premiere Pro|DaVinci Resolve|Nuke|Photoshop|Clip Studio|Toon Boom|Unreal Engine|Unity|Substance|Final Cut Pro
- visualCat: all|animation|film|broadcast|game|motiongfx|webtoon|video

JSON만 응답, 매핑되지 않는 항목은 제외:
{"keyword":"...","region":"...","experience":"..."}`;

    const text = await callClaudeAPI(prompt);
    try {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    } catch {}
    return { keyword: nlText };
  };

  /* ── Main Search ── */
  const searchJobs = async (overrides = {}) => {
    const effectiveKeyword = overrides.keyword ?? keyword;
    if (!effectiveKeyword.trim()) return;

    const effectiveRegion = overrides.region ?? region;
    const effectiveJobType = overrides.jobType ?? jobType;
    const effectiveExperience = overrides.experience ?? experience;
    const effectiveEducation = overrides.education ?? education;
    const effectiveVisualCat = overrides.visualCat ?? visualCat;
    const effectiveToolV = overrides.toolV ?? toolV;
    const effectiveRoleV = overrides.roleV ?? roleV;
    const effectiveIndustryG = overrides.industryG ?? industryG;

    setLoading(true); setError(""); setJobs([]); setSearched(true); setResultFilter("");

    const siteNames = selectedSites.map(id => sites.find(s => s.id === id)?.name).filter(Boolean).join(", ");
    const effectiveSalaryMin = SALARY_MARKS[salaryIdx] || 0;
    const salaryQ = effectiveSalaryMin > 0
      ? (effectiveSalaryMin >= 10000 ? "연봉 1억원 이상" : `연봉 ${effectiveSalaryMin.toLocaleString()}만원 이상`)
      : "";
    const expQ = EXPERIENCE_LEVELS.find(e => e.label === effectiveExperience)?.query || "";
    const eduQ = EDUCATION_LEVELS.find(e => e.label === effectiveEducation)?.query || "";

    let industryContext = "", roleQ = "", toolQ = "";

    if (isV) {
      const catObj = VISUAL_CATEGORIES.find(c => c.id === effectiveVisualCat);
      if (effectiveVisualCat !== "all") industryContext = `분야: ${catObj?.label} 업계`;
      const roles = VISUAL_ROLES[effectiveVisualCat] || VISUAL_ROLES.all;
      roleQ = roles.find(r => r.label === effectiveRoleV)?.query || "";
      toolQ = TOOLS_SOFTWARE.find(t => t.label === effectiveToolV)?.query || "";
    } else {
      const indQ = INDUSTRIES_GENERAL.find(i => i.label === effectiveIndustryG)?.query || "";
      if (indQ) industryContext = `업종: ${indQ}`;
    }

    const conditions = [
      effectiveRegion !== "전체" && `지역: ${effectiveRegion}`,
      effectiveJobType !== "전체" && `고용형태: ${effectiveJobType}`,
      salaryQ,
      expQ && `경력: ${expQ}`,
      eduQ && `학력: ${eduQ}`,
      industryContext,
      roleQ && `직무: ${roleQ}`,
      toolQ && `사용 툴: ${toolQ}`,
    ].filter(Boolean).join("\n");

    const sortMap = { recent: "최신 공고 우선", salary_desc: "연봉 높은 순서", deadline: "마감일 임박 순서", relevance: "관련도 순서" };

    const modeDesc = isV
      ? `한국의 애니메이션, 영화, 방송, 게임, 모션그래픽, 웹툰, 영상제작 업계에서 "${effectiveKeyword}" 관련 채용 공고를 검색해주세요.\n검색 대상: ${siteNames} 및 영상/미디어 관련 채용이 있는 모든 사이트`
      : `한국 취업 사이트에서 "${effectiveKeyword}" 관련 채용 공고를 검색해주세요.\n검색 대상 사이트: ${siteNames}`;

    const extraFields = isV
      ? `"role": "세부 직무 (예: 2D 애니메이터, VFX 아티스트, 영상 편집 등)",\n    "tools": "필요 툴/소프트웨어 (예: Maya, After Effects 등)",`
      : `"industry": "업종/직종",`;

    const prompt = `${modeDesc}
${conditions}
정렬: ${sortMap[sortBy]}

반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.
최대 15개의 실제 채용 공고를 찾아서 반환하세요.

[
  {
    "title": "공고 제목",
    "company": "회사/스튜디오명",
    "site": "출처 사이트명",
    "location": "근무지역",
    "salary": "급여 정보",
    "type": "고용형태",
    "experience": "경력 요건",
    "education": "학력 요건",
    ${extraFields}
    "url": "공고 URL",
    "deadline": "마감일"
  }
]`;

    try {
      const allText = await callClaudeAPI(prompt, true);
      const parsed = parseJobs(allText);
      if (parsed.length > 0) setJobs(parsed);
      else setError("검색 결과를 파싱할 수 없습니다. 다른 키워드로 시도해보세요.");
    } catch (err) {
      console.error(err);
      setError(`검색 중 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ── Search handler (with optional NL parsing) ── */
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setNlParsedMsg("");

    if (nlMode) {
      setNlLoading(true);
      try {
        const parsed = await parseNLQuery(keyword);
        const parts = [];
        if (parsed.keyword) parts.push(`키워드: ${parsed.keyword}`);
        if (parsed.region && parsed.region !== "전체") parts.push(`지역: ${parsed.region}`);
        if (parsed.experience && parsed.experience !== "전체") parts.push(`경력: ${parsed.experience}`);
        if (parsed.jobType && parsed.jobType !== "전체") parts.push(`고용형태: ${parsed.jobType}`);
        if (parsed.toolV && parsed.toolV !== "전체") parts.push(`툴: ${parsed.toolV}`);
        if (parsed.visualCat && parsed.visualCat !== "all") {
          const c = VISUAL_CATEGORIES.find(x => x.id === parsed.visualCat);
          if (c) parts.push(`분야: ${c.label}`);
        }
        if (parts.length > 0) setNlParsedMsg("AI 해석 → " + parts.join(" · "));
        await searchJobs(parsed);
      } catch (err) {
        await searchJobs();
      } finally {
        setNlLoading(false);
      }
    } else {
      await searchJobs();
    }
  };

  const filterCount = activeFilters.length + (selectedSites.length < sites.length ? 1 : 0);
  const roles = VISUAL_ROLES[visualCat] || VISUAL_ROLES.all;
  const quickTags = isV ? QUICK_KEYWORDS.visual : QUICK_KEYWORDS.general;
  const hasProfile = !!(profile?.name || profile?.skills || profile?.intro);

  /* ─── CSS ─── */
  const css = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
    @keyframes slideUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
    @keyframes shimmer { 0%{background-position:-200% center;}100%{background-position:200% center;} }
    @keyframes spin { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
    * { box-sizing: border-box; }
    input, select, button, textarea { font-family: ${FF}; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${th.border}; border-radius: 3px; }
    select option { background: ${th.inputBg}; color: ${th.textP}; }
    input[type=range] {
      -webkit-appearance: none; appearance: none; width: 100%; height: 5px;
      background: linear-gradient(to right, ${th.accent} 0%, ${th.accent} ${(salaryIdx/(SALARY_MARKS.length-1))*100}%, ${th.border} ${(salaryIdx/(SALARY_MARKS.length-1))*100}%, ${th.border} 100%);
      border-radius: 3px; outline: none; cursor: pointer;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; width: 18px; height: 18px;
      background: ${th.accent}; border-radius: 50%;
      border: 3px solid ${th.bg}; cursor: pointer;
      box-shadow: 0 0 0 2px ${th.accent}30;
    }
  `;

  return (
    <div style={{ minHeight: "100dvh", background: th.bg, color: th.textP, fontFamily: FF, transition: "background 0.4s ease" }}>
      <style>{css}</style>

      {/* ─── HEADER ─── */}
      <header style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${th.border}` }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: isV
            ? `radial-gradient(circle, ${th.accent}07 1px, transparent 1px)`
            : `linear-gradient(${th.border}30 1px, transparent 1px), linear-gradient(90deg, ${th.border}30 1px, transparent 1px)`,
          backgroundSize: isV ? "28px 28px" : "56px 56px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }} />

        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 30px", flexWrap: "wrap", gap: "12px" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
                background: `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isV
                  ? <FilmSlate size={15} color="#fff" weight="bold" />
                  : <Briefcase size={15} color="#fff" weight="bold" />
                }
              </div>
              <span style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: "17px", letterSpacing: "-0.03em", color: th.textP }}>
                HelloJob
              </span>
            </div>

            {/* Right side: mode tabs + profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Mode tabs */}
              <div style={{ display: "flex", background: th.surface, borderRadius: "12px", padding: "3px", border: `1px solid ${th.border}` }}>
                {[
                  { id: "general", label: "일반 채용", Icon: Briefcase },
                  { id: "visual",  label: "영상 전문",  Icon: FilmSlate },
                ].map(t => {
                  const active = mode === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setMode(t.id); setJobs([]); setSearched(false); setError(""); setNlParsedMsg(""); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "8px 14px", borderRadius: "9px", border: "none",
                        background: active ? th.accent + "18" : "transparent",
                        color: active ? th.accent : th.textM,
                        fontSize: "13px", fontWeight: active ? 700 : 500,
                        cursor: "pointer", transition: "all 0.2s", fontFamily: FF,
                      }}
                    >
                      <t.Icon size={14} weight={active ? "bold" : "regular"} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Profile button */}
              <button
                onClick={() => setShowProfile(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 14px", borderRadius: "10px",
                  border: `1px solid ${hasProfile ? th.accent + "40" : th.border}`,
                  background: hasProfile ? th.accent + "12" : th.surface,
                  color: hasProfile ? th.accent : th.textM,
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  fontFamily: FF, transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <User size={14} weight={hasProfile ? "bold" : "regular"} />
                {hasProfile ? (profile.name || "내 프로필") : "프로필 설정"}
              </button>
            </div>
          </div>

          {/* Left-aligned title */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{
              fontFamily: FF_DISPLAY,
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 900, margin: "0 0 12px",
              lineHeight: 1.05, letterSpacing: "-0.04em",
              color: th.textP,
            }}>
              {isV ? <><span>영상·미디어</span><br /><span>채용 통합검색</span></> : <><span>취업공고</span><br /><span>통합검색.</span></>}
            </h1>
            <p style={{ color: th.textM, fontSize: "13px", margin: 0, display: "flex", alignItems: "center", gap: "6px", fontFamily: FF }}>
              <Globe size={13} />
              {isV
                ? "애니메이션 · 영화 · 방송 · 게임 · 모션그래픽 · 웹툰 · 영상제작"
                : "사람인 · 잡코리아 · 알바몬 · 인크루트 · 원티드 · 캐치 · 링커리어 · 잡플래닛"
              }
            </p>
          </div>

          {/* Search bar */}
          <div style={{
            display: "flex", gap: "8px",
            background: th.inputBg, borderRadius: "14px",
            padding: "4px", border: `1px solid ${nlMode ? th.accent + "50" : th.border}`,
            transition: "border-color 0.3s",
          }}>
            {/* NL toggle */}
            <button
              onClick={() => { setNlMode(prev => !prev); setNlParsedMsg(""); }}
              title={nlMode ? "자연어 검색 OFF" : "자연어 검색 ON — 문장으로 검색"}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "10px 12px", borderRadius: "10px", border: "none",
                background: nlMode ? th.accent + "20" : "transparent",
                color: nlMode ? th.accent : th.textM,
                cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
              }}
            >
              <Lightning size={15} weight={nlMode ? "fill" : "regular"} />
              {nlMode && <span style={{ fontSize: "10px", fontWeight: 800, fontFamily: FF }}>자연어</span>}
            </button>

            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 6px 0 0", gap: "8px" }}>
              <MagnifyingGlass size={17} color={th.textM} weight="bold" />
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                placeholder={
                  nlMode
                    ? "예: 서울에서 Maya 쓰는 게임 회사 3년 경력..."
                    : isV ? "직무, 스튜디오, 툴, 키워드..." : "직무, 회사명, 키워드 검색..."
                }
                style={{
                  flex: 1, background: "transparent", border: "none",
                  outline: "none", color: th.textP, fontSize: "15px",
                  fontWeight: 500, padding: "12px 0", fontFamily: FF,
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={(loading || nlLoading) || !keyword.trim()}
              style={{
                padding: "11px 26px", borderRadius: "11px", border: "none",
                background: !keyword.trim() ? th.border : `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
                color: !keyword.trim() ? th.textM : "#fff",
                fontSize: "14px", fontWeight: 700,
                cursor: (loading || nlLoading) ? "wait" : !keyword.trim() ? "default" : "pointer",
                transition: "all 0.2s", whiteSpace: "nowrap", fontFamily: FF,
                boxShadow: keyword.trim() ? `0 4px 14px ${th.accent}30` : "none",
              }}
            >
              {nlLoading ? "해석중..." : loading ? "검색중..." : "검색"}
            </button>
          </div>

          {/* NL parsed message */}
          {nlParsedMsg && (
            <div style={{
              marginTop: "10px", display: "flex", alignItems: "center", gap: "6px",
              fontSize: "11.5px", color: th.accent, fontFamily: FF, fontWeight: 600,
              animation: "slideUp 0.3s ease",
            }}>
              <Robot size={12} weight="bold" />
              {nlParsedMsg}
            </div>
          )}

          {/* NL mode hint */}
          {nlMode && !nlParsedMsg && (
            <div style={{
              marginTop: "10px", fontSize: "11.5px", color: th.textM,
              fontFamily: FF, display: "flex", alignItems: "center", gap: "6px",
            }}>
              <Lightning size={11} color={th.accent} weight="bold" />
              자연어로 검색하면 AI가 지역, 경력, 툴 등을 자동으로 파악합니다
            </div>
          )}

          {/* Quick tags */}
          {!searched && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "14px" }}>
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setKeyword(tag)}
                  style={{
                    padding: "6px 13px", borderRadius: "20px",
                    border: `1px solid ${th.border}`, background: th.surface,
                    color: th.textM, fontSize: "12px", cursor: "pointer",
                    fontWeight: 500, transition: "all 0.2s", fontFamily: FF,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = th.accent + "50";
                    e.currentTarget.style.color = th.accent;
                    e.currentTarget.style.background = th.accent + "10";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = th.border;
                    e.currentTarget.style.color = th.textM;
                    e.currentTarget.style.background = th.surface;
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Filter toggle */}
          <div style={{ marginTop: "16px", paddingBottom: "24px" }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: filterCount > 0 ? th.accent + "14" : "transparent",
                border: filterCount > 0 ? `1px solid ${th.accent}28` : `1px solid ${th.border}`,
                color: filterCount > 0 ? th.accent : th.textM,
                fontSize: "12.5px", cursor: "pointer",
                padding: "7px 14px", borderRadius: "20px",
                transition: "all 0.2s", fontFamily: FF, fontWeight: 600,
              }}
            >
              <SlidersHorizontal size={13} weight="bold" />
              상세 필터 {showFilters ? "접기" : "펼치기"}
              {filterCount > 0 && (
                <span style={{
                  background: th.accent, color: "#fff",
                  borderRadius: "50%", width: "18px", height: "18px",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 900,
                }}>
                  {filterCount}
                </span>
              )}
              <CaretDown
                size={11}
                weight="bold"
                style={{ transform: showFilters ? "rotate(180deg)" : "", transition: "transform 0.3s", display: "block" }}
              />
            </button>

            {/* Filter panel */}
            {showFilters && (
              <div style={{
                marginTop: "12px", background: th.surface,
                borderRadius: "14px", padding: "22px",
                border: `1px solid ${th.border}`, animation: "slideUp 0.3s ease",
              }}>
                {/* Sites */}
                <div style={{ marginBottom: "18px" }}>
                  <p style={{ fontSize: "10.5px", fontWeight: 700, color: th.textM, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "5px", fontFamily: FF }}>
                    <Globe size={11} weight="bold" /> 검색 사이트
                  </p>
                  <SiteFilter sites={sites} selected={selectedSites} onToggle={toggleSite} th={th} />
                </div>

                <div style={{ height: "1px", background: th.border, margin: "4px 0 18px" }} />

                {/* Visual: Category Tabs */}
                {isV && (
                  <>
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ fontSize: "10.5px", fontWeight: 700, color: th.textM, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "5px", fontFamily: FF }}>
                        <FilmSlate size={11} weight="bold" /> 영상 분야
                      </p>
                      <CategoryTabs selected={visualCat} onChange={setVisualCat} th={th} />
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                      <StyledSelect label="세부 직무" Icon={Palette} value={roleV} onChange={setRoleV} options={roles} th={th} />
                      <StyledSelect label="사용 툴" Icon={Monitor} value={toolV} onChange={setToolV} options={TOOLS_SOFTWARE} th={th} />
                    </div>
                    <div style={{ height: "1px", background: th.border, margin: "4px 0 18px" }} />
                  </>
                )}

                {/* Salary */}
                <div style={{ marginBottom: "18px" }}>
                  <p style={{ fontSize: "10.5px", fontWeight: 700, color: th.textM, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "5px", fontFamily: FF }}>
                    <CurrencyDollar size={11} weight="bold" /> 연봉 범위
                  </p>
                  <input
                    type="range" min={0} max={SALARY_MARKS.length - 1}
                    value={salaryIdx} onChange={e => setSalaryIdx(parseInt(e.target.value))}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                    <span style={{ fontSize: "11px", color: th.textM, fontFamily: FF }}>전체</span>
                    <span style={{
                      fontSize: "13px", fontWeight: 700, fontFamily: FF,
                      color: salaryMin > 0 ? th.accent : th.textM,
                      background: salaryMin > 0 ? th.accent + "14" : "transparent",
                      padding: "2px 10px", borderRadius: "10px",
                    }}>
                      {salaryLabel}
                    </span>
                    <span style={{ fontSize: "11px", color: th.textM, fontFamily: FF }}>1억+</span>
                  </div>
                </div>

                <div style={{ height: "1px", background: th.border, margin: "4px 0 18px" }} />

                {/* Filters row 1 */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <StyledSelect label="지역" Icon={MapPin} value={region} onChange={setRegion} options={REGIONS.map(r => ({ label: r }))} th={th} />
                  <StyledSelect label="고용형태" Icon={FileText} value={jobType} onChange={setJobType} options={JOB_TYPES.map(t => ({ label: t }))} th={th} />
                  <StyledSelect label="경력" Icon={Star} value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} th={th} />
                </div>
                {/* Filters row 2 */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <StyledSelect label="학력" Icon={GraduationCap} value={education} onChange={setEducation} options={EDUCATION_LEVELS} th={th} />
                  {!isV && <StyledSelect label="업종/직종" Icon={Factory} value={industryG} onChange={setIndustryG} options={INDUSTRIES_GENERAL} th={th} />}
                  <StyledSelect label="정렬" Icon={ArrowsDownUp} value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} valueKey="value" th={th} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 24px" }}>
        <ActiveFilters filters={activeFilters} onClear={clearFilter} onClearAll={clearAll} th={th} />

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "14px" }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} th={th} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "#1C0A0A", border: "1px solid #5B1A1A",
            borderRadius: "12px", padding: "18px 20px",
            color: "#FB7185", fontSize: "14px", fontFamily: FF,
          }}>
            <WarningCircle size={20} color="#EF4444" weight="bold" />
            {error}
          </div>
        )}

        {/* Results */}
        {jobs.length > 0 && !loading && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <p style={{ color: th.textM, fontSize: "13px", fontWeight: 600, margin: 0, fontFamily: FF }}>
                  <span style={{ color: th.accent, fontWeight: 800 }}>{displayJobs.length}</span>개 공고
                  {displayJobs.length !== jobs.length && (
                    <span style={{ color: th.textM }}> (전체 {jobs.length}개 중)</span>
                  )}
                </p>
                {hasProfile && (
                  <span style={{
                    fontSize: "11px", color: th.textM, fontFamily: FF,
                    display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    <Robot size={11} weight="bold" />
                    매칭 점수 표시 중
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: th.inputBg, borderRadius: "10px", padding: "7px 13px", border: `1px solid ${th.border}` }}>
                <MagnifyingGlass size={13} color={th.textM} />
                <input
                  type="text"
                  value={resultFilter}
                  onChange={e => setResultFilter(e.target.value)}
                  placeholder="결과 내 검색..."
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: th.textP, fontSize: "13px", width: "160px", fontFamily: FF,
                  }}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "14px" }}>
              {displayJobs.map((job, i) => (
                <JobCard
                  key={i}
                  job={job}
                  index={i}
                  mode={mode}
                  th={th}
                  profile={profile}
                  onCoverLetter={setCoverJob}
                />
              ))}
            </div>
            {displayJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 20px", color: th.textM, fontSize: "14px", fontFamily: FF }}>
                결과 내 검색에 일치하는 공고가 없습니다.
              </div>
            )}
          </>
        )}

        {/* Empty state — no search yet */}
        {!loading && !error && jobs.length === 0 && !searched && (
          <div style={{ padding: "60px 20px 40px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: th.accent + "16", border: `1px solid ${th.accent}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "18px",
            }}>
              {isV
                ? <FilmSlate size={22} color={th.accent} weight="bold" />
                : <MagnifyingGlass size={22} color={th.accent} weight="bold" />
              }
            </div>
            <h2 style={{ fontFamily: FF_DISPLAY, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em", color: th.textP, margin: "0 0 8px" }}>
              {isV ? "영상·미디어 채용을 검색해보세요" : "채용공고를 검색해보세요"}
            </h2>
            <p style={{ color: th.textM, fontSize: "14px", margin: "0 0 8px", lineHeight: 1.6, fontFamily: FF }}>
              {isV ? "국내 주요 영상·미디어 채용 사이트를 한번에 검색합니다." : "여러 취업 사이트의 공고를 한번에 모아서 보여드립니다."}
            </p>
            {!hasProfile && (
              <p style={{ color: th.textM, fontSize: "13px", margin: "0 0 24px", fontFamily: FF, display: "flex", alignItems: "center", gap: "6px" }}>
                <User size={13} color={th.accent} />
                <button
                  onClick={() => setShowProfile(true)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: th.accent, fontFamily: FF, fontSize: "13px",
                    fontWeight: 600, padding: 0, textDecoration: "underline",
                  }}
                >
                  프로필을 설정
                </button>
                하면 매칭 점수와 AI 자기소개서를 활용할 수 있습니다
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setKeyword(tag)}
                  style={{
                    padding: "7px 14px", borderRadius: "20px",
                    border: `1px solid ${th.border}`, background: th.surface,
                    color: th.textM, fontSize: "12.5px", cursor: "pointer",
                    fontWeight: 500, transition: "all 0.2s", fontFamily: FF,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = th.accent + "50";
                    e.currentTarget.style.color = th.accent;
                    e.currentTarget.style.background = th.accent + "10";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = th.border;
                    e.currentTarget.style.color = th.textM;
                    e.currentTarget.style.background = th.surface;
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — searched, no results */}
        {!loading && !error && jobs.length === 0 && searched && (
          <div style={{ padding: "60px 20px 40px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: th.surfaceAlt, border: `1px solid ${th.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "18px",
            }}>
              <SmileySad size={22} color={th.textM} weight="bold" />
            </div>
            <h2 style={{ fontFamily: FF_DISPLAY, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em", color: th.textP, margin: "0 0 8px" }}>
              검색 결과가 없습니다
            </h2>
            <p style={{ color: th.textM, fontSize: "14px", margin: 0, fontFamily: FF }}>
              다른 키워드나 필터로 다시 시도해보세요.
            </p>
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{
        textAlign: "center", padding: "28px 24px",
        color: th.textM, fontSize: "11.5px",
        borderTop: `1px solid ${th.border}`,
        fontFamily: FF,
      }}>
        AI 웹 검색 기반 {isV ? "영상·미디어 업계" : "취업공고"} 통합검색 · 결과는 각 사이트의 최신 공고와 다를 수 있습니다
      </footer>

      {/* ─── MODALS ─── */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          onSave={(p) => { saveProfile(p); }}
          onClose={() => setShowProfile(false)}
          th={th}
        />
      )}
      {coverJob && (
        <CoverLetterModal
          job={coverJob}
          profile={profile}
          onClose={() => setCoverJob(null)}
          th={th}
        />
      )}
    </div>
  );
}
