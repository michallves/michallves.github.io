// Gera src/lib/icons.ts com os traçados (Simple Icons) das ferramentas listadas. Uso: node scripts/build-icons.mjs
import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

const bySlug = new Map(Object.values(si).filter((icon) => icon?.slug).map((icon) => [icon.slug, icon.path]));

const slugs = {
  "Next.js": "nextdotjs", React: "react", TypeScript: "typescript", JavaScript: "javascript", Angular: "angular",
  Redux: "redux", Vite: "vite", HTML: "html5", Expo: "expo", Flutter: "flutter", Dart: "dart",
  "Android Studio": "androidstudio", Firebase: "firebase", Java: "openjdk", "Spring Boot": "springboot",
  "Node.js": "nodedotjs", Python: "python", "Django REST": "django", Go: "go", MariaDB: "mariadb", DBeaver: "dbeaver",
  PostgreSQL: "postgresql", Docker: "docker", GitHub: "github", "GitHub Actions": "githubactions", Git: "git",
  Linux: "linux", Apache: "apache", Cloudflare: "cloudflare", Bitwarden: "bitwarden", Proxmox: "proxmox",
  "Google Cloud": "googlecloud", Notion: "notion", ClickUp: "clickup", Todoist: "todoist", Figma: "figma",
  OpenProject: "openproject", "Google Drive": "googledrive", Gmail: "gmail", "Google Agenda": "googlecalendar",
  "Google Calendar": "googlecalendar", "Google Docs": "googledocs", "Google Planilhas": "googlesheets",
  "Google Sheets": "googlesheets", WhatsApp: "whatsapp", FFmpeg: "ffmpeg", Bash: "gnubash", Claude: "claude",
  "Claude Code": "claude", rclone: "rclone", tmux: "tmux",
  Gemini: "googlegemini", "GitHub Copilot": "githubcopilot", Jira: "jira", "GitHub Projects": "github",
  Discord: "discord", "Google Meet": "googlemeet", "Google Chat": "googlechat", "IntelliJ IDEA": "intellijidea",
  Xcode: "xcode", ESLint: "eslint", SonarLint: "sonarqubeforide", "React Native": "react", Postman: "postman", "Google Cloud Console": "googlecloud", Authentication: "firebase",
  "App Check": "firebase", Firestore: "firebase", "Realtime Database": "firebase", "Cloud Storage": "firebase",
  "Cloud Functions": "firebase", "Firebase Hosting": "firebase", "App Hosting": "firebase",
};

// Material "cloud", usado onde a marca não está na biblioteca (AWS)
const cloud = "M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z";
const extra = { AWS: cloud, EC2: cloud, CodePipeline: cloud, CloudFormation: cloud };

const icons = { ...extra };
const missing = [];
for (const [name, slug] of Object.entries(slugs)) {
  const path = bySlug.get(slug);
  if (path) icons[name] = path;
  else missing.push(name);
}
if (missing.length) console.warn("sem ícone:", missing.join(", "));

const body = Object.entries(icons).map(([name, path]) => `  ${JSON.stringify(name)}: ${JSON.stringify(path)},`).join("\n");
writeFileSync(
  "src/lib/icons.ts",
  `// Gerado por scripts/build-icons.mjs (Simple Icons, CC0). Não editar à mão.\nexport const toolIcons: Record<string, string> = {\n${body}\n};\n`,
);
console.log(Object.keys(icons).length, "ícones");
