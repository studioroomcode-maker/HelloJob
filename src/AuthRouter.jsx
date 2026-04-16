import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import App from './hellojobs.jsx'
import LoginPage from './LoginPage.jsx'
import InviteCodePage from './InviteCodePage.jsx'
import AdminPage from './AdminPage.jsx'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AuthRouter() {
  const [session, setSession] = useState(undefined) // undefined = still loading
  const [activated, setActivated] = useState(null)  // null = not checked yet
  const [showAdmin, setShowAdmin] = useState(false)

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

  // Check if user is activated (has used invite code)
  useEffect(() => {
    if (!session) { setActivated(null); return }

    supabase
      .from('user_profiles')
      .select('activated')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setActivated(data?.activated ?? false))
  }, [session])

  // Loading spinner
  if (session === undefined || (session && activated === null)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: '#0f1117',
      }}>
        <div style={{ color: '#555', fontSize: 14 }}>로딩 중...</div>
      </div>
    )
  }

  // Not logged in
  if (!session) return <LoginPage />

  // Logged in but no invite code
  if (!activated) {
    return (
      <InviteCodePage
        session={session}
        onActivated={() => setActivated(true)}
      />
    )
  }

  // Admin panel
  if (showAdmin && session.user.email === ADMIN_EMAIL) {
    return (
      <AdminPage
        session={session}
        onBack={() => { window.location.hash = ''; setShowAdmin(false) }}
      />
    )
  }

  // Main app
  return <App />
}
