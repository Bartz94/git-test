import { experience, profile, projects, skillGroups, type Experience, type Link, type Project } from '../content';

export type SectionId = 'start' | 'skills' | 'career' | 'projects' | 'finish';

export type CardData = {
  badge: string;
  title: string;
  subtitle?: string;
  meta?: string;
  body?: string;
  bullets?: string[];
  tags?: string[];
  links?: Link[];
};

type StationBase = { id: string; x: number; card: CardData };

export type Station =
  | (StationBase & { kind: 'garage' })
  | (StationBase & { kind: 'town'; experience: Experience; index: number })
  | (StationBase & { kind: 'pitstop'; project: Project });

export type Billboard = { id: string; x: number; title: string; count: number };
export type Token = { id: string; x: number; label: string; row: 0 | 1 };
export type Section = { id: SectionId; label: string; icon: string; x: number };

export type Track = {
  stations: Station[];
  billboards: Billboard[];
  tokens: Token[];
  sections: Section[];
  lamps: number[];
  finishX: number;
  pitstopCount: number;
};

// Distance (in px of scroll) around a station where its card is shown.
// Asymmetric: on phones only ~100px behind the car is visible.
export const ZONE_BEFORE = 280;
export const ZONE_AFTER = 170;

export function buildTrack(): Track {
  const stations: Station[] = [];
  const billboards: Billboard[] = [];
  const tokens: Token[] = [];
  const sections: Section[] = [];

  sections.push({ id: 'start', label: 'Start', icon: '🏠', x: 0 });
  stations.push({
    kind: 'garage',
    id: 'about',
    x: 0,
    card: {
      badge: 'Start',
      title: `Cześć, jestem ${profile.firstName}`,
      subtitle: `${profile.role}, ${profile.location}`,
      body: profile.summary,
      tags: ['React', 'TypeScript', 'Next.js'],
    },
  });

  let x = 700;
  sections.push({ id: 'skills', label: 'Skille', icon: '⚡', x: x - 160 });
  for (const group of skillGroups) {
    billboards.push({ id: group.id, x, title: group.title, count: group.items.length });
    x += 150;
    group.items.forEach((label, i) => {
      tokens.push({ id: `${group.id}-${i}`, x, label, row: (i % 2) as 0 | 1 });
      x += 92;
    });
    x += 110;
  }

  x += 380;
  sections.push({ id: 'career', label: 'Kariera', icon: '🏙️', x: x - 260 });
  experience.forEach((exp, index) => {
    stations.push({
      kind: 'town',
      id: exp.id,
      x,
      experience: exp,
      index,
      card: {
        badge: exp.current ? 'Kariera, teraz' : 'Kariera',
        title: exp.company,
        subtitle: exp.role,
        meta: `${exp.period}, ${exp.place}`,
        bullets: exp.highlights,
        tags: exp.stack,
        links: exp.links,
      },
    });
    x += 900;
  });

  sections.push({ id: 'projects', label: 'Projekty', icon: '🔧', x: x - 260 });
  for (const project of projects) {
    stations.push({
      kind: 'pitstop',
      id: project.id,
      x,
      project,
      card: {
        badge: 'Pit-stop',
        title: project.title,
        subtitle: project.kind,
        body: project.description,
        tags: project.stack,
        links: project.links,
      },
    });
    x += 860;
  }

  const finishX = x;
  sections.push({ id: 'finish', label: 'Meta', icon: '🏁', x: finishX });

  const lamps: number[] = [];
  for (let lx = 360; lx < finishX + 900; lx += 540) lamps.push(lx);

  return {
    stations,
    billboards,
    tokens,
    sections,
    lamps,
    finishX,
    pitstopCount: projects.length,
  };
}

export function findActiveStation(track: Track, d: number): Station | null {
  for (const s of track.stations) {
    if (d >= s.x - ZONE_BEFORE && d <= s.x + ZONE_AFTER) return s;
  }
  return null;
}
