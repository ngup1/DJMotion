// Timing
export const DEFAULT_TEMPO = 500 // milliseconds between notes (BPM 120)
export const DEFAULT_MIDI_NOTE = 60 // C4
export const DEFAULT_VELOCITY = 1
export const NOTE_DURATION_RATIO = 0.8 // note plays for 80% of tempo interval
export const GESTURE_NOTE_DURATION = 500 // ms a gesture-triggered note lasts

// Hand tracking thresholds
export const FINGER_TOUCH_ACTIVATE = 0.02
export const FINGER_TOUCH_DEACTIVATE = 0.05
export const HAND_FLIP_ACTIVATE = -0.1
export const HAND_FLIP_DEACTIVATE = 0
export const HAND_CLOSED_MIN_DIST = 0.1
export const HAND_CLOSED_MAX_DIST = 0.4
export const RIGHT_HAND_CLOSED_MIN_DIST = 0

// MIDI value ranges
export const MIDI_NOTE_MIN = 1
export const MIDI_NOTE_MAX = 127
export const CC_VALUE_MIN = 0
export const CC_VALUE_MAX = 127
export const PITCH_BEND_MIN = -1
export const PITCH_BEND_MAX = 1

// MediaPipe / canvas
export const CANVAS_WIDTH = 1280
export const CANVAS_HEIGHT = 720
export const MIN_DETECTION_CONFIDENCE = 0.5
export const MIN_TRACKING_CONFIDENCE = 0.5
export const MAX_HANDS = 2
export const MODEL_COMPLEXITY = 1

// Hand landmark indices
export const LANDMARK_INDEX_FINGER = 8
export const LANDMARK_WRIST = 0
export const LANDMARK_THUMB = 4
export const LANDMARK_PINKY = 20

// Landmark visualization
export const LANDMARK_Z_NEAR = -0.15
export const LANDMARK_Z_FAR = 0.1
export const LANDMARK_RADIUS_MAX = 10
export const LANDMARK_RADIUS_MIN = 1

// FPS
export const FPS_UPDATE_INTERVAL = 1000

// Gesture feedback
export const GESTURE_FLASH_DURATION = 300
export const GESTURE_FLASH_COLOR_1 = "rgba(99, 102, 241, 0.35)" // indigo
export const GESTURE_FLASH_COLOR_2 = "rgba(16, 185, 129, 0.35)" // green
export const GESTURE_FLASH_COLOR_3 = "rgba(245, 158, 11, 0.35)" // amber

// Tracking colors
export const RIGHT_HAND_COLOR = "#fff"
export const LEFT_HAND_COLOR = "#056df5"
