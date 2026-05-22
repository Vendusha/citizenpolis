import { useApp } from '../store/store'
import { getRank } from '../lib/engine'

export default function Nav() {
  const { state, dispatch } = useApp()
  const rank = getRank(state.completed.length)

  return (
    <nav>
      <span className="nav-logo" onClick={() => dispatch({ type: 'GO_HOME' })}>
        Citizen<span>Polis</span>
      </span>
      <div className="nav-r">
        <span className="npill d">⚡ {state.dPts} decisive</span>
        <span className="npill i">📚 {state.iPts} informed</span>
        <span className="npill r">{rank.icon} {rank.label}</span>
      </div>
    </nav>
  )
}
