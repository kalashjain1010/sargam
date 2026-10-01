import { Link } from "react-router-dom";
import { DAY_COUNT, DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";

export function HomePage() {
  const { passed, stamps, isOpen, gym, ear } = useProgress();
  const next = DAYS.find((day) => isOpen(day.id) && !passed.includes(day.id)) ?? null;
  const done = passed.length;
  const pct = Math.round((done / DAY_COUNT) * 100);

  return (
    <div className="home">
      <p className="eyebrow">{DAY_COUNT} days · guitar in your lap · letters on the neck</p>
      <h1>You can play the song. Now the letters stop being a mystery.</h1>
      <p className="lede">
        C D E F G A B, counted in frets. A path you can actually finish, then a gym, an ear room, a chord lab, and a pile of real songs as practice beds. Hindi film songs sit next to English pop because they share loops, not because they share a secret alphabet.
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
        <Link className="lab-tile" to="/gym">
          <em>Fretboard</em>
          <strong>Gym</strong>
          <span>{gym.hits ? `${gym.hits} hits` : "Find every letter"}</span>
        </Link>
        <Link className="lab-tile" to="/ear">
          <em>Listening</em>
          <strong>Ear</strong>
          <span>{ear.hits ? `${ear.hits} hits` : "Name scales and chords"}</span>
        </Link>
        <Link className="lab-tile" to="/chords">
          <em>Harmony</em>
          <strong>Chords</strong>
          <span>Find them from notes</span>
        </Link>
        <Link className="lab-tile" to="/songs">
          <em>Repertoire</em>
          <strong>Songs</strong>
          <span>Modern beds, real titles</span>
        </Link>
        <Link className="lab-tile" to="/ragas">
          <em>Collections</em>
          <strong>Scales</strong>
          <span>Major through blues</span>
        </Link>
        <Link className="lab-tile" to="/practice">
          <em>Mic optional</em>
          <strong>Practice</strong>
          <span>{stamps.includes("held-sa") ? "Home held in tune" : "Play one note"}</span>
        </Link>
        <Link className="lab-tile" to="/coach">
          <em>Microphone</em>
          <strong>Mic</strong>
          <span>Hear you, name the mistake</span>
        </Link>
        <Link className="lab-tile" to="/watch">
          <em>Teachers</em>
          <strong>Videos</strong>
          <span>YouTube inside the app</span>
        </Link>
      </div>
      {done === DAY_COUNT ? (
        <aside className="certificate">
          <p className="eyebrow">Path complete</p>
          <h2>You can find home, name the distance, hear a loop, and barre it in any letter.</h2>
          <p>A new song starts with the resting note, then three melody frets, then a capo. Keep the gym and the ear room warm.</p>
        </aside>
      ) : null}
      <ol className="day-list">
        {DAYS.map((day) => {
          const open = isOpen(day.id);
          const clear = passed.includes(day.id);
          return (
            <li key={day.id} className={clear ? "clear" : open ? "open" : "shut"}>
              {open ? (
                <Link to={`/day/${day.id}`}>
                  <span className="num">{day.id}</span>
                  <span>
                    <strong>{day.title}</strong>
                    <em>
                      {day.unit} · {day.kicker}
                    </em>
                  </span>
                </Link>
              ) : (
                <div>
                  <span className="num">{day.id}</span>
                  <span>
                    <strong>{day.title}</strong>
                    <em>Opens after day {day.id - 1}</em>
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
