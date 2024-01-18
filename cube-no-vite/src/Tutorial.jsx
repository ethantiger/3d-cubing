import { useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Fragment } from 'react'
import * as THREE from 'three'
export default function Tutorial() {
  const tutorialArray = ["F","R","U","Y","X","RRepoDown","RRepoUp","L","B","D","Y`","X`","LRepoDown","LRepoUp"]
  const texturesArray = []
  tutorialArray.forEach((control) => {
    texturesArray.push(useLoader(THREE.TextureLoader, `${control}.jpeg`))
  })

  return <group>
    {tutorialArray.map((control, i) => {
      return <Fragment key={i}>
      <Text position={[(i+1)*30,-5,-20]} rotation={[-Math.PI/4,0,0]} color="black" fontSize={5}>{control}</Text>
      <mesh position={[(i+1)*30,-5,-10]} rotation={[-Math.PI/4,0,0]}>
        <planeBufferGeometry attach="geometry" args={[18,5]} />
        <meshBasicMaterial attach="material" map={texturesArray[i]} />
      </mesh>
      </Fragment>
    })}
  </group>
}