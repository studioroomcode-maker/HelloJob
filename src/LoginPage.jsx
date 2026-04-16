import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js'

export default function LoginPage() {
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err === 'naver_denied') setError('네이버 로그인이 취소되었습니다.')
    else if (err === 'naver_no_email') setError('네이버 계정에 이메일이 없습니다. 이메일 제공에 동의해주세요.')
    else if (err) setError('로그인 중 오류가 발생했습니다.')
  }, [])

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const handleKakao = () => {
    supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    })
  }

  const handleNaver = () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
    if (!clientId) { setError('네이버 로그인이 설정되지 않았습니다.'); return }
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/naver-callback`)
    const state = btoa(window.location.origin).replace(/=/g, '')
    window.location.href =
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)',
      fontFamily: '"Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
      padding: 20,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: 14,
            padding: '10px 18px',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 22 }}>🎬</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px' }}>
              JH 영상·미디어
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
            로그인
          </h1>
          <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            초대받은 분만 이용할 수 있습니다
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: 16,
            color: '#ff8080',
            fontSize: 13,
            padding: '10px 14px',
            background: 'rgba(255,100,100,0.1)',
            borderRadius: 10,
            border: '1px solid rgba(255,100,100,0.2)',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Google */}
          <OAuthButton onClick={handleGoogle} bg="#fff" bgHover="#f5f5f5" color="#333">
            <GoogleIcon />
            Google로 로그인
          </OAuthButton>

          {/* Kakao */}
          <OAuthButton onClick={handleKakao} bg="#FEE500" bgHover="#f5dc00" color="#191919">
            <KakaoIcon />
            카카오로 로그인
          </OAuthButton>

          {/* Naver */}
          <OAuthButton onClick={handleNaver} bg="#03C75A" bgHover="#02b050" color="#fff">
            <NaverIcon />
            네이버로 로그인
          </OAuthButton>
        </div>
      </div>
    </div>
  )
}

function OAuthButton({ onClick, bg, bgHover, color, children }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '13px 20px',
        background: hovered ? bgHover : bg,
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        fontSize: 15,
        fontWeight: 600,
        color,
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
      <path d="M12 3C6.48 3 2 6.9 2 11.7c0 3.03 1.79 5.69 4.5 7.26L5.5 22l4.23-2.3c.75.12 1.52.18 2.27.18 5.52 0 10-3.9 10-8.7S17.52 3 12 3z"/>
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M16.27 12.93L7.5 0H0v24h7.73V11.07L16.5 24H24V0h-7.73z"/>
    </svg>
  )
}
