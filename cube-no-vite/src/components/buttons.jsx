import { useState } from 'react'
import './buttons.css'
import usePrediction from '../stores/usePrediction'

export default function Buttons({setCamera, setCameraPosition, setCameraRotation}) {
  const [instructions, setInstructions] = useState(false)
  const changeReset = usePrediction((state) => state.changeReset)
  const startShuffle = usePrediction((state) => state.startShuffle)

  const handleInfoClick = () => {
    setCameraPosition((cameraPosition) => {
      return [cameraPosition[0]+1, cameraPosition[1]+1, cameraPosition[2] + 1]
    })
    setCameraRotation((cameraRotation) => {
      return [cameraRotation[0], cameraRotation[1], cameraRotation[2]]
    })

    // setInstructions(!instructions)
  }

  const handleCameraClick = () => {
    setCamera((camera) => !camera)
  }
  return <>
    {instructions && <img src="instructions.jpeg" alt="Image with instructions" className="instructions"/>}
    <button className="info-button" type="button" onClick={handleInfoClick}>
      <img src="info.svg" alt="Info Icon" width="24" height="24" />
    </button>
    <button className="random-button" type="button" onClick={startShuffle}>
        <img src="random.svg" alt="Random Icon" width="35" height="35" />
    </button>
    <button className="reset-button" type="button" onClick={changeReset}>
        <img src="reset.svg" alt="Reset Icon" width="24" height="24" />
    </button>
    <button className="camera-button" type="button" onClick={handleCameraClick}>
        <img src="camera.svg" alt="Camera Icon" width="24" height="24" />
    </button>
  </>
}