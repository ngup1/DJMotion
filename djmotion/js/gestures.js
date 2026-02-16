import state from "./state.js"
import {
  FINGER_TOUCH_ACTIVATE, FINGER_TOUCH_DEACTIVATE,
  HAND_FLIP_ACTIVATE, HAND_FLIP_DEACTIVATE,
  GESTURE_NOTE_DURATION, GESTURE_FLASH_DURATION,
  GESTURE_FLASH_COLOR_1, GESTURE_FLASH_COLOR_2, GESTURE_FLASH_COLOR_3,
} from "./constants.js"

let t1on = false
let t2on = false
let t3on = false

export function flashGesture(color) {
  state.gestureFlashColor = color
  state.gestureFlashEnd = performance.now() + GESTURE_FLASH_DURATION
}

export function Trigger1(distance, trigger1ChannelEl) {
  if (distance <= FINGER_TOUCH_ACTIVATE) {
    if (t1on) return
    t1on = true
    flashGesture(GESTURE_FLASH_COLOR_1)
    state.output.playNote(state.midi1Note, [trigger1ChannelEl.value], {
      attack: 1,
      duration: GESTURE_NOTE_DURATION,
    })
  }
  if (distance > FINGER_TOUCH_DEACTIVATE) {
    t1on = false
  }
}

export function Trigger2(leftThumbX, leftPinkyX, trigger2ChannelEl) {
  if (leftThumbX - leftPinkyX <= HAND_FLIP_ACTIVATE) {
    if (t2on) return
    t2on = true
    flashGesture(GESTURE_FLASH_COLOR_2)
    state.output.playNote(state.midi2Note, [trigger2ChannelEl.value], {
      attack: 1,
      duration: GESTURE_NOTE_DURATION,
    })
  }
  if (leftThumbX - leftPinkyX > HAND_FLIP_DEACTIVATE) {
    t2on = false
  }
}

export function Trigger3(rightThumbX, rightPinkyX, trigger3ChannelEl) {
  if (rightPinkyX - rightThumbX <= HAND_FLIP_ACTIVATE) {
    if (t3on) return
    t3on = true
    flashGesture(GESTURE_FLASH_COLOR_3)
    state.output.playNote(state.midi3Note, [trigger3ChannelEl.value], {
      attack: 1,
      duration: GESTURE_NOTE_DURATION,
    })
  }
  if (rightPinkyX - rightThumbX > HAND_FLIP_DEACTIVATE) {
    t3on = false
  }
}

export function drawGestureFlash(ctx, width, height) {
  if (performance.now() >= state.gestureFlashEnd) return
  const remaining = state.gestureFlashEnd - performance.now()
  const alpha = remaining / GESTURE_FLASH_DURATION
  ctx.save()
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.3,
    width / 2, height / 2, height * 0.75
  )
  gradient.addColorStop(0, "transparent")
  gradient.addColorStop(1, state.gestureFlashColor)
  ctx.globalAlpha = alpha
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  ctx.restore()
}
