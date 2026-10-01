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
      <h1>Play one string. I will name the letter and say why it missed.</h1>
      <p className="lede">
        Hold the guitar near the mic. Pluck one string and let it ring — like talking clearly, not shouting over a crowd. A full strum looks like noise because several notes arrive at once. A bend looks “out” in the middle because the pitch is still travelling. Judge the landing. Written days still work if you leave the mic off. Tune the open strings first on the <Link to="/tune">tuner</Link> — then this page is checking your fingers, not the pegs.
      </p>
      <PitchCoach
        saPc={saPc}
        scale={MAJOR}
        onStable={() => stamp("held-sa")}
      />
      <h2>Hold a target</h2>
      <p className="muted">Home is whatever you last set in Practice, like a bookmark. Change it there if you want a different letter.</p>
      <PitchCoach saPc={saPc} targetPc={saPc} />
      <PhraseCoach />
      <p className="muted">
        Need a scale map while you play? The <Link to="/practice">practice room</Link> labels the neck. Need to name distances without a guitar? The <Link to="/ear">ear gym</Link>.
      </p>
    </div>
  );
}
