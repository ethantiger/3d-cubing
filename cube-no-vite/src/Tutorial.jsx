import { useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
export default function Tutorial() {
  const texture = useLoader(THREE.TextureLoader, 'f.jpeg')

  return <group>

    <Text position={[30,-5,-20]} rotation={[-Math.PI/4,0,0]} color="black" fontSize={5}>F</Text>
    <mesh position={[30,-5,-10]} rotation={[-Math.PI/4,0,0]}>
      <planeBufferGeometry attach="geometry" args={[18,5]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  </group>
}