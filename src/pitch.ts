/** YIN pitch detector for a single guitar note. Returns Hz, or null when the buffer is quiet or unclear. */
export function bufferRms(buf: Float32Array): number {
  let rms = 0;
  for (let i = 0; i < buf.length; i += 1) rms += buf[i] * buf[i];
  return Math.sqrt(rms / buf.length);
}

export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  const size = buf.length;
  const rms = bufferRms(buf);
  if (rms < 0.012) return null;

  const half = Math.floor(size / 2);
  const diff = new Float32Array(half);
  for (let tau = 1; tau < half; tau += 1) {
    let sum = 0;
    for (let i = 0; i < half; i += 1) {
      const delta = buf[i] - buf[i + tau];
      sum += delta * delta;
    }
    diff[tau] = sum;
  }

  const yin = new Float32Array(half);
  yin[0] = 1;
  let running = 0;
  for (let tau = 1; tau < half; tau += 1) {
    running += diff[tau];
    yin[tau] = running === 0 ? 1 : (diff[tau] * tau) / running;
  }

  const minTau = Math.max(2, Math.floor(sampleRate / 1200));
  const maxTau = Math.min(half - 2, Math.floor(sampleRate / 70));
  const threshold = 0.18;
  let tau = minTau;
  let found = -1;
  while (tau < maxTau) {
    if (yin[tau] < threshold) {
      while (tau + 1 < maxTau && yin[tau + 1] < yin[tau]) tau += 1;
      found = tau;
      break;
    }
    tau += 1;
  }
  if (found < 0) return null;

  const x0 = yin[found - 1];
  const x1 = yin[found];
  const x2 = yin[found + 1];
  const denom = 2 * x1 - x2 - x0;
  const better = denom === 0 ? found : found + (x2 - x0) / (2 * denom);
  const freq = sampleRate / better;
  if (freq < 70 || freq > 1200) return null;
  return freq;
}
