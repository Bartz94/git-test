import type { CSSProperties } from 'react';
import { profile } from '../content';
import { ACHIEVEMENTS, formatTime, type AchievementId } from './achievements';

type Props = {
  timeMs: number | null;
  collected: number;
  totalTokens: number;
  visited: number;
  totalPitstops: number;
  unlocked: Set<AchievementId>;
  onClose: () => void;
  onRestart: () => void;
  onClassic: () => void;
};

const CONFETTI = Array.from({ length: 28 }, (_, i) => i);

export function FinishPanel(props: Props) {
  const { timeMs, collected, totalTokens, visited, totalPitstops, unlocked } = props;
  return (
    <div className="finish-panel" role="dialog" aria-modal="true" aria-labelledby="finish-title">
      <div className="confetti" aria-hidden="true">
        {CONFETTI.map((i) => (
          <span key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <div className="finish-panel__card">
        <button type="button" className="finish-panel__close" onClick={props.onClose} aria-label="Zamknij">
          ✕
        </button>
        <h2 id="finish-title" className="finish-panel__title">
          Meta!
        </h2>
        <dl className="stats">
          <div>
            <dt>Czas</dt>
            <dd>{timeMs === null ? '–' : formatTime(timeMs)}</dd>
          </div>
          <div>
            <dt>Technologie</dt>
            <dd>
              {collected}/{totalTokens}
            </dd>
          </div>
          <div>
            <dt>Pit-stopy</dt>
            <dd>
              {visited}/{totalPitstops}
            </dd>
          </div>
        </dl>
        <ul className="achievements">
          {ACHIEVEMENTS.map((a) => {
            const on = unlocked.has(a.id);
            return (
              <li key={a.id} className={on ? 'is-on' : ''}>
                <span className="achievements__icon" aria-hidden="true">
                  {on ? a.icon : '🔒'}
                </span>
                <span>
                  <strong>{a.title}</strong>
                  <small>{a.description}</small>
                </span>
                <span className="visually-hidden">{on ? 'zdobyte' : 'zablokowane'}</span>
              </li>
            );
          })}
        </ul>
        <p className="finish-panel__lead">Szukasz frontend developera? Napisz, chętnie porozmawiam.</p>
        <div className="finish-panel__cta">
          <a className="btn btn--primary" href={`mailto:${profile.contact.email}`}>
            Napisz maila
          </a>
          <a className="btn" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="btn" href={profile.contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="finish-panel__secondary">
          <button type="button" className="link-btn" onClick={props.onClassic}>
            Wersja klasyczna
          </button>
          <button type="button" className="link-btn" onClick={props.onRestart}>
            Jedź od nowa
          </button>
        </div>
      </div>
    </div>
  );
}
