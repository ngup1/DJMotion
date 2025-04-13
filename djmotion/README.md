# DJMotion

A web-based MIDI controller that uses hand gestures through your webcam to control MIDI devices. Built with MediaPipe Hands for hand tracking and WebMidi.js for MIDI communication.

## Requirements

- A modern web browser (Chrome, Firefox, or Edge - Safari is not supported)
- A webcam
- A MIDI device (physical or virtual)
- For Windows users: loopMidi or VBAN-2-Midi as a bridge driver

## Features

### 1. Camera Controls
- Selfie view toggle
- Hand tracking visualization toggle
- Camera selection dropdown
- FPS display

### 2. MIDI Controls
- MIDI device selection
- MIDI channel selection (1-16)
- Note pitch control
- Note velocity control
- BPM automation
- BPM slider (20-500 BPM)

### 3. Continuous Controls
- Pitchbend
- Aftertouch
- 4 customizable CC controls with:
  - Channel selection (1-16)
  - CC number (0-127)
  - Control mapping

### 4. Gesture Recognition
Three built-in gestures that trigger MIDI notes:
1. Index fingers touching (👉👈)
2. Back of left hand facing screen (✋)
3. Back of right hand facing screen (✋)

Each gesture can be configured with:
- MIDI channel (1-16)
- MIDI note (0-127)

### 5. Movement Mapping
The following hand movements can be mapped to any control:
- Left index X position
- Left index Y position
- Left hand closed
- Right index X position
- Right index Y position
- Right hand closed
- Index finger distance

## Setup

1. Open the application in a supported browser (Chrome, Firefox, or Edge)
2. Allow camera access when prompted
3. Allow MIDI access when prompted
4. Select your MIDI output device from the dropdown

### Setting up Virtual MIDI on macOS
1. Open Audio MIDI Setup (Applications → Utilities → Audio MIDI Setup)
2. Click Window → Show MIDI Studio
3. Click the "+" button to create a virtual MIDI device
4. Name your device and click Apply

### Setting up Virtual MIDI on Windows
1. Download and install loopMidi or VBAN-2-Midi
2. Create a virtual MIDI port
3. Select it in the application's MIDI device dropdown

## Usage

1. Enable "Send MIDI notes" to start sending continuous MIDI notes based on hand presence
2. Enable "Gestures" to use the three built-in gesture triggers
3. Map hand movements to different controls using the dropdowns
4. Adjust MIDI channels and CC numbers as needed
5. Use the BPM slider or automate it with hand movements
6. Monitor FPS and tracking visualization as needed

## Demo

Check out the demo video: [YouTube Demo](https://youtu.be/H97t17Q_BbM)

## Technical Details

- Hand tracking: MediaPipe Hands
- MIDI communication: WebMidi.js
- Camera handling: MediaDevices API
- Graphics: HTML Canvas

## Offline Version

An offline version is available at: https://github.com/monlim/Handmate-MIDI-Offline

## Credits

- WebMidi API: https://webmidijs.org/
- MediaPipe: https://google.github.io/mediapipe/
- Thanks to Natalia Kotsani and Mirza Ceyzar for development help
