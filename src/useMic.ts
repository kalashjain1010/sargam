import { useEffect, useState } from "react";
import { hush, stopDrone } from "./audio.ts";
import { idleFrame, PitchTracker } from "./pitch.ts";
import type { PitchFrame } from "./pitch.ts";

type Listener = (frame: PitchFrame, error: string) => void;

const listeners = new Set<Listener>();
const tracker = new PitchTracker();

let stream: MediaStream | null = null;
let actx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let buf: Float32Array | null = null;
let raf = 0;
let lastTick = 0;
let startLock: Promise<void> | null = null;
let lastError = "";

function broadcast(frame: PitchFrame) {
  for (const listener of listeners) listener(frame, lastError);
}

function stopEngine() {
  cancelAnimationFrame(raf);
  raf = 0;
  lastTick = 0;
  analyser = null;
  buf = null;
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  if (actx) {
    void actx.close();
    actx = null;
  }
  tracker.reset();
}

function tick(time: number) {
  raf = requestAnimationFrame(tick);
  if (!actx || !analyser || !buf || time - lastTick < 36) return;
  lastTick = time;
  analyser.getFloatTimeDomainData(buf as Float32Array<ArrayBuffer>);
  broadcast(tracker.push(buf, actx.sampleRate, time));
}

async function startEngine(): Promise<void> {
  if (stream && actx) return;
  stopDrone();
  hush();
  lastError = "";
  const next = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
    },
  });
  stream = next;
  actx = new AudioContext();
  if (actx.state === "suspended") await actx.resume();
  const source = actx.createMediaStreamSource(next);
  const hip = actx.createBiquadFilter();
  hip.type = "highpass";
  hip.frequency.value = 48;
  hip.Q.value = 0.7;
  analyser = actx.createAnalyser();
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0;
  source.connect(hip);
  hip.connect(analyser);
  buf = new Float32Array(analyser.fftSize);
  tracker.reset();
  raf = requestAnimationFrame(tick);
}

async function subscribe(listener: Listener): Promise<void> {
  listeners.add(listener);
  if (!startLock) {
    startLock = startEngine().catch(() => {
      lastError = "The browser did not open the microphone. Allow it in the address bar, or keep using the written checks. The course does not depend on a mic.";
      broadcast(idleFrame());
    });
  }
  await startLock;
  if (lastError) listener(idleFrame(), lastError);
}

function unsubscribe(listener: Listener) {
  listeners.delete(listener);
  if (listeners.size === 0) {
    startLock = null;
    lastError = "";
    stopEngine();
  }
}

export function useMic(listening: boolean): PitchFrame & { error: string } {
  const [frame, setFrame] = useState<PitchFrame>(idleFrame);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listening) {
      setFrame(idleFrame());
      setError("");
      return;
    }
    const listener: Listener = (next, nextError) => {
      setFrame(next);
      setError(nextError);
    };
    void subscribe(listener);
    return () => unsubscribe(listener);
  }, [listening]);

  return { ...frame, error };
}
