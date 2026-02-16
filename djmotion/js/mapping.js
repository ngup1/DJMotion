import state from "./state.js"
import { DEFAULT_VELOCITY, HAND_CLOSED_MIN_DIST, HAND_CLOSED_MAX_DIST, RIGHT_HAND_CLOSED_MIN_DIST } from "./constants.js"
import { linearScale } from "./utils.js"
import {
  autoBPMControl, midiVelControl, midiPitchControl,
  pitchBendControl, aftertouchControl, ccControl,
} from "./midi.js"
import { Trigger1, Trigger2, Trigger3 } from "./gestures.js"

let controlsIO = []

export function createControlsIO(dom) {
  // Build CC control functions bound to their specific DOM elements
  const cc1Fn = (v) => ccControl(v, dom.cc1Controller, dom.cc1Channel)
  const cc2Fn = (v) => ccControl(v, dom.cc2Controller, dom.cc2Channel)
  const cc3Fn = (v) => ccControl(v, dom.cc3Controller, dom.cc3Channel)
  const cc4Fn = (v) => ccControl(v, dom.cc4Controller, dom.cc4Channel)

  controlsIO = [
    { in: dom.BPMAutomateInput, out: autoBPMControl },
    { in: dom.midiPitchControlInput, out: midiPitchControl },
    { in: dom.midiVelInput, out: midiVelControl },
    { in: dom.pitchBendInput, out: pitchBendControl },
    { in: dom.aftertouchInput, out: aftertouchControl },
    { in: dom.cc1Input, out: cc1Fn },
    { in: dom.cc2Input, out: cc2Fn },
    { in: dom.cc3Input, out: cc3Fn },
    { in: dom.cc4Input, out: cc4Fn },
  ]

  return { cc1Fn, cc2Fn, cc3Fn, cc4Fn }
}

export function myMidi(dom, leftIndex, leftWrist, leftThumb, leftPinky, rightIndex, rightWrist, rightThumb, rightPinky) {
  if (dom.midiVelInput.value === "nil") {
    state.midiVel = DEFAULT_VELOCITY
  }

  controlsIO.forEach((io) => {
    if (io.in.value === "leftIndexX" && leftIndex) {
      io.out(leftIndex.x)
    }
    if (io.in.value === "leftIndexY" && leftIndex) {
      io.out(1 - leftIndex.y)
    }
    if (io.in.value === "leftClosed" && leftIndex) {
      io.out(
        linearScale(Math.sqrt((leftIndex.x - leftWrist.x) ** 2 + (leftIndex.y - leftWrist.y) ** 2), HAND_CLOSED_MIN_DIST, HAND_CLOSED_MAX_DIST, 1, 0),
      )
    }
    if (io.in.value === "rightIndexX" && rightIndex) {
      io.out(rightIndex.x)
    }
    if (io.in.value === "rightIndexY" && rightIndex) {
      io.out(1 - rightIndex.y)
    }
    if (io.in.value === "rightClosed" && rightIndex) {
      io.out(
        linearScale(Math.sqrt((rightIndex.x - rightWrist.x) ** 2 + (rightIndex.y - rightWrist.y) ** 2), RIGHT_HAND_CLOSED_MIN_DIST, HAND_CLOSED_MAX_DIST, 1, 0),
      )
    }
    if (io.in.value === "indexDistance" && leftIndex && rightIndex) {
      io.out(Math.sqrt((leftIndex.x - rightIndex.x) ** 2 + (leftIndex.y - rightIndex.y) ** 2))
    }
  })

  if (dom.gesture.checked && state.output && leftThumb && leftPinky) {
    Trigger2(leftThumb.x, leftPinky.x, dom.trigger2Channel)
  }
  if (dom.gesture.checked && state.output && rightThumb && rightPinky) {
    Trigger3(rightThumb.x, rightPinky.x, dom.trigger3Channel)
  }
  if (dom.gesture.checked && state.output && leftIndex && rightIndex) {
    Trigger1(Math.sqrt((leftIndex.x - rightIndex.x) ** 2 + (leftIndex.y - rightIndex.y) ** 2), dom.trigger1Channel)
  }
}
