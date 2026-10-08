import { useEffect, useState } from 'react';
import { Classic } from './Classic';
import { Game } from './game/Game';

type Mode = 'game' | 'classic';

const readMode = (): Mode => (window.location.hash === '#cv' ? 'classic' : 'game');

export function App() {
  const [mode, setMode] = useState<Mode>(readMode);

  useEffect(() => {
    const onHash = () => setMode(readMode());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return mode === 'classic' ? <Classic /> : <Game />;
}
