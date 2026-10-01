import { Link } from "react-router-dom";
import { DAY_COUNT, DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";

export function HomePage() {
  const { passed, stamps, gym, ear } = useProgress();
  const next = DAYS.find((day) => !passed.includes(day.id)) ?? null;
  const done = passed.length;
  const pct = Math.round((done / DAY_COUNT) * 100);

  return (
    <div className="home">
      <p className="eyebrow">{DAY_COUNT} days · guitar in your lap · letters A to G</p>
      <h1>You can already play songs. This site teaches why the shapes work.</h1>
      <p className="lede">
        Think of the neck as a ruler. Each fret is one step. The letters C D E F G A B never move. A song picks one letter as home — the note that feels finished, like the last word of a sentence. A scale is which steps you are allowed to walk. A chord is three letters sounded together. Hindi film songs and English pop sit next to each other because they reuse the same loops, not because they speak a secret language.
      </p>
      {next ? (
        <Link className="hero-card" to={`/day/${next.id}`}>
          <em>{done === 0 ? "Start here" : "Continue"}</em>
          <strong>
            Day {next.id} · {next.title}
          </strong>
          <span>{next.promise}</span>
          <i className="bar">
            <b style={{ width: `${pct}%` }} />
          </i>
          <small>
            {done} of {DAY_COUNT} days · {pct}%
          </small>
        </Link>
      ) : (
        <Link className="hero-card" to="/gym">
          <em>Path complete</em>
          <strong>Make the neck automatic</strong>
          <span>The gym and the ear room are the rest of your life on the instrument.</span>
        </Link>
      )}
      <div className="lab-grid">
        <Link className="lab-tile" to="/train">
          <em>AI</em>
          <strong>Train</strong>
          <span>Free AI coach. Ask anything.</span>
        </Link>
        <Link className="lab-tile" to="/tune">
          <em>Strings</em>
          <strong>Tune</strong>
          <span>Standard, drop, open, DADGAD</span>
        </Link>
        <Link className="lab-tile" to="/gym">
          <em>Fretboard</em>
          <strong>Gym</strong>
          <span>{gym.hits ? `${gym.hits} hits` : "Find every A, then every B…"}</span>
        </Link>
        <Link className="lab-tile" to="/ear">
          <em>Listening</em>
          <strong>Ear</strong>
          <span>{ear.hits ? `${ear.hits} hits` : "Hear two notes. Name the gap."}</span>
        </Link>
        <Link className="lab-tile" to="/chords">
          <em>Harmony</em>
          <strong>Chords</strong>
          <span>Bass first, then happy or sad</span>
        </Link>
        <Link className="lab-tile" to="/songs">
          <em>Repertoire</em>
          <strong>Songs</strong>
          <span>Real titles. Loops you can move.</span>
        </Link>
        <Link className="lab-tile" to="/ragas">
          <em>Collections</em>
          <strong>Scales</strong>
          <span>Hear a box, drill it, make your own</span>
        </Link>
        <Link className="lab-tile" to="/tests">
          <em>Train more</em>
          <strong>Tests</strong>
          <span>Fail it. Read why. Take it again.</span>
        </Link>
        <Link className="lab-tile" to="/practice">
          <em>Mic optional</em>
          <strong>Practice</strong>
          <span>{stamps.includes("held-sa") ? "Home held in tune" : "Pick a home. Play one note."}</span>
        </Link>
        <Link className="lab-tile" to="/coach">
          <em>Microphone</em>
          <strong>Mic</strong>
          <span>Play one string. See the letter.</span>
        </Link>
        <Link className="lab-tile" to="/watch">
          <em>Teachers</em>
          <strong>Videos</strong>
          <span>Watch, then tap the neck</span>
        </Link>
      </div>
      {done === DAY_COUNT ? (
        <aside className="certificate">
          <p className="eyebrow">Path complete</p>
          <h2>You can find home, name a gap in frets, hear a four-chord loop, and slide a shape to any letter.</h2>
          <p>A new song starts with the note that feels finished. Then three melody notes. Then a capo if the shapes are hard. Keep the gym and the ear room warm.</p>
        </aside>
      ) : null}
      <ol className="day-list">
        {DAYS.map((day) => {
          const clear = passed.includes(day.id);
          return (
            <li key={day.id} className={clear ? "clear" : "open"}>
              <Link to={`/day/${day.id}`}>
                <span className="num">{day.id}</span>
                <span>
                  <strong>{day.title}</strong>
                  <em>
                    {day.unit} · {day.kicker}
                  </em>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
