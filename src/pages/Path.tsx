import { Link } from "react-router-dom";
import { DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";

export function PathPage() {
  const { passed, isOpen, reset } = useProgress();
  const units = [...new Set(DAYS.map((day) => day.unit))];
  return (
    <div className="home">
      <p className="eyebrow">The path</p>
      <h1>One idea a day. Stay as long as you want.</h1>
      <p className="lede">
        Each day is one idea, then a short check. Pass the check to open the next day. Songs, gym, ear, chords, videos, and practice are open from day one — like a library next to the classroom. There is no prize for rushing.
      </p>
      {units.map((unit) => (
        <section key={unit} className="unit-block">
          <p className="eyebrow">{unit}</p>
          <ol className="path-rows">
            {DAYS.filter((day) => day.unit === unit).map((day) => {
              const open = isOpen(day.id);
              const clear = passed.includes(day.id);
              return (
                <li key={day.id}>
                  {open ? (
                    <Link to={`/day/${day.id}`} className={`path-card lift ${clear ? "is-clear" : ""}`}>
                      <span className="num">{clear ? "Clear" : `Day ${day.id}`}</span>
                      <strong>{day.title}</strong>
                      <em>
                        {day.minutes} min · {day.kicker}
                      </em>
                      <p>{day.promise}</p>
                    </Link>
                  ) : (
                    <div className="path-card shut">
                      <span className="num">Day {day.id}</span>
                      <strong>{day.title}</strong>
                      <em>Locked</em>
                      <p>{day.promise}</p>
                    </div>
                  )}
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
