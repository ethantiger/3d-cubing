import { useState } from 'react'
import './buttons.css'
import usePrediction from '../stores/usePrediction'

export default function Buttons({setCamera, setCameraPosition, setCameraRotation}) {
  const [tutorial, setTutorial] = useState(false)
  const [tutorialState, setTutorialState] = useState(-1)
  const changeReset = usePrediction((state) => state.changeReset)
  const startShuffle = usePrediction((state) => state.startShuffle)

  const handleInfoClick = () => {
    setTutorialState(0)
    if (!tutorial) {
      setCameraPosition((cameraPosition) => {
        return [30, cameraPosition[1], cameraPosition[2]]
      })
      setCameraRotation((cameraRotation) => {
        return [cameraRotation[0], 0, cameraRotation[2]]
      })
    } else {
      setCameraPosition((cameraPosition) => {
        return [8, cameraPosition[1], cameraPosition[2]]
      })
      setCameraRotation((cameraRotation) => {
        return [cameraRotation[0], 0.78, cameraRotation[2]]
      })
    }
    setTutorial(!tutorial)
  }

  const handleCameraClick = () => {
    setCamera((camera) => !camera)
  }

  const handleNext = () => {
    if (tutorialState !== 13) {
      setCameraPosition((cameraPosition) => {
        return [cameraPosition[0] + 30, cameraPosition[1], cameraPosition[2]]
      })
      setTutorialState((tutorialState) => tutorialState += 1)
    }
  }

  return <>
    <button className="info-button" onClick={handleInfoClick} style={{backgroundColor:tutorial ? "#FF7F7F":"White"}}>
      {tutorial ? <img src="close.svg" alt="Info Icon" width="24" height="24" />:<img src="info.svg" alt="Info Icon" width="24" height="24" />}
    </button>
    {tutorial && <button className="next-button" onClick={handleNext}><img src="next.svg" alt="Info Icon" width="24" height="24" /></button>}
    <button className="random-button" onClick={startShuffle}>
        <img src="random.svg" alt="Random Icon" width="35" height="35" />
    </button>
    <button className="reset-button" onClick={changeReset}>
        <img src="reset.svg" alt="Reset Icon" width="24" height="24" />
    </button>
    <button className="camera-button" onClick={handleCameraClick}>
        <img src="camera.svg" alt="Camera Icon" width="24" height="24" />
    </button>
  </>
}