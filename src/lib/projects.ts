import type { Locale } from "@/lib/dictionary";

type Localized = Record<Locale, string>;

export type Project = {
  name: string;
  role: Localized;
  stack: string[];
  commits?: number;
  status?: Localized;
  note?: Localized;
  url?: string;
};

const fullStack = { pt: "Desenvolvimento full stack", en: "Full stack development" };
const fullStackLead = { pt: "Líder full stack", en: "Full stack lead" };
const techLead = { pt: "Tech Lead", en: "Tech Lead" };
const mobile = { pt: "Mobile", en: "Mobile" };
const author = { pt: "Autor", en: "Author" };
const starting = { pt: "Em início", en: "Starting" };

// Projetos em destaque: liderança ou maior volume de trabalho
export const featured: Project[] = [
  {
    name: "JUS Workspace",
    role: techLead,
    stack: ["Next.js", "TypeScript", "Python", "IA"],
    commits: 372,
    note: {
      pt: "Plataforma com microsserviços e IA aplicada. Defini o fluxo de desenvolvimento, code review e versionamento do time.",
      en: "Platform with microservices and applied AI. I set the team's development flow, code review and versioning.",
    },
  },
  {
    name: "Luga Energy",
    role: fullStack,
    stack: ["Django REST", "Next.js", "AWS"],
    commits: 1328,
    note: {
      pt: "Back-end, front-end e automações de um produto do setor de energia.",
      en: "Back end, front end and automation for an energy sector product.",
    },
  },
  {
    name: "Maestro",
    role: fullStackLead,
    stack: ["Next.js", "Spring Boot", "Java 21", "MariaDB", "Docker", "AWS EC2", "GitHub Actions"],
    commits: 57,
    note: {
      pt: "Liderança técnica do produto, da interface ao deploy.",
      en: "Technical leadership of the product, from interface to deploy.",
    },
  },
  {
    name: "MANU",
    role: fullStackLead,
    stack: ["Next.js"],
    commits: 101,
  },
  {
    name: "OSP Manager",
    role: fullStack,
    stack: ["Angular", "Redux", "Spring Boot", "MariaDB", "AWS"],
    note: {
      pt: "Sistema para gestão de redes GPON.",
      en: "System for managing GPON networks.",
    },
  },
  {
    name: "IncluEdu",
    role: techLead,
    stack: [],
    status: starting,
  },
  {
    name: "EyeMed",
    role: { pt: "Líder técnico", en: "Technical lead" },
    stack: [],
    status: starting,
  },
];

export const others: Project[] = [
  { name: "SGLP Limpeza Pública", role: mobile, stack: ["Flutter"], commits: 206 },
  { name: "All App", role: mobile, stack: ["Flutter", "Firebase", "GitHub Actions"], commits: 78 },
  { name: "APREC-IA", role: fullStack, stack: ["Django", "Next.js"], commits: 14 },
  { name: "AVIA", role: { pt: "CI/CD", en: "CI/CD" }, stack: ["GitHub Actions"] },
  { name: "SGG", role: { pt: "CI/CD", en: "CI/CD" }, stack: ["GitHub Actions"] },
  { name: "Easy Flow", role: mobile, stack: ["Flutter", "Spring Boot"], commits: 65 },
  { name: "CHF", role: mobile, stack: ["Flutter"], commits: 11 },
  { name: "GoNoGo", role: mobile, stack: ["Flutter"] },
  { name: "KTK", role: mobile, stack: ["Flutter"] },
  { name: "MOBAK", role: { pt: "Mobile e front-end", en: "Mobile and front end" }, stack: ["Flutter", "TypeScript"] },
  { name: "Fit Metric", role: mobile, stack: ["Flutter"], commits: 18 },
  { name: "Agendar", role: { pt: "Líder mobile", en: "Mobile lead" }, stack: ["Flutter"] },
  { name: "Smash App", role: mobile, stack: ["Flutter"] },
  { name: "EH", role: { pt: "Front-end", en: "Front end" }, stack: ["Next.js"] },
  {
    name: "claude-assistente",
    role: author,
    stack: ["Python"],
    url: "https://github.com/michallves/claude-assistente",
  },
  {
    name: "whatsapp-mcp",
    role: { pt: "Autor do fork", en: "Fork author" },
    stack: ["Go", "Python", "Docker"],
    url: "https://github.com/michallves/whatsapp-mcp",
  },
  {
    name: "michallves-skills",
    role: author,
    stack: ["JavaScript"],
    url: "https://github.com/michallves/michallves-skills",
  },
  {
    name: "Servidor Minecraft IFCE",
    role: author,
    stack: ["Docker", "Java"],
    url: "https://github.com/michallves/IFCE-SERVER-MINECRAFT",
  },
];

export const contributions = [
  { year: "2023", value: 342 },
  { year: "2024", value: 149 },
  { year: "2025", value: 530 },
  { year: "2026", value: 3690 },
];
