import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Station, Track } from './track';

const at = (x: number): CSSProperties => ({ left: `${x}px` });

// Building palettes per career stop, oldest to newest.
const TOWN_COLORS = [
  ['#F2A65A', '#E07A5F', '#F6D186'],
  ['#81B29A', '#3D9A8B', '#B8DBC5'],
  ['#9C89B8', '#F0A6CA', '#C8B8E6'],
  ['#5BC0EB', '#E8432E', '#FFD23F'],
];

function Garage() {
  return (
    <div className="obj garage" style={at(0)}>
      <svg viewBox="0 0 240 150" width="240" height="150">
        <path d="M6 58L120 8l114 50v92H6z" fill="#F4EBDD" stroke="#1F1A33" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 60L120 4l120 56" fill="none" stroke="#E8432E" strokeWidth="8" strokeLinejoin="round" />
        <rect x="42" y="66" width="156" height="84" fill="#3A3350" stroke="#1F1A33" strokeWidth="3" />
        <path d="M42 66h156v10H42z" fill="#FFD23F" stroke="#1F1A33" strokeWidth="2" />
      </svg>
      <span className="garage__sign">BC</span>
    </div>
  );
}

function Town({ station }: { station: Extract<Station, { kind: 'town' }> }) {
  const [a, b, c] = TOWN_COLORS[station.index % TOWN_COLORS.length];
  const exp = station.experience;
  const year = exp.period.match(/\d{4}/)?.[0] ?? '';
  return (
    <div className="obj town" style={at(station.x)}>
      <svg viewBox="0 0 240 170" width="240" height="170">
        <g stroke="#1F1A33" strokeWidth="3" strokeLinejoin="round">
          <rect x="18" y="70" width="64" height="100" fill={a} />
          <rect x="88" y="18" width="70" height="152" fill={b} />
          <rect x="164" y="88" width="60" height="82" fill={c} />
        </g>
        <g className="town__windows" fill="#FFF3B0">
          {[0, 1, 2].map((r) =>
            [0, 1].map((col) => <rect key={`a${r}${col}`} x={30 + col * 24} y={84 + r * 26} width="14" height="14" />),
          )}
          {[0, 1, 2, 3, 4].map((r) =>
            [0, 1, 2].map((col) => <rect key={`b${r}${col}`} x={98 + col * 20} y={30 + r * 26} width="12" height="14" />),
          )}
          {[0, 1].map((r) =>
            [0, 1].map((col) => <rect key={`c${r}${col}`} x={176 + col * 22} y={102 + r * 26} width="14" height="14" />),
          )}
        </g>
      </svg>
      <div className="signpost">
        <span className="signpost__year">{year}</span>
        <span className="signpost__name">{exp.company}</span>
      </div>
      {exp.current && <span className="town__flag">Teraz</span>}
    </div>
  );
}

function Pitstop({ station }: { station: Extract<Station, { kind: 'pitstop' }> }) {
  return (
    <div className="obj pitstop" style={at(station.x)}>
      <svg viewBox="0 0 220 130" width="220" height="130">
        <g stroke="#1F1A33" strokeWidth="3" strokeLinejoin="round">
          <rect x="22" y="30" width="10" height="100" fill="#D9DCE4" />
          <rect x="188" y="30" width="10" height="100" fill="#D9DCE4" />
          <rect x="8" y="14" width="204" height="22" fill="#FFFFFF" />
        </g>
        <g fill="#1F1A33">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={8 + i * 17} y={i % 2 ? 25 : 14} width="17" height="11" />
          ))}
        </g>
        <g stroke="#1F1A33" strokeWidth="2.5" fill="#3A3350">
          <ellipse cx="50" cy="122" rx="14" ry="6" />
          <ellipse cx="50" cy="112" rx="14" ry="6" />
          <ellipse cx="50" cy="102" rx="14" ry="6" />
        </g>
      </svg>
      <span className="pitstop__label">{station.project.title}</span>
    </div>
  );
}

function FinishGate({ x }: { x: number }) {
  return (
    <div className="obj finish" style={at(x)}>
      <span className="finish__banner">Meta</span>
    </div>
  );
}

type Props = {
  track: Track;
  collected: number;
};

// Static world: re-renders only when the collected token count changes.
export const World = memo(function World({ track, collected }: Props) {
  return (
    <div className="world" aria-hidden="true">
      <div className="road" />
      {track.lamps.map((lx) => (
        <div key={lx} className="obj lamp" style={at(lx)} />
      ))}
      {track.stations.map((s) => {
        if (s.kind === 'garage') return <Garage key={s.id} />;
        if (s.kind === 'town') return <Town key={s.id} station={s} />;
        return <Pitstop key={s.id} station={s} />;
      })}
      {track.billboards.map((b) => (
        <div key={b.id} className="obj billboard" style={at(b.x)}>
          <div className="billboard__board">
            <span className="billboard__title">{b.title}</span>
            <span className="billboard__count">{b.count} do zebrania</span>
          </div>
        </div>
      ))}
      {track.tokens.map((t, i) => (
        <span
          key={t.id}
          className={`token token--row${t.row}${i < collected ? ' token--collected' : ''}`}
          style={at(t.x)}
        >
          {t.label}
        </span>
      ))}
      <FinishGate x={track.finishX} />
    </div>
  );
});

// Lamp glows sit above the night tint so they read as light sources.
export const Lights = memo(function Lights({ track }: { track: Track }) {
  return (
    <div className="world world--lights" aria-hidden="true">
      {track.lamps.map((lx) => (
        <div key={lx} className="glow" style={at(lx)} />
      ))}
    </div>
  );
});
