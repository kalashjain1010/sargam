export const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export const FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

export const MAJOR = [0, 2, 4, 5, 7, 9, 11];
export const NATURAL_MINOR = [0, 2, 3, 5, 7, 8, 10];
export const KAFI = [0, 2, 3, 5, 7, 9, 10];
export const BHUPALI = [0, 2, 4, 7, 9];
export const MINOR_PENT = [0, 3, 5, 7, 10];
export const BLUES = [0, 3, 5, 6, 7, 10];
export const YAMAN = [0, 2, 4, 6, 7, 9, 11];
export const KHAMAJ = [0, 2, 4, 5, 7, 9, 10];
export const BHAIRAVI = [0, 1, 3, 5, 7, 8, 10];
export const BHAIRAV = [0, 1, 4, 5, 7, 8, 11];
export const MALKAUNS = [0, 3, 5, 8, 10];
export const HARMONIC_MINOR = [0, 2, 3, 5, 7, 8, 11];
export const MELODIC_MINOR = [0, 2, 3, 5, 7, 9, 11];
export const LOCRIAN = [0, 1, 3, 5, 6, 8, 10];
export const PHRYG_DOM = [0, 1, 4, 5, 7, 8, 10];
export const MIXOLYDIAN = KHAMAJ;
export const LYDIAN = YAMAN;
export const DORIAN = KAFI;
export const PHRYGIAN = BHAIRAVI;
export const BYZANTINE = BHAIRAV;
export const MAJOR_PENT = BHUPALI;

export type SwaraKind = "fixed" | "shuddh" | "komal" | "tivra";

export type Swara = {
  semi: number;
  name: string;
  dev: string;
  kind: SwaraKind;
};

export const SWARAS: Swara[] = [
  { semi: 0, name: "Sa", dev: "सा", kind: "fixed" },
  { semi: 1, name: "re", dev: "रे", kind: "komal" },
  { semi: 2, name: "Re", dev: "रे", kind: "shuddh" },
  { semi: 3, name: "ga", dev: "ग", kind: "komal" },
  { semi: 4, name: "Ga", dev: "ग", kind: "shuddh" },
  { semi: 5, name: "Ma", dev: "म", kind: "shuddh" },
  { semi: 6, name: "Ma tivra", dev: "म", kind: "tivra" },
  { semi: 7, name: "Pa", dev: "प", kind: "fixed" },
  { semi: 8, name: "dha", dev: "ध", kind: "komal" },
  { semi: 9, name: "Dha", dev: "ध", kind: "shuddh" },
  { semi: 10, name: "ni", dev: "नि", kind: "komal" },
  { semi: 11, name: "Ni", dev: "नि", kind: "shuddh" },
];

export type StringSpec = { id: string; name: string; midi: number };

export const STRINGS: StringSpec[] = [
  { id: "e", name: "high e", midi: 64 },
  { id: "B", name: "B", midi: 59 },
  { id: "G", name: "G", midi: 55 },
  { id: "D", name: "D", midi: 50 },
  { id: "A", name: "A", midi: 45 },
  { id: "E", name: "low E", midi: 40 },
];

export type Quality = "maj" | "min" | "7" | "dim";

export type DayMeta = {
  id: number;
  title: string;
  kicker: string;
  minutes: number;
  promise: string;
  unit: string;
};

export const DAYS: DayMeta[] = [
  { id: 1, unit: "Foundation", title: "Fret 12 is the same letter", kicker: "Pitch", minutes: 12, promise: "Open E, then fret 12. Same letter, just higher — like folding a string in half." },
  { id: 2, unit: "Foundation", title: "Home is a choice", kicker: "Keys", minutes: 14, promise: "C D E F G A B never move. Home can. A capo is just “start the song two stairs higher.”" },
  { id: 3, unit: "Foundation", title: "Songs are distances", kicker: "Intervals", minutes: 15, promise: "A 5th is 7 frets. A major 3rd is 4. A minor 3rd is 3. Count on one string. Do not guess." },
  { id: 4, unit: "Foundation", title: "The major scale walk", kicker: "Major", minutes: 14, promise: "From any letter: skip, skip, next, skip, skip, skip, next. That walk is G, C, D, A, and E." },
  { id: 5, unit: "Foundation", title: "Three different minors", kicker: "Minor", minutes: 16, promise: "“Sad” is not one box. Check the 6th and the 2nd. One fret changes the whole mood." },
  { id: 6, unit: "Foundation", title: "A chord is three letters", kicker: "Harmony", minutes: 15, promise: "C major is C, E, and G. The cowboy shape is just one way to grab those three." },
  { id: 7, unit: "Songs", title: "The loop under the song", kicker: "Progressions", minutes: 14, promise: "G–D–Em–C and Am–F–C–G are the same family with a different front door." },
  { id: 8, unit: "Songs", title: "Find the key yourself", kicker: "Method", minutes: 16, promise: "Find the note a line can rest on. Then count three melody notes in frets. That is the key." },
  { id: 9, unit: "Songs", title: "The five-note box", kicker: "Pentatonic", minutes: 14, promise: "A minor pentatonic and C major pentatonic are the same dots. Home moved three frets." },
  { id: 10, unit: "Songs", title: "Same notes, new home", kicker: "Modes", minutes: 18, promise: "Play C major, then rest on D. You did not learn new notes. You moved home. That is a mode." },
  { id: 11, unit: "Songs", title: "Three songs, one test each", kicker: "Tells", minutes: 16, promise: "Raised 4th, flat 7th, or a minor home. One check each. Romance is not a scale." },
  { id: 12, unit: "Songs", title: "Play it back", kicker: "Check", minutes: 15, promise: "Name the distance, name the letter, hold the note. A new song starts with a question." },
  { id: 13, unit: "Harmony", title: "How to find the chords", kicker: "By ear", minutes: 18, promise: "Bass first, then happy or sad (the 3rd), then the family. Tabs become optional." },
  { id: 14, unit: "Harmony", title: "Two shapes, twelve keys", kicker: "Barre", minutes: 16, promise: "Slide the open E shape. Slide the open A shape. That is most of the neck." },
  { id: 15, unit: "Harmony", title: "Add one more note", kicker: "Sevenths", minutes: 15, promise: "A triad plus one extra. Dominant 7 pulls. Major 7 sits. Minor 7 is smoky." },
  { id: 16, unit: "Harmony", title: "The circle of fifths", kicker: "Keys", minutes: 16, promise: "Clockwise is 7 frets up. Neighbors are the chords a song actually uses." },
  { id: 17, unit: "Harmony", title: "How a phrase ends", kicker: "Cadence", minutes: 14, promise: "V–I finishes. IV–I says amen. V–vi ducks. The last two chords are the period." },
  { id: 18, unit: "Harmony", title: "The same C, five photos", kicker: "CAGED", minutes: 18, promise: "Five grips for one C major chord along the neck. Two is enough to start." },
  { id: 19, unit: "Groove", title: "Count before you strum", kicker: "Rhythm", minutes: 14, promise: "4/4, 3/4, and 6/8 are different rooms. The right hand only makes sense after the count." },
  { id: 20, unit: "Groove", title: "Why Am songs use E7", kicker: "Minor V", minutes: 16, promise: "Raise one note in a minor scale and V becomes major. That is the E or E7 in Am songs." },
  { id: 21, unit: "Ear", title: "Hear the distance", kicker: "Intervals", minutes: 16, promise: "Two notes. Count the frets in your head. Then name it in English." },
  { id: 22, unit: "Ear", title: "Hear happy or sad", kicker: "Chords", minutes: 15, promise: "Major, minor, dominant 7, diminished. Listen for the 3rd, then the extra note." },
  { id: 23, unit: "Ear", title: "Hear the loop", kicker: "Progressions", minutes: 16, promise: "Three families cover most of the song lab. Name which one you are in." },
  { id: 24, unit: "Ear", title: "Power chords", kicker: "Rock", minutes: 12, promise: "Two notes: root and 5th. No 3rd, so not major or minor. Move the two-fret shape." },
  { id: 25, unit: "Mastery", title: "One finger changes the vowel", kicker: "Color", minutes: 14, promise: "Sus4 wants to fall. Add9 sparkles. Same grip, one finger moved." },
  { id: 26, unit: "Mastery", title: "One string, seven modes", kicker: "Modes", minutes: 16, promise: "Walk skip-skip-next on one string. Start on a new fret. That is every church mode." },
  { id: 27, unit: "Mastery", title: "Capo is addition", kicker: "Capo", minutes: 12, promise: "Capo 2 plus G shapes = A. The song did not change. Your hands did." },
  { id: 28, unit: "Mastery", title: "A visitor that points", kicker: "Borrow", minutes: 16, promise: "A D major chord in C major is “V of V.” It is not random. It points at G." },
  { id: 29, unit: "Mastery", title: "A new song, no chart", kicker: "By ear", minutes: 18, promise: "Home, quality, three melody notes, family, capo. That is the whole method." },
  { id: 30, unit: "Mastery", title: "Master check", kicker: "Exam", minutes: 20, promise: "Intervals, modes, loops, barre math, and a song nobody handed you." },
];

export const DAY_COUNT = DAYS.length;

export type Raga = {
  id: string;
  name: string;
  dev: string;
  thaat: string;
  western: string;
  steps: number[];
  pakad: number[];
  pakadText: string;
  vadi: string;
  time: string;
  feel: string;
  rule: string;
  avoid: string;
  guitar: string;
};

export const RAGAS: Raga[] = [
  {
    id: "bilawal",
    name: "Bilawal",
    dev: "बिलावल",
    thaat: "Bilawal",
    western: "Major scale, Ionian",
    steps: MAJOR,
    pakad: [7, 9, 11, 12, 11, 9, 7],
    pakadText: "Pa Dha Ni Sa Ni Dha Pa",
    vadi: "Dha, in many accounts Ma",
    time: "Late morning, by tradition",
    feel: "Open, settled, daylight",
    rule: "All seven notes of the major scale. The major 7th leans up into home. The 4th is a normal perfect 4th, one of the calmest distances on the guitar.",
    avoid: "Nothing inside the scale is forbidden. The sound goes pale if you never let the 7th resolve.",
    guitar: "Open G, C, D, A, and E major are this shape. The major-scale box you already half-know is this.",
  },
  {
    id: "bhupali",
    name: "Bhupali",
    dev: "भूपाली",
    thaat: "Kalyan",
    western: "Major pentatonic",
    steps: BHUPALI,
    pakad: [0, 2, 4, 7, 9, 7, 4, 2, 0],
    pakadText: "Sa Re Ga Pa Dha Pa Ga Re Sa",
    vadi: "Ga",
    time: "Night, by tradition",
    feel: "Clear, folk, devotional, uncluttered",
    rule: "Five notes: 1 2 3 5 6. No 4th, no 7th. The missing 7th is why it does not pull hard into home. The missing 4th is why it never sounds like a school major scale.",
    avoid: "Do not sit on the 4th or 7th. On guitar in G, a C chord contains the 4th and a D chord contains the 7th. G and Em stay inside the raga.",
    guitar: "Same frets as the major pentatonic. If you know the minor box, start it three frets higher and call the new home C.",
  },
  {
    id: "yaman",
    name: "Yaman",
    dev: "यमन",
    thaat: "Kalyan",
    western: "Lydian",
    steps: YAMAN,
    pakad: [-1, 2, 4, 6, 7],
    pakadText: "Ni Re Ga Ma(tivra) Pa",
    vadi: "Ga",
    time: "First quarter of the night, by tradition",
    feel: "Sweet, a little airborne",
    rule: "Every major-scale note, except the 4th is raised one fret. That raised 4th is six frets above home, a tritone, and it is the whole identity of the raga.",
    avoid: "Do not rest on the natural 4th. In C that note is F. An F chord plants the one note Yaman keeps moving past.",
    guitar: "In C, the D major chord contains F#, the raised 4th. C, D, and G sketch a bed. The melody's job is to touch F# and not sit on F.",
  },
  {
    id: "khamaj",
    name: "Khamaj",
    dev: "खमाज",
    thaat: "Khamaj",
    western: "Mixolydian, with a guest shuddh Ni",
    steps: KHAMAJ,
    pakad: [4, 5, 7, 9, 10, 9, 7, 5],
    pakadText: "Ga Ma Pa Dha ni Dha Pa Ma",
    vadi: "Ga",
    time: "Late night, by tradition",
    feel: "Light, romantic, thumri, a major key with the door left open",
    rule: "Major scale with a flat 7th as the main seventh. Phrases may also brush the major 7th on the way down. Hearing both 7ths, one fret apart, is the tell.",
    avoid: "Do not turn it into natural minor. The 3rd stays major. If the 3rd is minor, you have left Khamaj.",
    guitar: "Play a major chord on home, then find the fret one below the major 7th. That flat 7th against a major home is the color. In D, it is the note C.",
  },
  {
    id: "kafi",
    name: "Kafi",
    dev: "काफी",
    thaat: "Kafi",
    western: "Dorian",
    steps: KAFI,
    pakad: [5, 7, 9, 7, 5, 3, 2, 0],
    pakadText: "Ma Pa Dha Pa Ma ga Re Sa",
    vadi: "Pa",
    time: "Late night, by tradition",
    feel: "Folk, thumri, earthly minor that is not tragic",
    rule: "Minor 3rd and minor 7th only. The 2nd and 6th stay major. That major 6th is the note that separates Dorian / Kafi from natural minor.",
    avoid: "If you also flatten the 6th, you have walked into natural minor. Film songs do this on purpose. Notice when they do.",
    guitar: "Minor chord on home, but the 6th of the scale is major. In A, Kafi uses F#, while A natural minor uses F.",
  },
  {
    id: "bhairavi",
    name: "Bhairavi",
    dev: "भैरवी",
    thaat: "Bhairavi",
    western: "Phrygian, as a thaat. Film Bhairavi is often mishra, with extra notes.",
    steps: BHAIRAVI,
    pakad: [0, 1, 3, 5, 8, 5, 3, 1, 0],
    pakadText: "Sa re ga Ma dha Ma ga re Sa",
    vadi: "Ma, often described that way; some traditions say Sa",
    time: "Morning, by tradition. Film music uses it whenever the scene needs pathos.",
    feel: "Devotional, aching, a minor that leans on the fret just above home",
    rule: "The parent flattens the 2nd, 3rd, 6th, and 7th. The 4th and 5th stay. The note one fret above home, the flat 2nd, is the morning tell.",
    avoid: "Do not treat a textbook climb as a police line. Film Bhairavi adds natural notes as visitors. The home still feels like a flat 2nd and a minor 3rd.",
    guitar: "Compared with your natural-minor shape, move the 2nd down one fret. In A minor, the usual B becomes Bb.",
  },
  {
    id: "bhairav",
    name: "Bhairav",
    dev: "भैरव",
    thaat: "Bhairav",
    western: "No everyday mode name. Major third, flat 2, flat 6.",
    steps: BHAIRAV,
    pakad: [0, 1, 4, 5, 8, 7, 4, 1, 0],
    pakadText: "Sa re Ga Ma dha Pa Ga re Sa",
    vadi: "Dha",
    time: "Dawn, by tradition",
    feel: "Wide, serious, old",
    rule: "Flat 2nd and flat 6th. The 3rd and 7th stay major. The jump from the flat 2nd to the major 3rd is three frets, an augmented 2nd, and you can hear the gap.",
    avoid: "Do not fill that gap out of habit. The empty fret between the flat 2nd and the major 3rd is the raga.",
    guitar: "From home, one fret up, then skip to four frets up. If your fingers want the fret in between, that is the major-scale habit. Leave it out.",
  },
  {
    id: "malkauns",
    name: "Malkauns",
    dev: "मालकौंस",
    thaat: "Bhairavi",
    western: "Minor pentatonic with Pa moved up to komal Dha",
    steps: MALKAUNS,
    pakad: [0, 3, 5, 8, 10, 8, 5, 3, 0],
    pakadText: "Sa ga Ma dha ni dha Ma ga Sa",
    vadi: "Ma",
    time: "Late night, by tradition",
    feel: "Heavy, slow, serious",
    rule: "Five notes: 1 b3 4 b6 b7. No 2nd and no 5th. The 4th is natural and important.",
    avoid: "Your minor-pentatonic box includes the 5th. Malkauns moves that one fret up to a minor 6th. Playing the old 5th turns it back into the box you already know.",
    guitar: "Take the minor pentatonic and shift the 5th up one fret.",
  },
];

export type Thaat = {
  name: string;
  dev: string;
  steps: number[];
  western: string;
  raga: string;
};

export const THAATS: Thaat[] = [
  { name: "Bilawal", dev: "बिलावल", steps: MAJOR, western: "Major / Ionian", raga: "Bilawal" },
  { name: "Kalyan", dev: "कल्याण", steps: YAMAN, western: "Lydian", raga: "Yaman" },
  { name: "Khamaj", dev: "खमाज", steps: KHAMAJ, western: "Mixolydian", raga: "Khamaj" },
  { name: "Bhairav", dev: "भैरव", steps: BHAIRAV, western: "Flat 2, flat 6, major 3rd", raga: "Bhairav" },
  { name: "Poorvi", dev: "पूर्वी", steps: [0, 1, 4, 6, 7, 8, 11], western: "Bhairav with tivra Ma", raga: "Poorvi" },
  { name: "Marwa", dev: "मारवा", steps: [0, 1, 4, 6, 7, 9, 11], western: "Bhairav's Re, Kalyan's Ma, shuddh Dha", raga: "Marwa omits Pa in performance" },
  { name: "Kafi", dev: "काफी", steps: KAFI, western: "Dorian", raga: "Kafi" },
  { name: "Asavari", dev: "आसावरी", steps: NATURAL_MINOR, western: "Natural minor / Aeolian", raga: "Asavari, and most minor pop songs" },
  { name: "Bhairavi", dev: "भैरवी", steps: BHAIRAVI, western: "Phrygian", raga: "Bhairavi" },
  { name: "Todi", dev: "तोडी", steps: [0, 1, 3, 6, 7, 8, 11], western: "Komal Re, Ga, Dha, tivra Ma, shuddh Ni", raga: "Todi" },
];

export type Song = {
  id: string;
  title: string;
  film: string;
  year: string;
  family: string;
  ragaId?: string;
  confidence: "established" | "commonly taught" | "arrangement";
  summary: string;
  tell: string;
  confirm: string[];
  steps: number[];
  guitarPc: number;
  chords: { semi: number; q: Exclude<Quality, "dim"> }[];
  loopName: string;
  bedNote: string;
  caveat: string;
};

const CORE_SONGS: Song[] = [
  {
    id: "abhi-na-jao",
    title: "Abhi Na Jao Chhod Kar",
    film: "Hum Dono",
    year: "1961",
    family: "Lydian",
    ragaId: "yaman",
    confidence: "established",
    summary: "Jaidev's duet for Rafi and Asha is a standard classroom example of Yaman. The lesson is not the lyric. It is the raised fourth.",
    tell: "Find home, then listen for the 4th. Yaman's 4th is one fret higher than the 4th in a normal major scale. In guitar C, that is F# instead of F.",
    confirm: [
      "Hum the last note of a line until it feels finished. Match it on the B or high e string. Call it home.",
      "Find the note six frets above that home on one string. If the melody leans on it, you are hearing the raised 4th.",
      "Check the note five frets above home. Yaman passes through that fret. It does not sit there.",
    ],
    steps: YAMAN,
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 2, q: "maj" },
      { semi: 7, q: "maj" },
    ],
    loopName: "C · D · G as a practice bed",
    bedNote: "In C, D major contains F#, the raised 4th. This is a sketch that keeps the raga's note available. It is not a claim about Jaidev's arrangement.",
    caveat: "The record is not in the key of C. Move home until your voice matches, and take the frets with you.",
  },
  {
    id: "ehsaan",
    title: "Ehsaan Tera Hoga Mujh Par",
    film: "Junglee",
    year: "1961",
    family: "Lydian",
    ragaId: "yaman",
    confidence: "commonly taught",
    summary: "Shankar–Jaikishan's Rafi song is widely taught as Yaman. Use the same tell as Abhi Na Jao: a major-scale world with the 4th raised.",
    tell: "If the 4th of the melody sounds a fret higher than the F you would play in C major, you are in Lydian / Yaman territory.",
    confirm: [
      "Establish home.",
      "Play the natural 4th and the raised 4th under the line. The one that belongs will sit inside the vocal. The other will scrape.",
    ],
    steps: YAMAN,
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 2, q: "maj" },
      { semi: 7, q: "maj" },
    ],
    loopName: "C · D · G practice bed",
    bedNote: "Same Yaman bed as the other Kalyan song: the II major chord is doing the work, because it carries the raised 4th.",
    caveat: "Commonly taught as Yaman. Phrase rules in the film are looser than a classical performance.",
  },
  {
    id: "jyoti",
    title: "Jyoti Kalash Chhalke",
    film: "Bhabhi Ki Chudiyan",
    year: "1961",
    family: "Major pentatonic",
    ragaId: "bhupali",
    confidence: "commonly taught",
    summary: "Lata, Sudhir Phadke. A clean five-note song: C D E G A when home is C. Beginners use it because there is no 4th and no 7th to worry about.",
    tell: "The melody never needs the perfect 4th or the major 7th. If you can sing the whole line with five notes, you are in major pentatonic / Bhupali.",
    confirm: [
      "Set home.",
      "Check fret 5 (the 4th) and fret 11 (the 7th). They should sound like visitors, not like members.",
      "In G, strum G and Em. Avoid camping on C, which introduces the 4th.",
    ],
    steps: BHUPALI,
    guitarPc: 7,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 9, q: "min" },
    ],
    loopName: "G · Em",
    bedNote: "G is G B D. Em is E G B. Both triads live inside Bhupali. C would add the 4th. D would add the 7th.",
    caveat: "The film key may not be G. G is the guitar-friendly home. Capo until the open G matches the singer's home.",
  },
  {
    id: "payoji",
    title: "Payoji Maine Ram Ratan Dhan Payo",
    film: "Traditional Meerabai bhajan",
    year: "traditional",
    family: "Major pentatonic",
    ragaId: "bhupali",
    confidence: "established",
    summary: "The familiar bhajan tune is Bhupali: five notes, no 4th, no 7th. A traditional melody, so the raga and the song grew up together.",
    tell: "Same five-note test as Jyoti Kalash. Devotional tunes in this shape feel open because the leading tone is absent.",
    confirm: [
      "Drone home and the 5th.",
      "Sing the hook on 1 2 3 5 6 only.",
      "If you need a fret for the 4th, you have left the tune or you have picked the wrong home.",
    ],
    steps: BHUPALI,
    guitarPc: 7,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 9, q: "min" },
    ],
    loopName: "G · Em",
    bedNote: "Two chords are enough. Bhupali gets muddy when the accompaniment starts supplying the notes the raga omitted.",
    caveat: "Singers transpose bhajans to the voice. The raga moves with home.",
  },
  {
    id: "panghat",
    title: "Mohe Panghat Pe",
    film: "Mughal-e-Azam",
    year: "1960",
    family: "Mixolydian",
    ragaId: "khamaj",
    confidence: "commonly taught",
    summary: "Naushad, Lata. Taught as Khamaj: a bright major frame with a flat 7th, and room for a major 7th in the phrase.",
    tell: "Home feels major. The 7th is the loose one. The flat 7th is one fret under the major 7th, and a phrase may touch both.",
    confirm: [
      "Find home and confirm the 3rd is major, four frets up, not three. If the 3rd is minor, this is not Khamaj.",
      "Then find both notes 10 and 11 frets above home. The song's 7th lives in that pair, with 10 as the main one.",
    ],
    steps: KHAMAJ,
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 5, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "C · F · Bb",
    bedNote: "Bb is the flat 7th as a chord root, in the key of C. The practice bed shows that flat 7th. It is not a transcription of the orchestra.",
    caveat: "Classical Khamaj and a film song with Khamaj color are not the same strictness. Listen for the seventh, not for a rulebook.",
  },
  {
    id: "piya-tose",
    title: "Piya Tose Naina Lage Re",
    film: "Guide",
    year: "1965",
    family: "Mixolydian",
    ragaId: "khamaj",
    confidence: "commonly taught",
    summary: "S.D. Burman. Another light Khamaj classic. Major home, flat 7th in the melody, the gait of a thumri more than a pop loop.",
    tell: "Same test as Mohe Panghat Pe. Major 3rd, movable 7th.",
    confirm: [
      "Home, then the 3rd: it should match a major chord's 3rd.",
      "Home, then the 7th: it should match the fret just below the major-scale 7th.",
    ],
    steps: KHAMAJ,
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 5, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "C · F · Bb",
    bedNote: "Practice bed only. The ballet arrangement is much larger than three chords.",
    caveat: "Use it to train the Khamaj tell, then go back to the record and move home.",
  },
  {
    id: "chunari",
    title: "Laga Chunari Mein Daag",
    film: "Dil Hi To Hai",
    year: "1963",
    family: "Phrygian",
    ragaId: "bhairavi",
    confidence: "commonly taught",
    summary: "S.D. Burman, Manna Dey. Widely taught as Bhairavi. The morning raga of pathos, used here as light classical.",
    tell: "Compared with a normal minor scale, the 2nd is one fret lower. That flat 2nd, a half step above home, is the note to hunt.",
    confirm: [
      "Find home.",
      "Play fret 1 and fret 2 above it. Fret 1 is Bhairavi's 2nd. Fret 2 is the 2nd of Dorian and of natural minor.",
      "The vocal will choose. Trust the vowel, not the chord chart.",
    ],
    steps: BHAIRAVI,
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 5, q: "min" },
    ],
    loopName: "Am · Dm",
    bedNote: "Am and Dm do not themselves contain the flat 2nd. They only set a minor home. The melody has to supply the Bb, which is the flat 2nd when home is A.",
    caveat: "Film Bhairavi is often mixed: other notes visit. The home sound is still a flat 2nd and a minor 3rd.",
  },
  {
    id: "kun-faya",
    title: "Kun Faya Kun",
    film: "Rockstar",
    year: "2011",
    family: "Mixolydian",
    ragaId: "khamaj",
    confidence: "arrangement",
    summary: "A.R. Rahman. Lesson transcriptions often put the song in D and mark a flat 7th in the melody, over major chords D, G, and A. That combination is Khamaj's color, not a full raga performance.",
    tell: "The guitar bed feels major. The vocal dips to the flat 7th. In D, the major 7th is C# (inside the A chord) and the flat 7th is C (in the melody). Both existing is the point.",
    confirm: [
      "Capo or tune until the home chord is a D shape you can sing.",
      "Find C and C# on the B string (from D, the flat 7th is 10 frets up on the same string).",
      "Hear which one the voice holds, and which one only the chord flicks.",
    ],
    steps: KHAMAJ,
    guitarPc: 2,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 5, q: "maj" },
      { semi: 7, q: "maj" },
    ],
    loopName: "D · G · A",
    bedNote: "D, G, and A are the chords lesson charts agree on. A contains C#, the major 7th. The melody's C is the flat 7th and will disagree with that A chord on purpose.",
    caveat: "This is a film song with a Khamaj-like 7th, not a recital of raga Khamaj. Qawwali phrasing bends notes between the frets. The mic will call those 'out' if you expect piano pitch. Judge the landing.",
  },
  {
    id: "tum-hi-ho",
    title: "Tum Hi Ho",
    film: "Aashiqui 2",
    year: "2013",
    family: "Minor loop",
    confidence: "arrangement",
    summary: "The common guitar arrangement is a minor loop: Am, C, G, F. That is i, III, VII, VI. It is not Yaman. Yaman has a major third and a raised fourth. This home is minor.",
    tell: "The 3rd of the home chord is minor, three frets above home, not four. After that, test the 6th. A minor 6th means natural minor. A major 6th would lean toward Dorian / Kafi.",
    confirm: [
      "The chord that can end the chorus is i. In the usual guitar key that is Am, so home is A.",
      "Play A minor pentatonic or A natural minor under the vocal and listen for F, which is the minor 6th. If the line accepts F#, you are hearing Dorian instead.",
    ],
    steps: NATURAL_MINOR,
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
      { semi: 8, q: "maj" },
    ],
    loopName: "Am · C · G · F",
    bedNote: "This is the arrangement guitarists actually teach each other. The studio key may sit elsewhere. The roman numerals travel: i III VII VI.",
    caveat: "Do not let a 'romantic song, therefore Yaman' explanation through. Test the 3rd and test the 4th. This song fails the Yaman test.",
  },
  {
    id: "channa",
    title: "Channa Mereya",
    film: "Ae Dil Hai Mushkil",
    year: "2016",
    family: "Minor loop",
    confidence: "arrangement",
    summary: "A minor ballad. The usual open chords are Am, F, C, G: i, VI, III, VII. Same family as Tum Hi Ho, rotated.",
    tell: "Minor home. The loop still uses major chords on the VI, III, and VII, which is why it does not sound like a drone in one raga. It sounds like film harmony.",
    confirm: [
      "End the phrase on Am. If that feels like the floor, home is A in this arrangement.",
      "Sing the 3rd: C is the minor 3rd. The major 3rd would have been C#.",
    ],
    steps: NATURAL_MINOR,
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "Am · F · C · G",
    bedNote: "Common open-chord reduction. The single is more ornate than four chords, and the key can be capoed.",
    caveat: "Natural minor is the right first map. If a line uses F# while home is A, mark that bar as a visitor, not as a new song.",
  },
  {
    id: "ilahi",
    title: "Ilahi",
    film: "Yeh Jawaani Hai Deewani",
    year: "2013",
    family: "Major loop",
    confidence: "arrangement",
    summary: "Bright major. The guitar habit is G, D, Em, C: I, V, vi, IV. Bilawal notes, pop chords, no raga claim.",
    tell: "The home chord is major and the loop walks to the relative minor and back. The 7th in the melody is usually major, pulling up to home.",
    confirm: [
      "If the chorus can end on G, home is G in this arrangement.",
      "Em should feel like a visit, not like home. If Em feels like home, you are hearing the relative minor and the key is E minor, not G.",
    ],
    steps: MAJOR,
    guitarPc: 7,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 7, q: "maj" },
      { semi: 9, q: "min" },
      { semi: 5, q: "maj" },
    ],
    loopName: "G · D · Em · C",
    bedNote: "I V vi IV. The same four chords, in some order, carry a huge share of Hindi and English pop.",
    caveat: "Arrangement key G. Capo to the singer.",
  },
  {
    id: "kal-ho",
    title: "Kal Ho Naa Ho",
    film: "Kal Ho Naa Ho",
    year: "2003",
    family: "Major loop",
    confidence: "arrangement",
    summary: "A major ballad. Open-chord reductions of the chorus land on the same I–V–vi–IV family as Ilahi, usually taught in G or C.",
    tell: "Major home, diatonic chords, the relative minor used as color in the middle of the loop rather than as the tonic.",
    confirm: [
      "Find the chord that could finish the sentence of the chorus.",
      "Build a major scale on it and see if the other chords are the 5th, the 6th, and the 4th of that scale.",
    ],
    steps: MAJOR,
    guitarPc: 7,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 7, q: "maj" },
      { semi: 9, q: "min" },
      { semi: 5, q: "maj" },
    ],
    loopName: "G · D · Em · C",
    bedNote: "A common chorus reduction in G. The original harmony is richer than four open chords.",
    caveat: "Not Yaman unless you can hear a raised 4th held as a feature. A diatonic major chorus does not become Kalyan just because it is romantic.",
  },
  {
    id: "kesariya",
    title: "Kesariya",
    film: "Brahmastra",
    year: "2022",
    family: "Major loop",
    confidence: "arrangement",
    summary: "Major, romantic, and taught on guitar as a I–V–vi–IV song. D is a comfortable guitar home: D, A, Bm, G.",
    tell: "Same machine as Ilahi and Kal Ho Naa Ho. If you can move those three songs onto the same four chord shapes with a capo, you have understood the loop.",
    confirm: [
      "Put a capo on until the home chord is an open D or open G you can sing.",
      "Check the six chord: it should be minor, and it should not feel like the end of the sentence.",
    ],
    steps: MAJOR,
    guitarPc: 2,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 7, q: "maj" },
      { semi: 9, q: "min" },
      { semi: 5, q: "maj" },
    ],
    loopName: "D · A · Bm · G",
    bedNote: "I V vi IV in D. Capo freely. The pattern is the lesson.",
    caveat: "Guitar key, not a studio-key claim.",
  },
];

const ARR_CONFIRM = [
  "Find the chord that can end the chorus. That rest is home.",
  "Name whether that chord is major or minor. That is I versus i.",
  "Map every other chord as a degree of that home. If they sit in one scale, you have the family.",
  "Capo until the shapes are ones you can sing over. Home moved. Distances did not.",
];

function arrangement(p: {
  id: string;
  title: string;
  film: string;
  year: string;
  family: string;
  guitarPc: number;
  chords: Song["chords"];
  steps?: number[];
  loopName: string;
  summary: string;
  tell: string;
  caveat?: string;
  ragaId?: string;
}): Song {
  const homeMinor = p.chords[0]?.q === "min";
  return {
    confidence: "arrangement",
    confirm: ARR_CONFIRM,
    bedNote: `${p.loopName}. Common guitar reduction. Studio key may differ. Roman numerals travel.`,
    caveat: p.caveat ?? "Arrangement for practice, not a transcription of the record. No melody is copied here.",
    ...p,
    steps: p.steps ?? (homeMinor ? NATURAL_MINOR : MAJOR),
  };
}

const I_V_vi_IV: Song["chords"] = [
  { semi: 0, q: "maj" },
  { semi: 7, q: "maj" },
  { semi: 9, q: "min" },
  { semi: 5, q: "maj" },
];
const I_vi_IV_V: Song["chords"] = [
  { semi: 0, q: "maj" },
  { semi: 9, q: "min" },
  { semi: 5, q: "maj" },
  { semi: 7, q: "maj" },
];
const i_VI_III_VII: Song["chords"] = [
  { semi: 0, q: "min" },
  { semi: 8, q: "maj" },
  { semi: 3, q: "maj" },
  { semi: 10, q: "maj" },
];
const i_III_VII_VI: Song["chords"] = [
  { semi: 0, q: "min" },
  { semi: 3, q: "maj" },
  { semi: 10, q: "maj" },
  { semi: 8, q: "maj" },
];
const I_V_IV: Song["chords"] = [
  { semi: 0, q: "maj" },
  { semi: 7, q: "maj" },
  { semi: 5, q: "maj" },
];

const MORE_SONGS: Song[] = [
  arrangement({
    id: "agar-tum",
    title: "Agar Tum Saath Ho",
    film: "Tamasha",
    year: "2015",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Minor home, the same i–VI–III–VII family as Channa Mereya. Taught on guitar in Am.",
    tell: "The chorus can rest on Am. F, C, and G are VI, III, and VII. Test the 3rd: C, not C#.",
  }),
  arrangement({
    id: "gerua",
    title: "Gerua",
    film: "Dilwale",
    year: "2015",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "Bright major. I–V–vi–IV in G. Same machine as Ilahi and Kesariya.",
    tell: "Home chord is major. Em is a visit, not the floor. If Em feels like home, you named the relative minor by mistake.",
  }),
  arrangement({
    id: "shayad",
    title: "Shayad",
    film: "Love Aaj Kal",
    year: "2020",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Modern minor ballad. Open-chord charts circle Am, F, C, G.",
    tell: "Minor 3rd on home. The loop is diatonic natural minor as chords.",
  }),
  arrangement({
    id: "khairiyat",
    title: "Khairiyat",
    film: "Chhichhore",
    year: "2019",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "Major, singable, four open chords. Capo to the voice.",
    tell: "I–V–vi–IV. The 7th of the melody usually pulls up to home, so this is major, not Mixolydian.",
  }),
  arrangement({
    id: "tujhe-kitna",
    title: "Tujhe Kitna Chahne Lage",
    film: "Kabir Singh",
    year: "2019",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "I–vi–IV–V in G. Same four chords as the other major loops, rotated.",
    tell: "Home is still G. Em is vi. If you start counting from Em you will call it a minor song and the D chord will confuse you.",
  }),
  arrangement({
    id: "dil-diyan",
    title: "Dil Diyan Gallan",
    film: "Tiger Zinda Hai",
    year: "2017",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "Another I–vi–IV–V guitar reduction. Useful because you already have the shapes from Tujhe Kitna.",
    tell: "Same test as Tujhe Kitna. Major home, relative minor as color.",
  }),
  arrangement({
    id: "raataan",
    title: "Raataan Lambiyan",
    film: "Shershaah",
    year: "2021",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "Recent, everywhere on guitar YouTube, still the same four chords.",
    tell: "If you can play Gerua, you can play this. Only the order of vi and V changed.",
  }),
  arrangement({
    id: "apna-bana",
    title: "Apna Bana Le",
    film: "Bhediya",
    year: "2022",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "Major loop. Lesson charts agree on G, Em, C, D as a first pass.",
    tell: "Major 3rd on home. Capo until G shapes match the singer.",
  }),
  arrangement({
    id: "chaleya",
    title: "Chaleya",
    film: "Jawan",
    year: "2023",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "A 2023 hook that still sits on the minor four-chord family.",
    tell: "Home feels minor. F C G are the usual visitors. Not Lydian: the 3rd is minor.",
  }),
  arrangement({
    id: "heeriye",
    title: "Heeriye",
    film: "Single",
    year: "2023",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "Current pop, old machine. I–vi–IV–V.",
    tell: "Same G-shape family. Use it to prove that year does not change roman numerals.",
  }),
  arrangement({
    id: "satranga",
    title: "Satranga",
    film: "Animal",
    year: "2023",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "Ballad in the I–vi–IV–V lane. Guitar-friendly in G.",
    tell: "End the line on G. Em should not feel like the last word.",
  }),
  arrangement({
    id: "kabira",
    title: "Kabira",
    film: "Yeh Jawaani Hai Deewani",
    year: "2013",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "Folk-tinted major. Same I–V–vi–IV as Ilahi, from the same film family.",
    tell: "Major home. The folk color is rhythm and vocal, not a new scale. Check the 4th: it is natural, not raised.",
  }),
  arrangement({
    id: "iktara",
    title: "Iktara",
    film: "Wake Up Sid",
    year: "2009",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Amit Trivedi. Guitarists cut it to Am F C G. Minor home, diatonic visitors.",
    tell: "Minor 3rd. If a phrase uses F#, mark it as a visitor, not as a new key.",
  }),
  arrangement({
    id: "sunshine",
    title: "Give Me Some Sunshine",
    film: "3 Idiots",
    year: "2009",
    family: "I–IV–V",
    guitarPc: 7,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 5, q: "maj" },
      { semi: 7, q: "maj" },
      { semi: 9, q: "min" },
    ],
    loopName: "G · C · D · Em",
    summary: "Campfire I–IV–V with the relative minor. The lesson is how little you need.",
    tell: "G, C, and D are I, IV, V. Em is vi. If you can hear those four, you can play a hundred college songs.",
  }),
  arrangement({
    id: "senorita-znmd",
    title: "Senorita",
    film: "Zindagi Na Milegi Dobara",
    year: "2011",
    family: "Minor loop",
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 10, q: "maj" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
    ],
    loopName: "Am · G · F · C",
    summary: "Am G F C. A descending bass under a minor home. Same notes as the other Am family, different order.",
    tell: "Walking down from Am toward F is the feel. Home is still A minor.",
  }),
  arrangement({
    id: "tu-jaane-na",
    title: "Tu Jaane Na",
    film: "Ajab Prem Ki Ghazab Kahani",
    year: "2009",
    family: "Minor loop",
    guitarPc: 4,
    chords: [
      { semi: 0, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "Em · C · G · D",
    summary: "i–VI–III–VII in E minor, which is just the Am family moved to open Em shapes.",
    tell: "If you know Am F C G, capo or move to Em C G D. Same numerals. Home is E.",
  }),
  arrangement({
    id: "galliyan",
    title: "Galliyan",
    film: "Ek Villain",
    year: "2014",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Another Am F C G reduction. Use it as reps, not as a new theory.",
    tell: "Minor home. Same test as Shayad and Agar Tum Saath Ho.",
  }),
  arrangement({
    id: "sunn-raha",
    title: "Sunn Raha Hai",
    film: "Aashiqui 2",
    year: "2013",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "Major chorus. Same film as Tum Hi Ho, opposite quality on home. That contrast is the lesson.",
    tell: "Tum Hi Ho's guitar home is minor. This one's is major. Romance is not a scale.",
  }),
  arrangement({
    id: "bekhayali",
    title: "Bekhayali",
    film: "Kabir Singh",
    year: "2019",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Minor loop. Pair it with Tujhe Kitna from the same film: one minor home, one major home.",
    tell: "Am can end the line. Tujhe Kitna cannot rest on Am in its usual G arrangement. Two songs, two homes, one movie.",
  }),
  arrangement({
    id: "phir-bhi",
    title: "Phir Bhi Tumko Chaahunga",
    film: "Half Girlfriend",
    year: "2017",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "I–vi–IV–V ballad. Capo until G shapes match.",
    tell: "Major 3rd on G. Em is vi.",
  }),
  arrangement({
    id: "ranjha",
    title: "Ranjha",
    film: "Shershaah",
    year: "2021",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Same film as Raataan Lambiyan. That one is major. This one is minor. Hear the 3rd.",
    tell: "Minor 3rd. Do not steal the G-major loop from Raataan and force it here.",
  }),
  arrangement({
    id: "ae-dil",
    title: "Ae Dil Hai Mushkil",
    film: "Ae Dil Hai Mushkil",
    year: "2016",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Title song, same family as Channa Mereya from the same film.",
    tell: "Two songs, one movie, one minor family. The difference is melody and groove, which this lab will not copy.",
  }),
  arrangement({
    id: "tera-yaar",
    title: "Tera Yaar Hoon Main",
    film: "Sonu Ke Titu Ki Sweety",
    year: "2018",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "I–V–vi–IV in G. Friendship-song energy, major-scale notes.",
    tell: "Major home. Same four chords as Ilahi.",
  }),
  arrangement({
    id: "humdard",
    title: "Humdard",
    film: "Ek Villain",
    year: "2014",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "Minor ballad. Pair with Galliyan: same film, same family, different song.",
    tell: "i–VI–III–VII. Bass on A, then F, then C, then G, is a fast way to hear it.",
  }),
  arrangement({
    id: "nadaan",
    title: "Nadaan Parinde",
    film: "Rockstar",
    year: "2011",
    family: "Major loop",
    guitarPc: 2,
    chords: I_V_vi_IV,
    loopName: "D · A · Bm · G",
    summary: "Same film as Kun Faya Kun. This one is a straight major loop in D. Kun Faya Kun's tell was a flat 7th over major chords.",
    tell: "If the 7th is C# (major), you are in D major. If a vocal leans on C natural against D, that bar went Mixolydian. Kun Faya Kun does that. This song mostly does not.",
  }),
  arrangement({
    id: "let-her-go",
    title: "Let Her Go",
    film: "Passenger",
    year: "2012",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_VI_III_VII,
    loopName: "Am · F · C · G",
    summary: "The English-pop twin of the Hindi Am F C G pile. Same numerals, different language.",
    tell: "Minor home. If you can play Agar Tum Saath Ho, you can play this. That is the point of families.",
  }),
  arrangement({
    id: "perfect",
    title: "Perfect",
    film: "Ed Sheeran",
    year: "2017",
    family: "Major loop",
    guitarPc: 7,
    chords: I_vi_IV_V,
    loopName: "G · Em · C · D",
    summary: "I–vi–IV–V in G. Wedding-set staple because the shapes are kind.",
    tell: "Major 3rd on G. Capo 1 or 2 is common for the record. Numerals stay.",
  }),
  arrangement({
    id: "photograph",
    title: "Photograph",
    film: "Ed Sheeran",
    year: "2015",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "I–V–vi–IV. Same as Kesariya with a different starting key if you capo.",
    tell: "Major home. Em is vi. Photograph and Kesariya are useful as a pair: two languages, one loop.",
  }),
  arrangement({
    id: "wonderwall",
    title: "Wonderwall",
    film: "Oasis",
    year: "1995",
    family: "Minor loop",
    guitarPc: 4,
    steps: NATURAL_MINOR,
    chords: [
      { semi: 0, q: "min" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
      { semi: 7, q: "maj" },
    ],
    loopName: "Em · G · D · A",
    summary: "Usually capo 2 with Em shapes. The lesson chart here is the shape key, not the sounding pitch.",
    tell: "Home feels like Em. G, D, and A are III, VII, and IV in E minor, or a Mixolydian-ish rock bed. First map: minor home.",
    caveat: "Oasis voicings are sus-heavy. The four letters are the map. The record adds extra fingers. Arrangement, not a transcription.",
  }),
  arrangement({
    id: "riptide",
    title: "Riptide",
    film: "Vance Joy",
    year: "2013",
    family: "Minor loop",
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 10, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 8, q: "maj" },
    ],
    loopName: "Am · G · C · F",
    summary: "Am G C F. Ukulele-famous, guitar-identical. Minor home, diatonic majors.",
    tell: "Same Am family, shuffled. Hear G as VII, not as a new key.",
  }),
  arrangement({
    id: "shape-of-you",
    title: "Shape of You",
    film: "Ed Sheeran",
    year: "2017",
    family: "Minor loop",
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 5, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "Am · Dm · F · G",
    summary: "i–iv–VI–VII. Common guitar teaching puts a capo at 4 and uses Am shapes. Sounding key is then C# minor.",
    tell: "Home is minor. iv (Dm) is the extra color versus the usual Am F C G. Capo 4 if you want the record pitch with these shapes.",
  }),
  arrangement({
    id: "someone-like-you",
    title: "Someone Like You",
    film: "Adele",
    year: "2011",
    family: "Major loop",
    guitarPc: 9,
    chords: I_V_vi_IV,
    loopName: "A · E · F#m · D",
    summary: "I–V–vi–IV in A. Piano song, guitar-legal. Same numerals as Ilahi.",
    tell: "Major home on A. F#m is vi. The piano figure is arpeggio, not a new harmony.",
  }),
  arrangement({
    id: "let-it-be",
    title: "Let It Be",
    film: "The Beatles",
    year: "1970",
    family: "Major loop",
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 7, q: "maj" },
      { semi: 9, q: "min" },
      { semi: 5, q: "maj" },
    ],
    loopName: "C · G · Am · F",
    summary: "I–V–vi–IV in C, the open-chord textbook.",
    tell: "C can end the hymn-like chorus. F is IV. This is the cleanest I–V–vi–IV you will play.",
  }),
  arrangement({
    id: "zombie",
    title: "Zombie",
    film: "The Cranberries",
    year: "1994",
    family: "Minor loop",
    guitarPc: 4,
    chords: [
      { semi: 0, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "Em · C · G · D",
    summary: "i–VI–III–VII in E minor. Same numerals as Tu Jaane Na.",
    tell: "Em is home. Power-chord versions omit the 3rd. The vocal still sings a minor 3rd.",
  }),
  arrangement({
    id: "creep",
    title: "Creep",
    film: "Radiohead",
    year: "1992",
    family: "Chromatic",
    guitarPc: 7,
    steps: MAJOR,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 4, q: "maj" },
      { semi: 5, q: "maj" },
      { semi: 5, q: "min" },
    ],
    loopName: "G · B · C · Cm",
    summary: "I–III–IV–iv. The B major is a secondary dominant color, and Cm is borrowed from G minor. This is how pop leaves the scale on purpose.",
    tell: "G and C are diatonic. B major contains D#, which is not in G major. Cm contains Eb, also not in G major. Those two visitors are the song.",
    caveat: "The last chord is C minor, same root as C major. Quality changed, root did not. Listen for the 3rd dropping one fret.",
  }),
  arrangement({
    id: "seven-nation",
    title: "Seven Nation Army",
    film: "The White Stripes",
    year: "2003",
    family: "Power riff",
    guitarPc: 4,
    steps: MINOR_PENT,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
      { semi: 8, q: "maj" },
    ],
    loopName: "E5 · G5 · D5 · C5",
    summary: "A riff of roots. Power chords, no 3rd. The famous line is 1, 1, b3, 1, b7, b6, 5 in E.",
    tell: "Play roots only first: E G E D C B. Then add the 5th on the next string, two frets up from the A-shape or two frets down on the E-shape... Root plus 7 frets, same fret on the next lower-pitched? On guitar a power chord is root and the 5th: same fret next string (E to A, A to D, D to G) except G to B.",
    caveat: "No 3rd means you cannot hear major vs minor from the guitar part. The riff lives in E minor pentatonic / blues. Arrangement of roots, not a tab of the octave pedal.",
  }),
  arrangement({
    id: "all-of-me",
    title: "All of Me",
    film: "John Legend",
    year: "2013",
    family: "Minor loop",
    guitarPc: 4,
    chords: [
      { semi: 0, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "Em · C · G · D",
    summary: "i–VI–III–VII piano song. Guitar in Em shapes.",
    tell: "Em can end a phrase. Same family as Zombie and Tu Jaane Na.",
  }),
  arrangement({
    id: "thinking-out-loud",
    title: "Thinking Out Loud",
    film: "Ed Sheeran",
    year: "2014",
    family: "I–IV–V",
    guitarPc: 2,
    chords: I_V_IV,
    loopName: "D · A · G",
    summary: "I–V–IV in D, with a walking bass in the record. Three chords do the job.",
    tell: "D is home. A is V. G is IV. If you hear a B note in the bass, that is still a D chord with a moving bass, not a new key.",
  }),
  arrangement({
    id: "stay-with-me",
    title: "Stay With Me",
    film: "Sam Smith",
    year: "2014",
    family: "Minor loop",
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
    ],
    loopName: "Am · F · C",
    summary: "Three chords. i–VI–III. The gospel plagal feel is F to C, which is IV to I in the relative major.",
    tell: "Am still feels like home. C feels like a lift, not like the final word, until the arrangement wants a picardy-ish rest.",
  }),
  arrangement({
    id: "counting-stars",
    title: "Counting Stars",
    film: "OneRepublic",
    year: "2013",
    family: "Minor loop",
    guitarPc: 9,
    chords: i_III_VII_VI,
    loopName: "Am · C · G · F",
    summary: "i–III–VII–VI, the Tum Hi Ho order, in English pop.",
    tell: "Same numerals as Tum Hi Ho. Play both. The theory is identical. The song is not.",
  }),
  arrangement({
    id: "yellow",
    title: "Yellow",
    film: "Coldplay",
    year: "2000",
    family: "Major loop",
    guitarPc: 7,
    chords: I_V_vi_IV,
    loopName: "G · D · Em · C",
    summary: "I–V–vi–IV. Capo 2 is common, sounding A. Shapes stay G.",
    tell: "Major home. If you capo 2, say 'G shapes, sounding A' — that sentence is capo literacy.",
  }),
  arrangement({
    id: "scientist",
    title: "The Scientist",
    film: "Coldplay",
    year: "2002",
    family: "Minor loop",
    guitarPc: 2,
    chords: [
      { semi: 0, q: "min" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
      { semi: 10, q: "maj" },
    ],
    loopName: "Dm · Bb · F · C",
    summary: "i–VI–III–VII in D minor. Same family as Am F C G, moved.",
    tell: "If Am F C G is comfortable, this is that loop with home on D. Fret the barre, or capo and use Am shapes.",
  }),
  arrangement({
    id: "ho-hey",
    title: "Ho Hey",
    film: "The Lumineers",
    year: "2012",
    family: "Major loop",
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 5, q: "maj" },
      { semi: 9, q: "min" },
      { semi: 7, q: "maj" },
    ],
    loopName: "C · F · Am · G",
    summary: "I–IV–vi–V in C. Stomp and clap are rhythm, not harmony.",
    tell: "C is home. Count 4. The extra 'hey' is still inside the bar.",
  }),
  arrangement({
    id: "im-yours",
    title: "I'm Yours",
    film: "Jason Mraz",
    year: "2008",
    family: "Major loop",
    guitarPc: 0,
    chords: [
      { semi: 0, q: "maj" },
      { semi: 7, q: "maj" },
      { semi: 9, q: "min" },
      { semi: 5, q: "maj" },
    ],
    loopName: "C · G · Am · F",
    summary: "I–V–vi–IV, often with a capo. The island strum is 1 2& 3& 4&.",
    tell: "Same loop as Let It Be. If you know one, you know the other. Strum pattern is the remaining work.",
  }),
  arrangement({
    id: "drivers-license",
    title: "drivers license",
    film: "Olivia Rodrigo",
    year: "2021",
    family: "Major loop",
    guitarPc: 0,
    chords: I_V_vi_IV,
    loopName: "C · G · Am · F",
    summary: "Modern piano-pop, still I–V–vi–IV. Proof that the loop did not retire.",
    tell: "Major home. The drama is lyric and production. The numerals are old.",
  }),
  arrangement({
    id: "as-it-was",
    title: "As It Was",
    film: "Harry Styles",
    year: "2022",
    family: "Minor loop",
    guitarPc: 9,
    chords: [
      { semi: 0, q: "min" },
      { semi: 10, q: "maj" },
      { semi: 8, q: "maj" },
      { semi: 3, q: "maj" },
    ],
    loopName: "Am · G · F · C",
    summary: "A 2022 hit that still walks a minor-family bass. Guitarists cut it to Am shapes.",
    tell: "Minor home. G as VII is the rock-leaning step. Same letters as Senorita in a different groove.",
  }),
];

export const SONGS: Song[] = [...CORE_SONGS, ...MORE_SONGS];

export const KEY_STEPS: string[] = [
  "Find the note or chord the line can end on. That rest is home — like the last word of a sentence. Its chord is I, or i if it is minor (sad).",
  "Hum that note and match it on the low E or the A string. That letter is the key for this song. Example: if it matches open A, home is A.",
  "Pick three more melody notes. Count frets up from home on one string, like counting stairs.",
  "If you only used frets 0, 2, 4, 7, 9: that is major pentatonic. Five notes. Folk-safe.",
  "If a major-sounding song leans on fret 6 instead of fret 5: Lydian. That raised 4th is the tell. In C it is F# instead of F.",
  "If the 3rd is bright (4 frets) but the 7th is one fret low (fret 10 not 11): Mixolydian. In D that tell is C instead of C#.",
  "If the 3rd is 3 frets (sad): some kind of minor. Then test fret 8 vs fret 9. Fret 8 = natural minor. Fret 9 = Dorian. In A that is F vs F#.",
  "If the 2nd is only 1 fret above home, under a minor 3rd: Phrygian. In A that is Bb instead of B.",
  "Capo, or slide the whole shape, until the chords land on shapes you can sing. Home moved. The distances did not. Example: capo 2 on G shapes sounds as A.",
];

export const CHORD_STEPS: string[] = [
  "Find the lowest note you hear. In most guitar songs that bass note is the name of the chord. Example: if the bass is G, start by calling it a G chord.",
  "Ask if the chord sounds bright or sad. Bright = major 3rd (4 frets up from the bass). Sad = minor 3rd (3 frets up). Example: G to B is major. G to Bb is minor.",
  "Write the name: letter plus major or minor. Example: G, or Em. That is already enough to play along.",
  "Do the same for the next bass. Now you have a loop in letters. Example: G, D, Em, C.",
  "Find which chord can end the chorus. Call that one I (or i if it is minor). Number the others from there. Example: G D Em C in G is I V vi IV.",
  "If every chord sits in one scale, you have the family. If one chord does not, it is a visitor with a job — often pointing at the next chord. Example: a B major in G is pointing at C or Em.",
  "Capo until the shapes feel easy. The numbers travel. Example: capo 2 on G shapes sounds as A. Same song, easier hands.",
];

export const CIRCLE: { name: string; pc: number }[] = [
  { name: "C", pc: 0 },
  { name: "G", pc: 7 },
  { name: "D", pc: 2 },
  { name: "A", pc: 9 },
  { name: "E", pc: 4 },
  { name: "B", pc: 11 },
  { name: "F#", pc: 6 },
  { name: "Db", pc: 1 },
  { name: "Ab", pc: 8 },
  { name: "Eb", pc: 3 },
  { name: "Bb", pc: 10 },
  { name: "F", pc: 5 },
];

export type Grip = {
  name: string;
  q: Quality;
  rootPc: number;
  // frets low E → high e. null = muted.
  frets: (number | null)[];
};

export const OPEN_GRIPS: Grip[] = [
  { name: "G", q: "maj", rootPc: 7, frets: [3, 2, 0, 0, 0, 3] },
  { name: "C", q: "maj", rootPc: 0, frets: [null, 3, 2, 0, 1, 0] },
  { name: "D", q: "maj", rootPc: 2, frets: [null, null, 0, 2, 3, 2] },
  { name: "A", q: "maj", rootPc: 9, frets: [null, 0, 2, 2, 2, 0] },
  { name: "E", q: "maj", rootPc: 4, frets: [0, 2, 2, 1, 0, 0] },
  { name: "Em", q: "min", rootPc: 4, frets: [0, 2, 2, 0, 0, 0] },
  { name: "Am", q: "min", rootPc: 9, frets: [null, 0, 2, 2, 1, 0] },
  { name: "Dm", q: "min", rootPc: 2, frets: [null, null, 0, 2, 3, 1] },
  { name: "E7", q: "7", rootPc: 4, frets: [0, 2, 0, 1, 0, 0] },
  { name: "A7", q: "7", rootPc: 9, frets: [null, 0, 2, 0, 2, 0] },
  { name: "D7", q: "7", rootPc: 2, frets: [null, null, 0, 2, 1, 2] },
  { name: "G7", q: "7", rootPc: 7, frets: [3, 2, 0, 0, 0, 1] },
  { name: "Cadd9", q: "maj", rootPc: 0, frets: [null, 3, 2, 0, 3, 0] },
  { name: "Dsus4", q: "maj", rootPc: 2, frets: [null, null, 0, 2, 3, 3] },
];

export const QUALITY_TONES: { id: Quality | "maj7" | "min7" | "sus2" | "sus4"; name: string; intervals: number[] }[] = [
  { id: "maj", name: "major", intervals: [0, 4, 7] },
  { id: "min", name: "minor", intervals: [0, 3, 7] },
  { id: "7", name: "dominant 7", intervals: [0, 4, 7, 10] },
  { id: "dim", name: "diminished", intervals: [0, 3, 6] },
  { id: "maj7", name: "major 7", intervals: [0, 4, 7, 11] },
  { id: "min7", name: "minor 7", intervals: [0, 3, 7, 10] },
  { id: "sus2", name: "sus2", intervals: [0, 2, 7] },
  { id: "sus4", name: "sus4", intervals: [0, 5, 7] },
];

export function qualityIntervals(q: Quality): number[] {
  if (q === "min") return [0, 3, 7];
  if (q === "7") return [0, 4, 7, 10];
  if (q === "dim") return [0, 3, 6];
  return [0, 4, 7];
}

export function chordsFromNotes(pcs: number[]): { rootPc: number; quality: string; label: string; extra: number }[] {
  const uniq = [...new Set(pcs.map(mod12))];
  if (uniq.length === 0) return [];
  const hits: { rootPc: number; quality: string; label: string; extra: number }[] = [];
  for (let root = 0; root < 12; root += 1) {
    for (const q of QUALITY_TONES) {
      const tones = q.intervals.map((semi) => mod12(root + semi));
      if (uniq.every((pc) => tones.includes(pc))) {
        hits.push({
          rootPc: root,
          quality: q.name,
          label: `${noteName(root, usesFlats(root))}${q.id === "maj" ? "" : q.id === "min" ? "m" : q.id === "7" ? "7" : q.id === "dim" ? "dim" : q.id === "maj7" ? "maj7" : q.id === "min7" ? "m7" : q.id}`,
          extra: tones.length - uniq.length,
        });
      }
    }
  }
  return hits.sort((a, b) => a.extra - b.extra || a.label.localeCompare(b.label)).slice(0, 8);
}

export function usesFlats(tonicPc: number): boolean {
  return [1, 3, 5, 8, 10].includes(mod12(tonicPc));
}

export function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function noteName(pc: number, flat = false): string {
  return (flat ? FLAT : SHARP)[mod12(pc)];
}

export function swaraOf(interval: number): Swara {
  return SWARAS[mod12(interval)];
}

export function midiHz(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function nearestMidi(pc: number, around = 60): number {
  const want = mod12(pc);
  const base = around - mod12(mod12(around) - want);
  if (around - base > 6) return base + 12;
  return base;
}

export function octaveOf(midi: number): number {
  return Math.floor(midi / 12) - 1;
}

export function saptak(midi: number, saPc: number): "mandra" | "madhya" | "taar" {
  const sa = nearestMidi(saPc, 60);
  if (midi < sa) return "mandra";
  if (midi >= sa + 12) return "taar";
  return "madhya";
}

export function analyzeFreq(freq: number): {
  midi: number;
  cents: number;
  pc: number;
  name: string;
} | null {
  if (!Number.isFinite(freq) || freq < 55 || freq > 1400) return null;
  const midiFloat = 69 + 12 * Math.log2(freq / 440);
  const midi = Math.round(midiFloat);
  return {
    midi,
    cents: (midiFloat - midi) * 100,
    pc: mod12(midi),
    name: noteName(mod12(midi)),
  };
}

export function scaleNoteNames(tonicPc: number, steps: number[]): string[] {
  const flat = usesFlats(tonicPc);
  return steps.map((step) => noteName(tonicPc + step, flat));
}

/** Gaps in frets between the stairs you kept, then back to home. Major is 2 2 1 2 2 2 1. */
export function jumpsOf(steps: number[]): number[] {
  const uniq = [...new Set(steps.map(mod12))].sort((a, b) => a - b);
  if (!uniq.includes(0)) uniq.unshift(0);
  const chain = [...uniq, 12];
  const out: number[] = [];
  for (let i = 1; i < chain.length; i += 1) out.push(chain[i] - chain[i - 1]);
  return out;
}

export function sameSteps(a: number[], b: number[]): boolean {
  const key = (steps: number[]) => [...new Set(steps.map(mod12))].sort((x, y) => x - y).join(",");
  return key(a) === key(b);
}

export function chordName(tonicPc: number, semi: number, q: Exclude<Quality, "dim">): string {
  const name = noteName(tonicPc + semi, usesFlats(tonicPc));
  if (q === "min") return `${name}m`;
  if (q === "7") return `${name}7`;
  return name;
}

export function triadSymbol(pc: number, q: Quality, flat: boolean): string {
  const name = noteName(pc, flat);
  if (q === "min") return `${name}m`;
  if (q === "dim") return `${name}dim`;
  if (q === "7") return `${name}7`;
  return name;
}

export function diatonicTriad(degree: number): {
  rootSemi: number;
  intervals: number[];
  q: Quality;
  roman: string;
} {
  const root = MAJOR[degree];
  const third = MAJOR[(degree + 2) % 7];
  const fifth = MAJOR[(degree + 4) % 7];
  const d3 = mod12(third - root);
  const d5 = mod12(fifth - root);
  const q: Quality = d3 === 3 && d5 === 6 ? "dim" : d3 === 3 ? "min" : "maj";
  const romans = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  return { rootSemi: root, intervals: [0, d3, d5], q, roman: romans[degree] };
}

export type FretPos = { stringId: string; fret: number; midi: number };

export function positionsOf(pc: number, maxFret = 12): FretPos[] {
  const out: FretPos[] = [];
  for (const string of STRINGS) {
    const open = mod12(string.midi);
    for (let fret = 0; fret <= maxFret; fret += 1) {
      if (mod12(open + fret) === mod12(pc)) {
        out.push({ stringId: string.id, fret, midi: string.midi + fret });
      }
    }
  }
  return out;
}

export function songById(id: string): Song | undefined {
  return SONGS.find((song) => song.id === id);
}

export function ragaById(id: string): Raga | undefined {
  return RAGAS.find((raga) => raga.id === id);
}

export const GUITAR_KEYS: { name: string; pc: number }[] = [
  { name: "E", pc: 4 },
  { name: "A", pc: 9 },
  { name: "D", pc: 2 },
  { name: "G", pc: 7 },
  { name: "C", pc: 0 },
  { name: "F", pc: 5 },
];

export const OPEN_HOME: { stringName: string; pc: number; fifth: string; why: string }[] = [
  { stringName: "low E", pc: 4, fifth: "B", why: "A fifth above E is B. Open B is the same letter, two octaves up." },
  { stringName: "A", pc: 9, fifth: "E", why: "A fifth above A is E: open low E a fourth below, 7th fret of the A string, and open high e." },
  { stringName: "D", pc: 2, fifth: "A", why: "A fifth above D is A. The open A string is that fifth sitting a fourth under home." },
  { stringName: "G", pc: 7, fifth: "D", why: "A fifth above G is D. The open D string is the lower copy." },
];

export const NATURALS = [0, 2, 4, 5, 7, 9, 11];
export const DEGREE = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"] as const;
export const INTERVAL_NAMES = [
  "unison",
  "minor 2nd",
  "major 2nd",
  "minor 3rd",
  "major 3rd",
  "perfect 4th",
  "tritone",
  "perfect 5th",
  "minor 6th",
  "major 6th",
  "minor 7th",
  "major 7th",
  "octave",
] as const;

export function degreeOf(semi: number): string {
  return DEGREE[mod12(semi)];
}

export function intervalName(semi: number): string {
  return INTERVAL_NAMES[semi] ?? `${semi} frets`;
}

export function phraseLetters(tonicPc: number, offsets: number[]): string {
  const flat = usesFlats(tonicPc);
  return offsets.map((offset) => noteName(tonicPc + offset, flat)).join("  ");
}
