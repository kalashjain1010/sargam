import { Quiz } from "./components/Quiz.tsx";
import type { Question } from "./components/Quiz.tsx";
import { Explain, Words } from "./components/Shell.tsx";
import {
  BilawalWalk,
  ChordStack,
  HoldSa,
  IntervalTrainer,
  LoopPlayer,
  MelodyId,
  MethodList,
  MinorCompare,
  NoteHunt,
  PentatonicLink,
  ScaleStudio,
  HomeBoard,
  SameNote,
  TellButtons,
} from "./components/widgets.tsx";
import { laterDay } from "./lessonsMore.tsx";
import { LessonVideos } from "./components/VideoEmbed.tsx";
import { PhraseCoach } from "./components/PhraseCoach.tsx";
import { playChord, playInterval, playPhrase, unlock } from "./audio.ts";

function listen(run: () => void): () => void {
  return () => {
    unlock();
    run();
  };
}

export function DayBody({ id }: { id: number }) {
  if (id === 1) return <Day1 />;
  if (id === 2) return <Day2 />;
  if (id === 3) return <Day3 />;
  if (id === 4) return <Day4 />;
  if (id === 5) return <Day5 />;
  if (id === 6) return <Day6 />;
  if (id === 7) return <Day7 />;
  if (id === 8) return <Day8 />;
  if (id === 9) return <Day9 />;
  if (id === 10) return <Day10 />;
  if (id === 11) return <Day11 />;
  if (id === 12) return <Day12 />;
  return laterDay(id);
}

function Day1() {
  const questions: Question[] = [
    {
      prompt: "Fret 12 is where, on the speaking length of the string?",
      choices: ["A quarter of the way to the bridge", "Exactly halfway", "Two thirds of the way", "It depends on the string gauge"],
      answer: 1,
      why: "Halfway. Halve the length, double the frequency. Gauge and tension change the open pitch. They do not move the octave fret.",
    },
    {
      prompt: "Why do the frets get closer together as you go up the neck?",
      choices: ["So the high notes are easier to reach", "Each fret leaves the same fraction of the remaining string, so the gaps shrink", "The wood narrows", "It is only an illusion"],
      answer: 1,
      why: "Equal temperament multiplies frequency by the same ratio every fret, about 1.059. Equal ratios of length are not equal millimetres.",
    },
    {
      prompt: "Open low E and the 12th fret are both E. What changed?",
      choices: ["The note name", "The octave — the frequency doubled", "The string's mass", "The tuning system"],
      answer: 1,
      why: "The letter is the pitch class. The octave is which copy of that letter. 82 Hz and 164 Hz are both E.",
    },
    {
      prompt: "Which fret on the low E string matches the open A string?",
      choices: ["Fret 3", "Fret 5", "Fret 7", "Fret 8"],
      answer: 1,
      why: "Low E up a perfect 4th is A, and a 4th is 5 frets. Root on the 6th string at fret 5 is A, same as the open 5th string.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Pitch", def: "How high or low a note sounds. Faster vibration = higher pitch. Like a tighter rubber band snapping faster." },
          { term: "Octave", def: "Same letter, one floor up. Fret 12. Like the same word spoken by a child and an adult." },
          { term: "Pitch class", def: "Just the letter. Every A on the guitar is the same family, different height." },
        ]}
      />
      <Explain
        idea="A fret shortens the string. Shorter string = higher note. At fret 12 the speaking length is exactly half, so the letter comes back one floor up."
        example="Open low E, then press fret 12 on that same string. Both are E. The second one is the same name in a higher voice. Gauge and tension change the open pitch. They do not move the octave fret."
      />
      <SameNote />
      <NoteHunt />
      <LessonVideos topics={["notes", "foundation"]} />
      <h2>Check</h2>
      <Quiz day={1} questions={questions} />
    </>
  );
}

function Day2() {
  const questions: Question[] = [
    {
      prompt: "What is the home note of a song?",
      choices: ["Always C", "Always 440 Hz", "Whichever letter the line can rest on", "The highest open string"],
      answer: 2,
      why: "Western letters are bolted to frequencies: A4 is 440 Hz. Home is movable. A singer, a harmonium, and your open A can each be home for the same song. Indian theory calls that movable home Sa.",
    },
    {
      prompt: "If home is D, which letter is a perfect 5th above it?",
      choices: ["F", "G", "A", "C"],
      answer: 2,
      why: "A 5th is 7 semitones. D E F# G A. The fifth is A. Indian theory calls the fifth Pa, and treats it as a second drone post next to home.",
    },
    {
      prompt: "A minor 3rd sits how many frets above home?",
      choices: ["2", "3", "4", "5"],
      answer: 1,
      why: "Major 3rd is 4 frets. Minor 3rd is one fret lower, 3 frets. In C that is Eb versus E.",
    },
    {
      prompt: "A tanpura / drone usually holds which pair?",
      choices: ["Home and the 3rd", "Home and the 4th", "Home and the 5th", "Home and the 7th"],
      answer: 2,
      why: "Home and the 5th. After the octave, the 5th is the most consonant interval because its harmonics line up.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Home", def: "The letter a line can end on — like the last word of a sentence. Not glued to C." },
          { term: "Key", def: "Home plus a scale. Capo 2 on a G song makes it A: same shapes, two stairs higher." },
          { term: "Natural notes", def: "C D E F G A B. The other five letters need a sharp (#, one fret up) or a flat (b, one fret down)." },
          { term: "Indian names", def: "Optional labels counted from home. This course uses the letters you already know." },
        ]}
      />
      <Explain
        idea="The letters never move. You choose which letter feels like “done.” A capo is just starting the same song two stairs higher."
        example="Play a song with G, C, D, Em. Clamp a capo at fret 2 and use the same shapes. Now it sounds in A. Indian singers do the same trick with different words: they pick a home and count from it."
      />
      <HomeBoard />
      <h2>Check</h2>
      <Quiz day={2} questions={questions} />
    </>
  );
}

function Day3() {
  const questions: Question[] = [
    {
      prompt: "Listen. How many frets is that distance?",
      choices: ["3 · minor 3rd", "4 · major 3rd", "5 · perfect 4th", "7 · perfect 5th"],
      answer: 1,
      why: "Four frets, a major 3rd. Three would have sounded heavier. Seven would have sounded like a power chord.",
      listen: listen(() => playInterval(64, 4)),
    },
    {
      prompt: "Listen again.",
      choices: ["5 · perfect 4th", "6 · tritone", "7 · perfect 5th", "12 · octave"],
      answer: 2,
      why: "Seven semitones. The calm one. Power chords live here.",
      listen: listen(() => playInterval(64, 7)),
    },
    {
      prompt: "On one string, a perfect 5th is how many frets?",
      choices: ["5", "6", "7", "8"],
      answer: 2,
      why: "Seven. Same-fret adjacent strings are already a 4th, except between G and B.",
    },
    {
      prompt: "The interval between the open G and open B strings is not a 4th. What is it?",
      choices: ["A major 2nd", "A minor 3rd", "A major 3rd", "A tritone"],
      answer: 2,
      why: "G to B is four semitones, a major 3rd. Every other neighboring open pair is a perfect 4th. Shapes change when they cross that pair.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Semitone", def: "One fret. The smallest step this guitar can fret. Like one stair." },
          { term: "Interval", def: "The gap between two notes, counted in stairs (frets). The English name is a nickname for the count." },
          { term: "Fifth", def: "Seven frets. After the octave, the calmest jump. Power chords live here." },
        ]}
      />
      <Explain
        idea="Once home is chosen, a tune is a list of fret-distances. You do not need a new theory for each song. You need to count stairs on one string."
        example="From C: 4 frets lands on E (bright 3rd, a smile). 3 frets lands on Eb (sad 3rd). 7 frets lands on G (a fifth, a pillar). 6 frets lands on F# (the uneasy jump). Those numbers never change."
      />
      <IntervalTrainer />
      <PhraseCoach
        jobs={[
          { id: "fifth", name: "Play a 5th", hint: "Home, then 7 frets. Mic on.", homePc: 4, offsets: [0, 7] },
          { id: "maj3", name: "Play a major 3rd", hint: "Home, then 4 frets.", homePc: 0, offsets: [0, 4] },
          { id: "min3", name: "Play a minor 3rd", hint: "Home, then 3 frets.", homePc: 9, offsets: [0, 3] },
        ]}
      />
      <LessonVideos topics={["intervals"]} />
      <h2>Check</h2>
      <Quiz day={3} questions={questions} />
    </>
  );
}

function Day4() {
  const questions: Question[] = [
    {
      prompt: "The major-scale pattern, in frets from home, is:",
      choices: ["2 2 1 2 2 2 1", "2 1 2 2 1 2 2", "1 2 1 2 1 2 1", "2 2 2 2 2 2"],
      answer: 0,
      why: "Whole, whole, half, whole, whole, whole, half. The half steps sit between 3–4 and 7–1. The major 7th is one fret under the octave, which is why it pulls up.",
    },
    {
      prompt: "If home is G, what is the major 7th?",
      choices: ["F", "F#", "E", "A"],
      answer: 1,
      why: "Eleven frets above G is F#. You already play that note as the leading tone in G major.",
    },
    {
      prompt: "Which open-chord keys put a full major scale on friendly shapes?",
      choices: ["Only C", "C, G, D, A, and E", "Every key equally", "Only minor keys"],
      answer: 1,
      why: "Those five put the major scale on open strings. F major is the same pattern, but Bb is why the full barre shows up.",
    },
    {
      prompt: "Listen. Is this a major scale?",
      choices: ["Yes — whole and half steps to the octave", "No, it skips the 4th and 7th", "No, the 3rd is minor"],
      answer: 0,
      why: "That was C D E F G A B C.",
      listen: listen(() => playPhrase(60, [0, 2, 4, 5, 7, 9, 11, 12], 0.26)),
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Major scale", def: "The common “happy” walk: skip, skip, next, skip, skip, skip, next. In C: C D E F G A B." },
          { term: "Leading tone", def: "The 7th of major. One fret under home, pulling up — like a door that wants to close." },
        ]}
      />
      <Explain
        idea="The major scale is a commute on one string: two frets, two, one, two, two, two, one. Move the whole walk up a fret and the song is in a new key."
        example="From C it uses no sharps: C D E F G A B. From G the same walk hits F# instead of F. That is why G songs use F#."
      />
      <BilawalWalk />
      <LessonVideos topics={["notes"]} />
      <h2>Check</h2>
      <Quiz day={4} questions={questions} />
    </>
  );
}

function Day5() {
  const questions: Question[] = [
    {
      prompt: "A natural minor and its relative major share what?",
      choices: ["The same home note", "The same pitches, different home", "The same chord shapes only", "Nothing"],
      answer: 1,
      why: "A minor and C major are the same seven notes. Home moved to the 6th degree. The A minor pentatonic box and the C major pentatonic box are the same frets for the same reason.",
    },
    {
      prompt: "What does Dorian flatten, compared with major?",
      choices: ["Only the 7th", "The 3rd and the 7th", "The 3rd, 6th, and 7th", "The 2nd, 3rd, 6th, and 7th"],
      answer: 1,
      why: "Minor 3rd and minor 7th. The 6th stays major. That major 6th is the tell against natural minor, which also flattens the 6th. Indian name for Dorian: Kafi.",
    },
    {
      prompt: "Natural minor flattens which degrees?",
      choices: ["b3, b6, b7", "b2 and b6", "only b3", "b3 and #4"],
      answer: 0,
      why: "b3, b6, b7. The 2nd stays natural. If someone also flattens the 2nd, you have left natural minor and entered Phrygian.",
    },
    {
      prompt: "Listen. Which collection is this?",
      choices: ["Major", "Dorian, with a major 6th", "Natural minor, with a minor 6th", "Lydian"],
      answer: 2,
      why: "The phrase used a minor 3rd and a minor 6th (8 semitones). Dorian would have used the major 6th, 9 semitones, a brighter sixth.",
      listen: listen(() => playPhrase(60, [0, 3, 5, 7, 8, 7, 5, 3, 0], 0.3)),
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Relative minor", def: "Same seven letters as a major scale, different front door. C major and A minor share C D E F G A B." },
          { term: "Dorian", def: "Sad 3rd, bright 6th. In A: A B C D E F# G. The F# is the smile." },
          { term: "Natural minor", def: "Sad 3rd, sad 6th, sad 7th. In A: A B C D E F G. The pop-sad default." },
        ]}
      />
      <Explain
        idea="“Minor” is not one box. Three common minors disagree about the 2nd and the 6th. Test those two stairs. One fret changes the whole mood."
        example="In A, natural minor wants F. Dorian wants F#. Phrygian wants Bb as the 2nd (one fret above A) where your finger usually puts B. Same home, three different rooms."
      />
      <MinorCompare />
      <h2>Check</h2>
      <Quiz day={5} questions={questions} />
    </>
  );
}

function Day6() {
  const questions: Question[] = [
    {
      prompt: "A major triad, in frets above the root, is:",
      choices: ["0, 3, 7", "0, 4, 7", "0, 4, 6", "0, 5, 7"],
      answer: 1,
      why: "Root, major 3rd, perfect 5th. The minor triad lowers the middle note one fret: 0, 3, 7.",
    },
    {
      prompt: "In C major, what is the iii chord?",
      choices: ["Em", "E", "Am", "G"],
      answer: 0,
      why: "Degree 3 is E. Stacking thirds inside C major gives E G B, a minor triad. You already grab this as Em.",
    },
    {
      prompt: "Why does a major triad sound settled?",
      choices: ["Because it is old", "Because its notes match harmonics 4, 5, and 6", "Because it uses open strings", "Because it has four notes"],
      answer: 1,
      why: "Harmonics 4, 5, and 6 of any note reduce to a root, a major 3rd, and a perfect 5th. The chord was in the string before anybody named it.",
    },
    {
      prompt: "The vii chord in a major key is diminished because:",
      choices: ["It has no fifth", "Both stacked thirds are minor", "It is the same as the V chord", "The root is home"],
      answer: 1,
      why: "In C, B D F. B to D is 3 frets, D to F is 3 frets. A diminished chord does not contain a perfect 5th, so it wants to move.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Triad", def: "Three letters stacked: 1, 3, and 5 of a scale. That is a chord. A grip is just one way to grab them." },
          { term: "Roman numeral", def: "The chord’s job in the key. Capitals = bright (major). Lowercase = sad (minor). I is home." },
        ]}
      />
      <Explain
        idea="A chord is not a hand shape. A hand shape is one photo of three letters. C major is always C, E, and G — cowboy shape, barre, or two notes plus bass."
        example="In G major you already play G, Am, Bm, C, D, Em. Those are I, ii, iii, IV, V, vi of G. Same furniture, numbered from home. Keep the 3rd: 4 frets = major, 3 frets = minor."
      />
      <ChordStack />
      <LessonVideos topics={["chords", "progressions"]} />
      <h2>Check</h2>
      <Quiz day={6} questions={questions} />
    </>
  );
}

function Day7() {
  const questions: Question[] = [
    {
      prompt: "I V vi IV in G is which chords?",
      choices: ["G D Em C", "G C D Em", "Am F C G", "G Bm C D"],
      answer: 0,
      why: "G is I, D is V, Em is vi, C is IV.",
    },
    {
      prompt: "Am F C G, counted from A, is:",
      choices: ["I V vi IV", "i VI III VII", "ii V I vi", "I IV V I"],
      answer: 1,
      why: "A minor is i. F is the flat 6th, VI. C is the flat 3rd, III. G is the flat 7th, VII. A sad song can still be full of major chords.",
    },
    {
      prompt: "Listen. Which home did that loop start on?",
      choices: ["Major", "Minor"],
      answer: 1,
      why: "The first chord was minor. The next three were major. Home is the first chord's quality, not the majority vote of the bar.",
      listen: listen(() => {
        playChord(57, [0, 3, 7], 0.75);
        window.setTimeout(() => playChord(65, [0, 4, 7], 0.75), 850);
      }),
    },
    {
      prompt: "If a tutorial puts Tum Hi Ho in Am and the record sounds higher, what do you do?",
      choices: ["Learn a new scale", "Capo, or move every shape up, until home matches the singer", "Retune the guitar", "The tutorial is wrong so the pattern is useless"],
      answer: 1,
      why: "The roman numerals are the song. The letter names are a convenience for open chords. Capo moves home. The distances stay.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "I V vi IV", def: "The major pop loop. In G: G D Em C. Home is bright." },
          { term: "i VI III VII", def: "The minor film loop. In A: Am F C G. Home is sad, even though three chords are bright." },
          { term: "Capo", def: "A clamp that moves home up the neck without new shapes. Same furniture, new floor." },
        ]}
      />
      <Explain
        idea="A huge number of songs are four chords in a family. Learn two families from one home and you can busk a shocking number of titles."
        example="Let It Be, Photograph, and many G-shape tutorials are G D Em C. Tum Hi Ho and Channa Mereya tutorials are Am F C G. If the record sounds higher, capo. The family did not change."
      />
      <LoopPlayer />
      <h2>Check</h2>
      <Quiz day={7} questions={questions} />
    </>
  );
}

function Day8() {
  const questions: Question[] = [
    {
      prompt: "The first thing to find in an unknown song is:",
      choices: ["The hardest chord", "The note or chord the line can end on", "The drum pattern", "The highest note"],
      answer: 1,
      why: "The resting note is home, the root of I or i. Melody notes are distances from it. A wrong home makes a correct melody look like the wrong scale.",
    },
    {
      prompt: "You have home. The melody uses a note 6 frets up and avoids sitting 5 frets up. The 3rd is major. What are you holding?",
      choices: ["Major pentatonic", "Lydian / Yaman", "Dorian", "Natural minor"],
      answer: 1,
      why: "Six frets is the tritone, the raised 4th. A major 3rd plus a raised 4th is Lydian territory. Indian name: Yaman.",
    },
    {
      prompt: "The 3rd is minor. The 6th is major (9 frets), and the 7th is minor. Which collection fits?",
      choices: ["Natural minor", "Dorian / Kafi", "Major", "Phrygian"],
      answer: 1,
      why: "Dorian is b3, major 6th, b7. Natural minor would have flattened the 6th to 8 frets. This one test, the 6th, separates a lot of 'minor' film lines.",
    },
    {
      prompt: "Listen. Which phrase is this?",
      choices: ["Major pentatonic — no 4th and no 7th", "Lydian — raised 4th", "Phrygian — flat 2nd"],
      answer: 0,
      why: "C D E G A G E D C. Fret 5 and fret 11 never arrive. Five notes: major pentatonic. Indian name: Bhupali.",
      listen: listen(() => playPhrase(60, [0, 2, 4, 7, 9, 7, 4, 2, 0], 0.32)),
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Tonic", def: "Home. The note that can end the line without asking a question." },
          { term: "Tell", def: "The one step that separates two similar recipes — like a mole that identifies a face." },
        ]}
      />
      <Explain
        idea="Tabs are someone else’s home. The skill is recovering home from the sound, then counting three melody notes in frets."
        example="A wrong home makes a correct melody look like the wrong scale — like starting a story from the wrong sentence. Find the rest note first. Then count."
      />
      <MethodList />
      <MelodyId />
      <HoldSa />
      <h2>Check</h2>
      <Quiz day={8} questions={questions} />
    </>
  );
}

function Day9() {
  const questions: Question[] = [
    {
      prompt: "A minor pentatonic and C major pentatonic share:",
      choices: ["Nothing", "The same pitches", "Only the home note", "Only the minor 3rd"],
      answer: 1,
      why: "A C D E G is both A minor pentatonic (home A) and C major pentatonic (home C). Move home up three frets and the box changes its name.",
    },
    {
      prompt: "Which notes does major pentatonic refuse?",
      choices: ["2nd and 6th", "4th and 7th", "3rd and 5th", "home and 5th"],
      answer: 1,
      why: "No 4th, no 7th. In G, a C chord contains C (the 4th) and a D chord contains F# (the 7th). G and Em stay inside.",
    },
    {
      prompt: "The blues note, added to minor pentatonic, sits where?",
      choices: ["Between the 4th and the 5th", "On home", "A whole step under home", "On the raised 4th only"],
      answer: 0,
      why: "Minor pentatonic is 1 b3 4 5 b7. The blues scale adds the fret between 4 and 5.",
    },
    {
      prompt: "Compared with the minor pentatonic box, a five-note sound with no 5th (1 b3 4 b6 b7) moved which note?",
      choices: ["Home", "The 5th, up one fret to a minor 6th", "The 3rd, up to major", "The 7th, up to major"],
      answer: 1,
      why: "Minor pentatonic has a 5th. This darker pentatonic has no 5th and no 2nd. That 5th fret moves up to the minor 6th. One fret.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Major pentatonic", def: "Five notes: 1 2 3 5 6. In C: C D E G A. No 4th, no 7th." },
          { term: "Minor pentatonic", def: "Five notes: 1, sad 3rd, 4, 5, sad 7th. In A: A C D E G. Same dots as C major pentatonic." },
        ]}
      />
      <Explain
        idea="If you have soloed at all, you have played this box. One shape, two names. Home moved three frets."
        example="Index on low E fret 5: A C D E G. Call A home = minor pentatonic (rock). Call C home = major pentatonic (folk). The blues scale is this box plus one fret between 4 and 5."
      />
      <PentatonicLink />
      <PhraseCoach
        jobs={[{ id: "pent", name: "A minor pentatonic", hint: "A C D E G A. Slow. One string-box.", homePc: 9, offsets: [0, 3, 5, 7, 10, 12] }]}
      />
      <LessonVideos topics={["pentatonic"]} />
      <h2>Check</h2>
      <Quiz day={9} questions={questions} />
    </>
  );
}

function Day10() {
  const questions: Question[] = [
    {
      prompt: "A mode is:",
      choices: ["A new set of notes unrelated to major", "The same notes as a parent scale, with a different letter feeling like home", "Always five notes", "A capo setting"],
      answer: 1,
      why: "C major’s notes, rest on D: Dorian. Rest on G: Mixolydian. The guitar did not gain pitches. Home moved.",
    },
    {
      prompt: "Lydian’s tell, in frets above home, is:",
      choices: ["Fret 1", "Fret 3", "Fret 6, instead of resting on fret 5", "Fret 10"],
      answer: 2,
      why: "Raised 4th. Six frets. In C that is F#. The note a fret lower, F, is the one Lydian does not sit on.",
    },
    {
      prompt: "Mixolydian versus major is a difference of:",
      choices: ["The 3rd", "The 7th: Mixolydian uses the flat 7th, ten frets up", "The 2nd", "The octave"],
      answer: 1,
      why: "Major 3rd stays. The 7th drops one fret. That is the open-door major.",
    },
    {
      prompt: "Dorian versus natural minor is a difference of:",
      choices: ["The 3rd", "The 6th: Dorian’s 6th stays major", "The 5th", "Home"],
      answer: 1,
      why: "Both have a minor 3rd and a minor 7th. Dorian’s 6th is major. Natural minor’s 6th is minor. One fret.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Ionian", def: "Major. Rest on 1. Bright 3rd and bright 7th." },
          { term: "Dorian", def: "Rest on 2. Sad 3rd, bright 6th." },
          { term: "Phrygian", def: "Rest on 3. The 2nd is only one fret above home." },
          { term: "Lydian", def: "Rest on 4. Raised 4th (six frets)." },
          { term: "Mixolydian", def: "Rest on 5. Flat 7th (ten frets)." },
          { term: "Aeolian", def: "Natural minor. Rest on 6." },
          { term: "Locrian", def: "Rest on 7. Unstable home. Rare as a song’s front door." },
        ]}
      />
      <Explain
        idea="A mode is not a new pile of notes. It is the same seven letters with a different chair as home — the same room photographed from another seat."
        example="Play C D E F G A B. Rest on C = major. Rest on D = Dorian. Rest on G = Mixolydian (F is now the flat 7th of G). The guitar did not gain pitches. Home moved. Learn the tells: #4, b7, bright 6th in a minor world, b2."
      />
      <ScaleStudio startId="mixolydian" />
      <LessonVideos topics={["modes", "scales"]} />
      <h2>Check</h2>
      <Quiz day={10} questions={questions} />
    </>
  );
}

function Day11() {
  const questions: Question[] = [
    {
      prompt: "Abhi Na Jao Chhod Kar is taught with which tell?",
      choices: ["Major pentatonic, no 4th", "Lydian: raised 4th", "Phrygian: flat 2nd", "Natural minor"],
      answer: 1,
      why: "Jaidev, Hum Dono, 1961. The tell is the 4th one fret higher than the major scale's 4th.",
    },
    {
      prompt: "Someone says Tum Hi Ho is Yaman because it is romantic. What do you check?",
      choices: ["Nothing. Romance means Yaman.", "The 3rd. Yaman's 3rd is major. This arrangement's home chord is minor.", "Only the lyrics", "Whether the guitar is acoustic"],
      answer: 1,
      why: "The common guitar loop starts on Am. Minor 3rd, not Yaman. Romantic is not a scale. Test the 3rd, then test the 4th.",
    },
    {
      prompt: "In a D-major reading of Kun Faya Kun, the flat 7th is which note?",
      choices: ["C#", "C", "Bb", "F"],
      answer: 1,
      why: "If home is D, the major 7th is C# and the flat 7th is C. The A chord in the loop contains C#. The melody's C disagrees with it. That disagreement is Mixolydian / Khamaj color.",
    },
    {
      prompt: "In G major pentatonic, which pair stays inside the five notes?",
      choices: ["G and Em", "G and C", "C and D", "D and Em"],
      answer: 0,
      why: "G is G B D. Em is E G B. C contains C, the 4th. D contains F#, the 7th. Both of those are the notes the pentatonic left out.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Arrangement key", def: "The letter a guitar lesson picked so the chords fall on easy shapes. Not always the record’s key." },
          { term: "Tell", def: "One note that confirms or kills a guess. Romance is not a scale." },
        ]}
      />
      <Explain
        idea="Three cases, slowly. Do not memorize thirteen songs. Memorize the test, then use the song pages as a workbook."
        example="If someone says a song is Lydian because it is romantic, check the 3rd. Lydian’s 3rd is bright (4 frets). Tum Hi Ho guitar charts start on Am — sad 3rd. The lyric did not change the 3rd."
      />
      <h2>Raised 4th (Lydian)</h2>
      <p>Abhi Na Jao Chhod Kar is a real Lydian composition (Jaidev, 1961). Set home. Four frets up should fit (bright 3rd). Six frets up should fit better than five. That is the whole test. In C the dangerous chord is F, because F is the ordinary 4th.</p>
      <h2>Flat 7th (Mixolydian)</h2>
      <p>Major home, 7th one fret low. Kun Faya Kun is the modern case. Lesson charts in D use D, G, and A, and a melody that dips to C. A contains C#. The voice uses C. Both 7ths. Do not call that a wrong note. Call it the tell.</p>
      <h2>Minor, and the false Lydian</h2>
      <p>Tum Hi Ho in the usual guitar key is Am, C, G, F. Channa Mereya is Am, F, C, G. Home is minor. Lydian’s 3rd is major and its 4th is sharp. A romantic lyric does not change the 3rd.</p>
      <TellButtons />
      <p>The song atlas has the rest, each with a guitar home you can move.</p>
      <h2>Check</h2>
      <Quiz day={11} questions={questions} />
    </>
  );
}

function Day12() {
  const questions: Question[] = [
    {
      prompt: "Fret 12 does what, on every string?",
      choices: ["Raises the note a 5th", "Doubles the frequency and keeps the letter", "Changes the key", "Only works in standard tuning"],
      answer: 1,
      why: "Half the length, double the frequency, same pitch class.",
    },
    {
      prompt: "Listen.",
      choices: ["Perfect 5th · 7 frets", "Perfect 4th · 5 frets", "Major 3rd · 4 frets", "Tritone · 6 frets"],
      answer: 0,
      why: "Seven semitones. The drone interval. The calm one.",
      listen: listen(() => playInterval(62, 7)),
    },
    {
      prompt: "Dorian, against natural minor, keeps which degree major?",
      choices: ["The 3rd", "The 6th", "The 7th", "The 2nd is flat"],
      answer: 1,
      why: "Both have a minor 3rd and a minor 7th. Dorian's 6th is major. Natural minor's 6th is minor. One fret.",
    },
    {
      prompt: "Yaman's 4th, compared with a major scale's 4th, is:",
      choices: ["One fret lower", "One fret higher", "The same", "Absent"],
      answer: 1,
      why: "Raised. Six frets above home instead of five. In C: F# instead of F.",
    },
    {
      prompt: "Major pentatonic omits:",
      choices: ["Home and 5th", "2nd and 3rd", "4th and 7th", "b3 and b7"],
      answer: 2,
      why: "Five notes: 1 2 3 5 6. In G that is why G and Em fit, and C and D do not.",
    },
    {
      prompt: "I V vi IV in D is:",
      choices: ["D A Bm G", "D G A Bm", "Am F C G", "D Em F#m G"],
      answer: 0,
      why: "D, A, B minor, G. Kesariya's common guitar loop.",
    },
    {
      prompt: "A minor home followed by F, C, and G is:",
      choices: ["Yaman", "i VI III VII", "Major pentatonic", "A major scale"],
      answer: 1,
      why: "Am F C G. The minor film loop. Not Yaman.",
    },
    {
      prompt: "You want to move a G-shape song up two frets without new theory. You:",
      choices: ["Learn a new raga", "Capo at 2, or play every shape two frets higher. Home moved from G to A.", "Tune the low string down", "Avoid the 5th"],
      answer: 1,
      why: "Capo is movable home. The intervals and the roman numerals survive.",
    },
    {
      prompt: "Listen. Which tell is this?",
      choices: ["Flat 2nd, one fret above home", "Raised 4th", "A perfect 5th", "An octave"],
      answer: 0,
      why: "Home up one fret. Natural minor and Dorian both use a whole step there. Phrygian does not.",
      listen: listen(() => playInterval(60, 1)),
    },
    {
      prompt: "The microphone calls a slow vocal slide 'out of tune' in the middle of the slide. What is actually happening?",
      choices: ["The song left the scale forever", "A bend. The voice is traveling between frets. The target is the note it lands on.", "Home moved by itself", "The octave broke"],
      answer: 1,
      why: "Frets are a grid. The voice and a bent string live between the grid lines on purpose. Judge the landing, not the journey.",
    },
  ];
  return (
    <>
      <Explain
        idea="Ten questions. Eight is a pass. Then, if you want the stamp, hold three notes: home, the 5th, and the bright 3rd, any octave, one string at a time. No microphone? The exam still unlocks."
        example="After this, a new song is a question: which note can end the line? Count three melody notes in frets. Match them to major, Dorian, natural minor, pentatonic, Lydian, or Mixolydian. Capo until your hands are comfortable."
      />
      <h2>Check</h2>
      <Quiz day={12} questions={questions} passAt={0.8} />
    </>
  );
}
