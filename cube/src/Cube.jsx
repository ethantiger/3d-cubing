import *  as THREE from 'three'
THREE.ColorManagement.legacyMode = false
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import usePrediction from './stores/usePrediction'

export default function Cube() {
  const [press, setPress] = useState(true)
  const [sub, get] = useKeyboardControls()
  const three = useThree()
  const pred = usePrediction((state) => state.pred)

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

  const pieces = [corner1, corner2, corner3, corner4, corner5, corner6, corner7, corner8, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edgeA, edgeB, edgeC, center1, center2, center3, center4, center5, center6]
  // axis = {name: 'X', value: 1}
  const createGroup = (axis) => {
    pieces.forEach((piece) => {
      Math.round(piece.current.position[axis.name]) === axis.value ? groupRef.current.add(piece.current) : null
    })
  }

  const clearGroup = (state) => {
    for (let i = groupRef.current.children.length - 1; i >= 0; i--) {
      const child = groupRef.current.children[i];
      groupRef.current.remove(child);
      state.scene.add(child);
    }
  }

  const rotateGroup = (axis,direction) => {

    const axisMap = {
      'x': new THREE.Vector3(1,0,0),
      'y': new THREE.Vector3(0,1,0),
      'z': new THREE.Vector3(0,0,1)
    }
    if (groupRef.current) {
      const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axisMap[axis],Math.PI / 2 * direction); // Adjust rotation speed
      groupRef.current.children.forEach(child => {
        child.applyMatrix4(rotationMatrix);
      });
      // console.log([...three.scene.children])
    }
  }

  const printChildren = () => {
    const names = []
    groupRef.current.children.forEach((child) => names.push(child.name))
    // console.log([...names])
  }

  const handlePress = (state,axis, axisVal, rotDirection) => {
    setPress(false)
    clearGroup(state)
    createGroup({name: axis, value: axisVal})
    rotateGroup(axis, rotDirection)
    printChildren()
    // console.log(state.scene.children)
    setTimeout(() => setPress(true), 200)
  }
  
  useFrame((state,delta) => {
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
  })

  useEffect(() => {
    const unsubPred = usePrediction.subscribe(
      (state) => state.pred,
      (value) => {
        console.log(`Key${value}`)
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
      <group ref={groupRef}> </group>
    {/*****************  TOP LAYER **********************/}
      {/* T F R */}
      <mesh ref={corner1} position={[1,1,1]} name="TFR">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* T F */}
      <mesh ref={edge1} position={[0,1,1]} name="TF">
        <boxGeometry />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* T F L */}
      <mesh ref={corner2} position={[-1,1,1]} name="TFL">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* T R */}
      <mesh ref={edge2} position={[1,1,0]} name="TR">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-2" color="white" />
      </mesh>
    {/* T */}
      <mesh ref={center1} position={[0,1,0]} name="T">
        <boxGeometry />
        <meshBasicMaterial attach="material-2" color="white" />
      </mesh>
    {/* T L */}
      <mesh ref={edge3} position={[-1,1,0]} name="TL">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-2" color="white" />
      </mesh>
    {/* T R B*/}
      <mesh ref={corner3} position={[1,1,-1]} name="TRB">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* T B */}
      <mesh ref={edge4} position={[0,1,-1]} name="TB">
        <boxGeometry />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* T L B */}
      <mesh ref={corner4} position={[-1,1,-1]} name="TLB">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    

    {/*****************  MIDDLE LAYER **********************/}

    {/* F R */}
    <mesh ref={edge5} position={[1,0,1]} name="FR">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F */}
      <mesh ref={center2} position={[0,0,1]} name="F">
        <boxGeometry />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F L */}
      <mesh ref={edge6} position={[-1,0,1]} name="FL">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* R */}
      <mesh ref={center3} position={[1,0,0]} name="R">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
      </mesh>
    {/* L */}
      <mesh ref={center4} position={[-1,0,0]} name="L">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
      </mesh>
    {/* R B */}
      <mesh ref={edge7} position={[1,0,-1]} name="RB">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* B */}
      <mesh ref={center5} position={[0,0,-1]} name="B">
        <boxGeometry />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* L B */}
      <mesh ref={edge8} position={[-1,0,-1]} name="LB">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>


      {/*****************  BOTTOM LAYER **********************/}

    {/* F R Bot*/}
      <mesh ref={corner5} position={[1,-1,1]} name="FRBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F Bot*/}
      <mesh ref={edge9} position={[0,-1,1]} name="FBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F L Bot*/}
      <mesh ref={corner6} position={[-1,-1,1]} name="FLBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* R Bot*/}
      <mesh ref={edgeA} position={[1,-1,0]} name="RBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-3" color="yellow" />
      </mesh>
    {/* Bot */}
      <mesh ref={center6} position={[0,-1,0]} name="Bot">
        <boxGeometry />
        <meshBasicMaterial attach="material-3" color="yellow" />
      </mesh>
    {/* L Bot*/}
      <mesh ref={edgeB} position={[-1,-1,0]} name="LBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-3" color="yellow" />
      </mesh>
    {/* R B Bot*/}
      <mesh ref={corner7} position={[1,-1,-1]} name="RBBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* B Bot*/}
      <mesh ref={edgeC} position={[0,-1,-1]} name="BBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* L B Bot*/}
      <mesh ref={corner8} position={[-1,-1,-1]} name="LBBot">
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    </>
  )
}
