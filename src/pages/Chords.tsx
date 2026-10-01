import { ChordFinder, ChordMethod, OpenDictionary, BarreShapes, CircleFifths } from "../components/widgets.tsx";
import { CHORD_STEPS } from "../theory.ts";

export function ChordsPage() {
  return (
    <div className="home wide">
      <p className="eyebrow">Chord lab</p>
      <h1>Hear the lowest note. Then ask: bright or sad?</h1>
      <p className="lede">
        A chord name is a letter plus a mood. If the bass is G and the chord sounds bright, it is G major. If it sounds sad, it is G minor. Tap a grip below — you hear a real acoustic strum, string by string, not a piano stack. Do that four times and you have a loop. Number the loop from the chord that can end the chorus. Two slid shapes (the open E and the open A) cover every letter on the neck.
      </p>
      <ChordMethod />
      <ChordFinder />
      <OpenDictionary />
      <BarreShapes />
      <CircleFifths />
      <h2>The method, written out</h2>
      <ol className="method static">
        {CHORD_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
