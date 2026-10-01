import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChordBed, HarmoniumBlock, KeyPicker, PlayScale, ReferenceBoard } from "../components/widgets.tsx";
import { playProgression, unlock } from "../audio.ts";
import { chordName, nearestMidi, noteName, qualityIntervals, scaleNoteNames, songById, SONGS, usesFlats } from "../theory.ts";

export function SongListPage() {
  const [filter, setFilter] = useState("All");
  const families = ["All", ...Array.from(new Set(SONGS.map((song) => song.family)))];
  const songs = useMemo(() => (filter === "All" ? SONGS : SONGS.filter((song) => song.family === filter)), [filter]);

  return (
    <div className="home wide">
      <p className="eyebrow">Song lab · {SONGS.length} beds</p>
      <h1>Find the loop. Then move home until your hands are comfortable.</h1>
      <p className="lede">
        A song here is a practice bed, not a copied melody. You hear the chord loop (the repeating furniture), then look for one tell-note on the real record. If the tutorial is in G and the singer is higher, put a capo on — same furniture, new floor of the building.
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
          <li key={song.id} className="song-card">
            <Link to={`/songs/${song.id}`}>
              <em>{song.family}</em>
              <strong>{song.title}</strong>
              <span>
                {song.film} · {song.year}
              </span>
              <span className="tiny muted">{song.loopName}</span>
            </Link>
            <button
              type="button"
              className="play-btn mini"
              onClick={() => {
                unlock();
                playProgression(
                  nearestMidi(song.guitarPc, 52),
                  song.chords.map((chord) => ({ semi: chord.semi, intervals: qualityIntervals(chord.q) })),
                );
              }}
            >
              Hear loop
            </button>
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
      <p className="muted">The lesson starts in {noteName(song.guitarPc, usesFlats(song.guitarPc))} because those shapes are easy. Move home. The distances stay. Like singing the same song starting on a different letter.</p>
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
