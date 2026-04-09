import { useState, useRef, useEffect, useMemo } from "react";
import {
  MagnifyingGlass, Briefcase, FilmSlate, MapPin, CurrencyDollar,
  FileText, Star, GraduationCap, Palette, Monitor, Factory,
  CalendarBlank, Globe, Link as PhLink, ArrowsDownUp,
  SlidersHorizontal, X, GameController, VideoCamera,
  Television, SquaresFour, FilmStrip, Swatches, BookOpen,
  CaretDown, WarningCircle, SmileySad, Buildings,
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

function JobCard({ job, index, mode, th }) {
  const sites = mode === "visual" ? SITES_VISUAL : SITES_GENERAL;
  const site = sites.find(s => job.site?.includes(s.name) || job.site?.toLowerCase().includes(s.id));
  const accent = site?.color || th.accent;

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
          {site && (
            <span style={{
              background: accent + "15", color: accent,
              padding: "3px 9px", borderRadius: "20px",
              fontSize: "10.5px", fontWeight: 700,
              whiteSpace: "nowrap", flexShrink: 0,
              border: `1px solid ${accent}25`, fontFamily: FF,
            }}>
              {site.name}
            </span>
          )}
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

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setRoleV("전체 직무"); }, [visualCat]);

  const salaryMin = SALARY_MARKS[salaryIdx] || 0;
  const salaryLabel = salaryMin === 0 ? "전체" : salaryMin >= 10000 ? "1억원 이상" : `${salaryMin.toLocaleString()}만원 이상`;
  const isV = mode === "visual";
  const th = getTheme(mode);
  const sites = isV ? SITES_VISUAL : SITES_GENERAL;
  const selectedSites = isV ? sitesV : sitesG;

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

  const searchJobs = async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(""); setJobs([]); setSearched(true); setResultFilter("");

    const siteNames = selectedSites.map(id => sites.find(s => s.id === id)?.name).filter(Boolean).join(", ");
    const salaryQ = salaryMin > 0 ? (salaryMin >= 10000 ? "연봉 1억원 이상" : `연봉 ${salaryMin.toLocaleString()}만원 이상`) : "";
    const expQ = EXPERIENCE_LEVELS.find(e => e.label === experience)?.query || "";
    const eduQ = EDUCATION_LEVELS.find(e => e.label === education)?.query || "";

    let industryContext = "", roleQ = "", toolQ = "";

    if (isV) {
      const catObj = VISUAL_CATEGORIES.find(c => c.id === visualCat);
      if (visualCat !== "all") industryContext = `분야: ${catObj?.label} 업계`;
      const roles = VISUAL_ROLES[visualCat] || VISUAL_ROLES.all;
      roleQ = roles.find(r => r.label === roleV)?.query || "";
      toolQ = TOOLS_SOFTWARE.find(t => t.label === toolV)?.query || "";
    } else {
      const indQ = INDUSTRIES_GENERAL.find(i => i.label === industryG)?.query || "";
      if (indQ) industryContext = `업종: ${indQ}`;
    }

    const conditions = [
      region !== "전체" && `지역: ${region}`, jobType !== "전체" && `고용형태: ${jobType}`,
      salaryQ, expQ && `경력: ${expQ}`, eduQ && `학력: ${eduQ}`,
      industryContext, roleQ && `직무: ${roleQ}`, toolQ && `사용 툴: ${toolQ}`,
    ].filter(Boolean).join("\n");

    const sortMap = { recent: "최신 공고 우선", salary_desc: "연봉 높은 순서", deadline: "마감일 임박 순서", relevance: "관련도 순서" };

    const modeDesc = isV
      ? `한국의 애니메이션, 영화, 방송, 게임, 모션그래픽, 웹툰, 영상제작 업계에서 "${keyword}" 관련 채용 공고를 검색해주세요.\n검색 대상: ${siteNames} 및 영상/미디어 관련 채용이 있는 모든 사이트`
      : `한국 취업 사이트에서 "${keyword}" 관련 채용 공고를 검색해주세요.\n검색 대상 사이트: ${siteNames}`;

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
      setError(`검색 중 오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterCount = activeFilters.length + (selectedSites.length < sites.length ? 1 : 0);
  const roles = VISUAL_ROLES[visualCat] || VISUAL_ROLES.all;
  const quickTags = isV ? QUICK_KEYWORDS.visual : QUICK_KEYWORDS.general;

  /* ─── CSS ─── */
  const css = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
    @keyframes slideUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
    @keyframes shimmer { 0%{background-position:-200% center;}100%{background-position:200% center;} }
    * { box-sizing: border-box; }
    input, select, button { font-family: ${FF}; }
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 30px" }}>
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
                    onClick={() => { setMode(t.id); setJobs([]); setSearched(false); setError(""); }}
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
            padding: "4px", border: `1px solid ${th.border}`,
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 14px", gap: "10px" }}>
              <MagnifyingGlass size={17} color={th.textM} weight="bold" />
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") searchJobs(); }}
                placeholder={isV ? "직무, 스튜디오, 툴, 키워드..." : "직무, 회사명, 키워드 검색..."}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  outline: "none", color: th.textP, fontSize: "15px",
                  fontWeight: 500, padding: "12px 0", fontFamily: FF,
                }}
              />
            </div>
            <button
              onClick={searchJobs}
              disabled={loading || !keyword.trim()}
              style={{
                padding: "11px 26px", borderRadius: "11px", border: "none",
                background: !keyword.trim() ? th.border : `linear-gradient(135deg, ${th.accent}, ${th.accentAlt})`,
                color: !keyword.trim() ? th.textM : "#fff",
                fontSize: "14px", fontWeight: 700,
                cursor: loading ? "wait" : !keyword.trim() ? "default" : "pointer",
                transition: "all 0.2s", whiteSpace: "nowrap", fontFamily: FF,
                boxShadow: keyword.trim() ? `0 4px 14px ${th.accent}30` : "none",
              }}
            >
              {loading ? "검색중..." : "검색"}
            </button>
          </div>

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
              <p style={{ color: th.textM, fontSize: "13px", fontWeight: 600, margin: 0, fontFamily: FF }}>
                <span style={{ color: th.accent, fontWeight: 800 }}>{displayJobs.length}</span>개 공고
                {displayJobs.length !== jobs.length && (
                  <span style={{ color: th.textM }}> (전체 {jobs.length}개 중)</span>
                )}
              </p>
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
              {displayJobs.map((job, i) => <JobCard key={i} job={job} index={i} mode={mode} th={th} />)}
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
            <p style={{ color: th.textM, fontSize: "14px", margin: "0 0 28px", lineHeight: 1.6, fontFamily: FF }}>
              {isV ? "국내 주요 영상·미디어 채용 사이트를 한번에 검색합니다." : "여러 취업 사이트의 공고를 한번에 모아서 보여드립니다."}
            </p>
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
    </div>
  );
}
