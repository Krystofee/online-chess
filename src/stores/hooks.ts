import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState<Coord>({ x: window.innerWidth, y: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ x: window.innerWidth, y: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return size;
}
