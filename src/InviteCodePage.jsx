import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

export default function InviteCodePage({ session, onActivated }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill code from invite link (?invite=LJH0001)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const invite = params.get('invite')
    if (invite) setCode(invite.toUpperCase().slice(0, 7))
  }, [])

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase().slice(0, 7))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!/^[A-Z0-9]{2,20}$/.test(code)) {
      setError('코드를 확인해주세요. (영문 대문자+숫자, 2~20자)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: { session: current } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, token: current?.access_token }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '오류가 발생했습니다.')
      else onActivated()
    } catch {
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>

        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
          초대 코드 입력
        </h1>
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 8px', lineHeight: 1.5 }}>
          이용하려면 초대 코드가 필요합니다
        </p>
        <p style={{
          color: '#a78bfa',
          fontSize: 12,
          margin: '0 0 28px',
          padding: '6px 12px',
          background: 'rgba(167,139,250,0.1)',
          borderRadius: 8,
          display: 'inline-block',
        }}>
          {session.user.email}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            value={code}
            onChange={handleChange}
            placeholder="LJH0001"
            autoFocus
            style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${error ? 'rgba(255,100,100,0.4)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12,
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: 6,
              outline: 'none',
              fontFamily: 'monospace',
            }}
          />

          {error && (
            <div style={{
              color: '#ff8080',
              fontSize: 13,
              padding: '10px 14px',
              background: 'rgba(255,100,100,0.1)',
              borderRadius: 8,
              border: '1px solid rgba(255,100,100,0.2)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 7}
            style={{
              padding: '14px',
              background: loading || code.length < 7
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: 12,
              cursor: loading || code.length < 7 ? 'not-allowed' : 'pointer',
              color: loading || code.length < 7 ? '#666' : '#fff',
              fontSize: 15,
              fontWeight: 700,
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? '확인 중...' : '코드 확인'}
          </button>
        </form>

        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            marginTop: 24,
            background: 'none',
            border: 'none',
            color: '#555',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  )
}
