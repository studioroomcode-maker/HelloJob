import React, { useState, useEffect } from 'react'
import { supabase, supabaseReady } from './lib/supabase.js'
import App from './hellojobs.jsx'
import LoginPage from './LoginPage.jsx'
import InviteCodePage from './InviteCodePage.jsx'
import AdminPage from './AdminPage.jsx'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AuthRouter() {
  const [session, setSession] = useState(undefined)
  const [activated, setActivated] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)

  // Supabase 환경변수 미설정 시 안내
  if (!supabaseReady) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', background: '#0f1117',
        fontFamily: '"Apple SD Gothic Neo", sans-serif', padding: 20,
      }}>
        <div style={{
          background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)',
          borderRadius: 16, padding: 32, maxWidth: 420, textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚙️</div>
          <h2 style={{ color: '#fbbf24', fontSize: 17, fontWeight: 700, margin: '0 0 12px' }}>
            Supabase 환경변수 설정 필요
          </h2>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Vercel 대시보드 → Settings → Environment Variables에서<br />
            <code style={{ color: '#fbbf24' }}>VITE_SUPABASE_URL</code>과{' '}
            <code style={{ color: '#fbbf24' }}>VITE_SUPABASE_ANON_KEY</code>를<br />
            추가한 후 재배포해주세요.
          </p>
        </div>
      </div>
    )
  }

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
      if (!session) setActivated(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Admin panel toggle via URL hash
  useEffect(() => {
    const check = () => setShowAdmin(window.location.hash === '#admin')
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  // Check activation status
  useEffect(() => {
    if (!session) { setActivated(null); return }

    supabase
      .from('user_profiles')
      .select('activated')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setActivated(data?.activated ?? false))
  }, [session])

  // Loading
  if (session === undefined || (session && activated === null)) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', background: '#0f1117',
      }}>
        <div style={{ color: '#555', fontSize: 14 }}>로딩 중...</div>
      </div>
    )
  }

  if (!session) return <LoginPage />

  const isAdmin = session.user.email === ADMIN_EMAIL

  // 관리자는 초대코드 없이 바로 입장
  if (!activated && !isAdmin) {
    return <InviteCodePage session={session} onActivated={() => setActivated(true)} />
  }

  if (showAdmin && isAdmin) {
    return (
      <AdminPage
        session={session}
        onBack={() => { window.location.hash = ''; setShowAdmin(false) }}
      />
    )
  }

  return (
    <>
      <App />
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        fontFamily: '"Apple SD Gothic Neo", sans-serif',
      }}>
        {isAdmin && (
          <button
            onClick={() => { window.location.hash = 'admin' }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #C026D3, #9333EA)',
              border: 'none', borderRadius: 50,
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(192,38,211,0.35)',
              fontFamily: "'Pretendard','Noto Sans KR',sans-serif",
            }}
          >
            ⚙️ 관리자
          </button>
        )}
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px',
            background: '#FFFFFF',
            border: '1px solid #E6DFF2',
            borderRadius: 50,
            color: '#9181AA', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(192,38,211,0.08)',
            fontFamily: "'Pretendard','Noto Sans KR',sans-serif",
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  )
}
