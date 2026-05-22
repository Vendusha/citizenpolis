import { useApp } from '../../store/store'
import { PTS, OPTIONS } from '../../data/constants'
import { VISIONS } from '../../data/visions'
import SourcePanel from '../ui/SourcePanel'

export default function QuestionScreen() {
  const { state, dispatch } = useApp()
  const { subtopic, qi, selected, lmOpen, readStatus, dPts, iPts, topic } = state
  if (!subtopic) return null

  const q = subtopic.questions[qi]
  const pct = Math.round(qi / subtopic.questions.length * 100)
  const isOpen = lmOpen[qi] ?? false
  const hasSrc = q.sources != null && q.sources.length > 0
  const isVision = q.type === 'vision_choice'

  const infoForQ = hasSrc
    ? q.sources.reduce((s, _, si) => {
        const rs = readStatus[`${qi}_${si}`] ?? 0
        return s + (rs === 1 ? PTS.peek : rs === 2 ? PTS.sections : rs === 3 ? PTS.full : 0)
      }, 0)
    : 0

  return (
    <div className="screen qscreen">
      <div className="qhead">
        <button className="btn-back-home" onClick={() => dispatch({ type: 'GO_HOME' })}>⌂ Home</button>
        {topic && (
          <button className="btn-back-home" onClick={() => dispatch({ type: 'GO_SUBTOPIC_SCREEN' })}>← Tracks</button>
        )}
        <div className="prog-track">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="prog-num">{qi + 1} / {subtopic.questions.length}</span>
      </div>

      <div className="sco-bar">
        <div className="sco-box d">
          <p className="sbl">⚡ Decisive</p>
          <p className="sbv">{dPts}</p>
          <p className="sbs">pts from speed</p>
        </div>
        <div className="sco-box i">
          <p className="sbl">📚 Informed</p>
          <p className="sbv">
            {iPts}
            {infoForQ > 0 && <span style={{ fontSize: '14px', opacity: .7 }}> +{infoForQ}</span>}
          </p>
          <p className="sbs">pts from reading</p>
        </div>
      </div>

      <p className="qtag">{subtopic.icon} {subtopic.name} · {q.tag}</p>
      <p className="qtext">{q.t}</p>
      <div className="qctx">{q.c}</div>

      {hasSrc && (
        <button
          className={`lm-toggle${isOpen ? ' open' : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_LM', qi })}
        >
          📚 {q.sources.length} source{q.sources.length !== 1 ? 's' : ''} on this question
          <span className="lm-badge">{q.sources.length} reading{q.sources.length !== 1 ? 's' : ''}</span>
          <span className="lm-pts">Up to {q.sources.length * PTS.full} pts</span>
          <span className="lm-arr">▼</span>
        </button>
      )}

      {hasSrc && isOpen && <SourcePanel sources={q.sources} qi={qi} />}

      {isVision ? (
        <div className="vision-grid">
          {VISIONS.map(v => (
            <button
              key={v.id}
              className={`vis-btn${selected === v.id ? ' sel' : ''}`}
              onClick={() => dispatch({ type: 'SELECT_OPT', value: v.id })}
            >
              <p className="vico">{v.icon}</p>
              <p className="vnum">Vision {v.id}</p>
              <p className="vname">{v.name}</p>
              <p className="vkeys">{v.keys}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="opts">
          {OPTIONS.map(o => (
            <button
              key={o.v}
              className={`opt-btn${selected === o.v ? ' sel' : ''}`}
              onClick={() => dispatch({ type: 'SELECT_OPT', value: o.v })}
            >
              <span className="rdot" />
              {o.l}
            </button>
          ))}
        </div>
      )}

      <div className="nav-row">
        <button className="btn-g" onClick={() => dispatch({ type: 'GO_PREV' })} disabled={qi === 0}>
          ← Back
        </button>
        <button className="btn-p" onClick={() => dispatch({ type: 'GO_NEXT' })} disabled={selected === null}>
          {qi === subtopic.questions.length - 1 ? 'See your results →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
