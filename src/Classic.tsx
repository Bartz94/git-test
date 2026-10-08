import { useEffect } from 'react';
import { experience, extraSkills, profile, projects, skillGroups } from './content';

const goGame = () => {
  window.location.hash = 'gra';
};

// Plain, accessible CV view with the same content as the game.
export function Classic() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const newestFirst = [...experience].reverse();

  return (
    <div className="classic">
      <header className="classic__header">
        <div>
          <h1 className="classic__name">{profile.name}</h1>
          <p className="classic__role">
            {profile.role}, {profile.location}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={goGame}>
          🏎️ Wersja interaktywna
        </button>
      </header>

      <ul className="classic__contact">
        <li>
          <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
        </li>
        <li>
          <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={profile.contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
      </ul>

      <section className="classic__section">
        <h2>O mnie</h2>
        <p>{profile.summary}</p>
      </section>

      <section className="classic__section">
        <h2>Doświadczenie</h2>
        <ol className="timeline">
          {newestFirst.map((e) => (
            <li key={e.id} className="timeline__item">
              <div className="timeline__head">
                <h3>
                  {e.role}, {e.company}
                </h3>
                <span className="timeline__period">{e.period}</span>
              </div>
              <p className="timeline__place">{e.place}</p>
              <ul>
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <ul className="tags">
                {e.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {e.links?.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </li>
          ))}
        </ol>
      </section>

      <section className="classic__section">
        <h2>Projekty</h2>
        <div className="project-list">
          {projects.map((p) => (
            <article key={p.id} className="project">
              <h3>{p.title}</h3>
              <p className="project__kind">{p.kind}</p>
              <p>{p.description}</p>
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="classic__section">
        <h2>Umiejętności</h2>
        <dl className="skills">
          {skillGroups.map((g) => (
            <div key={g.id}>
              <dt>{g.title}</dt>
              <dd>{g.items.join(', ')}</dd>
            </div>
          ))}
          <div>
            <dt>Również</dt>
            <dd>{extraSkills.join(', ')}</dd>
          </div>
        </dl>
      </section>

      <section className="classic__section classic__section--split">
        <div>
          <h2>Wykształcenie</h2>
          {profile.education.map((ed) => (
            <p key={ed.school}>
              <strong>{ed.degree}</strong>
              <br />
              {ed.school}, {ed.period}
            </p>
          ))}
          {profile.certificates.map((c) => (
            <p key={c.title}>
              {c.title}, {c.period}
            </p>
          ))}
        </div>
        <div>
          <h2>Języki</h2>
          <p>{profile.languages.join(', ')}</p>
          <h2>Po pracy</h2>
          <p>{profile.interests}</p>
        </div>
      </section>
    </div>
  );
}
