import state from "./state.js"
import { DEFAULT_MIDI_NOTE } from "./constants.js"

const STORAGE_KEY = "djmotion_settings"
const PRESETS_STORAGE_KEY = "djmotion_presets"

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
  // Number / range inputs
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
  // MIDI device (may not exist on next load)
  { id: "device", type: "select" },
]

export function gatherSettings() {
  const settings = {}
  PERSISTABLE_CONTROLS.forEach(({ id, type }) => {
    const el = document.getElementById(id)
    if (!el) return
    settings[id] = type === "checkbox" ? el.checked : el.value
  })
  return settings
}

export function applySettings(settings, dom) {
  if (!settings) return
  PERSISTABLE_CONTROLS.forEach(({ id, type }) => {
    if (!(id in settings)) return
    const el = document.getElementById(id)
    if (!el) return
    if (type === "checkbox") {
      el.checked = settings[id]
    } else {
      if (type === "select") {
        const options = Array.from(el.options).map(o => o.value)
        if (!options.includes(settings[id])) return
      }
      el.value = settings[id]
    }
  })

  // Sync JS state with restored DOM values
  state.tempo = 60000 / dom.bpm.value
  dom.bpmValue.textContent = dom.bpm.value
  state.minVal = dom.sliderMinValueInput.value
  state.maxVal = dom.sliderMaxValueInput.value
  dom.bpm.min = state.minVal
  dom.bpm.max = state.maxVal
  state.midi1Note = dom.midi1NoteInput.value
  state.midi2Note = dom.midi2NoteInput.value
  state.midi3Note = dom.midi3NoteInput.value

  if (state.hands) {
    state.hands.setOptions({ selfieMode: dom.selfie.checked })
  }

  if (settings.device) {
    const match = WebMidi.outputs.find(o => o.name === settings.device)
    if (match) state.output = match
  }
}

let saveTimeout = null
export function saveSettings() {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gatherSettings()))
    } catch (e) {
      console.warn("Could not save settings:", e)
    }
  }, 200)
}

export function loadSettings(dom) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      applySettings(JSON.parse(raw), dom)
    }
  } catch (e) {
    console.warn("Could not load settings:", e)
  }
}

// Presets
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

function populatePresetDropdown(presetSelectEl) {
  if (!presetSelectEl) return
  const presets = getPresets()
  while (presetSelectEl.options.length > 1) {
    presetSelectEl.remove(1)
  }
  Object.keys(presets).sort().forEach(name => {
    const opt = document.createElement("option")
    opt.value = name
    opt.text = name
    presetSelectEl.appendChild(opt)
  })
}

export function initPresets(dom) {
  const { presetSelect, presetSaveBtn, presetDeleteBtn } = dom

  populatePresetDropdown(presetSelect)

  if (presetSelect) {
    presetSelect.addEventListener("change", () => {
      const name = presetSelect.value
      if (!name) return
      const presets = getPresets()
      if (presets[name]) {
        applySettings(presets[name], dom)
        saveSettings()
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
      populatePresetDropdown(presetSelect)
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
      populatePresetDropdown(presetSelect)
      presetSelect.value = ""
    })
  }
}
