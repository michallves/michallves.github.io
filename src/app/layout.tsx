import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Michroma } from "next/font/google";
import "./globals.css";
import "./sections.css";

const display = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://michallves.github.io"),
  title: "Michael Alves | Tech Lead, Full Stack e IA",
  description: "Portfólio de Michael Alves, tech lead e desenvolvedor full stack, mobile e DevOps, com IA aplicada a produtos.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Michael Alves",
    title: "Michael Alves | Tech Lead, Full Stack e IA",
    description: "Lidero times e construo produtos com IA, do aplicativo ao deploy.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Michael Alves, de camisa preta, sobre fundo escuro com luz vermelha" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
