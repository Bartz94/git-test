import type { Ref } from 'react';

type Props = { ref?: Ref<HTMLDivElement> };

function Wheel({ cx }: { cx: number }) {
  return (
    <g className="car__wheel" style={{ transformOrigin: `${cx}px 42px` }}>
      <circle cx={cx} cy={42} r={10} fill="#1F1A33" />
      <circle cx={cx} cy={42} r={5.5} fill="#D9DCE4" />
      <path d={`M${cx - 5} 42h10M${cx} 37v10`} stroke="#1F1A33" strokeWidth={2} />
    </g>
  );
}

export function Car({ ref }: Props) {
  return (
    <div className="car" ref={ref} aria-hidden="true">
      <div className="car__beam" />
      <div className="car__puffs">
        <span />
        <span />
        <span />
      </div>
      <svg className="car__svg" viewBox="0 0 124 58" width="124" height="58">
        <ellipse cx="62" cy="53" rx="52" ry="4" fill="rgba(31,26,51,.28)" />
        <g className="car__body">
          <path
            d="M8 38l2-10q2-4 8-5l18-2 12-11q3-2 8-2h24q6 0 10 5l8 9 12 3q6 2 6 8v7q0 2-2 2H10q-2 0-2-2z"
            fill="#E8432E"
            stroke="#1F1A33"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M52 12l-7 9h21V12z" fill="#BFE6FF" stroke="#1F1A33" strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 12v9h24l-6-7q-2-2-6-2z" fill="#BFE6FF" stroke="#1F1A33" strokeWidth="2" strokeLinejoin="round" />
          <rect x="12" y="29" width="100" height="4" fill="#FFD23F" />
          <rect x="110" y="27" width="6" height="5" rx="1" fill="#FFF3B0" stroke="#1F1A33" strokeWidth="1.5" />
          <rect x="8" y="28" width="4" height="5" fill="#8C1C13" />
        </g>
        <Wheel cx={32} />
        <Wheel cx={92} />
      </svg>
    </div>
  );
}
