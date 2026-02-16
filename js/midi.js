import state from "./state.js"
import {
  NOTE_DURATION_RATIO, MIDI_NOTE_MIN, MIDI_NOTE_MAX,
  CC_VALUE_MIN, CC_VALUE_MAX, PITCH_BEND_MIN, PITCH_BEND_MAX,
} from "./constants.js"
import { clamp, linearScale } from "./utils.js"

export function initMidi(deviceSelectEl, onReady) {
  console.log("Checking Web MIDI support...")
  if (!navigator.requestMIDIAccess) {
    console.error("Web MIDI API is not supported in this browser")
    alert("Web MIDI API is not supported in this browser. Please use Chrome or Firefox.")
    return
  }

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
        WebMidi.outputs.forEach(o => console.log("Found MIDI output:", o.name))

        if (!deviceSelectEl) {
          console.error("Could not find device select element")
          return
        }

        deviceSelectEl.innerHTML = ""
        if (WebMidi.outputs.length === 0) {
          const option = document.createElement("option")
          option.value = ""
          option.text = "No MIDI devices found"
          deviceSelectEl.appendChild(option)
          console.warn("No MIDI outputs available")
          alert("No MIDI devices detected. Please connect a MIDI device and refresh the page.")
          return
        }

        WebMidi.outputs.forEach(o => {
          const option = document.createElement("option")
          option.value = o.name
          option.text = o.name
          deviceSelectEl.appendChild(option)
        })

        state.output = WebMidi.outputs[0]
        console.log("Default output set to:", state.output.name)

        if (onReady) onReady()
      }
    }))
    .catch(err => {
      console.error("Error initializing WebMidi:", err)
      alert("Error initializing MIDI: " + err.message)
    })

  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    console.warn("Safari detected. Web MIDI API is not natively supported.")
  }
}

export function changeDevice(deviceSelectEl) {
  const selectedDevice = deviceSelectEl.value
  state.output = WebMidi.outputs.find(o => o.name === selectedDevice)
  if (!state.output) {
    alert("Selected MIDI device not found.")
  }
}

export function myMidiNoteLoop(leftIndex, rightIndex, sendMidiEl, midiChannelEl) {
  state.BPMCounter++
  const now = new Date()
  const timeDiff = now.getTime() - state.BPMTracker.getTime()
  if (sendMidiEl.checked && timeDiff >= state.tempo) {
    if (leftIndex || rightIndex) {
      state.output.playNote(state.midiPitchControlValue, [midiChannelEl.value], {
        attack: state.midiVel,
        duration: state.tempo * NOTE_DURATION_RATIO,
      })
      state.BPMCounter = 0
      state.BPMTracker = new Date()
    }
  }
}

// Control functions — each maps a 0-1 input to a MIDI output
export function autoBPMControl(controlValue) {
  state.tempo = linearScale(controlValue, 0, 1, 60000 / state.minVal, 60000 / state.maxVal)
}

export function midiVelControl(controlValue) {
  state.midiVel = clamp(controlValue, 0, 1)
}

export function midiPitchControl(controlValue) {
  state.midiPitchControlValue = linearScale(controlValue, 0, 1, MIDI_NOTE_MIN, MIDI_NOTE_MAX)
}

export function pitchBendControl(controlValue) {
  if (state.output) state.output.sendPitchBend(linearScale(controlValue, 0, 1, PITCH_BEND_MIN, PITCH_BEND_MAX))
}

export function aftertouchControl(controlValue) {
  if (state.output) state.output.sendChannelAftertouch(clamp(controlValue, 0, 1), "all")
}

export function ccControl(controlValue, controllerEl, channelEl) {
  if (state.output)
    state.output.sendControlChange(
      Number(controllerEl.value),
      linearScale(controlValue, 0, 1, CC_VALUE_MIN, CC_VALUE_MAX),
      [channelEl.value]
    )
}
