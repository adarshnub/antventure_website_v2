import type { ReactNode } from "react";

export function PageHero({ index, eyebrow, title, intro, aside }: { index: string; eyebrow: string; title: ReactNode; intro: string; aside?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="shell page-hero-grid">
        <div>
          <p className="eyebrow">{index} · {eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="page-hero-intro">
          <p>{intro}</p>
          {aside}
        </div>
      </div>
    </section>
  );
}
