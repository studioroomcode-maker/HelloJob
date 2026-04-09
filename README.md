# HelloJob - 취업공고 통합검색

AI 웹 검색 기반으로 여러 취업 사이트의 공고를 한곳에서 통합 검색하는 웹 애플리케이션입니다.

## 기능

### 💼 일반 채용 모드
- **8개 취업 사이트 통합 검색**: 사람인, 잡코리아, 알바몬, 인크루트, 원티드, 캐치, 링커리어, 잡플래닛
- **필터**: 지역, 고용형태, 연봉 범위, 경력, 학력, 업종/직종, 정렬

### 🎬 영상 전문 모드
- **8개 영상 분야 카테고리**: 애니메이션, 영화, 방송, 게임, 모션그래픽, 웹툰/만화, 영상제작
- **분야별 세부 직무 필터** (총 90개+)
- **사용 툴 필터**: Maya, Blender, After Effects, Nuke, Houdini, Unreal Engine 등 17개
- **영상 전문 검색 사이트**: 게임잡, 애니메이션K, CG/VFX 채용 포함

### 공통 기능
- 연봉 슬라이더 (2,400만원 ~ 1억원+)
- 적용 필터 뱃지 표시 및 개별/전체 초기화
- 결과 내 검색
- 추천 키워드 빠른 검색

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## Vercel 배포

1. GitHub에 이 레포를 업로드
2. [vercel.com](https://vercel.com)에서 GitHub 레포 Import
3. Framework Preset → **Vite** 선택
4. Deploy 클릭

## 기술 스택

- React 18
- Vite 5
- Anthropic Claude API (웹 검색)
