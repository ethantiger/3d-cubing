export default function Cube() {
  return (
    // material 0 = right
    // material 1 = left
    // material 2 = top
    // material 3 = bottom
    // material 4 = front
    // material 5 = back
    <>
    {/*****************  TOP LAYER **********************/}
    {/* T F R */}
      <mesh position={[1,1,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* T F */}
      <mesh position={[0,1,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* T F L */}
      <mesh position={[-1,1,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* T R */}
      <mesh position={[1,1,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-2" color="white" />
      </mesh>
    {/* T */}
      <mesh position={[0,1,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-2" color="white" />
      </mesh>
    {/* T L */}
      <mesh position={[-1,1,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-2" color="white" />
      </mesh>
    {/* T R B*/}
      <mesh position={[1,1,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* T B */}
      <mesh position={[0,1,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* T L B */}
      <mesh position={[-1,1,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-2" color="white" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    

    {/*****************  MIDDLE LAYER **********************/}

    {/* F R */}
    <mesh position={[1,0,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F */}
      <mesh position={[0,0,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F L */}
      <mesh position={[-1,0,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* R */}
      <mesh position={[1,0,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
      </mesh>
    {/* L */}
      <mesh position={[-1,0,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
      </mesh>
    {/* R B */}
      <mesh position={[1,0,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* B */}
      <mesh position={[0,0,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* L B */}
      <mesh position={[-1,0,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>


      {/*****************  BOTTOM LAYER **********************/}

    {/* F R Bot*/}
      <mesh position={[1,-1,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F Bot*/}
      <mesh position={[0,-1,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* F L Bot*/}
      <mesh position={[-1,-1,1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-4" color="blue" />
      </mesh>
    {/* R Bot*/}
      <mesh position={[1,-1,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-3" color="yellow" />
      </mesh>
    {/* Bot */}
      <mesh position={[0,-1,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-3" color="yellow" />
      </mesh>
    {/* L Bot*/}
      <mesh position={[-1,-1,0]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-3" color="yellow" />
      </mesh>
    {/* R B Bot*/}
      <mesh position={[1,-1,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-0" color="orange" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* B Bot*/}
      <mesh position={[0,-1,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    {/* L B Bot*/}
      <mesh position={[-1,-1,-1]}>
        <boxGeometry />
        <meshBasicMaterial attach="material-1" color="red" />
        <meshBasicMaterial attach="material-3" color="yellow" />
        <meshBasicMaterial attach="material-5" color="green" />
      </mesh>
    </>
  )
}
