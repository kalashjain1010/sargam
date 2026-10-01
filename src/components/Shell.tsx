import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const LINKS = [
  { to: "/path", label: "Path" },
  { to: "/gym", label: "Gym" },
  { to: "/songs", label: "Songs" },
  { to: "/ragas", label: "Scales" },
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
        Twelve letters. Twelve frets to the octave. A scale is a set of distances. A raga is a recipe for walking them. The neck only knows the distances.
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
