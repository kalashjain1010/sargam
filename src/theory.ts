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
};

export const DAYS: DayMeta[] = [
  {
    id: 1,
    title: "Half the string",
    kicker: "Pitch",
    minutes: 12,
    promise: "Fret 12 is the exact middle of the string. Same letter, double the frequency.",
  },
  {
    id: 2,
    title: "Home is a choice",
    kicker: "Keys",
    minutes: 14,
    promise: "C D E F G A B are fixed letters. The home of a song can be any of them. A capo just moves home.",
  },
  {
    id: 3,
    title: "Songs are distances",
    kicker: "Intervals",
    minutes: 15,
    promise: "A fifth is 7 frets. A major 3rd is 4. A minor 3rd is 3. Count, do not guess.",
  },
  {
    id: 4,
    title: "The major scale",
    kicker: "Major",
    minutes: 14,
    promise: "2 2 1 2 2 2 1 from any letter. Open G, C, D, A, and E all use this walk.",
  },
  {
    id: 5,
    title: "Three different minors",
    kicker: "Minor",
    minutes: 16,
    promise: "Dorian, natural minor, and Phrygian flatten different notes. One minor box cannot cover all three.",
  },
  {
    id: 6,
    title: "A chord is a stack",
    kicker: "Harmony",
    minutes: 15,
    promise: "The shapes you already grab are every other note of a scale, sounded together.",
  },
  {
    id: 7,
    title: "The loop under the song",
    kicker: "Progressions",
    minutes: 14,
    promise: "G–D–Em–C and Am–F–C–G are the same family with home in a different place.",
  },
  {
    id: 8,
    title: "Find the key yourself",
    kicker: "Method",
    minutes: 16,
    promise: "You do not need a chart. You need the note a line can end on, then three more melody notes.",
  },
  {
    id: 9,
    title: "The box, and the pentatonic",
    kicker: "Pentatonic",
    minutes: 14,
    promise: "A minor pentatonic and C major pentatonic are the same frets. Home moved three steps.",
  },
  {
    id: 10,
    title: "A raga is a recipe",
    kicker: "Raga",
    minutes: 18,
    promise: "A scale is the notes. A raga is how you walk them. Letters first, Indian names as a check.",
  },
  {
    id: 11,
    title: "Three songs, slowly",
    kicker: "Film music",
    minutes: 16,
    promise: "Raised 4th, flat 7th, and a minor guitar loop. One tell each, then you can test a record without a tab.",
  },
  {
    id: 12,
    title: "Play it back",
    kicker: "Exam",
    minutes: 15,
    promise: "Name the distance, name the letter, and hold the note. A new song starts with a question.",
  },
];

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

export const SONGS: Song[] = [
  {
    id: "abhi-na-jao",
    title: "Abhi Na Jao Chhod Kar",
    film: "Hum Dono",
    year: "1961",
    family: "Yaman",
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
    family: "Yaman",
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
    family: "Bhupali",
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
    family: "Bhupali",
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
    family: "Khamaj",
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
    family: "Khamaj",
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
    family: "Bhairavi",
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
    family: "Khamaj",
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

export const KEY_STEPS: string[] = [
  "Find the note or chord the line can end on. That rest is home. Its chord is I, or i if it is minor.",
  "Hum it and match it on the low E or the A string. That letter is the key for this song.",
  "Pick three more melody notes. Count frets up from home on one string.",
  "Frets 0, 2, 4, 7, 9 only: major pentatonic. Indian name: Bhupali.",
  "Fret 6 instead of fret 5, in an otherwise major scale: Lydian / Yaman. The tell is the raised 4th.",
  "Fret 10 instead of fret 11, with a major 3rd: Mixolydian / Khamaj. The tell is the flat 7th.",
  "Fret 3 as the 3rd: some kind of minor. Then test fret 8 against fret 9. Fret 8 is natural minor. Fret 9 is Dorian / Kafi.",
  "Fret 1 as the 2nd, under a minor 3rd: Phrygian / Bhairavi.",
  "Capo, or slide the whole shape, until the chords land on shapes you can sing. Home moved. The distances did not.",
];

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
  if (!Number.isFinite(freq) || freq < 70 || freq > 1400) return null;
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
