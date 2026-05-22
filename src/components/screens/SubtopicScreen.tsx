import { useApp } from '../../store/store'

export default function SubtopicScreen() {
  const { state, dispatch } = useApp()
  const { topic, completed } = state
  if (!topic) return null

  return (
    <div className="screen subtopic-screen">
      <p style={{ fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx2)', marginBottom: '.3rem' }}>
        {topic.icon} {topic.name}
      </p>
      <h2>Choose a track</h2>
      <p>Each track focuses on a different dimension of the topic. Complete both to get the full picture.</p>
      <div className="sub-grid">
        {topic.subtopics?.map(sub => {
          const done = completed.includes(sub.id)
          return (
            <button
              key={sub.id}
              className={`sub-card${done ? ' done' : ''}`}
              onClick={() => dispatch({ type: 'START_SUBTOPIC', topic, subtopic: sub })}
            >
              {done && (
                <span style={{ float: 'right', fontSize: '11px', background: 'var(--tl)', color: 'var(--tp)', padding: '2px 8px', borderRadius: '20px', border: '.5px solid var(--tm)' }}>
                  ✓ Done
                </span>
              )}
              <p className="sc-icon">{sub.icon}</p>
              <p className="sc-name">{sub.name}</p>
              <p className="sc-desc">{sub.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
