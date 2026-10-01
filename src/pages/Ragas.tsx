import { Link } from "react-router-dom";
import { RagaStudio } from "../components/widgets.tsx";
import { phraseLetters, RAGAS, SONGS, THAATS, scaleNoteNames } from "../theory.ts";

export function RagaPage() {
  return (
    <div className="home wide">
      <p className="eyebrow">Scales</p>
      <h1>Ten parent scales. Eight recipes worth hearing.</h1>
      <p className="lede">
        Letters first. A parent scale is the set of notes. A raga is how you are allowed to walk them. Film music borrows the walk and then invites other notes in. Listen for the tell.
      </p>
      <RagaStudio />
      <h2>The eight</h2>
      <div className="raga-list">
        {RAGAS.map((raga) => {
          const songs = SONGS.filter((song) => song.ragaId === raga.id);
          return (
            <article key={raga.id} className="raga-card">
              <p className="muted">
                {raga.western}
                {raga.dev ? ` · ${raga.name}` : ""}
              </p>
              <h3>{raga.name}</h3>
              <p className="pitch-read">{scaleNoteNames(0, raga.steps).join("  ")}</p>
              <p>{raga.rule}</p>
              <p>
                <strong>Catch phrase. </strong>
                {phraseLetters(0, raga.pakad)}
              </p>
              <p className="tiny muted">Indian names: {raga.pakadText}</p>
              <p>
                <strong>Leave alone. </strong>
                {raga.avoid}
              </p>
              <p className="tiny muted">
                {raga.time}. {raga.feel}.
              </p>
              {songs.length > 0 ? (
                <p className="song-links">
                  {songs.map((song) => (
                    <Link key={song.id} to={`/songs/${song.id}`}>
                      {song.title}
                    </Link>
                  ))}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
      <h2>Ten parent scales</h2>
      <p>Parent scales only. The raga of the same name is usually stricter.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Notes from C</th>
              <th>Western sketch</th>
              <th>Where you meet it</th>
            </tr>
          </thead>
          <tbody>
            {THAATS.map((thaat) => (
              <tr key={thaat.name}>
                <td>{thaat.name}</td>
                <td>{scaleNoteNames(0, thaat.steps).join(" ")}</td>
                <td>{thaat.western}</td>
                <td>{thaat.raga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
