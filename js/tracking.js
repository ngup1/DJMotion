import state from "./state.js"
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, MAX_HANDS, MODEL_COMPLEXITY,
  MIN_DETECTION_CONFIDENCE, MIN_TRACKING_CONFIDENCE,
  FPS_UPDATE_INTERVAL,
  LANDMARK_INDEX_FINGER, LANDMARK_WRIST, LANDMARK_THUMB, LANDMARK_PINKY,
  LANDMARK_Z_NEAR, LANDMARK_Z_FAR, LANDMARK_RADIUS_MAX, LANDMARK_RADIUS_MIN,
  RIGHT_HAND_COLOR, LEFT_HAND_COLOR,
} from "./constants.js"
import { myMidi } from "./mapping.js"
import { myMidiNoteLoop } from "./midi.js"
import { drawGestureFlash } from "./gestures.js"

const HAND_CONNECTIONS = window.HAND_CONNECTIONS
const drawConnectors = window.drawConnectors
const drawLandmarks = window.drawLandmarks
const lerp = window.lerp
const Hands = window.Hands
const Camera = window.Camera

export function initTracking(dom) {
  const canvasCtx = dom.canvasElement.getContext("2d")

  function onResults(results) {
    state.fpsCounter++
    const now = new Date()
    const timeDiff = now.getTime() - state.fpsTracker.getTime()
    if (timeDiff >= FPS_UPDATE_INTERVAL) {
      const fps = Math.floor(state.fpsCounter / (timeDiff / FPS_UPDATE_INTERVAL))
      dom.fpsoutput.innerHTML = fps
      state.fpsCounter = 0
      state.fpsTracker = new Date()
    }

    canvasCtx.save()
    canvasCtx.clearRect(0, 0, dom.canvasElement.width, dom.canvasElement.height)
    canvasCtx.drawImage(results.image, 0, 0, dom.canvasElement.width, dom.canvasElement.height)

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index]
        const isRightHand = classification.label === "Right"
        const landmarks = results.multiHandLandmarks[index]

        if (dom.showTracking.checked) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: isRightHand ? RIGHT_HAND_COLOR : LEFT_HAND_COLOR,
          }),
            drawLandmarks(canvasCtx, landmarks, {
              color: isRightHand ? RIGHT_HAND_COLOR : LEFT_HAND_COLOR,
              fillColor: isRightHand ? LEFT_HAND_COLOR : RIGHT_HAND_COLOR,
              radius: (x) => lerp(x.from.z, LANDMARK_Z_NEAR, LANDMARK_Z_FAR, LANDMARK_RADIUS_MAX, LANDMARK_RADIUS_MIN),
            })
        }

        if (!isRightHand) {
          state.leftIndex = landmarks[LANDMARK_INDEX_FINGER]
          state.leftWrist = landmarks[LANDMARK_WRIST]
          state.leftThumb = landmarks[LANDMARK_THUMB]
          state.leftPinky = landmarks[LANDMARK_PINKY]
        } else {
          state.rightIndex = landmarks[LANDMARK_INDEX_FINGER]
          state.rightWrist = landmarks[LANDMARK_WRIST]
          state.rightThumb = landmarks[LANDMARK_THUMB]
          state.rightPinky = landmarks[LANDMARK_PINKY]
        }

        myMidi(dom,
          state.leftIndex, state.leftWrist, state.leftThumb, state.leftPinky,
          state.rightIndex, state.rightWrist, state.rightThumb, state.rightPinky)
        myMidiNoteLoop(state.leftIndex, state.rightIndex, dom.sendMidi, dom.midiChannel)
      }
    }

    drawGestureFlash(canvasCtx, dom.canvasElement.width, dom.canvasElement.height)
    canvasCtx.restore()
  }

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3/${file}`,
  })

  hands.setOptions({
    selfieMode: true,
    maxNumHands: MAX_HANDS,
    modelComplexity: MODEL_COMPLEXITY,
    minDetectionConfidence: MIN_DETECTION_CONFIDENCE,
    minTrackingConfidence: MIN_TRACKING_CONFIDENCE,
  })

  hands.onResults(onResults)
  state.hands = hands

  const camera = new Camera(dom.videoElement, {
    onFrame: async () => {
      await hands.send({ image: dom.videoElement })
    },
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  })
  camera.start()
}
