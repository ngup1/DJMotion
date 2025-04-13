"use client";

import { useEffect } from "react";

export default function GestureMidiEngine() {
  useEffect(() => {
    const externalScripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3/hands.min.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.min.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.min.js",
      "https://cdn.jsdelivr.net/npm/webmidi"
    ];

    externalScripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    const gestureScript = document.createElement("script");
    gestureScript.src = "/scripts/gesture-midi.js"; // Ensure this is in public/scripts
    gestureScript.async = true;
    document.body.appendChild(gestureScript);

    return () => {
      externalScripts.forEach((src) => {
        const s = document.querySelector(`script[src="${src}"]`);
        if (s) s.remove();
      });
      document.body.removeChild(gestureScript);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Core video/canvas inputs */}
      <video className="input_video" style={{ display: "none" }}></video>
      <canvas className="output_canvas" width="1280" height="720" />

      {/* Required hidden inputs */}
      <div style={{ display: "none" }}>
        <select id="videoSource" />
        <select id="device" />
        <input id="bpm" type="range" min="60" max="180" defaultValue="120" />
        <input id="sendMidi" type="checkbox" defaultChecked />
        <input id="gesture" type="checkbox" defaultChecked />
        <input id="selfie" type="checkbox" defaultChecked />
        <span id="fps" />

        <input id="BPMAutomateInput" defaultValue="nil" />
        <input id="sliderMinValue" defaultValue="60" />
        <input id="sliderMaxValue" defaultValue="180" />
        <input id="midiChannel" defaultValue="1" />
        <input id="trigger1Channel" defaultValue="1" />
        <input id="trigger2Channel" defaultValue="1" />
        <input id="trigger3Channel" defaultValue="1" />
        <input id="midi1NoteInput" defaultValue="60" />
        <input id="midi2NoteInput" defaultValue="62" />
        <input id="midi3NoteInput" defaultValue="64" />

        <input id="midiPitchControlInput" defaultValue="nil" />
        <input id="midiVelInput" defaultValue="nil" />
        <input id="pitchBendInput" defaultValue="nil" />
        <input id="aftertouchInput" defaultValue="nil" />

        <input id="cc1Input" defaultValue="nil" />
        <input id="cc1Controller" defaultValue="74" />
        <input id="cc1Channel" defaultValue="1" />

        <input id="cc2Input" defaultValue="nil" />
        <input id="cc2Controller" defaultValue="71" />
        <input id="cc2Channel" defaultValue="1" />

        <input id="cc3Input" defaultValue="nil" />
        <input id="cc3Controller" defaultValue="10" />
        <input id="cc3Channel" defaultValue="1" />

        <input id="cc4Input" defaultValue="nil" />
        <input id="cc4Controller" defaultValue="91" />
        <input id="cc4Channel" defaultValue="1" />
      </div>
    </div>
  );
}
