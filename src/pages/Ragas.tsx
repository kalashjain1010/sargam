import { Link } from "react-router-dom";
import { ScaleStudio } from "../components/widgets.tsx";
import { SCALES } from "../scales.ts";
import type { ScaleDef } from "../scales.ts";
import { SONGS, scaleNoteNames } from "../theory.ts";

const SCALE_FAMILIES: Record<string, string[]> = {
  major: ["Major loop", "I–IV–V"],
  minor: ["Minor loop"],
  lydian: ["Lydian"],
  mixolydian: ["Mixolydian"],
  phrygian: ["Phrygian"],
  "major-pent": ["Major pentatonic"],
  "minor-pent": ["Power riff"],
  dorian: ["Dorian"],
};

function songsForScale(scale: ScaleDef) {
  const families = SCALE_FAMILIES[scale.id] ?? [];
  return SONGS.filter((song) => families.includes(song.family)).slice(0, 6);
}

export function RagaPage() {
  return (
    <div className="home wide">
      <p className="eyebrow">Scales</p>
      <h1>The collections guitarists actually name.</h1>
      <p className="lede">
        Major, minor, the church modes, pentatonics, blues, harmonic minor. Tap a name, hear the walk, see it on the neck. Move home. The tell is the one note that the neighbor scale does not have.
      </p>
      <ScaleStudio />
      <h2>All of them</h2>
      <div className="raga-list">
        {SCALES.map((scale) => {
          const songs = songsForScale(scale);
          return (
            <article key={scale.id} className="raga-card lift">
              <p className="muted">
                {scale.aka} · {scale.family}
              </p>
              <h3>{scale.name}</h3>
              <p className="pitch-read">{scaleNoteNames(0, scale.steps).join("  ")}</p>
              <p>{scale.tell}</p>
              <p>{scale.rule}</p>
              <p>
                <strong>Leave alone. </strong>
                {scale.avoid}
              </p>
              <p className="tiny muted">{scale.guitar}</p>
              {songs.length > 0 ? (
                <p className="song-links">
                  {songs.slice(0, 6).map((song) => (
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
      <h2>Modes from C major</h2>
      <p>Same seven notes. New home. That is all a mode is.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mode</th>
              <th>Home in C major</th>
              <th>Tell</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ionian (major)</td>
              <td>C D E F G A B</td>
              <td>Major 3rd, major 7th</td>
            </tr>
            <tr>
              <td>Dorian</td>
              <td>D E F G A B C</td>
              <td>Minor 3rd, major 6th</td>
            </tr>
            <tr>
              <td>Phrygian</td>
              <td>E F G A B C D</td>
              <td>Flat 2nd</td>
            </tr>
            <tr>
              <td>Lydian</td>
              <td>F G A B C D E</td>
              <td>Raised 4th</td>
            </tr>
            <tr>
              <td>Mixolydian</td>
              <td>G A B C D E F</td>
              <td>Flat 7th</td>
            </tr>
            <tr>
              <td>Aeolian (natural minor)</td>
              <td>A B C D E F G</td>
              <td>Minor 3rd, minor 6th</td>
            </tr>
            <tr>
              <td>Locrian</td>
              <td>B C D E F G A</td>
              <td>Flat 2nd and flat 5th</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
