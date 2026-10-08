// Single source of truth for both the game and the classic view.

export type Link = { label: string; href: string };

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  place: string;
  current?: boolean;
  highlights: string[];
  stack: string[];
  links?: Link[];
};

export type Project = {
  id: string;
  title: string;
  kind: string;
  description: string;
  stack: string[];
  links: Link[];
};

export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
};

export const profile = {
  name: 'Bartosz Czyżewski',
  firstName: 'Bartosz',
  role: 'Frontend Developer',
  location: 'Gdańsk',
  locationFrom: 'z Gdańska',
  summary:
    'Frontend developer z ponad 5 latami komercyjnego doświadczenia w React i TypeScript. Od maja 2025 rozwijam aplikacje w Next.js w Salesbook. Piszę czysty, łatwy w utrzymaniu kod, buduję reużywalne komponenty i chętnie dzielę się wiedzą w zespole.',
  education: [
    {
      school: 'Uniwersytet WSB Merito, Gdańsk',
      degree: 'Informatyka, specjalizacja sztuczna inteligencja (studia licencjackie)',
      period: 'od 2024',
    },
  ],
  certificates: [{ title: 'Junior Front-end Developer, infoShare Academy', period: '2021' }],
  languages: ['Angielski B2'],
  interests: 'Gry planszowe i fotografia analogowa.',
  contact: {
    email: 'bart301194@gmail.com',
    linkedin: 'https://www.linkedin.com/in/bartosz-czyzewski',
    github: 'https://github.com/Bartz94',
  },
};

// Chronological order: the road drives from the past to today.
export const experience: Experience[] = [
  {
    id: 'lex',
    company: 'LEX Secure 24h',
    role: 'Junior Frontend Developer',
    period: '06.2021 – 06.2022',
    place: 'Gdynia',
    highlights: [
      'Rozwijałem aplikację w React i budowałem reużywalne komponenty.',
      'Zaprojektowałem i zbudowałem moduł faktur.',
      'Integrowałem front z API i projektowałem wygląd aplikacji.',
    ],
    stack: ['React', 'JavaScript', 'REST'],
  },
  {
    id: 'conradmind',
    company: 'ConradMind',
    role: 'Frontend Developer',
    period: '07.2022 – 05.2024',
    place: 'Zdalnie',
    highlights: [
      'Współtworzyłem 3 projekty komercyjne, od makiet w Figmie po responsywny UI.',
      'Przebudowałem aplikację na custom hooki, co przyspieszyło jej ładowanie.',
      'Pisałem testy automatyczne i robiłem code review.',
    ],
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Jest', 'Figma'],
    links: [{ label: 'Film z aplikacji', href: 'https://www.youtube.com/watch?v=wZa8th9RYYE' }],
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Web Developer',
    period: 'od 06.2024',
    place: 'Gdańsk',
    highlights: [
      'Projektuję, wdrażam i utrzymuję strony firmowe oparte na CMS.',
      'Odpowiadam za hosting, aktualizacje, bezpieczeństwo i optymalizację.',
    ],
    stack: ['WordPress', 'CMS', 'Hosting'],
  },
  {
    id: 'salesbook',
    company: 'Salesbook',
    role: 'Frontend Developer',
    period: 'od 05.2025',
    place: 'Gdańsk',
    current: true,
    // TODO: add concrete Salesbook projects and achievements.
    highlights: ['Rozwijam wiele projektów w Next.js i React.'],
    stack: ['Next.js', 'React', 'TypeScript'],
  },
];

// TODO: replace generic descriptions with real project details.
export const projects: Project[] = [
  {
    id: 'accompanyinghr',
    title: 'Accompanying HR',
    kind: 'Strona firmowa',
    description: 'Strona na CMS, którą zaprojektowałem, wdrożyłem i dalej utrzymuję: hosting, aktualizacje i nowe funkcje.',
    stack: ['CMS', 'Hosting'],
    links: [{ label: 'Zobacz stronę', href: 'https://accompanyinghr.pl/' }],
  },
  {
    id: 'dawidex',
    title: 'Dawidex',
    kind: 'Strona firmowa',
    description: 'Strona firmowa na CMS. Odpowiadam za wygląd, wdrożenie, optymalizację i bieżące utrzymanie.',
    stack: ['CMS', 'Optymalizacja'],
    links: [{ label: 'Zobacz stronę', href: 'http://dawidex.com.pl/' }],
  },
  {
    id: 'backpackersi',
    title: 'Backpackersi',
    kind: 'Strona podróżnicza',
    description: 'Strona na CMS zbudowana od zera: projekt, wdrożenie i hosting.',
    stack: ['CMS'],
    links: [{ label: 'Zobacz stronę', href: 'https://backpackersi.pl/' }],
  },
  {
    id: 'conradmind-app',
    title: 'Aplikacja ConradMind',
    kind: 'Projekt komercyjny',
    description: 'Jedna z trzech aplikacji, przy których pracowałem w ConradMind. Film pokazuje, jak działa.',
    stack: ['React', 'TypeScript'],
    links: [{ label: 'Obejrzyj film', href: 'https://www.youtube.com/watch?v=wZa8th9RYYE' }],
  },
  {
    id: 'github',
    title: 'Więcej na GitHubie',
    kind: 'Kod',
    description: 'Projekty po godzinach: Next.js z Firebase, aplikacja kursów walut, todo na desktop i inne.',
    stack: ['Next.js', 'Firebase', 'React'],
    links: [{ label: 'Otwórz GitHub', href: 'https://github.com/Bartz94' }],
  },
];

// Skills collected on the road. Keep it short; the rest lives in `extraSkills`.
export const skillGroups: SkillGroup[] = [
  { id: 'core', title: 'Fundament', items: ['TypeScript', 'React', 'Next.js', 'JavaScript'] },
  { id: 'data', title: 'Stan i dane', items: ['Redux Toolkit', 'RTK Query', 'React Query', 'GraphQL', 'REST'] },
  { id: 'ui', title: 'UI', items: ['Tailwind', 'shadcn/ui', 'Material UI', 'styled-components'] },
  { id: 'forms', title: 'Formularze', items: ['Formik', 'Zod', 'Yup'] },
  { id: 'tests', title: 'Testy', items: ['Jest', 'Testing Library'] },
  { id: 'tools', title: 'Narzędzia', items: ['Node.js', 'Firebase', 'Docker', 'Git', 'Figma'] },
];

export const extraSkills = [
  'HTML',
  'CSS',
  'Axios',
  'Chakra UI',
  'Bootstrap',
  'Express',
  'MongoDB',
  'WordPress',
  'GitLab',
  'Python',
];
