import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChordBed } from "../components/widgets.tsx";
import { Quiz } from "../components/Quiz.tsx";
import { unlock } from "../audio.ts";
import { DRILLS, drillById } from "../drills.ts";
import { buildHunt, homeLetter, loopLabel, playSongHome, playSongLoop, playSongScale, randomSong, scaleLabel } from "../hunt.ts";
import { useProgress } from "../progress.tsx";
import { SONGS, songById } from "../theory.ts";

export function TestsPage() {
  const { drills } = useProgress();
  const [room, setRoom] = useState<"song" | "skills">("song");
  const hunted = Object.keys(drills).filter((key) => key.startsWith("song-")).length;

  return (
    <div className="home wide">
      <p className="eyebrow">Training tests</p>
      <h1>Pick a real song. Find the scale. Name the clothes.</h1>
      <p className="lede">
        You hear the guitar loop — the furniture — not the hit melody. Then you hunt: is home bright or sad, which letter, which scale, which tell, which other title wears the same clothes. Fail it. Read why. Take another song. Best percent sticks on this browser only.
      </p>
      <div className="gym-bests">
        <div>
          <em>Songs named</em>
          <strong>{hunted || "—"}</strong>
        </div>
        <div>
          <em>Song hunt</em>
          <strong>{drills.hunt ? `${drills.hunt}%` : "—"}</strong>
        </div>
        {DRILLS.map((item) => (
          <div key={item.id}>
            <em>{item.title}</em>
            <strong>{drills[item.id] ? `${drills[item.id]}%` : "—"}</strong>
          </div>
        ))}
      </div>
      <div className="chips">
        <button type="button" className={`chip ${room === "song" ? "on" : ""}`} onClick={() => setRoom("song")}>
          Find a song
        </button>
        <button type="button" className={`chip ${room === "skills" ? "on" : ""}`} onClick={() => setRoom("skills")}>
          Skills
        </button>
      </div>
      {room === "song" ? <SongHunt /> : <SkillsRoom />}
    </div>
  );
}

function SkillsRoom() {
  const { drills, recordDrill } = useProgress();
  const [id, setId] = useState("songs");
  const [seed, setSeed] = useState(0);
  const pack = drillById(id) ?? DRILLS[0]!;
  const questions = useMemo(() => pack.build(), [pack, seed]);
  const best = drills[pack.id] ?? 0;

  return (
    <>
      <div className="chips">
        {DRILLS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`chip ${id === item.id ? "on" : ""}`}
            onClick={() => {
              setId(item.id);
              setSeed((n) => n + 1);
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="muted">{pack.blurb}</p>
      {best ? <p className="tiny muted">Best on this browser: {best}%.</p> : null}
      <Quiz
        key={`${pack.id}-${seed}`}
        questions={questions}
        heading="Train"
        passAt={0.75}
        onFinish={(correct, total) => recordDrill(pack.id, Math.round((100 * correct) / total))}
      />
      <div className="row">
        <button type="button" className="play-btn ghost" onClick={() => setSeed((n) => n + 1)}>
          New questions
        </button>
      </div>
    </>
  );
}

function SongHunt() {
  const { drills, recordDrill } = useProgress();
  const [songId, setSongId] = useState<string | null>(null);
  const [seed, setSeed] = useState(0);
  const [query, setQuery] = useState("");
  const song = songId ? songById(songId) : undefined;

  if (!song) {
    const filtered = SONGS.filter((item) => {
      const hay = `${item.title} ${item.film} ${item.year}`.toLowerCase();
      return hay.includes(query.trim().toLowerCase());
    });
    return (
      <>
        <p className="muted">
          {SONGS.length} real titles. Family and scale stay hidden until you find them. Hear the loop, not the tune.
        </p>
        <div className="row">
          <button
            type="button"
            className="play-btn"
            onClick={() => {
              setSongId(randomSong().id);
              setSeed((n) => n + 1);
            }}
          >
            Surprise me
          </button>
          <input
            className="hunt-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a title or film"
            aria-label="Search songs"
          />
        </div>
        <ul className="song-grid">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="hunt-card"
                onClick={() => {
                  setSongId(item.id);
                  setSeed((n) => n + 1);
                }}
              >
                <strong>{item.title}</strong>
                <span>
                  {item.film} · {item.year}
                </span>
                <em>Find the scale</em>
              </button>
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? <p className="muted">No title matches that. Try the film name.</p> : null}
      </>
    );
  }

  return (
    <HuntRound
      key={`${song.id}-${seed}`}
      songId={song.id}
      best={drills[`song-${song.id}`] ?? 0}
      onDone={(percent) => {
        recordDrill("hunt", percent);
        recordDrill(`song-${song.id}`, percent);
      }}
      onPick={(id) => {
        setSongId(id);
        setSeed((n) => n + 1);
      }}
      onBack={() => setSongId(null)}
    />
  );
}

function HuntRound({
  songId,
  best,
  onDone,
  onPick,
  onBack,
}: {
  songId: string;
  best: number;
  onDone: (percent: number) => void;
  onPick: (id: string) => void;
  onBack: () => void;
}) {
  const song = songById(songId);
  const hunt = useMemo(() => (song ? buildHunt(song) : null), [song]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<("ok" | "miss" | "")[]>([]);
  const [done, setDone] = useState(false);
  const [heardScale, setHeardScale] = useState(false);

  if (!song || !hunt) return null;
  const step = hunt.steps[index];
  const total = hunt.steps.length;
  const scored = marks.filter((mark) => mark === "ok").length;

  function choose(choice: number) {
    if (picked !== null || !step) return;
    setPicked(choice);
    const ok = choice === step.answer;
    setMarks((list) => {
      const next = [...list];
      next[index] = ok ? "ok" : "miss";
      return next;
    });
    if (step.id === "scale") setHeardScale(true);
  }

  function next() {
    if (picked === null || !step) return;
    if (index + 1 >= total) {
      const nextMarks = [...marks];
      if (!nextMarks[index]) nextMarks[index] = picked === step.answer ? "ok" : "miss";
      const n = nextMarks.filter((mark) => mark === "ok").length;
      onDone(Math.round((100 * n) / total));
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
  }

  if (done) {
    const percent = Math.round((100 * scored) / total);
    return (
      <section className="hunt-now">
        <p className="eyebrow">
          {song.film} · {song.year}
        </p>
        <h2>{song.title}</h2>
        <p className={percent >= 75 ? "ok-line" : ""}>
          {scored} of {total} · {percent}%
          {best && percent >= best ? " · best on this browser" : best ? ` · beat ${best}% next time` : ""}
        </p>
        <p>
          Home <b>{homeLetter(song)}</b>
          {" · "}
          {scaleLabel(song.steps)}
          {" · "}
          {song.family}
        </p>
        <p className="pitch-read">{loopLabel(song)}</p>
        <p>{song.tell}</p>
        <p className="tiny muted">
          {song.confidence === "established"
            ? "Established classroom example."
            : song.confidence === "commonly taught"
              ? "Commonly taught. Phrase rules on the record can be looser."
              : "Arrangement for practice, not a transcription. No melody is copied here."}
        </p>
        <aside className="note">
          <strong>Do not skip this</strong>
          <p>{song.caveat}</p>
        </aside>
        <ChordBed saPc={song.guitarPc} chords={song.chords} />
        <div className="row">
          <button
            type="button"
            className="play-btn"
            onClick={() => {
              unlock();
              playSongLoop(song);
            }}
          >
            Hear the loop
          </button>
          <button
            type="button"
            className="play-btn ghost"
            onClick={() => {
              unlock();
              playSongScale(song);
            }}
          >
            Hear the scale
          </button>
        </div>
        <div className="row">
          <button type="button" className="btn" onClick={() => onPick(randomSong(song.id).id)}>
            Another song
          </button>
          <button type="button" className="btn secondary" onClick={onBack}>
            Pick from the list
          </button>
          <Link className="btn ghost" to={`/songs/${song.id}`}>
            Open in Songs
          </Link>
        </div>
      </section>
    );
  }

  if (!step) return null;

  return (
    <section className="hunt-now">
      <div className="hunt-head">
        <div>
          <p className="eyebrow">
            {song.film} · {song.year}
          </p>
          <h2>{song.title}</h2>
        </div>
        <button type="button" className="btn ghost" onClick={onBack}>
          Other songs
        </button>
      </div>
      <p className="tiny muted">Chord loop only. Naming the furniture is the test. Copying the tune is not.</p>
      <div className="row">
        <button
          type="button"
          className="play-btn"
          onClick={() => {
            unlock();
            playSongLoop(song);
          }}
        >
          Hear the loop
        </button>
        <button
          type="button"
          className="play-btn ghost"
          onClick={() => {
            unlock();
            playSongHome(song);
          }}
        >
          Hear home
        </button>
        {heardScale || step.id === "scale" ? (
          <button
            type="button"
            className="play-btn ghost"
            onClick={() => {
              unlock();
              playSongScale(song);
            }}
          >
            Hear the walk
          </button>
        ) : null}
      </div>
      <div className="step-rail" aria-hidden="true">
        {hunt.steps.map((item, i) => (
          <i key={item.id} className={marks[i] || (i === index ? "on" : "")} />
        ))}
      </div>
      <p className="tiny muted">
        {step.title} · {index + 1} of {total}
      </p>
      <h3>{step.prompt}</h3>
      {step.listen ? (
        <button
          type="button"
          className="play-btn ghost"
          onClick={() => {
            unlock();
            step.listen?.();
          }}
        >
          {step.listenLabel ?? "Play"}
        </button>
      ) : null}
      <div className={step.pad ? "note-pad" : "choices"}>
        {step.choices.map((choice, choiceIndex) => {
          const state =
            picked === null ? "" : choiceIndex === step.answer ? "right" : choiceIndex === picked ? "wrong" : "";
          return (
            <button
              key={choice}
              type="button"
              className={step.pad ? `note-key ${state}` : `choice ${state}`}
              onClick={() => choose(choiceIndex)}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null ? <p className="why">{step.why}</p> : null}
      {picked !== null ? (
        <button type="button" className="btn" onClick={next}>
          {index + 1 === total ? "See what you found" : "Next find"}
        </button>
      ) : null}
    </section>
  );
}
