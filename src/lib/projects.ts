import type { Locale } from "@/lib/dictionary";

type Localized = Record<Locale, string>;

export type Project = {
  name: string;
  role: Localized;
  stack: string[];
  note?: Localized;
  url?: string;
};

const fullStackFreelance = { pt: "Desenvolvimento full stack e DevOps (freelance)", en: "Full stack development and DevOps (freelance)" };
const fullStack = { pt: "Desenvolvimento full stack", en: "Full stack development" };
const frontEnd = { pt: "Front-end", en: "Front end" };
const leadDevops = { pt: "Líder full stack e DevOps", en: "Full stack and DevOps lead" };
const fullStackLead = { pt: "Líder full stack", en: "Full stack lead" };
const mobile = { pt: "Mobile", en: "Mobile" };
const author = { pt: "Autor", en: "Author" };
const leadManager = { pt: "Tech Lead · gestão, liderança técnica e DevOps", en: "Tech Lead · management, technical leadership and DevOps" };

// Projetos em destaque, do mais recente ao mais antigo
export const featured: Project[] = [
  {
    name: "EyeMed",
    role: leadManager,
    stack: [],
    note: {
      pt: "Projeto de P&D na área farmacêutica, via EMBRAPII/SEBRAE, com a FARMA TECH como empresa parceira.",
      en: "R&D project in the pharmaceutical field, through EMBRAPII/SEBRAE, with FARMA TECH as the partner company.",
    },
  },
  {
    name: "IncluEdu",
    role: leadManager,
    stack: [],
    note: {
      pt: "Projeto em parceria com a startup IncluEdu.",
      en: "Project in partnership with the IncluEdu startup.",
    },
  },
  {
    name: "JUS Workspace",
    role: leadManager,
    stack: ["Next.js", "TypeScript", "Python", "IA"],
    note: {
      pt: "Projeto de P&D na área jurídica, via EMBRAPII/SEBRAE, com a JUS Digital como empresa parceira.",
      en: "R&D project in the legal field, through EMBRAPII/SEBRAE, with JUS Digital as the partner company.",
    },
  },
  {
    name: "Luga Energy",
    role: fullStackFreelance,
    stack: ["Django REST", "Next.js", "AWS"],
    note: {
      pt: "Freelance em parceria com a Luga Energy, empresa de energia solar: desenvolvimento de um SaaS.",
      en: "Freelance work in partnership with Luga Energy, a solar energy company: development of a SaaS product.",
    },
  },
  {
    name: "MANU",
    role: leadDevops,
    stack: ["Next.js", "React", "Django", "Python", "PostgreSQL", "CI/CD"],
    note: {
      pt: "Gerenciador de laboratório, projeto interno do ALMA LABS, com pipelines de CI/CD, provisionamento de máquinas virtuais e distribuição em produção.",
      en: "Laboratory management system, an internal ALMA LABS project, with CI/CD pipelines, virtual machine provisioning and production delivery.",
    },
  },
  {
    name: "OSP Manager",
    role: fullStack,
    stack: ["Angular", "Redux", "Spring Boot", "MariaDB", "AWS"],
    note: {
      pt: "Sistema para gestão de redes GPON. Projeto via FUNCEPE, com a Lightera como empresa parceira.",
      en: "System for managing GPON networks. Project through FUNCEPE, with Lightera as the partner company.",
    },
  },
  {
    name: "EH",
    role: frontEnd,
    stack: ["Next.js", "React"],
    note: {
      pt: "Gerenciador de alarmes. Projeto via FUNCEPE, com a Lightera como empresa parceira.",
      en: "Alarm management system. Project through FUNCEPE, with Lightera as the partner company.",
    },
  },
];

export const others: Project[] = [
  { name: "Maestro", role: fullStackLead, stack: ["Next.js", "Spring Boot", "Java 21", "MariaDB", "Docker", "AWS EC2", "GitHub Actions"] },
  { name: "SGLP Limpeza Pública", role: mobile, stack: ["Flutter"] },
  { name: "All App", role: mobile, stack: ["Flutter", "Firebase", "GitHub Actions"] },
  { name: "APREC-IA", role: fullStack, stack: ["Django", "Next.js"] },
  { name: "AVIA", role: { pt: "CI/CD", en: "CI/CD" }, stack: ["GitHub Actions"] },
  { name: "SGG", role: { pt: "CI/CD", en: "CI/CD" }, stack: ["GitHub Actions"] },
  { name: "Easy Flow", role: mobile, stack: ["Flutter", "Spring Boot"] },
  { name: "CHF", role: mobile, stack: ["Flutter"] },
  { name: "GoNoGo", role: mobile, stack: ["Flutter"] },
  { name: "KTK", role: mobile, stack: ["Flutter"] },
  { name: "MOBAK", role: { pt: "Mobile e front-end", en: "Mobile and front end" }, stack: ["Flutter", "TypeScript"] },
  { name: "Fit Metric", role: mobile, stack: ["Flutter"] },
  { name: "Agendar", role: { pt: "Líder mobile", en: "Mobile lead" }, stack: ["Flutter"] },
  { name: "Smash App", role: mobile, stack: ["Flutter"] },
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
