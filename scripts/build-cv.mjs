// Gera public/cv/michael-alves-cv-{pt,en}.pdf. Uso: CHROME_PATH=<chromium> node scripts/build-cv.mjs
import { chromium } from "playwright";

const contact = {
  phone: "+55 (85) 97401-8649",
  email: "maicon1599511@gmail.com",
  linkedin: "linkedin.com/in/michallves",
  github: "github.com/michallves",
  site: "michallves.github.io",
};

const skills = [
  "Next.js, React, TypeScript, JavaScript, Angular, Redux",
  "Flutter, Dart, Android Studio",
  "Java, Spring Boot, Node.js, Python, Django REST, Go, REST APIs",
  "MariaDB, Firebase, NoSQL",
  "AWS, CodePipeline, CloudFormation, Docker, Git, GitHub Actions, CI/CD",
  "Scrum, Kanban, code review, SemVer",
];

const cv = {
  pt: {
    role: "Tech Lead · Full Stack · Mobile · DevOps",
    place: "Canindé, Ceará, Brasil",
    headings: ["Resumo", "Experiência", "Projetos", "Liderança e comunidade", "Competências", "Formação"],
    summary:
      "Líder técnico e desenvolvedor full stack, mobile e DevOps. Atuo do planejamento e da arquitetura até a entrega e a manutenção, com Scrum e Kanban, em projetos de P&D ligados ao LAMPI/IFCE e à EMBRAPII, e aplico IA generativa em produtos.",
    jobs: [
      ["ALMA Labs (antes DARM Labs)", "Tech Lead", "mai/2026 – out/2026", "Liderança técnica do JUS Workspace e padrões do time: fluxo de desenvolvimento, code review com prazo de 24 horas e SemVer por commit."],
      ["GESAD", "Tech Lead e DevOps", "2026 – atual", "DevOps da área de TI e liderança técnica do projeto IncluEdu."],
      ["DARM Group e DARM Labs", "Full stack, mobile, DevOps e líder do laboratório", "2022 – 2026", "Desenvolvimento em tempo integral e liderança do laboratório, com mais de 20 bolsistas presenciais."],
      ["LAMPI/IFCE", "Mobile e gestão de projetos", "2022 – 2023", "Aplicativos Flutter para projetos de pesquisa e gestão de projetos."],
      ["All Tech Solution", "Desenvolvedor Flutter", "2023", "Desenvolvimento de aplicativos mobile."],
    ],
    projects: [
      ["Luga Energy", "Django REST, Next.js, AWS"],
      ["Maestro", "liderança full stack; Next.js, Spring Boot, MariaDB, Docker, AWS EC2"],
      ["MANU", "liderança full stack; Next.js"],
      ["OSP Manager", "gestão de redes GPON; Angular, Redux, Spring Boot, MariaDB, AWS"],
      ["Mobile", "SGLP Limpeza Pública, All App, Easy Flow, CHF, GoNoGo, KTK, MOBAK, Fit Metric, Agendar, Smash App"],
    ],
    community: [
      "Organização da II Tech Week com o LAMPI, em novembro de 2025: três minicursos e três palestras.",
      "Minicursos de Next.js, GitHub e mobile, e trilha de front-end para voluntários.",
    ],
    education: "Análise e Desenvolvimento de Sistemas, IFCE Canindé. Início em 2021, conclusão prevista para o fim de 2026.",
  },
  en: {
    role: "Tech Lead · Full Stack · Mobile · DevOps",
    place: "Canindé, Ceará, Brazil",
    headings: ["Summary", "Experience", "Projects", "Leadership and community", "Skills", "Education"],
    summary:
      "Technical lead and full stack, mobile and DevOps developer. I work from planning and architecture through delivery and maintenance, with Scrum and Kanban, on R&D projects tied to LAMPI/IFCE and EMBRAPII, and I apply generative AI to products.",
    jobs: [
      ["ALMA Labs (formerly DARM Labs)", "Tech Lead", "May 2026 – Oct 2026", "Technical leadership of JUS Workspace and team standards: development flow, code review within 24 hours and SemVer per commit."],
      ["GESAD", "Tech Lead and DevOps", "2026 – present", "DevOps for the IT area and technical leadership of the IncluEdu project."],
      ["DARM Group and DARM Labs", "Full stack, mobile, DevOps and lab lead", "2022 – 2026", "Full-time development and leadership of the lab, with more than 20 on-site research fellows."],
      ["LAMPI/IFCE", "Mobile and project management", "2022 – 2023", "Flutter apps for research projects and project management."],
      ["All Tech Solution", "Flutter developer", "2023", "Mobile app development."],
    ],
    projects: [
      ["Luga Energy", "Django REST, Next.js, AWS"],
      ["Maestro", "full stack leadership; Next.js, Spring Boot, MariaDB, Docker, AWS EC2"],
      ["MANU", "full stack leadership; Next.js"],
      ["OSP Manager", "GPON network management; Angular, Redux, Spring Boot, MariaDB, AWS"],
      ["Mobile", "SGLP Limpeza Pública, All App, Easy Flow, CHF, GoNoGo, KTK, MOBAK, Fit Metric, Agendar, Smash App"],
    ],
    community: [
      "Organized II Tech Week with LAMPI in November 2025: three short courses and three talks.",
      "Short courses on Next.js, GitHub and mobile, and a front-end track for volunteers.",
    ],
    education: "Systems Analysis and Development, IFCE Canindé. Started in 2021, graduation expected by the end of 2026.",
  },
};

const html = (locale, data) => `<!doctype html>
<html lang="${locale === "pt" ? "pt-BR" : "en"}"><head><meta charset="utf-8"><title>Michael Alves</title><style>
  body { margin: 0; color: #18181b; font: 9.6pt/1.38 Arial, Helvetica, sans-serif; }
  h1 { margin: 0; font-size: 21pt; letter-spacing: -0.01em; }
  .role { margin: 2px 0 5px; color: #b3120a; font-weight: 700; }
  .contact { margin: 0; color: #3f3f46; }
  h2 { margin: 11px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #b3120a; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; }
  p { margin: 0; }
  ul { margin: 0; padding-left: 14px; }
  .job { margin-bottom: 5px; break-inside: avoid; }
  .job header { display: flex; justify-content: space-between; gap: 12px; }
  .job time { flex: none; color: #3f3f46; }
</style></head><body>
  <h1>Michael Alves</h1>
  <p class="role">${data.role}</p>
  <p class="contact">${data.place} · ${contact.phone} · ${contact.email}<br>${contact.linkedin} · ${contact.github} · ${contact.site}</p>
  <h2>${data.headings[0]}</h2><p>${data.summary}</p>
  <h2>${data.headings[1]}</h2>
  ${data.jobs.map(([place, role, time, text]) => `<div class="job"><header><span><strong>${place}</strong> · ${role}</span><time>${time}</time></header><p>${text}</p></div>`).join("")}
  <h2>${data.headings[2]}</h2>
  <ul>${data.projects.map(([name, text]) => `<li><strong>${name}:</strong> ${text}</li>`).join("")}</ul>
  <h2>${data.headings[3]}</h2>
  <ul>${data.community.map((item) => `<li>${item}</li>`).join("")}</ul>
  <h2>${data.headings[4]}</h2>
  <ul>${skills.map((item) => `<li>${item}</li>`).join("")}</ul>
  <h2>${data.headings[5]}</h2><p>${data.education}</p>
</body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage();
for (const [locale, data] of Object.entries(cv)) {
  await page.setContent(html(locale, data), { waitUntil: "load" });
  await page.pdf({
    path: `public/cv/michael-alves-cv-${locale}.pdf`,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "12mm", left: "15mm", right: "15mm" },
  });
}
await browser.close();
