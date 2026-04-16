import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

const FF = "'Pretendard','Noto Sans KR',sans-serif"
const BG = "#FDF8FF"
const SURFACE = "#FFFFFF"
const BORDER = "#E6DFF2"
const ACCENT = "#C026D3"
const ACCENT2 = "#9333EA"
const TEXT = "#1A0F2E"
const TEXTS = "#9181AA"

export default function InviteCodePage({ session, onActivated }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const inv = p.get('invite')
    if (inv) setCode(inv.toUpperCase().slice(0, 20))
  }, [])

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase().slice(0, 20))
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
      const { data: { session: cur } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, token: cur?.access_token }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '오류가 발생했습니다.')
      else onActivated()
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
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
        <div style={{ fontSize: 44, marginBottom: 16 }}>🔑</div>

        <h1 style={{ color: TEXT, fontSize: 20, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em' }}>
          초대 코드 입력
        </h1>
        <p style={{ color: TEXTS, fontSize: 13, margin: '0 0 10px' }}>
          이용하려면 초대 코드가 필요합니다
        </p>
        <div style={{
          display: 'inline-block',
          color: ACCENT, fontSize: 12, fontWeight: 600,
          padding: '4px 12px', marginBottom: 28,
          background: `${ACCENT}10`, borderRadius: 20,
          border: `1px solid ${ACCENT}25`,
        }}>
          {session.user.email}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={code}
            onChange={handleChange}
            placeholder="초대 코드 입력"
            autoFocus
            style={{
              padding: '14px 16px',
              background: '#FAFAFD',
              border: `1.5px solid ${error ? '#FECDCA' : BORDER}`,
              borderRadius: 12,
              color: TEXT,
              fontSize: 20, fontWeight: 800,
              textAlign: 'center', letterSpacing: 4,
              outline: 'none', fontFamily: 'monospace',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = error ? '#FECDCA' : BORDER}
          />

          {error && (
            <div style={{
              color: '#C0392B', fontSize: 13,
              padding: '10px 14px', background: '#FFF5F5',
              borderRadius: 10, border: '1px solid #FECDCA',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || code.length < 2} style={{
            padding: '14px',
            background: loading || code.length < 2
              ? '#EDE9F6'
              : `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            border: 'none', borderRadius: 12,
            cursor: loading || code.length < 2 ? 'not-allowed' : 'pointer',
            color: loading || code.length < 2 ? TEXTS : '#fff',
            fontSize: 15, fontWeight: 800,
            transition: 'all 0.2s', fontFamily: FF,
            boxShadow: loading || code.length < 2 ? 'none' : `0 4px 16px ${ACCENT}30`,
          }}>
            {loading ? '확인 중...' : '코드 확인'}
          </button>
        </form>

        <button onClick={() => supabase.auth.signOut()} style={{
          marginTop: 22, background: 'none', border: 'none',
          color: TEXTS, fontSize: 13, cursor: 'pointer', fontFamily: FF,
        }}>
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  )
}
