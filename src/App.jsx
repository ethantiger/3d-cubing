import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import './App.css'
import Cube from './cube'

function App() {

  return (
    <>
      <Canvas>
        <OrbitControls />
        <Cube />
      </Canvas>
    </>
  )
}

export default App
