import { Link } from "react-router-dom";
import { DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";

export function PathPage() {
  const { passed, reset } = useProgress();
  const units = [...new Set(DAYS.map((day) => day.unit))];
  return (
    <div className="home">
      <p className="eyebrow">The path</p>
      <h1>One idea a day. Stay as long as you want.</h1>
      <p className="lede">
        Each day is one idea, then a short check. Skip around — another phone will not remember this browser, so nothing is locked behind a pass. Marks here are only a reminder. Songs, gym, ear, chords, videos, and practice are open from day one.
      </p>
      {units.map((unit) => (
        <section key={unit} className="unit-block">
          <p className="eyebrow">{unit}</p>
          <ol className="path-rows">
            {DAYS.filter((day) => day.unit === unit).map((day) => {
              const clear = passed.includes(day.id);
              return (
                <li key={day.id}>
                  <Link to={`/day/${day.id}`} className={`path-card lift ${clear ? "is-clear" : ""}`}>
                    <span className="num">{clear ? "Clear" : `Day ${day.id}`}</span>
                    <strong>{day.title}</strong>
                    <em>
                      {day.minutes} min · {day.kicker}
                    </em>
                    <p>{day.promise}</p>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          if (window.confirm("Clear every finished day on this browser?")) reset();
        }}
      >
        Reset progress on this browser
      </button>
    </div>
  );
}
