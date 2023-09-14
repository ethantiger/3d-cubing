import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import './App.css'
import Cube from './cube'

function App() {

  return (
    <>
      <Canvas camera={{position:[5,5,5]}}>
        <OrbitControls />
        <Cube />
        {/* <directionalLight position={[3,3,3]} intensity={0.5}/>
        <ambientLight intensity={0.3}/> */}
      </Canvas>
    </>
  )
}

export default App
