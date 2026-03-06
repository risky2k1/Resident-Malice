import './App.css'
import { MapProvider } from './contexts/MapContext'
import { Game } from './components/Game'

function App() {
  return (
    <MapProvider>
      <Game />
    </MapProvider>
  )
}

export default App
