export function initCamera(videoSelectEl) {
  const selectors = [videoSelectEl]

  function gotDevices(deviceInfos) {
    const values = selectors.map((select) => select.value)
    selectors.forEach((select) => {
      while (select.firstChild) {
        select.removeChild(select.firstChild)
      }
    })
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i]
      const option = document.createElement("option")
      option.value = deviceInfo.deviceId
      if (deviceInfo.kind === "videoinput") {
        option.text = deviceInfo.label || `camera ${videoSelectEl.length + 1}`
        videoSelectEl.appendChild(option)
      }
    }
    selectors.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex]
      }
    })
  }

  function gotStream(stream) {
    // Find the video element at call time (not closure time)
    const videoEl = document.getElementsByClassName("input_video")[0]
    window.stream = stream
    videoEl.srcObject = stream
    return navigator.mediaDevices.enumerateDevices()
  }

  function handleError(error) {
    console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name)
  }

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError)

  videoSelectEl.onchange = () => {
    const videoSource = videoSelectEl.value
    const constraints = {
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    }
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError)
  }
}
