"use client";

import { useState } from "react";
import "./highlights.css";
import type { Dictionary, Locale } from "@/lib/dictionary";
import { highlights, type HighlightKind } from "@/lib/highlights";

type Filter = "all" | HighlightKind;

type HighlightsProps = {
  text: Dictionary;
  locale: Locale;
};

export function Highlights({ text, locale }: HighlightsProps) {
  const copy = text.highlights;
  const [filter, setFilter] = useState<Filter>("all");
  const kinds = Array.from(new Set(highlights.map((item) => item.kind)));
  const visible = highlights
    .filter((item) => filter === "all" || item.kind === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section id="destaques" className="section highlights">
      <header className="section-header reveal">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <span className="saber-rule" aria-hidden="true" />
      </header>

      <div className="highlight-filters" role="group" aria-label={copy.filterLabel}>
        {(["all", ...kinds] as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            className="highlight-filter"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? copy.all : copy.kinds[key]}
          </button>
        ))}
      </div>

      <ul className="highlight-grid">
        {visible.map((item) => (
          <li key={item.id} className="highlight-card reveal">
            <div className={`highlight-cover${item.image ? "" : " highlight-cover--plain"}`}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.imageAlt?.[locale] ?? ""}
                  width={1136}
                  height={1408}
                  loading="lazy"
                />
              ) : (
                <span aria-hidden="true">{copy.kinds[item.kind]}</span>
              )}
            </div>
            <div className="highlight-body">
              <p className="highlight-meta">
                <span className="highlight-kind">{copy.kinds[item.kind]}</span>
                <span>{item.dateLabel[locale]}</span>
              </p>
              <h3>{item.title[locale]}</h3>
              <p>{item.text[locale]}</p>
              {item.url ? (
                <a className="highlight-link" href={item.url} target="_blank" rel="noreferrer">
                  {copy.viewOn} {item.source}
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
