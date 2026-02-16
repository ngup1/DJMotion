import { DEFAULT_TEMPO, DEFAULT_MIDI_NOTE, DEFAULT_VELOCITY } from "./constants.js"

const state = {
  // MIDI output device
  output: null,

  // Timing
  tempo: DEFAULT_TEMPO,
  minVal: 20,
  maxVal: 500,

  // MIDI note values
  midiPitchControlValue: DEFAULT_MIDI_NOTE,
  midiVel: DEFAULT_VELOCITY,
  midi1Note: DEFAULT_MIDI_NOTE,
  midi2Note: DEFAULT_MIDI_NOTE,
  midi3Note: DEFAULT_MIDI_NOTE,

  // BPM note loop
  BPMCounter: 0,
  BPMTracker: new Date(),

  // FPS counter
  fpsCounter: 0,
  fpsTracker: new Date(),

  // Hand landmarks (set each frame)
  leftIndex: null,
  leftWrist: null,
  leftThumb: null,
  leftPinky: null,
  rightIndex: null,
  rightWrist: null,
  rightThumb: null,
  rightPinky: null,

  // Gesture flash overlay
  gestureFlashEnd: 0,
  gestureFlashColor: "",

  // MediaPipe hands instance (set during init)
  hands: null,
}

export default state
