import { useEffect, useState } from "react";
import { stopDrone } from "./audio.ts";
import { bufferRms, detectPitch } from "./pitch.ts";

export function useMic(listening: boolean): { freq: number | null; rms: number; error: string } {
  const [freq, setFreq] = useState<number | null>(null);
  const [rms, setRms] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!listening) {
      setFreq(null);
      setRms(0);
      return;
    }
    let dead = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let actx: AudioContext | null = null;
    stopDrone();
    setError("");

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        });
        if (dead) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        actx = new AudioContext();
        const source = actx.createMediaStreamSource(stream);
        const analyser = actx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        const buf = new Float32Array(analyser.fftSize);
        let last = 0;
        const tick = (time: number) => {
          raf = requestAnimationFrame(tick);
          if (time - last < 70) return;
          last = time;
          analyser.getFloatTimeDomainData(buf);
          const level = bufferRms(buf);
          const heard = detectPitch(buf, actx?.sampleRate ?? 44100);
          setRms(level);
          setFreq(heard);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        if (!dead) setError("The browser did not open the microphone. Allow it in the address bar, or keep using the written checks. The course does not depend on a mic.");
      }
    };

    void start();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
      void actx?.close();
    };
  }, [listening]);

  return { freq, rms, error };
}
