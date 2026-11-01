"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { SocialLinks } from "@/components/SocialLinks";
import { Sections } from "@/components/Sections";
import { dictionary, type Locale } from "@/lib/dictionary";
import { createSound, type Sound } from "@/lib/sound";

const STORAGE_KEY = "portfolio-locale";

function shouldReduceMotion() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData,
  );
}

export function Portfolio() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [mode, setMode] = useState<"pending" | "live" | "static">("pending");
  const [soundOn, setSoundOn] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const soundRef = useRef<Sound | null>(null);
  const text = dictionary[locale];

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    const preferred = saved ?? (navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en");
    const reduced = shouldReduceMotion();
    setLocale(preferred === "en" ? "en" : "pt");
    setMode(reduced ? "static" : "live");
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

  // A lâmina cresce de 22% a 100% conforme o progresso da rolagem
  useEffect(() => {
    if (mode === "pending") return;
    const root = document.documentElement;
    if (mode === "static") {
      root.style.setProperty("--saber-p", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
      root.style.setProperty("--saber-p", (0.22 + 0.78 * progress).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode]);

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

    return () => {
      gsap.ticker.remove(onTick);
      context.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [mode]);

  // Revela o texto do início ao carregar
  useEffect(() => {
    if (mode !== "live") return;
    const context = gsap.context(() => {
      gsap.from(".hero-reveal", {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        delay: 0.2,
        stagger: 0.11,
        ease: "power2.out",
      });
    }, heroRef);
    return () => context.revert();
  }, [mode]);

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

      <div className="saber" aria-hidden="true">
        <svg className="saber-hilt" viewBox="0 0 130 40" focusable="false">
          <defs>
            <linearGradient id="hilt-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#34353b" />
              <stop offset=".45" stopColor="#0f1013" />
              <stop offset="1" stopColor="#25262b" />
            </linearGradient>
            <linearGradient id="hilt-silver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4f5f7" />
              <stop offset=".55" stopColor="#b5b7be" />
              <stop offset="1" stopColor="#6c6e76" />
            </linearGradient>
          </defs>
          <rect x="1" y="4" width="110" height="32" rx="5" fill="url(#hilt-body)" />
          <rect x="0" y="3" width="7" height="34" rx="3.5" fill="#cfd1d6" />
          <rect x="2.2" y="5.5" width="2.2" height="29" rx="1.1" fill="#7a7c84" />
          <rect x="10" y="11" width="50" height="5" rx="2.5" fill="#a9abb2" />
          <rect x="10" y="24" width="50" height="5" rx="2.5" fill="#a9abb2" />
          <rect x="61" y="2" width="22" height="36" fill="#08080a" />
          <path d="M64 2v36M67.5 2v36M71 2v36M74.5 2v36M78 2v36M81.5 2v36" stroke="#3b3c42" strokeWidth="1.4" />
          <rect x="84" y="9" width="26" height="7" fill="url(#hilt-silver)" />
          <rect x="84" y="24" width="26" height="7" fill="url(#hilt-silver)" />
          <rect x="84" y="17" width="26" height="6" fill="#16171b" />
          <rect x="94" y="3" width="8" height="5" rx="1.2" fill="#d0342a" />
          <path d="M110 5h13l7 3.5-3 24-17 2.5z" fill="#0b0c0f" />
          <path d="M113 9h8l-.8 5h-7zM112.5 23h8.5l-.8 5.5h-7.5z" fill="#2c3036" />
          <path d="M123 5l7 3.5-3 24-3-.5z" fill="#1f2025" />
        </svg>
        <span className="saber-ignite">
          <span className="saber-blade" />
        </span>
      </div>

      <main ref={rootRef}>
        <noscript>
          <style>{".hero--pending .hero-copy,.hero--pending .hero-facts{opacity:1}"}</style>
        </noscript>

        <section ref={heroRef} className={`hero hero--${mode}`} aria-labelledby="hero-title">
          <div className="hero-stage">
            <div className="hero-portrait">
              <div className="hero-portrait-fade">
                <img src="/michael.webp" width={1200} height={1202} alt={text.portraitAlt} fetchPriority="high" />
              </div>
            </div>

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
                  <SocialLinks />
                </div>
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
        </section>

        <Sections text={text} locale={locale} />
      </main>
    </>
  );
}
