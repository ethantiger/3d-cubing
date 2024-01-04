import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls, Environment, ContactShadows } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs';
import './App.css'
import Cube from './Cube';
import Camera from './components/camera';

function App() {
  const [model, setModel] = useState(null)
  const getModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('http://localhost:3000/model.json');
      setModel(loadedModel);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model', error);
    }
  }
  useEffect(() => {
    getModel()
  },[])
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
          <Perf position="top-right"/>
          <OrbitControls />
          <Environment files={'brown_photostudio_02_4k.hdr'}/>
          <ContactShadows position={[0,-5,0]} resolution={512} opacity={0.4} blur={3} frames={1}/>
          <Cube envMapIntensity={1}/>
        </Canvas>
      </KeyboardControls>
      {/* {model && <Camera model={model}/>} */}
    </>
  )
}

export default App
