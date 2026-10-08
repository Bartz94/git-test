import type { Ref } from 'react';
import type { Track } from './track';

type Props = {
  track: Track;
  collected: number;
  speedRef: Ref<HTMLSpanElement>;
  onJump: (x: number) => void;
  onClassic: () => void;
};

export function Hud({ track, collected, speedRef, onJump, onClassic }: Props) {
  const last = track.sections.length - 1;
  return (
    <>
      <header className="hud">
        <nav className="minimap" aria-label="Sekcje trasy">
          <div className="minimap__track">
            <div className="minimap__line">
              <div className="minimap__fill" />
            </div>
            <div className="minimap__car" aria-hidden="true" />
            {track.sections.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="minimap__stop"
                style={{ left: `${(i / last) * 100}%` }}
                onClick={() => onJump(s.x)}
                aria-label={`Przejdź do sekcji ${s.label}`}
                title={s.label}
              >
                <span aria-hidden="true">{s.icon}</span>
              </button>
            ))}
          </div>
        </nav>
        <button type="button" className="btn btn--cv" onClick={onClassic}>
          <span aria-hidden="true">📄</span> CV
        </button>
      </header>
      <div className="counter" title="Zebrane technologie">
        <span aria-hidden="true">⚡</span> {collected}/{track.tokens.length}
        <span className="visually-hidden"> technologii zebranych</span>
      </div>
      <div className="speedo" aria-hidden="true">
        <span ref={speedRef}>0</span>
        <small>km/h</small>
      </div>
    </>
  );
}
