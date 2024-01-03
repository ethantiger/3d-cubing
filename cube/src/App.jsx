import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs';
import './App.css'
import Cube from './cube'
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
          <OrbitControls />
          <Cube />
        </Canvas>
      </KeyboardControls>
      {model && <Camera model={model}/>}
    </>
  )
}

export default App
