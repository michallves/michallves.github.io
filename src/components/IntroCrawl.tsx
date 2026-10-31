"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionary";

type IntroCrawlProps = {
  text: Dictionary["intro"];
  onDone: () => void;
};

export function IntroCrawl({ text, onDone }: IntroCrawlProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const leave = useRef<() => void>(() => {});

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    let leaving = false;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: () => leave.current() });
      timeline
        .fromTo(".crawl-lead", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "power1.out" })
        .to(".crawl-lead", { autoAlpha: 0, duration: 0.6 }, "+=1.5")
        .fromTo(
          ".crawl-text",
          { y: () => rootRef.current?.offsetHeight ?? 0 },
          { y: () => -(rootRef.current?.querySelector(".crawl-text") as HTMLElement).offsetHeight, duration: 22, ease: "none" },
          "-=0.1",
        );
    }, rootRef);

    leave.current = () => {
      if (leaving) return;
      leaving = true;
      gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.7, ease: "power1.inOut", onComplete: onDone });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave.current();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      context.revert();
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="crawl">
      <p className="crawl-lead">{text.lead}</p>
      <div className="crawl-stage">
        <div className="crawl-plane">
          <div className="crawl-text">
            <h2>{text.title}</h2>
            {text.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <button ref={skipRef} type="button" className="crawl-skip" onClick={() => leave.current()}>
        {text.skip}
      </button>
    </div>
  );
}
