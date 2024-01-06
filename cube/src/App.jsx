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
          {name: 'U', keys:['KeyU']}, 
          {name:'Uprime', keys:['KeyI']},
          {name: 'F', keys:['KeyF']},
          {name: 'Fprime', keys:['KeyG']}, 
          {name:'R', keys:['KeyR']}, 
          {name:'Rprime', keys:['KeyT']}, 
          {name:'L', keys:['KeyL']}, 
          {name:'Lprime', keys:['KeyK']}, 
          {name:'B', keys:['KeyB']},
          {name:'Bprime', keys:['KeyN']},
          {name:'D', keys:['KeyD']},
          {name:'Dprime', keys:['KeyC']},
          {name:'Y', keys:['ArrowLeft']},
          {name:'X', keys:['ArrowUp']},
          {name:'Yprime', keys:['ArrowRight']},
          {name:'Xprime', keys:['ArrowDown']}
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
