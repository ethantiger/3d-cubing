import './buttons.css'
import usePrediction from '../stores/usePrediction'

export default function Buttons({setCamera}) {
  const changeReset = usePrediction((state) => state.changeReset)
  const startShuffle = usePrediction((state) => state.startShuffle)
  const handleCameraClick = () => {
    setCamera((camera) => !camera)
  }
  return <>
    {/* <button className="info-button" type="button" >
      <img src="info.svg" alt="Info Icon" width="24" height="24" />
    </button> */}
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