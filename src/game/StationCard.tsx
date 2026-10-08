import type { Station } from './track';

export function StationCard({ station }: { station: Station | null }) {
  return (
    <div className="card-slot" aria-live="polite">
      {station && (
        <article key={station.id} className={`card card--${station.kind}`}>
          <span className="card__badge">{station.card.badge}</span>
          <h2 className="card__title">{station.card.title}</h2>
          {station.card.subtitle && <p className="card__subtitle">{station.card.subtitle}</p>}
          {station.card.meta && <p className="card__meta">{station.card.meta}</p>}
          {station.card.body && <p className="card__body">{station.card.body}</p>}
          {station.card.bullets && (
            <ul className="card__bullets">
              {station.card.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {station.card.tags && (
            <ul className="tags" aria-label="Technologie">
              {station.card.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {station.card.links && station.card.links.length > 0 && (
            <div className="card__links">
              {station.card.links.map((l) => (
                <a key={l.href} className="btn btn--small" href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
