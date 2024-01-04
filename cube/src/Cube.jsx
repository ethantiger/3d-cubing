import *  as THREE from 'three'
THREE.ColorManagement.legacyMode = false
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls, useGLTF } from '@react-three/drei'
import usePrediction from './stores/usePrediction'

export default function Cube() {
  const [press, setPress] = useState(true)
  const [sub, get] = useKeyboardControls()
  const three = useThree()
  const [rotationInProgress, setRotationInProgress] = useState(false);
  const [rotationAxis, setRotationAxis] = useState('')
  const [rotationDirection, setRotationDirection] = useState(1)
  const [rotation, setRotation] = useState(0)
  
  const cube = useGLTF('cube.glb')
  // cube.scene.children.forEach((child) => three.scene.add(child))
  // console.log(cube)
  let groupRef = useRef()

  const corner1 = useRef()
  const corner2 = useRef()
  const corner3 = useRef()
  const corner4 = useRef()
  const corner5 = useRef()
  const corner6 = useRef()
  const corner7 = useRef()
  const corner8 = useRef()

  const edge1 = useRef()
  const edge2 = useRef()
  const edge3 = useRef()
  const edge4 = useRef()
  const edge5 = useRef()
  const edge6 = useRef()
  const edge7 = useRef()
  const edge8 = useRef()
  const edge9 = useRef()
  const edgeA = useRef()
  const edgeB = useRef()
  const edgeC = useRef()

  const center1 = useRef()
  const center2 = useRef()
  const center3 = useRef()
  const center4 = useRef()
  const center5 = useRef()
  const center6 = useRef()

  // const pieces = [corner1, corner2, corner3, corner4, corner5, corner6, corner7, corner8, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edgeA, edgeB, edgeC, center1, center2, center3, center4, center5, center6]
  const pieces = [...cube.scene.children]
  // axis = {name: 'X', value: 1}
  const createGroup = (axis) => {
    pieces.forEach((piece) => {
      Math.round(piece.position[axis.name]) === axis.value ? groupRef.current.add(piece) : null
    })
  }

  const clearGroup = (state) => {
    for (let i = groupRef.current.children.length - 1; i >= 0; i--) {
      const child = groupRef.current.children[i];
      groupRef.current.remove(child);
      state.scene.children[2].add(child);
      pieces.push(child)
    }
  }

  const rotateGroup = (axis,direction) => {
    setRotationAxis(axis)
    setRotationDirection(direction)
    setRotation(0)
  }

  const printChildren = () => {
    const names = []
    groupRef.current.children.forEach((child) => names.push(child.name))
    // console.log([...names])
  }

  const handlePress = (state,axis, axisVal, rotDirection) => {
    setPress(false)
    setRotationInProgress(true)
    clearGroup(state)
    createGroup({name: axis, value: axisVal})
    rotateGroup(axis, rotDirection)
    // console.log(cube.scene.children)
    setTimeout(() => setPress(true), 200)
  }
  
  const axisMap = {
    'x': new THREE.Vector3(1,0,0),
    'y': new THREE.Vector3(0,1,0),
    'z': new THREE.Vector3(0,0,1)
  }
  const targetRotation = Math.PI /2
  useFrame((state,delta) => {
    if (!rotationInProgress) {
      const { U, F, R, L,B } = get() 
      if (press) {
        if (U) {
          handlePress(state,'y',1,-1)
        }
        if (F) {
          handlePress(state,'z',1,-1)
        }
        if (R) {
          handlePress(state,'x',1,-1)
        }
        if (L) {
          handlePress(state,'x',-1,1)
        }
        if (B) {
          handlePress(state,'z',-1,1)
        }
      }
    } else {
      if (groupRef.current) {

        if (rotation < targetRotation) {
          let newRotation = rotation + delta * 5
          // console.log(newRotation, rotation, targetRotation - rotation)
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
        // console.log(`Key${value}`)
        if (value !== null || value !== '2_hand_repo_up' || value !== '2_hand_repo_down') {
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
    return () => {
      unsubPred()
    }
  },[])
  return (
    // material 0 = right
    // material 1 = left
    // material 2 = top
    // material 3 = bottom
    // material 4 = front
    // material 5 = back
    <>
      <primitive object={cube.scene}/>
      <group ref={groupRef}> </group>
    </>
  )
}
