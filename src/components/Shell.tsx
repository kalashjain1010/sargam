import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";

type LinkItem = { to: string; label: string; blurb: string };

const GROUPS: { id: string; title: string; hint: string; links: LinkItem[] }[] = [
  {
    id: "learn",
    title: "Learn",
    hint: "The course",
    links: [
      { to: "/path", label: "Path", blurb: "30 days, one idea at a time" },
      { to: "/watch", label: "Videos", blurb: "Watch, then tap the neck" },
    ],
  },
  {
    id: "hear",
    title: "Hear",
    hint: "Your guitar",
    links: [
      { to: "/tune", label: "Tune", blurb: "Standard and other tunings" },
      { to: "/train", label: "Train", blurb: "Ask the AI coach" },
      { to: "/gym", label: "Gym", blurb: "Find letters on the neck" },
      { to: "/ear", label: "Ear", blurb: "Name the gap you hear" },
      { to: "/coach", label: "Mic", blurb: "Play one string, get a check" },
      { to: "/practice", label: "Practice", blurb: "Copy the box, then drill it" },
      { to: "/tests", label: "Tests", blurb: "Find the scale in a real song" },
    ],
  },
  {
    id: "play",
    title: "Play",
    hint: "Songs and shapes",
    links: [
      { to: "/chords", label: "Chords", blurb: "Bass first, then bright or sad" },
      { to: "/songs", label: "Songs", blurb: "Real titles, movable loops" },
      { to: "/ragas", label: "Scales", blurb: "Boxes, drills, make your own" },
    ],
  },
];

const FLAT = GROUPS.flatMap((group) => group.links);
const BAR = ["/path", "/train", "/tune", "/gym", "/ear", "/tests", "/coach", "/chords", "/songs", "/ragas", "/watch", "/practice"];
const BAR_LINKS = BAR.map((to) => FLAT.find((link) => link.to === to)).filter((link): link is LinkItem => Boolean(link));
const DOCK = [
  { to: "/path", label: "Path" },
  { to: "/tune", label: "Tune" },
  { to: "/train", label: "Train" },
  { to: "/chords", label: "Chords" },
];

export function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menu);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [menu]);

  return (
    <>
      <header className="top">
        <NavLink to="/" className="logo" end>
          Sargam
        </NavLink>
        <nav className="nav top-nav" aria-label="Main">
          {BAR_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="top-actions">
          <NavLink to="/tune" className="tune-jump">
            Tune
          </NavLink>
          <button
            type="button"
            className={`menu-btn ${menu ? "open" : ""}`}
            aria-expanded={menu}
            aria-controls="site-menu"
            onClick={() => setMenu((on) => !on)}
          >
            <span />
            <span />
            <span />
            <em className="sr-only">{menu ? "Close menu" : "Open menu"}</em>
          </button>
        </div>
      </header>
      <div className={`drawer ${menu ? "open" : ""}`} id="site-menu" aria-hidden={!menu} inert={!menu || undefined}>
        <button type="button" className="drawer-scrim" aria-label="Close menu" onClick={() => setMenu(false)} />
        <div className="drawer-panel">
          <div className="drawer-head">
            <div>
              <p className="eyebrow">Jump anywhere</p>
              <h2>Pick a board</h2>
            </div>
            <button type="button" className="chip" onClick={() => setMenu(false)}>
              Close
            </button>
          </div>
          <div className="menu-board">
            {GROUPS.map((group) => (
              <section key={group.id} className="menu-col">
                <p className="eyebrow">{group.hint}</p>
                <h3>{group.title}</h3>
                {group.links.map((link) => (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
                    <strong>{link.label}</strong>
                    <span>{link.blurb}</span>
                  </NavLink>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
      <main className="page">{children}</main>
      <nav className="dock" aria-label="Quick">
        {DOCK.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
            {link.label}
          </NavLink>
        ))}
        <button type="button" className={menu ? "on" : ""} aria-expanded={menu} onClick={() => setMenu((on) => !on)}>
          Menu
        </button>
      </nav>
      <footer className="foot">
        Twelve letters. Twelve frets until the letter comes back. A scale is a walking recipe. A chord is three letters stacked. A song is a loop that can rest on one home. Count frets. Do not guess.
      </footer>
    </>
  );
}

export function Words({ items }: { items: { term: string; def: string }[] }) {
  return (
    <dl className="words">
      {items.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.def}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Explain({ idea, example }: { idea: string; example: string }) {
  return (
    <div className="explain">
      <p>{idea}</p>
      <p className="example">
        <strong>Example. </strong>
        {example}
      </p>
    </div>
  );
}
