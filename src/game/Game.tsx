import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { profile } from '../content';
import { ACHIEVEMENTS, PITSTOP_VISIT_MS, SPEEDRUN_SECONDS, type AchievementId } from './achievements';
import { Car } from './Car';
import { FinishPanel } from './FinishPanel';
import { Hud } from './Hud';
import { shipsTile, skylineTile } from './scenery';
import { StationCard } from './StationCard';
import { buildTrack, findActiveStation, type Section } from './track';
import { Lights, World } from './World';

const FINISH_ZONE = 40;
const MOVE_THRESHOLD = 30;
const KEY_STEP = 140;
// Tokens are picked up when the car's front bumper reaches them.
const TOKEN_REACH = 50;

// Minimap stops are evenly spaced, so the car dot moves piecewise between them.
function minimapProgress(sections: Section[], d: number) {
  const last = sections.length - 1;
  for (let i = 0; i < last; i++) {
    const a = sections[i].x;
    const b = sections[i + 1].x;
    if (d < b) return (i + Math.max(0, d - a) / (b - a)) / last;
  }
  return 1;
}

const goClassic = () => {
  window.location.hash = 'cv';
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Game() {
  const track = useMemo(buildTrack, []);
  const stageRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const gasRaf = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const restartRef = useRef(false);
  // Fast travel via the minimap does not count towards the speedrun.
  const jumpedRef = useRef(false);

  const [started, setStarted] = useState(() => window.location.hash === '#gra');
  const [activeId, setActiveId] = useState<string | null>('about');
  const [collected, setCollected] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<string>>(() => new Set());
  const [atFinish, setAtFinish] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [moved, setMoved] = useState(false);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState<ReadonlySet<AchievementId>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);

  // Page setup: the stage is fixed, the document only provides scroll distance.
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const root = document.documentElement;
    root.classList.add('is-game');
    return () => root.classList.remove('is-game', 'is-locked');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !started);
  }, [started]);

  // Main loop: maps scroll position to distance and drives the scene via CSS variables.
  useEffect(() => {
    let raf = 0;
    let prev = -1;
    let velocity = 0;
    let maxD = 0;
    let lastActive: string | null = 'about';
    let activeSince = performance.now();
    let lastCollected = 0;
    let lastAtFinish = false;
    let lastMoved = false;
    const visitedLocal = new Set<string>();

    const tick = (now: number) => {
      const d = Math.min(track.finishX, Math.max(0, window.scrollY));
      const delta = prev < 0 ? 0 : d - prev;
      prev = d;
      velocity = velocity * 0.82 + delta * 0.18;

      const stage = stageRef.current;
      if (stage) {
        stage.style.setProperty('--d', d.toFixed(1));
        stage.style.setProperty('--p', (d / track.finishX).toFixed(4));
        stage.style.setProperty('--mp', minimapProgress(track.sections, d).toFixed(4));
      }
      const car = carRef.current;
      if (car) {
        car.style.setProperty('--wheel', `${((d / 10) * (180 / Math.PI)) % 360}deg`);
        car.classList.toggle('is-moving', Math.abs(velocity) > 0.4);
        car.classList.toggle('is-reversing', velocity < -0.4);
      }
      if (speedRef.current) {
        speedRef.current.textContent = String(Math.min(299, Math.round(Math.abs(velocity) * 7)));
      }

      // Tokens are sorted by x, so the collected ones are a prefix.
      if (d > maxD) maxD = d;
      let count = 0;
      for (const t of track.tokens) {
        if (t.x > maxD + TOKEN_REACH) break;
        count++;
      }
      if (count !== lastCollected) {
        lastCollected = count;
        setCollected(count);
      }

      const active = findActiveStation(track, d);
      const activeNow = active?.id ?? null;
      if (activeNow !== lastActive) {
        lastActive = activeNow;
        activeSince = now;
        setActiveId(activeNow);
      } else if (
        active?.kind === 'pitstop' &&
        !visitedLocal.has(active.id) &&
        now - activeSince >= PITSTOP_VISIT_MS
      ) {
        visitedLocal.add(active.id);
        setVisited(new Set(visitedLocal));
      }

      if (restartRef.current && d <= MOVE_THRESHOLD) {
        restartRef.current = false;
        startTimeRef.current = null;
      }
      if (d > MOVE_THRESHOLD) {
        if (!lastMoved) {
          lastMoved = true;
          setMoved(true);
        }
        if (startTimeRef.current === null && !restartRef.current) startTimeRef.current = now;
      }

      const finishNow = d >= track.finishX - FINISH_ZONE;
      if (finishNow !== lastAtFinish) {
        lastAtFinish = finishNow;
        setAtFinish(finishNow);
        if (finishNow) {
          const start = startTimeRef.current;
          if (start !== null) setTimeMs((t) => t ?? now - start);
        } else {
          setDismissed(false);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [track]);

  // Achievements are derived from game state; a toast announces each new one.
  useEffect(() => {
    const next = new Set(unlocked);
    if (collected === track.tokens.length) next.add('collector');
    if (visited.size === track.pitstopCount) next.add('mechanic');
    if (atFinish) next.add('finish');
    if (atFinish && timeMs !== null && timeMs < SPEEDRUN_SECONDS * 1000 && !jumpedRef.current) {
      next.add('speedrun');
    }
    if (next.size === unlocked.size) return;
    const fresh = ACHIEVEMENTS.filter((a) => next.has(a.id) && !unlocked.has(a.id));
    setUnlocked(next);
    if (!atFinish && fresh.length > 0) {
      setToast(`${fresh[0].icon} ${fresh[0].title}`);
    }
  }, [collected, visited, atFinish, timeMs, unlocked, track]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Desktop controls: arrows / A-D drive, horizontal trackpad swipes drive too.
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const key = e.key.toLowerCase();
      if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        window.scrollBy(0, KEY_STEP);
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        window.scrollBy(0, -KEY_STEP);
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) window.scrollBy(0, e.deltaX);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
    };
  }, [started]);

  useEffect(() => () => cancelAnimationFrame(gasRaf.current), []);

  const pressGas = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    cancelAnimationFrame(gasRaf.current);
    let speed = 3;
    const step = () => {
      speed = Math.min(speed + 0.5, 20);
      window.scrollBy(0, Math.round(speed));
      gasRaf.current = requestAnimationFrame(step);
    };
    step();
  };
  const releaseGas = () => cancelAnimationFrame(gasRaf.current);

  const scrollToX = (x: number) => {
    window.scrollTo({ top: x, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const jumpTo = useCallback((x: number) => {
    jumpedRef.current = true;
    scrollToX(x);
  }, []);

  const restart = () => {
    restartRef.current = true;
    jumpedRef.current = false;
    setTimeMs(null);
    scrollToX(0);
  };

  const active = activeId ? (track.stations.find((s) => s.id === activeId) ?? null) : null;

  return (
    <>
      <a className="skip-link" href="#cv">
        Przejdź do klasycznego CV
      </a>
      <div className="stage" ref={stageRef} style={{ '--d': 0, '--p': 0, '--mp': 0 } as CSSProperties}>
        <div className="sky sky--day" />
        <div className="sky sky--sunset" />
        <div className="sky sky--night" />
        <div className="sun" />
        <div className="moon" />
        <div className="layer layer--skyline" style={{ backgroundImage: skylineTile }} />
        <div className="sea" />
        <div className="layer layer--ships" style={{ backgroundImage: shipsTile }} />
        <div className="tint tint--far" />
        <div className="ground" />
        <World track={track} collected={collected} />
        <div className="tint tint--near" />
        <Lights track={track} />
        <Car ref={carRef} />

        {started && (
          <>
            <Hud track={track} collected={collected} speedRef={speedRef} onJump={jumpTo} onClassic={goClassic} />
            <StationCard station={active} />
            {!moved && (
              <div className="hint" aria-hidden="true">
                <span className="hint__hand">👆</span>
                <span className="hint__touch">Przesuń palcem w górę, żeby jechać</span>
                <span className="hint__mouse">Przewijaj albo trzymaj →, żeby jechać</span>
              </div>
            )}
            <button
              type="button"
              className="gas"
              aria-label="Gaz, przytrzymaj, żeby jechać"
              onPointerDown={pressGas}
              onPointerUp={releaseGas}
              onPointerCancel={releaseGas}
              onLostPointerCapture={releaseGas}
              onContextMenu={(e) => e.preventDefault()}
            >
              Gaz
            </button>
            {toast && (
              <div className="toast" role="status">
                <small>Osiągnięcie</small>
                {toast}
              </div>
            )}
            {atFinish && !dismissed && (
              <FinishPanel
                timeMs={timeMs}
                collected={collected}
                totalTokens={track.tokens.length}
                visited={visited.size}
                totalPitstops={track.pitstopCount}
                unlocked={unlocked}
                onClose={() => setDismissed(true)}
                onRestart={restart}
                onClassic={goClassic}
              />
            )}
          </>
        )}

        {!started && <Intro onStart={() => setStarted(true)} />}
      </div>
      <div className="runway" style={{ height: `calc(${track.finishX}px + 100vh)` }} aria-hidden="true" />
    </>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="intro">
      <div className="intro__card">
        <p className="intro__hello">Cześć! To portfolio w formie krótkiej przejażdżki.</p>
        <h1 className="intro__name">{profile.name}</h1>
        <p className="intro__role">Frontend developer (React, TypeScript, Next.js) {profile.locationFrom}</p>
        <div className="intro__actions">
          <button type="button" className="btn btn--primary btn--big" onClick={onStart}>
            <span>🏎️ Ruszamy</span>
            <small>około minuty</small>
          </button>
          <button type="button" className="btn btn--big" onClick={goClassic}>
            <span>📄 Wersja klasyczna</span>
            <small>zwykłe CV, bez gry</small>
          </button>
        </div>
        <p className="intro__how">
          Przewijaj stronę albo przytrzymaj gaz. Mapa u góry przenosi od razu do wybranej sekcji.
        </p>
      </div>
    </div>
  );
}
