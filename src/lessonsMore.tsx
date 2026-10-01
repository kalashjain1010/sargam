import { Quiz } from "./components/Quiz.tsx";
import type { Question } from "./components/Quiz.tsx";
import { Words } from "./components/Shell.tsx";
import {
  BarreShapes,
  CadencePlayer,
  CagedMap,
  CapoMath,
  ChordFinder,
  ChordMethod,
  CircleFifths,
  ModeClock,
  OpenDictionary,
  PowerShapes,
  RhythmPad,
  ScaleStudio,
  SecondaryDom,
  SeventhColors,
  SusAdd,
} from "./components/widgets.tsx";
import { LessonVideos } from "./components/VideoEmbed.tsx";
import { playChord, playClicks, playInterval, playPhrase, playProgression, unlock } from "./audio.ts";
import { Link } from "react-router-dom";

function listen(run: () => void): () => void {
  return () => {
    unlock();
    run();
  };
}

export function laterDay(id: number) {
  if (id === 13) return <Day13 />;
  if (id === 14) return <Day14 />;
  if (id === 15) return <Day15 />;
  if (id === 16) return <Day16 />;
  if (id === 17) return <Day17 />;
  if (id === 18) return <Day18 />;
  if (id === 19) return <Day19 />;
  if (id === 20) return <Day20 />;
  if (id === 21) return <Day21 />;
  if (id === 22) return <Day22 />;
  if (id === 23) return <Day23 />;
  if (id === 24) return <Day24 />;
  if (id === 25) return <Day25 />;
  if (id === 26) return <Day26 />;
  if (id === 27) return <Day27 />;
  if (id === 28) return <Day28 />;
  if (id === 29) return <Day29 />;
  return <Day30 />;
}

function Day13() {
  const questions: Question[] = [
    {
      prompt: "The fastest way to name a chord in a pop song is:",
      choices: ["Guess from the title", "Find the bass, then ask if the 3rd is major or minor", "Look at the drummer", "Assume everything is G"],
      answer: 1,
      why: "Bass is usually the root. The 3rd is 4 frets (major) or 3 (minor). Letter plus quality is the chord.",
    },
    {
      prompt: "You hear Am, F, C, G and the chorus can rest on Am. The family is:",
      choices: ["I–V–vi–IV in C", "i–VI–III–VII in A minor", "Lydian in A", "I–IV–V in G"],
      answer: 1,
      why: "Home is minor. F is VI, C is III, G is VII. That is the minor loop.",
    },
    {
      prompt: "A chord that does not sit in the home scale is:",
      choices: ["Always a mistake", "A visitor: borrowed, secondary dominant, or a mode color. Name it, then ask what it points at", "Proof the song has no key", "A raga"],
      answer: 1,
      why: "Creep’s B major in G is a visitor. Kun Faya Kun’s melody C against D is a Mixolydian color. Visitors have jobs.",
    },
  ];
  return (
    <>
      <p>
        Tabs skip the part that makes you independent. The method is short: bass, quality, numerals, family, capo. The Chord lab is the sandbox. Today you learn the order so you never grab four random shapes again.
      </p>
      <ChordMethod />
      <ChordFinder />
      <LessonVideos topics={["chords", "progressions", "ear"]} />
      <p>
        Homework: pick any song in the <Link to="/songs">song lab</Link>. Do not look at the chords first. Hum the bass of the chorus, match it, then check the 3rd. Then open the page and see if you named the family.
      </p>
      <h2>Check</h2>
      <Quiz day={13} questions={questions} />
    </>
  );
}

function Day14() {
  const questions: Question[] = [
    {
      prompt: "E-shape barre, root on low E fret 3, is which major chord?",
      choices: ["F", "G", "A", "C"],
      answer: 1,
      why: "Open E is E. Fret 1 is F. Fret 3 is G. The whole open-E grip slides to fret 3.",
    },
    {
      prompt: "A-shape barre, root on A string fret 3, is which major chord?",
      choices: ["C", "B", "D", "G"],
      answer: 0,
      why: "Open A is A. Fret 2 is B. Fret 3 is C.",
    },
    {
      prompt: "To make an E-shape barre minor you:",
      choices: ["Add a capo", "Drop the 3rd one fret, which is the open-Em shape slid", "Mute the high e", "Raise the 5th"],
      answer: 1,
      why: "Open Em is already the minor E-shape. Slide it. Fret 3 is Gm.",
    },
  ];
  return (
    <>
      <p>
        Open E and open A, moved up the neck, are most of the chords you still think of as “hard.” The nut was a capo at fret 0. A barre is a movable nut.
      </p>
      <BarreShapes />
      <OpenDictionary />
      <LessonVideos topics={["barre", "caged"]} />
      <h2>Check</h2>
      <Quiz day={14} questions={questions} />
    </>
  );
}

function Day15() {
  const questions: Question[] = [
    {
      prompt: "A dominant 7 adds which interval to a major triad?",
      choices: ["Major 7th, 11 frets", "Flat 7th, 10 frets", "Octave", "Flat 2nd"],
      answer: 1,
      why: "1 3 5 b7. In G7 that extra note is F. It wants to fall to E, the 3rd of C.",
      listen: listen(() => playChord(55, [0, 4, 7, 10], 1.1)),
    },
    {
      prompt: "Why do Am songs often use E or E7 instead of Em?",
      choices: ["Fashion", "E contains G#, the raised 7th of A harmonic minor. That V chord pulls to Am", "E is easier", "They are in E major"],
      answer: 1,
      why: "Natural minor’s v is minor. Raise the 7th and V becomes major. That is harmonic minor, heard as a cadence.",
    },
    {
      prompt: "Major 7 versus dominant 7. Which sits, which pulls?",
      choices: ["Both pull", "Major 7 sits (major 7th). Dominant 7 pulls (flat 7th)", "Both sit", "Diminished sits"],
      answer: 1,
      why: "Cmaj7 has B. G7 has F. B is already in C major and is calm. F wants to resolve.",
    },
  ];
  return (
    <>
      <p>A triad is three notes. A seventh is four. The extra note is a job description, not decoration.</p>
      <SeventhColors />
      <h2>Check</h2>
      <Quiz day={15} questions={questions} />
    </>
  );
}

function Day16() {
  const questions: Question[] = [
    {
      prompt: "One step clockwise on the circle is:",
      choices: ["Up a 4th, add a flat", "Up a 5th, add a sharp", "Up a minor 3rd", "Down an octave"],
      answer: 1,
      why: "C to G to D to A. Each move adds one sharp in the key signature.",
    },
    {
      prompt: "In G major, IV and V are:",
      choices: ["C and D", "A and E", "F and C", "Em and Am"],
      answer: 0,
      why: "Neighbors on the circle: F is counterclockwise from C, but from G the counterclockwise neighbor is C (IV) and clockwise is D (V).",
    },
    {
      prompt: "The relative minor of C major lives:",
      choices: ["Three frets up, E minor", "Three frets down, A minor, same notes", "One fret up", "On F"],
      answer: 1,
      why: "A minor is the vi. Same pitches as C major. Home moved.",
    },
  ];
  return (
    <>
      <p>
        The circle is a map of neighborhoods. Songs live with I, IV, V, and vi. Those four are next-door keys. Distant keys sound like a plane change.
      </p>
      <CircleFifths />
      <LessonVideos topics={["circle", "keys"]} />
      <h2>Check</h2>
      <Quiz day={16} questions={questions} />
    </>
  );
}

function Day17() {
  const questions: Question[] = [
    {
      prompt: "V–I is called:",
      choices: ["Plagal", "Authentic / perfect cadence", "Deceptive", "Half"],
      answer: 1,
      why: "The period. G7 to C. Listen today until you can bet on it.",
      listen: listen(() =>
        playProgression(60, [
          { semi: 7, intervals: [0, 4, 7, 10] },
          { semi: 0, intervals: [0, 4, 7] },
        ], 0.9),
      ),
    },
    {
      prompt: "V–vi is:",
      choices: ["A full stop", "A deceptive cadence. You expected I and got vi", "A key change to the dominant", "A power chord"],
      answer: 1,
      why: "G7 to Am in C. The sentence ducks.",
    },
    {
      prompt: "IV–I, the amen cadence, feels:",
      choices: ["More tense than V–I", "Softer than V–I. Church and some ballads", "Like a flat 2nd", "Like Locrian"],
      answer: 1,
      why: "F to C. No leading tone required.",
    },
  ];
  return (
    <>
      <p>A phrase is a sentence. Cadences are punctuation. Hear the last two chords and you know whether the line ended, paused, or lied.</p>
      <CadencePlayer />
      <h2>Check</h2>
      <Quiz day={17} questions={questions} />
    </>
  );
}

function Day18() {
  const questions: Question[] = [
    {
      prompt: "CAGED, for one letter, is:",
      choices: ["Five different chords", "Five grips that all sound that same major chord, laid along the neck", "A tuning", "A raga"],
      answer: 1,
      why: "C shape, A shape, G shape, E shape, D shape of the same C major (or any letter).",
    },
    {
      prompt: "The E-shape C major barre lives at fret:",
      choices: ["1", "3", "5", "8"],
      answer: 3,
      why: "Low E fret 8 is C. Barre the open-E grip there.",
    },
    {
      prompt: "You should learn CAGED by:",
      choices: ["Memorizing all five tonight", "Owning two shapes, then connecting a third", "Avoiding open chords", "Using only tabs"],
      answer: 1,
      why: "Open C plus E-shape barre at 8 already gives you two photographs of C. Add A-shape at 3 when those two are boring.",
    },
  ];
  return (
    <>
      <p>The neck is not five islands. CAGED is a way to see the same chord in five neighborhoods. Two is enough to start connecting scale boxes to grips.</p>
      <CagedMap />
      <LessonVideos topics={["caged", "barre"]} />
      <h2>Check</h2>
      <Quiz day={18} questions={questions} />
    </>
  );
}

function Day19() {
  const questions: Question[] = [
    {
      prompt: "4/4 means:",
      choices: ["Four beats, quarter gets the beat", "Three beats", "Six equal beats with no accent", "A scale"],
      answer: 0,
      why: "Count 1 2 3 4. Most of the song lab.",
      listen: listen(() => playClicks(8, 96, 4)),
    },
    {
      prompt: "6/8 feels like:",
      choices: ["A waltz of three slow beats", "Two big beats, each split in three", "Four even quarters", "No pulse"],
      answer: 1,
      why: "1-la-li 2-la-li. Ballads and a lot of film 6/8.",
    },
    {
      prompt: "If your strum is rushing, the fix is:",
      choices: ["A new scale", "Count out loud, then strum only on the numbers you can still say", "Capo 7", "Mute the low E always"],
      answer: 1,
      why: "Right hand is a clock. Theory does not rescue a skipped count.",
    },
  ];
  return (
    <>
      <p>
        Harmony without pulse is a list of chords. Count first. Then the right hand has a job. 4/4, 3/4, and 6/8 are the three rooms you will live in.
      </p>
      <RhythmPad />
      <h2>Check</h2>
      <Quiz day={19} questions={questions} />
    </>
  );
}

function Day20() {
  const questions: Question[] = [
    {
      prompt: "Harmonic minor, compared with natural minor, raises:",
      choices: ["The 4th", "The 6th", "The 7th, one fret", "Home"],
      answer: 2,
      why: "In A: G becomes G#. That note lives in E major / E7.",
      listen: listen(() => playPhrase(57, [0, 2, 3, 5, 7, 8, 11, 12], 0.24)),
    },
    {
      prompt: "The V chord in A natural minor is:",
      choices: ["E major", "Em", "G major", "D major"],
      answer: 1,
      why: "v is minor in natural minor. Songs that use E or E7 have borrowed the raised 7th.",
    },
    {
      prompt: "The three-fret gap in A harmonic minor is between:",
      choices: ["A and B", "F and G#", "C and D", "E and F"],
      answer: 1,
      why: "b6 to 7. Do not fill it out of habit if you want that color.",
    },
  ];
  return (
    <>
      <Words
        items={[
          { term: "Natural minor", def: "b3 b6 b7. Pop default." },
          { term: "Harmonic minor", def: "b3 b6, major 7. V becomes major." },
          { term: "Melodic minor", def: "b3, major 6, major 7. Jazz often keeps it both ways." },
        ]}
      />
      <p>This is why so many Am songs grab E7. It is not a random bright chord. It is the raised 7th, stacked.</p>
      <ScaleStudio startId="harmonic-minor" />
      <h2>Check</h2>
      <Quiz day={20} questions={questions} />
    </>
  );
}

function Day21() {
  const questions: Question[] = [
    {
      prompt: "Listen. Distance?",
      choices: ["Minor 3rd, 3 frets", "Major 3rd, 4 frets", "Perfect 5th, 7 frets", "Octave"],
      answer: 2,
      why: "5th. The drone’s other note. Always 7 frets on one string, or two frets higher on the next string from E, A, or D.",
      listen: listen(() => playInterval(64, 7)),
    },
    {
      prompt: "Listen. Distance?",
      choices: ["Minor 2nd", "Tritone, 6 frets", "Major 6th", "Minor 7th"],
      answer: 1,
      why: "Raised 4th / flat 5th. Lydian’s tell, also the blues note’s neighborhood, also the devil in old theory jokes.",
      listen: listen(() => playInterval(64, 6)),
    },
    {
      prompt: "A major 3rd versus a minor 3rd is a difference of:",
      choices: ["An octave", "One fret", "Five frets", "A capo"],
      answer: 1,
      why: "4 versus 3. That one fret is major versus minor, for intervals and for chords.",
      listen: listen(() => {
        playInterval(60, 4);
        window.setTimeout(() => playInterval(60, 3), 900);
      }),
    },
  ];
  return (
    <>
      <p>
        The Ear room has an interval game with more rounds than this check. Today is the idea: name it in frets first. The English word is a nickname.
      </p>
      <p>
        Open <Link to="/ear">Ear → Intervals</Link> and do ten in a row. Come back. Then try <Link to="/coach">Mic</Link> and play the distances yourself.
      </p>
      <LessonVideos topics={["intervals", "ear"]} />
      <h2>Check</h2>
      <Quiz day={21} questions={questions} />
    </>
  );
}

function Day22() {
  const questions: Question[] = [
    {
      prompt: "Listen. Quality?",
      choices: ["Major", "Minor", "Dominant 7", "Diminished"],
      answer: 1,
      why: "Minor 3rd. Three frets.",
      listen: listen(() => playChord(57, [0, 3, 7], 1.1)),
    },
    {
      prompt: "Listen. Quality?",
      choices: ["Major", "Minor", "Dominant 7", "Diminished"],
      answer: 2,
      why: "That extra growl is the flat 7th.",
      listen: listen(() => playChord(55, [0, 4, 7, 10], 1.1)),
    },
    {
      prompt: "If you cannot tell major from minor, check:",
      choices: ["The 5th", "The 3rd, 3 frets vs 4", "The lyrics", "The capo brand"],
      answer: 1,
      why: "Mute extra strings if you have to. Isolate the 3rd.",
    },
  ];
  return (
    <>
      <p>
        Chord quality is almost only the 3rd, plus the 7th when it is there. The Ear room’s Quality game is the gym for this.
      </p>
      <SeventhColors />
      <h2>Check</h2>
      <Quiz day={22} questions={questions} />
    </>
  );
}

function Day23() {
  const questions: Question[] = [
    {
      prompt: "Listen. Family?",
      choices: ["I–V–vi–IV", "i–VI–III–VII", "I–IV–V", "I–bVII–IV"],
      answer: 0,
      why: "Major home, then V, then relative minor, then IV. Ilahi, Let It Be, Photograph.",
      listen: listen(() =>
        playProgression(55, [
          { semi: 0, intervals: [0, 4, 7] },
          { semi: 7, intervals: [0, 4, 7] },
          { semi: 9, intervals: [0, 3, 7] },
          { semi: 5, intervals: [0, 4, 7] },
        ]),
      ),
    },
    {
      prompt: "Listen. Family?",
      choices: ["I–V–vi–IV", "i–VI–III–VII", "I–IV–V", "Power riff"],
      answer: 1,
      why: "Minor home. Am F C G world.",
      listen: listen(() =>
        playProgression(57, [
          { semi: 0, intervals: [0, 3, 7] },
          { semi: 8, intervals: [0, 4, 7] },
          { semi: 3, intervals: [0, 4, 7] },
          { semi: 10, intervals: [0, 4, 7] },
        ]),
      ),
    },
    {
      prompt: "I–V–vi–IV in G, written as letters, is:",
      choices: ["G D Em C", "Am F C G", "G C D", "Em G D A"],
      answer: 0,
      why: "I G, V D, vi Em, IV C.",
    },
  ];
  return (
    <>
      <p>
        Three families cover most of the song lab. Hear which chord can end the chorus. If it is major, you are in the I–V–vi–IV world or I–IV–V. If it is minor, you are in i–VI–III–VII. Mixolydian adds a bVII major.
      </p>
      <p>
        Drill this in <Link to="/ear">Ear → Loops</Link>, then play two songs from the same family in the song lab and notice they share hands.
      </p>
      <h2>Check</h2>
      <Quiz day={23} questions={questions} />
    </>
  );
}

function Day24() {
  const questions: Question[] = [
    {
      prompt: "A power chord contains:",
      choices: ["Root, 3rd, 5th", "Root and 5th, no 3rd", "Only a 3rd", "A major 7th"],
      answer: 1,
      why: "No 3rd means no major or minor. The vocal or a later chord will decide.",
    },
    {
      prompt: "On the low E string, a power chord at fret 3 is:",
      choices: ["F5", "G5", "A5", "C5"],
      answer: 1,
      why: "Low E fret 3 is G. Add the D string? Wait: E string fret 3 is G, A string fret 3 is C which is the 4th... Power chord: E string fret 3 (G) and A string fret 3 (C) is actually a 4th. WRONG.",
    },
  ];
  // I made an error in the why of question 2. Power chord from E string: root on E, 5th is on A string SAME fret because E to A is a 4th... wait.
  // Open E to open A is a 4th (5 semitones). Same fret on A string is also a 4th above the E string note, not a 5th!
  // Power chord on 6th string: root on E string, 5th is on A string TWO FRETS HIGHER? Let's think:
  // E string fret 0 = E. 5th above E is B. A string open is A. A string fret 2 is B. So it's same... no that's 2 frets higher on next string.
  // Standard power chord (E shape): index on E string fret 5 (A), ring on A string fret 7 (E). That's root and 5th, 2 frets apart on adjacent strings.
  // Wait the common "power chord" for root on 6th string: 
  // - Index: 6th string fret N (root)
  // - Ring: 5th string fret N+2 (5th)
  // - Pinky optional: 4th string fret N+2 (octave)
  // Because E to A is a perfect 4th, you need +2 frets on the A string to make a 5th (4th + 2 semitones = 5th).
  //
  // On 5th string root (A string):
  // - A to D is also a 4th, so same: A fret N, D fret N+2
  //
  // I wrote in PowerShapes widget: "same fret on the next string" which is WRONG for standard tuning 6th-to-5th.
  // Same fret on next string is a 4th, not a 5th!
  //
  // UNLESS they mean: skip to the string after? No.
  //
  // Some people play root + 5th as:
  // E fret 5 and D fret 5? E5=A, D5=G... no.
  //
  // Correct: root on 6th fret N, 5th on 5th string fret N+2.
  //
  // I need to fix PowerShapes widget text AND day 24 question.
  //
  // Question: "On the low E string, a power chord at fret 3" - G5 would be E string fret 3 + A string fret 5.
  // Answer G5 is still correct for ROOT at fret 3.
  // The why should say: "Low E fret 3 is G. Add A string fret 5 (the 5th, B? Wait A fret 5 is D). G's 5th is D. Yes A string fret 5 is D."
  //
  // Fix the why text. And fix PowerShapes.

  const fixed: Question[] = [
    questions[0],
    {
      prompt: "On the low E string, a power chord whose root is at fret 3 is:",
      choices: ["F5", "G5", "A5", "C5"],
      answer: 1,
      why: "Low E fret 3 is G. The 5th, D, is on the A string two frets higher (fret 5). Root plus 5th, no 3rd.",
    },
    {
      prompt: "Because there is no 3rd, a power-chord riff:",
      choices: ["Must be major", "Cannot tell major from minor by itself. The vocal or the box will", "Is always Lydian", "Needs a capo"],
      answer: 1,
      why: "Seven Nation Army’s guitar part is roots and fifths. The riff still lives in E minor pentatonic because of the roots it chooses.",
    },
  ];
  return (
    <>
      <p>
        Rock’s movable grip: root and 5th. On the E or A string, that is this fret plus two frets higher on the next string. No 3rd, so the guitar does not argue with a minor vocal.
      </p>
      <PowerShapes />
      <LessonVideos topics={["power", "rock"]} />
      <h2>Check</h2>
      <Quiz day={24} questions={fixed} />
    </>
  );
}

function Day25() {
  const questions: Question[] = [
    {
      prompt: "A sus4 replaces the 3rd with a:",
      choices: ["2nd", "4th", "7th", "Octave"],
      answer: 1,
      why: "1 4 5. It wants to fall to 1 3 5.",
      listen: listen(() => playChord(62, [0, 5, 7], 1)),
    },
    {
      prompt: "Cadd9 keeps the 3rd and adds:",
      choices: ["The 2nd, usually a string higher", "A flat 7th", "A flat 5th", "Nothing"],
      answer: 0,
      why: "C E G D. Open Cadd9 is a guitar cliché because it is easy and bright.",
    },
    {
      prompt: "Wonderwall’s famous grip is mostly:",
      choices: ["Barre majors", "Sus voicings, not plain triads", "Power chords only", "Jazz maj7"],
      answer: 1,
      why: "The lesson is color, not a tab of Noel’s fingers. Sus2/sus4 on those four letters.",
    },
  ];
  return (
    <>
      <p>You do not always need a new chord name from a new root. Sometimes you change one finger on the chord you already have.</p>
      <SusAdd />
      <h2>Check</h2>
      <Quiz day={25} questions={questions} />
    </>
  );
}

function Day26() {
  const questions: Question[] = [
    {
      prompt: "Play C major but rest on D. You are in:",
      choices: ["D major", "D Dorian", "D Mixolydian", "D Lydian"],
      answer: 1,
      why: "D E F G A B C is Dorian: minor 3rd, major 6th.",
    },
    {
      prompt: "C major, rest on G, is:",
      choices: ["G major", "G Mixolydian", "G minor", "G Phrygian"],
      answer: 1,
      why: "G A B C D E F. F is the flat 7th of G. Mixolydian.",
    },
    {
      prompt: "The mode with the raised 4th, from C major’s notes, starts on:",
      choices: ["C", "D", "F", "A"],
      answer: 2,
      why: "F G A B C D E. B is the raised 4th of F. Lydian.",
    },
  ];
  return (
    <>
      <p>
        You already know one major scale. Modes are that scale, starting on a different step. The Ear scale game and the Scales page are the same seven names.
      </p>
      <ModeClock />
      <ScaleStudio startId="dorian" />
      <LessonVideos topics={["modes"]} />
      <h2>Check</h2>
      <Quiz day={26} questions={questions} />
    </>
  );
}

function Day27() {
  const questions: Question[] = [
    {
      prompt: "G shapes, capo 2, sounding key is:",
      choices: ["G", "A", "F", "E"],
      answer: 1,
      why: "G plus two frets is A. Say “G shapes, sounding A.”",
    },
    {
      prompt: "You want sounding E minor but you only like open Am shapes. Capo at:",
      choices: ["2", "3", "7", "0, it is impossible"],
      answer: 2,
      why: "Am plus 7 frets is Em. Capo 7, Am shapes, sounding Em. Or just play open Em.",
    },
    {
      prompt: "Capo does what to roman numerals?",
      choices: ["Changes them", "Nothing. I is still I, in a new letter", "Turns them minor", "Deletes the 7th"],
      answer: 1,
      why: "That is the whole machine.",
    },
  ];
  return (
    <>
      <p>Capo is not cheating. It is transposing without new shapes. The sounding letter is shape plus fret number.</p>
      <CapoMath />
      <LessonVideos topics={["capo", "transpose"]} />
      <h2>Check</h2>
      <Quiz day={27} questions={questions} />
    </>
  );
}

function Day28() {
  const questions: Question[] = [
    {
      prompt: "In C major, D major is:",
      choices: ["ii, so it should be minor — a D major is V of V, pointing at G", "The tonic", "Locrian", "Always wrong"],
      answer: 0,
      why: "ii is Dm. D major has F#. That F# is the leading tone of G. Secondary dominant.",
      listen: listen(() =>
        playProgression(60, [
          { semi: 0, intervals: [0, 4, 7] },
          { semi: 2, intervals: [0, 4, 7] },
          { semi: 7, intervals: [0, 4, 7] },
          { semi: 0, intervals: [0, 4, 7] },
        ]),
      ),
    },
    {
      prompt: "Creep’s B major, while the song feels like G, contains:",
      choices: ["Only notes of G major", "D#, a visitor, which brightens the III", "A flat 2nd", "No 5th"],
      answer: 1,
      why: "G B C Cm. B major is the shock. Then C and Cm are IV and iv.",
    },
    {
      prompt: "A secondary dominant’s job is to:",
      choices: ["End the song", "Point at a target chord a 5th below it", "Flatten home", "Replace the capo"],
      answer: 1,
      why: "V of something. Hear where it wants to go.",
    },
  ];
  return (
    <>
      <p>
        Not every major chord in a major key is diatonic. When ii shows up as major, it is usually V of V. Name the visitor. Ask what it points at. Then you are done being scared of “weird chords.”
      </p>
      <SecondaryDom />
      <LessonVideos topics={["secondary", "harmony"]} />
      <h2>Check</h2>
      <Quiz day={28} questions={questions} />
    </>
  );
}

function Day29() {
  const questions: Question[] = [
    {
      prompt: "Order of attack on a new song:",
      choices: ["Solo first, then key", "Home, quality, three melody notes, family, capo", "Download a tab and never listen", "Assume Yaman"],
      answer: 1,
      why: "That sentence is the whole course, compressed.",
    },
    {
      prompt: "You found home is A and the 3rd is C. Next test is:",
      choices: ["Buy a new guitar", "The 6th: F vs F#, and the 7th: G vs G#", "Only the lyrics", "Whether the video is in color"],
      answer: 1,
      why: "Minor home. F is natural minor. F# is Dorian. G# in the V chord is harmonic minor.",
    },
    {
      prompt: "If the melody uses a note the chords do not contain:",
      choices: ["The song is broken", "That note is a color: mode tell, blue note, or passing tone. Keep both facts", "Ignore the melody", "Change tuning"],
      answer: 1,
      why: "Kun Faya Kun: D G A on guitar, C in the vocal. Both true.",
    },
  ];
  return (
    <>
      <ChordMethod />
      <p>
        Pick a song you have never opened in this lab. Phone recording, no tab. Walk the method. Then, if it is in the lab, compare. If it is not, you still have a map.
      </p>
      <p>
        The <Link to="/songs">song lab</Link> is allowed as a check, not as the first look.
      </p>
      <h2>Check</h2>
      <Quiz day={29} questions={questions} />
    </>
  );
}

function Day30() {
  const questions: Question[] = [
    {
      prompt: "Fret 12 is:",
      choices: ["A random inlay", "The octave: half the string, double the frequency", "Always C", "A minor 3rd"],
      answer: 1,
      why: "Day 1. It never stopped being true.",
    },
    {
      prompt: "Listen. Tell?",
      choices: ["Raised 4th, Lydian", "Flat 7th, Mixolydian", "Flat 2nd, Phrygian", "Perfect 5th only"],
      answer: 0,
      why: "Six frets. F# if home is C.",
      listen: listen(() => playInterval(60, 6)),
    },
    {
      prompt: "G D Em C, if G can end the chorus, is:",
      choices: ["i–VI–III–VII", "I–V–vi–IV", "I–IV–V", "A chromatic loop"],
      answer: 1,
      why: "Major loop. Kesariya in D is the same numerals.",
    },
    {
      prompt: "E-shape barre at fret 1 is:",
      choices: ["E", "F", "F#", "G"],
      answer: 1,
      why: "Open E plus one fret.",
    },
    {
      prompt: "Am F C G with Am as home is:",
      choices: ["C major, starting in the wrong place only", "i–VI–III–VII. It is also the chords of C major, with home on A", "Lydian", "Power riff"],
      answer: 1,
      why: "Both sentences are true. Relative keys share pitches. Home decides the name.",
    },
    {
      prompt: "Capo 4, Am shapes, sounding:",
      choices: ["Am", "C#m", "Em", "Gm"],
      answer: 1,
      why: "A plus 4 semitones is C#. Shape of You teaching charts do this.",
    },
    {
      prompt: "A minor pentatonic and C major pentatonic:",
      choices: ["Use different frets", "Use the same pitches. Home moved three semitones", "Require alternate tuning", "Forbid the note C"],
      answer: 1,
      why: "A C D E G. Call C home and it is major pentatonic.",
    },
    {
      prompt: "Listen. Quality?",
      choices: ["Minor", "Major", "Diminished", "Sus4"],
      answer: 1,
      why: "Major 3rd.",
      listen: listen(() => playChord(52, [0, 4, 7], 1)),
    },
    {
      prompt: "The 5th is always how many frets on one string?",
      choices: ["5", "7", "4", "12"],
      answer: 1,
      why: "Seven. The interval name ‘fifth’ is a scale-step name. The guitar name is 7 frets.",
    },
    {
      prompt: "A new song starts with:",
      choices: ["A raga guess", "A question: which note can end the line, and is its 3rd major or minor?", "Downloading the hardest tab", "Retuning to DADGAD by default"],
      answer: 1,
      why: "Then three melody notes, then family, then capo. You are done with the course when that is a habit, not a poster.",
    },
  ];
  return (
    <>
      <p>
        Ten questions. Eight is a pass. Then live in the gym, the ear room, and the song lab. Mastery is reps on those three, not a certificate.
      </p>
      <h2>Check</h2>
      <Quiz day={30} questions={questions} passAt={0.8} />
    </>
  );
}
