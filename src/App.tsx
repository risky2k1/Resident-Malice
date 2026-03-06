import './App.css'
import { MapProvider } from './contexts/MapContext'
import { Map } from './components/Map'
import { Player } from './components/Player'
import { Zombies } from './components/Zombies'
import { usePlayerMovement } from './hooks/usePlayerMovement'

function App() {
  const { position, keys } = usePlayerMovement()

  return (
    <MapProvider>
      <Map center={position} />
      <Player keys={keys} />
      <Zombies playerPosition={position} />
    </MapProvider>
  )
}

export default App
