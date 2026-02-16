# DJMotion (Handmate MIDI)

A browser-based MIDI controller that translates real-time hand gestures and movements — captured through your webcam — into MIDI messages. Built for Google DevFest WashU 2025.

Point your hands at the camera, and DJMotion sends notes, CC values, pitch bend, and aftertouch to any connected MIDI device or DAW.

## How It Works

1. **MediaPipe Hands** detects up to 2 hands via your webcam at ~30 FPS
2. Hand landmark positions (index finger, wrist, thumb, pinky) are extracted each frame
3. Positions are mapped to MIDI controls you configure in the UI
4. **WebMidi.js** sends the resulting MIDI messages to your chosen output device

## Features

**MIDI Note Generation** — Continuous stream of notes at a configurable BPM (20-500), with hand-controlled pitch and velocity.

**Movement Mapping** — Map any of 7 hand inputs to any MIDI output:
- Left/Right index finger X and Y position
- Left/Right hand open/closed state
- Distance between index fingers

**Gesture Triggers** — 3 gesture-triggered MIDI notes with hysteresis to prevent jitter:
- Index fingers touching
- Left hand flipped (back of hand facing camera)
- Right hand flipped

**Continuous Controls** — Pitch bend, aftertouch, and 4 independent CC controls, each with configurable channel and CC number.

**Preset System** — Save and load named presets. All settings persist across sessions via localStorage.

**Visual Feedback** — Color-coded vignette flash on the video canvas when gestures trigger (indigo, green, amber).

## Requirements

- **Browser**: Chrome, Firefox, or Edge (Safari does not support Web MIDI)
- **Webcam**
- **MIDI device** (physical or virtual)

## Quick Start

```bash
cd djmotion
npm install
npx http-server
```

Then open `http://localhost:8080` in your browser.

1. Allow camera and MIDI access when prompted
2. Select your MIDI output device from the dropdown
3. Enable "Send MIDI notes" or "Gestures" to start
4. Map hand movements to controls using the dropdowns
5. Save your configuration as a preset for next time

### Virtual MIDI Setup

**macOS**: Open Audio MIDI Setup (Applications > Utilities), click Window > Show MIDI Studio, click "+" to create a virtual MIDI device.

**Windows**: Install [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) and create a virtual MIDI port.

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
djmotion/
  index.html       UI layout and control panel
  script.js        Hand tracking, MIDI logic, gesture detection, presets
  appstyle.css     Dark theme styling with responsive breakpoints
  package.json     Dependencies (webmidi, http-server)
```
