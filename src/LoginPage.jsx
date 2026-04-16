import React from 'react'
import { supabase } from './lib/supabase.js'

const FF = "'Pretendard','Noto Sans KR',sans-serif"
const BG = "#FDF8FF"
const SURFACE = "#FFFFFF"
const BORDER = "#E6DFF2"
const ACCENT = "#C026D3"
const ACCENT2 = "#9333EA"
const TEXT = "#1A0F2E"
const TEXTS = "#9181AA"

export default function LoginPage() {
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const e = p.get('error')
    if (e === 'naver_denied') setError('네이버 로그인이 취소되었습니다.')
    else if (e === 'naver_no_email') setError('네이버 계정의 이메일 제공에 동의해주세요.')
    else if (e) setError('로그인 중 오류가 발생했습니다.')
  }, [])

  const handleGoogle = () => supabase.auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: window.location.origin },
  })
  const handleKakao = () => supabase.auth.signInWithOAuth({
    provider: 'kakao', options: { redirectTo: window.location.origin },
  })
  const handleNaver = () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
    if (!clientId) { setError('네이버 로그인이 설정되지 않았습니다.'); return }
    const redirect = encodeURIComponent(`${window.location.origin}/api/auth/naver-callback`)
    const state = btoa(window.location.origin).replace(/=/g, '')
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&state=${state}`
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: BG, fontFamily: FF, padding: 20,
    }}>
      <div style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%', maxWidth: 360,
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(192,38,211,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
      }}>
        {/* 로고 */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            borderRadius: 14, padding: '10px 18px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 20 }}>🎬</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>
              영상·미디어
            </span>
          </div>
          <h1 style={{ color: TEXT, fontSize: 20, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            로그인
          </h1>
          <p style={{ color: TEXTS, fontSize: 13, margin: 0 }}>
            초대받은 분만 이용할 수 있습니다
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: 16, color: '#C0392B', fontSize: 13,
            padding: '10px 14px', background: '#FFF5F5',
            borderRadius: 10, border: '1px solid #FECDCA',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <OAuthBtn onClick={handleGoogle} bg="#fff" bgH="#F5F5F5" color="#333" border="#E2E5EB">
            <GoogleIcon /> Google로 로그인
          </OAuthBtn>
          <OAuthBtn onClick={handleKakao} bg="#FEE500" bgH="#F0D800" color="#191919" border="#F0D800">
            <KakaoIcon /> 카카오로 로그인
          </OAuthBtn>
          <OAuthBtn onClick={handleNaver} bg="#03C75A" bgH="#02B050" color="#fff" border="#03C75A">
            <NaverIcon /> 네이버로 로그인
          </OAuthBtn>
        </div>
      </div>
    </div>
  )
}

function OAuthBtn({ onClick, bg, bgH, color, border, children }) {
  const [h, setH] = React.useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '13px 20px',
        background: h ? bgH : bg,
        border: `1px solid ${border}`,
        borderRadius: 12, cursor: 'pointer',
        fontSize: 15, fontWeight: 700, color,
        transition: 'all 0.15s', fontFamily: FF,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      }}>{children}</button>
  )
}

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
}
function KakaoIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919"><path d="M12 3C6.48 3 2 6.9 2 11.7c0 3.03 1.79 5.69 4.5 7.26L5.5 22l4.23-2.3c.75.12 1.52.18 2.27.18 5.52 0 10-3.9 10-8.7S17.52 3 12 3z"/></svg>
}
function NaverIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M16.27 12.93L7.5 0H0v24h7.73V11.07L16.5 24H24V0h-7.73z"/></svg>
}
