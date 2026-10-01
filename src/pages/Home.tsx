import { Link } from "react-router-dom";
import { DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";

export function HomePage() {
  const { passed, stamps, isOpen, gym } = useProgress();
  const next = DAYS.find((day) => isOpen(day.id) && !passed.includes(day.id)) ?? null;
  const done = passed.length;

  return (
    <div className="home">
      <p className="eyebrow">Twelve days · guitar in your lap · letters on the neck</p>
      <h1>You can play the song. Now the letters stop being a mystery.</h1>
      <p className="lede">
        C D E F G A B, counted in frets. One lesson a day, then a gym that hides the names until you do not need them. Hindi film songs are in here as tests, not as a second alphabet. Indian names show up as a translation when a raga needs one.
      </p>
      <div className="row">
        {next ? (
          <Link className="btn" to={`/day/${next.id}`}>
            {done === 0 ? "Start day 1" : `Continue · day ${next.id}`}
          </Link>
        ) : (
          <Link className="btn" to="/gym">
            Fretboard gym
          </Link>
        )}
        <Link className="btn secondary" to="/gym">
          Gym
        </Link>
        <Link className="btn ghost" to="/songs">
          Song lab
        </Link>
      </div>
      <p className="stat-line">
        {done} of 12 days clear
        {gym.hits ? ` · ${gym.hits} gym hits` : ""}
        {stamps.includes("held-sa") ? " · home held in tune" : ""}
      </p>
      {done === 12 ? (
        <aside className="certificate">
          <p className="eyebrow">Path complete</p>
          <h2>You can find home, name the distance, and tell a major 4th from a raised 4th from a minor 3rd.</h2>
          <p>A new song starts with the resting note, then three melody frets, then a capo. The gym is for making the neck automatic.</p>
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
                    <em>{day.kicker}</em>
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
