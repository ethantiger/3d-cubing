import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'

import './App.css'
import Cube from './cube'

function App() {

  return (
    <>
      <KeyboardControls
        map={[
          {name: 'U', keys:['ArrowUp','KeyU']}, 
          {name: 'F', keys:['KeyF']}, 
          {name:'R', keys:['KeyR']}, 
          {name:'L', keys:['KeyL']}, 
          {name:'B', keys:['KeyB']} 
        ]}
      >
        <Canvas camera={{position:[5,5,5]}}>
          <OrbitControls />
          <Cube />
          {/* <directionalLight position={[3,3,3]} intensity={0.5}/>
          <ambientLight intensity={0.3}/> */}
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default App
