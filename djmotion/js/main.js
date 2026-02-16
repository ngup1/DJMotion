import state from "./state.js"
import { DEFAULT_MIDI_NOTE } from "./constants.js"
import { initMidi, changeDevice, pitchBendControl, aftertouchControl } from "./midi.js"
import { createControlsIO } from "./mapping.js"
import { initCamera } from "./camera.js"
import { initTracking } from "./tracking.js"
import { saveSettings, loadSettings, initPresets } from "./persistence.js"

// Gather all DOM element references in one place
const dom = {
  videoElement: document.getElementsByClassName("input_video")[0],
  videoSelect: document.querySelector("select#videoSource"),
  canvasElement: document.getElementsByClassName("output_canvas")[0],
  showTracking: document.getElementById("showTracking"),
  selfie: document.getElementById("selfie"),
  fpsoutput: document.getElementById("fps"),
  gesture: document.getElementById("gesture"),
  device: document.getElementById("device"),
  sendMidi: document.getElementById("sendMidi"),
  bpm: document.getElementById("bpm"),
  BPMAutomateInput: document.getElementById("BPMAutomateInput"),
  bpmValue: document.getElementById("bpmValue"),
  sliderMinValueInput: document.getElementById("sliderMinValue"),
  sliderMaxValueInput: document.getElementById("sliderMaxValue"),
  midiChannel: document.getElementById("midiChannel"),
  trigger1Channel: document.getElementById("trigger1Channel"),
  midi1NoteInput: document.getElementById("midi1NoteInput"),
  trigger2Channel: document.getElementById("trigger2Channel"),
  midi2NoteInput: document.getElementById("midi2NoteInput"),
  trigger3Channel: document.getElementById("trigger3Channel"),
  midi3NoteInput: document.getElementById("midi3NoteInput"),
  midiPitchControlInput: document.getElementById("midiPitchControlInput"),
  midiVelInput: document.getElementById("midiVelInput"),
  pitchBendInput: document.getElementById("pitchBendInput"),
  aftertouchInput: document.getElementById("aftertouchInput"),
  cc1Input: document.getElementById("cc1Input"),
  cc1Controller: document.getElementById("cc1Controller"),
  cc1Channel: document.getElementById("cc1Channel"),
  cc2Input: document.getElementById("cc2Input"),
  cc2Controller: document.getElementById("cc2Controller"),
  cc2Channel: document.getElementById("cc2Channel"),
  cc3Input: document.getElementById("cc3Input"),
  cc3Controller: document.getElementById("cc3Controller"),
  cc3Channel: document.getElementById("cc3Channel"),
  cc4Input: document.getElementById("cc4Input"),
  cc4Controller: document.getElementById("cc4Controller"),
  cc4Channel: document.getElementById("cc4Channel"),
  controlButton: document.getElementById("controlButton"),
  presetSelect: document.getElementById("presetSelect"),
  presetSaveBtn: document.getElementById("presetSaveBtn"),
  presetDeleteBtn: document.getElementById("presetDeleteBtn"),
}

// Initialize BPM slider state from DOM defaults
state.minVal = dom.sliderMinValueInput.value
state.maxVal = dom.sliderMaxValueInput.value

// Build the controls_io routing table (returns bound CC functions for reset listeners)
const { cc1Fn, cc2Fn, cc3Fn, cc4Fn } = createControlsIO(dom)

// ============================================================
// UI: Toggle control panel
// ============================================================
dom.controlButton.addEventListener("click", () => {
  const controlPanel = document.getElementsByClassName("control-panel")[0]
  if (controlPanel.style.display === "none") {
    controlPanel.style.display = "block"
    dom.controlButton.innerHTML = "<span class='btn-text'>Hide Controls</span>"
  } else {
    controlPanel.style.display = "none"
    dom.controlButton.innerHTML = "<span class='btn-text'>Show Controls</span>"
  }
})

// ============================================================
// Control reset listeners
// ============================================================
dom.midiPitchControlInput.addEventListener("change", () => {
  if (dom.midiPitchControlInput.value === "nil") state.midiPitchControlValue = DEFAULT_MIDI_NOTE
  saveSettings()
})

dom.pitchBendInput.addEventListener("change", () => {
  if (dom.pitchBendInput.value === "nil") pitchBendControl(0)
  saveSettings()
})

dom.aftertouchInput.addEventListener("change", () => {
  if (dom.aftertouchInput.value === "nil") aftertouchControl(0)
  saveSettings()
})

dom.cc1Input.addEventListener("change", () => { if (dom.cc1Input.value === "nil") cc1Fn(0); saveSettings() })
dom.cc2Input.addEventListener("change", () => { if (dom.cc2Input.value === "nil") cc2Fn(0); saveSettings() })
dom.cc3Input.addEventListener("change", () => { if (dom.cc3Input.value === "nil") cc3Fn(0); saveSettings() })
dom.cc4Input.addEventListener("change", () => { if (dom.cc4Input.value === "nil") cc4Fn(0); saveSettings() })

dom.midi1NoteInput.onchange = () => { state.midi1Note = dom.midi1NoteInput.value; saveSettings() }
dom.midi2NoteInput.onchange = () => { state.midi2Note = dom.midi2NoteInput.value; saveSettings() }
dom.midi3NoteInput.onchange = () => { state.midi3Note = dom.midi3NoteInput.value; saveSettings() }

// ============================================================
// BPM slider
// ============================================================
dom.bpm.addEventListener("input", () => {
  state.tempo = 60000 / dom.bpm.value
  dom.bpmValue.innerHTML = dom.bpm.value
  saveSettings()
})

dom.sliderMinValueInput.addEventListener("input", () => {
  state.minVal = Number.parseInt(dom.sliderMinValueInput.value, 10)
  state.maxVal = Number.parseInt(dom.sliderMaxValueInput.value, 10)
  if (state.minVal < state.maxVal) {
    dom.bpm.min = state.minVal
    if (Number.parseInt(dom.bpm.value, 10) < state.minVal) {
      dom.bpm.value = state.minVal
      dom.bpmValue.textContent = state.minVal
    }
  }
  saveSettings()
})

dom.sliderMaxValueInput.addEventListener("input", () => {
  state.minVal = Number.parseInt(dom.sliderMinValueInput.value, 10)
  state.maxVal = Number.parseInt(dom.sliderMaxValueInput.value, 10)
  if (state.maxVal > state.minVal) {
    dom.bpm.max = state.maxVal
    if (Number.parseInt(dom.bpm.value, 10) > state.maxVal) {
      dom.bpm.value = state.maxVal
      dom.bpmValue.textContent = state.maxVal
    }
  }
  saveSettings()
})

// ============================================================
// Save on toggle/select changes
// ============================================================
const saveOnChangeIds = [
  "selfie", "showTracking", "sendMidi", "gesture",
  "midiChannel", "trigger1Channel", "trigger2Channel", "trigger3Channel",
  "BPMAutomateInput", "midiVelInput",
  "cc1Controller", "cc1Channel", "cc2Controller", "cc2Channel",
  "cc3Controller", "cc3Channel", "cc4Controller", "cc4Channel",
]
saveOnChangeIds.forEach(id => {
  const el = document.getElementById(id)
  if (el) el.addEventListener("change", () => saveSettings())
})

// ============================================================
// Selfie toggle → MediaPipe
// ============================================================
dom.selfie.addEventListener("change", function () {
  if (state.hands) state.hands.setOptions({ selfieMode: this.checked })
})

// ============================================================
// Device change
// ============================================================
dom.device.addEventListener("change", () => changeDevice(dom.device))

// ============================================================
// Initialize everything
// ============================================================
initMidi(dom.device, () => loadSettings(dom))
initCamera(dom.videoSelect)
initTracking(dom)
initPresets(dom)
