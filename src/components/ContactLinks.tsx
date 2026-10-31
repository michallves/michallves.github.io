"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionary";

// Número e e-mail só são montados no clique, para não ficarem legíveis para robôs no HTML
const phone = () => atob("NTU4NTk3NDAxODY0OQ==");
const address = () => atob("bWFpY29uMTU5OTUxMUBnbWFpbC5jb20=");

const profiles = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/michallves/" },
  { label: "GitHub", href: "https://github.com/michallves" },
];

export function ContactLinks({ text }: { text: Dictionary["contact"] }) {
  const [email, setEmail] = useState<string | null>(null);

  const openWhatsapp = () => {
    const message = encodeURIComponent(text.whatsappMessage);
    window.open(`https://wa.me/${phone()}?text=${message}`, "_blank", "noopener");
  };

  const openEmail = () => {
    // O endereço também aparece na tela, para quem não tem programa de e-mail configurado
    setEmail(address());
    window.location.href = `mailto:${address()}`;
  };

  return (
    <div className="reveal">
      <div className="contact-links">
        <button type="button" className="hero-cta" onClick={openWhatsapp}>
          {text.whatsapp}
        </button>
        <button type="button" className="hero-cta" onClick={openEmail}>
          {text.email}
        </button>
        {profiles.map((profile) => (
          <a key={profile.label} className="hero-cta hero-cta--ghost" href={profile.href} target="_blank" rel="noreferrer">
            {profile.label}
          </a>
        ))}
        <a className="hero-cta hero-cta--ghost" href={text.cvFile} download>
          {text.cv}
        </a>
      </div>
      {email && (
        <p className="contact-email" role="status">
          {text.emailLabel} <strong>{email}</strong>
        </p>
      )}
    </div>
  );
}
