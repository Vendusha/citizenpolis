import { useApp } from '../../store/store'
import { getRank, getCitizenProfile } from '../../lib/engine'
import VennDiagram from '../ui/VennDiagram'

export default function ResultsScreen() {
  const { state, dispatch } = useApp()
  const { results, subtopic, completed, justRankedUp, dPts, iPts } = state
  if (!results || !subtopic) return null

  const vPct = Math.round(results.vSim / results.total * 100)
  const rank = getRank(completed.length)
  const maxD = subtopic.questions.length * 3
  const maxI = subtopic.questions.reduce((s, q) => s + (q.sources ? q.sources.length * 3 : 0), 0)
  const dPct = maxD > 0 ? Math.round(Math.min(100, dPts / maxD * 100)) : 0
  const iPct = maxI > 0 ? Math.round(Math.min(100, iPts / maxI * 100)) : 0
  const prof = getCitizenProfile(dPts, iPts)
  const topP = subtopic.personas[results.topPersonaIdx]

  return (
    <div className="screen rscreen">
      <p style={{ fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx2)', marginBottom: '.25rem' }}>
        {subtopic.icon} {subtopic.name} · Results
      </p>
      <h2>Where do you stand?</h2>
      <p className="rlegend">
        Your position (green dot) within the five archetypal perspectives. Brighter circles = more overlap with your answers.
      </p>

      {justRankedUp && (
        <div className="rankup">
          <span style={{ fontSize: '28px' }}>{rank.icon}</span>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>Rank up — you are now a {rank.label}</h4>
            <p style={{ fontSize: '13px', opacity: .85 }}>Complete more subtopics to keep advancing.</p>
          </div>
        </div>
      )}

      <div className="venn-wrap">
        <VennDiagram
          personas={subtopic.personas}
          ux={results.ux}
          uy={results.uy}
          sims={results.personaSims}
        />
      </div>

      <div className="sgrid">
        <div className="scard">
          <p className="sl">Closest persona</p>
          <p className="sv" style={{ fontSize: '18px', color: 'var(--tp)' }}>{topP.icon} {topP.name}</p>
          <p className="ss">{(results.personaSims[results.topPersonaIdx] * 100).toFixed(0)}% similar</p>
        </div>
        <div className="scard">
          <p className="sl">Very similar</p>
          <p className="sv" style={{ color: 'var(--tp)' }}>{results.vSim}</p>
          <p className="ss">{vPct}% of all</p>
        </div>
        <div className="scard">
          <p className="sl">Broadly similar</p>
          <p className="sv" style={{ color: 'var(--ad)' }}>{results.sSim}</p>
          <p className="ss">{Math.round(results.sSim / results.total * 100)}% of all</p>
        </div>
      </div>

      <div className="ibox">
        <strong>{vPct}% of respondents share at least 80% of your positions</strong> — regardless of how they would label themselves politically.
      </div>

      <div className="cscore">
        <h4>Your citizen profile this session</h4>
        <p className="ctype">{prof.label}</p>
        <p className="cdesc">{prof.desc}</p>
        <div className="sbars">
          <div className="sbi">
            <p className="sbi-l d">⚡ Decisive</p>
            <div className="sbi-t"><div className="sbi-f d" style={{ width: `${dPct}%` }} /></div>
            <p className="sbi-v d">{dPts} pts</p>
          </div>
          <div className="sbi">
            <p className="sbi-l i">📚 Informed</p>
            <div className="sbi-t"><div className="sbi-f i" style={{ width: `${iPct}%` }} /></div>
            <p className="sbi-v i">{iPts} pts</p>
          </div>
        </div>
      </div>

      <div className="pgrid">
        <div className="pcard shared">
          <p className="pl">Most shared position</p>
          <p className="pt">{subtopic.questions[results.mostShared.i].t}</p>
          <p className="pc">{results.mostShared.cnt} / {results.total} agree</p>
        </div>
        <div className="pcard dist">
          <p className="pl">Most distinctive position</p>
          <p className="pt">{subtopic.questions[results.mostDistinct.i].t}</p>
          <p className="pc">{results.mostDistinct.cnt} / {results.total} agree</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn-p" onClick={() => dispatch({ type: 'GO_HOME' })}>⌂ Back to topics</button>
        <button className="btn-g" onClick={() => dispatch({ type: 'GO_SUBTOPIC_SCREEN' })}>← Try other track</button>
        <button className="btn-g" onClick={() => dispatch({ type: 'RETAKE' })}>↺ Retake</button>
      </div>
    </div>
  )
}
