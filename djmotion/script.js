// ============================================================
// Constants — extracted from previously hardcoded magic numbers
// ============================================================
const DEFAULT_TEMPO = 500 // milliseconds between notes (BPM 120)
const DEFAULT_MIDI_NOTE = 60 // C4
const DEFAULT_VELOCITY = 1
const NOTE_DURATION_RATIO = 0.8 // note plays for 80% of tempo interval
const GESTURE_NOTE_DURATION = 500 // ms a gesture-triggered note lasts

// Hand tracking thresholds
const FINGER_TOUCH_ACTIVATE = 0.02 // index finger distance to trigger
const FINGER_TOUCH_DEACTIVATE = 0.05 // index finger distance to release
const HAND_FLIP_ACTIVATE = -0.1 // thumb-pinky diff to detect flip
const HAND_FLIP_DEACTIVATE = 0 // thumb-pinky diff to release flip
const HAND_CLOSED_MIN_DIST = 0.1 // left hand closed range min
const HAND_CLOSED_MAX_DIST = 0.4 // left/right hand closed range max
const RIGHT_HAND_CLOSED_MIN_DIST = 0 // right hand closed range min

// MIDI value ranges
const MIDI_NOTE_MIN = 1
const MIDI_NOTE_MAX = 127
const CC_VALUE_MIN = 0
const CC_VALUE_MAX = 127
const PITCH_BEND_MIN = -1
const PITCH_BEND_MAX = 1

// MediaPipe / canvas
const CANVAS_WIDTH = 1280
const CANVAS_HEIGHT = 720
const MIN_DETECTION_CONFIDENCE = 0.5
const MIN_TRACKING_CONFIDENCE = 0.5
const MAX_HANDS = 2
const MODEL_COMPLEXITY = 1

// Hand landmark indices
const LANDMARK_INDEX_FINGER = 8
const LANDMARK_WRIST = 0
const LANDMARK_THUMB = 4
const LANDMARK_PINKY = 20

// Landmark visualization
const LANDMARK_Z_NEAR = -0.15
const LANDMARK_Z_FAR = 0.1
const LANDMARK_RADIUS_MAX = 10
const LANDMARK_RADIUS_MIN = 1

// FPS
const FPS_UPDATE_INTERVAL = 1000

// Gesture feedback
const GESTURE_FLASH_DURATION = 300 // ms the flash overlay lasts
const GESTURE_FLASH_COLOR_1 = "rgba(99, 102, 241, 0.35)" // trigger 1 (indigo)
const GESTURE_FLASH_COLOR_2 = "rgba(16, 185, 129, 0.35)" // trigger 2 (green)
const GESTURE_FLASH_COLOR_3 = "rgba(245, 158, 11, 0.35)" // trigger 3 (amber)

// Tracking colors
const RIGHT_HAND_COLOR = "#fff"
const LEFT_HAND_COLOR = "#056df5"

// ============================================================
// DOM Elements
// ============================================================
function toggleControl() {
  const controlPanel = document.getElementsByClassName("control-panel")[0]
  const controlButton = document.getElementById("controlButton")
  if (controlPanel.style.display === "none") {
    controlPanel.style.display = "block"
    controlButton.innerHTML = "<span class='btn-text'>Hide Controls</span>"
  } else {
    controlPanel.style.display = "none"
    controlButton.innerHTML = "<span class='btn-text'>Show Controls</span>"
  }
}

const videoElement = document.getElementsByClassName("input_video")[0]
const videoSelect = document.querySelector("select#videoSource")
const selectors = [videoSelect]
const canvasElement = document.getElementsByClassName("output_canvas")[0]
const canvasCtx = canvasElement.getContext("2d")
const showTracking = document.getElementById("showTracking")
const selfie = document.getElementById("selfie")
const fpsoutput = document.getElementById("fps")
const gesture = document.getElementById("gesture")
const device = document.getElementById("device")
const sendMidi = document.getElementById("sendMidi")
const bpm = document.getElementById("bpm")
const BPMAutomateInput = document.getElementById("BPMAutomateInput")
let tempo = DEFAULT_TEMPO
const bpmValue = document.getElementById("bpmValue")
const sliderMinValueInput = document.getElementById("sliderMinValue")
const sliderMaxValueInput = document.getElementById("sliderMaxValue")
let minVal = sliderMinValueInput.value
let maxVal = sliderMaxValueInput.value
const midiChannel = document.getElementById("midiChannel")
const trigger1Channel = document.getElementById("trigger1Channel")
const midi1NoteInput = document.getElementById("midi1NoteInput")
const trigger2Channel = document.getElementById("trigger2Channel")
const midi2NoteInput = document.getElementById("midi2NoteInput")
const trigger3Channel = document.getElementById("trigger3Channel")
const midi3NoteInput = document.getElementById("midi3NoteInput")
const midiPitchControlInput = document.getElementById("midiPitchControlInput")
const midiVelInput = document.getElementById("midiVelInput")
const pitchBendInput = document.getElementById("pitchBendInput")
const aftertouchInput = document.getElementById("aftertouchInput")
const cc1Input = document.getElementById("cc1Input")
const cc1Controller = document.getElementById("cc1Controller")
const cc1Channel = document.getElementById("cc1Channel")
const cc2Input = document.getElementById("cc2Input")
const cc2Controller = document.getElementById("cc2Controller")
const cc2Channel = document.getElementById("cc2Channel")
const cc3Input = document.getElementById("cc3Input")
const cc3Controller = document.getElementById("cc3Controller")
const cc3Channel = document.getElementById("cc3Channel")
const cc4Input = document.getElementById("cc4Input")
const cc4Controller = document.getElementById("cc4Controller")
const cc4Channel = document.getElementById("cc4Channel")

let leftWrist, leftIndex, leftPinky, rightPinky, rightWrist, rightIndex,
  leftThumb, rightThumb, leftThumbX, rightThumbX, leftIndexX, leftPinkyX,
  leftIndexY, leftWristX, leftWristY, rightIndexX, rightIndexY, rightPinkyX,
  rightWristX, rightWristY, leftClose, rightClose, distance

let output, midiPitchControlValue = DEFAULT_MIDI_NOTE, midiVel = DEFAULT_VELOCITY
let midi1Note = DEFAULT_MIDI_NOTE
let midi2Note = DEFAULT_MIDI_NOTE
let midi3Note = DEFAULT_MIDI_NOTE

// ============================================================
// Gesture flash state
// ============================================================
let gestureFlashEnd = 0
let gestureFlashColor = ""

function flashGesture(color) {
  gestureFlashColor = color
  gestureFlashEnd = performance.now() + GESTURE_FLASH_DURATION
}

// ============================================================
// MIDI initialization
// ============================================================
console.log("Checking Web MIDI support...")
if (navigator.requestMIDIAccess) {
  console.log("Web MIDI API is supported")

  WebMidi
    .disable()
    .then(() => WebMidi.enable({
      sysex: false,
      callback: function (err) {
        if (err) {
          console.error("WebMidi could not be enabled:", err)
          alert("Could not enable MIDI support: " + err)
          return
        }

        console.log("WebMidi enabled successfully!")
        console.log("Number of MIDI outputs:", WebMidi.outputs.length)
        WebMidi.outputs.forEach(output => {
          console.log("Found MIDI output:", output.name)
        })

        const deviceSelect = document.getElementById("device")
        if (!deviceSelect) {
          console.error("Could not find device select element")
          return
        }

        deviceSelect.innerHTML = ""
        if (WebMidi.outputs.length === 0) {
          const option = document.createElement("option")
          option.value = ""
          option.text = "No MIDI devices found"
          deviceSelect.appendChild(option)
          console.warn("No MIDI outputs available")
          alert("No MIDI devices detected. Please connect a MIDI device and refresh the page.")
          return
        }

        WebMidi.outputs.forEach(output => {
          const option = document.createElement("option")
          option.value = output.name
          option.text = output.name
          deviceSelect.appendChild(option)
        })

        output = WebMidi.outputs[0]
        console.log("Default output set to:", output.name)

        // Load settings after MIDI is ready (device select is populated)
        loadSettings()
      }
    }))
    .catch(err => {
      console.error("Error initializing WebMidi:", err)
      alert("Error initializing MIDI: " + err.message)
    })
} else {
  console.error("Web MIDI API is not supported in this browser")
  alert("Web MIDI API is not supported in this browser. Please use Chrome or Firefox.")
}

function changeDevice() {
  const selectedDevice = device.value
  output = WebMidi.outputs.find((output) => output.name === selectedDevice)
  if (!output) {
    alert("Selected MIDI device not found.")
  }
}

if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
  console.warn("Safari detected. Web MIDI API is not natively supported. Consider using Chrome or Firefox.")
}

// ============================================================
// Camera
// ============================================================
function gotDevices(deviceInfos) {
  const values = selectors.map((select) => select.value)
  selectors.forEach((select) => {
    while (select.firstChild) {
      select.removeChild(select.firstChild)
    }
  })
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i]
    const option = document.createElement("option")
    option.value = deviceInfo.deviceId
    if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`
      videoSelect.appendChild(option)
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex]
    }
  })
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError)

function gotStream(stream) {
  window.stream = stream
  videoElement.srcObject = stream
  return navigator.mediaDevices.enumerateDevices()
}

function handleError(error) {
  console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name)
}

// ============================================================
// Control reset listeners
// ============================================================
midiPitchControlInput.addEventListener("change", () => {
  if (midiPitchControlInput.value === "nil") {
    midiPitchControlValue = DEFAULT_MIDI_NOTE
  }
  saveSettings()
})

pitchBendInput.addEventListener("change", () => {
  if (pitchBendInput.value === "nil") {
    output.sendPitchBend(0)
  }
  saveSettings()
})

aftertouchInput.addEventListener("change", () => {
  if (aftertouchInput.value === "nil") {
    output.sendChannelAftertouch(0, "all")
  }
  saveSettings()
})

cc1Input.addEventListener("change", () => {
  if (cc1Input.value === "nil") cc1Control(0)
  saveSettings()
})

cc2Input.addEventListener("change", () => {
  if (cc2Input.value === "nil") cc2Control(0)
  saveSettings()
})

cc3Input.addEventListener("change", () => {
  if (cc3Input.value === "nil") cc3Control(0)
  saveSettings()
})

cc4Input.addEventListener("change", () => {
  if (cc4Input.value === "nil") cc4Control(0)
  saveSettings()
})

midi1NoteInput.onchange = () => {
  midi1Note = midi1NoteInput.value
  saveSettings()
}

midi2NoteInput.onchange = () => {
  midi2Note = midi2NoteInput.value
  saveSettings()
}

midi3NoteInput.onchange = () => {
  midi3Note = midi3NoteInput.value
  saveSettings()
}

// ============================================================
// Utility functions
// ============================================================
function scaleValue(value, inMin, inMax, outMin, outMax) {
  if (inMin === inMax) {
    throw new Error("Input range cannot be zero.")
  }
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function linearScale(value, inMin, inMax, outMin, outMax) {
  const scaledValue = scaleValue(value, inMin, inMax, outMin, outMax)
  return outMin < outMax ? clamp(scaledValue, outMin, outMax) : clamp(scaledValue, outMax, outMin)
}

// ============================================================
// BPM slider
// ============================================================
bpm.addEventListener("input", (ev) => {
  tempo = 60000 / bpm.value
  bpmValue.innerHTML = bpm.value
  saveSettings()
})

sliderMinValueInput.addEventListener("input", () => {
  minVal = Number.parseInt(sliderMinValueInput.value, 10)
  maxVal = Number.parseInt(sliderMaxValueInput.value, 10)
  if (minVal < maxVal) {
    bpm.min = minVal
    if (Number.parseInt(bpm.value, 10) < minVal) {
      bpm.value = minVal
      bpmValue.textContent = minVal
    }
  }
  saveSettings()
})

sliderMaxValueInput.addEventListener("input", () => {
  minVal = Number.parseInt(sliderMinValueInput.value, 10)
  maxVal = Number.parseInt(sliderMaxValueInput.value, 10)
  if (maxVal > minVal) {
    bpm.max = maxVal
    if (Number.parseInt(bpm.value, 10) > maxVal) {
      bpm.value = maxVal
      bpmValue.textContent = maxVal
    }
  }
  saveSettings()
})

// Save settings when toggles change
selfie.addEventListener("change", () => saveSettings())
showTracking.addEventListener("change", () => saveSettings())
sendMidi.addEventListener("change", () => saveSettings())
gesture.addEventListener("change", () => saveSettings())
midiChannel.addEventListener("change", () => saveSettings())
trigger1Channel.addEventListener("change", () => saveSettings())
trigger2Channel.addEventListener("change", () => saveSettings())
trigger3Channel.addEventListener("change", () => saveSettings())
BPMAutomateInput.addEventListener("change", () => saveSettings())
midiVelInput.addEventListener("change", () => saveSettings())
cc1Controller.addEventListener("change", () => saveSettings())
cc1Channel.addEventListener("change", () => saveSettings())
cc2Controller.addEventListener("change", () => saveSettings())
cc2Channel.addEventListener("change", () => saveSettings())
cc3Controller.addEventListener("change", () => saveSettings())
cc3Channel.addEventListener("change", () => saveSettings())
cc4Controller.addEventListener("change", () => saveSettings())
cc4Channel.addEventListener("change", () => saveSettings())

// ============================================================
// MIDI note loop
// ============================================================
let BPMCounter = 0
let BPMTracker = new Date()

function myMidiNoteLoop(leftIndex, rightIndex) {
  BPMCounter++
  const BPMNow = new Date()
  const timeDiffBPM = BPMNow.getTime() - BPMTracker.getTime()
  if (sendMidi.checked && timeDiffBPM >= tempo) {
    if (leftIndex || rightIndex) {
      output.playNote(midiPitchControlValue, [midiChannel.value], {
        attack: midiVel,
        duration: tempo * NOTE_DURATION_RATIO,
      })
      BPMCounter = 0
      BPMTracker = new Date()
    }
  }
}

// ============================================================
// MIDI control functions
// ============================================================
function autoBPMControl(controlValue) {
  tempo = linearScale(controlValue, 0, 1, 60000 / minVal, 60000 / maxVal)
}

function midiVelControl(controlValue) {
  midiVel = clamp(controlValue, 0, 1)
}

function midiPitchControl(controlValue) {
  midiPitchControlValue = linearScale(controlValue, 0, 1, MIDI_NOTE_MIN, MIDI_NOTE_MAX)
}

function pitchBendControl(controlValue) {
  if (output) output.sendPitchBend(linearScale(controlValue, 0, 1, PITCH_BEND_MIN, PITCH_BEND_MAX))
}

function aftertouchControl(controlValue) {
  if (output) output.sendChannelAftertouch(clamp(controlValue, 0, 1), "all")
}

function cc1Control(controlValue) {
  if (output)
    output.sendControlChange(Number(cc1Controller.value), linearScale(controlValue, 0, 1, CC_VALUE_MIN, CC_VALUE_MAX), [cc1Channel.value])
}

function cc2Control(controlValue) {
  if (output)
    output.sendControlChange(Number(cc2Controller.value), linearScale(controlValue, 0, 1, CC_VALUE_MIN, CC_VALUE_MAX), [cc2Channel.value])
}

function cc3Control(controlValue) {
  if (output)
    output.sendControlChange(Number(cc3Controller.value), linearScale(controlValue, 0, 1, CC_VALUE_MIN, CC_VALUE_MAX), [cc3Channel.value])
}

function cc4Control(controlValue) {
  if (output)
    output.sendControlChange(Number(cc4Controller.value), linearScale(controlValue, 0, 1, CC_VALUE_MIN, CC_VALUE_MAX), [cc4Channel.value])
}

// ============================================================
// Gesture triggers (with hysteresis + visual feedback)
// ============================================================
let t1on = false
function Trigger1(distance) {
  if (distance <= FINGER_TOUCH_ACTIVATE) {
    if (t1on) return
    t1on = true
    flashGesture(GESTURE_FLASH_COLOR_1)
    output.playNote(midi1Note, [trigger1Channel.value], {
      attack: 1,
      duration: GESTURE_NOTE_DURATION,
    })
  }
  if (distance > FINGER_TOUCH_DEACTIVATE) {
    t1on = false
  }
}

let t2on = false
function Trigger2(leftThumbX, leftPinkyX) {
  if (leftThumbX - leftPinkyX <= HAND_FLIP_ACTIVATE) {
    if (t2on) return
    t2on = true
    flashGesture(GESTURE_FLASH_COLOR_2)
    output.playNote(midi2Note, [trigger2Channel.value], {
      attack: 1,
      duration: GESTURE_NOTE_DURATION,
    })
  }
  if (leftThumbX - leftPinkyX > HAND_FLIP_DEACTIVATE) {
    t2on = false
  }
}

let t3on = false
function Trigger3(rightThumbX, rightPinkyX) {
  if (rightPinkyX - rightThumbX <= HAND_FLIP_ACTIVATE) {
    if (t3on) return
    t3on = true
    flashGesture(GESTURE_FLASH_COLOR_3)
    output.playNote(midi3Note, [trigger3Channel.value], {
      attack: 1,
      duration: GESTURE_NOTE_DURATION,
    })
  }
  if (rightPinkyX - rightThumbX > HAND_FLIP_DEACTIVATE) {
    t3on = false
  }
}

// ============================================================
// Movement → MIDI mapping
// ============================================================
const controls_io = [
  { in: BPMAutomateInput, out: autoBPMControl },
  { in: midiPitchControlInput, out: midiPitchControl },
  { in: midiVelInput, out: midiVelControl },
  { in: pitchBendInput, out: pitchBendControl },
  { in: aftertouchInput, out: aftertouchControl },
  { in: cc1Input, out: cc1Control },
  { in: cc2Input, out: cc2Control },
  { in: cc3Input, out: cc3Control },
  { in: cc4Input, out: cc4Control },
]

function myMidi(leftIndex, leftWrist, leftThumb, leftPinky, rightIndex, rightWrist, rightThumb, rightPinky) {
  if (midiVelInput.value === "nil") {
    midiVel = DEFAULT_VELOCITY
  }
  controls_io.forEach((io) => {
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
  if (gesture.checked && output && leftThumb && leftPinky) {
    Trigger2(leftThumb.x, leftPinky.x)
  }
  if (gesture.checked && output && rightThumb && rightPinky) {
    Trigger3(rightThumb.x, rightPinky.x)
  }
  if (gesture.checked && output && leftIndex && rightIndex) {
    Trigger1(Math.sqrt((leftIndex.x - rightIndex.x) ** 2 + (leftIndex.y - rightIndex.y) ** 2))
  }
}

// ============================================================
// FPS counter
// ============================================================
let counter = 0
let counterTracker = new Date()

const HAND_CONNECTIONS = window.HAND_CONNECTIONS
const drawConnectors = window.drawConnectors
const drawLandmarks = window.drawLandmarks
const lerp = window.lerp
const Hands = window.Hands
const Camera = window.Camera

// ============================================================
// Hand tracking results + gesture flash overlay
// ============================================================
function onResults(results) {
  counter++
  const now = new Date()
  const timeDiff = now.getTime() - counterTracker.getTime()
  if (timeDiff >= FPS_UPDATE_INTERVAL) {
    const fps = Math.floor(counter / (timeDiff / FPS_UPDATE_INTERVAL))
    fpsoutput.innerHTML = fps
    counter = 0
    counterTracker = new Date()
  }

  canvasCtx.save()
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)

  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index]
      const isRightHand = classification.label === "Right"
      const landmarks = results.multiHandLandmarks[index]
      if (showTracking.checked) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: isRightHand ? RIGHT_HAND_COLOR : LEFT_HAND_COLOR,
        }),
          drawLandmarks(canvasCtx, landmarks, {
            color: isRightHand ? RIGHT_HAND_COLOR : LEFT_HAND_COLOR,
            fillColor: isRightHand ? LEFT_HAND_COLOR : RIGHT_HAND_COLOR,
            radius: (x) => {
              return lerp(x.from.z, LANDMARK_Z_NEAR, LANDMARK_Z_FAR, LANDMARK_RADIUS_MAX, LANDMARK_RADIUS_MIN)
            },
          })
      }
      if (isRightHand === false) {
        leftIndex = landmarks[LANDMARK_INDEX_FINGER]
        leftWrist = landmarks[LANDMARK_WRIST]
        leftThumb = landmarks[LANDMARK_THUMB]
        leftPinky = landmarks[LANDMARK_PINKY]
      } else {
        rightIndex = landmarks[LANDMARK_INDEX_FINGER]
        rightWrist = landmarks[LANDMARK_WRIST]
        rightThumb = landmarks[LANDMARK_THUMB]
        rightPinky = landmarks[LANDMARK_PINKY]
      }
      myMidi(leftIndex, leftWrist, leftThumb, leftPinky, rightIndex, rightWrist, rightThumb, rightPinky)
      myMidiNoteLoop(leftIndex, rightIndex)
    }
  }

  // Draw gesture flash overlay
  if (performance.now() < gestureFlashEnd) {
    const remaining = gestureFlashEnd - performance.now()
    const alpha = remaining / GESTURE_FLASH_DURATION
    canvasCtx.save()
    // Colored vignette / border glow
    const gradient = canvasCtx.createRadialGradient(
      canvasElement.width / 2, canvasElement.height / 2, canvasElement.height * 0.3,
      canvasElement.width / 2, canvasElement.height / 2, canvasElement.height * 0.75
    )
    gradient.addColorStop(0, "transparent")
    gradient.addColorStop(1, gestureFlashColor)
    canvasCtx.globalAlpha = alpha
    canvasCtx.fillStyle = gradient
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)
    canvasCtx.restore()
  }

  canvasCtx.restore()
}

// ============================================================
// Selfie toggle
// ============================================================
selfie.addEventListener("change", function () {
  hands.setOptions({ selfieMode: this.checked })
})

// ============================================================
// MediaPipe Hands setup
// ============================================================
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3/${file}`
  },
})

hands.setOptions({
  selfieMode: true,
  maxNumHands: MAX_HANDS,
  modelComplexity: MODEL_COMPLEXITY,
  minDetectionConfidence: MIN_DETECTION_CONFIDENCE,
  minTrackingConfidence: MIN_TRACKING_CONFIDENCE,
})

hands.onResults(onResults)

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement })
  },
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
})
camera.start()

function start() {
  const videoSource = videoSelect.value
  const constraints = {
    video: { deviceId: videoSource ? { exact: videoSource } : undefined },
  }
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError)
}

videoSelect.onchange = start

// ============================================================
// localStorage persistence
// ============================================================
const STORAGE_KEY = "handmate_midi_settings"

// All persistable controls: { id, type }
const PERSISTABLE_CONTROLS = [
  // Checkboxes
  { id: "selfie", type: "checkbox" },
  { id: "showTracking", type: "checkbox" },
  { id: "sendMidi", type: "checkbox" },
  { id: "gesture", type: "checkbox" },
  // Selects
  { id: "midiPitchControlInput", type: "select" },
  { id: "midiVelInput", type: "select" },
  { id: "BPMAutomateInput", type: "select" },
  { id: "pitchBendInput", type: "select" },
  { id: "aftertouchInput", type: "select" },
  { id: "cc1Input", type: "select" },
  { id: "cc2Input", type: "select" },
  { id: "cc3Input", type: "select" },
  { id: "cc4Input", type: "select" },
  // Number inputs
  { id: "midiChannel", type: "number" },
  { id: "bpm", type: "range" },
  { id: "sliderMinValue", type: "number" },
  { id: "sliderMaxValue", type: "number" },
  { id: "trigger1Channel", type: "number" },
  { id: "midi1NoteInput", type: "number" },
  { id: "trigger2Channel", type: "number" },
  { id: "midi2NoteInput", type: "number" },
  { id: "trigger3Channel", type: "number" },
  { id: "midi3NoteInput", type: "number" },
  { id: "cc1Controller", type: "number" },
  { id: "cc1Channel", type: "number" },
  { id: "cc2Controller", type: "number" },
  { id: "cc2Channel", type: "number" },
  { id: "cc3Controller", type: "number" },
  { id: "cc3Channel", type: "number" },
  { id: "cc4Controller", type: "number" },
  { id: "cc4Channel", type: "number" },
  // MIDI device (saved separately — may not exist on next load)
  { id: "device", type: "select" },
]

function gatherSettings() {
  const settings = {}
  PERSISTABLE_CONTROLS.forEach(({ id, type }) => {
    const el = document.getElementById(id)
    if (!el) return
    if (type === "checkbox") {
      settings[id] = el.checked
    } else {
      settings[id] = el.value
    }
  })
  return settings
}

function applySettings(settings) {
  if (!settings) return
  PERSISTABLE_CONTROLS.forEach(({ id, type }) => {
    if (!(id in settings)) return
    const el = document.getElementById(id)
    if (!el) return
    if (type === "checkbox") {
      el.checked = settings[id]
    } else {
      // For selects, only apply if the value exists as an option
      if (type === "select") {
        const options = Array.from(el.options).map(o => o.value)
        if (!options.includes(settings[id])) return
      }
      el.value = settings[id]
    }
  })

  // Sync JS state with restored DOM values
  tempo = 60000 / bpm.value
  bpmValue.textContent = bpm.value
  minVal = sliderMinValueInput.value
  maxVal = sliderMaxValueInput.value
  bpm.min = minVal
  bpm.max = maxVal
  midi1Note = midi1NoteInput.value
  midi2Note = midi2NoteInput.value
  midi3Note = midi3NoteInput.value

  // Restore selfie mode
  hands.setOptions({ selfieMode: selfie.checked })

  // Restore MIDI device
  if (settings.device) {
    const match = WebMidi.outputs.find(o => o.name === settings.device)
    if (match) output = match
  }
}

let saveTimeout = null
function saveSettings() {
  // Debounce saves to avoid excessive writes during slider drags
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gatherSettings()))
    } catch (e) {
      console.warn("Could not save settings:", e)
    }
  }, 200)
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      applySettings(JSON.parse(raw))
    }
  } catch (e) {
    console.warn("Could not load settings:", e)
  }
}

// ============================================================
// Preset system
// ============================================================
const PRESETS_STORAGE_KEY = "handmate_midi_presets"
const presetSelect = document.getElementById("presetSelect")
const presetSaveBtn = document.getElementById("presetSaveBtn")
const presetDeleteBtn = document.getElementById("presetDeleteBtn")

function getPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function savePresetsToStorage(presets) {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch (e) {
    console.warn("Could not save presets:", e)
  }
}

function populatePresetDropdown() {
  if (!presetSelect) return
  const presets = getPresets()
  // Clear all except the first placeholder option
  while (presetSelect.options.length > 1) {
    presetSelect.remove(1)
  }
  Object.keys(presets).sort().forEach(name => {
    const opt = document.createElement("option")
    opt.value = name
    opt.text = name
    presetSelect.appendChild(opt)
  })
}

if (presetSelect) {
  presetSelect.addEventListener("change", () => {
    const name = presetSelect.value
    if (!name) return
    const presets = getPresets()
    if (presets[name]) {
      applySettings(presets[name])
      saveSettings() // persist as current settings too
    }
  })
}

if (presetSaveBtn) {
  presetSaveBtn.addEventListener("click", () => {
    const name = prompt("Enter a name for this preset:")
    if (!name || !name.trim()) return
    const trimmed = name.trim()
    const presets = getPresets()
    if (presets[trimmed]) {
      if (!confirm(`Preset "${trimmed}" already exists. Overwrite?`)) return
    }
    presets[trimmed] = gatherSettings()
    savePresetsToStorage(presets)
    populatePresetDropdown()
    presetSelect.value = trimmed
  })
}

if (presetDeleteBtn) {
  presetDeleteBtn.addEventListener("click", () => {
    const name = presetSelect.value
    if (!name) {
      alert("Select a preset to delete.")
      return
    }
    if (!confirm(`Delete preset "${name}"?`)) return
    const presets = getPresets()
    delete presets[name]
    savePresetsToStorage(presets)
    populatePresetDropdown()
    presetSelect.value = ""
  })
}

// Populate on load
populatePresetDropdown()
