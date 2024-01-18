import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls, Environment, ContactShadows, Loader, Text } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useEffect, useState, Suspense } from 'react'
import * as tf from '@tensorflow/tfjs';
import './App.css'
import Cube from './Cube';
import AnimatedCamera from './AnimatedCamera';
import Tutorial from './Tutorial';
import Camera from './components/camera';
import Buttons from './components/buttons';
import { Leva, useControls } from 'leva';

function App() {
  const [leftModel, setLeftModel] = useState(null)
  const [rightModel, setRightModel] = useState(null)
  const [camera, setCamera] = useState(false)
  const [cameraPosition, setCameraPosition] = useState([8,8,8])
  const [cameraRotation, setCameraRotation] = useState([-0.63,0.78,0])

  const controls = useControls({
    rotationX: {
      value: -0.63,
      step:0.01
    },
    rotationY: {
      value: 0.78,
      step:0.01
    },
    rotationZ: {
      value: 0,
      step:0.01
    },
    positionX: {
      value: 8,
      step:0.01
    },
    positionY: {
      value: 8,
      step:0.01
    },
    positionZ: {
      value: 8,
      step:0.01
    }
  })

  const getModels = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('http://localhost:3001/lefthand/model.json');
      setLeftModel(loadedModel);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model', error);
    }
    try {
      const loadedModel = await tf.loadLayersModel('http://localhost:3001/righthand/model.json');
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
        <Canvas>
          <AnimatedCamera position={cameraPosition} rotation={cameraRotation}/>
          {/* <AnimatedCamera position={[controls.positionX, controls.positionY, controls.positionZ]} rotation={[controls.rotationX, controls.rotationY, controls.rotationZ]}/> */}
          {window.location.hash === '#debug' && <Perf position="bottom-left"/>}
          {/* <OrbitControls /> */}
          <Suspense fallback={null}>
            <Tutorial />
            {/* <Text fontSize={15} textAlign="center" color="black" maxWidth={2} position={[-8,-5,-8]} rotation={[-Math.PI/2,0,Math.PI/4]}>The Cube</Text> */}
            <Environment files={'brown_photostudio_02_4k.hdr'}/>
            <ContactShadows position={[0,-5,0]} resolution={512} opacity={0.4} blur={3} frames={1}/>
            <Cube envMapIntensity={1}/>
          </Suspense>
        </Canvas>
        <Leva/>
        <Loader />
      </KeyboardControls>
      <Buttons setCamera={setCamera} setCameraPosition={setCameraPosition} setCameraRotation={setCameraRotation}></Buttons>
      {camera && leftModel && rightModel && <Camera leftModel={leftModel} rightModel={rightModel}/>}
    </>
  )
}

export default App
