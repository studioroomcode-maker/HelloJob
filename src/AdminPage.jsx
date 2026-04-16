import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase.js'

const FF = "'Pretendard','Noto Sans KR',sans-serif"
const BG = "#FDF8FF"
const SURFACE = "#FFFFFF"
const BORDER = "#E6DFF2"
const BORDER_HI = "#CBBFE2"
const ACCENT = "#C026D3"
const ACCENT2 = "#9333EA"
const TEXT = "#1A0F2E"
const TEXTM = "#9181AA"
const TEXTS = "#6B5D88"

export default function AdminPage({ onBack }) {
  const [tab, setTab] = useState('codes')

  return (
    <div style={{ minHeight: '100dvh', background: BG, fontFamily: FF, color: TEXT }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 28px',
        background: SURFACE,
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: '0 1px 8px rgba(192,38,211,0.06)',
      }}>
        <button onClick={onBack} style={{
          background: 'transparent',
          border: `1px solid ${BORDER}`,
          borderRadius: 10, color: TEXTM,
          padding: '7px 14px', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, fontFamily: FF,
          transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = BORDER_HI; e.currentTarget.style.color = TEXT }}
          onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = TEXTM }}
        >
          ← 앱으로 돌아가기
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em' }}>관리자 패널</h1>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {[{ key: 'codes', label: '초대코드' }, { key: 'users', label: '회원 목록' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px',
              background: tab === t.key ? `${ACCENT}12` : 'transparent',
              border: `1px solid ${tab === t.key ? `${ACCENT}40` : BORDER}`,
              borderRadius: 8,
              color: tab === t.key ? ACCENT : TEXTM,
              fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              cursor: 'pointer', fontFamily: FF, transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px', maxWidth: 820, margin: '0 auto' }}>
        {tab === 'codes' ? <CodesTab /> : <UsersTab />}
      </div>
    </div>
  )
}

/* ─── 초대코드 탭 ─── */
function CodesTab() {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [copied, setCopied] = useState(null)
  const [error, setError] = useState('')
  const [inputCode, setInputCode] = useState('')

  const fetchCodes = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/list', { headers: { Authorization: `Bearer ${session?.access_token}` } })
      const data = await res.json()
      if (!res.ok) setError(data.error || '불러오기 실패')
      else setCodes(data.codes || [])
    } catch { setError('서버 연결 실패') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchCodes() }, [fetchCodes])

  const generateCode = async (e) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    setGenerating(true); setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ code: inputCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '생성 실패')
      else { setInputCode(''); await fetchCodes() }
    } catch { setError('서버 연결 실패') }
    finally { setGenerating(false) }
  }

  const deleteCode = async (code) => {
    if (!window.confirm(`"${code}" 코드를 삭제할까요?`)) return
    setDeleting(code); setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/invite/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || '삭제 실패')
      else await fetchCodes()
    } catch { setError('서버 연결 실패') }
    finally { setDeleting(null) }
  }

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}?invite=${code}`)
    setCopied(code); setTimeout(() => setCopied(null), 2000)
  }

  const unused = codes.filter(c => !c.used).length

  return (
    <>
      <form onSubmit={generateCode} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={inputCode}
          onChange={e => { setInputCode(e.target.value.toUpperCase()); setError('') }}
          placeholder="초대코드 입력 (예: BSK0001)"
          maxLength={20}
          style={{
            flex: 1, padding: '10px 16px',
            background: SURFACE, border: `1.5px solid ${BORDER}`,
            borderRadius: 10, color: TEXT,
            fontSize: 15, fontWeight: 700, letterSpacing: 2,
            fontFamily: 'monospace', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => e.target.style.borderColor = BORDER}
        />
        <button type="submit" disabled={generating || !inputCode.trim()} style={{
          padding: '10px 22px',
          background: generating || !inputCode.trim() ? '#EDE9F6' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
          border: 'none', borderRadius: 10,
          color: generating || !inputCode.trim() ? TEXTM : '#fff',
          fontSize: 14, fontWeight: 700,
          cursor: generating || !inputCode.trim() ? 'not-allowed' : 'pointer',
          fontFamily: FF, whiteSpace: 'nowrap',
          boxShadow: generating || !inputCode.trim() ? 'none' : `0 4px 14px ${ACCENT}28`,
        }}>
          {generating ? '생성 중...' : '+ 생성'}
        </button>
      </form>

      <div style={{ marginBottom: 20, fontSize: 13, color: TEXTM }}>
        미사용 <strong style={{ color: ACCENT }}>{unused}</strong>개 &nbsp;/&nbsp;
        전체 <strong style={{ color: TEXT }}>{codes.length}</strong>개
      </div>

      {error && <ErrBox>{error}</ErrBox>}

      {loading ? <Loading /> : codes.length === 0 ? (
        <Empty>초대코드가 없습니다. 위 입력창으로 생성해보세요.</Empty>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {codes.map(c => (
            <div key={c.code} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: 12, gap: 12,
              boxShadow: '0 1px 4px rgba(192,38,211,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 16, fontWeight: 800, letterSpacing: 2,
                  color: c.used ? TEXTM : ACCENT, flexShrink: 0,
                }}>
                  {c.code}
                </span>
                <StatusBadge used={c.used}>{c.used ? '사용됨' : '미사용'}</StatusBadge>
                {c.used && (
                  <span style={{ fontSize: 12, color: TEXTM, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.used_by_email && <span style={{ color: TEXTS }}>{c.used_by_email}</span>}
                    {c.used_at && <span style={{ marginLeft: 6 }}>· {fmtDate(c.used_at)}</span>}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {!c.used && (
                  <Btn onClick={() => copyLink(c.code)} color={copied === c.code ? '#059669' : TEXTS}
                    bg={copied === c.code ? '#F0FDF4' : SURFACE} border={copied === c.code ? '#BBF7D0' : BORDER}>
                    {copied === c.code ? '복사됨!' : '링크 복사'}
                  </Btn>
                )}
                <Btn onClick={() => deleteCode(c.code)} disabled={deleting === c.code}
                  color="#C0392B" bg="#FFF5F5" border="#FECDCA">
                  {deleting === c.code ? '...' : '삭제'}
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ─── 회원 목록 탭 ─── */
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('')
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${session?.access_token}` } })
        const data = await res.json()
        if (!res.ok) setError(data.error || '불러오기 실패')
        else setUsers(data.users || [])
      } catch { setError('서버 연결 실패') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const activated = users.filter(u => u.activated).length
  const providerLabel = p => ({ google: '구글', kakao: '카카오', naver: '네이버', email: '이메일' })[p] || p
  const providerColor = p => ({ google: '#EA4335', kakao: '#D4A000', naver: '#03C75A', email: TEXTM })[p] || TEXTM

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: '전체 회원', value: users.length, color: ACCENT },
          { label: '활성 회원', value: activated, color: '#059669' },
          { label: '미활성', value: users.length - activated, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, padding: '14px 20px', textAlign: 'center',
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14,
            boxShadow: '0 1px 4px rgba(192,38,211,0.04)',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: TEXTM, marginTop: 2, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && <ErrBox>{error}</ErrBox>}
      {loading ? <Loading /> : users.length === 0 ? <Empty>가입된 회원이 없습니다.</Empty> : (
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 1px 8px rgba(192,38,211,0.05)',
        }}>
          {/* 헤더 */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 70px 100px 85px 70px',
            gap: 12, padding: '10px 18px',
            fontSize: 11, color: TEXTM, fontWeight: 700, letterSpacing: 0.5,
            borderBottom: `1px solid ${BORDER}`, background: '#FAF7FF',
          }}>
            <span>이메일</span><span>로그인</span><span>초대코드</span><span>가입일</span><span style={{ textAlign: 'center' }}>상태</span>
          </div>
          {users.map((u, i) => (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 70px 100px 85px 70px',
              gap: 12, alignItems: 'center',
              padding: '12px 18px',
              borderBottom: i < users.length - 1 ? `1px solid ${BORDER}` : 'none',
              transition: 'background 0.1s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#FAF7FF'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 13, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email}
              </span>
              <span style={{ fontSize: 12, color: providerColor(u.provider), fontWeight: 700 }}>
                {providerLabel(u.provider)}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: u.invite_code ? ACCENT : BORDER_HI, letterSpacing: 1 }}>
                {u.invite_code || '—'}
              </span>
              <span style={{ fontSize: 12, color: TEXTM }}>{fmtDate(u.joined_at)}</span>
              <div style={{ textAlign: 'center' }}>
                <StatusBadge used={u.activated}>{u.activated ? '활성' : '미활성'}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ─── 공용 ─── */
function StatusBadge({ used, children }) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 700,
      background: used ? '#F0FDF4' : '#FFF5F5',
      color: used ? '#059669' : '#EF4444',
      border: `1px solid ${used ? '#BBF7D0' : '#FECDCA'}`,
    }}>
      {children}
    </span>
  )
}

function Btn({ onClick, disabled, color, bg, border, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '6px 12px',
      background: bg, border: `1px solid ${border}`,
      borderRadius: 8, color, fontSize: 12, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FF,
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  )
}

function Loading() {
  return <div style={{ color: TEXTM, textAlign: 'center', padding: 60, fontSize: 14 }}>불러오는 중...</div>
}
function Empty({ children }) {
  return <div style={{ color: TEXTM, textAlign: 'center', padding: 60, fontSize: 14 }}>{children}</div>
}
function ErrBox({ children }) {
  return (
    <div style={{
      marginBottom: 16, color: '#C0392B', fontSize: 13,
      padding: '10px 14px', background: '#FFF5F5',
      borderRadius: 10, border: '1px solid #FECDCA',
    }}>
      {children}
    </div>
  )
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ko-KR', { year: '2-digit', month: 'short', day: 'numeric' })
}
