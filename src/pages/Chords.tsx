import { ChordFinder, ChordMethod, OpenDictionary, BarreShapes, CircleFifths } from "../components/widgets.tsx";
import { CHORD_STEPS } from "../theory.ts";

export function ChordsPage() {
  return (
    <div className="home wide">
      <p className="eyebrow">Chord lab</p>
      <h1>Bass first. Quality second. Family third.</h1>
      <p className="lede">
        You already grab shapes. This room names them, finds them from notes, and shows how two barre grips cover twelve keys. Nothing here is a copied song melody. The loops in Songs are the homework.
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
