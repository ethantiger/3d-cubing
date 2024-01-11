import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls, Environment, ContactShadows } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs';
import './App.css'
import Cube from './Cube';
import Camera from './components/camera';
import Buttons from './components/buttons';

function App() {
  const [leftModel, setLeftModel] = useState(null)
  const [rightModel, setRightModel] = useState(null)
  const [camera, setCamera] = useState(false)

  const getModels = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('https://3d-cube-server.vercel.app/lefthand/model.json');
      setLeftModel(loadedModel);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model', error);
    }
    try {
      const loadedModel = await tf.loadLayersModel('https://3d-cube-server.vercel.app/righthand/model.json');
      setRightModel(loadedModel);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model', error);
    }
  }
  useEffect(() => {
    getModels()
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
          {name:'Y', keys:['ArrowLeft', 'KeyY']},
          {name:'X', keys:['ArrowUp', 'KeyX']},
          {name:'Yprime', keys:['ArrowRight', 'KeyZ']},
          {name:'Xprime', keys:['ArrowDown', 'KeyV']}
        ]}
      >
        <Canvas camera={{position:[5,5,5]}}>
          {window.location.hash === '#perf' && <Perf position="top-right"/>}
          <OrbitControls />
          <Environment files={'brown_photostudio_02_4k.hdr'}/>
          <ContactShadows position={[0,-5,0]} resolution={512} opacity={0.4} blur={3} frames={1}/>
          <Cube envMapIntensity={1}/>
        </Canvas>
      </KeyboardControls>
      <Buttons setCamera={setCamera}></Buttons>
      {camera && leftModel && rightModel && <Camera leftModel={leftModel} rightModel={rightModel}/>}
    </>
  )
}

export default App
