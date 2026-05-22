import type { Source } from '../../types'
import { PTS } from '../../data/constants'
import { useApp } from '../../store/store'

interface Props {
  sources: Source[]
  qi: number
}

export default function SourcePanel({ sources, qi }: Props) {
  const { state, dispatch } = useApp()
  const { readStatus } = state

  return (
    <div className="lm-panel">
      <div className="lm-hdr">
        <p><strong>Read before answering</strong> to earn informedness points. Answering without reading earns decisiveness points.</p>
      </div>
      {sources.map((src, si) => {
        const rs = readStatus[`${qi}_${si}`] ?? 0
        const label = src.type === 'paper' ? 'Research paper' : src.type === 'brief' ? 'Policy brief' : 'Blog post'
        return (
          <div className="src-card" key={si}>
            <div className="src-top">
              <span className={`stype ${src.type}`}>{label}</span>
              <span className="stitle">
                <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a>
              </span>
            </div>
            <p className="smeta">{src.year}</p>
            <span className={`stag ${src.stance}`}>{src.stanceLabel}</span>
            <p className="ssumm">{src.summary}</p>
            <div className="rs-row">
              <span style={{ fontSize: '12px', color: 'var(--tx3)', alignSelf: 'center', marginRight: '2px' }}>I have:</span>
              <button className={`rs-btn${rs === 1 ? ' r1' : ''}`}
                onClick={() => dispatch({ type: 'SET_RS', qi, si, level: 1 })}>
                👀 Peeked (+{PTS.peek}pt)
              </button>
              <button className={`rs-btn${rs === 2 ? ' r2' : ''}`}
                onClick={() => dispatch({ type: 'SET_RS', qi, si, level: 2 })}>
                📖 Read sections (+{PTS.sections}pt)
              </button>
              <button className={`rs-btn${rs === 3 ? ' r3' : ''}`}
                onClick={() => dispatch({ type: 'SET_RS', qi, si, level: 3 })}>
                ✅ Read fully (+{PTS.full}pt)
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
