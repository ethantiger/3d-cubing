import { useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Fragment } from 'react'
import * as THREE from 'three'
export default function Tutorial() {
  const tutorialArray = ["F","R","U","Y","X","RRepoDown","RRepoUp","L","B","D","Y`","X`","LRepoDown","LRepoUp"]
  const descriptions = [
    "Turns the front face clockwise", 
    "Turns the right face clockwise", 
    "Turns the top face clockwise", 
    "Vertically rotates the cube clockwise", 
    "Horizontally rotates the cube clockwise", 
    "Repositions right hand in sideways position (for sideways gesture such as U)", 
    "Repositions righthand to upright position",
    "Turns the left face clockwise",
    "Turns the back face clockwise",
    "Turns the bottom face clockwise",
    "Vertically rotates the cube counter clockwise",
    "Horizontally rotates the cube counter clockwise",
    "Repositions left hand in sideways position (for sideways gesture such as D)", 
    "Repositions left hand to upright position",
  ]
  const keyboardControlArray = ["F", "R", "U", "Left Arrow", "Up Arrow","NA","NA","L","B","D","Right Arrow","Down Arrow","NA","NA"]
  const tutorialSize = [18,25,18,18,18,12,12,20,18,18,18,18,12,12]
  const texturesArray = []
  tutorialArray.forEach((control) => {
    texturesArray.push(useLoader(THREE.TextureLoader, `${control}.jpeg`))
  })

  return <group>
    {tutorialArray.map((control, i) => {
      return <Fragment key={i}>
      <Text position={[(i+1)*30,-5,-20]} rotation={[-Math.PI/4,0,0]} color="black" fontSize={5}>{control}</Text>
      <Text position={[(i+1)*30,-5,-4]} rotation={[-Math.PI/4,0,0]} color="black" fontSize={0.8}>{descriptions[i]}</Text>
      <Text position={[(i+1)*30,-5,-2.5]} rotation={[-Math.PI/4,0,0]} color="black" fontSize={0.5}>KeyBind: {keyboardControlArray[i]}</Text>
      <mesh position={[(i+1)*30,-5,-10]} rotation={[-Math.PI/4,0,0]}>
        <planeBufferGeometry attach="geometry" args={[tutorialSize[i],5]} />
        <meshBasicMaterial attach="material" map={texturesArray[i]} />
      </mesh>
      </Fragment>
    })}
  </group>
}