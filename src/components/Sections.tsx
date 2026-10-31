import { ContactLinks } from "@/components/ContactLinks";
import type { Dictionary, Locale } from "@/lib/dictionary";
import { contributions, featured, others, type Project } from "@/lib/projects";

type SectionsProps = {
  text: Dictionary;
  locale: Locale;
  canReplay: boolean;
  onReplay: () => void;
};

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="section-header reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <span className="saber-rule" aria-hidden="true" />
    </header>
  );
}

function ProjectName({ project, label }: { project: Project; label: string }) {
  if (!project.url) return <>{project.name}</>;
  return (
    <a href={project.url} target="_blank" rel="noreferrer" aria-label={`${label} ${project.name}`}>
      {project.name}
    </a>
  );
}

export function Sections({ text, locale, canReplay, onReplay }: SectionsProps) {
  const numberFormat = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US");
  const highest = Math.max(...contributions.map((entry) => entry.value));
  const { dossier, arsenal, campaigns, timeline, contact } = text;

  return (
    <>
      <section id="dossie" className="section">
        <SectionHeader eyebrow={dossier.eyebrow} title={dossier.title} />
        <div className="dossier-grid">
          <p className="dossier-summary reveal">{dossier.summary}</p>
          <figure className="chart reveal">
            <figcaption>{dossier.chartTitle}</figcaption>
            <ul>
              {contributions.map((entry) => (
                <li key={entry.year}>
                  <span className="chart-year">{entry.year}</span>
                  <span className="chart-track">
                    <span className="chart-bar" style={{ width: `${(entry.value / highest) * 100}%` }} />
                  </span>
                  <span className="chart-value">{numberFormat.format(entry.value)}</span>
                </li>
              ))}
            </ul>
            <p className="chart-note">{dossier.chartNote}</p>
          </figure>
        </div>
        <h3 className="subtitle reveal">{dossier.leadershipTitle}</h3>
        <ul className="leadership">
          {dossier.leadership.map((item) => (
            <li key={item.title} className="reveal">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="arsenal" className="section section--panel">
        <SectionHeader eyebrow={arsenal.eyebrow} title={arsenal.title} />
        <div className="arsenal-grid">
          {arsenal.groups.map((group) => (
            <div key={group.title} className="arsenal-group reveal">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="campanhas" className="section">
        <SectionHeader eyebrow={campaigns.eyebrow} title={campaigns.title} />
        <h3 className="subtitle reveal">{campaigns.featured}</h3>
        <div className="campaigns">
          {featured.map((project, index) => (
            <article key={project.name} className="campaign reveal">
              <span className="campaign-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="campaign-main">
                <h4>
                  <ProjectName project={project} label={campaigns.repository} />
                </h4>
                {project.note && <p>{project.note[locale]}</p>}
                {project.stack.length > 0 && <p className="stack">{project.stack.join(" · ")}</p>}
              </div>
              <div className="campaign-meta">
                <strong>{project.role[locale]}</strong>
                {project.commits && (
                  <span>
                    {numberFormat.format(project.commits)} {campaigns.commits}
                  </span>
                )}
                {project.status && <span className="campaign-status">{project.status[locale]}</span>}
              </div>
            </article>
          ))}
        </div>

        <h3 className="subtitle reveal">{campaigns.others}</h3>
        <ul className="missions">
          {others.map((project) => (
            <li key={project.name} className="reveal">
              <strong>
                <ProjectName project={project} label={campaigns.repository} />
              </strong>
              <span>{project.role[locale]}</span>
              <span className="stack">{project.stack.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="linha-do-tempo" className="section section--panel">
        <SectionHeader eyebrow={timeline.eyebrow} title={timeline.title} />
        <ol className="timeline">
          <span className="timeline-blade" aria-hidden="true" />
          {timeline.items.map((item) => (
            <li key={item.year} className="reveal">
              <span className="timeline-year">{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="transmissao" className="section section--contact">
        <p className="eyebrow reveal">{contact.eyebrow}</p>
        <h2 className="contact-title reveal">{contact.title}</h2>
        <p className="contact-text reveal">{contact.text}</p>
        <ContactLinks text={contact} />
      </section>

      <footer className="footer">
        <p>{text.footer}</p>
        {canReplay && (
          <button type="button" onClick={onReplay}>
            {text.replay}
          </button>
        )}
      </footer>
    </>
  );
}
