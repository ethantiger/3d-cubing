import { useRef, useEffect, useState } from 'react'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs';
import * as mpHands from '@mediapipe/hands'
import usePrediction from '../stores/usePrediction';

const handModel = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: 'mediapipe', // or 'tfjs',
  solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`,
  modelType: 'full'
}
const detector = await handPoseDetection.createDetector(handModel, detectorConfig);


const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
}; 

const videoWidth = 500
const videoHeight = 360

export default function Camera({leftModel, rightModel}) {
  const canvasRef = useRef()
  const videoRef = useRef()
  const wrapperRef = useRef()
  const requestID = useRef()
  const [ctx, setCtx] = useState(null)
  const updatePred = usePrediction((state) => state.updatePred)

 
  const setupCamera = async (videoWidth, videoHeight) => {
    setCtx(canvasRef.current.getContext('2d', {willReadFrequently: true}))
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
    // setupDetector()
    setupCamera(videoWidth,videoHeight)
    if (ctx) {
      requestID.current = requestAnimationFrame(onFrame)
    }
    return () => {
      cancelAnimationFrame(requestID.current)
    }
  }, [ctx])


  let sequenceR = []
  let  sequenceL = []
  let sequenceMovementR = [false]
  let sequenceMovementL = [false]
  let predictionsR = []
  let predictionsL = []
  let keypoints;
  let wasGestureR = false;
  let wasGestureL = false
  const classLabelsR = ['F','U','R','X','Y','r_repo_down','r_repo_up','r_onscreen'];
  const classLabelsL = ['L','B','D','V','Z','l_repo_down','l_repo_up','l_onscreen'];

  const isMoving = (start_keypoints, finish_keypoints) => {
    const d = []
    for (let i = 0; i < finish_keypoints.length; i++) {
      d.push(Math.abs(finish_keypoints[i]-start_keypoints[i]))
    }
    if (Math.max(...d) > 0.03) {
      return true
    }
    return false
  }
 
  const isGesture = (sequenceMovement) => {
    const firstFiveAllFalse = sequenceMovement.slice(0, 2).every(value => value === false);
    const lastFiveAllFalse = sequenceMovement.slice(-2).every(value => value === false);
    const twoAreTrue = sequenceMovement.filter(value => value === true).length >= 2
    return firstFiveAllFalse && lastFiveAllFalse && twoAreTrue
  }

  function findMaxOccurrences(arr) {
  
    // Count occurrences
    const counts = new Map();
    arr.forEach(element => {
      counts.set(element, (counts.get(element) || 0) + 1);
    });
  
    // Find max occurrences
    let maxElement = null;
    let maxCount = 0;
    counts.forEach((count, element) => {
      if (count > maxCount) {
        maxElement = element;
        maxCount = count;
      }
    });
  
    return maxElement;
  }

  const extractKeypoints = (hands) => {
    const flatten = (arr) => [].concat(...arr.map(obj => [obj.x/videoWidth, obj.y/videoHeight]));
    // console.log(hands)
    if (hands) {
      const lhIndex = hands.findIndex((hand) => hand.handedness==="Right")
      const rhIndex = hands.findIndex((hand) => hand.handedness==="Left")
      let lh = lhIndex !== -1 ? flatten(hands[lhIndex].keypoints) : new Array (21 * 2).fill(0)
      let rh = rhIndex !== -1 ? flatten(hands[rhIndex].keypoints) : new Array (21 * 2).fill(0)
      return {left:lh, right:rh}
    }
  }

  async function onFrame() {
    const state = usePrediction.getState()
    if (state.shuffle) {  // Prevent weird rotations when camera is in use and shuffling
      requestID.current = requestAnimationFrame(onFrame)
      return
    }
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    // Send image data to handpose model
    const hands = await detector.estimateHands(imageData,{flipHorizontal: true});
    keypoints = extractKeypoints(hands)

    // RIGHT HAND
    if (sequenceR.length >1) {
      sequenceMovementR.push(isMoving(keypoints.right, sequenceR[sequenceR.length - 2])) 
      sequenceMovementR = sequenceMovementR.slice(-30)
    }
    sequenceR.push(keypoints.right)
    sequenceR = sequenceR.slice(-30)
    // console.log(sequenceMovementR)
    const gestureR = isGesture(sequenceMovementR)
    if (sequenceR.length == 30 && gestureR) {
      wasGestureR = true
      const prediction = rightModel.predict(tf.expandDims(tf.tensor(sequenceR),0)).argMax(1).data().then((indices) => {
        const predictedIndex = indices[0];
        const predictedClass = classLabelsR[predictedIndex];
        // console.log("Predicted class:", predictedClass);
        predictionsR.push(predictedClass)
        predictionsR = predictionsR.slice(-5)
        console.log(predictionsR)
      });
    } else if (!gestureR) {
      if (wasGestureR) {
        wasGestureR = false
        if (predictionsR.length > 2) {
          const maxClass = findMaxOccurrences(predictionsR)
          if (maxClass !== null) {
            console.log(maxClass)
            updatePred(maxClass)
          }
        }
      }
      predictionsR.length = 0;
    }
    // LEFT HAND
    if (sequenceL.length >1) {
      sequenceMovementL.push(isMoving(keypoints.left, sequenceL[sequenceL.length - 2])) 
      sequenceMovementL = sequenceMovementL.slice(-30)
    }
    sequenceL.push(keypoints.left)
    sequenceL = sequenceL.slice(-30)
    // console.log(sequenceMovementR)
    const gestureL = isGesture(sequenceMovementL)
    if (sequenceL.length == 30 && gestureL) {
      wasGestureL = true
      const prediction = leftModel.predict(tf.expandDims(tf.tensor(sequenceL),0)).argMax(1).data().then((indices) => {
        const predictedIndex = indices[0];
        const predictedClass = classLabelsL[predictedIndex];
        // console.log("Predicted class:", predictedClass);
        predictionsL.push(predictedClass)
        predictionsL = predictionsL.slice(-5)
        console.log(predictionsL)
      });
    } else if (!gestureL) {
      if (wasGestureL) {
        wasGestureL = false
        if (predictionsL.length > 2) {
          const maxClass = findMaxOccurrences(predictionsL)
          if (maxClass !== null) {
            console.log(maxClass)
            updatePred(maxClass)
          }
        }
      }
      predictionsL.length = 0;
    }
    

    // console.log(predictionsR)
    updatePred(null)
    // for (let i =0; i < hands.length; i++) {
    //   if (hands[i].keypoints != null) {
    //     drawKeypoints(hands[i].keypoints, hands[i].handedness)
    //   }
    // }
    requestID.current = requestAnimationFrame(onFrame)
  }

  return (
    <div id="canvas-wrapper" ref={wrapperRef}>
      <canvas id="output" ref={canvasRef}></canvas>
      <video id="video"ref={videoRef} autoPlay style={{visibility:"hidden", width:"auto", height:"auto"}}></video>
    </div>
  )
}