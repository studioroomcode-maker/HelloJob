import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase.js'

export default function AdminPage({ onBack }) {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(null)
  const [error, setError] = useState('')

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/list', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '목록을 불러올 수 없습니다.')
      else setCodes(data.codes || [])
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCodes() }, [fetchCodes])

  const generateCode = async () => {
    setGenerating(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '생성에 실패했습니다.')
      else await fetchCodes()
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setGenerating(false)
    }
  }

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}?invite=${code}`)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const unusedCount = codes.filter(c => !c.used).length
  const usedCount = codes.filter(c => c.used).length

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0f1117',
      color: '#fff',
      fontFamily: '"Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
      padding: 24,
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              color: '#ccc',
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          >
            ← 돌아가기
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>초대 코드 관리</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <Stat label="미사용" value={unusedCount} color="#a78bfa" />
            <Stat label="사용됨" value={usedCount} color="#888" />
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generateCode}
          disabled={generating}
          style={{
            marginBottom: 20,
            padding: '12px 24px',
            background: generating ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            borderRadius: 12,
            color: generating ? '#666' : '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: generating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}
        >
          {generating ? '생성 중...' : '+ 새 초대 코드 생성'}
        </button>

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

        {/* Codes list */}
        {loading ? (
          <div style={{ color: '#666', textAlign: 'center', padding: 60, fontSize: 14 }}>
            로딩 중...
          </div>
        ) : codes.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', padding: 60, fontSize: 14 }}>
            초대 코드가 없습니다.<br />위 버튼으로 생성해보세요.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {codes.map(c => (
              <div
                key={c.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: c.used ? '#555' : '#a78bfa',
                    flexShrink: 0,
                  }}>
                    {c.code}
                  </span>
                  <span style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: c.used ? 'rgba(255,80,80,0.12)' : 'rgba(80,255,120,0.12)',
                    color: c.used ? '#ff8080' : '#7dff98',
                    flexShrink: 0,
                  }}>
                    {c.used ? '사용됨' : '미사용'}
                  </span>
                  {c.used && (
                    <span style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.used_by_email && `${c.used_by_email} · `}
                      {c.used_at && new Date(c.used_at).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {!c.used && (
                    <button
                      onClick={() => copyLink(c.code)}
                      style={{
                        padding: '6px 12px',
                        background: copied === c.code ? 'rgba(80,255,120,0.15)' : 'rgba(255,255,255,0.07)',
                        border: `1px solid ${copied === c.code ? 'rgba(80,255,120,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: copied === c.code ? '#7dff98' : '#bbb',
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                      }}
                    >
                      {copied === c.code ? '복사됨!' : '링크 복사'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666' }}>{label}</div>
    </div>
  )
}
