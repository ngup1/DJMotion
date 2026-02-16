# DJMotion

A browser-based MIDI controller that translates real-time hand gestures and movements — captured through your webcam — into MIDI messages. Built for Google DevFest WashU 2025. Point your hands at the camera, and DJMotion sends notes, CC values, pitch bend, and aftertouch to any connected MIDI device or DAW.

## How It Works

1. **MediaPipe Hands** detects up to 2 hands via your webcam at ~30 FPS
2. Hand landmark positions (index finger, wrist, thumb, pinky) are extracted each frame
3. Positions are mapped to MIDI controls you configure in the UI
4. **WebMidi.js** sends the resulting MIDI messages to your chosen output device

## Features

### Camera Controls
- Selfie view toggle (mirror camera feed)
- Hand tracking visualization toggle
- Camera selection dropdown
- Real-time FPS display

### MIDI Controls
- MIDI device selection
- MIDI channel selection (1-16)
- Note pitch control (hand-mapped or fixed at C4)
- Note velocity control (hand-mapped or max)
- BPM automation (hand-mapped or manual slider)
- BPM slider (20-500 BPM, adjustable min/max)

### Continuous Controls
- Pitch bend
- Aftertouch
- 4 customizable CC controls, each with:
  - Channel selection (1-16)
  - CC number (0-127)
  - Hand movement mapping

### Gesture Recognition
Three built-in gestures that trigger MIDI notes:
1. Index fingers touching
2. Back of left hand facing screen
3. Back of right hand facing screen

Each gesture can be configured with:
- MIDI channel (1-16)
- MIDI note (0-127)

### Movement Mapping
The following hand movements can be mapped to any control:
- Left/Right index finger X position
- Left/Right index finger Y position
- Left/Right hand open/closed state
- Distance between index fingers

### Preset System
Save and load named presets. All settings persist across sessions via localStorage.

### Visual Feedback
Color-coded vignette flash on the video canvas when gestures trigger (indigo, green, amber).

## Requirements

- **Browser**: Chrome, Firefox, or Edge (Safari does not support Web MIDI)
- **Webcam**
- **MIDI device** (physical or virtual)
- **Windows users**: [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) or VBAN-2-Midi as a virtual MIDI bridge

## Setup

### 1. Install and run

```bash
npm install
npx http-server
```

Then open `http://localhost:8080` in your browser.

### 2. Allow permissions

1. Allow **camera access** when prompted
2. Allow **MIDI access** when prompted
3. Select your MIDI output device from the dropdown

### 3. Setting up Virtual MIDI on macOS

1. Open **Audio MIDI Setup** (Applications > Utilities > Audio MIDI Setup)
2. Click **Window > Show MIDI Studio**
3. Click the **"+"** button to create a virtual MIDI device
4. Name your device and click Apply
5. Select it in DJMotion's MIDI device dropdown

### 4. Setting up Virtual MIDI on Windows

1. Download and install [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) or VBAN-2-Midi
2. Create a virtual MIDI port
3. Select it in DJMotion's MIDI device dropdown

## Usage

1. Enable **"Send MIDI notes"** to start sending continuous MIDI notes based on hand presence
2. Enable **"Gestures"** to use the three built-in gesture triggers
3. Map hand movements to different controls using the dropdowns
4. Adjust MIDI channels and CC numbers as needed
5. Use the BPM slider or automate it with hand movements
6. Save your configuration as a preset for next time
7. Monitor FPS and tracking visualization as needed

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Hand tracking | [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) (v0.3, via CDN) |
| MIDI output | [WebMidi.js](https://webmidijs.org/) (v3.x) |
| Camera input | MediaPipe Camera Utils |
| Server | http-server (development only) |
| Frontend | Vanilla HTML/CSS/JS (no framework, no build step) |

## Project Structure

```
index.html           UI layout and control panel
appstyle.css         Dark theme styling with responsive breakpoints
package.json         Dependencies (webmidi, http-server)
js/
  main.js            Entry point — DOM refs, event wiring, initialization
  constants.js       All named constants (thresholds, ranges, config)
  utils.js           Math utilities (scaleValue, clamp, linearScale)
  state.js           Shared mutable state object
  midi.js            MIDI init, device management, note loop, control functions
  gestures.js        Gesture triggers with hysteresis + visual flash
  mapping.js         Hand movement → MIDI control routing
  camera.js          Camera enumeration and stream handling
  tracking.js        MediaPipe Hands setup + onResults callback
  persistence.js     localStorage save/load + preset system
```

## Acknowledgments

DJMotion is built upon [Handmate MIDI](https://github.com/monlim/handmate-midi) by **Monica Lim**. Her original project established the core concept of using MediaPipe hand tracking to generate MIDI messages in the browser. DJMotion extends her work and code with modular architecture, presets, settings persistence, visual feedback, and extracted constants for easier tuning. Thank you to Monica, and feel free to contribute more features! 
