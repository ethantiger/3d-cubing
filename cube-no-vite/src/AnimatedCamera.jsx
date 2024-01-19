import { PerspectiveCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useRef, useEffect } from 'react'
import gsap from 'gsap'


export default function AnimatedCamera({position, rotation}) {
  const cameraRef = useRef()

  useEffect(() => {
    cameraRef.current.rotation.reorder('YXZ')
  },[])

  useEffect(() => {
    gsap.to(cameraRef.current.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 1,
      ease: "power3.out",
    })
    gsap.to(cameraRef.current.rotation, {
      x: rotation[0],
      y: rotation[1],
      z: rotation[2],
      duration: 1,
      ease: "power3.out",
    })
  },[position, rotation])

  return <PerspectiveCamera makeDefault ref={cameraRef} position={[20,20,20]} rotation={[2.3,2.54,3.7]}/>
}