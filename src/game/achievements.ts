export type AchievementId = 'collector' | 'mechanic' | 'finish' | 'speedrun';

export const SPEEDRUN_SECONDS = 30;

// Time (ms) a pit-stop card has to stay on screen to count as a visit.
export const PITSTOP_VISIT_MS = 1500;

export const ACHIEVEMENTS: { id: AchievementId; icon: string; title: string; description: string }[] = [
  { id: 'collector', icon: '⚡', title: 'Kolekcjoner', description: 'Wszystkie technologie zebrane' },
  { id: 'mechanic', icon: '🔧', title: 'Mechanik', description: 'Postój na każdym pit-stopie' },
  { id: 'finish', icon: '🏁', title: 'Na mecie', description: 'Cała trasa przejechana' },
  { id: 'speedrun', icon: '⏱️', title: 'Speedrun', description: `Meta w mniej niż ${SPEEDRUN_SECONDS} s` },
];

export const formatTime = (ms: number) => {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};
