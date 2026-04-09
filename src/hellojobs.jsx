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
/*  DATA                                                       */
/* ═══════════════════════════════════════════════════════════ */
const SITES_GENERAL = [
  { id: "saramin",   name: "사람인",   color: "#3B82F6" },
  { id: "jobkorea",  name: "잡코리아",  color: "#EF4444" },
  { id: "albamon",   name: "알바몬",   color: "#F97316" },
  { id: "incruit",   name: "인크루트",  color: "#22C55E" },
  { id: "wanted",    name: "원티드",   color: "#8B5CF6" },
  { id: "catch",     name: "캐치",    color: "#EAB308" },
  { id: "linkareer", name: "링커리어",  color: "#14B8A6" },
  { id: "jobplanet", name: "잡플래닛",  color: "#EC4899" },
];

const INDUSTRIES_GENERAL = [
  { label: "전체", query: "" },
  { label: "IT/SW개발",    query: "IT 소프트웨어 개발" },
  { label: "마케팅/광고",   query: "마케팅 광고 홍보" },
  { label: "디자인",       query: "디자인 UI UX 그래픽" },
  { label: "영업/판매",    query: "영업 판매" },
  { label: "경영/사무",    query: "경영 사무 행정" },
  { label: "생산/제조",    query: "생산 제조 품질" },
  { label: "연구개발(R&D)", query: "연구개발 R&D" },
  { label: "교육",        query: "교육 강사" },
  { label: "의료/보건",    query: "의료 보건 간호" },
  { label: "금융/회계",    query: "금융 회계 재무" },
  { label: "물류/유통",    query: "물류 유통 배송" },
  { label: "서비스/외식",  query: "서비스 외식 요리" },
  { label: "건설/토목",    query: "건설 토목 건축" },
];

const SITES_VISUAL = [
  { id: "saramin",    name: "사람인",      color: "#F472B6" },
  { id: "jobkorea",   name: "잡코리아",    color: "#FB7185" },
  { id: "wanted",     name: "원티드",      color: "#A855F7" },
  { id: "catch",      name: "캐치",       color: "#FBBF24" },
  { id: "linkareer",  name: "링커리어",    color: "#34D399" },
  { id: "gamejob",    name: "게임잡",     color: "#60A5FA" },
  { id: "animationk", name: "애니메이션K", color: "#F472B6" },
  { id: "cgworld",    name: "CG/VFX",    color: "#C084FC" },
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

const EXTRA_SOURCES = {
  general: [
    { id: "linkedin",  label: "LinkedIn",      url: "linkedin.com/jobs",         note: "글로벌·국내 채용공고",        color: "#0A66C2" },
    { id: "kmong",     label: "크몽",           url: "kmong.com",                 note: "프리랜서 의뢰 포함",          color: "#6366F1" },
    { id: "soomgo",    label: "숨고",           url: "soomgo.com",                note: "재능마켓 의뢰",               color: "#F59E0B" },
    { id: "blog",      label: "네이버 블로그",  url: "blog.naver.com",            note: "구인 게시글",                 color: "#03C75A" },
    { id: "community", label: "커뮤니티 전체",  url: "",                          note: "블로그·카페·SNS 구인 포함",    color: "#8B5CF6" },
  ],
  visual: [
    { id: "linkedin",  label: "LinkedIn",      url: "linkedin.com/jobs",         note: "글로벌·국내 채용공고",        color: "#0A66C2" },
    { id: "rhymage",   label: "라임아지 카페",  url: "cafe.naver.com/rhymage",   note: "영상업계 구인 (공개글)",       color: "#03C75A" },
    { id: "artjob",    label: "아트잡",         url: "artjob.kr",                 note: "영상·디자인 전문 구인",        color: "#F97316" },
    { id: "kmong",     label: "크몽",           url: "kmong.com",                 note: "영상 프리랜서 의뢰",           color: "#6366F1" },
    { id: "soomgo",    label: "숨고",           url: "soomgo.com",                note: "영상 재능마켓",               color: "#F59E0B" },
    { id: "community", label: "커뮤니티 전체",  url: "",                          note: "블로그·카페·SNS 구인 포함",    color: "#8B5CF6" },
  ],
};

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
  { label: "Maya", query: "Maya" },
  { label: "Blender", query: "Blender" },
  { label: "3ds Max", query: "3ds Max" },
  { label: "Cinema 4D", query: "Cinema 4D C4D" },
  { label: "Houdini", query: "Houdini" },
  { label: "ZBrush", query: "ZBrush" },
  { label: "After Effects", query: "After Effects" },
  { label: "Premiere Pro", query: "Premiere Pro" },
  { label: "DaVinci Resolve", query: "DaVinci Resolve" },
  { label: "Nuke", query: "Nuke 컴포지팅" },
  { label: "Photoshop", query: "Photoshop" },
  { label: "Clip Studio", query: "Clip Studio Paint" },
  { label: "Toon Boom", query: "Toon Boom Harmony" },
  { label: "Unreal Engine", query: "Unreal Engine 언리얼" },
  { label: "Unity", query: "Unity 유니티" },
  { label: "Substance", query: "Substance Painter Designer" },
  { label: "Final Cut Pro", query: "Final Cut Pro" },
];

const REGIONS = [
  "전체","서울","경기","인천","부산","대구","대전","광주",
  "울산","세종","강원","충북","충남","전북","전남","경북","경남","제주","해외/리모트",
];
const JOB_TYPES = ["전체","정규직","계약직","인턴","아르바이트","프리랜서","파견직","프로젝트 단위"];
const SALARY_MARKS = [0, 2400, 3000, 4000, 5000, 6000, 8000, 10000];
const EXPERIENCE_LEVELS = [
  { label: "전체",    query: "" },
  { label: "신입",    query: "신입" },
  { label: "1~3년",  query: "경력 1~3년" },
  { label: "3~5년",  query: "경력 3~5년" },
  { label: "5~10년", query: "경력 5~10년" },
  { label: "10년 이상", query: "경력 10년 이상" },
  { label: "경력무관", query: "경력무관" },
];
const EDUCATION_LEVELS = [
  { label: "전체",    query: "" },
  { label: "학력무관", query: "학력무관" },
  { label: "고졸",    query: "고졸" },
  { label: "전문대졸", query: "전문대졸" },
  { label: "대졸",    query: "대졸 4년제" },
  { label: "석사 이상", query: "석사 이상" },
];
const SORT_OPTIONS = [
  { label: "관련도순",   value: "relevance" },
  { label: "최신순",    value: "recent" },
  { label: "연봉 높은순", value: "salary_desc" },
  { label: "마감임박순", value: "deadline" },
];

const QUICK_KEYWORDS = {
  general: ["프론트엔드 개발자","데이터 분석","마케팅","디자이너","백엔드 개발","회계","영업","인사"],
  visual:  ["2D 애니메이터","3D 모델러","영상 편집","모션그래픽","VFX","웹툰 어시","게임 이펙트","촬영감독","CG 디자이너","시네마틱"],
};

const CATEGORY_ICONS = {
  all: SquaresFour, animation: FilmSlate, film: FilmStrip,
  broadcast: Television, game: GameController, motiongfx: Swatches,
  webtoon: BookOpen, video: VideoCamera,
};

const FILTER_ICON_MAP = {
  region: MapPin, jobType: FileText, salary: CurrencyDollar,
  experience: Star, education: GraduationCap, industryG: Factory,
  visualCat: FilmSlate, roleV: Palette, toolV: Monitor,
};

/* ═══════════════════════════════════════════════════════════ */
/*  HELPERS                                                    */
/* ═══════════════════════════════════════════════════════════ */
function parseJobs(text) {
  try {
    // Handle markdown code block wrapping (```json [...] ```)
    const block = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
    if (block) {
      const p = JSON.parse(block[1]);
      if (Array.isArray(p)) return p.filter(j => j.title && j.company);
    }
    // Bare JSON array fallback
    const m = text.match(/\[[\s\S]*\]/);
    if (m) {
      const p = JSON.parse(m[0]);
      if (Array.isArray(p)) return p.filter(j => j.title && j.company);
    }
  } catch {}
  return [];
}

function getAIProvider() {
  try {
    const p = JSON.parse(localStorage.getItem("hj_profile") || "{}");
    return {
      provider: p.aiProvider || "claude",
      claudeKey: p.apiKey || "",
      geminiKey: p.geminiApiKey || "",
    };
  } catch {
    return { provider: "claude", claudeKey: "", geminiKey: "" };
  }
}

async function callClaudeAPI(prompt, useWebSearch = false) {
  const { claudeKey } = getAIProvider();

  if (import.meta.env.DEV) {
    const key = claudeKey || import.meta.env.VITE_ANTHROPIC_API_KEY || "";
    if (!key) throw new Error(".env 파일에 VITE_ANTHROPIC_API_KEY를 추가해주세요.");
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    };
    if (useWebSearch) headers["anthropic-beta"] = "web-search-2025-03-05";
    const body = {
      model: "claude-sonnet-4-5",
      max_tokens: useWebSearch ? 4000 : 2000,
      messages: [{ role: "user", content: prompt }],
    };
    if (useWebSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const devRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers, body: JSON.stringify(body),
    });
    if (!devRes.ok) {
      const e = await devRes.json().catch(() => ({}));
      throw new Error(e.error?.message || `API 오류: ${devRes.status}`);
    }
    const devData = await devRes.json();
    let devText = "";
    for (const b of devData.content) if (b.type === "text") devText += b.text;
    return devText;
  }

  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, useWebSearch, userApiKey: claudeKey }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || `API 오류: ${res.status}`);
  }
  const data = await res.json();
  let text = "";
  for (const b of data.content) if (b.type === "text") text += b.text;
  return text;
}

async function callGeminiAPI(prompt) {
  const { geminiKey } = getAIProvider();

  if (import.meta.env.DEV) {
    const key = geminiKey || import.meta.env.VITE_GEMINI_API_KEY || "";
    if (!key) throw new Error(".env 파일에 VITE_GEMINI_API_KEY를 추가해주세요.");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000 },
        }),
      }
    );
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error?.message || `Gemini API 오류: ${res.status}`);
    }
    const d = await res.json();
    return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, userApiKey: geminiKey }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || `API 오류: ${res.status}`);
  }
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/* 일반 AI 호출 (Claude/Gemini 자동 라우팅, 웹 검색 없음) */
async function callAI(prompt) {
  const { provider } = getAIProvider();
  if (provider === "gemini") return callGeminiAPI(prompt);
  return callClaudeAPI(prompt, false);
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
        const minY = Math.min(...nums), maxY = nums.length >= 2 ? Math.max(...nums) : 99;
        if (yrs >= minY && yrs <= maxY) points += 20;
        else if (yrs >= minY - 1) points += 10;
      }
    }
  }
  if (max === 0) return null;
  return Math.min(100, Math.round((points / max) * 100));
}

/* ═══════════════════════════════════════════════════════════ */
/*  DESIGN TOKENS                                             */
/* ═══════════════════════════════════════════════════════════ */
const FF      = "'Pretendard','Noto Sans KR',sans-serif";
const FF_DISP = "'Outfit','Pretendard',sans-serif";

function getTheme(mode) {
  if (mode === "visual") return {
    bg:         "#FDF8FF",
    surface:    "#FFFFFF",
    surfaceAlt: "#F5F0FC",
    border:     "#E6DFF2",
    borderHi:   "#CBBFE2",
    accent:     "#C026D3",
    accentAlt:  "#9333EA",
    textP:      "#1A0F2E",
    textM:      "#9181AA",
    textS:      "#6B5D88",
    inputBg:    "#FFFFFF",
    glow:       "rgba(192,38,211,0.08)",
  };
  return {
    bg:         "#F7F8FA",
    surface:    "#FFFFFF",
    surfaceAlt: "#EFF1F5",
    border:     "#E2E5EB",
    borderHi:   "#C8CDD8",
    accent:     "#059669",
    accentAlt:  "#047857",
    textP:      "#0F1117",
    textM:      "#8A909C",
    textS:      "#5E6472",
    inputBg:    "#FFFFFF",
    glow:       "rgba(5,150,105,0.08)",
  };
}

/* ═══════════════════════════════════════════════════════════ */
/*  SHARED UI ATOMS                                            */
/* ═══════════════════════════════════════════════════════════ */
function Pill({ Icon, label, color, th, onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: color ? `${color}12` : th.surfaceAlt,
      color: color || th.textS,
      padding: "3px 10px 3px 8px", borderRadius: "99px",
      fontSize: "11px", fontWeight: 600, letterSpacing: "0.01em",
      border: `1px solid ${color ? color + "20" : th.border}`,
      fontFamily: FF,
    }}>
      {Icon && <Icon size={10} weight="bold" />}
      {label}
      {onRemove && (
        <span
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ cursor: "pointer", opacity: 0.5, display: "flex", alignItems: "center", marginLeft: "1px" }}
        >
          <X size={10} weight="bold" />
        </span>
      )}
    </span>
  );
}

function InfoTag({ Icon, text, color, th }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: color ? `${color}0E` : th.surfaceAlt,
      color: color || th.textS,
      padding: "3px 8px", borderRadius: "6px",
      fontSize: "11px", fontWeight: 600,
      border: `1px solid ${color ? color + "1A" : th.border}`,
      fontFamily: FF,
    }}>
      {Icon && <Icon size={10} weight="bold" />}
      {text}
    </span>
  );
}

function SelectField({ label, Icon, value, onChange, options, valueKey, th }) {
  return (
    <div style={{ flex: 1, minWidth: "148px" }}>
      <label style={{
        display: "flex", alignItems: "center", gap: "4px",
        fontSize: "10px", fontWeight: 700, color: th.textM,
        textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: "7px", fontFamily: FF,
      }}>
        {Icon && <Icon size={10} weight="bold" />}
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="hj-select"
        style={{
          width: "100%", padding: "9px 14px", borderRadius: "10px",
          border: `1px solid ${th.border}`, background: th.inputBg,
          color: th.textP, fontSize: "12.5px", outline: "none",
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

/* ═══════════════════════════════════════════════════════════ */
/*  PROFILE MODAL                                             */
/* ═══════════════════════════════════════════════════════════ */
function ProfileModal({ profile, onSave, onClose, th }) {
  const [form, setForm] = useState({
    name: "", expYears: "", skills: "", desiredSalary: "",
    desiredRegion: "전체", jobTypes: "전체",
    strength: "", specialty: "", hobby: "", experience: "", goal: "",
    intro: "",
    apiKey: "", geminiApiKey: "", aiProvider: "claude",
    ...profile,
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: `1px solid ${th.border}`, background: th.inputBg,
    color: th.textP, fontSize: "13px", outline: "none",
    fontFamily: FF, boxSizing: "border-box",
    transition: "border-color 0.2s cubic-bezier(0.16,1,0.3,1)",
  };
  const lbl = {
    display: "block", fontSize: "10px", fontWeight: 700,
    color: th.textM, textTransform: "uppercase",
    letterSpacing: "0.1em", marginBottom: "7px", fontFamily: FF,
  };
  const sectionTitle = {
    fontSize: "10px", fontWeight: 700, color: th.textS,
    textTransform: "uppercase", letterSpacing: "0.1em",
    fontFamily: FF, display: "flex", alignItems: "center", gap: "6px",
  };
  const focus = e => { e.currentTarget.style.borderColor = th.accent; };
  const blur  = e => { e.currentTarget.style.borderColor = th.border; };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(15,17,26,0.42)", backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="hj-modal"
        style={{
          background: th.surface,
          border: `1px solid ${th.borderHi}`,
          borderRadius: "20px",
          width: "100%", maxWidth: "540px",
          maxHeight: "92vh", overflowY: "auto",
          boxShadow: `0 24px 64px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.9) inset`,
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 24px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
              background: `${th.accent}14`, border: `1px solid ${th.accent}22`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={17} color={th.accent} weight="bold" />
            </div>
            <div>
              <div style={{ fontFamily: FF_DISP, fontWeight: 800, fontSize: "15px", color: th.textP, letterSpacing: "-0.03em" }}>내 프로필</div>
              <div style={{ fontSize: "11px", color: th.textM, fontFamily: FF, marginTop: "1px" }}>매칭 점수 · AI 자기소개서에 활용됩니다</div>
            </div>
          </div>
          <button onClick={onClose} className="hj-icon-btn"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: th.textM, padding: "8px", borderRadius: "8px",
              display: "flex", alignItems: "center", transition: "all 0.15s",
            }}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ── 기본 정보 ── */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 130px" }}>
              <label style={lbl}>이름</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="홍길동" style={field} onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ flex: "0 0 90px" }}>
              <label style={lbl}>경력 (년)</label>
              <input value={form.expYears} onChange={e => set("expYears", e.target.value)}
                placeholder="0" type="number" min="0" max="40"
                style={field} onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ flex: "1 1 120px" }}>
              <label style={lbl}>희망 지역</label>
              <select value={form.desiredRegion} onChange={e => set("desiredRegion", e.target.value)}
                style={{ ...field, appearance: "none", cursor: "pointer" }}
                onFocus={focus} onBlur={blur}>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>보유 기술 키워드 (쉼표 구분)</label>
            <input value={form.skills} onChange={e => set("skills", e.target.value)}
              placeholder="Maya, 3D 모델링, Blender, After Effects..."
              style={field} onFocus={focus} onBlur={blur} />
            <div style={{ fontSize: "10.5px", color: th.textM, marginTop: "5px", fontFamily: FF }}>
              공고 매칭 점수 계산에 사용됩니다
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 130px" }}>
              <label style={lbl}>희망 연봉 (만원)</label>
              <input value={form.desiredSalary} onChange={e => set("desiredSalary", e.target.value)}
                placeholder="4000" type="number" min="0"
                style={field} onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={lbl}>희망 고용형태</label>
              <select value={form.jobTypes} onChange={e => set("jobTypes", e.target.value)}
                style={{ ...field, appearance: "none", cursor: "pointer" }}
                onFocus={focus} onBlur={blur}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ height: "1px", background: th.border }} />

          {/* ── 자기소개서 도우미 ── */}
          <div>
            <div style={sectionTitle}>
              <PencilSimple size={10} weight="bold" color={th.accent} />
              자기소개서 도우미
              <span style={{ fontWeight: 400, opacity: 0.65, textTransform: "none", letterSpacing: 0 }}>
                — 간단히 써두면 AI가 자연스럽게 합쳐드려요
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 190px" }}>
                  <label style={lbl}>핵심 강점</label>
                  <input value={form.strength} onChange={e => set("strength", e.target.value)}
                    placeholder="꼼꼼한 품질 관리, 팀 협업, 마감 준수..."
                    style={field} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ flex: "1 1 190px" }}>
                  <label style={lbl}>특기</label>
                  <input value={form.specialty} onChange={e => set("specialty", e.target.value)}
                    placeholder="3D 캐릭터 모델링, 속도 빠른 작업..."
                    style={field} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 190px" }}>
                  <label style={lbl}>취미 / 관심사</label>
                  <input value={form.hobby} onChange={e => set("hobby", e.target.value)}
                    placeholder="영화 감상, 드로잉, 게임, 여행..."
                    style={field} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ flex: "1 1 190px" }}>
                  <label style={lbl}>커리어 목표</label>
                  <input value={form.goal} onChange={e => set("goal", e.target.value)}
                    placeholder="3D 애니메이터로 성장하고 싶어요..."
                    style={field} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              <div>
                <label style={lbl}>주요 경험 / 프로젝트</label>
                <textarea value={form.experience} onChange={e => set("experience", e.target.value)}
                  rows={3}
                  placeholder="○○ 애니메이션 스튜디오 인턴 6개월, 단편영화 VFX 참여, 팀 프로젝트 리드..."
                  style={{ ...field, resize: "vertical", lineHeight: 1.65, minHeight: "76px" }}
                  onFocus={focus} onBlur={blur} />
              </div>

            </div>
          </div>

          <div style={{ height: "1px", background: th.border }} />

          {/* ── AI 설정 ── */}
          <div>
            <div style={sectionTitle}>
              <Robot size={10} weight="bold" color={th.accent} />
              AI 설정
            </div>

            {/* Provider toggle */}
            <div style={{ display: "flex", gap: "6px", margin: "10px 0 14px" }}>
              {[
                { id: "claude", label: "Claude (Anthropic)" },
                { id: "gemini", label: "Gemini (Google)" },
              ].map(p => {
                const active = form.aiProvider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => set("aiProvider", p.id)}
                    style={{
                      padding: "6px 14px", borderRadius: "99px",
                      border: `1px solid ${active ? th.accent + "44" : th.border}`,
                      background: active ? `${th.accent}12` : "transparent",
                      color: active ? th.accent : th.textM,
                      fontSize: "11.5px", fontWeight: active ? 700 : 500,
                      cursor: "pointer", fontFamily: FF,
                      transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {form.aiProvider === "claude" && (
              <div>
                <label style={lbl}>Claude API 키 (선택)</label>
                <input value={form.apiKey} onChange={e => set("apiKey", e.target.value)}
                  placeholder="sk-ant-api03-..." type="password"
                  style={field} onFocus={focus} onBlur={blur} />
                <div style={{ fontSize: "10.5px", color: th.textM, marginTop: "5px", fontFamily: FF }}>
                  AI 분석 · 자기소개서 · 취업공고 검색에 필요 — console.anthropic.com
                </div>
              </div>
            )}

            {form.aiProvider === "gemini" && (
              <div>
                <label style={lbl}>Gemini API 키 (선택)</label>
                <input value={form.geminiApiKey} onChange={e => set("geminiApiKey", e.target.value)}
                  placeholder="AIza..." type="password"
                  style={field} onFocus={focus} onBlur={blur} />
                <div style={{ fontSize: "10.5px", color: th.textM, marginTop: "5px", fontFamily: FF }}>
                  AI 분석 · 자기소개서에 사용 (취업공고 검색은 Claude 필요) — aistudio.google.com
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="hj-btn"
            style={{
              width: "100%", padding: "13px",
              background: saved ? th.accent : `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
              border: "none", borderRadius: "11px",
              color: "#fff", fontSize: "13.5px", fontWeight: 700,
              cursor: "pointer", fontFamily: FF,
              transition: "background 0.3s, transform 0.15s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: `0 4px 20px ${th.accent}28`,
            }}
          >
            {saved ? "저장 완료" : "프로필 저장"}
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
      profile?.name      && `이름: ${profile.name}`,
      profile?.expYears  ? `경력: ${profile.expYears}년` : "경력: 신입",
      profile?.skills    && `보유 기술/역량: ${profile.skills}`,
      profile?.strength  && `핵심 강점: ${profile.strength}`,
      profile?.specialty && `특기: ${profile.specialty}`,
      profile?.hobby     && `취미·관심사: ${profile.hobby}`,
      profile?.experience && `주요 경험: ${profile.experience}`,
      profile?.goal      && `커리어 목표: ${profile.goal}`,
      profile?.intro     && `기타 소개: ${profile.intro}`,
    ].filter(Boolean).join("\n");

    const prompt = `아래 채용공고와 지원자 정보를 바탕으로 한국어 자기소개서 초안을 써주세요.

[핵심 지시사항]
- 실제 사람이 쓴 것처럼 자연스럽고 솔직하게 쓸 것
- "저는 ~에 매우 열정적입니다", "도전을 두려워하지 않는", "성장하는" 같은 AI 투의 상투적 표현 절대 금지
- 지원자의 구체적인 특성과 경험이 자연스럽게 녹아들도록 작성
- 각 항목 200~250자, 읽기 편한 구어체와 문어체 혼용 가능

[채용공고]
직무: ${job.title}
회사: ${job.company}
위치: ${job.location || "미기재"}
급여: ${job.salary || "미기재"}
경력: ${job.experience || "미기재"}
고용형태: ${job.type || "미기재"}${job.tools ? `\n필요 기술: ${job.tools}` : ""}${job.role ? `\n세부 직무: ${job.role}` : ""}${job.industry ? `\n업종: ${job.industry}` : ""}

[지원자 정보]
${profileLines || "프로필 미입력"}

## 1. 지원 동기
## 2. 경력 및 역량
## 3. 강점 및 포부`;

    try {
      const result = await callAI(prompt);
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
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const renderBody = raw => raw.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "7px",
          fontWeight: 800, fontSize: "11px", color: th.accent,
          margin: i === 0 ? "0 0 10px" : "22px 0 10px",
          fontFamily: FF, textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: th.accent, flexShrink: 0 }} />
          {line.replace("## ", "")}
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} style={{ height: "4px" }} />;
    return <div key={i} style={{ color: th.textP, fontSize: "13.5px", lineHeight: 1.8, fontFamily: FF }}>{line}</div>;
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(15,17,26,0.48)", backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="hj-modal"
        style={{
          background: th.surface,
          border: `1px solid ${th.borderHi}`,
          borderRadius: "20px",
          width: "100%", maxWidth: "600px",
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          boxShadow: `0 24px 64px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.9) inset`,
        }}
      >
        {/* Modal top bar */}
        <div style={{
          padding: "18px 20px 18px 22px",
          borderBottom: `1px solid ${th.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
              background: `${th.accent}12`, border: `1px solid ${th.accent}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PencilSimple size={16} color={th.accent} weight="bold" />
            </div>
            <div>
              <div style={{ fontFamily: FF_DISP, fontWeight: 800, fontSize: "14px", color: th.textP, letterSpacing: "-0.02em" }}>
                AI 자기소개서 초안
              </div>
              <div style={{ fontSize: "11px", color: th.textM, fontFamily: FF, marginTop: "1px" }}>
                {job.title} · {job.company}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {text && !loading && (
              <>
                <button
                  onClick={handleCopy}
                  className="hj-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 11px", borderRadius: "9px",
                    border: `1px solid ${copied ? th.accent + "40" : th.border}`,
                    background: copied ? `${th.accent}12` : "transparent",
                    color: copied ? th.accent : th.textS,
                    fontSize: "11.5px", cursor: "pointer", fontFamily: FF, fontWeight: 600,
                    transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <Copy size={12} weight="bold" />
                  {copied ? "복사됨" : "복사"}
                </button>
                <button
                  onClick={generate}
                  className="hj-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 11px", borderRadius: "9px",
                    border: `1px solid ${th.accent}28`,
                    background: `${th.accent}10`,
                    color: th.accent, fontSize: "11.5px", cursor: "pointer",
                    fontFamily: FF, fontWeight: 700,
                    transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <Robot size={12} weight="bold" />
                  재생성
                </button>
              </>
            )}
            <button onClick={onClose} className="hj-icon-btn"
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: th.textM, padding: "7px", borderRadius: "8px",
                display: "flex", alignItems: "center", transition: "all 0.15s",
              }}
            >
              <X size={17} weight="bold" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "64px 20px", gap: "16px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: `2px solid ${th.border}`,
                borderTopColor: th.accent,
                animation: "hj-spin 0.75s linear infinite",
              }} />
              <div style={{ color: th.textM, fontSize: "12.5px", fontFamily: FF }}>
                자기소개서를 작성하는 중입니다
              </div>
            </div>
          )}
          {error && !loading && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#FFF5F5", border: "1px solid #FECDCA",
              borderRadius: "10px", padding: "14px 16px",
              color: "#C0392B", fontSize: "12.5px", fontFamily: FF,
            }}>
              <WarningCircle size={16} color="#E53E3E" weight="bold" />
              {error}
              <button onClick={generate}
                style={{
                  marginLeft: "auto", background: "transparent",
                  border: "1px solid #FECDCA", color: "#C0392B",
                  padding: "4px 10px", borderRadius: "7px",
                  fontSize: "11px", cursor: "pointer", fontFamily: FF,
                }}>
                재시도
              </button>
            </div>
          )}
          {text && !loading && (
            <div style={{ lineHeight: 1.7 }}>{renderBody(text)}</div>
          )}
        </div>

        <div style={{
          padding: "10px 22px 14px", borderTop: `1px solid ${th.border}`,
          color: th.textM, fontSize: "10.5px", fontFamily: FF, flexShrink: 0,
        }}>
          AI가 생성한 초안입니다 — 본인 경험에 맞게 수정하여 사용하세요
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  JOB CARD                                                  */
/* ═══════════════════════════════════════════════════════════ */
function JobCard({ job, index, mode, th, profile, onCoverLetter }) {
  const sites    = mode === "visual" ? SITES_VISUAL : SITES_GENERAL;
  const site     = sites.find(s => job.site?.includes(s.name) || job.site?.toLowerCase().includes(s.id));
  const accent   = site?.color || th.accent;
  const cardRef  = useRef(null);

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const matchScore = computeMatchScore(job, profile);
  const scoreColor = matchScore >= 75 ? "#059669" : matchScore >= 50 ? "#D97706" : "#DC2626";

  /* spotlight */
  const handleMouseMove = e => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    cardRef.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    cardRef.current.style.setProperty("--spotlight", "1");
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--spotlight", "0");
  };

  const handleAnalyze = async e => {
    e.stopPropagation();
    if (analysisText) { setShowAnalysis(p => !p); return; }
    setShowAnalysis(true);
    setAnalysisLoading(true);
    setAnalysisError("");
    const prompt = `다음 채용공고를 간략하게 분석해주세요.

직무: ${job.title}
회사: ${job.company}
위치: ${job.location || "미기재"}
급여: ${job.salary || "미기재"}
경력: ${job.experience || "미기재"}${job.tools ? `\n필요 툴: ${job.tools}` : ""}${job.role ? `\n세부 직무: ${job.role}` : ""}

각 항목 2~3개 bullet로 간결하게:

**핵심 요구사항**
• ...

**이런 분에게 유리해요**
• ...

**지원 전 체크포인트**
• ...`;
    try {
      setAnalysisText(await callAI(prompt));
    } catch (err) {
      setAnalysisError("분석 오류: " + err.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const renderAnalysis = raw => raw.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <div key={i} style={{
          fontWeight: 700, fontSize: "10px", color: accent,
          margin: i === 0 ? "0 0 6px" : "14px 0 6px", fontFamily: FF,
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          {line.replace(/\*\*/g, "")}
        </div>
      );
    }
    if (line.startsWith("•")) {
      return (
        <div key={i} style={{ color: th.textP, fontSize: "12px", lineHeight: 1.65, fontFamily: FF, marginBottom: "2px" }}>
          {line}
        </div>
      );
    }
    if (!line.trim()) return null;
    return <div key={i} style={{ color: th.textS, fontSize: "12px", lineHeight: 1.6, fontFamily: FF }}>{line}</div>;
  });

  return (
    <div
      ref={cardRef}
      className="hj-card"
      style={{
        background: th.surface,
        borderRadius: "16px",
        border: `1px solid ${th.border}`,
        overflow: "hidden",
        position: "relative",
        cursor: job.url ? "pointer" : "default",
        animation: `hj-cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.045}s both`,
        "--spotlight": "0",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => job.url && window.open(job.url, "_blank")}
    >
      {/* Spotlight layer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,0.028), transparent 100%)",
        opacity: "var(--spotlight, 0)",
        transition: "opacity 0.35s",
        borderRadius: "16px",
      }} />

      <div style={{ padding: "20px 22px", position: "relative", zIndex: 1 }}>
        {/* Card header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: FF_DISP, fontSize: "14.5px", fontWeight: 800,
              color: th.textP, margin: "0 0 5px", lineHeight: 1.35,
              letterSpacing: "-0.02em",
            }}>
              {job.title}
            </h3>
            <div style={{
              display: "flex", alignItems: "center", gap: "5px",
              fontSize: "12px", color: accent, fontWeight: 600, fontFamily: FF,
            }}>
              <Buildings size={11} weight="bold" />
              {job.company}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
            {matchScore !== null && (
              <span style={{
                background: `${scoreColor}12`, color: scoreColor,
                border: `1px solid ${scoreColor}22`,
                padding: "2px 8px", borderRadius: "99px",
                fontSize: "10px", fontWeight: 800, fontFamily: FF,
                display: "flex", alignItems: "center", gap: "3px",
                fontVariantNumeric: "tabular-nums",
              }}>
                <Robot size={9} weight="bold" />
                {matchScore}%
              </span>
            )}
            {site && (
              <span style={{
                background: `${accent}12`, color: accent,
                border: `1px solid ${accent}22`,
                padding: "2px 9px", borderRadius: "99px",
                fontSize: "10px", fontWeight: 700, fontFamily: FF,
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
          {job.salary    && <InfoTag Icon={CurrencyDollar} text={job.salary}    color="#059669" th={th} />}
          {job.location  && <InfoTag Icon={MapPin}         text={job.location}  th={th} />}
          {job.type      && <InfoTag Icon={FileText}       text={job.type}      th={th} />}
          {job.experience&& <InfoTag Icon={Star}           text={job.experience}color="#D97706" th={th} />}
          {job.education && <InfoTag Icon={GraduationCap}  text={job.education} th={th} />}
          {job.role      && <InfoTag Icon={Palette}        text={job.role}      color="#C026D3" th={th} />}
          {job.tools     && <InfoTag Icon={Monitor}        text={job.tools}     color="#2563EB" th={th} />}
          {job.industry  && <InfoTag Icon={Factory}        text={job.industry}  th={th} />}
          {job.deadline  && <InfoTag Icon={CalendarBlank}  text={job.deadline}  color="#DC2626" th={th} />}
        </div>

        {/* URL */}
        {job.url && (
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
            <PhLink size={10} color={th.textM} />
            <span style={{
              fontSize: "10px", color: th.textM, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px", fontFamily: FF,
            }}>
              {job.url.replace(/https?:\/\//, "").split("/")[0]}
            </span>
          </div>
        )}

        {/* AI action bar */}
        <div
          style={{
            marginTop: "14px", paddingTop: "12px",
            borderTop: `1px solid ${th.border}`,
            display: "flex", gap: "6px", alignItems: "center",
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleAnalyze}
            className="hj-btn"
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "5px 11px", borderRadius: "8px",
              border: `1px solid ${showAnalysis ? accent + "38" : th.border}`,
              background: showAnalysis ? `${accent}10` : "transparent",
              color: showAnalysis ? accent : th.textM,
              fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: FF,
              transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <Robot size={11} weight="bold" />
            {analysisLoading ? "분석중" : analysisText ? (showAnalysis ? "접기" : "AI 분석") : "AI 분석"}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onCoverLetter(job); }}
            className="hj-btn"
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "5px 11px", borderRadius: "8px",
              border: `1px solid ${th.border}`,
              background: "transparent",
              color: th.textM,
              fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: FF,
              transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${th.accent}38`;
              e.currentTarget.style.color = th.accent;
              e.currentTarget.style.background = `${th.accent}0E`;
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

        {/* Analysis panel */}
        {showAnalysis && (
          <div
            style={{
              marginTop: "12px", padding: "14px 16px",
              background: th.surfaceAlt, borderRadius: "10px",
              border: `1px solid ${accent}18`,
              animation: "hj-slideUp 0.28s cubic-bezier(0.16,1,0.3,1)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {analysisLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: th.textM, fontSize: "12px", fontFamily: FF }}>
                <div style={{
                  width: "13px", height: "13px", borderRadius: "50%",
                  border: `2px solid ${th.border}`, borderTopColor: accent,
                  animation: "hj-spin 0.7s linear infinite", flexShrink: 0,
                }} />
                분석 중입니다...
              </div>
            )}
            {analysisError && <div style={{ color: "#C0392B", fontSize: "12px", fontFamily: FF }}>{analysisError}</div>}
            {analysisText && !analysisLoading && renderAnalysis(analysisText)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  SKELETON CARD                                             */
/* ═══════════════════════════════════════════════════════════ */
function SkeletonCard({ th }) {
  const sk = {
    background: `linear-gradient(90deg, ${th.border} 25%, ${th.surfaceAlt} 50%, ${th.border} 75%)`,
    backgroundSize: "200% 100%", animation: "hj-shimmer 1.6s infinite linear", borderRadius: "6px",
  };
  return (
    <div style={{ background: th.surface, borderRadius: "16px", border: `1px solid ${th.border}`, padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...sk, height: "14px", width: "64%", marginBottom: "9px" }} />
          <div style={{ ...sk, height: "11px", width: "36%" }} />
        </div>
        <div style={{ ...sk, height: "22px", width: "54px", borderRadius: "99px", flexShrink: 0 }} />
      </div>
      <div style={{ height: "1px", background: th.border, marginBottom: "12px" }} />
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {[68, 52, 76, 60, 50].map((w, i) => (
          <div key={i} style={{ ...sk, height: "23px", width: `${w}px`, borderRadius: "6px" }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  FILTER COMPONENTS                                         */
/* ═══════════════════════════════════════════════════════════ */
function SiteFilter({ sites, selected, onToggle, th }) {
  const all = selected.length === sites.length;
  const btn = (active, color) => ({
    padding: "4px 11px", borderRadius: "99px", fontSize: "10.5px",
    border: `1px solid ${active ? (color || th.accent) + "44" : th.border}`,
    background: active ? (color || th.accent) + "12" : "transparent",
    color: active ? (color || th.accent) : th.textM,
    fontWeight: active ? 700 : 500, cursor: "pointer",
    transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)", fontFamily: FF,
  });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
      <button onClick={() => onToggle(all ? "__none__" : "__all__")} style={btn(all, null)}>전체</button>
      {sites.map(s => {
        const active = selected.includes(s.id);
        return (
          <button key={s.id} onClick={() => onToggle(s.id)} style={btn(active, s.color)}>
            <span style={{
              display: "inline-block", width: "5px", height: "5px", borderRadius: "50%",
              background: active ? s.color : th.border,
              marginRight: "5px", verticalAlign: "middle",
              transition: "background 0.2s",
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
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
      {VISUAL_CATEGORIES.map(c => {
        const active = selected === c.id;
        const CatIcon = CATEGORY_ICONS[c.id];
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "6px 13px", borderRadius: "99px",
              border: `1px solid ${active ? c.color + "44" : th.border}`,
              background: active ? c.color + "12" : "transparent",
              color: active ? c.color : th.textM,
              fontSize: "12px", fontWeight: active ? 700 : 500,
              cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)", fontFamily: FF,
            }}
          >
            {CatIcon && <CatIcon size={12} weight={active ? "bold" : "regular"} />}
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
      display: "flex", flexWrap: "wrap", gap: "6px",
      alignItems: "center", marginBottom: "20px",
      animation: "hj-slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <span style={{ fontSize: "10px", color: th.textM, fontWeight: 700, fontFamily: FF, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        필터
      </span>
      {filters.map((f, i) => {
        const Icon = FILTER_ICON_MAP[f.iconKey];
        return (
          <Pill key={i} Icon={Icon} label={f.label} color={th.accent} th={th}
            onRemove={() => onClear(f.iconKey)} />
        );
      })}
      <button
        onClick={onClearAll}
        style={{
          background: "transparent", border: "none",
          color: "#DC2626", fontSize: "11px",
          cursor: "pointer", fontWeight: 700, padding: "3px 6px", fontFamily: FF,
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
  /* mode */
  const [mode, setMode] = useState("visual");

  /* filters */
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

  /* results */
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  /* AI / profile */
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hj_profile") || "{}"); } catch { return {}; }
  });
  const [showProfile, setShowProfile] = useState(false);
  const [nlMode, setNlMode] = useState(false);
  const [nlParsedMsg, setNlParsedMsg] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [coverJob, setCoverJob] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setRoleV("전체 직무"); }, [visualCat]);

  const isV        = mode === "visual";
  const th         = getTheme(mode);
  const sites      = isV ? SITES_VISUAL : SITES_GENERAL;
  const selectedSites = isV ? sitesV : sitesG;
  const salaryMin  = SALARY_MARKS[salaryIdx] || 0;
  const salaryLabel = salaryMin === 0 ? "전체"
    : salaryMin >= 10000 ? "1억원 이상"
    : `${salaryMin.toLocaleString()}만원 이상`;
  const hasProfile = !!(profile?.name || profile?.skills || profile?.intro);

  const saveProfile = p => { setProfile(p); localStorage.setItem("hj_profile", JSON.stringify(p)); };

  const toggleSite = id => {
    const setter = isV ? setSitesV : setSitesG;
    const all    = isV ? SITES_VISUAL : SITES_GENERAL;
    if (id === "__all__")  setter(all.map(s => s.id));
    else if (id === "__none__") setter([]);
    else setter(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const clearFilter = key => ({
    region:    () => setRegion("전체"),
    jobType:   () => setJobType("전체"),
    salary:    () => setSalaryIdx(0),
    experience:() => setExperience("전체"),
    education: () => setEducation("전체"),
    industryG: () => setIndustryG("전체"),
    visualCat: () => setVisualCat("all"),
    roleV:     () => setRoleV("전체 직무"),
    toolV:     () => setToolV("전체"),
  })[key]?.();

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
    if (salaryMin > 0)     f.push({ iconKey: "salary", label: salaryLabel });
    if (experience !== "전체") f.push({ iconKey: "experience", label: experience });
    if (education !== "전체")  f.push({ iconKey: "education",  label: education });
    if (!isV && industryG !== "전체") f.push({ iconKey: "industryG", label: industryG });
    if (isV && visualCat !== "all") {
      const c = VISUAL_CATEGORIES.find(x => x.id === visualCat);
      f.push({ iconKey: "visualCat", label: c?.label || visualCat });
    }
    if (isV && roleV !== "전체 직무") f.push({ iconKey: "roleV", label: roleV });
    if (isV && toolV !== "전체")      f.push({ iconKey: "toolV", label: toolV });
    return f;
  }, [region, jobType, salaryMin, salaryLabel, experience, education, isV, industryG, visualCat, roleV, toolV]);

  const displayJobs = useMemo(() => {
    let list = [...jobs];
    if (resultFilter.trim()) {
      const q = resultFilter.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) ||
        (j.role || "").toLowerCase().includes(q) ||
        (j.tools || "").toLowerCase().includes(q) ||
        (j.industry || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "salary_desc") list.sort((a, b) => {
      const parse = s => { const m = (s||"").match(/(\d[\d,]*)/); return m ? parseInt(m[1].replace(/,/g,"")) : 0; };
      return parse(b.salary) - parse(a.salary);
    });
    else if (sortBy === "deadline") list.sort((a, b) => (a.deadline || "z").localeCompare(b.deadline || "z"));
    return list;
  }, [jobs, resultFilter, sortBy]);

  const searchJobs = async (overrides = {}) => {
    const kw = overrides.keyword ?? keyword;
    if (!kw.trim()) return;

    const effectiveRegion     = overrides.region     ?? region;
    const effectiveJobType    = overrides.jobType    ?? jobType;
    const effectiveExperience = overrides.experience ?? experience;
    const effectiveEducation  = overrides.education  ?? education;
    const effectiveVisualCat  = overrides.visualCat  ?? visualCat;
    const effectiveToolV      = overrides.toolV      ?? toolV;
    const effectiveRoleV      = overrides.roleV      ?? roleV;
    const effectiveIndustryG  = overrides.industryG  ?? industryG;
    const effectiveSortBy     = overrides.sortBy     ?? sortBy;

    setLoading(true); setError(""); setJobs([]); setSearched(true); setResultFilter("");

    const siteNames = selectedSites.map(id => sites.find(s => s.id === id)?.name).filter(Boolean).join(", ");
    const effectiveSalMin = SALARY_MARKS[salaryIdx] || 0;
    const salaryQ = effectiveSalMin > 0
      ? (effectiveSalMin >= 10000 ? "연봉 1억원 이상" : `연봉 ${effectiveSalMin.toLocaleString()}만원 이상`)
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
      salaryQ, expQ && `경력: ${expQ}`, eduQ && `학력: ${eduQ}`,
      industryContext, roleQ && `직무: ${roleQ}`, toolQ && `사용 툴: ${toolQ}`,
    ].filter(Boolean).join("\n");

    const sortMap = { recent:"최신 공고 우선", salary_desc:"연봉 높은 순서", deadline:"마감일 임박 순서", relevance:"관련도 순서" };

    const allExtraSrcs = (isV ? EXTRA_SOURCES.visual : EXTRA_SOURCES.general)
      .filter(s => s.url)
      .map(s => `${s.label}(${s.url})`)
      .join(", ");

    const modeDesc = isV
      ? `한국의 애니메이션, 영화, 방송, 게임, 모션그래픽, 웹툰, 영상제작 업계에서 "${kw}" 관련 채용 공고와 프리랜서 의뢰를 검색해주세요.
주요 채용 사이트: ${siteNames}
추가 소스: ${allExtraSrcs}
채용사이트 외에도 네이버 블로그·카페·커뮤니티·SNS·프리랜서 플랫폼 등에 올라온 구인·의뢰·일거리 게시글도 모두 포함해서 검색해주세요.`
      : `"${kw}" 관련 채용 공고와 구인 정보를 검색해주세요.
주요 채용 사이트: ${siteNames}
추가 소스: ${allExtraSrcs}
채용사이트 외에도 네이버 블로그·카페·커뮤니티·SNS·프리랜서 플랫폼 등에 올라온 구인·의뢰·일거리 게시글도 모두 포함해서 검색해주세요.`;
    const extraFields = isV
      ? `"role": "세부 직무",\n    "tools": "필요 툴/소프트웨어",`
      : `"industry": "업종/직종",`;

    const prompt = `${modeDesc}
${conditions}
정렬: ${sortMap[effectiveSortBy]}

JSON 배열만 출력하세요. 최대 15개.
[{"title":"","company":"","site":"","location":"","salary":"","type":"","experience":"","education":"",${extraFields}"url":"","deadline":""}]`;

    try {
      const text = await callClaudeAPI(prompt, true);
      const parsed = parseJobs(text);
      if (parsed.length > 0) setJobs(parsed);
      else setError("검색 결과를 파싱할 수 없습니다. 다른 키워드로 시도해보세요.");
    } catch (err) {
      setError(`검색 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseNLQuery = async nlText => {
    const prompt = `다음 취업 검색 문장을 JSON으로 변환하세요.
입력: "${nlText}"
가능한 값 — region: 전체|서울|경기|인천|부산|대구|대전|광주|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주|해외/리모트 / experience: 전체|신입|1~3년|3~5년|5~10년|10년 이상|경력무관 / jobType: 전체|정규직|계약직|인턴|아르바이트|프리랜서|파견직 / toolV: 전체|Maya|Blender|3ds Max|Cinema 4D|Houdini|ZBrush|After Effects|Premiere Pro|DaVinci Resolve|Nuke|Photoshop|Clip Studio|Toon Boom|Unreal Engine|Unity|Substance|Final Cut Pro / visualCat: all|animation|film|broadcast|game|motiongfx|webtoon|video
JSON만 응답: {"keyword":"...","region":"..."}`;
    const text = await callAI(prompt);
    try {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    } catch {}
    return { keyword: nlText };
  };

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
        if (parts.length) setNlParsedMsg("AI 해석 → " + parts.join(" · "));
        await searchJobs(parsed);
      } catch {
        await searchJobs();
      } finally {
        setNlLoading(false);
      }
    } else {
      await searchJobs();
    }
  };

  const filterCount = activeFilters.length + (selectedSites.length < sites.length ? 1 : 0);
  const roles       = VISUAL_ROLES[visualCat] || VISUAL_ROLES.all;
  const quickTags   = isV ? QUICK_KEYWORDS.visual : QUICK_KEYWORDS.general;

  /* ─── injected CSS ─── */
  const css = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');

    @keyframes hj-slideUp {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes hj-cardIn {
      from { opacity:0; transform:translateY(18px) scale(0.985); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes hj-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes hj-spin {
      from { transform:rotate(0deg); }
      to   { transform:rotate(360deg); }
    }
    @keyframes hj-pulse {
      0%,100% { opacity:1; }
      50%     { opacity:0.45; }
    }

    * { box-sizing:border-box; }
    input, select, button, textarea { font-family:${FF}; }

    /* scrollbar */
    ::-webkit-scrollbar       { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:${th.border}; border-radius:2px; }

    select option { background:${th.inputBg}; color:${th.textP}; }

    /* range */
    input[type=range] {
      -webkit-appearance:none; appearance:none; width:100%; height:4px;
      background:linear-gradient(to right,
        ${th.accent} 0%,
        ${th.accent} ${(salaryIdx/(SALARY_MARKS.length-1))*100}%,
        ${th.border} ${(salaryIdx/(SALARY_MARKS.length-1))*100}%,
        ${th.border} 100%);
      border-radius:2px; outline:none; cursor:pointer;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance:none; width:16px; height:16px;
      background:${th.accent}; border-radius:50%;
      border:2.5px solid ${th.bg}; cursor:pointer;
    }

    /* card spotlight */
    .hj-card {
      will-change: transform;
      transition:
        transform  0.3s cubic-bezier(0.16,1,0.3,1),
        box-shadow 0.3s cubic-bezier(0.16,1,0.3,1),
        border-color 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .hj-card:hover {
      transform: translateY(-2px);
      border-color: ${th.borderHi} !important;
      box-shadow: 0 8px 28px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.04);
    }

    /* modal entrance */
    .hj-modal {
      animation: hj-slideUp 0.32s cubic-bezier(0.16,1,0.3,1);
    }

    /* generic btn tactile */
    .hj-btn:active { transform:scale(0.97) translateY(1px) !important; }
    .hj-icon-btn:hover { color:${th.textP} !important; background:${th.surfaceAlt} !important; }
  `;

  return (
    <div style={{ minHeight: "100dvh", background: th.bg, color: th.textP, fontFamily: FF }}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${th.border}` }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "0 28px" }}>

          {/* Top nav bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 0", flexWrap: "wrap", gap: "10px",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "7px", flexShrink: 0,
                background: `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 2px 8px ${th.accent}30`,
              }}>
                {isV
                  ? <FilmSlate size={13} color="#fff" weight="bold" />
                  : <Briefcase size={13} color="#fff" weight="bold" />}
              </div>
              <span style={{
                fontFamily: FF_DISP, fontWeight: 900, fontSize: "16px",
                letterSpacing: "-0.04em", color: th.textP,
              }}>
                HelloJobs
              </span>
            </div>

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Mode tabs */}
              <div style={{
                display: "flex", background: th.surfaceAlt,
                borderRadius: "11px", padding: "3px",
                border: `1px solid ${th.border}`,
              }}>
                {[
                  { id: "general", label: "일반 채용", Icon: Briefcase },
                  { id: "visual",  label: "영상 전문", Icon: FilmSlate },
                ].map(t => {
                  const active = mode === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setMode(t.id); setJobs([]); setSearched(false); setError(""); setNlParsedMsg(""); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        padding: "7px 13px", borderRadius: "8px", border: "none",
                        background: active ? th.surface : "transparent",
                        color: active ? th.textP : th.textM,
                        fontSize: "12.5px", fontWeight: active ? 700 : 500,
                        cursor: "pointer", fontFamily: FF,
                        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                        boxShadow: active ? `0 1px 4px rgba(0,0,0,0.08)` : "none",
                      }}
                    >
                      <t.Icon size={13} weight={active ? "bold" : "regular"} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Profile button */}
              <button
                onClick={() => setShowProfile(true)}
                className="hj-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "7px 13px", borderRadius: "10px",
                  border: `1px solid ${hasProfile ? th.accent + "38" : th.border}`,
                  background: hasProfile ? `${th.accent}0E` : th.surfaceAlt,
                  color: hasProfile ? th.accent : th.textM,
                  fontSize: "12.5px", fontWeight: 600, cursor: "pointer",
                  fontFamily: FF, whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <User size={13} weight={hasProfile ? "bold" : "regular"} />
                {hasProfile ? (profile.name || "내 프로필") : "프로필 설정"}
              </button>
            </div>
          </div>

          {/* Hero title — asymmetric left-aligned (DESIGN_VARIANCE: 8) */}
          <div style={{ paddingBottom: "32px" }}>
            <div style={{ marginBottom: "14px" }}>
              <h1 style={{
                fontFamily: FF_DISP,
                fontSize: "clamp(38px, 5.5vw, 62px)",
                fontWeight: 900, margin: "0 0 10px",
                lineHeight: 0.96, letterSpacing: "-0.05em",
                color: th.textP,
              }}>
                {isV
                  ? <><span>영상·미디어</span><br /><span style={{ color: th.textS }}>채용 통합검색</span></>
                  : <><span>취업공고</span><br /><span style={{ color: th.textS }}>통합검색.</span></>
                }
              </h1>
              <p style={{
                color: th.textM, fontSize: "12px", margin: 0,
                display: "flex", alignItems: "center", gap: "5px", fontFamily: FF,
              }}>
                <Globe size={11} />
                {isV
                  ? "애니메이션 · 영화 · 방송 · 게임 · 모션그래픽 · 웹툰 · 영상제작"
                  : "사람인 · 잡코리아 · 알바몬 · 인크루트 · 원티드 · 캐치 · 링커리어 · 잡플래닛"
                }
              </p>
            </div>

            {/* Search bar */}
            <div style={{
              display: "flex", gap: "6px",
              background: th.inputBg, borderRadius: "14px",
              padding: "4px", border: `1px solid ${nlMode ? th.accent + "44" : th.borderHi}`,
              boxShadow: nlMode ? `0 0 0 3px ${th.accent}10` : "none",
              transition: "border-color 0.25s, box-shadow 0.25s",
            }}>
              {/* NL toggle */}
              <button
                onClick={() => { setNlMode(p => !p); setNlParsedMsg(""); }}
                title={nlMode ? "자연어 검색 끄기" : "문장으로 검색하기"}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  padding: "9px 11px", borderRadius: "10px", border: "none",
                  background: nlMode ? `${th.accent}18` : "transparent",
                  color: nlMode ? th.accent : th.textM,
                  cursor: "pointer", flexShrink: 0,
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <Lightning size={14} weight={nlMode ? "fill" : "regular"} />
                {nlMode && (
                  <span style={{ fontSize: "9.5px", fontWeight: 800, fontFamily: FF, letterSpacing: "0.04em" }}>AI</span>
                )}
              </button>

              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                <MagnifyingGlass size={15} color={th.textM} weight="bold" />
                <input
                  ref={inputRef}
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                  placeholder={
                    nlMode
                      ? "예: 서울 Maya 3년 경력 게임 회사..."
                      : isV ? "직무, 스튜디오, 툴, 키워드..." : "직무, 회사명, 키워드..."
                  }
                  style={{
                    flex: 1, background: "transparent", border: "none",
                    outline: "none", color: th.textP, fontSize: "14.5px",
                    fontWeight: 500, padding: "11px 0", fontFamily: FF,
                  }}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={(loading || nlLoading) || !keyword.trim()}
                className="hj-btn"
                style={{
                  padding: "10px 24px", borderRadius: "10px", border: "none",
                  background: !keyword.trim() ? th.border : `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
                  color: !keyword.trim() ? th.textM : "#fff",
                  fontSize: "13.5px", fontWeight: 700,
                  cursor: (loading || nlLoading) ? "wait" : !keyword.trim() ? "default" : "pointer",
                  whiteSpace: "nowrap", fontFamily: FF,
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: keyword.trim() ? `0 4px 14px ${th.accent}28` : "none",
                }}
              >
                {nlLoading ? "해석중" : loading ? "검색중" : "검색"}
              </button>
            </div>

            {/* NL hint / parsed message */}
            {nlMode && !nlParsedMsg && (
              <div style={{
                marginTop: "9px", fontSize: "11px", color: th.textM,
                fontFamily: FF, display: "flex", alignItems: "center", gap: "5px",
              }}>
                <Lightning size={10} color={th.accent} weight="bold" />
                자연어로 입력하면 AI가 지역·경력·툴 등을 자동 파악합니다
              </div>
            )}
            {nlParsedMsg && (
              <div style={{
                marginTop: "9px", display: "flex", alignItems: "center", gap: "6px",
                fontSize: "11px", color: th.accent, fontFamily: FF, fontWeight: 600,
                animation: "hj-slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <Robot size={11} weight="bold" />
                {nlParsedMsg}
              </div>
            )}

            {/* Quick keyword chips */}
            {!searched && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
                {quickTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setKeyword(tag)}
                    style={{
                      padding: "5px 12px", borderRadius: "99px",
                      border: `1px solid ${th.border}`,
                      background: "transparent",
                      color: th.textM, fontSize: "11.5px", cursor: "pointer",
                      fontWeight: 500, fontFamily: FF,
                      transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${th.accent}44`;
                      e.currentTarget.style.color = th.accent;
                      e.currentTarget.style.background = `${th.accent}0E`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = th.border;
                      e.currentTarget.style.color = th.textM;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Filter toggle */}
            <div style={{ marginTop: "14px" }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: filterCount > 0 ? `${th.accent}0E` : "transparent",
                  border: filterCount > 0 ? `1px solid ${th.accent}28` : `1px solid ${th.border}`,
                  color: filterCount > 0 ? th.accent : th.textM,
                  fontSize: "12px", cursor: "pointer",
                  padding: "6px 13px", borderRadius: "99px",
                  fontFamily: FF, fontWeight: 600,
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <SlidersHorizontal size={12} weight="bold" />
                상세 필터 {showFilters ? "접기" : "펼치기"}
                {filterCount > 0 && (
                  <span style={{
                    background: th.accent, color: "#fff",
                    borderRadius: "50%", width: "16px", height: "16px",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: 900,
                  }}>
                    {filterCount}
                  </span>
                )}
                <CaretDown
                  size={10}
                  weight="bold"
                  style={{ transform: showFilters ? "rotate(180deg)" : "", transition: "transform 0.3s", display: "block" }}
                />
              </button>

              {/* Filter panel */}
              {showFilters && (
                <div style={{
                  marginTop: "10px", background: th.surfaceAlt,
                  borderRadius: "14px", padding: "20px 22px",
                  border: `1px solid ${th.border}`,
                  animation: "hj-slideUp 0.28s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: th.textM, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 9px", display: "flex", alignItems: "center", gap: "4px", fontFamily: FF }}>
                      <Globe size={10} weight="bold" /> 검색 사이트
                    </p>
                    <SiteFilter sites={sites} selected={selectedSites} onToggle={toggleSite} th={th} />
                  </div>

                  {/* Always-on extra sources */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{
                      fontSize: "10px", fontWeight: 700, color: th.textM,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      margin: "0 0 9px", display: "flex", alignItems: "center", gap: "4px", fontFamily: FF,
                    }}>
                      <PhLink size={10} weight="bold" /> 추가 소스
                      <span style={{ fontSize: "9px", fontWeight: 500, opacity: 0.55, textTransform: "none", letterSpacing: 0, marginLeft: "2px" }}>항상 포함</span>
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {(isV ? EXTRA_SOURCES.visual : EXTRA_SOURCES.general).map(src => (
                        <span
                          key={src.id}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "5px",
                            padding: "4px 11px", borderRadius: "99px", fontSize: "10.5px",
                            border: `1px solid ${src.color}44`,
                            background: `${src.color}10`,
                            color: src.color,
                            fontWeight: 600, fontFamily: FF,
                          }}
                        >
                          <span style={{
                            display: "inline-block", width: "5px", height: "5px", borderRadius: "50%",
                            background: src.color, flexShrink: 0,
                          }} />
                          {src.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ height: "1px", background: th.border, margin: "4px 0 16px" }} />

                  {isV && (
                    <>
                      <div style={{ marginBottom: "14px" }}>
                        <p style={{ fontSize: "10px", fontWeight: 700, color: th.textM, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 9px", display: "flex", alignItems: "center", gap: "4px", fontFamily: FF }}>
                          <FilmSlate size={10} weight="bold" /> 영상 분야
                        </p>
                        <CategoryTabs selected={visualCat} onChange={setVisualCat} th={th} />
                      </div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                        <SelectField label="세부 직무" Icon={Palette} value={roleV} onChange={setRoleV} options={roles} th={th} />
                        <SelectField label="사용 툴"  Icon={Monitor} value={toolV} onChange={setToolV} options={TOOLS_SOFTWARE} th={th} />
                      </div>
                      <div style={{ height: "1px", background: th.border, margin: "4px 0 16px" }} />
                    </>
                  )}

                  {/* Salary */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: th.textM, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "4px", fontFamily: FF }}>
                      <CurrencyDollar size={10} weight="bold" /> 최소 연봉
                    </p>
                    <input type="range" min={0} max={SALARY_MARKS.length - 1}
                      value={salaryIdx} onChange={e => setSalaryIdx(parseInt(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
                      <span style={{ fontSize: "10.5px", color: th.textM, fontFamily: FF }}>전체</span>
                      <span style={{
                        fontSize: "12.5px", fontWeight: 700, fontFamily: FF, fontVariantNumeric: "tabular-nums",
                        color: salaryMin > 0 ? th.accent : th.textM,
                        background: salaryMin > 0 ? `${th.accent}12` : "transparent",
                        padding: "2px 10px", borderRadius: "99px",
                      }}>
                        {salaryLabel}
                      </span>
                      <span style={{ fontSize: "10.5px", color: th.textM, fontFamily: FF }}>1억+</span>
                    </div>
                  </div>

                  <div style={{ height: "1px", background: th.border, margin: "4px 0 16px" }} />

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <SelectField label="지역"    Icon={MapPin}      value={region}     onChange={setRegion}     options={REGIONS.map(r => ({ label: r }))} th={th} />
                    <SelectField label="고용형태" Icon={FileText}    value={jobType}    onChange={setJobType}    options={JOB_TYPES.map(t => ({ label: t }))} th={th} />
                    <SelectField label="경력"    Icon={Star}        value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} th={th} />
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <SelectField label="학력"    Icon={GraduationCap} value={education} onChange={setEducation} options={EDUCATION_LEVELS} th={th} />
                    {!isV && <SelectField label="업종" Icon={Factory} value={industryG} onChange={setIndustryG} options={INDUSTRIES_GENERAL} th={th} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: "980px", margin: "0 auto", padding: "28px 28px 48px" }}>
        <ActiveFilters filters={activeFilters} onClear={clearFilter} onClearAll={clearAll} th={th} />

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "12px" }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} th={th} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "#FFF5F5", border: "1px solid #FECDCA",
            borderRadius: "12px", padding: "16px 20px",
            color: "#C0392B", fontSize: "13.5px", fontFamily: FF,
          }}>
            <WarningCircle size={18} color="#E53E3E" weight="bold" />
            {error}
          </div>
        )}

        {/* Results */}
        {jobs.length > 0 && !loading && (
          <>
            {/* Sort pills + result filter */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: "8px", marginBottom: "14px",
            }}>
              {/* Sort tabs */}
              <div style={{
                display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center",
              }}>
                <span style={{ fontSize: "10px", color: th.textM, fontWeight: 700, fontFamily: FF, marginRight: "2px" }}>정렬</span>
                {SORT_OPTIONS.map(opt => {
                  const active = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); searchJobs({ sortBy: opt.value }); }}
                      className="hj-btn"
                      style={{
                        padding: "5px 12px", borderRadius: "99px", fontSize: "11.5px",
                        border: `1px solid ${active ? th.accent + "44" : th.border}`,
                        background: active ? `${th.accent}12` : th.surface,
                        color: active ? th.accent : th.textM,
                        fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: FF,
                        transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
                        boxShadow: active ? "none" : `0 1px 3px rgba(0,0,0,0.04)`,
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                {hasProfile && (
                  <span style={{
                    fontSize: "10.5px", color: th.textM, fontFamily: FF,
                    display: "flex", alignItems: "center", gap: "3px", marginLeft: "4px",
                  }}>
                    <Robot size={10} weight="bold" color={th.accent} />
                    매칭 점수 활성
                  </span>
                )}
              </div>

              {/* Right: count + result search */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <p style={{ color: th.textM, fontSize: "12px", fontWeight: 600, margin: 0, fontFamily: FF, whiteSpace: "nowrap" }}>
                  <span style={{ color: th.accent, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{displayJobs.length}</span>
                  <span>개</span>
                  {displayJobs.length !== jobs.length && (
                    <span style={{ color: th.textM }}> / {jobs.length}</span>
                  )}
                </p>
                <div style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  background: th.surfaceAlt, borderRadius: "9px",
                  padding: "6px 12px", border: `1px solid ${th.border}`,
                }}>
                  <MagnifyingGlass size={12} color={th.textM} />
                  <input
                    type="text"
                    value={resultFilter}
                    onChange={e => setResultFilter(e.target.value)}
                    placeholder="결과 내 검색..."
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: th.textP, fontSize: "12.5px", width: "150px", fontFamily: FF,
                  }}
                />
              </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "12px" }}>
              {displayJobs.map((job, i) => (
                <JobCard
                  key={i} job={job} index={i} mode={mode} th={th}
                  profile={profile} onCoverLetter={setCoverJob}
                />
              ))}
            </div>

            {displayJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 20px", color: th.textM, fontSize: "13.5px", fontFamily: FF }}>
                결과 내 검색에 일치하는 공고가 없습니다
              </div>
            )}
          </>
        )}

        {/* Empty state — initial */}
        {!loading && !error && jobs.length === 0 && !searched && (
          <div style={{
            padding: "56px 0 32px",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            maxWidth: "520px",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: `${th.accent}12`, border: `1px solid ${th.accent}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px",
            }}>
              {isV
                ? <FilmSlate size={20} color={th.accent} weight="bold" />
                : <MagnifyingGlass size={20} color={th.accent} weight="bold" />
              }
            </div>
            <h2 style={{
              fontFamily: FF_DISP, fontSize: "20px", fontWeight: 900,
              letterSpacing: "-0.04em", color: th.textP, margin: "0 0 8px",
            }}>
              {isV ? "영상·미디어 채용을 검색하세요" : "채용공고를 검색하세요"}
            </h2>
            <p style={{ color: th.textM, fontSize: "13px", margin: "0 0 6px", lineHeight: 1.65, fontFamily: FF }}>
              {isV
                ? "국내 주요 영상·미디어 채용 사이트를 한 번에 검색합니다."
                : "여러 취업 사이트의 공고를 한 번에 모아서 보여드립니다."
              }
            </p>
            {!hasProfile && (
              <p style={{ color: th.textM, fontSize: "12.5px", margin: "0 0 24px", fontFamily: FF }}>
                <button
                  onClick={() => setShowProfile(true)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: th.accent, fontFamily: FF, fontSize: "12.5px",
                    fontWeight: 700, padding: 0,
                  }}
                >
                  프로필을 설정
                </button>
                하면 공고 매칭 점수와 AI 자기소개서를 사용할 수 있습니다
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {quickTags.map(tag => (
                <button key={tag} onClick={() => setKeyword(tag)}
                  style={{
                    padding: "6px 13px", borderRadius: "99px",
                    border: `1px solid ${th.border}`, background: th.surfaceAlt,
                    color: th.textM, fontSize: "12px", cursor: "pointer",
                    fontWeight: 500, fontFamily: FF,
                    transition: "all 0.18s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${th.accent}44`;
                    e.currentTarget.style.color = th.accent;
                    e.currentTarget.style.background = `${th.accent}0E`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = th.border;
                    e.currentTarget.style.color = th.textM;
                    e.currentTarget.style.background = th.surfaceAlt;
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — no results */}
        {!loading && !error && jobs.length === 0 && searched && (
          <div style={{ padding: "56px 0 32px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: th.surfaceAlt, border: `1px solid ${th.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px",
            }}>
              <SmileySad size={20} color={th.textM} weight="bold" />
            </div>
            <h2 style={{
              fontFamily: FF_DISP, fontSize: "20px", fontWeight: 900,
              letterSpacing: "-0.04em", color: th.textP, margin: "0 0 8px",
            }}>
              검색 결과가 없습니다
            </h2>
            <p style={{ color: th.textM, fontSize: "13px", margin: 0, fontFamily: FF }}>
              다른 키워드나 필터로 다시 시도해보세요
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${th.border}`,
        padding: "20px 28px", maxWidth: "980px", margin: "0 auto",
        color: th.textM, fontSize: "11px", fontFamily: FF,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "8px",
      }}>
        <span>AI 웹 검색 기반 {isV ? "영상·미디어" : "취업공고"} 통합검색</span>
        <span>결과는 각 사이트 최신 공고와 다를 수 있습니다</span>
      </footer>

      {/* ── MODALS ── */}
      {showProfile && (
        <ProfileModal profile={profile} onSave={saveProfile} onClose={() => setShowProfile(false)} th={th} />
      )}
      {coverJob && (
        <CoverLetterModal job={coverJob} profile={profile} onClose={() => setCoverJob(null)} th={th} />
      )}
    </div>
  );
}
