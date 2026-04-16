import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase.js'

export default function AdminPage({ onBack }) {
  const [tab, setTab] = useState('codes') // 'codes' | 'users'

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0f1117',
      color: '#fff',
      fontFamily: '"Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          color: '#ccc',
          padding: '8px 14px',
          cursor: 'pointer',
          fontSize: 14,
          fontFamily: 'inherit',
        }}>
          ← 앱으로 돌아가기
        </button>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>관리자 패널</h1>

        {/* 탭 */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {[
            { key: 'codes', label: '초대코드' },
            { key: 'users', label: '회원 목록' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 16px',
              background: tab === t.key ? 'rgba(167,139,250,0.2)' : 'transparent',
              border: `1px solid ${tab === t.key ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 8,
              color: tab === t.key ? '#a78bfa' : '#888',
              fontSize: 13,
              fontWeight: tab === t.key ? 700 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        {tab === 'codes' ? <CodesTab /> : <UsersTab />}
      </div>
    </div>
  )
}

/* ───── 초대코드 탭 ───── */
function CodesTab() {
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
      if (!res.ok) setError(data.error || '불러오기 실패')
      else setCodes(data.codes || [])
    } catch {
      setError('서버 연결 실패')
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '생성 실패')
      else await fetchCodes()
    } catch {
      setError('서버 연결 실패')
    } finally {
      setGenerating(false)
    }
  }

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}?invite=${code}`)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const unused = codes.filter(c => !c.used).length

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={generateCode} disabled={generating} style={{
          padding: '10px 22px',
          background: generating ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none', borderRadius: 10,
          color: generating ? '#666' : '#fff',
          fontSize: 14, fontWeight: 700,
          cursor: generating ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
        }}>
          {generating ? '생성 중...' : '+ 새 초대코드 생성'}
        </button>
        <span style={{ fontSize: 13, color: '#666' }}>
          미사용 <strong style={{ color: '#a78bfa' }}>{unused}</strong>개 /
          전체 <strong style={{ color: '#ccc' }}>{codes.length}</strong>개
        </span>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      {loading ? <Loading /> : codes.length === 0 ? (
        <Empty>초대코드가 없습니다. 위 버튼으로 생성해보세요.</Empty>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {codes.map(c => (
            <div key={c.code} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 16, fontWeight: 700, letterSpacing: 2,
                  color: c.used ? '#555' : '#a78bfa', flexShrink: 0,
                }}>
                  {c.code}
                </span>
                <Badge used={c.used}>{c.used ? '사용됨' : '미사용'}</Badge>
                {c.used && (
                  <span style={{ fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.used_by_email && <span style={{ color: '#999' }}>{c.used_by_email}</span>}
                    {c.used_at && <span style={{ marginLeft: 6 }}>· {fmtDate(c.used_at)}</span>}
                  </span>
                )}
              </div>
              {!c.used && (
                <button onClick={() => copyLink(c.code)} style={{
                  padding: '6px 12px', flexShrink: 0,
                  background: copied === c.code ? 'rgba(80,255,120,0.12)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${copied === c.code ? 'rgba(80,255,120,0.25)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 8,
                  color: copied === c.code ? '#7dff98' : '#bbb',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {copied === c.code ? '복사됨!' : '링크 복사'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ───── 회원 목록 탭 ───── */
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        })
        const data = await res.json()
        if (!res.ok) setError(data.error || '불러오기 실패')
        else setUsers(data.users || [])
      } catch {
        setError('서버 연결 실패')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activated = users.filter(u => u.activated).length

  const providerLabel = (p) => ({
    google: '구글', kakao: '카카오', naver: '네이버', email: '이메일',
  })[p] || p

  const providerColor = (p) => ({
    google: '#EA4335', kakao: '#FEE500', naver: '#03C75A', email: '#888',
  })[p] || '#888'

  return (
    <>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <Stat label="전체 회원" value={users.length} color="#a78bfa" />
        <Stat label="활성 회원" value={activated} color="#7dff98" />
        <Stat label="미활성" value={users.length - activated} color="#ff8080" />
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      {loading ? <Loading /> : users.length === 0 ? (
        <Empty>가입된 회원이 없습니다.</Empty>
      ) : (
        <div>
          {/* 헤더 */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 100px 90px 80px',
            gap: 12, padding: '8px 16px',
            fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: 0.5,
          }}>
            <span>이메일</span>
            <span>로그인</span>
            <span>초대코드</span>
            <span>가입일</span>
            <span style={{ textAlign: 'center' }}>상태</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {users.map(u => (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 100px 90px 80px',
                gap: 12, alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 13, color: '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email}
                </span>
                <span style={{ fontSize: 12, color: providerColor(u.provider), fontWeight: 600 }}>
                  {providerLabel(u.provider)}
                </span>
                <span style={{
                  fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
                  color: u.invite_code ? '#a78bfa' : '#444',
                  letterSpacing: 1,
                }}>
                  {u.invite_code || '—'}
                </span>
                <span style={{ fontSize: 12, color: '#666' }}>
                  {fmtDate(u.joined_at)}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <Badge used={u.activated}>
                    {u.activated ? '활성' : '미활성'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/* ───── 공용 컴포넌트 ───── */
function Badge({ used, children }) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 8px', borderRadius: 6, flexShrink: 0,
      background: used ? 'rgba(80,255,120,0.12)' : 'rgba(255,80,80,0.12)',
      color: used ? '#7dff98' : '#ff8080',
    }}>
      {children}
    </span>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      padding: '12px 20px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, textAlign: 'center',
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function Loading() {
  return <div style={{ color: '#555', textAlign: 'center', padding: 60, fontSize: 14 }}>불러오는 중...</div>
}

function Empty({ children }) {
  return <div style={{ color: '#555', textAlign: 'center', padding: 60, fontSize: 14 }}>{children}</div>
}

function ErrorBox({ children }) {
  return (
    <div style={{
      marginBottom: 16, color: '#ff8080', fontSize: 13,
      padding: '10px 14px', background: 'rgba(255,100,100,0.1)',
      borderRadius: 10, border: '1px solid rgba(255,100,100,0.2)',
    }}>
      {children}
    </div>
  )
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', year: '2-digit' })
}
