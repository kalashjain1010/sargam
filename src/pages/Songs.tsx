import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChordBed, HarmoniumBlock, KeyPicker, PlayScale, ReferenceBoard } from "../components/widgets.tsx";
import { chordName, noteName, scaleNoteNames, songById, SONGS, usesFlats } from "../theory.ts";

export function SongListPage() {
  const [filter, setFilter] = useState("All");
  const families = ["All", ...Array.from(new Set(SONGS.map((song) => song.family)))];
  const songs = useMemo(() => (filter === "All" ? SONGS : SONGS.filter((song) => song.family === filter)), [filter]);

  return (
    <div className="home">
      <p className="eyebrow">Song lab</p>
      <h1>Find the scale. Then move home until the guitar is comfortable.</h1>
      <p className="lede">
        Raga songs are named when the association is a real teaching tradition. The pop songs are named as guitar arrangements: the roman numerals travel, the studio key might not. Nothing here is a copied melody. The tell is the thing you take to the record.
      </p>
      <div className="chips">
        {families.map((family) => (
          <button key={family} type="button" className={`chip ${filter === family ? "on" : ""}`} onClick={() => setFilter(family)}>
            {family}
          </button>
        ))}
      </div>
      <ul className="song-grid">
        {songs.map((song) => (
          <li key={song.id}>
            <Link to={`/songs/${song.id}`}>
              <em>{song.family}</em>
              <strong>{song.title}</strong>
              <span>
                {song.film} · {song.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SongPage() {
  const params = useParams();
  const song = songById(params.id ?? "");
  const [pc, setPc] = useState<number | null>(null);
  useEffect(() => {
    setPc(null);
  }, [params.id]);
  if (!song) {
    return (
      <div className="lesson">
        <h1>That song is not in the lab.</h1>
        <Link to="/songs">All songs</Link>
      </div>
    );
  }
  const sa = pc ?? song.guitarPc;
  const flat = usesFlats(sa);

  return (
    <article className="lesson">
      <p className="eyebrow">
        {song.family} · {song.confidence}
      </p>
      <h1>{song.title}</h1>
      <p className="lede">
        {song.film}, {song.year}. {song.summary}
      </p>
      <p>{song.tell}</p>
      <h2>How to confirm on the record</h2>
      <ol className="method static">
        {song.confirm.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <h2>Guitar home</h2>
      <p className="muted">The lesson starts in {noteName(song.guitarPc, usesFlats(song.guitarPc))}. Move it. The scale degrees do not change.</p>
      <KeyPicker value={sa} onChange={setPc} />
      <p className="pitch-read">{scaleNoteNames(sa, song.steps).join("  ")}</p>
      <div className="row">
        <PlayScale saPc={sa} steps={song.steps} label={`Play the scale in ${noteName(sa, flat)}`} />
      </div>
      <ReferenceBoard saPc={sa} steps={song.steps} />
      <HarmoniumBlock saPc={sa} steps={song.steps} />
      <h2>{song.chords.map((chord) => chordName(sa, chord.semi, chord.q)).join(" · ")}</h2>
      <ChordBed saPc={sa} chords={song.chords} />
      <p className="muted">
        {song.loopName}
        {sa !== song.guitarPc ? " The sentences below were written for that starting key. The buttons above already moved with home." : ""}
      </p>
      <p>{song.bedNote}</p>
      <aside className="note">
        <strong>Do not skip this</strong>
        <p>{song.caveat}</p>
      </aside>
      <p>
        <Link to="/songs">All songs</Link>
      </p>
    </article>
  );
}
