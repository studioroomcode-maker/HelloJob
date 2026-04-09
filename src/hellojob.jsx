import { useState, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════ */
/*  DATA — GENERAL MODE                                       */
/* ═══════════════════════════════════════════════════════════ */
const SITES_GENERAL = [
  { id: "saramin", name: "사람인", color: "#3B82F6", icon: "💼" },
  { id: "jobkorea", name: "잡코리아", color: "#EF4444", icon: "🏢" },
  { id: "albamon", name: "알바몬", color: "#F97316", icon: "⏰" },
  { id: "incruit", name: "인크루트", color: "#22C55E", icon: "📋" },
  { id: "wanted", name: "원티드", color: "#8B5CF6", icon: "🚀" },
  { id: "catch", name: "캐치", color: "#EAB308", icon: "🎯" },
  { id: "linkareer", name: "링커리어", color: "#14B8A6", icon: "🔗" },
  { id: "jobplanet", name: "잡플래닛", color: "#EC4899", icon: "🌍" },
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
  { id: "saramin", name: "사람인", color: "#F472B6", icon: "💼" },
  { id: "jobkorea", name: "잡코리아", color: "#FB7185", icon: "🏢" },
  { id: "wanted", name: "원티드", color: "#A855F7", icon: "🚀" },
  { id: "catch", name: "캐치", color: "#FBBF24", icon: "🎯" },
  { id: "linkareer", name: "링커리어", color: "#34D399", icon: "🔗" },
  { id: "gamejob", name: "게임잡", color: "#60A5FA", icon: "🎮" },
  { id: "animationk", name: "애니메이션K", color: "#F472B6", icon: "🎬" },
  { id: "cgworld", name: "CG/VFX 채용", color: "#C084FC", icon: "✨" },
];

// ── 영상 대분류 ──
const VISUAL_CATEGORIES = [
  { id: "all", label: "전체", icon: "🌟", color: "#F472B6" },
  { id: "animation", label: "애니메이션", icon: "🎬", color: "#F472B6" },
  { id: "film", label: "영화", icon: "🎞️", color: "#F59E0B" },
  { id: "broadcast", label: "방송", icon: "📺", color: "#3B82F6" },
  { id: "game", label: "게임", icon: "🎮", color: "#22C55E" },
  { id: "motiongfx", label: "모션그래픽", icon: "💫", color: "#A855F7" },
  { id: "webtoon", label: "웹툰/만화", icon: "📖", color: "#60A5FA" },
  { id: "video", label: "영상제작", icon: "📹", color: "#14B8A6" },
];

// ── 카테고리별 세부 직무 ──
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

/* ═══ UI COMPONENTS ═══ */
const mkLabel = (c) => ({ fontSize:"11px",fontWeight:800,color:c==="visual"?"#94A3B8":"#64748B",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"6px",display:"block" });
const mkSelect = (c) => ({
  width:"100%",padding:"10px 14px",borderRadius:"12px",
  border:`1px solid ${c==="visual"?"#2A1F3D":"#1E293B"}`,
  background:c==="visual"?"#1A1128":"#1E293B",
  color:c==="visual"?"#E8D5F5":"#F1F5F9",fontSize:"13px",outline:"none",
  cursor:"pointer",appearance:"none",fontFamily:"'Pretendard','Noto Sans KR',sans-serif",
});

function StyledSelect({label,icon,value,onChange,options,valueKey,mode}){
  return(
    <div style={{flex:1,minWidth:"148px"}}>
      <label style={mkLabel(mode)}>{icon} {label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={mkSelect(mode)}>
        {options.map((o,i)=>(<option key={i} value={valueKey==="value"?o.value:o.label}>{o.label}</option>))}
      </select>
    </div>
  );
}

function Tag({icon,text,color}){
  return(<span style={{display:"inline-flex",alignItems:"center",gap:"4px",background:color?color+"18":"#1E293B",color:color||"#94A3B8",padding:"4px 10px",borderRadius:"8px",fontSize:"11.5px",fontWeight:600}}>{icon} {text}</span>);
}

function JobCard({job,index,mode}){
  const sites=mode==="visual"?SITES_VISUAL:SITES_GENERAL;
  const site=sites.find(s=>job.site?.includes(s.name)||job.site?.toLowerCase().includes(s.id));
  const accent=site?.color||(mode==="visual"?"#F472B6":"#6366F1");
  const cardBg=mode==="visual"?"linear-gradient(135deg,#1A1128,#150D20)":"#151C2C";
  const borderC=mode==="visual"?"#2A1F3D":"#1E293B";
  return(
    <div style={{background:cardBg,borderRadius:"16px",overflow:"hidden",border:`1px solid ${borderC}`,transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",animation:`slideUp 0.5s ease ${index*0.04}s both`,cursor:job.url?"pointer":"default"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 14px 44px ${accent}20`;e.currentTarget.style.borderColor=accent+"44";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor=borderC;}}
      onClick={()=>job.url&&window.open(job.url,"_blank")}>
      <div style={{borderTop:`3px solid ${accent}`}}/>
      <div style={{padding:"18px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"10px"}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{fontSize:"14.5px",fontWeight:800,color:mode==="visual"?"#F3E8FF":"#F1F5F9",margin:0,lineHeight:1.5}}>{job.title}</h3>
            <p style={{fontSize:"13px",color:accent,margin:"4px 0 0",fontWeight:700}}>{job.company}</p>
          </div>
          {site&&(<span style={{background:accent+"18",color:accent,padding:"3px 9px",borderRadius:"20px",fontSize:"10.5px",fontWeight:800,whiteSpace:"nowrap",flexShrink:0,border:`1px solid ${accent}25`}}>{site.icon} {site.name}</span>)}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginTop:"12px"}}>
          {job.salary&&<Tag icon="💰" text={job.salary} color="#22C55E"/>}
          {job.type&&<Tag icon="📄" text={job.type}/>}
          {job.location&&<Tag icon="📍" text={job.location}/>}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginTop:"5px"}}>
          {job.experience&&<Tag icon="⭐" text={job.experience} color="#F59E0B"/>}
          {job.education&&<Tag icon="🎓" text={job.education} color="#8B5CF6"/>}
          {job.role&&<Tag icon="🎨" text={job.role} color="#F472B6"/>}
          {job.tools&&<Tag icon="🖥️" text={job.tools} color="#60A5FA"/>}
          {job.industry&&<Tag icon="🏭" text={job.industry}/>}
          {job.deadline&&<Tag icon="📅" text={job.deadline} color="#EF4444"/>}
        </div>
        {job.url&&(<div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:"5px"}}><span style={{fontSize:"10px",color:"#555"}}>🔗</span><span style={{fontSize:"10.5px",color:accent,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"280px"}}>{job.url.replace(/https?:\/\//,"").split("/")[0]}</span></div>)}
      </div>
    </div>
  );
}

function SiteFilter({sites,selected,onToggle,mode}){
  const all=selected.length===sites.length;
  const ac=mode==="visual"?"#F472B6":"#6366F1";
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:"7px",alignItems:"center"}}>
      <button onClick={()=>onToggle(all?"__none__":"__all__")} style={{padding:"5px 11px",borderRadius:"20px",fontSize:"11px",border:`2px solid ${all?ac:(mode==="visual"?"#2A1F3D":"#1E293B")}`,background:all?ac+"18":"transparent",color:all?ac:(mode==="visual"?"#6B5B8D":"#64748B"),fontWeight:800,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Pretendard','Noto Sans KR',sans-serif"}}>{all?"✓ 전체":"전체"}</button>
      {sites.map(s=>{const a=selected.includes(s.id);return(
        <button key={s.id} onClick={()=>onToggle(s.id)} style={{display:"flex",alignItems:"center",gap:"4px",padding:"5px 10px",borderRadius:"20px",border:a?`2px solid ${s.color}`:`2px solid ${mode==="visual"?"#2A1F3D":"#1E293B"}`,background:a?s.color+"18":"transparent",color:a?s.color:(mode==="visual"?"#6B5B8D":"#64748B"),fontSize:"11px",fontWeight:a?800:500,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Pretendard','Noto Sans KR',sans-serif"}}>{s.icon} {s.name}</button>
      );})}
    </div>
  );
}

function CategoryTabs({selected,onChange}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
      {VISUAL_CATEGORIES.map(c=>{
        const active=selected===c.id;
        return(
          <button key={c.id} onClick={()=>onChange(c.id)} style={{
            display:"flex",alignItems:"center",gap:"5px",padding:"7px 14px",borderRadius:"24px",
            border:active?`2px solid ${c.color}`:"2px solid #2A1F3D",
            background:active?c.color+"15":"transparent",
            color:active?c.color:"#6B5B8D",fontSize:"13px",fontWeight:active?800:500,
            cursor:"pointer",transition:"all 0.25s",
            fontFamily:"'Pretendard','Noto Sans KR',sans-serif",
            boxShadow:active?`0 0 12px ${c.color}15`:"none",
          }}>{c.icon} {c.label}</button>
        );
      })}
    </div>
  );
}

function ActiveFilters({filters,onClear,onClearAll,mode}){
  if(!filters.length)return null;
  const ac=mode==="visual"?"#F472B6":"#6366F1";
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:"7px",alignItems:"center",marginBottom:"16px",animation:"slideUp 0.3s ease"}}>
      <span style={{fontSize:"11px",color:"#64748B",fontWeight:700}}>필터:</span>
      {filters.map((f,i)=>(<span key={i} style={{display:"inline-flex",alignItems:"center",gap:"5px",background:ac+"15",color:ac,padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:700,border:`1px solid ${ac}30`}}>{f.icon} {f.label}<span onClick={e=>{e.stopPropagation();onClear(f.key);}} style={{cursor:"pointer",opacity:0.6,fontSize:"13px",lineHeight:1}}>×</span></span>))}
      <button onClick={onClearAll} style={{background:"transparent",border:"none",color:"#EF4444",fontSize:"11px",cursor:"pointer",fontWeight:700,padding:"3px 6px"}}>초기화</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════ */
export default function UnifiedJobAggregator(){
  // ── mode ──
  const [mode,setMode]=useState("general"); // "general" | "visual"

  // ── shared state ──
  const [keyword,setKeyword]=useState("");
  const [region,setRegion]=useState("전체");
  const [jobType,setJobType]=useState("전체");
  const [salaryIdx,setSalaryIdx]=useState(0);
  const [experience,setExperience]=useState("전체");
  const [education,setEducation]=useState("전체");
  const [sortBy,setSortBy]=useState("relevance");
  const [showFilters,setShowFilters]=useState(false);
  const [resultFilter,setResultFilter]=useState("");

  // ── general-only ──
  const [industryG,setIndustryG]=useState("전체");
  const [sitesG,setSitesG]=useState(SITES_GENERAL.map(s=>s.id));

  // ── visual-only ──
  const [visualCat,setVisualCat]=useState("all");
  const [roleV,setRoleV]=useState("전체 직무");
  const [toolV,setToolV]=useState("전체");
  const [sitesV,setSitesV]=useState(SITES_VISUAL.map(s=>s.id));

  // ── results ──
  const [jobs,setJobs]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [searched,setSearched]=useState(false);
  const inputRef=useRef(null);

  useEffect(()=>{inputRef.current?.focus();},[]);
  useEffect(()=>{setRoleV("전체 직무");},[visualCat]);

  const salaryMin=SALARY_MARKS[salaryIdx]||0;
  const salaryLabel=salaryMin===0?"전체":salaryMin>=10000?"1억원 이상":`${salaryMin.toLocaleString()}만원 이상`;
  const isV=mode==="visual";
  const accent=isV?"#F472B6":"#6366F1";
  const sites=isV?SITES_VISUAL:SITES_GENERAL;
  const selectedSites=isV?sitesV:sitesG;
  const setSelectedSites=isV?setSitesV:setSitesG;

  const toggleSite=(id)=>{
    const setter=isV?setSitesV:setSitesG;
    const all=isV?SITES_VISUAL:SITES_GENERAL;
    if(id==="__all__")setter(all.map(s=>s.id));
    else if(id==="__none__")setter([]);
    else setter(prev=>prev.includes(id)?prev.filter(s=>s!==id):[...prev,id]);
  };

  const clearFilter=(key)=>{
    const m={region:()=>setRegion("전체"),jobType:()=>setJobType("전체"),salary:()=>setSalaryIdx(0),experience:()=>setExperience("전체"),education:()=>setEducation("전체"),industryG:()=>setIndustryG("전체"),visualCat:()=>setVisualCat("all"),roleV:()=>setRoleV("전체 직무"),toolV:()=>setToolV("전체")};
    m[key]?.();
  };
  const clearAll=()=>{setRegion("전체");setJobType("전체");setSalaryIdx(0);setExperience("전체");setEducation("전체");setIndustryG("전체");setVisualCat("all");setRoleV("전체 직무");setToolV("전체");setSitesG(SITES_GENERAL.map(s=>s.id));setSitesV(SITES_VISUAL.map(s=>s.id));};

  const activeFilters=useMemo(()=>{
    const f=[];
    if(region!=="전체")f.push({key:"region",label:region,icon:"📍"});
    if(jobType!=="전체")f.push({key:"jobType",label:jobType,icon:"📄"});
    if(salaryMin>0)f.push({key:"salary",label:salaryLabel,icon:"💰"});
    if(experience!=="전체")f.push({key:"experience",label:experience,icon:"⭐"});
    if(education!=="전체")f.push({key:"education",label:education,icon:"🎓"});
    if(!isV&&industryG!=="전체")f.push({key:"industryG",label:industryG,icon:"🏭"});
    if(isV&&visualCat!=="all"){const c=VISUAL_CATEGORIES.find(x=>x.id===visualCat);f.push({key:"visualCat",label:c?.label||visualCat,icon:c?.icon||"🎬"});}
    if(isV&&roleV!=="전체 직무")f.push({key:"roleV",label:roleV,icon:"🎨"});
    if(isV&&toolV!=="전체")f.push({key:"toolV",label:toolV,icon:"🖥️"});
    return f;
  },[region,jobType,salaryMin,salaryLabel,experience,education,isV,industryG,visualCat,roleV,toolV]);

  const displayJobs=useMemo(()=>{
    let list=[...jobs];
    if(resultFilter.trim()){const q=resultFilter.toLowerCase();list=list.filter(j=>j.title.toLowerCase().includes(q)||j.company.toLowerCase().includes(q)||(j.location||"").toLowerCase().includes(q)||(j.role||"").toLowerCase().includes(q)||(j.tools||"").toLowerCase().includes(q)||(j.industry||"").toLowerCase().includes(q));}
    if(sortBy==="salary_desc")list.sort((a,b)=>{const e=s=>{const m=(s||"").match(/(\d[\d,]*)/);return m?parseInt(m[1].replace(/,/g,"")):0;};return e(b.salary)-e(a.salary);});
    else if(sortBy==="deadline")list.sort((a,b)=>(a.deadline||"z").localeCompare(b.deadline||"z"));
    return list;
  },[jobs,resultFilter,sortBy]);

  const searchJobs=async()=>{
    if(!keyword.trim())return;
    setLoading(true);setError("");setJobs([]);setSearched(true);setResultFilter("");

    const siteNames=selectedSites.map(id=>sites.find(s=>s.id===id)?.name).filter(Boolean).join(", ");
    const salaryQ=salaryMin>0?(salaryMin>=10000?"연봉 1억원 이상":`연봉 ${salaryMin.toLocaleString()}만원 이상`):"";
    const expQ=EXPERIENCE_LEVELS.find(e=>e.label===experience)?.query||"";
    const eduQ=EDUCATION_LEVELS.find(e=>e.label===education)?.query||"";

    let industryContext="";
    let roleQ="";
    let toolQ="";

    if(isV){
      const catObj=VISUAL_CATEGORIES.find(c=>c.id===visualCat);
      if(visualCat!=="all")industryContext=`분야: ${catObj?.label} 업계`;
      const roles=VISUAL_ROLES[visualCat]||VISUAL_ROLES.all;
      roleQ=roles.find(r=>r.label===roleV)?.query||"";
      toolQ=TOOLS_SOFTWARE.find(t=>t.label===toolV)?.query||"";
    } else {
      const indQ=INDUSTRIES_GENERAL.find(i=>i.label===industryG)?.query||"";
      if(indQ)industryContext=`업종: ${indQ}`;
    }

    const conditions=[
      region!=="전체"&&`지역: ${region}`,
      jobType!=="전체"&&`고용형태: ${jobType}`,
      salaryQ,expQ&&`경력: ${expQ}`,eduQ&&`학력: ${eduQ}`,
      industryContext,
      roleQ&&`직무: ${roleQ}`,
      toolQ&&`사용 툴: ${toolQ}`,
    ].filter(Boolean).join("\n");

    const sortMap={recent:"최신 공고 우선",salary_desc:"연봉 높은 순서",deadline:"마감일 임박 순서",relevance:"관련도 순서"};

    const modeDesc=isV
      ? `한국의 애니메이션, 영화, 방송, 게임, 모션그래픽, 웹툰, 영상제작 업계에서 "${keyword}" 관련 채용 공고를 검색해주세요.\n검색 대상: ${siteNames} 및 영상/미디어 관련 채용이 있는 모든 사이트`
      : `한국 취업 사이트에서 "${keyword}" 관련 채용 공고를 검색해주세요.\n검색 대상 사이트: ${siteNames}`;

    const extraFields=isV
      ? `"role": "세부 직무 (예: 2D 애니메이터, VFX 아티스트, 영상 편집 등)",\n    "tools": "필요 툴/소프트웨어 (예: Maya, After Effects 등)",`
      : `"industry": "업종/직종",`;

    const prompt=`${modeDesc}
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

    try{
      const response=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]}),
      });
      if(!response.ok)throw new Error(`API 오류: ${response.status}`);
      const data=await response.json();
      let allText="";
      for(const block of data.content){if(block.type==="text")allText+=block.text+"\n";}
      const parsed=parseJobs(allText);
      if(parsed.length>0)setJobs(parsed);
      else setError("검색 결과를 파싱할 수 없습니다. 다른 키워드로 시도해보세요.");
    }catch(err){console.error(err);setError(`검색 중 오류: ${err.message}`);}
    finally{setLoading(false);}
  };

  const filterCount=activeFilters.length+(selectedSites.length<sites.length?1:0);
  const roles=VISUAL_ROLES[visualCat]||VISUAL_ROLES.all;
  const quickTags=isV?QUICK_KEYWORDS.visual:QUICK_KEYWORDS.general;

  /* ─── THEME VARS ─── */
  const bg=isV?"#0D0818":"#0B0F1A";
  const surface=isV?"#130A22":"#111827";
  const border=isV?"#2A1F3D":"#1E293B";
  const textP=isV?"#F3E8FF":"#F1F5F9";
  const textM=isV?"#6B5B8D":"#64748B";
  const inputBg=isV?"#1A1128":"#1E293B";

  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Pretendard','Noto Sans KR',sans-serif",color:textP,transition:"background 0.5s ease"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');
        @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
        @keyframes sparkle{0%,100%{opacity:0.2;transform:scale(1);}50%{opacity:0.8;transform:scale(1.4);}}
        @keyframes gradShift{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        *{box-sizing:border-box;}
        input,select,button{font-family:'Pretendard','Noto Sans KR',sans-serif;}
        ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${border};border-radius:3px;}
        select option{background:${inputBg};color:${textP};}
        input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;background:linear-gradient(to right,${accent} 0%,${accent} ${(salaryIdx/(SALARY_MARKS.length-1))*100}%,${border} ${(salaryIdx/(SALARY_MARKS.length-1))*100}%,${border} 100%);border-radius:3px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:${isV?"linear-gradient(135deg,#F472B6,#A855F7)":accent};border-radius:50%;border:3px solid ${bg};box-shadow:0 0 10px ${accent}44;cursor:pointer;}
        input[type=range]::-moz-range-thumb{width:20px;height:20px;background:${accent};border-radius:50%;border:3px solid ${bg};cursor:pointer;}
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{position:"relative",overflow:"hidden",padding:"40px 24px 32px"}}>
        {isV&&<><div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,#F472B608 1px,transparent 1px)",backgroundSize:"32px 32px",maskImage:"radial-gradient(ellipse at center,black 20%,transparent 65%)",WebkitMaskImage:"radial-gradient(ellipse at center,black 20%,transparent 65%)"}}/>
        <div style={{position:"absolute",top:"18%",left:"12%",fontSize:"12px",animation:"sparkle 2s ease infinite",color:"#F472B6"}}>✦</div>
        <div style={{position:"absolute",top:"25%",right:"18%",fontSize:"9px",animation:"sparkle 2.5s ease 0.5s infinite",color:"#A855F7"}}>✧</div>
        <div style={{position:"absolute",bottom:"20%",left:"30%",fontSize:"8px",animation:"sparkle 3s ease 1s infinite",color:"#FBBF24"}}>★</div></>}
        {!isV&&<div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse at center,black 30%,transparent 70%)",WebkitMaskImage:"radial-gradient(ellipse at center,black 30%,transparent 70%)"}}/>}

        <div style={{maxWidth:"820px",margin:"0 auto",position:"relative",zIndex:1}}>

          {/* MODE TABS */}
          <div style={{display:"flex",justifyContent:"center",gap:"4px",marginBottom:"24px",background:surface,borderRadius:"14px",padding:"4px",border:`1px solid ${border}`,maxWidth:"340px",margin:"0 auto 24px"}}>
            {[{id:"general",label:"💼 일반 채용",},{id:"visual",label:"🎬 영상 전문"}].map(t=>{
              const active=mode===t.id;
              return(
                <button key={t.id} onClick={()=>{setMode(t.id);setJobs([]);setSearched(false);setError("");}}
                  style={{
                    flex:1,padding:"10px 0",borderRadius:"10px",border:"none",
                    background:active?(t.id==="visual"?"linear-gradient(135deg,#F472B633,#A855F722)":"linear-gradient(135deg,#6366F133,#4F46E522)"):"transparent",
                    color:active?(t.id==="visual"?"#F9A8D4":"#818CF8"):textM,
                    fontSize:"14px",fontWeight:active?800:500,cursor:"pointer",transition:"all 0.3s",
                    boxShadow:active?`0 0 16px ${t.id==="visual"?"#F472B615":"#6366F115"}`:"none",
                  }}
                >{t.label}</button>
              );
            })}
          </div>

          {/* TITLE */}
          <div style={{textAlign:"center",marginBottom:"24px"}}>
            <h1 style={{
              fontSize:"30px",fontWeight:900,margin:0,
              background:isV?"linear-gradient(135deg,#F9A8D4,#F472B6,#A855F7,#818CF8)":"linear-gradient(135deg,#818CF8,#6366F1,#A78BFA)",
              backgroundSize:"200% 200%",animation:"gradShift 4s ease infinite",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em",
            }}>{isV?"영상·미디어 채용 통합검색":"취업공고 통합검색"}</h1>
            <p style={{color:textM,fontSize:"13px",marginTop:"8px",lineHeight:1.5}}>
              {isV?"애니메이션 · 영화 · 방송 · 게임 · 모션그래픽 · 웹툰 · 영상제작":"사람인 · 잡코리아 · 알바몬 · 인크루트 · 원티드 · 캐치 · 링커리어 · 잡플래닛"}
            </p>
          </div>

          {/* SEARCH BAR */}
          <div style={{display:"flex",gap:"8px",background:inputBg,borderRadius:"16px",padding:"5px",border:`1px solid ${border}`,boxShadow:`0 4px 24px ${accent}08`}}>
            <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 12px",gap:"10px"}}>
              <span style={{fontSize:"18px",opacity:0.5}}>🔍</span>
              <input ref={inputRef} type="text" value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")searchJobs();}}
                placeholder={isV?"직무, 스튜디오, 툴, 키워드...":"직무, 회사명, 키워드 검색..."}
                style={{flex:1,background:"transparent",border:"none",outline:"none",color:textP,fontSize:"15px",fontWeight:500,padding:"12px 0"}}/>
            </div>
            <button onClick={searchJobs} disabled={loading||!keyword.trim()}
              style={{padding:"12px 28px",borderRadius:"12px",border:"none",background:loading?accent:`linear-gradient(135deg,${accent},${isV?"#A855F7":"#4F46E5"})`,color:"#fff",fontSize:"15px",fontWeight:800,cursor:loading?"wait":"pointer",opacity:!keyword.trim()?0.5:1,whiteSpace:"nowrap",transition:"all 0.2s",boxShadow:keyword.trim()?`0 4px 16px ${accent}33`:"none"}}
            >{loading?"검색중...":"검색"}</button>
          </div>

          {/* FILTER TOGGLE */}
          <div style={{marginTop:"14px",textAlign:"center"}}>
            <button onClick={()=>setShowFilters(!showFilters)} style={{background:filterCount>0?accent+"15":"transparent",border:filterCount>0?`1px solid ${accent}33`:"none",color:filterCount>0?accent:textM,fontSize:"13px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 14px",borderRadius:"20px",transition:"all 0.2s"}}>
              <span style={{transform:showFilters?"rotate(180deg)":"",transition:"transform 0.3s",display:"inline-block"}}>▼</span>
              상세 필터 {showFilters?"접기":"펼치기"}
              {filterCount>0&&(<span style={{background:`linear-gradient(135deg,${accent},${isV?"#A855F7":"#4F46E5"})`,color:"#fff",borderRadius:"50%",width:"20px",height:"20px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:900,marginLeft:"2px"}}>{filterCount}</span>)}
            </button>
          </div>

          {/* ─── FILTERS PANEL ─── */}
          {showFilters&&(
            <div style={{marginTop:"14px",background:surface,borderRadius:"16px",padding:"22px",border:`1px solid ${border}`,animation:"slideUp 0.3s ease"}}>
              {/* Sites */}
              <div style={{marginBottom:"16px"}}>
                <label style={mkLabel(mode)}>🌐 검색 사이트</label>
                <SiteFilter sites={sites} selected={selectedSites} onToggle={toggleSite} mode={mode}/>
              </div>
              <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${border},transparent)`,margin:"4px 0 16px"}}/>

              {/* Visual: Category Tabs */}
              {isV&&(<>
                <div style={{marginBottom:"16px"}}>
                  <label style={mkLabel(mode)}>🎬 영상 분야</label>
                  <CategoryTabs selected={visualCat} onChange={setVisualCat}/>
                </div>
                <div style={{display:"flex",gap:"12px",flexWrap:"wrap",marginBottom:"16px"}}>
                  <StyledSelect label="세부 직무" icon="🎨" value={roleV} onChange={setRoleV} options={roles} mode={mode}/>
                  <StyledSelect label="사용 툴" icon="🖥️" value={toolV} onChange={setToolV} options={TOOLS_SOFTWARE} mode={mode}/>
                </div>
                <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${border},transparent)`,margin:"4px 0 16px"}}/>
              </>)}

              {/* Salary */}
              <div style={{marginBottom:"16px"}}>
                <label style={mkLabel(mode)}>💰 연봉 범위</label>
                <div style={{padding:"4px 4px 0"}}>
                  <input type="range" min={0} max={SALARY_MARKS.length-1} value={salaryIdx} onChange={e=>setSalaryIdx(parseInt(e.target.value))}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
                    <span style={{fontSize:"11px",color:textM}}>전체</span>
                    <span style={{fontSize:"14px",fontWeight:800,color:salaryMin>0?accent:textM,background:salaryMin>0?accent+"12":"transparent",padding:"2px 10px",borderRadius:"12px"}}>{salaryLabel}</span>
                    <span style={{fontSize:"11px",color:textM}}>1억+</span>
                  </div>
                </div>
              </div>
              <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${border},transparent)`,margin:"4px 0 16px"}}/>

              {/* Shared Filters Row 1 */}
              <div style={{display:"flex",gap:"12px",flexWrap:"wrap",marginBottom:"12px"}}>
                <StyledSelect label="지역" icon="📍" value={region} onChange={setRegion} options={REGIONS.map(r=>({label:r}))} mode={mode}/>
                <StyledSelect label="고용형태" icon="📄" value={jobType} onChange={setJobType} options={JOB_TYPES.map(t=>({label:t}))} mode={mode}/>
                <StyledSelect label="경력" icon="⭐" value={experience} onChange={setExperience} options={EXPERIENCE_LEVELS} mode={mode}/>
              </div>
              {/* Row 2 */}
              <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
                <StyledSelect label="학력" icon="🎓" value={education} onChange={setEducation} options={EDUCATION_LEVELS} mode={mode}/>
                {!isV&&<StyledSelect label="업종/직종" icon="🏭" value={industryG} onChange={setIndustryG} options={INDUSTRIES_GENERAL} mode={mode}/>}
                <StyledSelect label="정렬" icon="↕️" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} valueKey="value" mode={mode}/>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{maxWidth:"920px",margin:"0 auto",padding:"24px"}}>
        <ActiveFilters filters={activeFilters} onClear={clearFilter} onClearAll={clearAll} mode={mode}/>

        {loading&&(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{display:"flex",justifyContent:"center",gap:"18px",marginBottom:"24px"}}>
              {(isV?["🎬","🎨","✨"]:["💼","🔍","📋"]).map((e,i)=>(<span key={i} style={{fontSize:"32px",animation:`float 1.5s ease ${i*0.3}s infinite`,display:"inline-block"}}>{e}</span>))}
            </div>
            <p style={{color:isV?"#C4B5FD":"#94A3B8",fontSize:"15px",fontWeight:600}}>
              {isV?"영상·미디어 업계 공고를 수집하고 있습니다...":"여러 취업 사이트에서 공고를 수집하고 있습니다..."}
            </p>
            <div style={{width:"200px",height:"3px",background:border,borderRadius:"2px",margin:"16px auto 0",overflow:"hidden"}}>
              <div style={{width:"60%",height:"100%",background:`linear-gradient(90deg,transparent,${accent},${isV?"#A855F7":"#4F46E5"},transparent)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite linear"}}/>
            </div>
          </div>
        )}

        {error&&!loading&&(
          <div style={{background:isV?"#1C0A1E":"#1C1117",border:`1px solid ${isV?"#5B1A3D":"#5B2333"}`,borderRadius:"12px",padding:"20px",textAlign:"center",color:"#FB7185",fontSize:"14px"}}>⚠️ {error}</div>
        )}

        {jobs.length>0&&!loading&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px",marginBottom:"18px"}}>
            <p style={{color:isV?"#C4B5FD":"#94A3B8",fontSize:"14px",fontWeight:700,margin:0}}>
              🎯 <span style={{color:accent}}>{displayJobs.length}</span>개의 공고
              {displayJobs.length!==jobs.length&&<span style={{color:textM}}> (전체 {jobs.length}개 중)</span>}
            </p>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{fontSize:"14px",opacity:0.5}}>🔎</span>
              <input type="text" value={resultFilter} onChange={e=>setResultFilter(e.target.value)} placeholder="결과 내 검색..."
                style={{background:inputBg,border:`1px solid ${border}`,borderRadius:"10px",padding:"7px 14px",color:textP,fontSize:"13px",outline:"none",width:"170px",transition:"border-color 0.2s"}}
                onFocus={e=>e.currentTarget.style.borderColor=accent} onBlur={e=>e.currentTarget.style.borderColor=border}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:"14px"}}>
            {displayJobs.map((job,i)=><JobCard key={i} job={job} index={i} mode={mode}/>)}
          </div>
          {displayJobs.length===0&&(<div style={{textAlign:"center",padding:"40px",color:textM,fontSize:"14px"}}>결과 내 검색에 일치하는 공고가 없습니다.</div>)}
        </>)}

        {!loading&&!error&&jobs.length===0&&!searched&&(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:"56px",marginBottom:"16px",opacity:0.6}}>{isV?"🎬":"🔍"}</div>
            <p style={{color:textM,fontSize:"15px",lineHeight:1.7,maxWidth:"380px",margin:"0 auto"}}>
              {isV?"영상·미디어 업계 채용 공고를\n한번에 모아서 검색해보세요":"검색어를 입력하면\n여러 취업 사이트의 공고를\n한번에 모아서 보여드립니다"}
            </p>
            <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"8px",marginTop:"28px"}}>
              {quickTags.map(tag=>(
                <button key={tag} onClick={()=>setKeyword(tag)}
                  style={{padding:"8px 16px",borderRadius:"20px",border:`1px solid ${border}`,background:surface,color:isV?"#C4B5FD":"#94A3B8",fontSize:"13px",cursor:"pointer",fontWeight:600,transition:"all 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;e.currentTarget.style.background=accent+"10";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=border;e.currentTarget.style.color=isV?"#C4B5FD":"#94A3B8";e.currentTarget.style.background=surface;}}
                >{tag}</button>
              ))}
            </div>
          </div>
        )}

        {!loading&&!error&&jobs.length===0&&searched&&(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>😥</div>
            <p style={{color:isV?"#C4B5FD":"#94A3B8",fontSize:"15px"}}>검색 결과가 없습니다. 다른 키워드로 시도해보세요.</p>
          </div>
        )}
      </div>

      <div style={{textAlign:"center",padding:"32px",color:textM,fontSize:"12px",borderTop:`1px solid ${border}`,marginTop:"40px"}}>
        AI 웹 검색 기반 {isV?"영상·미디어 업계":"취업공고"} 통합검색 · 결과는 각 사이트의 최신 공고와 다를 수 있습니다
      </div>
    </div>
  );
}
