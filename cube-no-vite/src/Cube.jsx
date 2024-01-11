import *  as THREE from 'three'
THREE.ColorManagement.legacyMode = false
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls, useGLTF, Text } from '@react-three/drei'
import usePrediction from './stores/usePrediction'
const originalPosition = [
  [1,0,0],[-1,0,0],[0,0,-1],[1,0,-1],[-1,0,-1],
  [0,0,1],[1,0,1],[-1,0,1],[0,1,0],[1,1,0],
  [-1,1,0],[0,1,-1],[1,1,-1],[-1,1,-1],[0,1,1],
  [1,1,1],[-1,1,1],[0,-1,0],[1,-1,0],[-1,-1,0],
  [0,-1,-1],[1,-1,-1],[-1,-1,-1],[0,-1,1],[1,-1,1],[-1,-1,1]
]

export default function Cube() {
  const [press, setPress] = useState(true)
  const [rotationInProgress, setRotationInProgress] = useState(false);
  const [rotationAxis, setRotationAxis] = useState('')
  const [rotationDirection, setRotationDirection] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [lastPrediction, setLastPrediction] = useState('')
  const [sub, get] = useKeyboardControls()
  const three = useThree()

  const cube = useGLTF('cube.glb')
  let groupRef = useRef()

  const changeReset = usePrediction((state) => state.changeReset)
  const endShuffle = usePrediction((state) => state.endShuffle)
  
  let sceneIndex = 1
  if (window.location.hash === '#perf') sceneIndex = 2
  
  const pieces = [...cube.scene.children]
  // axis = {name: 'X', value: 1}
  const createGroup = (axis) => {
    if (axis.value === 'all') {
      pieces.forEach((piece) => groupRef.current.add(piece))
      return
    } 
    pieces.forEach((piece) => {
      Math.round(piece.position[axis.name]) === axis.value ? groupRef.current.add(piece) : null
    })
  }

  const clearGroup = (state) => {
    for (let i = groupRef.current.children.length - 1; i >= 0; i--) {
      const child = groupRef.current.children[i];
      groupRef.current.remove(child);
      state.scene.children[sceneIndex].add(child);
      pieces.push(child)
    }
  }

  const rotateGroup = (axis,direction) => {
    setRotationAxis(axis)
    setRotationDirection(direction)
    setRotation(0)
  }

  const resetCube = () => {
    const state = usePrediction.getState()
    if (!state.shuffle) {
      changeReset(false)
      clearGroup(three)
      three.scene.children[sceneIndex].children.forEach((child) => {
        child.rotation.set(0,0,0)
        child.position.set(...originalPosition[parseInt(child.name.slice(-2)) - 1])
      })
    }
  }

  const createRandomArray = (size, values) => {
    const randomArray = [];
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * values.length);
        randomArray.push(values[randomIndex]);
    }
    return randomArray;
  }

  const shuffleCube = () => {
    const moves = 20
    const axisArray = createRandomArray(moves,['x','y','z'])
    const axisValArray = createRandomArray(moves,[-1,0,1])
    const rotDirectionArray = createRandomArray(moves,[1,-1])
    let i = 0
    const interval = setInterval(() => {
      if (i < moves){
        handlePress(three,axisArray[i],axisValArray[i],rotDirectionArray[i])
        i++
      } else {
        clearInterval(interval)
        endShuffle()
      }
    },350)
    
  }

  const handlePress = (state,axis, axisVal, rotDirection) => {
    setPress(false)
    setRotationInProgress(true)
    clearGroup(state)
    createGroup({name: axis, value: axisVal})
    rotateGroup(axis, rotDirection)
    setTimeout(() => setPress(true), 200)
  }

  const axisMap = {
    'x': new THREE.Vector3(1,0,0),
    'y': new THREE.Vector3(0,1,0),
    'z': new THREE.Vector3(0,0,1),
  }
  const targetRotation = Math.PI /2
  useFrame((state,delta) => {
    if (!rotationInProgress) {
      const { U, Uprime, F,Fprime, R,Rprime, L,Lprime,B,Bprime, D,Dprime, Y, X, Yprime, Xprime } = get() 
      if (press) {
        if (U) handlePress(state,'y',1,-1)
        if (Uprime) handlePress(state, 'y',1,1)
        if (F) handlePress(state,'z',1,-1)
        if (Fprime) handlePress(state,'z',1,1)
        if (R) handlePress(state,'x',1,-1)
        if (Rprime) handlePress(state,'x',1,1)
        if (L) handlePress(state,'x',-1,1)
        if (Lprime) handlePress(state,'x',-1,-1)
        if (B) handlePress(state,'z',-1,1)
        if (Bprime) handlePress(state,'z',-1,-1)
        if (D) handlePress(state,'y',-1,1)
        if (Dprime) handlePress(state,'y',-1,-1)
        if (Y) handlePress(state,'y','all',-1)
        if (X) handlePress(state, 'x', 'all', -1)
        if (Yprime) handlePress(state, 'y', 'all', 1)
        if (Xprime) handlePress(state, 'x', 'all', 1)
      }
    } else {
      if (groupRef.current) {

        if (rotation < targetRotation) {
          let newRotation = rotation + delta * 5
          if (newRotation > targetRotation) {
            newRotation = targetRotation - rotation
            const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axisMap[rotationAxis],newRotation * rotationDirection); // Adjust rotation speed
            groupRef.current.children.forEach(child => {
              child.applyMatrix4(rotationMatrix);
            });
            setRotation(rotation + delta * 5)
          } else {           
            const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axisMap[rotationAxis],delta * 5 * rotationDirection); // Adjust rotation speed
            groupRef.current.children.forEach(child => {
              child.applyMatrix4(rotationMatrix);
            });
            setRotation(newRotation)
          }
        } else {
          setRotationInProgress(false)
          setRotation(0)
        }
      }
    }
  })

  useEffect(() => {
    const unsubPred = usePrediction.subscribe(
      (state) => state.pred,
      (value) => {
        if (value !== null && value !== 'r_repo_down' && value.length < 2) {
          setLastPrediction(value)
          const eventDown = new KeyboardEvent('keydown', {
            key: `Key${value}`,
          });
          const eventUp = new KeyboardEvent('keyup', {
            key: `Key${value}`,
          });
          
          window.dispatchEvent(eventDown);
          setTimeout(() => {
            window.dispatchEvent(eventUp);
          }, 100); 
        }
      }
    )
    const unsubReset = usePrediction.subscribe(
      (state) => state.reset,
      (value) => {
        if (value) resetCube()
      }
    )
    const unsubShuffle = usePrediction.subscribe(
      (state) => state.shuffle,
      (value) => {
        if (value) shuffleCube()
      }
    )
    return () => {
      unsubPred()
      unsubReset()
      unsubShuffle()
    }
  },[rotation])
  return (
    <>
      <primitive object={cube.scene}/>
      <group ref={groupRef} name="rotation-group" />
      <Text fontSize={5} position={[5,-5,-5]} rotation={[-Math.PI/2,0,Math.PI/4]} color="black">{lastPrediction}</Text>
    </>
  )
}
