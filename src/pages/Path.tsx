import { Link } from "react-router-dom";
import { DAYS } from "../theory.ts";
import { useProgress } from "../progress.tsx";

export function PathPage() {
  const { passed, isOpen, reset } = useProgress();
  return (
    <div className="home">
      <p className="eyebrow">The path</p>
      <h1>One idea a day. The neck stays in the lesson.</h1>
      <p className="lede">Pass the check to open the next day. Songs, the gym, and the practice room are unlocked from the start, so you can look something up without skipping ahead.</p>
      <ol className="path-rows">
        {DAYS.map((day) => {
          const open = isOpen(day.id);
          const clear = passed.includes(day.id);
          return (
            <li key={day.id}>
              {open ? (
                <Link to={`/day/${day.id}`} className="path-card">
                  <span className="num">{clear ? "Clear" : `Day ${day.id}`}</span>
                  <strong>{day.title}</strong>
                  <em>{day.minutes} min · {day.kicker}</em>
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
