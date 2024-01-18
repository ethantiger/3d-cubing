import gsap from 'gsap'
import { useEffect } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
export default function Tutorial() {
  const texture = useLoader(THREE.TextureLoader, 'ropen.jpeg')

  return <>
    <mesh>
      <planeBufferGeometry attach="geometry" args={[5,5]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  </>
}