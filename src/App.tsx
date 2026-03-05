import './App.css'
import { Map } from './components/Map'
import { Player } from './components/Player'
import { usePlayerMovement } from './hooks/usePlayerMovement'

function App() {
  const position = usePlayerMovement()

  return (
    <>
      <Map center={position} />
      <Player />
    </>
  )
}

export default App
