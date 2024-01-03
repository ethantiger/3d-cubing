import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

const model = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: 'mediapipe', // or 'tfjs',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
  modelType: 'full'
}
const detector = await handPoseDetection.createDetector(model, detectorConfig);


const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
}; 

export default function Camera() {
  const canvasRef = useRef()
  const videoRef = useRef()
  const wrapperRef = useRef()
  const [ctx, setCtx] = useState(null)

  const setupCamera = async (videoWidth, videoHeight) => {
    setCtx(canvasRef.current.getContext('2d'))
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }
    const stream = await navigator.mediaDevices.getUserMedia({video: {width: videoWidth, height:videoHeight, aspectRatio: {ideal: 16/9}}})
    videoRef.current.srcObject = stream
    
    canvasRef.current.width = videoWidth
    canvasRef.current.height = videoHeight
    wrapperRef.current.style = `width: ${videoWidth}px; height: ${videoHeight}px; position:absolute; top:0px; left:0px;`
    if (ctx) {
      ctx.translate(videoWidth, 0);
      ctx.scale(-1, 1);
    }
  }

  function drawPath(points, closePath) {
    const region = new Path2D();
    region.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      region.lineTo(point.x, point.y);
    }
  
    if (closePath) {
      region.closePath();
    }
    ctx.stroke(region);
  }
  
  function drawPoint(y, x, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
  function drawKeypoints(keypoints, handedness) {
    const keypointsArray = keypoints;
    ctx.fillStyle = handedness === 'Left' ? 'Red' : 'Blue';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 2;
  
    for (let i = 0; i < keypointsArray.length; i++) {
      const y = keypointsArray[i].x;
      const x = keypointsArray[i].y;
      drawPoint(x - 2, y - 2, 3);
    }
  
    const fingers = Object.keys(fingerLookupIndices);
    for (let i = 0; i < fingers.length; i++) {
      const finger = fingers[i];
      const points = fingerLookupIndices[finger].map(idx => keypoints[idx]);
      drawPath(points, false);
    }
  }
  useEffect(() => {
    setupCamera(500,360)
    if (ctx) {
      onFrame()
    }
  }, [ctx])

  async function onFrame() {
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    // Send image data to handpose model
    const hands = await detector.estimateHands(imageData,{flipHorizontal: true});
    if (hands.length >0) {
      // console.log(hands[0].keypoints[0].x/360,hands[0].keypoints[0].y/180)
    }
    for (let i =0; i < hands.length; i++) {
      if (hands[i].keypoints != null) {
        drawKeypoints(hands[i].keypoints, hands[i].handedness)
      }
    }
    requestAnimationFrame(onFrame)
  }

  return (
    <div id="canvas-wrapper" ref={wrapperRef}>
      <canvas id="output" ref={canvasRef}></canvas>
      <video id="video"ref={videoRef} autoPlay style={{visibility:"hidden", width:"auto", height:"auto"}}></video>
    </div>
  )
}