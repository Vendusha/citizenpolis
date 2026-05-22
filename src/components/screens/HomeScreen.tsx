import { useApp } from '../../store/store'
import { getRank, getNextRank, getCitizenProfile } from '../../lib/engine'
import { TOPICS } from '../../data/topics'

export default function HomeScreen() {
  const { state, dispatch } = useApp()
  const { completed, dPts, iPts } = state
  const n = completed.length
  const rank = getRank(n)
  const next = getNextRank(n)
  const bp = next ? Math.round((n - rank.min) / (next.min - rank.min) * 100) : 100
  const prof = getCitizenProfile(dPts, iPts)

  return (
    <div className="screen home">
      <div className="profile-card">
        <div className="avatar">{rank.icon}</div>
        <div className="pinfo">
          <h2>{rank.label}</h2>
          <p>Anonymous citizen · {n} subtopic{n !== 1 ? 's' : ''} completed</p>
          <div className="rbar">
            <div className="rbar-track">
              <div className="rbar-fill" style={{ width: `${bp}%` }} />
            </div>
            <span className="rbar-lbl">{bp}%</span>
          </div>
          <p className="rhint">
            {next
              ? <>Next rank: <span>{next.icon} {next.label}</span> — {next.min - n} more topic{next.min - n !== 1 ? 's' : ''}</>
              : <span>🏛️ Maximum rank achieved</span>}
          </p>
        </div>
        <div className="pstats">
          <span className="big">{n}</span>
          <span className="sm">completed</span>
        </div>
      </div>

      {n > 0 && (
        <div style={{ background: 'var(--bg2)', border: '.5px solid var(--br)', borderRadius: 'var(--rlg)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx2)', marginBottom: '4px' }}>Your citizen profile</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 400, marginBottom: '3px' }}>{prof.label}</p>
            <p style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.5 }}>{prof.desc}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '2px' }}>⚡ {dPts} pts</p>
            <p style={{ fontSize: '11px', color: 'var(--tx3)' }}>📚 {iPts} pts</p>
          </div>
        </div>
      )}

      <div className="sec-hdr"><h3>Explore topics</h3></div>
      <div className="tgrid">
        {TOPICS.map(t => {
          const done = completed.includes(t.id)
          const active = t.status === 'active'
          return (
            <button
              key={t.id}
              className={`tc${done ? ' done' : active ? '' : ' locked'}`}
              onClick={() => active && !done && dispatch({ type: 'CLICK_TOPIC', topic: t })}
            >
              <span className={`tpill ${done ? 'p-done' : active ? 'p-open' : 'p-soon'}`}>
                {done ? '✓ Done' : active ? 'Open' : 'Soon'}
              </span>
              <span className="ti">{t.icon}</span>
              <span className="tn">{t.name}</span>
              <span className="tm2">{done ? '✓ Completed' : t.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
