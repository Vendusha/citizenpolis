import { useApp } from './store/store'
import Nav from './components/Nav'
import HomeScreen from './components/screens/HomeScreen'
import SubtopicScreen from './components/screens/SubtopicScreen'
import QuestionScreen from './components/screens/QuestionScreen'
import ResultsScreen from './components/screens/ResultsScreen'

export default function App() {
  const { state } = useApp()

  const screen = (() => {
    switch (state.screen) {
      case 'home':     return <HomeScreen />
      case 'subtopic': return state.topic ? <SubtopicScreen /> : <HomeScreen />
      case 'question': return state.subtopic ? <QuestionScreen /> : <HomeScreen />
      case 'results':  return state.results && state.subtopic ? <ResultsScreen /> : <HomeScreen />
    }
  })()

  return (
    <>
      <Nav />
      <div id="app">{screen}</div>
    </>
  )
}
