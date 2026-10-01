import { Link } from "react-router-dom";
import { PhraseCoach } from "../components/PhraseCoach.tsx";
import { PitchCoach } from "../components/PitchCoach.tsx";
import { useProgress } from "../progress.tsx";
import { MAJOR } from "../theory.ts";

export function CoachPage() {
  const { saPc, stamp } = useProgress();
  return (
    <div className="home wide">
      <p className="eyebrow">Microphone lab</p>
      <h1>Play. I will name the letter, and tell you what went wrong.</h1>
      <p className="lede">
        One string at a time. The detector is honest about chords and bends: they look unstable because the pitch is moving. Written days still work if you leave the mic off.
      </p>
      <PitchCoach
        saPc={saPc}
        scale={MAJOR}
        onStable={() => stamp("held-sa")}
      />
      <h2>Hold a target</h2>
      <p className="muted">Home is whatever you last set in Practice. Change it there if you want a different letter.</p>
      <PitchCoach saPc={saPc} targetPc={saPc} />
      <PhraseCoach />
      <p className="muted">
        Need a scale map while you play? The <Link to="/practice">practice room</Link> labels the neck. Need to name distances without a guitar? The <Link to="/ear">ear gym</Link>.
      </p>
    </div>
  );
}
