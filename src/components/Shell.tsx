import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const LINKS = [
  { to: "/path", label: "Path" },
  { to: "/train", label: "Train" },
  { to: "/gym", label: "Gym" },
  { to: "/ear", label: "Ear" },
  { to: "/coach", label: "Mic" },
  { to: "/chords", label: "Chords" },
  { to: "/songs", label: "Songs" },
  { to: "/ragas", label: "Scales" },
  { to: "/watch", label: "Videos" },
  { to: "/practice", label: "Practice" },
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="top">
        <NavLink to="/" className="logo" end>
          Sargam
        </NavLink>
        <nav className="nav">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page">{children}</main>
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
