"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState } from "react";
import { HelmetCanvas, type HeroScene } from "@/components/HelmetCanvas";
import { IntroCrawl } from "@/components/IntroCrawl";
import { Sections } from "@/components/Sections";
import { dictionary, type Locale } from "@/lib/dictionary";
import { createSound, type Sound } from "@/lib/sound";

const STORAGE_KEY = "portfolio-locale";
const INTRO_KEY = "portfolio-intro-seen";

function shouldUsePoster() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData,
  );
}

export function Portfolio() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [mode, setMode] = useState<"pending" | "live" | "poster">("pending");
  const [introPlaying, setIntroPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const soundRef = useRef<Sound | null>(null);
  const scene = useRef<HeroScene>({ ignite: 0, scroll: 0, lookX: 0, lookY: 0, paused: false });
  const text = dictionary[locale];

  const usePoster = useCallback(() => {
    setIntroPlaying(false);
    setMode("poster");
  }, []);

  const finishIntro = useCallback(() => {
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
    setIntroPlaying(false);
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    let introSeen = false;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
      introSeen = localStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    const preferred = saved ?? (navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en");
    const poster = shouldUsePoster();
    setLocale(preferred === "en" ? "en" : "pt");
    setIntroPlaying(!poster && !introSeen && window.scrollY === 0 && !window.location.hash);
    setMode(poster ? "poster" : "live");
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    document.title =
      locale === "pt" ? "Michael Alves | Tech Lead e Full Stack" : "Michael Alves | Tech Lead and Full Stack";
    ScrollTrigger.refresh();
  }, [locale]);

  const toggleLocale = () => {
    const next: Locale = locale === "pt" ? "en" : "pt";
    setLocale(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundOn;
    if (next) {
      soundRef.current ??= createSound();
      soundRef.current.on();
    } else {
      soundRef.current?.off();
    }
    setSoundOn(next);
  };

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) soundRef.current?.pause();
      else soundRef.current?.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      soundRef.current?.close();
      soundRef.current = null;
    };
  }, []);

  const replayIntro = () => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    setIntroPlaying(true);
  };

  useEffect(() => {
    if (mode !== "live" || !heroRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenisRef.current = lenis;
    const onTick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            scene.current.scroll = self.progress;
          },
        },
      });
      timeline
        .to(".hero-intro", { autoAlpha: 0, y: -28, duration: 0.2 }, 0.14)
        .to(".hero-scroll", { autoAlpha: 0, duration: 0.08 }, 0.02)
        .fromTo(".hero-facts", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.28)
        .to(".hero-facts", { autoAlpha: 0, y: -24, duration: 0.12 }, 0.74)
        .set({}, {}, 1);

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 22,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".saber-rule").forEach((element) => {
        gsap.from(element, {
          scaleX: 0,
          duration: 0.9,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      });
      gsap.from(".chart-bar", {
        scaleX: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".chart", start: "top 85%", once: true },
      });
      // A lâmina da linha do tempo acende conforme a rolagem
      gsap.from(".timeline-blade", {
        scaleY: 0,
        ease: "none",
        scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 60%", scrub: true },
      });
    }, rootRef);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      gsap.to(scene.current, {
        lookX: (event.clientX / window.innerWidth - 0.5) * 2,
        lookY: (event.clientY / window.innerHeight - 0.5) * 2,
        duration: 1.1,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(onTick);
      context.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [mode]);

  // O sabre acende sozinho quando a abertura termina, para quem não rolar a página também ver o efeito
  useEffect(() => {
    if (mode !== "live") return;
    const root = document.documentElement;
    scene.current.paused = introPlaying;
    if (introPlaying) {
      scene.current.ignite = 0;
      root.classList.add("intro-lock");
      lenisRef.current?.stop();
      return () => {
        root.classList.remove("intro-lock");
        lenisRef.current?.start();
      };
    }

    const context = gsap.context(() => {
      gsap.to(scene.current, { ignite: 1, duration: 1.25, delay: 0.35, ease: "power3.out" });
      gsap.from(".hero-reveal", {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        delay: 0.65,
        stagger: 0.11,
        ease: "power2.out",
      });
    }, heroRef);
    return () => context.revert();
  }, [mode, introPlaying]);

  return (
    <>
      <a className="skip-link" href="#dossie">
        {text.skip}
      </a>

      <header className="topbar">
        <span className="concept">{text.concept}</span>
        <nav className="topbar-nav" aria-label={text.concept}>
          {text.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="sound"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? text.soundOff : text.soundOn}
        >
          {text.sound}
        </button>
        <button type="button" className="locale" onClick={toggleLocale} aria-label={text.switchTo}>
          <span aria-current={locale === "pt" ? "true" : undefined}>PT</span>
          <span aria-hidden="true">/</span>
          <span aria-current={locale === "en" ? "true" : undefined}>EN</span>
        </button>
      </header>

      {introPlaying && <IntroCrawl text={text.intro} onDone={finishIntro} />}

      <main ref={rootRef}>
        <noscript>
          <style>{".hero--pending .hero-copy,.hero--pending .hero-scroll{opacity:1}"}</style>
        </noscript>

        <section ref={heroRef} className={`hero hero--${mode}`} aria-labelledby="hero-title">
          <div className="hero-stage">
            <div className="hero-poster" aria-hidden="true" />
            {mode === "live" && <HelmetCanvas scene={scene} onUnavailable={usePoster} />}
            <div className="hero-shade" aria-hidden="true" />

            <div className="hero-copy">
              <div className="hero-intro">
                <p className="hero-role hero-reveal">{text.role}</p>
                <h1 id="hero-title" className="hero-name hero-reveal">
                  Michael
                  <br />
                  Alves
                </h1>
                <p className="hero-tagline hero-reveal">{text.tagline}</p>
                <div className="hero-actions hero-reveal">
                  <a className="hero-cta" href="#campanhas">
                    {text.cta}
                  </a>
                  <a className="hero-cta hero-cta--ghost" href={text.contact.cvFile} download>
                    {text.ctaCv}
                  </a>
                </div>
              </div>

              <ul className="hero-facts">
                {text.facts.map((fact) => (
                  <li key={fact.value}>
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hero-scroll hero-reveal" aria-hidden="true">
              {text.scroll}
              <span className="hero-scroll-line" />
            </p>
          </div>
        </section>

        <Sections text={text} locale={locale} canReplay={mode === "live"} onReplay={replayIntro} />
      </main>
    </>
  );
}
