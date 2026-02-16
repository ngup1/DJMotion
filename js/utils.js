export function scaleValue(value, inMin, inMax, outMin, outMax) {
  if (inMin === inMax) {
    throw new Error("Input range cannot be zero.")
  }
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function linearScale(value, inMin, inMax, outMin, outMax) {
  const scaledValue = scaleValue(value, inMin, inMax, outMin, outMax)
  return outMin < outMax ? clamp(scaledValue, outMin, outMax) : clamp(scaledValue, outMax, outMin)
}
