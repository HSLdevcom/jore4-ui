import { useEffect, useState } from 'react';

export function useJustMovedAnimation() {
  const [justMoved, setJustMoved] = useState(false);

  useEffect(() => {
    if (!justMoved) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setJustMoved(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [justMoved]);

  return { justMoved, markJustMoved: () => setJustMoved(true) };
}
